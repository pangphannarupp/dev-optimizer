import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, Camera, FileText, Code, Link as LinkIcon,
    Maximize, Minimize, ChevronUp, ChevronDown, Undo, Redo, Eye, Columns, FileType,
    Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, AlignLeft,
    AlignCenter, AlignRight, Heading1, Heading2, Heading3, Search, X, Loader2
} from 'lucide-react';
// import { jsPDF } from 'jspdf';
// import { toPng } from 'html-to-image';

import { MathSymbolPalette } from './math/MathSymbolPalette';
import { MathOCRModal } from './math/MathOCRModal';
import { TemplateSelectorModal } from './modals/TemplateSelectorModal';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { LatexRenderer } from './LatexRenderer';
import { BookOpen } from 'lucide-react';

const DEFAULT_DOC = `\\documentclass{article}
\\title{My LaTeX Document}
\\author{Author Name}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Introduction}
Start typing your LaTeX code here...

\\subsection{Math Example}
The quadratic formula is:
$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$

\\end{document}`;

export const ExamEditor = () => {
    const navigate = useNavigate();

    // -- State --
    const [code, setCode] = useState(() => localStorage.getItem('latex_code') || DEFAULT_DOC);
    const [filename, setFilename] = useState(() => localStorage.getItem('latex_filename') || 'New Document.tex');
    const [showOCR, setShowOCR] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFind, setShowFind] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const [findMatchIndex, setFindMatchIndex] = useState(-1);
    const [findMatches, setFindMatches] = useState<number[]>([]);

    // -- Modal State --
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState('');

    // -- Auto-Save --
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem('latex_code', code);
            localStorage.setItem('latex_filename', filename);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [code, filename]);

    // -- Find Logic --
    useEffect(() => {
        if (!searchTerm) {
            setFindMatches([]);
            setFindMatchIndex(-1);
            return;
        }
        const matches: number[] = [];
        let pos = code.indexOf(searchTerm);
        while (pos !== -1) {
            matches.push(pos);
            pos = code.indexOf(searchTerm, pos + 1);
        }
        setFindMatches(matches);
        if (matches.length > 0) {
            setFindMatchIndex(0);
            highlightMatch(matches[0]);
        } else {
            setFindMatchIndex(-1);
        }
    }, [searchTerm, code]);

    const highlightMatch = (index: number) => {
        if (editorRef.current && index !== -1) {
            editorRef.current.focus();
            editorRef.current.setSelectionRange(index, index + searchTerm.length);
            // Scroll to selection
            const lineHeight = 20; // Approx
            const lines = code.substring(0, index).split('\n').length;
            editorRef.current.scrollTop = (lines - 5) * lineHeight;
        }
    };

    const findNext = () => {
        if (findMatches.length === 0) return;
        const nextIndex = (findMatchIndex + 1) % findMatches.length;
        setFindMatchIndex(nextIndex);
        highlightMatch(findMatches[nextIndex]);
    };

    const findPrev = () => {
        if (findMatches.length === 0) return;
        const prevIndex = (findMatchIndex - 1 + findMatches.length) % findMatches.length;
        setFindMatchIndex(prevIndex);
        highlightMatch(findMatches[prevIndex]);
    };

    // Editor Appearance & Layout
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('font-serif');
    const [activeTab, setActiveTab] = useState<'Home' | 'Insert' | 'View'>('Home');
    const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'split' | 'code' | 'preview'>('split');
    const [isFullScreen, setIsFullScreen] = useState(false);

    // History for Undo/Redo
    const [history, setHistory] = useState<string[]>([DEFAULT_DOC]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const editorRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // -- History Management --
    const updateCode = (newCode: string) => {
        setCode(newCode);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newCode);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const wordCount = code.trim().split(/\s+/).filter(w => w.length > 0).length;

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setCode(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setCode(history[historyIndex + 1]);
        }
    };

    // -- Full Screen --
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    // -- Editor Operations --
    const insertAtCursor = (textToInsert: string, selectionOffset = 0) => {
        if (editorRef.current) {
            const start = editorRef.current.selectionStart;
            const end = editorRef.current.selectionEnd;
            const text = code;
            const newText = text.substring(0, start) + textToInsert + text.substring(end);
            updateCode(newText);

            setTimeout(() => {
                editorRef.current?.focus();
                const newCursorPos = start + textToInsert.length + selectionOffset;
                editorRef.current?.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        } else {
            updateCode(code + textToInsert);
        }
    };

    const wrapSelection = (before: string, after: string) => {
        if (editorRef.current) {
            const start = editorRef.current.selectionStart;
            const end = editorRef.current.selectionEnd;
            const text = code;
            const selectedText = text.substring(start, end);
            const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
            updateCode(newText);

            setTimeout(() => {
                editorRef.current?.focus();
                editorRef.current?.setSelectionRange(start + before.length, end + before.length);
            }, 0);
        }
    };

    // -- Formatting Tools --
    const formatBold = () => wrapSelection('\\textbf{', '}');
    const formatItalic = () => wrapSelection('\\textit{', '}');
    const formatUnderline = () => wrapSelection('\\underline{', '}');
    const formatStrikethrough = () => wrapSelection('\\sout{', '}');
    const formatMono = () => wrapSelection('\\texttt{', '}');

    const formatH1 = () => insertAtCursor('\n\\section{Title}\n', -6);
    const formatH2 = () => insertAtCursor('\n\\subsection{Subtitle}\n', -9);
    const formatH3 = () => insertAtCursor('\n\\subsubsection{Header}\n', -7);

    const insertList = (type: 'itemize' | 'enumerate') => {
        const item = type === 'itemize' ? '\\item ' : '\\item ';
        insertAtCursor(`\n\\begin{${type}}\n  ${item}First item\n  ${item}Second item\n\\end{${type}}\n`);
    };

    const insertCodeBlock = () => insertAtCursor('\n\\begin{verbatim}\nCode here\n\\end{verbatim}\n');
    const insertQuote = () => insertAtCursor('\n\\begin{quote}\nQuote here\n\\end{quote}\n');
    const insertLink = () => insertAtCursor('\\href{url}{text}', -6);

    // -- Templates --
    const insertTable = () => insertAtCursor(`
\\begin{table}[h]
    \\centering
    \\begin{tabular}{|c|c|}
        \\hline
        Header 1 & Header 2 \\\\
        \\hline
        Cell 1 & Cell 2 \\\\
        \\hline
    \\end{tabular}
    \\caption{Caption}
    \\label{tab:my_label}
\\end{table}
`);

    const insertFigure = () => insertAtCursor(`
\\begin{figure}[h]
    \\centering
    \\includegraphics[width=0.5\\textwidth]{image.png}
    \\caption{Caption}
    \\label{fig:my_label}
\\end{figure}
`);

    const handleOCRInsert = (latex: string) => insertAtCursor(latex);

    const handleTemplateSelect = (templateCode: string) => {
        setPendingTemplate(templateCode);
        setShowTemplateModal(false); // Close selector first
        setShowConfirmModal(true);   // Open confirmation
    };

    const confirmTemplateSwitch = () => {
        if (pendingTemplate) {
            updateCode(pendingTemplate);
            setHistory([pendingTemplate]);
            setHistoryIndex(0);
            setPendingTemplate('');
        }
    };
    const handleSymbolInsert = (latex: string) => insertAtCursor(latex);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFilename(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') updateCode(text);
            };
            reader.readAsText(file);
        }
    };

    const exportTex = () => {
        const blob = new Blob([code], { type: 'application/x-tex' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.tex') ? filename : `${filename}.tex`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportPDF = async () => {
        setIsExporting(true);
        try {
            // Dynamic import to avoid circular dependency issues or load time
            const { generatePdfFromLatex } = await import('../utils/LatexParser');
            await generatePdfFromLatex(code, filename);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div ref={containerRef} className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 override-styles text-gray-900 dark:text-gray-100">
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".tex,.latex,.txt"
                className="hidden"
            />

            {/* --- Professional Ribbon --- */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-col shadow-sm z-10 shrink-0 select-none transition-all duration-300">

                {/* 1. Title Bar */}
                <div className="flex items-center justify-between px-3 py-1 bg-blue-600/5 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors">
                            <ArrowLeft size={16} />
                        </button>

                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded px-1 -ml-1 focus:outline-none focus:border-blue-500 w-48 transition-colors"
                        />

                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                        <div className="flex items-center gap-0.5">
                            <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Undo size={14} />
                            </button>
                            <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Redo size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-[10px] text-gray-400">Autosaved</div>
                        <button
                            onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
                            className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ml-2"
                            title={isRibbonCollapsed ? "Expand Ribbon" : "Collapse Ribbon"}
                        >
                            {isRibbonCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                    </div>
                </div>

                {/* 2. Ribbon Tabs */}
                <div className="px-2 pt-1 flex gap-1 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/30">
                    {['Home', 'Insert', 'View'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab as any);
                                if (isRibbonCollapsed) setIsRibbonCollapsed(false);
                            }}
                            className={`px-4 py-1.5 text-xs font-medium rounded-t-lg transition-colors relative top-[1px] ${activeTab === tab && !isRibbonCollapsed
                                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700 border-b-white dark:border-b-gray-800'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 3. Ribbon Tools Area (Collapsible) */}
                {!isRibbonCollapsed && (
                    <div className="p-2 h-40 flex gap-2 overflow-x-auto scrollbar-hide bg-white dark:bg-gray-800 animate-in slide-in-from-top-2 duration-200">

                        {/* HOME TAB */}
                        {activeTab === 'Home' && (
                            <>
                                <RibbonGroup label="File">
                                    <RibbonButton icon={<FileText size={18} />} label="Import" onClick={() => fileInputRef.current?.click()} />
                                    <RibbonButton
                                        icon={isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                        label={isExporting ? "Exporting..." : "Export"}
                                        onClick={exportPDF}
                                    />
                                    <RibbonButton icon={<Code size={18} />} label="Save .tex" onClick={exportTex} />
                                </RibbonGroup>

                                <RibbonGroup label="Font">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex gap-1">
                                            <select
                                                value={fontFamily}
                                                onChange={(e) => setFontFamily(e.target.value)}
                                                className="h-6 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 w-24 outline-none"
                                            >
                                                <option value="font-serif">Serif</option>
                                                <option value="font-sans">Sans</option>
                                                <option value="font-mono">Mono</option>
                                            </select>
                                            <input
                                                type="number"
                                                value={fontSize}
                                                onChange={(e) => setFontSize(Number(e.target.value))}
                                                className="h-6 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 w-12 text-center outline-none"
                                                min="8" max="72"
                                            />
                                        </div>
                                        <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-700/50 p-0.5 rounded">
                                            <FormatButton icon={<Bold size={14} />} onClick={formatBold} active={false} title="Bold" />
                                            <FormatButton icon={<Italic size={14} />} onClick={formatItalic} active={false} title="Italic" />
                                            <FormatButton icon={<Underline size={14} />} onClick={formatUnderline} active={false} title="Underline" />
                                            <FormatButton icon={<Strikethrough size={14} />} onClick={formatStrikethrough} active={false} title="Strikethrough" />
                                        </div>
                                    </div>
                                </RibbonGroup>

                                <RibbonGroup label="Paragraph">
                                    <div className="grid grid-cols-3 gap-1">
                                        <FormatButton icon={<List size={14} />} onClick={() => insertList('itemize')} title="Bullet List" />
                                        <FormatButton icon={<ListOrdered size={14} />} onClick={() => insertList('enumerate')} title="Numbered List" />
                                        <FormatButton icon={<Quote size={14} />} onClick={insertQuote} title="Blockquote" />
                                        <FormatButton icon={<AlignLeft size={14} />} onClick={() => { }} title="Align Left" />
                                        <FormatButton icon={<AlignCenter size={14} />} onClick={() => { }} title="Align Center" />
                                        <FormatButton icon={<AlignRight size={14} />} onClick={() => { }} title="Align Right" />
                                    </div>
                                </RibbonGroup>

                                <RibbonGroup label="Styles">
                                    <div className="flex flex-col gap-1">
                                        <button onClick={formatH1} className="flex items-center gap-2 text-left px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs font-bold">
                                            <Heading1 size={14} /> Heading 1
                                        </button>
                                        <button onClick={formatH2} className="flex items-center gap-2 text-left px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs font-semibold">
                                            <Heading2 size={14} /> Heading 2
                                        </button>
                                        <button onClick={formatH3} className="flex items-center gap-2 text-left px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs">
                                            <Heading3 size={14} /> Heading 3
                                        </button>
                                    </div>
                                </RibbonGroup>

                                <RibbonGroup label="Editing">
                                    <RibbonButton
                                        icon={<Search size={18} />}
                                        label="Find"
                                        onClick={() => setShowFind(!showFind)}
                                        active={showFind}
                                    />
                                </RibbonGroup>
                            </>
                        )}

                        {/* INSERT TAB */}
                        {activeTab === 'Insert' && (
                            <>
                                <RibbonGroup label="Media">
                                    <RibbonButton icon={<Camera size={18} />} label="Scan OCR" onClick={() => setShowOCR(true)} />
                                </RibbonGroup>
                                <RibbonGroup label="Templates">
                                    <RibbonButton icon={<BookOpen size={18} />} label="Browse" onClick={() => setShowTemplateModal(true)} />
                                    <RibbonButton icon={<FileType size={18} />} label="Table" onClick={insertTable} />
                                    <RibbonButton icon={<FileType size={18} />} label="Figure" onClick={insertFigure} />
                                </RibbonGroup>
                                <RibbonGroup label="Code">
                                    <RibbonButton icon={<Code size={18} />} label="Code Block" onClick={insertCodeBlock} />
                                    <RibbonButton icon={<FileText size={18} />} label="Inline Code" onClick={formatMono} />
                                </RibbonGroup>
                                <RibbonGroup label="Links">
                                    <RibbonButton icon={<LinkIcon size={18} />} label="Link" onClick={insertLink} />
                                    <RibbonButton icon={<Columns size={18} />} label="Page Break" onClick={() => insertAtCursor('\n\\newpage\n')} />
                                </RibbonGroup>
                                <div className="flex flex-col border-r border-gray-200 dark:border-gray-700 pr-2 mr-2 min-w-[300px]">
                                    <div className="text-[10px] text-gray-400 text-center mb-1">Math Symbols</div>
                                    <div className="h-[120px] w-full overflow-hidden relative">
                                        <MathSymbolPalette onInsert={handleSymbolInsert} className="h-full !bg-transparent" />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* VIEW TAB */}
                        {activeTab === 'View' && (
                            <>
                                <RibbonGroup label="Layout">
                                    <RibbonButton
                                        icon={<Columns size={18} />}
                                        label="Split"
                                        onClick={() => setLayoutMode('split')}
                                        active={layoutMode === 'split'}
                                    />
                                    <RibbonButton
                                        icon={<Code size={18} />}
                                        label="Code Only"
                                        onClick={() => setLayoutMode('code')}
                                        active={layoutMode === 'code'}
                                    />
                                    <RibbonButton
                                        icon={<Eye size={18} />}
                                        label="Preview Only"
                                        onClick={() => setLayoutMode('preview')}
                                        active={layoutMode === 'preview'}
                                    />
                                </RibbonGroup>
                                <RibbonGroup label="Screen">
                                    <RibbonButton
                                        icon={isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                                        label={isFullScreen ? "Exit Full" : "Full Screen"}
                                        onClick={toggleFullScreen}
                                        active={isFullScreen}
                                    />
                                </RibbonGroup>
                                <RibbonGroup label="Zoom">
                                    <RibbonButton icon={<span>100%</span>} label="Reset" onClick={() => setFontSize(16)} />
                                </RibbonGroup>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Main Area */}
            <div className="flex-1 flex min-w-0 overflow-hidden">
                {/* Left: Code Editor */}
                {(layoutMode === 'split' || layoutMode === 'code') && (
                    <div className={`${layoutMode === 'split' ? 'w-1/2 border-r border-gray-200 dark:border-gray-700' : 'w-full'} flex flex-col`}>
                        <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-1 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">LaTeX Source</span>
                            {showFind && (
                                <div className="flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
                                    <span className="text-[10px] text-gray-400 mr-1">
                                        {findMatches.length > 0 ? `${findMatchIndex + 1}/${findMatches.length}` : '0/0'}
                                    </span>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Find..."
                                        className="h-5 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-1 w-24 focus:outline-none focus:border-blue-500"
                                        autoFocus
                                    />
                                    <button onClick={findPrev} disabled={findMatches.length === 0} className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30">
                                        <ChevronUp size={14} />
                                    </button>
                                    <button onClick={findNext} disabled={findMatches.length === 0} className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30">
                                        <ChevronDown size={14} />
                                    </button>
                                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                                    <button onClick={() => { setShowFind(false); setSearchTerm(''); }} className="text-gray-500 hover:text-red-500"><X size={14} /></button>
                                </div>
                            )}
                        </div>
                        <textarea
                            ref={editorRef}
                            value={code}
                            onChange={(e) => updateCode(e.target.value)}
                            onScroll={() => {
                                if (editorRef.current && layoutMode === 'split') {
                                    const preview = document.getElementById('latex-preview');
                                    if (preview) {
                                        const percent = editorRef.current.scrollTop / (editorRef.current.scrollHeight - editorRef.current.clientHeight);
                                        preview.scrollTop = percent * (preview.scrollHeight - preview.clientHeight);
                                    }
                                }
                            }}
                            className="flex-1 p-6 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none leading-relaxed"
                            style={{ fontSize: `${fontSize}px` }}
                            spellCheck={false}
                        />
                    </div>
                )}

                {/* Right: Preview */}
                {(layoutMode === 'split' || layoutMode === 'preview') && (
                    <div className={`${layoutMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col bg-white dark:bg-gray-800 ${fontFamily}`}>
                        <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-1 text-[10px] font-mono text-gray-500 uppercase tracking-wider flex justify-between items-center">
                            <span>Live Preview</span>
                            <span className="opacity-50">KaTeX</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-12 preview-container shadow-inner" id="latex-preview" style={{ fontSize: `${fontSize}px` }}>
                            <LatexRenderer content={code} />
                        </div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-3 py-1 flex justify-between items-center text-[10px] text-gray-500 select-none">
                <div className="flex gap-4">
                    <span>{wordCount} words</span>
                    <span>Line {code.substring(0, code.length).split('\n').length}</span>
                </div>
                <div className="flex gap-4">
                    <span>{layoutMode.toUpperCase()}</span>
                    <span>100%</span>
                </div>
            </div>

            <MathOCRModal
                isOpen={showOCR}
                onClose={() => setShowOCR(false)}
                onInsert={handleOCRInsert}
            />

            <TemplateSelectorModal
                isOpen={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                onSelect={handleTemplateSelect}
            />

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmTemplateSwitch}
                title="Replace Document?"
                message="This action will replace your current document content with the selected template. This cannot be undone if you haven't saved."
                confirmText="Replace"
                isDanger={true}
            />
        </div>
    );
};

// --- Helper Components for Ribbon ---

const RibbonGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-center border-r border-gray-200 dark:border-gray-700 px-3 h-full justify-between pb-1">
        <div className="flex gap-2 items-start">{children}</div>
        <span className="text-[10px] text-gray-400 font-medium mt-auto">{label}</span>
    </div>
);

const RibbonButton = ({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick: () => void, active?: boolean }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 min-w-[50px] p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
    >
        <div className="h-6 flex items-center">{icon}</div>
        <span className="text-[10px] whitespace-nowrap">{label}</span>
    </button>
);

const FormatButton = ({ icon, onClick, title, active }: any) => (
    <button
        onClick={onClick}
        title={title}
        className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${active ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
    >
        {icon}
    </button>
);
