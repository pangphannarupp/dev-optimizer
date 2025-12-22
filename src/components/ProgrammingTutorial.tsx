import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { progLanguages, progTopics, ProgTopic, ProgLanguage, ProgDifficulty } from '../data/ProgrammingData';
import { ProgrammingVisualizer } from './ProgrammingVisualizer';
import { ChevronRight, ArrowLeft, BookOpen, Code, Search, Menu, X, Smartphone, Globe, Terminal, Box, Atom, FileJson, Palette, FileCode } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const ProgrammingTutorial: React.FC = () => {
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<ProgLanguage | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Get topics for selected language with translations
    const languageTopics = useMemo(() => {
        if (!selectedLanguage) return [];
        return progTopics
            .filter(t => t.language === selectedLanguage)
            .map(topic => ({
                ...topic,
                title: t(topic.title),
                description: t(topic.description),
                content: t(topic.content)
            }));
    }, [selectedLanguage, t]);

    // Handle initial topic selection when language changes
    React.useEffect(() => {
        if (selectedLanguage && languageTopics.length > 0 && !selectedTopicId) {
            setSelectedTopicId(languageTopics[0].id);
        }
    }, [selectedLanguage, languageTopics, selectedTopicId]);

    const selectedTopic = useMemo(() =>
        languageTopics.find(t => t.id === selectedTopicId),
        [languageTopics, selectedTopicId]);

    const filteredTopics = useMemo(() =>
        languageTopics.filter(t =>
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [languageTopics, searchTerm]);

    const groupedTopics = useMemo(() => {
        const groups: Record<string, ProgTopic[]> = {};
        filteredTopics.forEach(topic => {
            if (!groups[topic.difficulty]) groups[topic.difficulty] = [];
            groups[topic.difficulty].push(topic);
        });
        // Sort keys to ensure Basic -> Intermediate -> Advanced order
        const order = ['Basic', 'Intermediate', 'Advanced'];
        const sortedGroups: Record<string, ProgTopic[]> = {};
        order.forEach(key => {
            if (groups[key]) sortedGroups[key] = groups[key];
        });
        return sortedGroups;
    }, [filteredTopics]);

    const getIcon = (iconName: string, className: string) => {
        switch (iconName) {
            case 'Smartphone': return <Smartphone className={className} />;
            case 'Apple': return <Globe className={className} />; // Fallback until Apple icon available
            case 'Atom': return <Atom className={className} />;
            case 'Box': return <Box className={className} />;
            case 'FileJson': return <FileJson className={className} />;
            case 'Palette': return <Palette className={className} />;
            case 'FileCode': return <FileCode className={className} />;
            case 'Terminal': return <Terminal className={className} />;
            default: return <Code className={className} />;
        }
    };

    const getDifficultyColor = (difficulty: ProgDifficulty) => {
        switch (difficulty) {
            case 'Basic': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // --- View: Language Selection ---
    if (!selectedLanguage) {
        return (
            <div className="h-full bg-gray-50 dark:bg-gray-900 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                            {t('tutorial.progTitle')}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {t('tutorial.progSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {progLanguages.map(lang => (
                            <motion.button
                                key={lang.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSelectedLanguage(lang.id);
                                    setSelectedTopicId(null); // Reset topic
                                }}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4 hover:shadow-lg transition-all"
                            >
                                <div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-700/50 ${lang.color}`}>
                                    {getIcon(lang.icon, "w-10 h-10")}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{lang.name}</h3>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- View: Topic Browser ---
    return (
        <div className="flex h-full bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
            {/* Mobile Sidebar Toggle */}
            <button
                className="md:hidden absolute top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <AnimatePresence mode='wait'>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className={clsx(
                            "w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col absolute md:relative z-40 h-full shadow-xl md:shadow-none",
                            !isSidebarOpen && "hidden md:flex"
                        )}
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => setSelectedLanguage(null)}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                {t('tutorial.backToLanguages')}
                            </button>

                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {progLanguages.find(l => l.id === selectedLanguage)?.name}
                            </h2>
                            <div className="mt-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder={t('tutorial.searchTopics')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {Object.entries(groupedTopics).map(([difficulty, topics]) => (
                                <div key={difficulty}>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                                        {difficulty}
                                    </h3>
                                    <div className="space-y-1">
                                        {topics.map(topic => (
                                            <button
                                                key={topic.id}
                                                onClick={() => {
                                                    setSelectedTopicId(topic.id);
                                                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                                                }}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group",
                                                    selectedTopicId === topic.id
                                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                )}
                                            >
                                                <span>{topic.title}</span>
                                                {selectedTopicId === topic.id && <ChevronRight size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto w-full md:w-auto">
                <div className="max-w-4xl mx-auto p-8 pt-16 md:pt-8 min-h-full">
                    {selectedTopic ? (
                        <motion.div
                            key={selectedTopic.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <span className={clsx(
                                    "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                    getDifficultyColor(selectedTopic.difficulty)
                                )}>
                                    {selectedTopic.difficulty}
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {selectedTopic.title}
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                {selectedTopic.description}
                            </p>

                            {/* Visualizer (Info Graphic) */}
                            {selectedTopic.visualizerId && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Box size={20} className="text-gray-400" />
                                        {t('tutorial.visualGuide')}
                                    </h3>
                                    <ProgrammingVisualizer visualizerId={selectedTopic.visualizerId} />
                                </div>
                            )}

                            {/* Explanation/Content */}
                            <div className="mb-8 max-w-none">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <BookOpen size={20} className="text-gray-400" />
                                    {t('tutorial.guide')}
                                </h3>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                                    {selectedTopic.content}
                                </div>
                            </div>

                            {/* Code Example */}
                            {selectedTopic.codeExample && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                        <Code size={20} className="text-gray-400" />
                                        {t('tutorial.example')}
                                    </h3>
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                                        <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                            <span className="text-xs font-mono text-gray-500 uppercase">{selectedLanguage}</span>
                                        </div>
                                        <SyntaxHighlighter
                                            language={selectedLanguage === 'react' ? 'javascript' : selectedLanguage === 'android' ? 'kotlin' : selectedLanguage === 'ios' ? 'swift' : selectedLanguage}
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem' }}
                                        >
                                            {selectedTopic.codeExample.trim()}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            {t('tutorial.selectTopic')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
