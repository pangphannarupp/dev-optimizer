import { Star, Search, Home, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '../assets/icon.png';
import { useState, useMemo } from 'react';
import { useTools, ToolId } from '../config/tools';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate, useLocation } from 'react-router-dom';

export type TabType = ToolId | 'home';

interface SidebarProps {
    onSettingsClick: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ onSettingsClick, isOpen, onClose }: SidebarProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('sidebar_collapsed') === 'true';
    });

    const toolList = useTools();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    const activeTab = location.pathname === '/' ? 'home' : location.pathname.substring(1) as TabType;

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar_collapsed', String(newState));
    };

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



    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col h-screen z-10 overflow-hidden"
            >
                {renderContent(isCollapsed)}
            </motion.aside>

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
                            {renderContent(false)}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );

    function renderContent(collapsed: boolean) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className={clsx("p-4 border-b border-gray-200 dark:border-gray-700 flex items-center transition-all duration-300", collapsed ? "justify-center" : "justify-between")}>
                    {!collapsed && (
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3 animate-in fade-in duration-200 truncate">
                            <img src={AppLogo} alt={t('app.title')} className="w-8 h-8 rounded-lg shadow-sm" />
                            <span className="truncate">{t('app.title')}</span>
                        </h1>
                    )}
                    {collapsed && <img src={AppLogo} alt={t('app.title')} className="w-8 h-8 rounded-lg shadow-sm" />}

                    {/* Only show toggle on desktop */}
                    <button
                        onClick={toggleCollapse}
                        className="hidden md:flex p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Search */}
                <div className={clsx("p-4 pb-2 transition-all duration-300", collapsed ? "px-2" : "px-4")}>
                    <div className="relative group">
                        <div className={clsx("absolute top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300", collapsed ? "left-1/2 -translate-x-1/2" : "left-3")}>
                            <Search size={collapsed ? 20 : 16} className={clsx(collapsed && "cursor-pointer hover:text-blue-500")} onClick={() => collapsed && toggleCollapse()} />
                        </div>

                        {!collapsed && (
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('common.search', 'Search...')}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 animate-in fade-in slide-in-from-left-4 duration-200"
                            />
                        )}
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-3 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    {searchQuery && !collapsed ? (
                        <>
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => renderLinkItem(item, collapsed))
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
                                    navigate('/');
                                    onClose();
                                }}
                                whileHover={{ scale: 1.02, x: collapsed ? 0 : 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={clsx(
                                    "group w-full flex items-center gap-3 px-3 py-3 mb-4 rounded-lg text-sm font-medium transition-colors relative",
                                    collapsed ? "justify-center" : "text-left",
                                    activeTab === 'home'
                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                                title={collapsed ? t('common.home', 'Home') : undefined}
                            >
                                <Home size={20} className="min-w-[20px]" />
                                {!collapsed && <span className="animate-in fade-in duration-200">{t('common.home', 'Home')}</span>}
                            </motion.button>

                            {!collapsed && (
                                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2 animate-in fade-in duration-200">
                                    {t('common.tools', 'Tools')}
                                </h3>
                            )}
                            {collapsed && <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2"></div>}

                            {/* Favorites */}
                            {favoriteItems.length > 0 && (
                                <div className="mb-4">
                                    {!collapsed && (
                                        <h3 className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 animate-in fade-in duration-200">
                                            {t('common.favorites', 'Favorites')}
                                        </h3>
                                    )}
                                    {favoriteItems.map(item => renderLinkItem(item, collapsed))}
                                </div>
                            )}

                            {/* All Tools */}
                            <div>
                                {favoriteItems.length > 0 && !collapsed && (
                                    <h3 className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 animate-in fade-in duration-200">
                                        {t('common.allTools', 'All Tools')}
                                    </h3>
                                )}
                                {filteredItems.map(item => renderLinkItem(item, collapsed))}
                            </div>
                        </>
                    )}
                </nav>

                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                        onClick={() => {
                            onSettingsClick();
                            onClose();
                        }}
                        whileHover={{ scale: 1.02, x: collapsed ? 0 : 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 transition-colors",
                            collapsed ? "justify-center" : "text-left"
                        )}
                        title={collapsed ? t('app.settings') : undefined}
                    >
                        <Settings size={20} className="min-w-[20px]" />
                        {!collapsed && <span className="animate-in fade-in duration-200">{t('app.settings')}</span>}
                    </motion.button>
                </div>
            </div>
        );
    }

    function renderLinkItem(item: { id: ToolId; icon: any; label: string }, collapsed: boolean) {
        const isFav = isFavorite(item.id);
        const isActive = activeTab === item.id;

        return (
            <div className="relative group/item" key={item.id}>
                <motion.button
                    onClick={() => {
                        navigate('/' + item.id);
                        onClose();
                    }}
                    whileHover={{ scale: 1.02, x: collapsed ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={clsx(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative mb-1",
                        collapsed ? "justify-center" : "text-left",
                        isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                    title={collapsed ? item.label : undefined}
                >
                    <item.icon size={20} className={clsx("transition-transform min-w-[20px]", !collapsed && "group-hover/item:scale-110", isActive && "text-blue-600 dark:text-blue-400")} />

                    {!collapsed && <span className="flex-1 truncate animate-in fade-in duration-200">{item.label}</span>}

                    {!collapsed && (
                        <div
                            onClick={(e) => handleToggleFavorite(item.id, e)}
                            className={clsx(
                                "opacity-0 group-hover/item:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700",
                                isFav && "opacity-100 text-yellow-500"
                            )}
                        >
                            <Star size={16} fill={isFav ? "currentColor" : "none"} />
                        </div>
                    )}
                </motion.button>
            </div>
        );
    }
}
