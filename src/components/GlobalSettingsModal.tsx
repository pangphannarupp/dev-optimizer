import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Monitor, Type, Info, Globe, ChevronRight, ArrowLeft, History } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { version } from '../../package.json';
import { releaseNotes } from '../data/releaseNotes';

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
    const [view, setView] = useState<'settings' | 'release-notes'>('settings');

    useEffect(() => {
        if (isOpen) {
            setView('settings');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBack = () => setView('settings');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
                    <div className="flex items-center gap-2">
                        {view === 'release-notes' && (
                            <button
                                onClick={handleBack}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 mr-1"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {view === 'release-notes' ? t('settings.releaseNotes') : t('settings.title')}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 flex-1">
                    {view === 'settings' ? (
                        <div className="space-y-6">
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
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setView('release-notes')}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-800"
                                    >
                                        <div className="flex items-center gap-2">
                                            <History size={16} className="text-gray-500" />
                                            <span className="text-gray-900 dark:text-white font-medium">{t('settings.releaseNotes')}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                    <div className="p-4 space-y-2">
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
                    ) : (
                        // Release Notes View
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                            {releaseNotes.map((note, index) => (
                                <div key={note.version} className="relative pl-6 pb-6 border-l-2 border-gray-200 dark:border-gray-700 last:pb-0 last:border-0">
                                    <div className={`absolute top-0 left-[-7px] w-3 h-3 rounded-full border-2 ${index === 0 ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`} />
                                    <div className="flex flex-col gap-1 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">v{note.version}</span>
                                            {index === 0 && (
                                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium">{t('settings.latest')}</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{note.date}</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {note.changes.map((change, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                                                <span className="block mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                                                {change}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            {releaseNotes.length === 0 && (
                                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    {t('settings.noReleaseNotes')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
