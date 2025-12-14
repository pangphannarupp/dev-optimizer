import { Star, X, Search, Home, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '../assets/icon.png';
import { useState, useMemo } from 'react';
import { useTools, ToolId } from '../config/tools';
import { useFavorites } from '../hooks/useFavorites';

export type TabType = ToolId | 'home';

interface SidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    onSettingsClick: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ activeTab, onTabChange, onSettingsClick, isOpen, onClose }: SidebarProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const toolList = useTools();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(id);
    };

    const navItems = useMemo(() => toolList, [toolList]);

    const filteredItems = useMemo(() => {
        if (!searchQuery) return navItems;
        return navItems.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [navItems, searchQuery]);

    const favoriteItems = useMemo(() => {
        return navItems.filter(item => favorites.includes(item.id));
    }, [navItems, favorites]);

    const renderLink = (item: { id: ToolId; icon: any; label: string }) => {
        const isFav = isFavorite(item.id);
        const isActive = activeTab === item.id;

        return (
            <motion.button
                key={item.id}
                onClick={() => {
                    onTabChange(item.id);
                    onClose();
                }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                    "group w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative mb-1 text-left",
                    isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                )}
            >
                <item.icon size={20} className={clsx("transition-transform group-hover:scale-110", isActive && "text-blue-600 dark:text-blue-400")} />
                <span className="flex-1 truncate">{item.label}</span>
                <div
                    onClick={(e) => handleToggleFavorite(item.id, e)}
                    className={clsx(
                        "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700",
                        isFav && "opacity-100 text-yellow-500"
                    )}
                >
                    <Star size={16} fill={isFav ? "currentColor" : "none"} />
                </div>
            </motion.button >
        );
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <img src={AppLogo} alt={t('app.title')} className="w-8 h-8 rounded-lg shadow-sm" />
                        {t('app.title')}
                    </h1>
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('common.search', 'Search...')}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                {searchQuery ? (
                    <>
                        {filteredItems.length > 0 ? (
                            filteredItems.map(renderLink)
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                                {t('common.noResults', 'No results found')}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <motion.button
                            key="home"
                            onClick={() => {
                                onTabChange('home');
                                onClose();
                            }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={clsx(
                                "group w-full flex items-center gap-3 px-4 py-3 mb-4 rounded-lg text-sm font-medium transition-colors relative text-left",
                                activeTab === 'home'
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            <Home size={20} />
                            {t('common.home', 'Home')}
                        </motion.button>

                        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">
                            {t('common.tools', 'Tools')}
                        </h3>

                        {/* Favorites */}
                        {favoriteItems.length > 0 && (
                            <div className="mb-6">
                                <h3 className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                    {t('common.favorites', 'Favorites')}
                                </h3>
                                {favoriteItems.map(renderLink)}
                            </div>
                        )}

                        {/* All Tools */}
                        <div>
                            {favoriteItems.length > 0 && (
                                <h3 className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                    {t('common.allTools', 'All Tools')}
                                </h3>
                            )}
                            {filteredItems.map(renderLink)}
                        </div>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                    onClick={() => {
                        onSettingsClick();
                        onClose();
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                    <Settings size={20} />
                    {t('app.settings')}
                </motion.button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col h-screen transition-colors z-10">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 md:hidden"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
