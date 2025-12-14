import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Smartphone, Copy } from 'lucide-react';
import { clsx } from 'clsx';

type Density = {
    name: string;
    scale: number;
    platform: 'android' | 'ios';
    desc?: string;
};

const DENSITIES: Density[] = [
    { name: 'ldpi', scale: 0.75, platform: 'android', desc: '~120dpi' },
    { name: 'mdpi', scale: 1.0, platform: 'android', desc: '~160dpi (Base)' },
    { name: 'hdpi', scale: 1.5, platform: 'android', desc: '~240dpi' },
    { name: 'xhdpi', scale: 2.0, platform: 'android', desc: '~320dpi' },
    { name: 'xxhdpi', scale: 3.0, platform: 'android', desc: '~480dpi' },
    { name: 'xxxhdpi', scale: 4.0, platform: 'android', desc: '~640dpi' },
    { name: '@1x', scale: 1.0, platform: 'ios', desc: 'Non-Retina' },
    { name: '@2x', scale: 2.0, platform: 'ios', desc: 'Retina' },
    { name: '@3x', scale: 3.0, platform: 'ios', desc: 'Super Retina' },
];

const DensityConverter = () => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState<string>('16');
    const [inputMode, setInputMode] = useState<'dp' | 'px'>('dp');
    const [baseDensity, setBaseDensity] = useState<number>(1.0); // For PX input mode

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const calculatePx = (dp: number, scale: number) => {
        return Math.round(dp * scale * 100) / 100; // Round to 2 decimal places if needed, mostly integers
    };

    // Calculate the base DP value from input.
    // If input is DP, base DP = input.
    // If input is PX, base DP = input / selected_density_scale.
    const getBaseDp = (): number => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) return 0;
        if (inputMode === 'dp') return val;
        return val / baseDensity;
    };

    const baseDp = getBaseDp();

    return (
        <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                    <Monitor className="w-8 h-8 text-blue-500" />
                    {t('densityConverter.title', 'Density Converter')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('densityConverter.description', 'Convert pixel dimensions across different screen densities (dp/pt ↔ px).')}
                </p>
            </div>

            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('densityConverter.value', 'Value')}
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-2xl font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('densityConverter.unit', 'Unit')}
                        </label>
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setInputMode('dp')}
                                className={clsx("flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all text-center",
                                    inputMode === 'dp'
                                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                                )}
                            >
                                dp / pt (Points)
                            </button>
                            <button
                                onClick={() => setInputMode('px')}
                                className={clsx("flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all text-center",
                                    inputMode === 'px'
                                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                                )}
                            >
                                px (Pixels)
                            </button>
                        </div>
                    </div>

                    {inputMode === 'px' && (
                        <div className="flex-1 w-full animate-in fade-in slide-in-from-left-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('densityConverter.sourceDensity', 'Source Density')}
                            </label>
                            <select
                                value={baseDensity}
                                onChange={(e) => setBaseDensity(parseFloat(e.target.value))}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            >
                                <option value="1">mdpi / @1x (1.0x)</option>
                                <option value="1.5">hdpi (1.5x)</option>
                                <option value="2">xhdpi / @2x (2.0x)</option>
                                <option value="3">xxhdpi / @3x (3.0x)</option>
                                <option value="4">xxxhdpi (4.0x)</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Android Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/30 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                            <Smartphone size={20} />
                            Android
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {DENSITIES.filter(d => d.platform === 'android').map((density) => (
                            <div key={density.name} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-gray-800 dark:text-gray-200">{density.name}</span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">x{density.scale}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{density.desc}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-mono text-gray-800 dark:text-white font-medium">
                                        {Math.round(calculatePx(baseDp, density.scale))}px
                                    </span>
                                    <button
                                        onClick={() => handleCopy(Math.round(calculatePx(baseDp, density.scale)).toString())}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-green-600 transition-all rounded-md hover:bg-green-50 dark:hover:bg-green-900/30"
                                        title="Copy"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* iOS Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold">
                            <Smartphone size={20} />
                            iOS
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {DENSITIES.filter(d => d.platform === 'ios').map((density) => (
                            <div key={density.name} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-gray-800 dark:text-gray-200">{density.name}</span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">x{density.scale}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{density.desc}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-mono text-gray-800 dark:text-white font-medium">
                                        {Math.round(calculatePx(baseDp, density.scale))}px
                                    </span>
                                    <button
                                        onClick={() => handleCopy(Math.round(calculatePx(baseDp, density.scale)).toString())}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 transition-all rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                        title="Copy"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Visual Guide (Optional but nice) */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>
                    <strong>Tip:</strong> Designers usually design at <strong>1x</strong> (mdpi) or <strong>2x</strong> (xhdpi).
                    Developers use <strong>dp</strong> (Android) or <strong>pt</strong> (iOS) to ensure the UI looks consistent across all screen sizes.
                </p>
            </div>
        </div>
    );
};

export default DensityConverter;
