import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PdfImage {
    id: string;
    file: File;
    previewUrl: string;
}

interface BookPreviewOverlayProps {
    images: PdfImage[];
    orientation: 'portrait' | 'landscape';
    onClose: () => void;
}

export const BookPreviewOverlay: React.FC<BookPreviewOverlayProps> = ({ images, orientation, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

    // Ensure we start at 0
    useEffect(() => {
        setCurrentIndex(0);
    }, []);

    // Preload images
    useEffect(() => {
        const preloadImages = () => {
            const indexesToPreload = [
                currentIndex - 2, // Prev spread left
                currentIndex - 1, // Prev spread right
                currentIndex + 2, // Next spread left
                currentIndex + 3  // Next spread right
            ];

            indexesToPreload.forEach(idx => {
                if (idx >= 0 && idx < images.length) {
                    const img = new Image();
                    img.src = images[idx].previewUrl;
                }
            });
        };

        preloadImages();
    }, [currentIndex, images]);

    const totalPages = images.length;
    const hasPrev = currentIndex > 0;
    // logic for next: if we have more pages after the current spread (currentIndex + 1)
    // The next spread would start at currentIndex + 2
    const hasNext = currentIndex + 2 < totalPages;

    const handlePrev = () => {
        if (!hasPrev) return;
        setDirection(-1);
        setCurrentIndex(prev => Math.max(0, prev - 2));
    };

    const handleNext = () => {
        if (!hasNext) return;
        setDirection(1);
        setCurrentIndex(prev => prev + 2);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') onClose();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, hasNext, hasPrev]);

    // Current spread pages
    const leftPage = images[currentIndex];
    const rightPage = images[currentIndex + 1];

    // Determine aspect ratio based on orientation
    // Portrait A4 spread is approx 4/3 (297*2 / 210 = 2.8? No. 210*2 / 297 = 1.41)
    // Wait, two portrait A4s side-by-side: Width = 210*2 = 420, Height = 297. AR = 1.41 (approx 4/3 or 3/2)
    // Landscape A4 spread: Width = 297*2 = 594, Height = 210. AR = 2.82 (approx 3/1)
    const aspectRatioClass = orientation === 'landscape' ? 'aspect-[3/1]' : 'aspect-[3/2]';

    const variants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? 180 : -180,
            opacity: 0,
            scale: 0.9,
            zIndex: 0
        }),
        center: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            zIndex: 1,
            transition: {
                duration: 0.6,
                type: "spring" as const,
                stiffness: 260,
                damping: 20
            }
        },
        exit: (direction: number) => ({
            rotateY: direction > 0 ? -180 : 180,
            opacity: 0,
            scale: 0.9,
            zIndex: 0,
            transition: {
                duration: 0.6,
                type: "spring" as const,
                stiffness: 260,
                damping: 20
            }
        })
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 text-white z-20">
                <div className="flex items-center gap-2">
                    <BookOpen size={24} />
                    <h2 className="text-xl font-bold">Book Preview ({orientation})</h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                        Pages {currentIndex + 1}-{Math.min(currentIndex + 2, totalPages)} of {totalPages}
                    </span>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative perspective-[1500px]">
                <button
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    className={`absolute left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all ${!hasPrev ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                >
                    <ChevronLeft size={32} />
                </button>

                <div className={`w-full max-w-6xl ${aspectRatioClass} relative flex items-center justify-center transition-all duration-300`}>
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className={`absolute w-full h-full flex shadow-2xl rounded-sm overflow-hidden bg-white max-w-6xl ${aspectRatioClass}`}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Spine Shadow Effect */}
                            <div className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent z-10 pointer-events-none mix-blend-multiply" />

                            {/* Left Page */}
                            <div className="flex-1 h-full bg-white border-r border-gray-200 relative overflow-hidden flex items-center justify-center p-4">
                                {leftPage ? (
                                    <img
                                        src={leftPage.previewUrl}
                                        alt={`Page ${currentIndex + 1}`}
                                        className="max-w-full max-h-full object-contain shadow-sm"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full text-gray-300 bg-gray-50/50">
                                        Empty
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 text-xs text-gray-400 font-mono">{currentIndex + 1}</div>
                            </div>

                            {/* Right Page */}
                            <div className="flex-1 h-full bg-white relative overflow-hidden flex items-center justify-center p-4">
                                {rightPage ? (
                                    <img
                                        src={rightPage.previewUrl}
                                        alt={`Page ${currentIndex + 2}`}
                                        className="max-w-full max-h-full object-contain shadow-sm"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full text-gray-300 bg-gray-50/50">
                                        End of Book
                                    </div>
                                )}
                                <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-mono">{currentIndex + 2}</div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button
                    onClick={handleNext}
                    disabled={!hasNext}
                    className={`absolute right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all ${!hasNext ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Footer / Thumbnail Strip */}
            <div className="h-20 bg-black/80 flex items-center justify-center gap-2 overflow-x-auto p-4 z-20">
                {images.map((img, idx) => {
                    // Determine if this thumbnail belongs to the current spread
                    // Spread 0: idx 0, 1. Spread 2: idx 2, 3.
                    const isCurrentSpread = Math.floor(idx / 2) * 2 === currentIndex;
                    const thumbAspect = orientation === 'landscape' ? 'aspect-[4/3]' : 'aspect-[2/3]';

                    return (
                        <div
                            key={img.id}
                            onClick={() => {
                                const targetIndex = Math.floor(idx / 2) * 2;
                                setDirection(targetIndex > currentIndex ? 1 : -1);
                                setCurrentIndex(targetIndex);
                            }}
                            className={`h-full ${thumbAspect} bg-white rounded-sm cursor-pointer overflow-hidden transition-all ${isCurrentSpread
                                ? 'ring-2 ring-blue-500 opacity-100 scale-105'
                                : 'opacity-50 hover:opacity-100 hover:scale-105'
                                }`}
                        >
                            <img src={img.previewUrl} className="w-full h-full object-cover" />
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};
