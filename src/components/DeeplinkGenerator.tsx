import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ExternalLink, Plus, Trash2, Link } from 'lucide-react';


interface QueryParam {
    id: string;
    key: string;
    value: string;
}

export const DeeplinkGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [scheme, setScheme] = useState('');
    const [host, setHost] = useState('');
    const [path, setPath] = useState('');
    const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
    const [generatedUrl, setGeneratedUrl] = useState('');

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addQueryParam = () => {
        setQueryParams([...queryParams, { id: generateId(), key: '', value: '' }]);
    };

    const removeQueryParam = (id: string) => {
        setQueryParams(queryParams.filter((p: QueryParam) => p.id !== id));
    };

    const updateQueryParam = (id: string, field: 'key' | 'value', value: string) => {
        setQueryParams(queryParams.map((p: QueryParam) => p.id === id ? { ...p, [field]: value } : p));
    };

    useEffect(() => {
        let url = '';
        if (scheme) {
            url += `${scheme}://`;
            if (host) {
                url += host;
                if (path) {
                    // Ensure path starts with / if host is present
                    url += path.startsWith('/') ? path : `/${path}`;
                }
            }
        }

        const validParams = queryParams.filter((p: QueryParam) => p.key);
        if (validParams.length > 0) {
            const params = new URLSearchParams();
            validParams.forEach((p: QueryParam) => params.append(p.key, p.value));
            url += `?${params.toString()}`;
        }

        setGeneratedUrl(url);
    }, [scheme, host, path, queryParams]);

    const handleOpenApp = () => {
        if (generatedUrl) {
            window.open(generatedUrl, '_blank');
        }
    };

    const copyToClipboard = () => {
        if (generatedUrl) {
            navigator.clipboard.writeText(generatedUrl);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                        <Link className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{t('deeplink.title')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('deeplink.description')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('deeplink.scheme')}</label>
                        <input
                            type="text"
                            value={scheme}
                            onChange={(e) => setScheme(e.target.value)}
                            placeholder={t('deeplink.schemePlaceholder', 'e.g. myapp')}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('deeplink.host')}</label>
                        <input
                            type="text"
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                            placeholder={t('deeplink.hostPlaceholder', 'e.g. example.com')}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('deeplink.pathPrefix')}</label>
                        <input
                            type="text"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            placeholder={t('deeplink.pathPlaceholder', 'e.g. /products/123')}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('deeplink.queryParams')}</label>
                        <button
                            onClick={addQueryParam}
                            className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                        >
                            <Plus size={14} />
                            {t('deeplink.addParam')}
                        </button>
                    </div>

                    <AnimatePresence>
                        {queryParams.map((param: QueryParam) => (
                            <motion.div
                                key={param.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-3"
                            >
                                <input
                                    type="text"
                                    value={param.key}
                                    onChange={(e) => updateQueryParam(param.id, 'key', e.target.value)}
                                    placeholder={t('deeplink.paramKey', 'Key')}
                                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white text-sm"
                                />
                                <span className="text-gray-400">=</span>
                                <input
                                    type="text"
                                    value={param.value}
                                    onChange={(e) => updateQueryParam(param.id, 'value', e.target.value)}
                                    placeholder={t('deeplink.paramValue', 'Value')}
                                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white text-sm"
                                />
                                <button
                                    onClick={() => removeQueryParam(param.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {queryParams.length === 0 && (
                        <div className="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            {t('deeplink.noParams')}
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('deeplink.generatedUrl')}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                title={t('common.copy')}
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700 min-h-[3rem] flex items-center">
                        {generatedUrl || <span className="text-gray-400 italic">...</span>}
                    </div>

                    <button
                        onClick={handleOpenApp}
                        disabled={!generatedUrl}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ExternalLink size={18} />
                        {t('deeplink.openApp')}
                    </button>
                </div>
            </div>
        </div>
    );
};
