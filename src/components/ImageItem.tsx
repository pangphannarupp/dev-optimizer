import { X, ArrowRight, Download, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ProcessedImage {
    id: string;
    originalFile: File;
    previewUrl: string;
    targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
    quality: number;
    status: 'pending' | 'processing' | 'done' | 'error';
    processedBlob?: Blob;
    processedUrl?: string;
    error?: string;
}

interface ImageItemProps {
    item: ProcessedImage;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<ProcessedImage>) => void;
    onProcess: (id: string) => void;
    onDownload: (id: string) => void;
}

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const ImageItem: React.FC<ImageItemProps> = ({ item, onRemove, onUpdate, onProcess, onDownload }) => {
    const isProcessing = item.status === 'processing';
    const isDone = item.status === 'done';
    const isError = item.status === 'error';
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            {/* Thumbnail */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate" title={item.originalFile.name}>
                        {item.originalFile.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {formatSize(item.originalFile.size)}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 mt-2">
                    <select
                        value={item.targetFormat}
                        onChange={(e) => onUpdate(item.id, { targetFormat: e.target.value as any })}
                        disabled={isProcessing || isDone}
                        className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1 px-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none"
                    >
                        <option value="image/jpeg">JPG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WEBP</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('settings.quality')}:</span>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={item.quality * 100}
                            onChange={(e) => onUpdate(item.id, { quality: parseInt(e.target.value) / 100 })}
                            disabled={isProcessing || isDone}
                            className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-300 w-8">{Math.round(item.quality * 100)}%</span>
                    </div>
                </div>
            </div>

            {/* Status / Actions */}
            <div className="flex items-center gap-3">
                {isDone && item.processedBlob && (
                    <div className="text-right">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            {formatSize(item.processedBlob.size)}
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-500">
                            Saved {Math.round((1 - item.processedBlob.size / item.originalFile.size) * 100)}%
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="text-red-500" title={item.error}>
                        <AlertCircle size={20} />
                    </div>
                )}

                {isProcessing ? (
                    <Loader2 className="animate-spin text-blue-500" size={20} />
                ) : isDone ? (
                    <button
                        onClick={() => onDownload(item.id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
                        title={t('imageItem.download')}
                    >
                        <Download size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => onProcess(item.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        title={t('imageItem.process')}
                    >
                        <ArrowRight size={20} />
                    </button>
                )}

                <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title={t('imageItem.remove')}
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

