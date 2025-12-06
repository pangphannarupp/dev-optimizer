import React, { useState } from 'react';
import { Key, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const JWTDecoder: React.FC = () => {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [signature, setSignature] = useState('');
    const [error, setError] = useState('');
    const [copiedSection, setCopiedSection] = useState<string | null>(null);
    const { t } = useTranslation();

    const decodeJWT = (jwt: string) => {
        setError('');
        try {
            const parts = jwt.trim().split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
            }

            const decodeBase64Url = (str: string) => {
                // Replace URL-safe characters
                let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
                // Pad with '=' to make length multiple of 4
                while (base64.length % 4) {
                    base64 += '=';
                }
                return atob(base64);
            };

            const headerDecoded = decodeBase64Url(parts[0]);
            const payloadDecoded = decodeBase64Url(parts[1]);

            setHeader(JSON.stringify(JSON.parse(headerDecoded), null, 2));
            setPayload(JSON.stringify(JSON.parse(payloadDecoded), null, 2));
            setSignature(parts[2]);
        } catch (err) {
            setError('Invalid JWT token: ' + (err as Error).message);
            setHeader('');
            setPayload('');
            setSignature('');
        }
    };

    const handleCopy = async (text: string, section: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Key className="text-blue-600" />
                    {t('jwtDecoder.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('jwtDecoder.description')}
                </p>

                <div className="flex flex-col gap-6">
                    {/* Input Section */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('jwtDecoder.tokenInput')}
                        </label>
                        <textarea
                            value={token}
                            onChange={(e) => {
                                setToken(e.target.value);
                                if (e.target.value.trim()) {
                                    decodeJWT(e.target.value);
                                }
                            }}
                            placeholder={t('jwtDecoder.tokenPlaceholder')}
                            className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Decoded Sections */}
                    {!error && (header || payload || signature) && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Header */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {t('jwtDecoder.header')}
                                    </label>
                                    {header && (
                                        <button
                                            onClick={() => handleCopy(header, 'header')}
                                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                        >
                                            {copiedSection === 'header' ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedSection === 'header' ? t('common.copied') : t('common.copy')}
                                        </button>
                                    )}
                                </div>
                                <div className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/10 overflow-auto max-h-64">
                                    <pre className="text-gray-800 dark:text-gray-200 font-mono text-xs whitespace-pre">
                                        {header}
                                    </pre>
                                </div>
                            </div>

                            {/* Payload */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {t('jwtDecoder.payload')}
                                    </label>
                                    {payload && (
                                        <button
                                            onClick={() => handleCopy(payload, 'payload')}
                                            className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                        >
                                            {copiedSection === 'payload' ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedSection === 'payload' ? t('common.copied') : t('common.copy')}
                                        </button>
                                    )}
                                </div>
                                <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/10 overflow-auto max-h-64">
                                    <pre className="text-gray-800 dark:text-gray-200 font-mono text-xs whitespace-pre">
                                        {payload}
                                    </pre>
                                </div>
                            </div>

                            {/* Signature */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                        {t('jwtDecoder.signature')}
                                    </label>
                                    {signature && (
                                        <button
                                            onClick={() => handleCopy(signature, 'signature')}
                                            className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                                        >
                                            {copiedSection === 'signature' ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedSection === 'signature' ? t('common.copied') : t('common.copy')}
                                        </button>
                                    )}
                                </div>
                                <div className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-900/10 overflow-auto max-h-64">
                                    <pre className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all">
                                        {signature}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
