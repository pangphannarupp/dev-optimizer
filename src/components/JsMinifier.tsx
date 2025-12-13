import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { minify } from 'terser';
import { Copy, Download, RefreshCw, FileCode, Trash2, Check, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { saveAs } from 'file-saver';

export const JsMinifier: React.FC = () => {
    const { t } = useTranslation();
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isMinifying, setIsMinifying] = useState(false);
    const [copied, setCopied] = useState(false);

    // Options
    const [options, setOptions] = useState({
        mangle: true,
        compress: true,
        keep_fnames: false
    });

    const handleMinify = async () => {
        if (!inputCode.trim()) return;

        setIsMinifying(true);
        setError(null);
        setOutputCode('');

        try {
            const result = await minify(inputCode, {
                mangle: options.mangle,
                compress: options.compress,
                keep_fnames: options.keep_fnames,
                sourceMap: false
            });

            if (result.code) {
                setOutputCode(result.code);
            } else {
                setError(t('jsMinifier.error', "Minification produced no output."));
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || t('jsMinifier.error', "An error occurred during minification."));
        } finally {
            setIsMinifying(false);
        }
    };

    const handleCopy = () => {
        if (!outputCode) return;
        navigator.clipboard.writeText(outputCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!outputCode) return;
        const blob = new Blob([outputCode], { type: 'text/javascript;charset=utf-8' });
        saveAs(blob, 'minified.js');
    };

    const handleClear = () => {
        setInputCode('');
        setOutputCode('');
        setError(null);
    };

    return (
        <div className="flex flex-col h-full gap-4 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <FileCode className="text-blue-500" />
                    {t('jsMinifier.title', 'Javascript Minifier')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleClear}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Trash2 size={16} />
                        {t('jsMinifier.clear', 'Clear')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Input Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('jsMinifier.inputUrl', 'Input URL / Code')}</label>
                        <div className="text-xs text-gray-500">
                            Size: {(new Blob([inputCode]).size / 1024).toFixed(2)} KB
                        </div>
                    </div>
                    <textarea
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="// Paste your Javascript code here..."
                        className="flex-1 w-full p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none"
                        spellCheck={false}
                    />

                    {/* Options */}
                    <div className="flex flex-wrap gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={options.mangle}
                                onChange={(e) => setOptions(prev => ({ ...prev, mangle: e.target.checked }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {t('jsMinifier.mangle', 'Mangle variables')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={options.compress}
                                onChange={(e) => setOptions(prev => ({ ...prev, compress: e.target.checked }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {t('jsMinifier.compress', 'Compress')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={options.keep_fnames}
                                onChange={(e) => setOptions(prev => ({ ...prev, keep_fnames: e.target.checked }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {t('jsMinifier.keepFnames', 'Keep function names')}
                        </label>
                    </div>

                    <button
                        onClick={handleMinify}
                        disabled={!inputCode || isMinifying}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        {isMinifying ? <RefreshCw className="animate-spin" size={18} /> : <FileCode size={18} />}
                        {t('jsMinifier.minify', 'Minify Javascript')}
                    </button>
                </div>

                {/* Output Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('jsMinifier.minifiedOutput', 'Minified Output')}</label>
                        {outputCode && (
                            <div className="flex items-center gap-4">
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    Saved: {((1 - (new Blob([outputCode]).size / new Blob([inputCode]).size)) * 100).toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500">
                                    {(new Blob([outputCode]).size / 1024).toFixed(2)} KB
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 relative">
                        <textarea
                            value={outputCode}
                            readOnly
                            placeholder="// Minified output will appear here..."
                            className={clsx(
                                "w-full h-full p-4 font-mono text-sm border rounded-lg outline-none resize-none",
                                error
                                    ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                            )}
                            spellCheck={false}
                        />
                        {error && (
                            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-red-100 dark:border-red-800 flex items-center gap-3 max-w-md">
                                    <AlertCircle className="text-red-500 shrink-0" size={24} />
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            disabled={!outputCode}
                            className="flex-1 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? t('common.copied', 'Copied!') : t('jsMinifier.copyCode', 'Copy Code')}
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={!outputCode}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Download size={18} />
                            {t('jsMinifier.download', 'Download .js')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
