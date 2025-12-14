import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';
import { Download, Smartphone, Monitor, Type, Image as ImageIcon, BoxSelect } from 'lucide-react';
import { clsx } from 'clsx';


// Device Definitions
type DeviceType = 'iphone' | 'pixel' | 'browser' | 'none';

interface DeviceConfig {
    name: string;
    width: number;
    height: number;
    screenX: number;
    screenY: number;
    screenWidth: number;
    screenHeight: number;
    cornerRadius: number;
    frameColor: string;
    bezelWidth?: number; // Deprecated, use screenX calculation
}

const DEVICES: Record<DeviceType, DeviceConfig> = {
    iphone: {
        name: 'iPhone 15 Pro',
        width: 1200,
        height: 2550, // Taller for Dynamic Island space at top
        screenX: 60,
        screenY: 60,
        screenWidth: 1080,
        screenHeight: 2430,
        cornerRadius: 140, // More rounded
        frameColor: '#2b2b2b'
    },
    pixel: {
        name: 'Pixel 8',
        width: 1080,
        height: 2400,
        screenX: 40,
        screenY: 40,
        screenWidth: 1000,
        screenHeight: 2320,
        cornerRadius: 80,
        frameColor: '#3c4043'
    },
    browser: {
        name: 'Browser Window',
        width: 1400,
        height: 900,
        screenX: 0,
        screenY: 80,
        screenWidth: 1400,
        screenHeight: 820,
        cornerRadius: 20,
        frameColor: '#ffffff'
    },
    none: {
        name: 'No Frame',
        width: 1000,
        height: 1000,
        screenX: 0,
        screenY: 0,
        screenWidth: 1000,
        screenHeight: 1000,
        cornerRadius: 0,
        frameColor: 'transparent'
    }
};

const BACKGROUNDS = [
    { name: 'Transparent', value: 'transparent' },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Blue Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Sunset', value: '#ff9a9e' },
    { name: 'Mint', value: '#a8edea' },
];

