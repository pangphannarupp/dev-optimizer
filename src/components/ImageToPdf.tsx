import React, { useState, useCallback } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import { Trash2, GripVertical, FileDown, Loader2, ArrowLeft, BookOpen, LayoutList, LayoutGrid, Maximize2, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropZone } from './DropZone';
import { BookPreviewOverlay } from './BookPreviewOverlay';
import { AnimatePresence } from 'framer-motion';

interface PdfImage {
    id: string;
    file: File;
    previewUrl: string;
}

// Sortable Image Item Component
interface SortableImageItemProps {
    id: string;
    img: PdfImage;
    viewMode: 'list' | 'grid';
    thumbnailSize: 'small' | 'large';
    onRemove: (id: string) => void;
}

const SortableImageItem: React.FC<SortableImageItemProps> = ({ id, img, viewMode, thumbnailSize, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group relative
                ${viewMode === 'grid'
                    ? 'flex flex-col gap-2 p-3 aspect-square w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)]'
                    : 'flex items-center gap-4 p-3 w-full'
                }
                bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm
                ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-md transition-shadow'}
            `}
        >
            <div
                {...attributes}
                {...listeners}
                className={`
                    text-gray-400 cursor-move hover:text-gray-600 dark:hover:text-gray-300 touch-none
                    ${viewMode === 'grid'
                        ? 'absolute top-2 left-2 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-md backdrop-blur-sm shadow-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity'
                        : ''
                    }
                `}
            >
                <GripVertical size={20} />
            </div>

            <div className={`
                bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0
                ${viewMode === 'grid' ? 'flex-1 w-full' : ''}
                ${viewMode === 'list' && thumbnailSize === 'small' ? 'w-16 h-16' : ''}
                ${viewMode === 'list' && thumbnailSize === 'large' ? 'w-32 h-32' : ''}
            `}>
                <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover pointer-events-none" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-gray-100 font-medium truncate">
                    {img.file.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(img.file.size / 1024)} KB
                </p>
            </div>

            <button
                onClick={() => onRemove(img.id)}
                className={`
                    text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors
                    ${viewMode === 'grid'
                        ? 'absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-md backdrop-blur-sm shadow-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity'
                        : 'p-2'
                    }
                `}
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};


export const ImageToPdf: React.FC = () => {

    const navigate = useNavigate();
    const [images, setImages] = useState<PdfImage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [thumbnailSize, setThumbnailSize] = useState<'small' | 'large'>('small');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [progress, setProgress] = useState(0);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleFilesDropped = useCallback((files: File[]) => {
        const newImages = files.map(file => ({
            id: uuidv4(),
            file,
            previewUrl: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    }, []);

    const handleRemove = useCallback((id: string) => {
        setImages(prev => {
            const newImages = prev.filter(img => img.id !== id);
            // Revoke URL to prevent memory leaks
            const removedImage = prev.find(img => img.id === id);
            if (removedImage) {
                URL.revokeObjectURL(removedImage.previewUrl);
            }
            return newImages;
        });
    }, []);

    const generatePdf = async () => {
        if (images.length === 0) return;

        setIsGenerating(true);
        setProgress(0);

        // Allow UI to update before heavy work
        await new Promise(resolve => setTimeout(resolve, 0));

        try {
            const doc = new jsPDF({
                orientation: orientation,
                unit: 'mm',
            });

            const pageSize = doc.internal.pageSize;
            const pageWidth = pageSize.getWidth();
            const pageHeight = pageSize.getHeight();

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                if (i > 0) {
                    doc.addPage();
                }

                const imgProps = await getImageProperties(img.previewUrl);

                // Calculate dimensions to fit page while maintaining aspect ratio
                const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
                const width = imgProps.width * ratio;
                const height = imgProps.height * ratio;

                const x = (pageWidth - width) / 2;
                const y = (pageHeight - height) / 2;

                doc.addImage(img.previewUrl, 'JPEG', x, y, width, height);

                // Update progress
                setProgress(Math.round(((i + 1) / images.length) * 100));

                // Yield to main thread briefly to allow UI updates
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            doc.save(`images_${orientation}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Ideally show a toast notification here
        } finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };

    const getImageProperties = (url: string): Promise<{ width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = reject;
            img.src = url;
        });
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
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Image to PDF</h1>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => setImages([])}
                        disabled={images.length === 0 || isGenerating}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Clear All</span>
                    </button>
                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        disabled={images.length === 0 || isGenerating}
                        className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <BookOpen size={18} />
                        <span className="hidden sm:inline">Preview Book</span>
                    </button>
                    <button
                        onClick={generatePdf}
                        disabled={images.length === 0 || isGenerating}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-center"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>{progress}%</span>
                            </>
                        ) : (
                            <>
                                <FileDown size={20} />
                                <span>Download PDF</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                    <DropZone
                        onFilesDropped={handleFilesDropped}
                        validator={(file) => file.type.startsWith('image/')}
                        supportedText="Supports JPG, PNG, WEBP, GIF, BMP"
                        dragDropText="Drag & drop images here"
                    />

                    {images.length > 0 && (
                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">View:</span>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    title="List View"
                                >
                                    <LayoutList size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    title="Grid View"
                                >
                                    <LayoutGrid size={20} />
                                </button>
                            </div>

                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2" />

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Orientation:</span>
                                <button
                                    onClick={() => setOrientation('portrait')}
                                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${orientation === 'portrait' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    Portrait
                                </button>
                                <button
                                    onClick={() => setOrientation('landscape')}
                                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${orientation === 'landscape' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    Landscape
                                </button>
                            </div>

                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2" />

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Size:</span>
                                <button
                                    onClick={() => setThumbnailSize('small')}
                                    className={`p-1.5 rounded-md transition-colors ${thumbnailSize === 'small' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    title="Small Thumbnails"
                                >
                                    <Minimize2 size={20} />
                                </button>
                                <button
                                    onClick={() => setThumbnailSize('large')}
                                    className={`p-1.5 rounded-md transition-colors ${thumbnailSize === 'large' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    title="Large Thumbnails"
                                >
                                    <Maximize2 size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {images.length > 0 && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={images.map(img => img.id)}
                                strategy={rectSortingStrategy}
                            >
                                <div
                                    className={viewMode === 'grid'
                                        ? "flex flex-wrap gap-4"
                                        : "flex flex-col gap-3"
                                    }
                                >
                                    {images.map((img) => (
                                        <SortableImageItem
                                            key={img.id}
                                            id={img.id}
                                            img={img}
                                            viewMode={viewMode}
                                            thumbnailSize={thumbnailSize}
                                            onRemove={handleRemove}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}

                    {images.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                            <p>No images selected. Add some images to get started!</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isPreviewOpen && (
                    <BookPreviewOverlay
                        images={images}
                        orientation={orientation}
                        onClose={() => setIsPreviewOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
