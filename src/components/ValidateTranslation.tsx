
import { saveAs } from 'file-saver';
import React, { useState, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { Upload, FileText, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Layers, Eye, EyeOff, Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { validateContent, ValidationError } from '../utils/validationUtils';

interface FileValidationResult {
    path: string;
    isValid: boolean;
    error?: string;
    details?: ValidationError[];
    type: 'vue' | 'ts' | 'js' | 'tsx' | 'other';
}

export function ValidateTranslation() {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<FileValidationResult[]>([]);
    const [ignoredPaths, setIgnoredPaths] = useState<Set<string>>(new Set());
    const [hideIgnored, setHideIgnored] = useState(false);
    const [showInvalidOnly, setShowInvalidOnly] = useState(true);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [selectedResult, setSelectedResult] = useState<FileValidationResult | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const toggleIgnore = useCallback((path: string) => {
        setIgnoredPaths(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    }, []);

    const handleUploadNew = useCallback(() => {
        setResults([]);
        setIgnoredPaths(new Set());
        setHideIgnored(false);
        setCurrentFile(null);
    }, []);

    const stats = useMemo(() => {
        const activeResults = results.filter(r => !ignoredPaths.has(r.path));
        const total = activeResults.length;
        const valid = activeResults.filter(r => r.isValid).length;
        const invalid = total - valid;
        return { total, valid, invalid };
    }, [results, ignoredPaths]);

    const displayedResults = useMemo(() => {
        let filtered = results;
        if (hideIgnored) {
            filtered = filtered.filter(r => !ignoredPaths.has(r.path));
        }
        if (showInvalidOnly) {
            filtered = filtered.filter(r => !r.isValid);
        }
        return filtered;
    }, [results, ignoredPaths, hideIgnored, showInvalidOnly]);

    const processFile = async (file: File, keepIgnored = false) => {
        setIsAnalyzing(true);
        setResults([]);
        if (!keepIgnored) {
            setIgnoredPaths(new Set());
        }
        setHideIgnored(false); // Reset hideIgnored on new upload
        setShowInvalidOnly(true); // Default to showing invalid only
        setCurrentFile(file);

        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            const validationResults: FileValidationResult[] = [];

            for (const [relativePath, zipEntry] of Object.entries(contents.files)) {
                if (zipEntry.dir || relativePath.includes('node_modules') || relativePath.includes('.git') || relativePath.includes('dist')) {
                    continue;
                }

                const lowerPath = relativePath.toLowerCase();
                let type: 'vue' | 'ts' | 'js' | 'tsx' | 'other' = 'other';

                if (lowerPath.endsWith('.vue')) type = 'vue';
                else if (lowerPath.endsWith('.ts')) type = 'ts';
                else if (lowerPath.endsWith('.js')) type = 'js';
                else if (lowerPath.endsWith('.tsx')) type = 'tsx';

                if (type === 'other') continue;

                const content = await zipEntry.async('string');
                const validation = validateContent(content, type);

                validationResults.push({
                    path: relativePath,
                    isValid: validation.isValid,
                    details: validation.details,
                    type
                });
            }

            setResults(validationResults.sort((a, b) => (a.isValid === b.isValid ? 0 : a.isValid ? 1 : -1)));

        } catch (error) {
            console.error("Failed to unzip or analyze", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReAnalyze = useCallback(() => {
        if (currentFile) {
            processFile(currentFile, true);
        }
    }, [currentFile]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const zipFile = files.find(f => f.name.endsWith('.zip'));

        if (zipFile) {
            processFile(zipFile);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleExportExcel = useCallback(() => {
        // Generate CSV content
        const headers = ['File Path', 'Type', 'Status', 'Ignored', 'Line', 'Text', 'Message'];

        // Filter out ignored files regardless of UI state
        // Flatten the data so each error is a row
        const rows: string[] = [];

        displayedResults
            .filter(r => !ignoredPaths.has(r.path))
            .forEach(r => {
                const isIgnored = ignoredPaths.has(r.path); // Should always be false now, but harmless
                const status = r.isValid ? 'Translated' : 'Untranslated';
                const ignoredStr = isIgnored ? 'Yes' : 'No';

                if (r.details && r.details.length > 0) {
                    r.details.forEach(detail => {
                        rows.push([
                            `"${r.path}"`,
                            `"${r.type}"`,
                            `"${status}"`,
                            `"${ignoredStr}"`,
                            `"${detail.line}"`,
                            `"${detail.text.replace(/"/g, '""')}"`,
                            `"${detail.message.replace(/"/g, '""')}"`
                        ].join(','));
                    });
                } else {
                    // For valid files or files with no details, add one row
                    rows.push([
                        `"${r.path}"`,
                        `"${r.type}"`,
                        `"${status}"`,
                        `"${ignoredStr}"`,
                        `""`, // No line
                        `""`, // No text
                        `""`  // No message
                    ].join(','));
                }
            });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'validation_report.csv');
    }, [displayedResults, ignoredPaths]);

    return (
        <div className="h-full flex flex-col p-6 max-w-6xl mx-auto w-full relative">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <Layers className="text-blue-500" />
                {t('app.validateTranslation', 'Validate Translation')}
            </h1>

            {results.length === 0 && (
                <div
                    className={clsx(
                        "relative border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer mb-8",
                        isDragging
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".zip"
                        onChange={handleFileSelect}
                    />

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                            {isAnalyzing ? <RefreshCw className="animate-spin" size={32} /> : <Upload size={32} />}
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                {isAnalyzing ? t('validation.analyzing') : t('validation.dragDrop')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('validation.browse')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                                <FileText className="text-blue-500" size={18} />
                                <span className="text-sm font-medium">{t('validation.total')}: {stats.total}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                                <CheckCircle className="text-green-500" size={18} />
                                <span className="text-sm font-medium">{t('validation.valid')}: {stats.valid}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                                <AlertTriangle className="text-red-500" size={18} />
                                <span className="text-sm font-medium">{t('validation.invalid')}: {stats.invalid}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={showInvalidOnly}
                                    onChange={(e) => setShowInvalidOnly(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                {t('validation.showInvalidOnly')}
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={hideIgnored}
                                    onChange={(e) => setHideIgnored(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                {t('validation.hideIgnored')}
                            </label>

                            <button
                                onClick={handleExportExcel}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                title={t('validation.exportCsv')}
                            >
                                <Download size={16} />
                                {t('validation.exportCsv')}
                            </button>

                            <button
                                onClick={handleReAnalyze}
                                disabled={isAnalyzing}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title={t('validation.reAnalyze')}
                            >
                                <RefreshCw size={16} className={clsx(isAnalyzing && "animate-spin")} />
                                {t('validation.reAnalyze')}
                            </button>
                            <button
                                onClick={handleUploadNew}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Upload size={16} />
                                {t('validation.uploadNew')}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300 w-10"></th>
                                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">{t('validation.filePath')}</th>
                                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">{t('validation.type')}</th>
                                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">{t('validation.status')}</th>
                                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300 w-1/2">{t('validation.issuesOverview')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {displayedResults.map((file, i) => {
                                    const isIgnored = ignoredPaths.has(file.path);
                                    const issueCount = file.details?.length || 0;

                                    return (
                                        <tr
                                            key={i}
                                            onClick={() => setSelectedResult(file)}
                                            className={clsx(
                                                "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer",
                                                isIgnored && "opacity-50 grayscale"
                                            )}
                                        >
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleIgnore(file.path); }}
                                                    className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title={isIgnored ? "Unignore" : "Ignore file"}
                                                >
                                                    {isIgnored ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </td>
                                            <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                {file.path}
                                                {isIgnored && <span className="ml-2 text-[10px] uppercase bg-gray-200 dark:bg-gray-700 px-1 rounded">Ignored</span>}
                                            </td>
                                            <td className="p-4 text-gray-500 dark:text-gray-500 uppercase text-xs font-bold">
                                                {file.type}
                                            </td>
                                            <td className="p-4">
                                                {file.isValid ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        <CheckCircle size={12} />
                                                        {t('validation.translated')}
                                                    </span>
                                                ) : isIgnored ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                                        <EyeOff size={12} />
                                                        {t('validation.ignored')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                        <AlertCircle size={12} />
                                                        {t('validation.untranslated')} ({issueCount})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">
                                                {file.details && file.details.length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        {file.details.slice(0, 3).map((d, k) => (
                                                            <div key={k} className="text-xs truncate flex items-center gap-2">
                                                                <span className="inline-block bg-gray-200 dark:bg-gray-700 px-1 rounded text-[10px] font-mono min-w-[30px] text-center">L{d.line}</span>
                                                                <span className="truncate" title={d.text}>{d.text}</span>
                                                            </div>
                                                        ))}
                                                        {file.details.length > 3 && (
                                                            <span className="text-xs text-gray-400 italic">
                                                                +{file.details.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-300 dark:text-gray-600 italic">{t('validation.noIssues')}</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedResult && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm rounded-xl">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate pr-4">
                                {selectedResult.path}
                            </h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedResult(null); }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-0 overflow-hidden flex-1 flex flex-col">
                            <div className="p-6 bg-gray-50 dark:bg-gray-900/30 flex-shrink-0">
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">{t('validation.type')}</div>
                                        <div className="font-mono text-sm">{selectedResult.type}</div>
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">{t('validation.status')}</div>
                                        <div>
                                            {selectedResult.isValid ? (
                                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                                                    <CheckCircle size={14} /> {t('validation.translated')}
                                                </span>
                                            ) : ignoredPaths.has(selectedResult.path) ? (
                                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    <EyeOff size={14} /> {t('validation.ignored')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                                                    <AlertCircle size={14} /> {t('validation.untranslated')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">{t('validation.totalIssues')}</div>
                                        <div className="text-sm font-bold">{selectedResult.details?.length || 0}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-0">
                                {selectedResult.details && selectedResult.details.length > 0 ? (
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-600 dark:text-gray-300">
                                            <tr>
                                                <th className="p-3 w-16 text-center">{t('validation.line')}</th>
                                                <th className="p-3">{t('validation.untranslatedText')}</th>
                                                <th className="p-3 w-1/3">{t('validation.contextMessage')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {selectedResult.details.map((detail, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="p-3 text-center font-mono text-gray-500">{detail.line}</td>
                                                    <td className="p-3 font-mono text-sm break-all text-red-600 dark:text-red-400">
                                                        {detail.text}
                                                    </td>
                                                    <td className="p-3 text-gray-500 dark:text-gray-400 text-xs">
                                                        {detail.message}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-12 text-gray-400 italic">
                                        {t('validation.noUntranslatedFound')}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-900/10 rounded-b-xl">
                            <button
                                onClick={() => setSelectedResult(null)}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                {t('validation.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
