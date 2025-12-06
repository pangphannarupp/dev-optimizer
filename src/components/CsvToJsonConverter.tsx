import { useState, useCallback } from 'react';
import { FileJson, Download, AlertCircle, CheckCircle, Smartphone, Apple } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface TranslationData {
    [language: string]: any;
}

interface GeneratedContent {
    json: TranslationData;
    android: { [language: string]: string };
    ios: { [language: string]: string };
}

type Format = 'json' | 'android' | 'ios';

export function CsvToJsonConverter() {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [generatedFiles, setGeneratedFiles] = useState<GeneratedContent | null>(null);

    const [detectedLanguages, setDetectedLanguages] = useState<string[]>([]);
    const [activePreviewTab, setActivePreviewTab] = useState<string>('');
    const [activeFormat, setActiveFormat] = useState<Format>('json');

    const processFile = async (file: File) => {
        setError(null);
        setSuccess(null);
        setGeneratedFiles(null);
        setDetectedLanguages([]);
        setActivePreviewTab('');
        setActiveFormat('json');

        try {
            const text = await file.text();

            // Robust CSV Parser handling multiline quotes
            const parseCSV = (text: string) => {
                const rows: string[][] = [];
                let currentRow: string[] = [];
                let currentField = '';
                let inQuotes = false;

                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    const nextChar = text[i + 1];

                    if (char === '"') {
                        if (inQuotes && nextChar === '"') {
                            currentField += '"';
                            i++; // Skip escaped quote
                        } else {
                            inQuotes = !inQuotes;
                        }
                    } else if (char === ',' && !inQuotes) {
                        currentRow.push(currentField.trim());
                        currentField = '';
                    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
                        currentRow.push(currentField.trim());
                        rows.push(currentRow);
                        currentRow = [];
                        currentField = '';
                        if (char === '\r') i++; // Skip \n after \r
                    } else {
                        currentField += char;
                    }
                }

                // Add last field/row if exists
                if (currentField || currentRow.length > 0) {
                    currentRow.push(currentField.trim());
                    rows.push(currentRow);
                }

                return rows;
            };

            const rows = parseCSV(text);

            if (rows.length < 2) {
                throw new Error(t('csvToJson.csvEmpty'));
            }

            // Parse header
            const headers = rows[0];
            const jsonKeyIndex = headers.findIndex(h => h === 'JSON KEY');

            const standardColumns = ['NO', 'PART', 'JSON KEY', 'SCREEN_ID', 'LABEL_TYPE', 'KEY_VALUE'];
            const languageIndices: { [lang: string]: number } = {};

            headers.forEach((header, index) => {
                if (!standardColumns.includes(header) && header.length > 0) {
                    languageIndices[header] = index;
                }
            });

            if (jsonKeyIndex === -1) {
                throw new Error(t('csvToJson.jsonKeyNotFound'));
            }

            if (Object.keys(languageIndices).length === 0) {
                throw new Error(t('csvToJson.noLanguages'));
            }

            const languages = Object.keys(languageIndices);
            setDetectedLanguages(languages);
            if (languages.length > 0) {
                setActivePreviewTab(languages[0]);
            }

            const translations: TranslationData = {};
            const androidStrings: { [lang: string]: string[] } = {};
            const iosStrings: { [lang: string]: string[] } = {};

            languages.forEach(lang => {
                translations[lang] = {};
                androidStrings[lang] = [];
                iosStrings[lang] = [];
            });

            const setNestedValue = (obj: any, path: string, value: string) => {
                const keys = path.split('.');
                let current = obj;

                for (let i = 0; i < keys.length - 1; i++) {
                    const key = keys[i];
                    if (!current[key]) {
                        current[key] = {};
                    }
                    current = current[key];
                }

                current[keys[keys.length - 1]] = value;
            };

            const escapeAndroid = (str: string) => {
                return str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'");
            };

            const escapeIOS = (str: string) => {
                return str.replace(/"/g, '\\"');
            };

            let processedCount = 0;

            for (let i = 1; i < rows.length; i++) {
                const fields = rows[i];

                if (fields.length <= jsonKeyIndex || !fields[jsonKeyIndex]) {
                    continue;
                }

                const jsonKey = fields[jsonKeyIndex];

                Object.entries(languageIndices).forEach(([lang, index]) => {
                    if (index < fields.length) {
                        const value = fields[index];
                        if (value) {
                            // JSON
                            setNestedValue(translations[lang], jsonKey, value);

                            // Android
                            androidStrings[lang].push(`    <string name="${jsonKey}">${escapeAndroid(value)}</string>`);

                            // iOS
                            iosStrings[lang].push(`"${jsonKey}" = "${escapeIOS(value)}";`);
                        }
                    }
                });
                processedCount++;
            }

            const finalAndroid: { [lang: string]: string } = {};
            const finalIOS: { [lang: string]: string } = {};

            languages.forEach(lang => {
                finalAndroid[lang] = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n${androidStrings[lang].join('\n')}\n</resources>`;
                finalIOS[lang] = iosStrings[lang].join('\n');
            });

            setGeneratedFiles({
                json: translations,
                android: finalAndroid,
                ios: finalIOS
            });
            setSuccess(t('csvToJson.successMessage', { count: processedCount, languages: languages.length }));
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to process CSV file');
        }
    };

    const handleDownload = async () => {
        if (!generatedFiles) return;

        const zip = new JSZip();

        // JSON
        const jsonFolder = zip.folder('json');
        Object.entries(generatedFiles.json).forEach(([lang, data]) => {
            jsonFolder?.file(`${lang}.json`, JSON.stringify(data, null, 2));
        });

        // Android
        const androidFolder = zip.folder('android');
        Object.entries(generatedFiles.android).forEach(([lang, data]) => {
            androidFolder?.file(`values-${lang}/strings.xml`, data);
        });

        // iOS
        const iosFolder = zip.folder('ios');
        Object.entries(generatedFiles.ios).forEach(([lang, data]) => {
            iosFolder?.file(`${lang}.lproj/Localizable.strings`, data);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'translations.zip');
    };

    const handleFilesDropped = useCallback((files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                processFile(file);
            } else {
                setError(t('csvToJson.uploadCsv'));
            }
        }
    }, []);

    const getPreviewContent = () => {
        if (!generatedFiles || !activePreviewTab) return '';

        switch (activeFormat) {
            case 'android':
                return generatedFiles.android[activePreviewTab];
            case 'ios':
                return generatedFiles.ios[activePreviewTab];
            case 'json':
            default:
                return JSON.stringify(generatedFiles.json[activePreviewTab], null, 2);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('csvToJson.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('csvToJson.description')}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <DropZone
                    onFilesDropped={handleFilesDropped}
                    accept=".csv,text/csv"
                    validator={(file) => file.type === 'text/csv' || file.name.endsWith('.csv')}
                    dragDropText={t('csvToJson.dragDrop')}
                    supportedText={t('csvToJson.supportsCsv')}
                />

                {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={20} />
                            {success}
                        </div>
                        {detectedLanguages.length > 0 && (
                            <div className="ml-7 text-sm">
                                <span className="font-semibold">{t('csvToJson.detectedLanguages')}</span> {detectedLanguages.join(', ')}
                            </div>
                        )}
                    </div>
                )}

                {generatedFiles && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                        >
                            <Download size={20} />
                            {t('csvToJson.downloadAll')}
                        </button>
                    </div>
                )}
            </div>

            {generatedFiles && detectedLanguages.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex gap-1">
                            <button
                                onClick={() => setActiveFormat('json')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeFormat === 'json'
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <FileJson size={16} />
                                {t('csvToJson.formats.json')}
                            </button>
                            <button
                                onClick={() => setActiveFormat('android')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeFormat === 'android'
                                    ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <Smartphone size={16} />
                                {t('csvToJson.formats.android')}
                            </button>
                            <button
                                onClick={() => setActiveFormat('ios')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeFormat === 'ios'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <Apple size={16} />
                                {t('csvToJson.formats.ios')}
                            </button>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                        {detectedLanguages.map(lang => (
                            <button
                                key={lang}
                                onClick={() => setActivePreviewTab(lang)}
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activePreviewTab === lang
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>

                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                            {activeFormat === 'json' && <FileJson className="text-blue-500" size={20} />}
                            {activeFormat === 'android' && <Smartphone className="text-green-500" size={20} />}
                            {activeFormat === 'ios' && <Apple className="text-gray-900 dark:text-white" size={20} />}
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                {activePreviewTab}
                                {activeFormat === 'json' ? '.json' : activeFormat === 'android' ? '.xml' : '.strings'}
                            </h3>
                        </div>
                        <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-[500px] p-4 bg-gray-50 dark:bg-gray-900 rounded-lg font-mono">
                            {getPreviewContent()}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
