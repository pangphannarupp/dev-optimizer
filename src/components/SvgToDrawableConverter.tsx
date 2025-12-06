import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';
import { convertSvgToAndroidDrawable } from '../utils/svgToAndroid';
import { convertAndroidDrawableToSvg } from '../utils/androidToSvg';
import { Download, Copy, Check, Eye, Code2 } from 'lucide-react';
import { clsx } from 'clsx';

export const SvgToDrawableConverter: React.FC = () => {
    const { t } = useTranslation();
    const [svgFile, setSvgFile] = useState<File | null>(null);
    const [svgContent, setSvgContent] = useState<string>('');
    const [xmlContent, setXmlContent] = useState<string>('');
    const [previewSvg, setPreviewSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

    const handleFilesDropped = useCallback((files: File[]) => {
        const file = files[0];
        if (file && file.type === 'image/svg+xml') {
            setSvgFile(file);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target?.result as string;
                setSvgContent(content);
                try {
                    const xml = await convertSvgToAndroidDrawable(content);
                    setXmlContent(xml);
                    setError(null);
                } catch (err) {
                    setError('Failed to convert SVG. Please ensure it is a valid SVG file.');
                    setXmlContent('');
                }
            };
            reader.readAsText(file);
        } else {
            setError('Please upload a valid SVG file.');
        }
    }, []);

    useEffect(() => {
        if (xmlContent) {
            try {
                const svg = convertAndroidDrawableToSvg(xmlContent);
                setPreviewSvg(svg);
            } catch (e) {
                console.error('Failed to generate preview', e);
            }
        } else {
            setPreviewSvg('');
        }
    }, [xmlContent]);

    const handleCopy = () => {
        navigator.clipboard.writeText(xmlContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!xmlContent || !svgFile) return;
        const blob = new Blob([xmlContent], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const name = svgFile.name.replace('.svg', '.xml');
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('svgToDrawable.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400">{t('svgToDrawable.description')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <DropZone onFilesDropped={handleFilesDropped} className="h-64" />

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {svgContent && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{t('svgToDrawable.originalSvg')}</h3>
                            <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 min-h-[300px]">
                                <div dangerouslySetInnerHTML={{ __html: svgContent }} className="w-full h-full max-w-[300px] max-h-[300px] [&>svg]:w-full [&>svg]:h-full" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col min-h-[500px]">
                        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setActiveTab('code')}
                                    className={clsx(
                                        "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                                        activeTab === 'code'
                                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <Code2 size={16} />
                                    {t('svgToDrawable.xmlCode')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={clsx(
                                        "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                                        activeTab === 'preview'
                                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <Eye size={16} />
                                    {t('svgToDrawable.visualPreview')}
                                </button>
                            </div>

                            {activeTab === 'code' && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={handleCopy}
                                        disabled={!xmlContent}
                                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors disabled:opacity-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                        title={t('svgToDrawable.copy')}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        disabled={!xmlContent}
                                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors disabled:opacity-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                        title={t('svgToDrawable.download')}
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 relative overflow-hidden">
                            {activeTab === 'code' ? (
                                <div className="absolute inset-0 bg-gray-900">
                                    <textarea
                                        readOnly
                                        value={xmlContent}
                                        className="w-full h-full p-4 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none"
                                        placeholder={t('svgToDrawable.placeholder')}
                                    />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-8">
                                    {previewSvg ? (
                                        <div dangerouslySetInnerHTML={{ __html: previewSvg }} className="w-full h-full max-w-[300px] max-h-[300px] [&>svg]:w-full [&>svg]:h-full" />
                                    ) : (
                                        <p className="text-gray-400 text-sm">{t('svgToDrawable.noPreview')}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
