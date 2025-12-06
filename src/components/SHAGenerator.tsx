import React, { useState } from 'react';
import { Hash, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';

interface HashResult {
    type: string;
    hash: string;
    copied: boolean;
}

export const SHAGenerator: React.FC = () => {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState<HashResult[]>([]);
    const { t } = useTranslation();

    const generateHashes = (text: string) => {
        if (!text) {
            setHashes([]);
            return;
        }

        const results: HashResult[] = [
            { type: 'MD5', hash: CryptoJS.MD5(text).toString(), copied: false },
            { type: 'SHA-1', hash: CryptoJS.SHA1(text).toString(), copied: false },
            { type: 'SHA-256', hash: CryptoJS.SHA256(text).toString(), copied: false },
            { type: 'SHA-384', hash: CryptoJS.SHA384(text).toString(), copied: false },
            { type: 'SHA-512', hash: CryptoJS.SHA512(text).toString(), copied: false },
        ];

        setHashes(results);
    };

    const handleCopy = async (index: number) => {
        await navigator.clipboard.writeText(hashes[index].hash);
        const updatedHashes = hashes.map((h, i) => ({
            ...h,
            copied: i === index,
        }));
        setHashes(updatedHashes);
        setTimeout(() => {
            setHashes(prev => prev.map(h => ({ ...h, copied: false })));
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Hash className="text-blue-600" />
                    {t('sha.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('sha.description')}
                </p>

                <div className="flex flex-col gap-6">
                    {/* Input Section */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('sha.input')}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                generateHashes(e.target.value);
                            }}
                            placeholder={t('sha.inputPlaceholder')}
                            className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Hash Results */}
                    {hashes.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {t('sha.results')}
                            </h3>

                            {hashes.map((hashResult, index) => (
                                <div
                                    key={hashResult.type}
                                    className="flex flex-col gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {hashResult.type}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(index)}
                                            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            {hashResult.copied ? <Check size={16} /> : <Copy size={16} />}
                                            {hashResult.copied ? t('common.copied') : t('common.copy')}
                                        </button>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <code className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all">
                                            {hashResult.hash}
                                        </code>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {t('sha.length')}: {hashResult.hash.length} {t('sha.characters')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>{t('sha.note')}</strong> {t('sha.noteText')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
