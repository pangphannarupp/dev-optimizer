import React from 'react';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingsPanelProps {
    defaultFormat: 'image/jpeg' | 'image/png' | 'image/webp';
    defaultQuality: number;
    onFormatChange: (format: 'image/jpeg' | 'image/png' | 'image/webp') => void;
    onQualityChange: (quality: number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    defaultFormat,
    defaultQuality,
    onFormatChange,
    onQualityChange,
}) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-6 sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <Settings size={20} />
                <span className="hidden sm:inline">{t('settings.global')}</span>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('settings.targetFormat')}:</label>
                    <select
                        value={defaultFormat}
                        onChange={(e) => onFormatChange(e.target.value as any)}
                        className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 px-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none"
                    >
                        <option value="image/jpeg">JPG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WEBP</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{t('settings.quality')}:</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={defaultQuality * 100}
                            onChange={(e) => onQualityChange(parseInt(e.target.value) / 100)}
                            className="w-24 sm:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-10">{Math.round(defaultQuality * 100)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

