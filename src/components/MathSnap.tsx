import { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toPng, toSvg } from 'html-to-image';
import {
    Copy, FileCode, ArrowLeft, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { MathSymbolPalette } from './math/MathSymbolPalette';
import { MathOCRModal } from './math/MathOCRModal';

export const MathSnap = () => {
    const navigate = useNavigate();
    const [latex, setLatex] = useState('E = mc^2');
    const [fontSize, setFontSize] = useState(32);
    const [color, setColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [transparent, setTransparent] = useState(true);
    const [padding, setPadding] = useState(16);
    const [error, setError] = useState<string | null>(null);

    // OCR State
    const [showOCR, setShowOCR] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            try {
                katex.render(latex, containerRef.current, {
                    throwOnError: false,
                    displayMode: true,
                    output: 'html',
                });
                setError(null);
            } catch (e) {
                console.error(e);
                setError('Invalid LaTeX');
            }
        }
    }, [latex]);

    const insertLatex = (symbol: string) => {
        const textarea = textareaRef.current;
        if (!textarea) {
            setLatex(latex + symbol);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = latex.substring(0, start) + symbol + latex.substring(end);

        setLatex(newText);

        // Restore focus and move cursor after insertion
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + symbol.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleDownload = async (format: 'png' | 'svg') => {
        if (!previewRef.current) return;

        try {
            // Options to ensure better quality and compatibility
            const options = {
                quality: 1.0,
                pixelRatio: 3,
                skipFonts: true, // Bypass font embedding to fix "trim undefined" error
                // html-to-image defaults to white. Use explicit transparent string.
                backgroundColor: transparent ? 'rgba(0,0,0,0)' : bgColor,
                style: {
                    margin: '0', // Reset margin to avoid capture issues
                    boxShadow: 'none', // Remove container shadow from capture
                    borderRadius: '0', // Remove rounded corners from capture
                }
            };

            const dataUrl = format === 'png'
                ? await toPng(previewRef.current, options)
                : await toSvg(previewRef.current, options);

            const link = document.createElement('a');
            link.download = `math-snap-${Date.now()}.${format}`;
            link.href = dataUrl;
            link.click();
        } catch (err: any) {
            console.error('Error generating image', err);
            alert(`Failed to download image: ${err.message || err}`);
        }
    };

    const handleCopy = async () => {
        if (!previewRef.current) return;
        try {
            const dataUrl = await toPng(previewRef.current);
            const blob = await (await fetch(dataUrl)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            // Could add toast here
        } catch (err) {
            console.error('Error copying image', err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full md:hidden">
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FileCode className="text-purple-500" /> Math Snap
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowOCR(true)}
                        className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors shadow-sm"
                    >
                        <Camera size={16} /> Scan Image
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                    >
                        <Copy size={16} /> Copy
                    </button>
                    <div className="flex gap-1 bg-blue-50 dark:bg-blue-900/20 p-1 rounded-md">
                        <button
                            onClick={() => handleDownload('png')}
                            className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-md transition-colors"
                        >
                            PNG
                        </button>
                        <div className="w-px bg-blue-200 dark:bg-blue-800 my-1"></div>
                        <button
                            onClick={() => handleDownload('svg')}
                            className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-md transition-colors"
                        >
                            SVG
                        </button>
                    </div>
                </div>
            </div>

            {/* OCR Modal */}
            <MathOCRModal
                isOpen={showOCR}
                onClose={() => setShowOCR(false)}
                onInsert={insertLatex}
            />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Editor Panel */}
                <div className="w-full md:w-1/3 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">

                    {/* Symbol Palette */}
                    <div className="flex flex-col border-b border-gray-200 dark:border-gray-700 h-1/2 min-h-[300px]">
                        <MathSymbolPalette onInsert={insertLatex} />
                    </div>

                    <div className="flex-1 p-4 flex flex-col min-h-[200px]">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">LaTeX Input</label>
                        <textarea
                            ref={textareaRef}
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            className="flex-1 w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                            placeholder="Type LaTeX math here..."
                        />
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                        <div>
                            <label className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                <span>Font Size</span>
                                <span className="text-gray-900 dark:text-white">{fontSize}px</span>
                            </label>
                            <input
                                type="range"
                                min="12"
                                max="128"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>

                        <div>
                            <label className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                <span>Padding</span>
                                <span className="text-gray-900 dark:text-white">{padding}px</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={padding}
                                onChange={(e) => setPadding(Number(e.target.value))}
                                className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Text Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="h-8 w-8 rounded cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="flex-1 text-xs p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    <span>Background</span>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={transparent}
                                            onChange={(e) => setTransparent(e.target.checked)}
                                            className="rounded text-purple-500 focus:ring-purple-500"
                                        />
                                        <span className="text-[10px] normal-case">Transparent</span>
                                    </label>
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => {
                                            setBgColor(e.target.value);
                                            setTransparent(false);
                                        }}
                                        disabled={transparent}
                                        className={`h-8 w-8 rounded cursor-pointer border-0 ${transparent ? 'opacity-50' : ''}`}
                                    />
                                    <input
                                        type="text"
                                        value={transparent ? 'Transparent' : bgColor}
                                        readOnly
                                        disabled
                                        className="flex-1 text-xs p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex-1 p-8 flex items-center justify-center bg-gray-100 overflow-auto relative">
                    {/* Checkerboard Background for Transparency Visualization */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(45deg, #808080 25%, transparent 25%), 
                                linear-gradient(-45deg, #808080 25%, transparent 25%), 
                                linear-gradient(45deg, transparent 75%, #808080 75%), 
                                linear-gradient(-45deg, transparent 75%, #808080 75%)
                            `,
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}
                    />

                    <div
                        ref={previewRef}
                        className="transition-all duration-200 shadow-2xl rounded-xl relative z-10 w-fit [&_.katex-display]:m-0"
                        style={{
                            backgroundColor: transparent ? 'transparent' : bgColor,
                            padding: `${padding}px`,
                        }}
                    >
                        <div
                            ref={containerRef}
                            style={{
                                fontSize: `${fontSize}px`,
                                color: color,
                            }}
                        />
                        {error && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};
