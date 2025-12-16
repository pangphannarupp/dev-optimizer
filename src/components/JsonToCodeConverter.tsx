import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Copy, Check, FileJson, Braces, FileCode, CheckCircle2, AlertCircle, Wand2 } from 'lucide-react';
import { Language, generateCode } from '../utils/JsonToCode';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const JsonToCodeConverter: React.FC = () => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState<Language>('typescript');
    const [rootName, setRootName] = useState('Root');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ lines: 0, chars: 0 });

    useEffect(() => {
        if (!input.trim()) {
            setOutput('');
            setError('');
            setStats({ lines: 0, chars: 0 });
            return;
        }

        try {
            // Validate JSON first
            JSON.parse(input);
            setError('');
            const code = generateCode(input, language, rootName);
            setOutput(code);
            setStats({
                lines: code.split('\n').length,
                chars: code.length
            });
        } catch (e) {
            setError((e as Error).message);
            // setOutput(''); // Keep previous output or clear? Let's clear to indicate error
        }
    }, [input, language, rootName]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const loadExample = () => {
        const example = {
            id: "user_123456",
            profile: {
                name: "Sarah Connor",
                email: "sarah@skynet.com",
                verified: true,
                settings: {
                    theme: "dark",
                    notifications: {
                        email: true,
                        push: false
                    }
                }
            },
            tags: ["admin", "beta-tester"],
            lastLogin: 1709856000
        };
        setInput(JSON.stringify(example, null, 2));
    };

    const LanguageTab = ({ id, label, icon: Icon }: { id: Language, label: string, icon: any }) => (
        <button
            onClick={() => setLanguage(id)}
            className={clsx(
                "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg",
                language === id
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-200 dark:ring-blue-800"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full h-full p-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FileJson className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        {t('jsonToCode.title', 'JSON to Code')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-14">
                        {t('jsonToCode.description', 'Generate type-safe models for your apps')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadExample}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                    >
                        <Wand2 size={16} />
                        {t('jsonToCode.loadExample', 'Load Example')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                {/* Input Column */}
                <div className="flex flex-col border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <Braces size={18} className="text-gray-500" />
                            {t('jsonToCode.inputJson', 'JSON Input')}
                        </label>
                        {error && (
                            <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                <AlertCircle size={14} />
                                {t('common.invalidJson', 'Invalid JSON')}
                            </div>
                        )}
                        {!error && input && (
                            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                <CheckCircle2 size={14} />
                                {t('common.validJson', 'Valid JSON')}
                            </div>
                        )}
                    </div>
                    <div className="relative flex-1">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('jsonFormatter.inputPlaceholder', '// Paste your JSON here...')}
                            className={clsx(
                                "absolute inset-0 w-full h-full p-6 font-mono text-sm focus:outline-none resize-none bg-transparent leading-relaxed",
                                error ? "text-red-500/80" : "text-gray-800 dark:text-gray-200"
                            )}
                            spellCheck="false"
                            style={{ tabSize: 2 }}
                        />
                    </div>
                </div>

                {/* Output Column */}
                <div className="flex flex-col bg-slate-50 dark:bg-[#0d1117] lg:bg-opacity-50">
                    <div className="flex flex-col gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex p-1 bg-gray-200/50 dark:bg-gray-800 rounded-lg">
                                <LanguageTab id="typescript" label="TS" icon={FileCode} />
                                <LanguageTab id="kotlin" label="Kotlin" icon={Code} />
                                <LanguageTab id="swift" label="Swift" icon={Code} />
                                <LanguageTab id="dart" label="Dart" icon={Code} />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Root Name</label>
                                <input
                                    type="text"
                                    value={rootName}
                                    onChange={(e) => setRootName(e.target.value)}
                                    className="w-32 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative flex-1 group">
                        {output ? (
                            <>
                                <textarea
                                    value={output}
                                    readOnly
                                    className="absolute inset-0 w-full h-full p-6 font-mono text-sm bg-transparent text-slate-800 dark:text-slate-300 focus:outline-none resize-none leading-relaxed"
                                    style={{ tabSize: 2 }}
                                />
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={handleCopy}
                                    className="absolute top-6 right-6 p-2.5 bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all z-10"
                                    title={t('common.copy')}
                                >
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </motion.button>

                                <div className="absolute bottom-4 right-6 text-xs text-gray-400 font-mono pointer-events-none select-none">
                                    {stats.lines} lines • {stats.chars} chars
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
                                <Code size={48} className="mb-4 opacity-50" />
                                <p className="text-sm">Generated code will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
