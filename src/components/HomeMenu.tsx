import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, Download, Star } from 'lucide-react';
import { useTools, ToolId } from '../config/tools';
import { useFavorites } from '../hooks/useFavorites';
import AppLogo from '../assets/icon.png';

interface HomeMenuProps {
    onNavigate: (id: ToolId) => void;
    onSettingsClick: () => void;
}

export function HomeMenu({ onNavigate, onSettingsClick }: HomeMenuProps) {
    const { t } = useTranslation();
    const tools = useTools();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = tools.filter(tool =>
        tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const favoriteTools = filteredTools.filter(tool => isFavorite(tool.id));
    const otherTools = filteredTools.filter(tool => !isFavorite(tool.id));

    const renderToolCard = (tool: typeof tools[0]) => {
        const isFav = isFavorite(tool.id);
        return (
            <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group h-full"
            >
                <button
                    onClick={() => onNavigate(tool.id)}
                    className="w-full h-full flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-900/30 transition-all text-center"
                >
                    <div className="w-16 h-16 mb-4 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        <tool.icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.label}
                    </h3>
                    {tool.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {tool.description}
                        </p>
                    )}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isFav
                        ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 opacity-100'
                        : 'text-gray-300 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
                        }`}
                >
                    <Star size={18} fill={isFav ? "currentColor" : "none"} />
                </button>
            </motion.div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto relative">
            {/* Header Controls */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                    onClick={() => onNavigate('download')}
                    className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title={t('app.downloadTab', 'Download App')}
                >
                    <Download className="w-6 h-6" />
                </button>
                <button
                    onClick={onSettingsClick}
                    className="p-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title={t('app.settings')}
                >
                    <Settings className="w-6 h-6" />
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col items-center pt-16 pb-12 px-6 text-center">
                <img
                    src={AppLogo}
                    alt="App Logo"
                    className="w-24 h-24 rounded-2xl shadow-xl mb-6 hover:scale-105 transition-transform duration-300"
                />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    {t('app.title', 'Dev Optimizer')}
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-8">
                    {t('home.subtitle', 'All your developer tools in one place.')}
                </p>

                {/* Search Bar */}
                <div className="relative w-full max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-lg text-gray-900 dark:text-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('common.search', 'Search tools...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 pb-16 max-w-7xl mx-auto w-full space-y-12">
                <AnimatePresence>
                    {/* Favorites Section */}
                    {favoriteTools.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                                {t('common.favorites', 'Favorites')}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {favoriteTools.map(renderToolCard)}
                            </div>
                        </motion.section>
                    )}

                    {/* All Tools Section */}
                    {otherTools.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {favoriteTools.length > 0 && (
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 mt-2">
                                    {t('common.allTools', 'All Tools')}
                                </h2>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {otherTools.map(renderToolCard)}
                            </div>
                        </motion.section>
                    )}

                    {filteredTools.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                {t('common.noResults', 'No tools found matching your search.')}
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
