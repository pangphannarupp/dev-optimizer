import React, { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const JSONFormatter: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');
    const { t } = useTranslation();

    const handleFormat = () => {
        setError('');
        try {
            const parsed = JSON.parse(input);
            if (mode === 'beautify') {
                setOutput(JSON.stringify(parsed, null, 2));
            } else {
                setOutput(JSON.stringify(parsed));
            }
        } catch (err) {
            setError('Invalid JSON: ' + (err as Error).message);
            setOutput('');
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Code className="text-blue-600" />
                    {t('jsonFormatter.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('jsonFormatter.description')}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('jsonFormatter.input')}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('jsonFormatter.inputPlaceholder')}
                            className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setMode('beautify')}
                                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${mode === 'beautify'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {t('jsonFormatter.beautify')}
                            </button>
                            <button
                                onClick={() => setMode('minify')}
                                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${mode === 'minify'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {t('jsonFormatter.minify')}
                            </button>
                            <button
                                onClick={handleFormat}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {t('jsonFormatter.format')}
                            </button>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('jsonFormatter.output')}
                            </label>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? t('common.copied') : t('common.copy')}
                                </button>
                            )}
                        </div>
                        <div className="relative w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-auto">
                            {error ? (
                                <div className="text-red-500 font-mono text-sm">{error}</div>
                            ) : output ? (
                                <pre className="text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre">
                                    {output}
                                </pre>
                            ) : (
                                <div className="text-gray-400 dark:text-gray-500 text-sm">
                                    {t('jsonFormatter.outputPlaceholder')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
