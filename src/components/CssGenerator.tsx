import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Sun, Palette, Layers, BoxSelect, Type, Sparkles, Move, Droplets, Scissors } from 'lucide-react';
import { clsx } from 'clsx';
import { Platform, ShadowProps, RadiusProps, GradientProps, TextShadowProps, FilterProps, TransformProps, GlassProps, ClipPathProps, generateShadowCode, generateRadiusCode, generateGradientCode, generateTextShadowCode, generateFilterCode, generateTransformCode, generateGlassCode, generateClipPathCode } from '../utils/CssToMobile';

export const CssGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'shadow' | 'radius' | 'gradient' | 'textShadow' | 'filter' | 'transform' | 'glass' | 'clipPath'>('shadow');
    const [platform, setPlatform] = useState<Platform>('css');
    const [copied, setCopied] = useState(false);

    // --- STATE ---
    const [shadow, setShadow] = useState<ShadowProps>({
        x: 10, y: 10, blur: 20, spread: 0, color: '#000000', inset: false
    });

    const [radius, setRadius] = useState<RadiusProps>({
        tl: 16, tr: 16, br: 16, bl: 16
    });

    const [gradient, setGradient] = useState<GradientProps>({
        type: 'linear', angle: 135,
        stops: [{ color: '#8ec5fc', position: 0 }, { color: '#e0c3fc', position: 1 }]
    });

    const [textShadow, setTextShadow] = useState<TextShadowProps>({
        x: 2, y: 2, blur: 4, color: '#000000'
    });

    const [filter, setFilter] = useState<FilterProps>({
        blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 100, sepia: 0
    });

    const [transform, setTransform] = useState<TransformProps>({
        rotate: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, translateX: 0, translateY: 0
    });

    const [glass, setGlass] = useState<GlassProps>({
        blur: 10, transparency: 0.25, color: '#ffffff', outline: 1
    });

    const [clipPath, setClipPath] = useState<ClipPathProps>({
        type: 'polygon',
        points: [{ x: 50, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 }] // Triangle default
    });

    // --- GENERATED CODE ---
    const getCode = () => {
        switch (activeTab) {
            case 'shadow': return generateShadowCode(shadow, platform);
            case 'radius': return generateRadiusCode(radius, platform);
            case 'gradient': return generateGradientCode(gradient, platform);
            case 'textShadow': return generateTextShadowCode(textShadow, platform);
            case 'filter': return generateFilterCode(filter, platform);
            case 'transform': return generateTransformCode(transform, platform);
            case 'glass': return generateGlassCode(glass, platform);
            case 'clipPath': return generateClipPathCode(clipPath, platform);
            default: return '';
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- PREVIEW STYLES ---
    const getPreviewStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {
            width: '200px', height: '200px',
            backgroundColor: 'white', transition: 'all 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold', color: '#333'
        };

        if (activeTab === 'shadow') {
            style.boxShadow = `${shadow.inset ? 'inset ' : ''}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
            style.borderRadius = '12px';
        } else if (activeTab === 'radius') {
            style.borderRadius = `${radius.tl}px ${radius.tr}px ${radius.br}px ${radius.bl}px`;
            style.border = '2px solid #e2e8f0';
            style.background = 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
        } else if (activeTab === 'gradient') {
            style.borderRadius = '12px';
            const stopsCss = gradient.stops.map(s => `${s.color} ${Math.round(s.position * 100)}%`).join(', ');
            style.background = gradient.type === 'linear'
                ? `linear-gradient(${gradient.angle}deg, ${stopsCss})`
                : `radial-gradient(circle, ${stopsCss})`;
        } else if (activeTab === 'textShadow') {
            style.textShadow = `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${textShadow.color}`;
            style.backgroundColor = 'transparent';
        } else if (activeTab === 'filter') {
            style.filter = `blur(${filter.blur}px) brightness(${filter.brightness}%) contrast(${filter.contrast}%) grayscale(${filter.grayscale}%) hue-rotate(${filter.hueRotate}deg) invert(${filter.invert}%) opacity(${filter.opacity}%) saturate(${filter.saturate}%) sepia(${filter.sepia}%)`;
            style.backgroundImage = 'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80")';
            style.backgroundSize = 'cover';
        } else if (activeTab === 'transform') {
            style.transform = `translate(${transform.translateX}px, ${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scaleX}, ${transform.scaleY}) skew(${transform.skewX}deg, ${transform.skewY}deg)`;
            style.background = 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)';
            style.borderRadius = '12px';
        } else if (activeTab === 'glass') {
            const rgba = (() => {
                const hex = glass.color;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `${r}, ${g}, ${b}`;
            })();
            style.backgroundColor = `rgba(${rgba}, ${glass.transparency})`;
            style.backdropFilter = `blur(${glass.blur}px)`;
            style.WebkitBackdropFilter = `blur(${glass.blur}px)`;
            style.border = `${glass.outline}px solid rgba(255, 255, 255, 0.3)`;
            style.borderRadius = '16px';
        } else if (activeTab === 'clipPath') {
            const polyPoints = clipPath.points.map(p => `${p.x}% ${p.y}%`).join(', ');
            style.clipPath = `polygon(${polyPoints})`;
            style.background = 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)';
            style.width = '200px';
            style.height = '200px';
        }

        return style;
    };

    const loadClipPreset = (type: string) => {
        if (type === 'triangle') setClipPath({ type: 'polygon', points: [{ x: 50, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 }] });
        if (type === 'circle') setClipPath({ type: 'polygon', points: [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }] }); // Diamond approx
        if (type === 'trapezoid') setClipPath({ type: 'polygon', points: [{ x: 20, y: 0 }, { x: 80, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }] });
        if (type === 'parallelogram') setClipPath({ type: 'polygon', points: [{ x: 25, y: 0 }, { x: 100, y: 0 }, { x: 75, y: 100 }, { x: 0, y: 100 }] });
        if (type === 'star') setClipPath({ type: 'polygon', points: [{ x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 }, { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 }, { x: 2, y: 35 }, { x: 39, y: 35 }] });
    };

    const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={clsx("flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px]",
                activeTab === id ? "bg-white dark:bg-gray-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200")}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <div className="h-full flex flex-col p-6 max-w-[1600px] mx-auto w-full relative">
            <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-3">
                <Palette className="text-purple-500" size={32} />
                {t('cssGenerator.title', 'CSS Generator')}
            </h1>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
                {/* Configuration Panel */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto min-h-0 pr-2 pb-10">
                    {/* Mode Tabs */}
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl shrink-0 overflow-x-auto gap-1">
                        <TabButton id="shadow" icon={Layers} label={t('cssGenerator.boxShadow', 'Box Shadow')} />
                        <TabButton id="radius" icon={BoxSelect} label={t('cssGenerator.borderRadius', 'Border Radius')} />
                        <TabButton id="gradient" icon={Sun} label={t('cssGenerator.gradient', 'Gradient')} />
                        <TabButton id="textShadow" icon={Type} label={t('cssGenerator.textShadow', 'Text Shadow')} />
                        <TabButton id="filter" icon={Sparkles} label={t('cssGenerator.filter', 'Filter')} />
                        <TabButton id="transform" icon={Move} label={t('cssGenerator.transform', 'Transform')} />
                        <TabButton id="glass" icon={Droplets} label={t('cssGenerator.glassmorphism', 'Glassmorphism')} />
                        <TabButton id="clipPath" icon={Scissors} label={t('cssGenerator.clipPath', 'Clip Path')} />
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        {activeTab === 'shadow' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {['x', 'y', 'blur', 'spread'].map(prop => (
                                        <div key={prop}>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">{prop}: {(shadow as any)[prop]}px</label>
                                            <input type="range" min="-50" max="50" value={(shadow as any)[prop]} onChange={(e) => setShadow({ ...shadow, [prop]: Number(e.target.value) })} className="w-full mt-1" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <input type="color" value={shadow.color} onChange={(e) => setShadow({ ...shadow, color: e.target.value })} className="h-8 w-16" />
                                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <input type="checkbox" checked={shadow.inset} onChange={(e) => setShadow({ ...shadow, inset: e.target.checked })} className="rounded border-gray-300" />
                                        Inset
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'radius' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">All Corners</label>
                                    <input type="range" min="0" max="100" value={radius.tl} onChange={(e) => { const v = Number(e.target.value); setRadius({ tl: v, tr: v, br: v, bl: v }); }} className="w-2/3" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {['tl', 'tr', 'br', 'bl'].map(corner => (
                                        <div key={corner}>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">{corner}: {(radius as any)[corner]}px</label>
                                            <input type="range" min="0" max="100" value={(radius as any)[corner]} onChange={(e) => setRadius({ ...radius, [corner]: Number(e.target.value) })} className="w-full mt-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gradient' && (
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    {['linear', 'radial'].map(t => (
                                        <label key={t} className="flex items-center gap-2 text-sm dark:text-white capitalize">
                                            <input type="radio" checked={gradient.type === t} onChange={() => setGradient({ ...gradient, type: t as any })} /> {t}
                                        </label>
                                    ))}
                                </div>
                                {gradient.type === 'linear' && (
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Angle: {gradient.angle}deg</label>
                                        <input type="range" min="0" max="360" value={gradient.angle} onChange={(e) => setGradient({ ...gradient, angle: Number(e.target.value) })} className="w-full mt-1" />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    {gradient.stops.map((stop, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input type="color" value={stop.color} onChange={(e) => { const ns = [...gradient.stops]; ns[i].color = e.target.value; setGradient({ ...gradient, stops: ns }); }} className="h-8 w-10 shrink-0" />
                                            <input type="range" min="0" max="1" step="0.01" value={stop.position} onChange={(e) => { const ns = [...gradient.stops]; ns[i].position = Number(e.target.value); setGradient({ ...gradient, stops: ns }); }} className="flex-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'textShadow' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {['x', 'y', 'blur'].map(prop => (
                                        <div key={prop}>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">{prop}: {(textShadow as any)[prop]}px</label>
                                            <input type="range" min="-50" max="50" value={(textShadow as any)[prop]} onChange={(e) => setTextShadow({ ...textShadow, [prop]: Number(e.target.value) })} className="w-full mt-1" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Color</label>
                                    <input type="color" value={textShadow.color} onChange={(e) => setTextShadow({ ...textShadow, color: e.target.value })} className="h-8 w-16" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'filter' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: 'blur', max: 20, unit: 'px' },
                                        { key: 'brightness', max: 200, unit: '%' },
                                        { key: 'contrast', max: 200, unit: '%' },
                                        { key: 'grayscale', max: 100, unit: '%' },
                                        { key: 'hueRotate', max: 360, unit: 'deg' },
                                        { key: 'invert', max: 100, unit: '%' },
                                        { key: 'opacity', max: 100, unit: '%' },
                                        { key: 'saturate', max: 200, unit: '%' },
                                        { key: 'sepia', max: 100, unit: '%' },
                                    ].map(({ key, max, unit }) => (
                                        <div key={key}>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">{key}: {(filter as any)[key]}{unit}</label>
                                            <input
                                                type="range" min="0" max={max}
                                                value={(filter as any)[key]}
                                                onChange={(e) => setFilter({ ...filter, [key]: Number(e.target.value) })}
                                                className="w-full mt-1"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setFilter({ blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 100, sepia: 0 })}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {activeTab === 'transform' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: 'rotate', min: 0, max: 360, step: 1 },
                                        { key: 'scaleX', min: 0.1, max: 2, step: 0.1 },
                                        { key: 'scaleY', min: 0.1, max: 2, step: 0.1 },
                                        { key: 'skewX', min: -180, max: 180, step: 1 },
                                        { key: 'skewY', min: -180, max: 180, step: 1 },
                                        { key: 'translateX', min: -100, max: 100, step: 1 },
                                        { key: 'translateY', min: -100, max: 100, step: 1 },
                                    ].map(({ key, min, max, step }) => (
                                        <div key={key}>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">{key}: {(transform as any)[key]}</label>
                                            <input
                                                type="range" min={min} max={max} step={step}
                                                value={(transform as any)[key]}
                                                onChange={(e) => setTransform({ ...transform, [key]: Number(e.target.value) })}
                                                className="w-full mt-1"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setTransform({ rotate: 0, scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, translateX: 0, translateY: 0 })}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Reset Transform
                                </button>
                            </div>
                        )}

                        {activeTab === 'glass' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: 'blur', min: 0, max: 50, step: 1, unit: 'px' },
                                        { key: 'transparency', min: 0, max: 1, step: 0.01, unit: '' },
                                        { key: 'outline', min: 0, max: 5, step: 0.5, unit: 'px' },
                                    ].map(({ key, min, max, step, unit }) => (
                                        <div key={key}>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">{key}: {(glass as any)[key]}{unit}</label>
                                            <input
                                                type="range" min={min} max={max} step={step}
                                                value={(glass as any)[key]}
                                                onChange={(e) => setGlass({ ...glass, [key]: Number(e.target.value) })}
                                                className="w-full mt-1"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Glass Color</label>
                                    <input type="color" value={glass.color} onChange={(e) => setGlass({ ...glass, color: e.target.value })} className="h-8 w-full" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'clipPath' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Presets</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Triangle', 'Trapezoid', 'Parallelogram', 'Star', 'Diamond'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => loadClipPreset(s.toLowerCase())}
                                                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-slate-700 dark:text-gray-300 transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Points (X% Y%)</h3>
                                    <div className="space-y-2">
                                        {clipPath.points.map((p, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <span className="text-xs font-mono w-4">{i + 1}</span>
                                                <input
                                                    type="number" value={p.x} min="0" max="100"
                                                    onChange={(e) => { const np = [...clipPath.points]; np[i].x = Number(e.target.value); setClipPath({ ...clipPath, points: np }); }}
                                                    className="w-16 rounded text-xs p-1 text-black" placeholder="X"
                                                />
                                                <input
                                                    type="number" value={p.y} min="0" max="100"
                                                    onChange={(e) => { const np = [...clipPath.points]; np[i].y = Number(e.target.value); setClipPath({ ...clipPath, points: np }); }}
                                                    className="w-16 rounded text-xs p-1 text-black" placeholder="Y"
                                                />
                                                <button
                                                    onClick={() => { const np = clipPath.points.filter((_, idx) => idx !== i); setClipPath({ ...clipPath, points: np }); }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setClipPath({ ...clipPath, points: [...clipPath.points, { x: 0, y: 0 }] })}
                                        className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                    >
                                        + Add Point
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview & Code Panel */}
                <div className="w-full lg:w-[450px] flex flex-col gap-6 shrink-0">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center p-8 h-[300px] border border-gray-200 dark:border-gray-700 shadow-inner relative overflow-hidden">
                        {/* Custom background for Glassmorphism */}
                        {activeTab === 'glass' ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                                <div className="text-4xl font-bold text-white opacity-50">GLASS</div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
                        )}

                        {(activeTab === 'textShadow') ? (
                            <h1 style={getPreviewStyle()} className="relative z-10 text-4xl font-bold">Preview</h1>
                        ) : (
                            <div style={getPreviewStyle()} className={clsx("relative z-10 shadow-sm", activeTab === 'glass' ? "w-48 h-48 flex items-center justify-center" : "")}>
                                {activeTab === 'glass' && <span className="text-gray-800 font-medium">Frosted Element</span>}
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col shadow-lg flex-1 min-h-[300px] mb-6 lg:mb-0">
                        <div className="flex p-2 bg-slate-800 border-b border-slate-700 overflow-x-auto">
                            {[
                                { id: 'css', label: 'CSS' },
                                { id: 'android_xml', label: 'Android XML' },
                                { id: 'android_compose', label: 'Compose' },
                                { id: 'ios_swiftui', label: 'SwiftUI' },
                                { id: 'ios_uikit', label: 'UIKit' },
                                { id: 'flutter', label: 'Flutter' },
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPlatform(p.id as Platform)}
                                    className={clsx("px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors", platform === p.id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700/50")}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative flex-1 p-4 font-mono text-sm text-blue-300 overflow-auto">
                            <pre className="whitespace-pre-wrap break-all">{getCode()}</pre>
                            <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors backdrop-blur-sm">
                                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
