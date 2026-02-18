import { jsPDF } from 'jspdf';
import katex from 'katex';
import { toPng } from 'html-to-image';

// Robustly strip LaTeX commands but preserve text content
const stripLatexSyntax = (text: string): string => {
    let clean = text;

    // 1. Remove specific "VOID" commands content entirely (including arguments)
    // capture \cmd{arg} and replace with empty string
    clean = clean.replace(/\\vspace\{.*?\}/g, '');
    clean = clean.replace(/\\hspace\{.*?\}/g, '');
    clean = clean.replace(/\\rule\{.*?\}\{.*?\}/g, ''); // rule takes 2 args sometimes

    // 2. Remove standalone commands that have no visual text impact
    clean = clean
        .replace(/\\centering/g, '')
        .replace(/\\raggedright/g, '')
        .replace(/\\raggedleft/g, '')
        .replace(/\\noindent/g, '')
        .replace(/\\newpage/g, '')
        .replace(/\\maketitle/g, '')
        .replace(/\\tableofcontents/g, '')
        .replace(/\\begin\{.*?\}/g, '')
        .replace(/\\end\{.*?\}/g, '');

    // 3. Handle structure commands like \question, \part (Exam class)
    // Replace \question[10] or \question with a bullet
    clean = clean.replace(/\\question(\[.*?\])?/g, '• ');
    clean = clean.replace(/\\part(\[.*?\])?/g, '- ');
    clean = clean.replace(/\\item(\[.*?\])?/g, '• ');

    // 4. Unwrap formatting commands: \cmd{text} -> text
    // let prev;
    const commandRegex = /\\[a-zA-Z]+\{([^{}]*)\}/g;
    for (let i = 0; i < 3; i++) {
        clean = clean.replace(commandRegex, '$1');
    }

    // 5. Cleanup Optional Arguments [...] that might remain if not handled above
    // Only if they look like [number] or [dimension]? 
    // Or just generally strip [ ] if they appear to be metadata?
    // Let's be aggressive for this parser since it's a "simple text view".
    // clean = clean.replace(/\[.*?\]/g, ''); // Too aggressive? User might write "The range is [0, 1]".
    // Only strip [ ] if it follows directly a known pattern or is at start?
    // Let's rely on the specific \question replacements above for now.
    // But the screenshot showed "5.5in" which was inside \vspace{5.5in}. We handled that in step 1.
    // It also showed "[10]" which was likely \question[10]. Handled in step 3.

    // 6. Remove any remaining commands \cmd
    clean = clean.replace(/\\([a-zA-Z]+)/g, '');

    // 7. Cleanup escaped chars
    clean = clean
        .replace(/\\%/g, '%')
        .replace(/\\&/g, '&')
        .replace(/\\_/g, '_')
        .replace(/\\#/g, '#')
        .replace(/\\\{/g, '{')
        .replace(/\\\}/g, '}');

    // 8. Cleanup leftover braces
    clean = clean.replace(/[{}]/g, '');

    return clean.trim();
};

export const generatePdfFromLatex = async (latexCode: string, filename: string) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const MARGIN = 20;
    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;
    const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
    const LINE_HEIGHT_FACTOR = 1.15;

    let cursorX = MARGIN;
    let cursorY = MARGIN;

    const checkPageBreak = (heightNeeded: number) => {
        if (cursorY + heightNeeded > PAGE_HEIGHT - MARGIN) {
            doc.addPage();
            cursorY = MARGIN;
            return true;
        }
        return false;
    };

    const renderTextLine = (text: string, fontSize: number, isBoldArg: boolean = false) => {
        const cleanText = stripLatexSyntax(text);
        if (!cleanText) return;

        doc.setFontSize(fontSize);

        const lineHeight = (fontSize * 0.3527) * LINE_HEIGHT_FACTOR;
        checkPageBreak(lineHeight);

        let currentX = cursorX;

        if (isBoldArg) doc.setFont('helvetica', 'bold');
        else doc.setFont('helvetica', 'normal');

        const lines = doc.splitTextToSize(cleanText, CONTENT_WIDTH);

        lines.forEach((lineStr: string) => {
            checkPageBreak(lineHeight);
            doc.text(lineStr, currentX, cursorY + (fontSize * 0.3527));
            cursorY += lineHeight;
        });
    };

    const renderMath = async (latex: string, isDisplayMode: boolean) => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.zIndex = '-9999';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';

        container.style.width = 'max-content';
        container.style.height = 'auto';
        container.style.whiteSpace = 'nowrap';
        container.style.padding = '8px';
        container.style.backgroundColor = 'white';
        container.style.color = 'black';

        const inner = document.createElement('div');
        if (isDisplayMode) {
            inner.style.fontSize = '22px';
        } else {
            inner.style.fontSize = '16px';
        }

        container.appendChild(inner);
        document.body.appendChild(container);

        try {
            katex.render(latex, inner, {
                displayMode: isDisplayMode,
                throwOnError: false,
                output: 'html',
                globalGroup: true
            });

            await new Promise(r => setTimeout(r, 50));

            const dataUrl = await toPng(container, {
                quality: 1.0,
                pixelRatio: 3,
                backgroundColor: '#ffffff',
                skipFonts: true,
                style: { opacity: '1' }
            });

            const img = new Image();
            img.src = dataUrl;
            await new Promise((resolve) => { img.onload = resolve; });

            const scaleFactor = 0.26458 / 3;
            const imgWidth = img.width * scaleFactor;
            const imgHeight = img.height * scaleFactor;

            checkPageBreak(imgHeight);

            let x = cursorX;
            if (isDisplayMode) {
                if (imgWidth < CONTENT_WIDTH) {
                    x = (PAGE_WIDTH - imgWidth) / 2;
                } else {
                    x = MARGIN;
                }
            }

            let finalWidth = imgWidth;
            let finalHeight = imgHeight;
            if (finalWidth > CONTENT_WIDTH) {
                const ratio = CONTENT_WIDTH / finalWidth;
                finalWidth = CONTENT_WIDTH;
                finalHeight = finalHeight * ratio;
            }

            doc.addImage(dataUrl, 'PNG', x, cursorY, finalWidth, finalHeight);
            cursorY += finalHeight + 2;

        } catch (e) {
            console.error("Math failed:", e);
            renderTextLine(`[Equation: ${latex}]`, 12);
        } finally {
            document.body.removeChild(container);
        }
    };

    // --- PARSER ---
    const lines = latexCode.split(/\r?\n/);
    let inDocument = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.length === 0) {
            if (inDocument) cursorY += 2;
            continue;
        }

        if (line.includes('\\begin{document}')) {
            inDocument = true;
            continue;
        }
        if (line.includes('\\end{document}')) {
            inDocument = false;
            break;
        }
        if (!inDocument) continue;
        if (line.startsWith('%')) continue;

        if (line.startsWith('$$') && line.endsWith('$$')) {
            const latex = line.slice(2, -2);
            await renderMath(latex, true);
            continue;
        }
        if (line.startsWith('\\[') && line.endsWith('\\]')) {
            const latex = line.slice(2, -2);
            await renderMath(latex, true);
            continue;
        }

        if (line.startsWith('\\newpage')) {
            doc.addPage();
            cursorY = MARGIN;
            continue;
        }

        const sectionMatch = line.match(/^\\section\{(.+?)\}/);
        if (sectionMatch) {
            cursorY += 5;
            renderTextLine(sectionMatch[1], 18, true);
            cursorY += 3;
            continue;
        }
        const subMatch = line.match(/^\\subsection\{(.+?)\}/);
        if (subMatch) {
            cursorY += 4;
            renderTextLine(subMatch[1], 16, true);
            cursorY += 2;
            continue;
        }

        renderTextLine(line, 12, false);
    }

    doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
};
