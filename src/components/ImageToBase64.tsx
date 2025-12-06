import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Image as ImageIcon, X } from 'lucide-react';
import { DropZone } from './DropZone';
import { clsx } from 'clsx';

export function ImageToBase64() {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [base64String, setBase64String] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const handleFilesDropped = useCallback((files: File[]) => {
        if (files.length > 0) {
            const selectedFile = files[0];
            setFile(selectedFile);

            // Create preview
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);

            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setBase64String(base64);
            };
            reader.readAsDataURL(selectedFile);
        }
    }, []);

    const handleClear = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setFile(null);
        setPreviewUrl(null);
        setBase64String('');
        setCopied(false);
    }, [previewUrl]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(base64String);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [base64String]);

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    {t('base64.title')}
                </h2>

                {!file ? (
                    <DropZone onFilesDropped={handleFilesDropped} />
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="relative group">
                            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                )}
                            </div>
                            <button
                                onClick={handleClear}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title={t('common.remove')}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('base64.outputString')}
                                </label>
                                <span className="text-xs text-gray-500">
                                    {base64String.length.toLocaleString()} chars
                                </span>
                            </div>

                            <div className="relative">
                                <textarea
                                    readOnly
                                    value={base64String}
                                    className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-xs text-gray-600 dark:text-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={clsx(
                                        "absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium",
                                        copied
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    )}
                                >
                                    {copied ? (
                                        <>
                                            <Check size={16} />
                                            {t('common.copied')}
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            {t('common.copy')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