export const ScreenshotFramer: React.FC = () => {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<DeviceType>('iphone');
    const [image, setImage] = useState<File | null>(null);
    const [bgColor, setBgColor] = useState<string>('#ffffff');
    const [padding, setPadding] = useState<number>(100);
    const [caption, setCaption] = useState<string>('');

    // Initialize Canvas
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: '#f3f4f6',
            selection: false
        });

        setFabricCanvas(canvas);

        return () => {
            canvas.dispose();
        };
    }, []);

    // Helper to generate Rounded Rect Path (Clockwise)
    const getRoundedRectPath = (x: number, y: number, w: number, h: number, r: number) => {
        return `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
    };

    // Helper to generate Rounded Rect Path (Counter-Clockwise) for Holes
    const getRoundedRectPathCCW = (x: number, y: number, w: number, h: number, r: number) => {
        return `M ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} L ${x} ${y + h - r} Q ${x} ${y + h} ${x + r} ${y + h} L ${x + w - r} ${y + h} Q ${x + w} ${y + h} ${x + w} ${y + h - r} L ${x + w} ${y + r} Q ${x + w} ${y} ${x + w - r} ${y} Z`;
    };

    // Render Scene
    const renderScene = useCallback(async () => {
        if (!fabricCanvas || !image) return;

        fabricCanvas.clear();
        fabricCanvas.backgroundColor = bgColor;

        try {
            // 1. Load User Image
            const imgUrl = URL.createObjectURL(image);
            const imgEl = new Image();
            imgEl.src = imgUrl;
            await new Promise((resolve) => (imgEl.onload = resolve));

            const fabricImage = new fabric.FabricImage(imgEl);
            const device = DEVICES[selectedDevice];

            // 2. Adjust Canvas Dimensions
            const totalWidth = device.width + (padding * 2);
            const totalHeight = device.height + (padding * 2) + (caption ? 400 : 0);

            const scaleFactor = Math.min(800 / totalWidth, 600 / totalHeight);

            fabricCanvas.setDimensions({ width: totalWidth * scaleFactor, height: totalHeight * scaleFactor });
            fabricCanvas.setZoom(scaleFactor);

            // 3. Define Offsets
            const groupLeft = padding;
            const deviceTop = padding + (caption ? 200 : 0);

            // 4. PREPARE LAYERS

            // LAYER 0: SHADOW LAYER (Behind everything)
            // We draw a solid shape matching the device outline just to cast the shadow.
            // This prevents "Inner Shadows" from the Donut Frame casting onto the screen.
            if (selectedDevice !== 'none') {
                const shadowBody = new fabric.Rect({
                    left: groupLeft,
                    top: deviceTop,
                    width: device.width,
                    height: device.height,
                    rx: device.cornerRadius,
                    ry: device.cornerRadius,
                    fill: device.frameColor,
                    shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.4)', blur: 50, offsetX: 0, offsetY: 30 }),
                    selectable: false,
                    evented: false
                });
                fabricCanvas.add(shadowBody);
            }

            // LAYER 1: IMAGE (Background Layer)
            // Fit Image into Screen Area with BLEED to prevent gaps
            const bleed = 40; // Generous bleed to ensure no gaps ever

            const scaleX = (device.screenWidth + bleed) / fabricImage.width!;
            const scaleY = (device.screenHeight + bleed) / fabricImage.height!;
            const imgScale = Math.max(scaleX, scaleY);

            // Position Image (Centered with bleed)
            fabricImage.set({
                scaleX: imgScale,
                scaleY: imgScale,
                left: groupLeft + device.screenX - (bleed / 2),
                top: deviceTop + device.screenY - (bleed / 2),
                originX: 'left',
                originY: 'top',
                selectable: false,
                evented: false,
                // RESTORE CLIP PATH:
                // This is the only way to guarantee the image doesn't "stick out" 
                // if the frame overlay is slightly off or transparent.
                clipPath: new fabric.Rect({
                    left: groupLeft + device.screenX,
                    top: deviceTop + device.screenY,
                    width: device.screenWidth,
                    height: device.screenHeight,
                    rx: selectedDevice === 'browser' ? 0 : Math.max(0, device.cornerRadius - device.screenX),
                    ry: selectedDevice === 'browser' ? 0 : Math.max(0, device.cornerRadius - device.screenX),
                    absolutePositioned: true
                })
            });

            fabricCanvas.add(fabricImage);

            // LAYER 2: DEVICE BODY (The "Donut" Frame)
            if (selectedDevice !== 'none') {
                const outerPath = getRoundedRectPath(groupLeft, deviceTop, device.width, device.height, device.cornerRadius);

                // MATH FIX: Inner Radius should be Concentric
                // InnerR = OuterR - Thickness
                // Thickness = screenX (assuming symmetric bezel)
                const thickness = device.screenX;
                const innerR = Math.max(0, device.cornerRadius - thickness);

                // For Browser, special case (sharp corners at bottom?)
                const finalInnerR = selectedDevice === 'browser' ? 0 : innerR;

                const innerPath = getRoundedRectPathCCW(groupLeft + device.screenX, deviceTop + device.screenY, device.screenWidth, device.screenHeight, finalInnerR);

                const framePathString = outerPath + " " + innerPath;

                const body = new fabric.Path(framePathString, {
                    fill: device.frameColor,
                    // NO SHADOW here! It's handled by Layer 0.
                    // shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 40, offsetX: 0, offsetY: 20 }),
                    fillRule: 'nonzero', // Default rule works with CW/CCW mixing
                    strokeWidth: 0,
                    selectable: false,
                    evented: false
                });
                fabricCanvas.add(body);
            }

            // LAYER 3: DETAILS
            if (selectedDevice !== 'none') {
                if (selectedDevice === 'browser') {
                    const circle1 = new fabric.Circle({ radius: 8, fill: '#ff5f56', left: groupLeft + 20, top: deviceTop + 20, selectable: false, evented: false });
                    const circle2 = new fabric.Circle({ radius: 8, fill: '#ffbd2e', left: groupLeft + 45, top: deviceTop + 20, selectable: false, evented: false });
                    const circle3 = new fabric.Circle({ radius: 8, fill: '#27c93f', left: groupLeft + 70, top: deviceTop + 20, selectable: false, evented: false });
                    const addressBar = new fabric.Rect({ width: device.width - 120, height: 36, fill: '#f1f1f1', rx: 5, ry: 5, left: groupLeft + 100, top: deviceTop + 12, selectable: false, evented: false });

                    fabricCanvas.add(circle1);
                    fabricCanvas.add(circle2);
                    fabricCanvas.add(circle3);
                    fabricCanvas.add(addressBar);
                } else {
                    // Dynamic Notch/island based on device
                    const notchW = selectedDevice === 'iphone' ? 360 : 40;
                    const notchH = selectedDevice === 'iphone' ? 100 : 40;
                    const notchR = 20;

                    const notch = new fabric.Rect({
                        width: notchW,
                        height: notchH,
                        fill: '#000000',
                        rx: notchR,
                        ry: notchR,
                        left: groupLeft + (device.width - notchW) / 2,
                        top: deviceTop + 20,
                        selectable: false,
                        evented: false
                    });
                    fabricCanvas.add(notch);
                }
            }

            // 5. Add Caption
            if (caption) {
                const textObj = new fabric.Textbox(caption, {
                    width: totalWidth, // Span entire width
                    left: 0,           // Start from left edge
                    top: padding,      // Top offset
                    fontSize: 80,
                    textAlign: 'center',
                    fill: '#333333',
                    fontFamily: '-apple-system, BlinkMacSystemFont, Arial, sans-serif',
                    selectable: true,
                    splitByGrapheme: true
                });
                fabricCanvas.add(textObj);
            }

            fabricCanvas.requestRenderAll();
        } catch (error) {
            console.error("Error rendering screenshot frame:", error);
        }

    }, [fabricCanvas, image, selectedDevice, bgColor, padding, caption]);

    useEffect(() => {
        renderScene();
    }, [renderScene]);


    const handleDownload = () => {
        if (!fabricCanvas) return;

        // Revert zoom to 1x for full res export
        const originalZoom = fabricCanvas.getZoom();

        const dataURL = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1 / originalZoom
        });

        const link = document.createElement('a');
        link.download = 'framed_screenshot.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                    <Smartphone className="w-8 h-8 text-blue-500" />
                    {t('screenshotFramer.title', 'Screenshot Framer')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('screenshotFramer.description', 'Create professional device mockups for your app store listings.')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
                {/* Controls Sidebar */}
                <div className="col-span-1 flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-y-auto">

                    {/* Image Upload */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('screenshotFramer.image', 'Screenshot')}</label>
                        {!image ? (
                            <DropZone
                                onFilesDropped={(files) => setImage(files[0])}
                                multiple={false}
                                className="min-h-[140px]" // Use min-height instead of fixed height
                                dragDropText="Drop screenshot here"
                                supportedText="Supports PNG, JPG, WEBP" // Override long text
                            />
                        ) : (
                            <div className="relative group w-full">
                                <img src={URL.createObjectURL(image)} className="w-full h-40 object-contain bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-2" />
                                <button
                                    onClick={() => setImage(null)}
                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600 hover:scale-110"
                                >
                                    <Type size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Device Selector */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('screenshotFramer.device', 'Device Frame')}</label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(DEVICES).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedDevice(key as DeviceType)}
                                    className={clsx("p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-sm transition-all h-24",
                                        selectedDevice === key
                                            ? "bg-blue-500 text-white border-blue-600 shadow-md"
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-gray-400"
                                    )}
                                >
                                    {key === 'browser' ? <Monitor size={24} /> : (key === 'none' ? <BoxSelect size={24} /> : <Smartphone size={24} />)}
                                    <span className="font-medium">{config.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Background */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('screenshotFramer.background', 'Background')}</label>
                        <div className="flex flex-wrap gap-3">
                            {BACKGROUNDS.map(bg => (
                                <button
                                    key={bg.name}
                                    onClick={() => setBgColor(bg.value)}
                                    className={clsx("w-10 h-10 rounded-full border-2 shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative overflow-hidden",
                                        bgColor === bg.value ? "border-blue-500 scale-110" : "border-gray-200 dark:border-gray-600"
                                    )}
                                    style={{ background: bg.value === 'transparent' ? 'white' : bg.value }}
                                    title={bg.name}
                                >
                                    {bg.value === 'transparent' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-px bg-red-500 transform rotate-45 scale-125"></div>
                                        </div>
                                    )}
                                </button>
                            ))}

                            {/* Color Picker Input styled as a circle */}
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-sm transition-transform hover:scale-110 group">
                                <input
                                    type="color"
                                    value={bgColor.startsWith('#') || bgColor.startsWith('rgb') ? bgColor : '#ffffff'}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                />
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-400 group-hover:text-gray-600">
                                    <span className="text-xs">+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Padding & Caption */}
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('screenshotFramer.padding', 'Padding')}</label>
                                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{padding}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="300"
                                value={padding}
                                onChange={(e) => setPadding(Number(e.target.value))}
                                className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('screenshotFramer.caption', 'Caption')}</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                placeholder="Enter caption text..."
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={!image}
                        className="mt-auto w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                        <Download size={24} />
                        {t('screenshotFramer.download', 'Download PNG')}
                    </button>

                </div>

                {/* Canvas Preview */}
                <div className="col-span-1 lg:col-span-2 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 pattern-grid opacity-10 pointer-events-none"></div>
                    <canvas ref={canvasRef} />
                    {!image && (
                        <div className="absolute text-gray-400 flex flex-col items-center gap-2 pointer-events-none">
                            <ImageIcon size={48} />
                            <p>Upload a screenshot to start</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
