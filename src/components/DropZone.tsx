import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface DropZoneProps {
    onFilesDropped: (files: File[]) => void;
    className?: string;
    accept?: string;
    validator?: (file: File) => boolean;
    supportedText?: string;
    dragDropText?: string;
    multiple?: boolean;
    id?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
    onFilesDropped,
    className,
    accept = "image/*,.heic,.heif,.bmp,.avif,.ico,.svg",
    validator,
    supportedText,
    dragDropText,
    multiple = true,
    id = 'file-input'
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const { t } = useTranslation();

    const defaultValidator = useCallback((file: File) => {
        // Explicitly exclude TIFF
        if (file.type === 'image/tiff' || file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')) {
            return false;
        }
        // Check MIME type first
        if (file.type.startsWith('image/')) return true;
        // Fallback to extension check for HEIC/HEIF and others
        const extension = file.name.toLowerCase().split('.').pop();
        return ['heic', 'heif', 'bmp', 'avif', 'ico', 'svg', 'zip', 'json', 'csv', 'txt', 'xml', 'lottie'].includes(extension || '');
    }, []);

    const validateFile = validator || defaultValidator;

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(validateFile);
        if (files.length > 0) {
            onFilesDropped(files);
        }
    }, [onFilesDropped, validateFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).filter(validateFile);
            if (files.length > 0) {
                onFilesDropped(files);
            }
        }
    }, [onFilesDropped, validateFile]);

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={clsx(
                "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer group",
                isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800",
                className
            )}
            onClick={() => document.getElementById(id)?.click()}
        >
            <input
                type="file"
                id={id}
                className="hidden"
                multiple={multiple}
                accept={accept}
                onChange={handleFileInput}
            />
            <div className="flex flex-col items-center justify-center gap-3 pointer-events-none w-full">
                <div className={clsx(
                    "p-4 rounded-full transition-colors duration-200",
                    isDragging ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                )}>
                    <Upload size={32} />
                </div>
                <div className="flex flex-col gap-1 max-w-full px-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                        {dragDropText || t('dropzone.dragDrop')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center break-words leading-tight">
                        {supportedText || t('dropzone.supports')}
                    </p>
                </div>
            </div>
        </div>
    );
};
