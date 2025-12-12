import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import packageJson from '../../package.json';
import { releaseNotes } from '../data/releaseNotes';

interface WhatsNewSnackbarProps {
    onClose?: () => void;
}

export function WhatsNewSnackbar({ onClose }: WhatsNewSnackbarProps) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [version, setVersion] = useState('');
    const [currentNote, setCurrentNote] = useState<string>('');

    useEffect(() => {
        const currentVersion = packageJson.version;
        setVersion(currentVersion);

        // Find notes for current version
        const note = releaseNotes.find(n => n.version === currentVersion);
        if (note) {
            const formattedChanges = note.changes.map(c => `- ${c}`).join('\n');
            // Assuming translation key support for dynamic description might be complex, 
            // so we stick to the extracted string for now, or users can add translation keys later.
            setCurrentNote(`A new version of Dev Optimizer is available!\n${formattedChanges}`);
        }

        const storedVersion = localStorage.getItem('appVersion');

        if (storedVersion !== currentVersion) {
            // Delay slightly to show after app load
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('appVersion', packageJson.version);
        if (onClose) onClose();
    };

    return (
        <AnimatePresence>
            {isVisible && currentNote && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 50, x: '-50%' }}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-xl shadow-2xl p-0 overflow-hidden border border-blue-400/30">
                        <div className="p-4 flex items-start gap-4">
                            <div className="bg-white/20 p-2 rounded-lg text-white mt-1">
                                <Sparkles size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    {t('whatsNew.title', "What's New")}
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">v{version}</span>
                                </h3>
                                <p className="text-blue-50 text-sm mt-1 mb-3 whitespace-pre-line">
                                    {currentNote}
                                </p>

                                <button
                                    onClick={handleClose}
                                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    {t('common.ok', 'OK')}
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-blue-200 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
