import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Image as ImageIcon, X } from 'lucide-react';
import { DropZone } from './DropZone';
import { clsx } from 'clsx';

export function ImageToBase64() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'toBase64' | 'toImage'>('toBase64');

    // Image to Base64 state
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [base64String, setBase64String] = useState<string>('');
    const [copied, setCopied] = useState(false);

    // Base64 to Image state
    const [inputBase64, setInputBase64] = useState('');
    const [outputImage, setOutputImage] = useState<string | null>(null);

    // --- Image to Base64 Handlers ---
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

    // --- Base64 to Image Handlers ---
    const handleBase64Input = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInputBase64(val);

        if (!val.trim()) {
            setOutputImage(null);
            return;
        }

        // Simple check if it looks like an image or just base64 data
        let src = val.trim();
        // If it doesn't start with data:, try to append a generic header for preview?
        // Actually, img src needs data URI scheme usually.
        // If user pastes raw base64 without header, we might guess.
        if (!src.startsWith('data:image/')) {
            // Assume PNG if unknown, often safest guess or just try
            src = `data:image/png;base64,${src}`;
        }
        setOutputImage(src);
    }, []);

    const handleSaveImage = useCallback(() => {
        if (!outputImage) return;

        const a = document.createElement('a');
        a.href = outputImage;
        a.download = `converted_image_${Date.now()}.png`; // Defaulting to png, browser handles conversion often
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, [outputImage]);

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                        {t('base64.title')}
                    </h2>

                    <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('toBase64')}
                            className={clsx(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                activeTab === 'toBase64'
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            Image → Base64
                        </button>
                        <button
                            onClick={() => setActiveTab('toImage')}
                            className={clsx(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                activeTab === 'toImage'
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            Base64 → Image
                        </button>
                    </div>
                </div>

                {activeTab === 'toBase64' ? (
                    // --- TAB 1: Image to Base64 ---
                    !file ? (
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
                    )
                ) : (
                    // --- TAB 2: Base64 to Image ---
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Paste Base64 String
                            </label>
                            <textarea
                                value={inputBase64}
                                onChange={handleBase64Input}
                                placeholder="Paste your Base64 string here (with or without 'data:image/...;base64,' prefix)..."
                                className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-xs text-gray-600 dark:text-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none solution-editor"
                            />
                        </div>

                        {outputImage && (
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Preview & Save
                                </label>
                                <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700 p-4">
                                    <img
                                        src={outputImage}
                                        alt="Converted"
                                        className="max-w-full max-h-full object-contain shadow-sm"
                                        onError={() => setOutputImage(null)} // Hide if invalid
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveImage}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <ImageIcon size={18} />
                                        Save Image
                                    </button>
                                </div>
                            </div>
                        )}
                        {!outputImage && inputBase64 && (
                            <div className="text-amber-500 text-sm flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
                                <span>⚠️ Invalid or unsupported Base64 image string</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
