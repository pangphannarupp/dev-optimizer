import { Image as ImageIcon, Layers, Sparkles, Edit3, QrCode, FileCode, Settings, X, Code, Key, Lock, Hash, FileUp, Split } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export type TabType = 'optimizer' | 'generator' | 'enhancer' | 'editor' | 'qr' | 'svg-drawable' | 'base64' | 'json' | 'csv-json' | 'jwt' | 'encryption' | 'sha' | 'validate-translation' | 'source-compare';

interface SidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    onSettingsClick: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ activeTab, onTabChange, onSettingsClick, isOpen, onClose }: SidebarProps) {
    const { t } = useTranslation();

    const navItems = [
        { id: 'optimizer', icon: ImageIcon, label: t('app.optimizerTab') },
        { id: 'generator', icon: Layers, label: t('app.generatorTab') },
        { id: 'enhancer', icon: Sparkles, label: t('app.enhancerTab') },
        // { id: 'editor', icon: Edit3, label: t('app.editorTab') },
        { id: 'source-compare', icon: Split, label: t('sourceCompare.title') },
        { id: 'store-validator', icon: Layers, label: t('app.storeValidatorTab') },
        { id: 'qr', icon: QrCode, label: t('app.qrTab') },
        { id: 'svg-drawable', icon: FileCode, label: t('app.svgTab') },
        { id: 'base64', icon: FileCode, label: t('app.base64Tab') },
        { id: 'json', icon: Code, label: t('app.jsonTab') },
        { id: 'csv-json', icon: FileCode, label: t('app.csvJsonTab') },
        { id: 'validate-translation', icon: FileUp, label: t('app.validateTranslation', 'Validate Translation') },
        { id: 'jwt', icon: Key, label: t('app.jwtTab') },
        { id: 'encryption', icon: Lock, label: t('app.encryptionTab') },
        { id: 'sha', icon: Hash, label: t('app.shaTab') },
    ] as const;

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <ImageIcon className="text-blue-600" />
                    Dev Optimizer
                </h1>
                <button
                    onClick={onClose}
                    className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                {navItems.map((item) => (
                    <motion.button
                        key={item.id}
                        onClick={() => {
                            onTabChange(item.id as TabType);
                            onClose();
                        }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative",
                            activeTab === item.id
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        )}
                    >
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-3">
                            <item.icon size={20} />
                            {item.label}
                        </span>
                    </motion.button>
                ))}
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
