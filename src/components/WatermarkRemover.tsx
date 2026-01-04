import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';
import { Download, Sparkles, AlertCircle, Play, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

interface WatermarkItem {
    id: string;
    file: File;
    originalUrl: string;
    processedUrl?: string;
    status: 'pending' | 'processing' | 'done' | 'error';
    error?: string;
}

export const WatermarkRemover = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState<WatermarkItem[]>([]);
    const [apiKey, setApiKey] = useState('');

    // Basic watermark removal using Canvas (Targeting bottom-right Gemini/AI watermarks)
    const removeWatermarkInCanvas = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    URL.revokeObjectURL(url);
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // --- Simple "Inpainting" for bottom-right corner ---
                // Most AI generators place a small watermark in the bottom-right.
                // We will crudely "heal" this area by copying nearby pixels.



                // 1. Define the watermark area (bottom-right 12%)
                const wmSize = Math.max(80, Math.min(img.width, img.height) * 0.12);
                const x = img.width - wmSize;
                const y = img.height - wmSize;

                // 2. Clone Stamp from Top (1:1 Copy)
                // The vertical stretch created a "curtain" effect.
                // The "Copy Left" duplicated text.
                // The safest bet for this specific image style is to copy the block *above* the watermark
                // and paste it down 1:1. This preserves texture (stars/noise) without smearing.

                try {
                    // Source: The square block immediately ABOVE the watermark
                    const sourceY = Math.max(0, y - wmSize);

                    // Draw that block 1:1 over the watermark
                    ctx.drawImage(
                        img,
                        x, sourceY, wmSize, wmSize, // Source: Block above
                        x, y, wmSize, wmSize // Dest: Target area
                    );

                    // 3. Blend the Top Edge
                    // Smooth the transition from the top area into the patch
                    if (ctx.filter !== undefined) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(x, y - 4, wmSize, 8); // Strip centered on the top seam
                        ctx.clip();
                        ctx.filter = 'blur(5px)';
                        ctx.drawImage(img, 0, 0);
                        ctx.restore();
                    }

                } catch (e) {
                    console.error("Failed to apply patch:", e);
                    // Fallback to simple blur
                    if (ctx.filter !== undefined) {
                        ctx.filter = 'blur(20px)';
                        ctx.drawImage(img, x, y, wmSize, wmSize, x, y, wmSize, wmSize);
                        ctx.filter = 'none';
                    }
                }

                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) {
                        resolve(URL.createObjectURL(blob));
                    } else {
                        reject(new Error('Canvas conversion failed'));
                    }
                }, file.type);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };

            img.src = url;
        });
    };

    const processImage = async (item: WatermarkItem) => {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i));

        try {
            // Perform actual client-side processing
            const processedUrl = await removeWatermarkInCanvas(item.file);

            // Simulate a "thinking" delay to make it feel like AI
            await new Promise(resolve => setTimeout(resolve, 1500));

            setItems(prev => prev.map(i => i.id === item.id ? {
                ...i,
                status: 'done',
                processedUrl: processedUrl
            } : i));
        } catch (error) {
            console.error(error);
            setItems(prev => prev.map(i => i.id === item.id ? {
                ...i,
                status: 'error',
                error: t('watermarkRemover.alert.processError')
            } : i));
        }
    };

    const handleFilesDropped = useCallback((files: File[]) => {
        const newItems = files.map(file => ({
            id: uuidv4(),
            file,
            originalUrl: URL.createObjectURL(file),
            status: 'pending' as const
        }));
        setItems(prev => [...prev, ...newItems]);
    }, []);

    const handleRemove = (id: string) => {
        setItems(prev => {
            const item = prev.find(i => i.id === id);
            if (item) {
                URL.revokeObjectURL(item.originalUrl);
                // if(item.processedUrl) URL.revokeObjectURL(item.processedUrl); // If different
            }
            return prev.filter(i => i.id !== id);
        });
    };

    const handleDownload = (item: WatermarkItem) => {
        if (!item.processedUrl) return;
        const a = document.createElement('a');
        a.href = item.processedUrl;
        a.download = `clean_${item.file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto p-6 gap-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Sparkles className="text-blue-500" />
                    {t('watermarkRemover.title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {t('watermarkRemover.description')}
                </p>
            </header>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('watermarkRemover.apiKeyParams')}
                    </label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={t('watermarkRemover.apiKeyPlaceholder')}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                {/* Future settings controls could go here */}
            </div>

            <DropZone onFilesDropped={handleFilesDropped} accept="image/*" />

            {items.length > 0 && (
                <div className="grid grid-cols-1 gap-6 pb-20">
                    <AnimatePresence>
                        {items.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                            >
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                                    <div className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-md">
                                        {item.file.name}
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    {/* Original */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
                                            <span>{t('watermarkRemover.original')}</span>
                                        </div>
                                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                            <img src={item.originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                                        </div>
                                    </div>

                                    {/* Processed / Action */}
                                    <div className="flex flex-col gap-2 h-full">
                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
                                            <span>{t('watermarkRemover.processed')}</span>
                                        </div>

                                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-1">
                                            {item.status === 'done' && item.processedUrl ? (
                                                <img src={item.processedUrl} alt="Processed" className="max-h-full max-w-full object-contain" />
                                            ) : item.status === 'processing' ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-sm text-blue-500 font-medium animate-pulse">{t('watermarkRemover.processing')}</span>
                                                </div>
                                            ) : item.status === 'error' ? (
                                                <div className="flex flex-col items-center gap-2 text-red-500 text-center p-4">
                                                    <AlertCircle size={32} />
                                                    <span className="text-sm">{item.error}</span>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 flex flex-col items-center gap-2">
                                                    <Sparkles size={32} opacity={0.5} />
                                                    <span className="text-sm">{t('imageEnhancer.clickProcess')}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            {item.status === 'done' ? (
                                                <button
                                                    onClick={() => handleDownload(item)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-sm"
                                                >
                                                    <Download size={18} />
                                                    {t('watermarkRemover.download')}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => processImage(item)}
                                                    disabled={item.status === 'processing'}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-sm w-full sm:w-auto justify-center"
                                                >
                                                    {item.status === 'processing' ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                            {t('watermarkRemover.processing')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play size={18} fill="currentColor" />
                                                            {t('watermarkRemover.process')}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
