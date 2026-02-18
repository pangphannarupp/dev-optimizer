import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
    content: string;
}

export const LatexRenderer = ({ content }: LatexRendererProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let bodyContent = content;

        // Extract Metadata
        const titleMatch = content.match(/\\title{(.+?)}/);
        const authorMatch = content.match(/\\author{(.+?)}/);
        const dateMatch = content.match(/\\date{(.+?)}/);

        const metadata = {
            title: titleMatch ? titleMatch[1] : 'Document Title',
            author: authorMatch ? authorMatch[1] : 'Author Name',
            date: dateMatch ? (dateMatch[1] === '\\today' ? new Date().toLocaleDateString() : dateMatch[1]) : ''
        };

        // --- PRE-PROCESSING REFERENCES ---
        // Simple citation mock: \cite{key} -> [1]
        let citationCount = 1;
        const citations: Record<string, number> = {};
        bodyContent = bodyContent.replace(/\\cite{(.+?)}/g, (_, key) => {
            if (!citations[key]) citations[key] = citationCount++;
            return `<sup class="text-blue-600 font-bold ml-0.5">[${citations[key]}]</sup>`;
        });

        // More robust extraction of the document body
        const beginDocIndex = content.indexOf('\\begin{document}');
        const endDocIndex = content.lastIndexOf('\\end{document}');

        if (beginDocIndex !== -1 && endDocIndex !== -1 && endDocIndex > beginDocIndex) {
            bodyContent = content.substring(beginDocIndex + '\\begin{document}'.length, endDocIndex);
        } else if (beginDocIndex !== -1) {
            bodyContent = content.substring(beginDocIndex + '\\begin{document}'.length);
        }

        // Basic Cleanup & Formatting Replacements
        bodyContent = bodyContent
            // Metadata Injection
            .replace(/\\maketitle/g, `<div class="text-center my-8 border-b pb-6"><h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">${metadata.title}</h1><p class="text-gray-600 dark:text-gray-400 mt-2 text-lg">${metadata.author}</p><p class="text-gray-500 dark:text-gray-500 text-sm">${metadata.date}</p></div>`)

            // Layout & Boxes
            .replace(/\\begin{center}/g, '<div class="text-center flex flex-col items-center">')
            .replace(/\\end{center}/g, '</div>')
            .replace(/\\begin{multicols\*?}{(\d+)}/g, '<div class="columns-$1 gap-6">')
            .replace(/\\end{multicols\*?}/g, '</div>')
            .replace(/\\fbox{\\fbox{\\parbox{.+?}{(.*?)}}}/gs, '<div class="border-4 double border-gray-300 p-4 my-4 bg-gray-50 dark:bg-gray-800 rounded max-w-2xl mx-auto">$1</div>') // Exam box special case
            .replace(/\\fbox{(.*?)}/g, '<span class="border border-gray-400 p-1 mx-1 rounded inline-block">$1</span>')
            .replace(/\\parbox{.+?}{(.*?)}/g, '<div class="inline-block align-top max-w-full">$1</div>')
            .replace(/\\makebox\[.+?\]{(.*?)}/g, '<div class="w-full flex justify-between border-b-2 border-gray-200 mt-8 mb-4 border-dashed py-1">$1</div>') // Name field

            // Spacing
            .replace(/\\vspace{.+?}/g, '<div class="h-8"></div>')
            .replace(/\\enspace/g, '&nbsp;&nbsp;')
            .replace(/\\hrulefill/g, '<span class="flex-grow border-b border-gray-400 border-dashed mx-2 inline-block"></span>')

            // Lists (Exam Questions)
            .replace(/\\begin{questions}/g, '<ol class="list-decimal pl-6 space-y-8 mt-6">')
            .replace(/\\end{questions}/g, '</ol>')
            .replace(/\\question\[(\d+)\]/g, '<li class="font-bold text-lg mb-2"><span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">($1 points)</span>')
            .replace(/\\question/g, '<li class="font-bold text-lg mb-2">')

            // Theorems & Proofs (Geometry Template)
            .replace(/\\begin{theorem}/g, '<div class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-4 rounded-r"><strong class="text-blue-700 dark:text-blue-300 block mb-2">Theorem</strong>')
            .replace(/\\end{theorem}/g, '</div>')
            .replace(/\\begin{proof}/g, '<div class="italic text-gray-600 dark:text-gray-400 my-4"><strong class="not-italic text-gray-800 dark:text-gray-200">Proof.</strong> ')
            .replace(/\\end{proof}/g, '<span class="float-right font-bold">□</span></div>')

            // TikZ (Placeholder)
            .replace(/\\begin{tikzpicture}[\s\S]*?\\end{tikzpicture}/g, '<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 my-6 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center gap-2"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M13 11l4-4"/><path d="M9 11l-4-4"/></svg><span>TikZ Diagram</span><span class="text-xs opacity-75 no-print">(Requires external compilation)</span></div>')

            // Beamer Slides
            .replace(/\\frame{\\titlepage}/g, '<div class="aspect-video bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-8 flex flex-col items-center justify-center text-center my-8 mx-auto max-w-3xl transform transition-transform hover:scale-[1.01]"><h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Presentation Title</h1><p class="text-xl text-gray-600 dark:text-gray-300">Subtitle Here</p><p class="mt-8 text-gray-500 font-medium">Author Name</p><p class="text-sm text-gray-400">Institute Name • ' + new Date().toLocaleDateString() + '</p></div>')
            .replace(/\\begin{frame}/g, '<div class="aspect-video bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-8 mb-8 mx-auto max-w-3xl flex flex-col relative overflow-hidden group">')
            .replace(/\\end{frame}/g, '<div class="absolute bottom-2 right-4 text-[10px] text-gray-300 dark:text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">SLIDE</div></div>')
            .replace(/\\frametitle{(.+?)}/g, '<h2 class="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">$1</h2>')
            .replace(/\\begin{block}{(.+?)}/g, '<div class="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-r p-4 my-4"><h3 class="font-bold text-blue-700 dark:text-blue-300 text-sm mb-2">$1</h3>')
            .replace(/\\end{block}/g, '</div>')

            // Beamer Coledumns
            .replace(/\\begin{columns}/g, '<div class="grid grid-cols-2 gap-4">')
            .replace(/\\end{columns}/g, '</div>')
            .replace(/\\column{.+}$/gm, '')

            // Research Paper Elements
            .replace(/\\begin{abstract}/g, '<div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg my-8 mx-auto max-w-3xl border-l-4 border-gray-300 dark:border-gray-600"><h3 class="font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide text-xs">Abstract</h3><div class="italic text-gray-600 dark:text-gray-400 leading-relaxed">')
            .replace(/\\end{abstract}/g, '</div></div>')

            // Bibliography
            .replace(/\\begin{thebibliography}{.+}/g, '<div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"><h2 class="text-xl font-bold mb-4">References</h2><ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">')
            .replace(/\\end{thebibliography}/g, '</ul></div>')
            .replace(/\\bibitem{(.+?)}(.+?)(\n|$)/g, '<li class="flex gap-2"><span class="font-mono text-xs text-gray-400">[$1]</span><span>$2</span></li>')

            // Text Styles
            .replace(/\\textbf{(.+?)}/g, '<strong>$1</strong>')
            .replace(/\\textit{(.+?)}/g, '<em>$1</em>')
            .replace(/\\underline{(.+?)}/g, '<u>$1</u>')
            .replace(/\\sout{(.+?)}/g, '<span class="line-through">$1</span>')
            .replace(/\\texttt{(.+?)}/g, '<code class="bg-gray-100 px-1 rounded font-mono text-sm">$1</code>')

            // Structure
            .replace(/\\section\*?{(.+?)}/g, '<h1 class="text-2xl font-bold mt-8 mb-4 border-b border-gray-200 pb-2 text-gray-800 dark:text-gray-200 break-inside-avoid-column">$1</h1>')
            .replace(/\\subsection\*?{(.+?)}/g, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-200 break-inside-avoid-column">$1</h2>')

            // Newlines & spacing
            // We add 'html2pdf__page-break' class which is standard for some libraries, and inline styles for others.
            .replace(/\\newpage/g, '<div class="page-break-marker" style="page-break-after: always; break-after: page; height: 1px; margin: 2rem 0; border-bottom: 2px dashed #e5e7eb;"></div>')
            .replace(/\\\\/g, '<br/>')
            .replace(/\n\n/g, '<div class="h-3"></div>')
            .replace(/\n/g, ' ');

        // Split by $$...$$ (display math) or $...$ (inline math)
        // We use a regex that captures the delimiters so the split results include them
        const parts = bodyContent.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

        containerRef.current.innerHTML = '';

        parts.forEach(part => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                // Display Math
                const tex = part.slice(2, -2);
                const div = document.createElement('div');
                div.className = "my-4 text-center overflow-x-auto";
                try {
                    katex.render(tex, div, { throwOnError: false, displayMode: true });
                    containerRef.current?.appendChild(div);
                } catch (e) {
                    div.textContent = tex; // Fallback
                    containerRef.current?.appendChild(div);
                }
            } else if (part.startsWith('$') && part.endsWith('$')) {
                // Inline Math
                const tex = part.slice(1, -1);
                const span = document.createElement('span');
                try {
                    // Remove newlines in inline math to prevent KaTeX errors
                    katex.render(tex.replace(/\n/g, ' '), span, { throwOnError: false, displayMode: false });
                    containerRef.current?.appendChild(span);
                } catch (e) {
                    span.textContent = tex;
                    containerRef.current?.appendChild(span);
                }
            } else {
                // TEXT CONTENT - Apply basic formatting
                const textDiv = document.createElement('span');
                let processedText = part
                    // Headers
                    .replace(/\\section\*?{(.+?)}/g, '<h1 class="text-2xl font-bold mt-6 mb-4 border-b pb-2">$1</h1>')
                    .replace(/\\subsection\*?{(.+?)}/g, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
                    .replace(/\\subsubsection\*?{(.+?)}/g, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
                    // Text styles
                    .replace(/\\textbf{(.+?)}/g, '<strong>$1</strong>')
                    .replace(/\\textit{(.+?)}/g, '<em>$1</em>')
                    .replace(/\\underline{(.+?)}/g, '<u>$1</u>')
                    .replace(/\\sout{(.+?)}/g, '<span class="line-through">$1</span>')
                    .replace(/\\texttt{(.+?)}/g, '<code class="bg-gray-100 px-1 rounded font-mono text-sm">$1</code>')
                    // Lists (Simulated - not perfect nesting support)
                    .replace(/\\begin{itemize}/g, '<ul class="list-disc pl-5 space-y-1 mb-4">')
                    .replace(/\\end{itemize}/g, '</ul>')
                    .replace(/\\begin{enumerate}/g, '<ol class="list-decimal pl-5 space-y-1 mb-4">')
                    .replace(/\\end{enumerate}/g, '</ol>')
                    .replace(/\\item\s*/g, '<li>')
                    // This simple replace for item might be buggy if not carefully handled, but for 'preview' it's "okay"
                    // A better approach for items is complicated without a parser.
                    // Let's rely on the previous logic which was: .replace(/\\item\\s+(.+?)(\\n|$)/g, '<li>$1</li>')
                    // But that regex assumes items are single lines. 

                    // Let's stick to the previous simple replacements + enhancements
                    .replace(/\\item\s+(.+?)(\n|$)/g, '<li>$1</li>')

                    // Environments (generic)
                    .replace(/\\begin{center}/g, '<div class="text-center">')
                    .replace(/\\end{center}/g, '</div>')
                    .replace(/\\begin{quote}/g, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 italic my-4 text-gray-600">')
                    .replace(/\\end{quote}/g, '</blockquote>')

                    // Exams class specific
                    .replace(/\\begin{questions}/g, '<ol class="list-decimal pl-6 space-y-6">')
                    .replace(/\\end{questions}/g, '</ol>')
                    .replace(/\\question\[(\d+)\]/g, '<li class="font-bold mb-2">($1 points) ')
                    .replace(/\\question/g, '<li class="font-bold mb-2">')

                    // Newlines
                    .replace(/\\\\/g, '<br/>')
                    .replace(/\n\n/g, '<div class="h-4"></div>')
                    .replace(/\n/g, ' ');

                textDiv.innerHTML = processedText;

                // Fix for closing tags not matching if regex was simple replacement
                // This "renderer" is extremely fragile but sufficient for visual preview of simple docs

                containerRef.current?.appendChild(textDiv);
            }
        });

    }, [content]);

    return <div ref={containerRef} className="latex-preview-content" />;
};

