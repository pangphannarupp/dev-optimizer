import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
    Upload, FileText, Download,
    Trash2, Loader2, ArrowLeft, CheckCircle,
    FileImage
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Set worker source
import { GlobalWorkerOptions } from 'pdfjs-dist';
// @ts-ignore
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

interface ExtractedPage {
    pageNumber: number;
    dataUrl: string;
    width: number;
    height: number;
    selected: boolean;
}

export const PdfToImage = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<ExtractedPage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('jpeg');
    const [quality, setQuality] = useState(0.95);
    const [scale, setScale] = useState(2); // 2x for better quality

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && acceptedFiles[0].type === 'application/pdf') {
            setFile(acceptedFiles[0]);
            setPages([]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const processPdf = async () => {
        if (!file) return;

        try {
            setIsProcessing(true);
            setProgress(0);
            setPages([]);

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const totalPages = pdf.numPages;
            const newPages: ExtractedPage[] = [];

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    await page.render(renderContext as any).promise;

                    const dataUrl = canvas.toDataURL(`image/${imageFormat}`, quality);

                    newPages.push({
                        pageNumber: i,
                        dataUrl,
                        width: viewport.width,
                        height: viewport.height,
                        selected: true
                    });
                }

                setProgress(Math.round((i / totalPages) * 100));

                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            setPages(newPages);
        } catch (error) {
            console.error('Error processing PDF:', error);
            // Handle error (show toast etc)
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    // Auto-process when file changes
    useEffect(() => {
        if (file) {
            processPdf();
        }
    }, [file, imageFormat, quality, scale]);

    const handleDownloadAll = async () => {
        const selectedPages = pages.filter(p => p.selected);
        if (selectedPages.length === 0) return;

        if (selectedPages.length === 1) {
            saveAs(selectedPages[0].dataUrl, `page_${selectedPages[0].pageNumber}.${imageFormat}`);
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder("images");

        selectedPages.forEach(page => {
            const imgData = page.dataUrl.split(',')[1];
            folder?.file(`page_${page.pageNumber}.${imageFormat}`, imgData, { base64: true });
        });

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${file?.name.replace('.pdf', '')}_images.zip`);
    };

    const togglePageSelection = (pageNumber: number) => {
        setPages(prev => prev.map(p =>
            p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p
        ));
    };

    const selectAll = () => {
        const allSelected = pages.every(p => p.selected);
        setPages(prev => prev.map(p => ({ ...p, selected: !allSelected })));
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors md:hidden"
                    >
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="flex items-center gap-2">
                        <FileImage className="text-blue-500" size={24} />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">PDF to Image</h1>
                    </div>
                </div>

                {pages.length > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-4 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Format:</span>
                            <select
                                value={imageFormat}
                                onChange={(e) => {
                                    const fmt = e.target.value as 'jpeg' | 'png';
                                    setImageFormat(fmt);
                                    if (fmt === 'png') setQuality(1);
                                    else setQuality(0.95);
                                }}
                                className="bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                                disabled={isProcessing}
                            >
                                <option value="jpeg">JPEG</option>
                                <option value="png">PNG</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 mr-4 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Quality:</span>
                            <select
                                value={String(scale)}
                                onChange={(e) => setScale(Number(e.target.value))}
                                className="bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                                disabled={isProcessing}
                            >
                                <option value="1">1x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2x</option>
                                <option value="3">3x</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setFile(null)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            title="Clear"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button
                            onClick={handleDownloadAll}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                        >
                            <Download size={18} />
                            Download {pages.filter(p => p.selected).length} Pages
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {!file ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                        <div
                            {...getRootProps()}
                            className={`w-full max-w-xl p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragActive
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                                <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Drop your PDF here
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                or click to browse files
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                    <FileText size={16} /> PDF Files
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        {isProcessing && pages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Processing PDF... {progress}%
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    converting pages to {imageFormat.toUpperCase()}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {file.name}
                                        </h2>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-500">
                                            {pages.length} Pages
                                        </span>
                                    </div>
                                    <button
                                        onClick={selectAll}
                                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {pages.every(p => p.selected) ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {pages.map((page) => (
                                        <motion.div
                                            key={page.pageNumber}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={() => togglePageSelection(page.pageNumber)}
                                            className={`relative group bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 cursor-pointer overflow-hidden transition-all ${page.selected
                                                ? 'border-blue-500 ring-2 ring-blue-500/20'
                                                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                                }`}
                                        >
                                            <div className="aspect-[3/4] p-2 bg-gray-50 dark:bg-gray-900/50">
                                                <img
                                                    src={page.dataUrl}
                                                    alt={`Page ${page.pageNumber}`}
                                                    className="w-full h-full object-contain shadow-sm bg-white"
                                                />
                                            </div>

                                            <div className="absolute top-2 right-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${page.selected
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-black/30 text-white/50 group-hover:bg-black/50'
                                                    }`}>
                                                    <CheckCircle size={14} className={page.selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                                                </div>
                                            </div>

                                            <div className="p-3">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                                                    Page {page.pageNumber}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isProcessing && (
                                        <div className="flex items-center justify-center aspect-[3/4] bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
