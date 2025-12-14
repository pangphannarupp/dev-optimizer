import React, { useState, useRef, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';
import { Play, Pause, Square, Repeat, Rewind, FastForward, Film, Trash2, Download, Palette, Type, Settings, Image as ImageIcon, Layers, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { clsx } from 'clsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { convertSVGToLottie } from '../utils/svgToLottie';

// Helper to convert 0-1 array to hex
const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Helper to convert hex to 0-1 array
const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ] : [0, 0, 0];
};

export const LottiePlayer: React.FC = () => {
    const { t } = useTranslation();
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [animationData, setAnimationData] = useState<any>(null);
    const [fileName, setFileName] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLooping, setIsLooping] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'controls' | 'colors' | 'text' | 'settings' | 'layers'>('controls');

    // Editor State
    const [colors, setColors] = useState<string[]>([]);
    const [textLayers, setTextLayers] = useState<{ id: string; text: string; name?: string }[]>([]);
    const [properties, setProperties] = useState<{ w: number; h: number; fr: number }>({ w: 0, h: 0, fr: 0 });

    useEffect(() => {
        if (animationData) {
            extractData(animationData);
        } else {
            resetEditorState();
        }
    }, [animationData]);

    const resetEditorState = () => {
        setColors([]);
        setTextLayers([]);
        setProperties({ w: 0, h: 0, fr: 0 });
    };

    const extractData = (data: any) => {
        const foundColors: Set<string> = new Set();
        const foundTextLayers: { id: string; text: string; name?: string }[] = [];

        // Extract Global Properties
        setProperties({
            w: data.w || 0,
            h: data.h || 0,
            fr: data.fr || 0
        });

        // Helper to process a color array [r, g, b, ...]
        const processColorArray = (arr: number[]) => {
            if (arr.length >= 3 && typeof arr[0] === 'number') {
                const [r, g, b] = arr;
                if (r <= 1 && g <= 1 && b <= 1) {
                    foundColors.add(rgbToHex(r, g, b));
                }
            }
        };

        const traverse = (obj: any) => {
            if (!obj || typeof obj !== 'object') return;

            // 1. Color Detection
            if (obj.c && obj.c.k) {
                // Static color
                if (Array.isArray(obj.c.k) && typeof obj.c.k[0] === 'number') {
                    processColorArray(obj.c.k);
                }
                // Keyframed color
                else if (Array.isArray(obj.c.k) && typeof obj.c.k[0] === 'object') {
                    obj.c.k.forEach((k: any) => {
                        if (k.s && Array.isArray(k.s)) processColorArray(k.s);
                        if (k.e && Array.isArray(k.e)) processColorArray(k.e);
                    });
                }
            }

            // 2. Text Layer Detection (ty: 5)
            if (obj.ty === 5 && obj.t && obj.t.d && obj.t.d.k) {
                const textData = obj.t.d.k;
                if (Array.isArray(textData) && textData.length > 0) {
                    const firstKeyframe = textData[0];
                    if (firstKeyframe.s && firstKeyframe.s.t) {
                        foundTextLayers.push({
                            id: obj.ind || Math.random().toString(),
                            text: firstKeyframe.s.t,
                            name: obj.nm
                        });
                    }
                }
            }

            Object.values(obj).forEach(val => {
                if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
                    traverse(val);
                }
            });
        };

        traverse(data);
        setColors(Array.from(foundColors));
        setTextLayers(foundTextLayers);
    };

    const handleColorChange = (oldColor: string, newColor: string) => {
        if (!animationData) return;

        const newData = JSON.parse(JSON.stringify(animationData));
        const [targetR, targetG, targetB] = hexToRgb(oldColor);
        const [newR, newG, newB] = hexToRgb(newColor);
        const tolerance = 0.001;

        const matchesColor = (r: number, g: number, b: number) => {
            return Math.abs(r - targetR) < tolerance &&
                Math.abs(g - targetG) < tolerance &&
                Math.abs(b - targetB) < tolerance;
        };

        const updateColorArray = (arr: number[]) => {
            if (arr.length >= 3 && matchesColor(arr[0], arr[1], arr[2])) {
                arr[0] = newR;
                arr[1] = newG;
                arr[2] = newB;
                return true;
            }
            return false;
        };

        const traverse = (obj: any) => {
            if (!obj || typeof obj !== 'object') return;
            if (obj.c && obj.c.k) {
                if (Array.isArray(obj.c.k) && typeof obj.c.k[0] === 'number') updateColorArray(obj.c.k);
                else if (Array.isArray(obj.c.k) && typeof obj.c.k[0] === 'object') {
                    obj.c.k.forEach((k: any) => {
                        if (k.s && Array.isArray(k.s)) updateColorArray(k.s);
                        if (k.e && Array.isArray(k.e)) updateColorArray(k.e);
                    });
                }
            }
            Object.values(obj).forEach(val => {
                if (Array.isArray(val) || (typeof val === 'object' && val !== null)) traverse(val);
            });
        };

        traverse(newData);
        setAnimationData(newData);
    };

    const handleTextChange = (originalText: string, newText: string) => {
        if (!animationData) return;
        const newData = JSON.parse(JSON.stringify(animationData));
        const traverse = (obj: any) => {
            if (!obj || typeof obj !== 'object') return;
            if (obj.ty === 5 && obj.t && obj.t.d && obj.t.d.k) {
                const textData = obj.t.d.k;
                if (Array.isArray(textData)) {
                    textData.forEach((k: any) => {
                        if (k.s && k.s.t === originalText) k.s.t = newText;
                    });
                }
            }
            Object.values(obj).forEach(val => {
                if (Array.isArray(val) || (typeof val === 'object' && val !== null)) traverse(val);
            });
        };
        traverse(newData);
        setAnimationData(newData);
        setTextLayers(prev => prev.map(l => l.text === originalText ? { ...l, text: newText } : l));
    };

    const handlePropertyChange = (key: 'w' | 'h' | 'fr', value: number) => {
        if (!animationData) return;
        const newData = { ...animationData, [key]: value };
        setAnimationData(newData);
        setProperties(prev => ({ ...prev, [key]: value }));
    };

    // --- Layer Management ---
    const handleToggleLayer = (index: number) => {
        if (!animationData || !animationData.layers) return;
        const newData = { ...animationData };
        // Determine hidden status. If hd is undefined, it is visible.
        const layer = newData.layers[index];
        layer.hd = !layer.hd;
        setAnimationData(newData);
    };

    const handleDeleteLayer = (index: number) => {
        if (!animationData || !animationData.layers) return;
        const newData = { ...animationData };
        newData.layers.splice(index, 1);
        setAnimationData(newData);
    };

    const handleMoveLayer = (index: number, direction: 'up' | 'down') => {
        if (!animationData || !animationData.layers) return;
        const newData = { ...animationData };
        const layers = newData.layers;
        if (direction === 'up') {
            if (index === 0) return;
            [layers[index], layers[index - 1]] = [layers[index - 1], layers[index]];
        } else {
            if (index === layers.length - 1) return;
            [layers[index], layers[index + 1]] = [layers[index + 1], layers[index]];
        }
        setAnimationData(newData);
    };

    const handleFileUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const sortedFiles = Array.from(files).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
        const firstFile = sortedFiles[0];

        const isJson = firstFile.type === 'application/json' || firstFile.name.endsWith('.json');
        const isLottie = firstFile.name.endsWith('.lottie');
        const isSvg = firstFile.type === 'image/svg+xml' || firstFile.name.endsWith('.svg');

        if (!isJson && !isLottie && !isSvg) {
            setError(t('lottie.invalidFile', 'Please upload a valid JSON, .lottie, or .svg file'));
            return;
        }

        try {
            if (isSvg) {
                const svgStrings = await Promise.all(sortedFiles.map(f => f.text()));
                const convertedJson = convertSVGToLottie(svgStrings);
                setAnimationData(convertedJson);
                setFileName(sortedFiles.length > 1 ? t('lottie.svgSequence', { count: sortedFiles.length }) : firstFile.name);
                setError(null);
                // Switch to Layers tab if multiple SVGs
                if (sortedFiles.length > 1) setActiveTab('layers');

            } else if (isLottie) {
                const zip = new JSZip();
                const zipContent = await zip.loadAsync(firstFile);
                let animationJson: string | null = null;
                const manifestFile = zipContent.file('manifest.json');
                if (manifestFile) {
                    const manifestStr = await manifestFile.async('string');
                    const manifest = JSON.parse(manifestStr);
                    if (manifest.animations && manifest.animations.length > 0) {
                        const animId = manifest.activeAnimationId || manifest.animations[0].id;
                        const animEntry = manifest.animations.find((a: any) => a.id === animId);
                        if (animEntry) {
                            const animPath = `animations/${animEntry.id}.json`;
                            const animFile = zipContent.file(animPath);
                            if (animFile) animationJson = await animFile.async('string');
                        }
                    }
                }
                if (!animationJson) {
                    const jsonFiles = Object.keys(zipContent.files).filter(path => path.endsWith('.json') && path !== 'manifest.json');
                    if (jsonFiles.length > 0) {
                        const preferred = jsonFiles.find(f => f.startsWith('animations/')) || jsonFiles[0];
                        animationJson = await zipContent.file(preferred)?.async('string') || null;
                    }
                }
                if (animationJson) {
                    setAnimationData(JSON.parse(animationJson));
                    setFileName(firstFile.name);
                    setError(null);
                } else throw new Error('No valid animation data found in .lottie file');

            } else {
                const text = await firstFile.text();
                setAnimationData(JSON.parse(text));
                setFileName(firstFile.name);
                setError(null);
            }
            setIsPlaying(true);
            setSpeed(1);
            setDirection(1);
            if (!isSvg) setActiveTab('controls'); // Reset to controls for normal Lottie
        } catch (e) {
            console.error(e);
            setError(t('lottie.parseError', 'Failed to parse file'));
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) lottieRef.current?.pause();
        else lottieRef.current?.play();
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        lottieRef.current?.stop();
        setIsPlaying(false);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        lottieRef.current?.setSpeed(newSpeed);
    };

    const handleDirectionToggle = () => {
        const newDirection = direction === 1 ? -1 : 1;
        setDirection(newDirection);
        lottieRef.current?.setDirection(newDirection);
    };

    const handleClear = () => {
        setAnimationData(null);
        setFileName('');
        setIsPlaying(true);
        setSpeed(1);
        setDirection(1);
        resetEditorState();
    };

    const handleExport = () => {
        if (!animationData) return;
        const blob = new Blob([JSON.stringify(animationData, null, 2)], { type: 'application/json' });
        const nameKey = fileName.replace(/\.(json|lottie|svg)$/, '');
        saveAs(blob, `${nameKey}_edited.json`);
    };

    return (
        <div className="h-full flex flex-col p-6 max-w-[1600px] mx-auto w-full relative font-khmer">
            <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-3">
                <Film className="text-pink-500" size={32} />
                {t('lottie.title', 'Lottie Player')}
            </h1>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-y-auto lg:overflow-hidden min-h-0">
                {/* Player Area */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-0 relative shrink-0">
                    <div
                        className="flex-1 flex items-center justify-center p-8 relative transition-colors duration-300 min-h-[400px]"
                        style={{ backgroundColor: animationData ? bgColor : 'transparent' }}
                    >
                        {!animationData ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-full max-w-xl">
                                    <DropZone
                                        onFilesDropped={handleFileUpload}
                                        accept=".json,.lottie,.svg"
                                        multiple={true}
                                        className="bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 h-64 flex flex-col items-center justify-center"
                                    />
                                    <p className="text-xs text-center mt-4 text-slate-400 dark:text-gray-500">
                                        {t('lottie.supportInfo', 'Supports .json, .lottie, and .svg (single or multiple for sequence)')}
                                    </p>
                                    {error && (
                                        <p className="mt-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={animationData}
                                loop={isLooping}
                                autoplay={true}
                                className="w-full h-full max-w-[800px] max-h-[800px]"
                            />
                        )}
                    </div>

                    {/* Toolbar - Only show when data exists */}
                    {animationData && (
                        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shrink-0 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2 max-w-[200px]" title={fileName}>
                                <ImageIcon size={16} className="text-slate-400 flex-shrink-0" />
                                <div className="text-sm font-medium text-slate-600 dark:text-gray-300 truncate">
                                    {fileName}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDirectionToggle}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-slate-600 dark:text-gray-300 transition-colors"
                                    title={t('lottie.direction', 'Toggle Direction')}
                                >
                                    {direction === 1 ? <FastForward size={20} /> : <Rewind size={20} />}
                                </button>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                <button
                                    onClick={handleStop}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-slate-600 dark:text-gray-300 transition-colors"
                                    title={t('lottie.stop', 'Stop')}
                                >
                                    <Square size={20} className="fill-current" />
                                </button>
                                <button
                                    onClick={handlePlayPause}
                                    className="p-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg hover:shadow-pink-500/30 transition-all active:scale-95"
                                    title={isPlaying ? t('lottie.pause', 'Pause') : t('lottie.play', 'Play')}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                                >
                                    <Download size={16} />
                                    {t('common.export', 'Export JSON')}
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                    {t('common.clear', 'Clear')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls Sidebar */}
                <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 h-auto lg:h-full overflow-hidden">

                    <div className="bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg flex shrink-0 justify-between">
                        {[
                            { id: 'controls', label: t('lottie.controls', 'Controls'), icon: Play },
                            { id: 'layers', label: t('lottie.layers', 'Layers'), icon: Layers },
                            { id: 'colors', label: t('lottie.colors', 'Colors'), icon: Palette },
                            { id: 'text', label: t('lottie.text', 'Text'), icon: Type },
                            { id: 'settings', label: t('lottie.settings', 'Settings'), icon: Settings },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                disabled={!animationData}
                                className={clsx(
                                    "flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-md text-[10px] font-medium transition-all sm:flex-row sm:text-sm",
                                    activeTab === tab.id && animationData
                                        ? "bg-white dark:bg-gray-800 text-slate-800 dark:text-white shadow-sm"
                                        : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200",
                                    !animationData && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <tab.icon size={16} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-0 relative">
                        {/* Overlay when disabled */}
                        {!animationData && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-xl">
                                <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">{t('lottie.uploadToEdit')}</p>
                            </div>
                        )}

                        {/* CONTROLS TAB */}
                        {activeTab === 'controls' && (
                            <>
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
                                        {t('lottie.playback', 'Playback')}
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">
                                                    {t('lottie.speed', 'Speed')}
                                                </label>
                                                <span className="text-xs font-mono bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded text-slate-600 dark:text-gray-300">
                                                    {speed}x
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="5"
                                                step="0.1"
                                                value={speed}
                                                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                            />
                                            <div className="flex justify-between mt-2 text-xs text-slate-400">
                                                <button onClick={() => handleSpeedChange(0.5)} className="hover:text-pink-500">0.5x</button>
                                                <button onClick={() => handleSpeedChange(1)} className="hover:text-pink-500">1x</button>
                                                <button onClick={() => handleSpeedChange(2)} className="hover:text-pink-500">2x</button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-600 dark:text-gray-400 flex items-center gap-2">
                                                <Repeat size={16} />
                                                {t('lottie.loop', 'Loop Animation')}
                                            </label>
                                            <button
                                                onClick={() => setIsLooping(!isLooping)}
                                                className={clsx(
                                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2",
                                                    isLooping ? 'bg-pink-500' : 'bg-gray-200 dark:bg-gray-700'
                                                )}
                                            >
                                                <span
                                                    className={clsx(
                                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                        isLooping ? 'translate-x-6' : 'translate-x-1'
                                                    )}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
                                        {t('lottie.appearance', 'Appearance')}
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
                                            {t('lottie.backgroundColor', 'Background Color')}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <input
                                                    type="color"
                                                    value={bgColor}
                                                    onChange={(e) => setBgColor(e.target.value)}
                                                    className="w-10 h-10 rounded cursor-pointer opacity-0 absolute inset-0 z-10"
                                                />
                                                <div className="w-10 h-10 rounded border border-gray-200 dark:border-gray-600" style={{ backgroundColor: bgColor }}></div>
                                            </div>

                                            <input
                                                type="text"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-sm font-mono dark:text-white uppercase"
                                                maxLength={7}
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            {['#ffffff', '#000000', '#1e293b', '#f1f5f9'].map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setBgColor(color)}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* LAYERS TAB */}
                        {activeTab === 'layers' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
                                    {t('lottie.layers', 'Layers')}
                                </h3>

                                {animationData && animationData.layers ? (
                                    <div className="space-y-2">
                                        {animationData.layers.map((layer: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700/50 group">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <span className="text-xs font-mono text-slate-400 w-4">{idx + 1}</span>
                                                    <div className={clsx(
                                                        "text-sm font-medium truncate",
                                                        layer.hd ? "text-slate-400 line-through" : "text-slate-700 dark:text-gray-200"
                                                    )}>
                                                        {layer.nm || `${t('lottie.layer')} ${idx + 1}`}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleMoveLayer(idx, 'up')}
                                                        disabled={idx === 0}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-slate-500 disabled:opacity-30"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleMoveLayer(idx, 'down')}
                                                        disabled={idx === animationData.layers.length - 1}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-slate-500 disabled:opacity-30"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleLayer(idx)}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-slate-500"
                                                    >
                                                        {layer.hd ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLayer(idx)}
                                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {animationData.layers.length === 0 && (
                                            <div className="text-center text-sm text-slate-500 py-4">{t('lottie.noLayers')}</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <Layers className="mx-auto mb-2 opacity-50" size={32} />
                                        <p className="text-sm">{t('lottie.noLayers', 'No layers found')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* COLORS TAB */}
                        {activeTab === 'colors' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-white">
                                        {t('lottie.palette', 'Detected Colors')}
                                    </h3>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                                        {colors.length}
                                    </span>
                                </div>

                                {colors.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-3">
                                        {colors.map((color, idx) => (
                                            <div key={`${color}-${idx}`} className="group relative">
                                                <div
                                                    className="w-full aspect-square rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => handleColorChange(color, e.target.value)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="opacity-0 group-hover:opacity-100 absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                                    {color}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <Palette className="mx-auto mb-2 opacity-50" size={32} />
                                        <p className="text-sm">{t('lottie.noColors', 'No colors detected')}</p>
                                    </div>
                                )}

                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-lg">
                                    {t('lottie.colorTip', 'Click on any color circle to pick a new color and replace all occurrences.')}
                                </div>
                            </div>
                        )}

                        {/* TEXT TAB */}
                        {activeTab === 'text' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
                                    {t('lottie.textLayers', 'Text Layers')}
                                </h3>

                                {textLayers.length > 0 ? (
                                    <div className="space-y-4">
                                        {textLayers.map((layer) => (
                                            <div key={layer.id} className="space-y-1">
                                                <label className="text-xs font-medium text-slate-500 dark:text-gray-400">
                                                    {layer.name || t('lottie.textLayer')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={layer.text}
                                                    onChange={(e) => handleTextChange(layer.text, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <Type className="mx-auto mb-2 opacity-50" size={32} />
                                        <p className="text-sm">{t('lottie.noText', 'No text layers found')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
                                    {t('lottie.properties', 'Animation Properties')}
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1">
                                                {t('lottie.width', 'Width (px)')}
                                            </label>
                                            <input
                                                type="number"
                                                value={properties.w}
                                                onChange={(e) => handlePropertyChange('w', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1">
                                                {t('lottie.height', 'Height (px)')}
                                            </label>
                                            <input
                                                type="number"
                                                value={properties.h}
                                                onChange={(e) => handlePropertyChange('h', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1">
                                            {t('lottie.fps', 'Frame Rate (FPS)')}
                                        </label>
                                        <input
                                            type="number"
                                            value={properties.fr}
                                            onChange={(e) => handlePropertyChange('fr', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                                        />
                                    </div>

                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 text-xs rounded-lg border border-yellow-100 dark:border-yellow-900/50">
                                        {t('lottie.propsWarning', 'Changing dimensions or frame rate may affect animation playback speed and layout.')}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};
