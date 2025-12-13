import React, { useState, useCallback } from 'react';
import { DropZone } from './DropZone';
import { Download, Loader2, Sparkles, Eraser } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sharpenImage, removeBackground } from '../utils/imageEnhancer';

type EnhanceMode = 'sharpen' | 'remove-bg';

export const ImageEnhancer: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<File | null>(null);
    const [sourcePreview, setSourcePreview] = useState<string | null>(null);
    const [enhancedPreview, setEnhancedPreview] = useState<string | null>(null);
    const [mode, setMode] = useState<EnhanceMode>('sharpen');
    const [sharpenAmount, setSharpenAmount] = useState(1);
    const [bgColor, setBgColor] = useState('transparent');
    const [isProcessing, setIsProcessing] = useState(false);
    const { t } = useTranslation();

    const handleFileDropped = useCallback((files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            setSourceImage(file);
            setSourcePreview(URL.createObjectURL(file));
            setEnhancedPreview(null);
        }
    }, []);

    const handleSharpen = useCallback(async () => {
        if (!sourcePreview) return;

        setIsProcessing(true);
        try {
            const img = new Image();
            img.src = sourcePreview;
            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) throw new Error('Canvas context not available');

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const sharpened = sharpenImage(imageData, sharpenAmount);
            ctx.putImageData(sharpened, 0, 0);

            const dataUrl = canvas.toDataURL('image/png');
            setEnhancedPreview(dataUrl);
        } catch (error) {
            console.error('Sharpening error:', error);
            alert(t('imageEnhancer.alert.sharpenError'));
        } finally {
            setIsProcessing(false);
        }
    }, [sourcePreview, sharpenAmount]);

    const handleRemoveBackground = useCallback(async () => {
        if (!sourceImage) return;

        setIsProcessing(true);
        try {
            const blob = await removeBackground(sourceImage, bgColor);
            const dataUrl = URL.createObjectURL(blob);
            setEnhancedPreview(dataUrl);
        } catch (error) {
            console.error('Background removal error:', error);
            alert(t('imageEnhancer.alert.bgRemovalError'));
        } finally {
            setIsProcessing(false);
        }
    }, [sourceImage, bgColor]);

    const handleProcess = () => {
        if (mode === 'sharpen') {
            handleSharpen();
        } else {
            handleRemoveBackground();
        }
    };

    const handleDownload = () => {
        if (!enhancedPreview) return;

        const link = document.createElement('a');
        link.href = enhancedPreview;
        link.download = `enhanced-${sourceImage?.name || 'image.png'}`;
        link.click();
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="text-purple-600" />
                    {t('imageEnhancer.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('imageEnhancer.description')}
                </p>

                {!sourceImage ? (
                    <DropZone onFilesDropped={handleFileDropped} className="h-64" />
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Mode Selection */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setMode('sharpen');
                                    setEnhancedPreview(null);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${mode === 'sharpen'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Sparkles size={18} />
                                {t('imageEnhancer.sharpen')}
                            </button>
                            <button
                                onClick={() => {
                                    setMode('remove-bg');
                                    setEnhancedPreview(null);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${mode === 'remove-bg'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Eraser size={18} />
                                {t('imageEnhancer.removeBg')}
                            </button>
                        </div>

                        {/* Options */}
                        {mode === 'sharpen' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('imageEnhancer.sharpenAmount')}: {sharpenAmount.toFixed(1)}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="3"
                                    step="0.1"
                                    value={sharpenAmount}
                                    onChange={(e) => {
                                        setSharpenAmount(parseFloat(e.target.value));
                                        setEnhancedPreview(null);
                                    }}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                            </div>
                        )}

                        {mode === 'remove-bg' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('imageEnhancer.backgroundColor')}
                                </label>
                                <div className="flex gap-2">
                                    {['transparent', 'white', 'black'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => {
                                                setBgColor(color);
                                                setEnhancedPreview(null);
                                            }}
                                            className={`px-3 py-1 rounded text-sm ${bgColor === color
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {t(`imageEnhancer.bg_${color}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                    {t('imageEnhancer.original')}
                                </h3>
                                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                                    <img src={sourcePreview!} alt="Original" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                    {t('imageEnhancer.enhanced')}
                                </h3>
                                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                                    {enhancedPreview ? (
                                        <img src={enhancedPreview} alt="Enhanced" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            {t('imageEnhancer.clickProcess')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setSourceImage(null);
                                    setSourcePreview(null);
                                    setEnhancedPreview(null);
                                }}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                disabled={isProcessing}
                            >
                                {t('imageEnhancer.uploadNew')}
                            </button>
                            <button
                                onClick={handleProcess}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        {t('imageEnhancer.processing')}...
                                    </>
                                ) : (
                                    <>
                                        {mode === 'sharpen' ? <Sparkles size={20} /> : <Eraser size={20} />}
                                        {t('imageEnhancer.process')}
                                    </>
                                )}
                            </button>
                            {enhancedPreview && (
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <Download size={20} />
                                    {t('imageEnhancer.download')}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
