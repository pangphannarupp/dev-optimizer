import React, { useState, useCallback, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { DropZone } from './DropZone';
import {
    Download, Type, Square, Circle, Triangle,
    RotateCw, FlipHorizontal, FlipVertical, Undo, Redo, Trash2, Edit3
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Tab = 'draw' | 'transform' | 'adjust';

export const ImageEditor: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<File | null>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('draw');
    const [isCropping, setIsCropping] = useState(false);
    const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [historyStep, setHistoryStep] = useState(-1);

    // Drawing options
    const [fillColor, setFillColor] = useState('#3b82f6');
    const [strokeColor, setStrokeColor] = useState('#1f2937');
    const [strokeWidth] = useState(2);
    const [fontSize, setFontSize] = useState(32);

    // Adjustments
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundImageRef = useRef<fabric.FabricImage | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (canvasRef.current && !canvas) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: '#f3f4f6'
            });
            setCanvas(fabricCanvas);

            fabricCanvas.on('object:added', saveState);
            fabricCanvas.on('object:modified', saveState);
            fabricCanvas.on('object:removed', saveState);

            // Cleanup function
            return () => {
                console.log('Disposing canvas...');
                fabricCanvas.dispose();
                setCanvas(null);
            };
        }
    }, []);

    const saveState = useCallback(() => {
        if (!canvas) return;
        const json = JSON.stringify(canvas.toJSON());
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(json);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    }, [canvas, history, historyStep]);

    const undo = useCallback(() => {
        if (historyStep > 0 && canvas) {
            const prevState = history[historyStep - 1];
            canvas.loadFromJSON(prevState).then(() => {
                canvas.renderAll();
                setHistoryStep(historyStep - 1);
            });
        }
    }, [canvas, history, historyStep]);

    const redo = useCallback(() => {
        if (historyStep < history.length - 1 && canvas) {
            const nextState = history[historyStep + 1];
            canvas.loadFromJSON(nextState).then(() => {
                canvas.renderAll();
                setHistoryStep(historyStep + 1);
            });
        }
    }, [canvas, history, historyStep]);

    const handleFileDropped = useCallback((files: File[]) => {
        console.log('handleFileDropped called with', files.length, 'files');
        console.log('Canvas state:', canvas ? 'initialized' : 'null');

        if (files.length > 0) {
            if (!canvas) {
                console.error('Canvas not initialized yet!');
                alert('Please wait for the editor to initialize and try again.');
                return;
            }

            const file = files[0];
            console.log('Processing file:', file.name, file.type);
            setSourceImage(file);
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const imgUrl = e.target?.result as string;
                    console.log('Loading image...');
                    const img = await fabric.FabricImage.fromURL(imgUrl);
                    console.log('Image loaded:', img.width, img.height);

                    // Calculate scale to cover the entire canvas
                    const canvasWidth = canvas.width || 800;
                    const canvasHeight = canvas.height || 600;
                    const scaleX = canvasWidth / (img.width || 1);
                    const scaleY = canvasHeight / (img.height || 1);
                    const scale = Math.max(scaleX, scaleY); // Use max to cover, min to fit

                    img.scale(scale);
                    img.selectable = false;

                    // Center the image
                    img.set({
                        left: (canvasWidth - (img.width || 0) * scale) / 2,
                        top: (canvasHeight - (img.height || 0) * scale) / 2
                    });

                    canvas.backgroundImage = img;
                    backgroundImageRef.current = img;
                    canvas.renderAll();
                    console.log('Canvas updated with centered image');
                    saveState();
                } catch (error) {
                    console.error('Error loading image:', error);
                    alert('Failed to load image. Please try again.');
                }
            };
            reader.onerror = (error) => {
                console.error('FileReader error:', error);
                alert('Failed to read file. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    }, [canvas, saveState]);

    const addText = useCallback(() => {
        if (!canvas) return;
        const text = new fabric.IText('Click to edit', {
            left: 100,
            top: 100,
            fontSize: fontSize,
            fill: fillColor,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    }, [canvas, fontSize, fillColor]);

    const addShape = useCallback((type: 'rectangle' | 'circle' | 'triangle') => {
        if (!canvas) return;
        let shape: fabric.FabricObject;

        const options = {
            left: 100,
            top: 100,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
        };

        switch (type) {
            case 'rectangle':
                shape = new fabric.Rect({ ...options, width: 100, height: 100 });
                break;
            case 'circle':
                shape = new fabric.Circle({ ...options, radius: 50 });
                break;
            case 'triangle':
                shape = new fabric.Triangle({ ...options, width: 100, height: 100 });
                break;
        }

        canvas.add(shape);
        canvas.setActiveObject(shape);
    }, [canvas, fillColor, strokeColor, strokeWidth]);

    const rotate = useCallback(async (angle: number) => {
        if (!canvas || !backgroundImageRef.current) return;

        // Get the current background image element
        const currentBg = backgroundImageRef.current;
        const currentImg = currentBg.getElement() as HTMLImageElement;

        // Create temporary canvas for rotation
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        if (!ctx || !currentImg) return;

        // For 90 and 270 degree rotations, swap width/height
        if (angle === 90 || angle === 270 || angle === -90 || angle === -270) {
            tempCanvas.width = currentImg.height;
            tempCanvas.height = currentImg.width;
        } else {
            tempCanvas.width = currentImg.width;
            tempCanvas.height = currentImg.height;
        }

        // Translate to center, rotate, then translate back
        ctx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(currentImg, -currentImg.width / 2, -currentImg.height / 2);

        // Load rotated image back
        const rotatedUrl = tempCanvas.toDataURL();
        const newImg = await fabric.FabricImage.fromURL(rotatedUrl);

        // Use the SAME scale logic as initial upload
        const canvasWidth = canvas.width || 800;
        const canvasHeight = canvas.height || 600;
        const scaleX = canvasWidth / (newImg.width || 1);
        const scaleY = canvasHeight / (newImg.height || 1);
        const scale = Math.max(scaleX, scaleY);

        newImg.scale(scale);
        newImg.selectable = false;
        newImg.set({
            left: (canvasWidth - (newImg.width || 0) * scale) / 2,
            top: (canvasHeight - (newImg.height || 0) * scale) / 2
        });

        canvas.backgroundImage = newImg;
        backgroundImageRef.current = newImg;
        canvas.renderAll();
        saveState();
    }, [canvas, saveState]);

    const flip = useCallback(async (direction: 'horizontal' | 'vertical') => {
        if (!canvas || !backgroundImageRef.current) return;

        // Export current canvas to data URL
        const dataUrl = canvas.toDataURL();
        const img = new Image();

        img.onload = async () => {
            // Create temporary canvas for flipping
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            const ctx = tempCanvas.getContext('2d');
            if (!ctx) return;

            // Apply flip transformation
            if (direction === 'horizontal') {
                ctx.translate(tempCanvas.width, 0);
                ctx.scale(-1, 1);
            } else {
                ctx.translate(0, tempCanvas.height);
                ctx.scale(1, -1);
            }

            ctx.drawImage(img, 0, 0);

            // Load flipped image back
            const flippedUrl = tempCanvas.toDataURL();
            const newImg = await fabric.FabricImage.fromURL(flippedUrl);

            // Scale to COVER (same as initial upload) - use Math.max
            const canvasWidth = canvas.width || 800;
            const canvasHeight = canvas.height || 600;
            const scaleX = canvasWidth / (newImg.width || 1);
            const scaleY = canvasHeight / (newImg.height || 1);
            const scale = Math.max(scaleX, scaleY); // Match initial upload behavior

            newImg.scale(scale);
            newImg.selectable = false;
            newImg.set({
                left: (canvasWidth - (newImg.width || 0) * scale) / 2,
                top: (canvasHeight - (newImg.height || 0) * scale) / 2
            });

            canvas.backgroundImage = newImg;
            backgroundImageRef.current = newImg;
            canvas.renderAll();
            saveState();
        };

        img.src = dataUrl;
    }, [canvas, saveState]);

    const startCrop = useCallback(() => {
        if (!canvas) return;
        setIsCropping(true);

        // Create a semi-transparent rectangle for cropping
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 300,
            height: 300,
            fill: 'rgba(0,0,0,0.3)',
            stroke: '#3b82f6',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            selectable: true,
            hasControls: true
        });

        canvas.add(rect);
        canvas.setActiveObject(rect);
        setCropRect(rect);
        canvas.renderAll();
    }, [canvas]);

    const applyCrop = useCallback(() => {
        if (!canvas || !cropRect || !backgroundImageRef.current) return;

        const cropData = {
            left: cropRect.left || 0,
            top: cropRect.top || 0,
            width: (cropRect.width || 0) * (cropRect.scaleX || 1),
            height: (cropRect.height || 0) * (cropRect.scaleY || 1)
        };

        // IMPORTANT: Remove crop rectangle BEFORE exporting to avoid crop lines in image
        canvas.remove(cropRect);
        canvas.renderAll();

        // Create a new canvas to crop the image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = cropData.width;
        tempCanvas.height = cropData.height;
        const ctx = tempCanvas.getContext('2d');

        if (ctx && canvas.backgroundImage) {
            // Export current canvas to image (without crop rectangle)
            const dataUrl = canvas.toDataURL();
            const img = new Image();
            img.onload = async () => {
                ctx.drawImage(
                    img,
                    cropData.left, cropData.top,
                    cropData.width, cropData.height,
                    0, 0,
                    cropData.width, cropData.height
                );

                const croppedUrl = tempCanvas.toDataURL();
                const newImg = await fabric.FabricImage.fromURL(croppedUrl);

                // Calculate scale to fit the cropped image in the current canvas
                const canvasWidth = canvas.width || 800;
                const canvasHeight = canvas.height || 600;
                const scaleX = canvasWidth / (newImg.width || 1);
                const scaleY = canvasHeight / (newImg.height || 1);
                const scale = Math.min(scaleX, scaleY);

                newImg.scale(scale);
                newImg.selectable = false;

                // Center the cropped image
                newImg.set({
                    left: (canvasWidth - (newImg.width || 0) * scale) / 2,
                    top: (canvasHeight - (newImg.height || 0) * scale) / 2
                });

                // Update background image (keeps canvas size)
                canvas.backgroundImage = newImg;
                backgroundImageRef.current = newImg;

                canvas.renderAll();
                setCropRect(null);
                setIsCropping(false);

                // Save state for undo
                saveState();
            };
            img.src = dataUrl;
        }
    }, [canvas, cropRect, saveState]);

    const cancelCrop = useCallback(() => {
        if (!canvas || !cropRect) return;
        canvas.remove(cropRect);
        setCropRect(null);
        setIsCropping(false);
        canvas.renderAll();
    }, [canvas, cropRect]);

    const applyFilter = useCallback((type: 'brightness' | 'contrast' | 'saturation', value: number) => {
        if (!canvas || !backgroundImageRef.current) return;
        const bgImage = backgroundImageRef.current;

        // Remove existing filters of the same type
        bgImage.filters = (bgImage.filters || []).filter((f: any) => {
            if (type === 'brightness' && f.type === 'Brightness') return false;
            if (type === 'contrast' && f.type === 'Contrast') return false;
            if (type === 'saturation' && f.type === 'Saturation') return false;
            return true;
        });

        // Add new filter
        if (value !== 0) {
            if (type === 'brightness') {
                bgImage.filters.push(new fabric.filters.Brightness({ brightness: value / 100 }));
            } else if (type === 'contrast') {
                bgImage.filters.push(new fabric.filters.Contrast({ contrast: value / 100 }));
            } else if (type === 'saturation') {
                bgImage.filters.push(new fabric.filters.Saturation({ saturation: value / 100 }));
            }
        }

        bgImage.applyFilters();
        canvas.renderAll();
    }, [canvas]);

    const clearCanvas = useCallback(() => {
        if (!canvas) return;
        const objects = canvas.getObjects();
        objects.forEach((obj: fabric.FabricObject) => canvas.remove(obj));
        canvas.renderAll();
        saveState();
    }, [canvas, saveState]);

    const downloadImage = useCallback(() => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `edited-${sourceImage?.name || 'image.png'}`;
        link.click();
    }, [canvas, sourceImage]);

    useEffect(() => {
        applyFilter('brightness', brightness);
    }, [brightness, applyFilter]);

    useEffect(() => {
        applyFilter('contrast', contrast);
    }, [contrast, applyFilter]);

    useEffect(() => {
        applyFilter('saturation', saturation);
    }, [saturation, applyFilter]);

    return (
        <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Edit3 className="text-indigo-600" />
                    {t('imageEditor.title')}
                </h2>

                <div className="flex flex-col gap-4">
                    {/* Canvas - always visible */}
                    <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mx-auto">
                        <canvas ref={canvasRef} />
                        {!sourceImage && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-opacity-90">
                                <DropZone onFilesDropped={handleFileDropped} className="w-full h-full min-h-[400px]" />
                            </div>
                        )}
                    </div>

                    {sourceImage && (
                        <>
                            {/* Tabs */}
                            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setActiveTab('draw')}
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'draw'
                                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                                        : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {t('imageEditor.draw')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('transform')}
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'transform'
                                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                                        : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {t('imageEditor.transform')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('adjust')}
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'adjust'
                                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                                        : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {t('imageEditor.adjust')}
                                </button>
                            </div>

                            {/* Tools */}
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                {activeTab === 'draw' && (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <button onClick={addText} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <Type size={18} /> {t('imageEditor.text')}
                                            </button>
                                            <button onClick={() => addShape('rectangle')} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <Square size={18} /> {t('imageEditor.rectangle')}
                                            </button>
                                            <button onClick={() => addShape('circle')} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <Circle size={18} /> {t('imageEditor.circle')}
                                            </button>
                                            <button onClick={() => addShape('triangle')} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <Triangle size={18} /> {t('imageEditor.triangle')}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-400">{t('imageEditor.fillColor')}</label>
                                                <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-400">{t('imageEditor.strokeColor')}</label>
                                                <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600 dark:text-gray-400">{t('imageEditor.fontSize')}</label>
                                                <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full px-3 py-2 rounded border dark:bg-gray-800" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'transform' && (
                                    <div className="space-y-3">
                                        {!isCropping ? (
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={startCrop} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                                    {t('imageEditor.crop')}
                                                </button>
                                                <button onClick={() => rotate(90)} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <RotateCw size={18} /> {t('imageEditor.rotate90')}
                                                </button>
                                                <button onClick={() => rotate(180)} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <RotateCw size={18} /> {t('imageEditor.rotate180')}
                                                </button>
                                                <button onClick={() => flip('horizontal')} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <FlipHorizontal size={18} /> {t('imageEditor.flipH')}
                                                </button>
                                                <button onClick={() => flip('vertical')} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <FlipVertical size={18} /> {t('imageEditor.flipV')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{t('imageEditor.adjustCropArea')}</p>
                                                <div className="flex gap-2">
                                                    <button onClick={applyCrop} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                                        {t('imageEditor.applyCrop')}
                                                    </button>
                                                    <button onClick={cancelCrop} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                                                        {t('imageEditor.cancelCrop')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'adjust' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400">{t('imageEditor.brightness')}: {brightness}</label>
                                            <input type="range" min="-100" max="100" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400">{t('imageEditor.contrast')}: {contrast}</label>
                                            <input type="range" min="-100" max="100" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400">{t('imageEditor.saturation')}: {saturation}</label>
                                            <input type="range" min="-100" max="100" value={saturation} onChange={(e) => setSaturation(parseInt(e.target.value))} className="w-full" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-between">
                                <div className="flex gap-2">
                                    <button onClick={undo} disabled={historyStep <= 0} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30">
                                        <Undo size={20} />
                                    </button>
                                    <button onClick={redo} disabled={historyStep >= history.length - 1} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30">
                                        <Redo size={20} />
                                    </button>
                                    <button onClick={clearCanvas} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <button onClick={downloadImage} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    <Download size={20} /> {t('imageEditor.download')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
