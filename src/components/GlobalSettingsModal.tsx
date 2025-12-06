import React from 'react';
import { X, Moon, Sun, Monitor, Type, Info, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { version } from '../../package.json';

interface GlobalSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const languages = [
    { code: 'km', name: 'ភាសាខ្មែរ' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'zh', name: '中文' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
    { code: 'it', name: 'Italiano' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ar', name: 'العربية' },
];

export const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme, fontSize, setFontSize } = useTheme();
    const { t, i18n } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Language */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Globe size={16} />
                            {t('settings.language')}
                        </h3>
                        <select
                            value={i18n.language}
                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Appearance */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('settings.appearance')}</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${theme === 'light'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <Sun size={24} />
                                <span className="text-sm font-medium">{t('settings.light')}</span>
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${theme === 'dark'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <Moon size={24} />
                                <span className="text-sm font-medium">{t('settings.dark')}</span>
                            </button>
                            <button
                                onClick={() => setTheme('system')}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${theme === 'system'
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <Monitor size={24} />
                                <span className="text-sm font-medium">{t('settings.system')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Type size={16} />
                            {t('settings.typography')}
                        </h3>
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                            <span className="text-xs text-gray-600 dark:text-gray-400">A</span>
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="1"
                                value={fontSize === 'small' ? 0 : fontSize === 'medium' ? 1 : 2}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setFontSize(val === 0 ? 'small' : val === 1 ? 'medium' : 'large');
                                }}
                                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <span className="text-xl text-gray-900 dark:text-white font-medium">A</span>
                        </div>
                        <div className="flex justify-between px-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{t('settings.small')}</span>
                            <span>{t('settings.medium')}</span>
                            <span>{t('settings.large')}</span>
                        </div>
                    </div>

                    {/* About */}
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Info size={16} />
                            {t('settings.about')}
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{t('settings.version')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{version}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{t('settings.author')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">phanna</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{t('settings.copyright')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">© {new Date().getFullYear()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
