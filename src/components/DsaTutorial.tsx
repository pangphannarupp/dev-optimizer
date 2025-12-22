import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { dsaTopics, DsaTopic, DsaDifficulty } from '../data/DsaData';
import { ChevronRight, BookOpen, Clock, Database, Code, Search, Menu, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { DsaVisualizer } from './DsaVisualizer';

export const DsaTutorial: React.FC = () => {
    const { t } = useTranslation();
    const [selectedTopicId, setSelectedTopicId] = useState<string>(dsaTopics[0].id);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const translatedTopics = useMemo(() =>
        dsaTopics.map(topic => ({
            ...topic,
            title: t(topic.title),
            description: t(topic.description),
            explanation: topic.explanation ? t(topic.explanation) : undefined
        })),
        [t]);

    const selectedTopic = useMemo(() =>
        translatedTopics.find(t => t.id === selectedTopicId) || translatedTopics[0],
        [translatedTopics, selectedTopicId]);

    const filteredTopics = useMemo(() =>
        translatedTopics.filter(t =>
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [translatedTopics, searchTerm]);

    const groupedTopics = useMemo(() => {
        const groups: Record<string, DsaTopic[]> = {};
        filteredTopics.forEach(topic => {
            if (!groups[topic.category]) groups[topic.category] = [];
            groups[topic.category].push(topic);
        });
        return groups;
    }, [filteredTopics]);

    const getDifficultyColor = (difficulty: DsaDifficulty) => {
        switch (difficulty) {
            case 'Basic': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

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
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
                                <BookOpen className="text-blue-600" size={24} />
                                {t('tutorial.dsaTitle')}
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
                            {Object.entries(groupedTopics).map(([category, topics]) => (
                                <div key={category}>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                                        {category}
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
                    <motion.div
                        key={selectedTopic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="mb-2 flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {selectedTopic.category}
                            </span>
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

                        {/* Complexity Cards */}
                        {selectedTopic.complexity && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2 text-orange-700 dark:text-orange-400 font-semibold">
                                        <Clock size={18} />
                                        {t('tutorial.timeComplexity')}
                                    </div>
                                    <div className="text-2xl font-mono text-gray-800 dark:text-white">
                                        {selectedTopic.complexity.time}
                                    </div>
                                </div>
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400 font-semibold">
                                        <Database size={18} />
                                        {t('tutorial.spaceComplexity')}
                                    </div>
                                    <div className="text-2xl font-mono text-gray-800 dark:text-white">
                                        {selectedTopic.complexity.space}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Visualizer */}
                        <div className="mb-8">
                            <DsaVisualizer topicId={selectedTopic.id} />
                        </div>

                        {/* Explanation */}
                        {selectedTopic.explanation && (
                            <div className="mb-8 max-w-none">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <BookOpen size={20} className="text-gray-400" />
                                    {t('tutorial.explanation')}
                                </h3>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                                    {selectedTopic.explanation}
                                </div>
                            </div>
                        )}

                        {/* Code Example */}
                        {selectedTopic.codeExample && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Code size={20} className="text-gray-400" />
                                    {t('tutorial.implementation')}
                                </h3>
                                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                                    <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                        <span className="text-xs font-mono text-gray-500">JavaScript / TypeScript</span>
                                    </div>
                                    <SyntaxHighlighter
                                        language="javascript"
                                        style={vscDarkPlus}
                                        customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem' }}
                                    >
                                        {selectedTopic.codeExample.trim()}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
