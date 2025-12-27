import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertTriangle, FileText, Search, Loader2, X, FolderOpen, Code, Eye, ArrowLeft } from 'lucide-react';
import JSZip from 'jszip';
import { DropZone } from './DropZone';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ValidationResult {
    file: string; // Source file path
    content: string; // Source file content for display
    missingKeys: string[];
    detailedKeys: { key: string, lines: number[], status: { [lang: string]: boolean } }[];
    platform: 'web' | 'android' | 'ios';
    keysFound: number;
}

interface TranslationFiles {
    web: { [lang: string]: Map<string, string> }; // lang -> Map<key, value>
    android: { [lang: string]: Map<string, string> };
    ios: { [lang: string]: Map<string, string> };
}

const TagInput = ({ tags, onTagsChange, placeholder }: { tags: string[], onTagsChange: (tags: string[]) => void, placeholder?: string }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = input.trim().replace(',', '');
            if (val && !tags.includes(val)) {
                onTagsChange([...tags, val]);
                setInput('');
            }
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onTagsChange(tags.slice(0, -1));
        }
    };

    const removeTag = (index: number) => {
        onTagsChange(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow min-h-[46px]">
            {tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-md">
                    {tag}
                    <button onClick={() => removeTag(i)} className="hover:text-blue-600 dark:hover:text-blue-300">
                        <X size={12} />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    const val = input.trim();
                    if (val && !tags.includes(val)) {
                        onTagsChange([...tags, val]);
                        setInput('');
                    }
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                placeholder={tags.length === 0 ? placeholder : ''}
            />
        </div>
    );
};

export function ProjectTranslationVerifier() {
    const { t } = useTranslation();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState('');
    const [results, setResults] = useState<ValidationResult[]>([]);
    const [translationFiles, setTranslationFiles] = useState<TranslationFiles>({ web: {}, android: {}, ios: {} });
    const [searchQuery, setSearchQuery] = useState('');
    const [showMissingOnly, setShowMissingOnly] = useState(true);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [ignoredExtensions, setIgnoredExtensions] = useState<string[]>(['.spec.ts', '.test.ts', '.stories.tsx', '.d.ts']);
    const [showConfig, setShowConfig] = useState(false);
    const [codeViewLines, setCodeViewLines] = useState<number[] | null>(null);
    const [viewingLang, setViewingLang] = useState<{ platform: 'web' | 'android' | 'ios', lang: string } | null>(null);

    const [selectedResult, setSelectedResult] = useState<ValidationResult | null>(null);

    // Reset code view when modal closes
    useEffect(() => {
        if (!selectedResult) {
            setCodeViewLines(null);
        }
    }, [selectedResult]);

    const processZip = useCallback(async (file: File) => {
        setIsAnalyzing(true);
        setResults([]);
        setTranslationFiles({ web: {}, android: {}, ios: {} });
        setProgress(0);
        setProcessingStatus(t('projectTranslationVerifier.unzipping', 'Unzipping project...'));

        const ignoredExtensionsList = ignoredExtensions;

        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);

            const IGNORED_DIRS = ['node_modules', 'library', 'libs', 'pod', 'pods', 'build', 'dist', 'target', 'out', '.git', '.gradle', '.idea', '.vscode'];
            const shouldIgnore = (path: string) => {
                // Check if path contains any ignored directory as a segment
                // OR if it starts with a dot (hidden files)
                return path.split('/').some(part => IGNORED_DIRS.includes(part.toLowerCase())) || path.startsWith('.');
            };

            const entries = Object.entries(contents.files).filter(([, entry]) => !entry.dir);
            const totalFiles = entries.length;

            // 1. First Pass: Find Translation Files
            setProcessingStatus(t('projectTranslationVerifier.findingTranslations', 'Indexing translation files...'));

            const translations: TranslationFiles = { web: {}, android: {}, ios: {} };

            for (const [relativePath, entry] of entries) {
                // Check Global Ignores
                if (shouldIgnore(relativePath)) continue;

                const fileName = relativePath.split('/').pop()?.toLowerCase() || '';

                if (ignoredExtensionsList.some(ext => fileName.endsWith(ext))) continue;

                // Web: JSON files
                if (fileName.endsWith('.json')) {
                    if (relativePath.includes('locale') || relativePath.includes('i18n') || /^[a-z]{2}(-[A-Z]{2})?\.json$/.test(fileName)) {
                        const content = await entry.async('string');
                        try {
                            const json = JSON.parse(content);
                            const keys = new Map<string, string>();
                            const flatten = (obj: Record<string, unknown>, prefix = '') => {
                                for (const k in obj) {
                                    if (typeof obj[k] === 'object' && obj[k] !== null) {
                                        flatten(obj[k] as Record<string, unknown>, prefix + k + '.');
                                    } else {
                                        keys.set(prefix + k, String(obj[k]));
                                    }
                                }
                            };
                            flatten(json);

                            const lang = fileName.replace('.json', '');
                            if (!translations.web[lang]) translations.web[lang] = new Map();
                            keys.forEach((v, k) => translations.web[lang].set(k, v));
                        } catch (e) { }
                    }
                }

                // Android: strings.xml
                if (fileName === 'strings.xml') {
                    const content = await entry.async('string');
                    const keys = new Map<string, string>();
                    // Caputure value: <string name="key">value</string>
                    // Use .*? for non-greedy match of value content
                    const regex = /<string[^>]*name="([^"]+)"[^>]*>(.*?)<\/string>/gs;
                    let match;
                    while ((match = regex.exec(content)) !== null) {
                        keys.set(match[1], match[2]);
                    }

                    const parent = relativePath.split('/').slice(-2, -1)[0];
                    let lang = 'default';
                    if (parent.startsWith('values-')) {
                        lang = parent.replace('values-', '');
                    }

                    if (!translations.android[lang]) translations.android[lang] = new Map();
                    keys.forEach((v, k) => translations.android[lang].set(k, v));
                }

                // iOS: Localizable.strings
                if (fileName.endsWith('.strings')) {
                    const content = await entry.async('string');
                    const keys = new Map<string, string>();
                    // "key" = "value";
                    const regex = /"([^"]+)"\s*=\s*"([^"]*)";/g;
                    let match;
                    while ((match = regex.exec(content)) !== null) {
                        keys.set(match[1], match[2]);
                    }

                    const parent = relativePath.split('/').slice(-2, -1)[0];
                    let lang = 'Base';
                    if (parent.endsWith('.lproj')) {
                        lang = parent.replace('.lproj', '');
                    }

                    if (!translations.ios[lang]) translations.ios[lang] = new Map();
                    keys.forEach((v, k) => translations.ios[lang].set(k, v));
                }
            }

            setTranslationFiles(translations);

            // 2. Second Pass: Scan Source Code
            setProcessingStatus(t('projectTranslationVerifier.scanningSource', 'Scanning source code...'));

            const validationResults: ValidationResult[] = [];
            let processedCount = 0;

            for (const [relativePath, entry] of entries) {
                processedCount++;
                if (processedCount % 50 === 0) {
                    setProgress((processedCount / totalFiles) * 100);
                    // Allow UI update
                    await new Promise(r => setTimeout(r, 0));
                }

                // Check Global Ignores
                if (shouldIgnore(relativePath)) continue;

                const fileName = relativePath.split('/').pop()?.toLowerCase() || '';
                if (ignoredExtensionsList.some(ext => fileName.endsWith(ext))) continue;

                let platform: 'web' | 'android' | 'ios' | null = null;
                if (/\.(tsx|ts|js|jsx|vue)$/.test(fileName)) platform = 'web';
                else if (/\.(kt|java|xml)$/.test(fileName)) platform = 'android';
                else if (/\.(swift|m|h|xib|storyboard)$/.test(fileName)) platform = 'ios';

                if (!platform) continue;

                const content = await entry.async('string');
                const usedKeys = new Set<string>();
                const keyLines = new Map<string, number[]>();

                const getLineNumber = (index: number) => content.substring(0, index).split('\n').length;
                const addKey = (key: string, index: number) => {
                    usedKeys.add(key);
                    if (!keyLines.has(key)) keyLines.set(key, []);
                    keyLines.get(key)?.push(getLineNumber(index));
                };

                // Extract keys based on platform
                if (platform === 'web') {
                    // t('key'), $t('key'), i18n.t('key')
                    // Regex capture group 2 is the key
                    const regex = /[^a-zA-Z0-9](t|\$t|i18n\.t)\(\s*['"]([^'"]+)['"]/g;
                    let match;
                    while ((match = regex.exec(content)) !== null) {
                        addKey(match[2], match.index);
                    }
                } else if (platform === 'android') {
                    if (fileName.endsWith('.xml')) {
                        // @string/key
                        const regex = /@string\/([a-zA-Z0-9_.]+)/g;
                        let match;
                        while ((match = regex.exec(content)) !== null) {
                            addKey(match[1], match.index);
                        }
                    } else {
                        // R.string.key
                        const regex = /R\.string\.([a-zA-Z0-9_]+)/g;
                        let match;
                        while ((match = regex.exec(content)) !== null) {
                            addKey(match[1], match.index);
                        }
                    }
                } else if (platform === 'ios') {
                    // NSLocalizedString("key", ...)
                    const regexInfo = /NSLocalizedString\s*\(\s*@"([^"]+)"/g;
                    let match;
                    while ((match = regexInfo.exec(content)) !== null) {
                        addKey(match[1], match.index);
                    }

                    // Swift String(localized: "key")
                    const regexSwift = /String\s*\(localized:\s*"([^"]+)"/g;
                    while ((match = regexSwift.exec(content)) !== null) {
                        addKey(match[1], match.index);
                    }

                    // SwiftUI Text("key") - risky false positives, but often used for keys if they match Localizable
                    // limiting to simple keys (no spaces) to derive "key-like"
                    const regexText = /Text\s*\(\s*"([^"\s]+)"\s*\)/g;
                    while ((match = regexText.exec(content)) !== null) {
                        addKey(match[1], match.index);
                    }
                }

                if (usedKeys.size > 0) {
                    const missingParams: string[] = [];
                    const detailedKeys: { key: string, lines: number[], status: { [lang: string]: boolean } }[] = [];

                    const availableLangs = translations[platform];
                    const langs = Object.keys(availableLangs);

                    // If no translation files found for this platform, all keys are technically missing (or platform not set up)
                    if (langs.length === 0) {
                        usedKeys.forEach(key => {
                            missingParams.push(`${key} (No translation files found)`);
                            detailedKeys.push({ key, lines: keyLines.get(key) || [], status: {} });
                        });
                    } else {
                        // Check Key Existence in ALL languages
                        usedKeys.forEach(key => {
                            const status: { [lang: string]: boolean } = {};
                            const missingIn: string[] = [];
                            langs.forEach(lang => {
                                const exists = availableLangs[lang].has(key);
                                status[lang] = exists;
                                if (!exists) {
                                    missingIn.push(lang);
                                }
                            });

                            const lines = keyLines.get(key) || [];

                            if (missingIn.length > 0) {
                                // Format: key (missing in: en, fr)
                                missingParams.push(`${key} (missing in: ${missingIn.join(', ')})`);
                            }

                            // Always add to detailedKeys to be filtered by UI
                            detailedKeys.push({ key, lines, status });
                        });
                    }

                    if (detailedKeys.length > 0) {
                        validationResults.push({
                            file: relativePath,
                            content,
                            missingKeys: missingParams,
                            detailedKeys,
                            platform,
                            keysFound: usedKeys.size
                        });
                    }
                }
            }

            setResults(validationResults.sort((a, b) => b.missingKeys.length - a.missingKeys.length)); // Sort by most errors

        } catch (error) {
            console.error(error);
            setProcessingStatus(t('common.error', 'An error occurred during analysis'));
        } finally {
            setIsAnalyzing(false);
            setProgress(0);
            setProcessingStatus('');
        }
    }, [t, ignoredExtensions]); // Removed showMissingOnly

    const processedResults = useMemo(() => {
        let filtered = results;
        if (showMissingOnly) {
            // Filter files that have at least one missing key (deep check)
            filtered = filtered.filter(r => {
                if (!r.detailedKeys) return false;
                return r.detailedKeys.some(k => {
                    // Check if key is missing in any language OR if no status (no languages found)
                    if (Object.keys(k.status).length === 0) return true;
                    return Object.values(k.status).some(v => !v);
                });
            });
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.file.toLowerCase().includes(q) ||
                r.missingKeys.some(k => k.toLowerCase().includes(q))
            );
        }
        return filtered;
    }, [results, showMissingOnly, searchQuery]);

    const stats = useMemo(() => {
        const total = results.length;
        const invalid = results.filter(r => r.missingKeys.length > 0).length;
        const valid = total - invalid;
        return { total, valid, invalid };
    }, [results]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleExportExcel = () => {
        const wb = XLSX.utils.book_new();
        const data: any[] = [];

        // Header
        data.push(['File', 'Platform', 'Key', 'Status', 'Missing In', 'Line Numbers']);

        processedResults.forEach(res => {
            const keysToExport = res.detailedKeys.filter(k => !showMissingOnly || Object.values(k.status).some(v => !v));

            keysToExport.forEach(item => {
                const isMissing = Object.values(item.status).some(v => !v);
                const missingLangs = Object.entries(item.status)
                    .filter(([_, exists]) => !exists)
                    .map(([lang]) => lang)
                    .join(', ');

                data.push([
                    res.file,
                    res.platform,
                    item.key,
                    isMissing ? 'Missing' : 'Valid',
                    missingLangs,
                    item.lines.join(', ')
                ]);
            });
        });

        const ws = XLSX.utils.aoa_to_sheet(data);

        // Auto-width columns roughly
        const wscols = [
            { wch: 40 }, // File
            { wch: 10 }, // Platform
            { wch: 40 }, // Key
            { wch: 10 }, // Status
            { wch: 20 }, // Missing In
            { wch: 15 }  // Lines
        ];
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, "Verification Results");

        // Generate buffer
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Save file
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, `translation_verification_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const handleReAnalyze = () => {
        if (currentFile) {
            processZip(currentFile);
        }
    };

    // Calculate displayed keys for modal
    const getDisplayedDetailedKeys = (result: ValidationResult) => {
        let keys = result.detailedKeys || [];
        if (showMissingOnly) {
            keys = keys.filter(item => {
                // Return true if any language is missing (status value is false)
                // Or if status is empty (no translation files)
                if (Object.keys(item.status).length === 0) return true;
                return Object.values(item.status).some(exists => !exists);
            });
        }
        return keys;
    };

    return (
        <div className="h-full flex flex-col p-8 max-w-[1400px] mx-auto w-full font-khmer">
            <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white flex items-center gap-3">
                <CheckCircle className="text-blue-600" size={32} />
                {t('projectTranslationVerifier.title', 'Project Translation Verifier')}
            </h1>

            {/* Configuration Section */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                    <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                        <FolderOpen size={18} className="text-blue-500" />
                        <span>Configuration (Ignore Files & Extensions)</span>
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {showConfig ? 'Hide' : 'Show'}
                    </span>
                </button>

                {showConfig && (
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ignored Extensions
                            </label>
                            <TagInput
                                tags={ignoredExtensions}
                                onTagsChange={setIgnoredExtensions}
                                placeholder="e.g. .spec.ts"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Files ending with these extensions will be skipped. Press Enter to add.
                            </p>
                        </div>
                        {currentFile && (
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    onClick={handleReAnalyze}
                                    disabled={isAnalyzing}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                    Re-analyze Project
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    {!isAnalyzing && results.length === 0 ? (
                        <DropZone
                            onFilesDropped={(files) => {
                                if (files[0] && files[0].name.endsWith('.zip')) {
                                    setCurrentFile(files[0]);
                                    processZip(files[0]);
                                }
                            }}
                            accept=".zip"
                            dragDropText={t('projectTranslationVerifier.dragDrop', 'Drag & drop project ZIP file')}
                            supportedText="Supports Web (React/Vue), Android, iOS projects"
                            multiple={false}
                            className="h-64"
                        />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[600px]">
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{processingStatus}</p>
                                        <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('common.totalFiles', 'Total Files')}</span>
                                            <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
                                            <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">{t('validation.valid', 'Valid')}</span>
                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.valid}</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
                                            <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">{t('validation.invalid', 'Invalid')}</span>
                                            <span className="text-2xl font-bold text-red-500">{stats.invalid}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    placeholder={t('common.search', 'Search files or keys...')}
                                                    className="pl-9 pr-4 py-2 text-sm border-none rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-blue-500 w-64"
                                                />
                                            </div>
                                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={showMissingOnly}
                                                    onChange={e => setShowMissingOnly(e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                {t('projectTranslationVerifier.showMissingOnly', 'Show missing only')}
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {processedResults.length > 0 && (
                                                <button
                                                    onClick={handleExportExcel}
                                                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title={t('common.exportExcel', 'Export to Excel')}
                                                >
                                                    <FileText size={20} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { setResults([]); setTranslationFiles({ web: {}, android: {}, ios: {} }); }}
                                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title={t('common.clear', 'Clear')}
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        {processedResults.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <CheckCircle size={48} className="mb-4 text-green-500/50" />
                                                <p>{t('projectTranslationVerifier.noIssues', 'No missing translations found!')}</p>
                                            </div>
                                        ) : (
                                            <table className="w-full text-left border-collapse table-fixed">
                                                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
                                                    <tr>
                                                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 w-5/12">{t('common.file', 'File')}</th>
                                                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center w-24">{t('common.platform', 'Platform')}</th>
                                                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 w-5/12">{t('projectTranslationVerifier.missingKeys', 'Missing Keys')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {processedResults.map((res, i) => {
                                                        const fileName = res.file.split('/').pop();
                                                        const filePath = res.file.split('/').slice(0, -1).join('/');
                                                        return (
                                                            <tr
                                                                key={i}
                                                                className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer"
                                                                onClick={() => setSelectedResult(res)}
                                                            >
                                                                <td className="p-4 align-top overflow-hidden">
                                                                    <div className="flex items-start gap-2 max-w-full">
                                                                        <FileText size={16} className="mt-1 text-gray-400 shrink-0" />
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate" title={fileName}>{fileName}</span>
                                                                            <span className="text-xs text-gray-500 truncate" title={filePath}>{filePath}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-center align-top">
                                                                    <span className={clsx(
                                                                        "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                                                                        res.platform === 'web' && "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
                                                                        res.platform === 'android' && "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
                                                                        res.platform === 'ios' && "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                                                    )}>
                                                                        {res.platform}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 align-top">
                                                                    {res.detailedKeys && res.detailedKeys.length > 0 ? (
                                                                        <div>
                                                                            <ul className="space-y-3 mb-1">
                                                                                {/* Preview only missing ones in table view if showMissingOnly is True, else first 3 */}
                                                                                {getDisplayedDetailedKeys(res)
                                                                                    .slice(0, 3)
                                                                                    .map((item, k) => (
                                                                                        <li key={k} className="flex flex-col gap-1.5">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <AlertTriangle size={14} className="text-red-500 shrink-0" />
                                                                                                <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 truncate" title={item.key}>{item.key}</span>
                                                                                            </div>
                                                                                            <div className="flex flex-wrap gap-1.5 pl-5">
                                                                                                {Object.keys(translationFiles[res.platform] || {}).length === 0 ? (
                                                                                                    <span className="text-xs text-red-500 italic">No translation files found</span>
                                                                                                ) : (
                                                                                                    Object.keys(translationFiles[res.platform]).map(lang => {
                                                                                                        const exists = item.status[lang];
                                                                                                        return (
                                                                                                            <span
                                                                                                                key={lang}
                                                                                                                className={clsx(
                                                                                                                    "text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1",
                                                                                                                    exists
                                                                                                                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                                                                                                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                                                                                                                )}
                                                                                                            >
                                                                                                                <span className="font-medium opacity-80">{lang}</span>
                                                                                                                {exists ? <CheckCircle size={8} /> : <span>✗</span>}
                                                                                                            </span>
                                                                                                        );
                                                                                                    })
                                                                                                )}
                                                                                            </div>
                                                                                        </li>
                                                                                    ))}
                                                                            </ul>
                                                                            {getDisplayedDetailedKeys(res).length > 3 && (
                                                                                <span className="inline-block px-2 py-0.5 ml-5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                                                                    +{getDisplayedDetailedKeys(res).length - 3} more
                                                                                </span>
                                                                            )}
                                                                            {/* Fallback if all keys are valid but user has showMissingOnly=false */}
                                                                            {getDisplayedDetailedKeys(res).length === 0 && res.detailedKeys.length > 0 && (
                                                                                <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                                                                                    <CheckCircle size={14} />
                                                                                    {t('validation.valid', 'All keys valid')} (Total: {res.detailedKeys.length})
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                                                                            <CheckCircle size={14} />
                                                                            {t('validation.valid', 'Valid')}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <FolderOpen size={20} className="text-blue-500" />
                            {t('projectTranslationVerifier.detectedTranslations', 'Detected Translations')}
                        </h3>

                        <div className="space-y-6">
                            {['web', 'android', 'ios'].map(platform => {
                                const files = translationFiles[platform as keyof TranslationFiles];
                                const langs = Object.keys(files);
                                if (langs.length === 0) return null;

                                return (
                                    <div key={platform}>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{platform}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {langs.map(lang => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setViewingLang({ platform: platform as any, lang })}
                                                    className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{lang}</span>
                                                    <span className="bg-white dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs px-1.5 rounded-md min-w-[24px] text-center border border-gray-100 dark:border-gray-500">
                                                        {files[lang].size}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {Object.keys(translationFiles.web).length === 0 &&
                                Object.keys(translationFiles.android).length === 0 &&
                                Object.keys(translationFiles.ios).length === 0 && (
                                    <div className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        {t('projectTranslationVerifier.noTranslationsFound', 'No translation files found yet. Upload a project to start.')}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Language Keys Modal */}
                    {viewingLang && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                                            <Code size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-white">
                                                {viewingLang.lang} ({viewingLang.platform})
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {translationFiles[viewingLang.platform][viewingLang.lang]?.size || 0} keys detected
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setViewingLang(null)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-900/20">
                                    <div className="flex justify-end mb-2">
                                        <button
                                            onClick={() => handleCopy(Array.from(translationFiles[viewingLang.platform][viewingLang.lang].entries()).map(([k, v]) => `${k}=${v}`).join('\n'))}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                                        >
                                            <FileText size={14} /> Copy All
                                        </button>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 font-mono text-xs text-gray-700 dark:text-gray-300 break-all space-y-2">
                                        {Array.from(translationFiles[viewingLang.platform][viewingLang.lang] || []).sort().map(([k, v], i) => (
                                            <div key={i} className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 last:border-0 pb-2 mb-2">
                                                <span className="font-bold text-blue-600 dark:text-blue-400 select-all">{k}</span>
                                                <span className="text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-gray-100 dark:border-gray-700 whitespace-pre-wrap select-all">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
                        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <Code size={20} />
                            {t('common.howItWorks', 'How it works')}
                        </h3>
                        <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-2 list-disc list-inside">
                            <li>Scans for <code>.json</code> (Web), <code>strings.xml</code> (Android), and <code>.strings</code> (iOS).</li>
                            <li>Extracts keys using regex from source code (`t('key')`, `@string/key`, `NSLocalizedString`).</li>
                            <li>Compares extracted usage against defined keys.</li>
                            <li>Reports keys found in code but missing in translation files.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {codeViewLines ? (
                                    <button
                                        onClick={() => setCodeViewLines(null)}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                ) : (
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <FileText size={20} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        {codeViewLines ? 'Source Code' : selectedResult.file.split('/').pop()}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-mono break-all line-clamp-1 max-w-md" title={selectedResult.file}>
                                        {selectedResult.file}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedResult(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {codeViewLines ? (
                            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 font-mono text-xs relative">
                                <div className="p-4 min-h-full">
                                    {selectedResult.content ? selectedResult.content.split('\n').map((line, i) => {
                                        const lineNum = i + 1;
                                        const isTarget = codeViewLines.includes(lineNum);
                                        return (
                                            <div
                                                key={i}
                                                ref={isTarget && codeViewLines[0] === lineNum ? (el) => el?.scrollIntoView({ block: 'center', behavior: 'smooth' }) : null}
                                                className={clsx("flex gap-4 p-0.5 hover:bg-black/5 transition-colors rounded-sm", isTarget && "bg-yellow-100 dark:bg-yellow-900/30 ring-1 ring-yellow-200 dark:ring-yellow-800/50")}
                                            >
                                                <span className="text-gray-400 select-none w-8 text-right shrink-0 opacity-50">{lineNum}</span>
                                                <span className="whitespace-pre-wrap break-all text-gray-800 dark:text-gray-300">{line || ' '}</span>
                                            </div>
                                        );
                                    }) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <Code size={48} className="mb-4 opacity-20" />
                                            <p>Source content not available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/20">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                        <AlertTriangle size={16} className={clsx(showMissingOnly ? "text-red-500" : "text-gray-500")} />
                                        {showMissingOnly ? 'Missing Keys' : 'All Keys'} ({getDisplayedDetailedKeys(selectedResult).length})
                                    </h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopy(selectedResult.missingKeys.join('\n'))}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 dark:border-blue-900/30"
                                        >
                                            <FileText size={14} />
                                            Copy Missing
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    {getDisplayedDetailedKeys(selectedResult).length > 0 ? (
                                        getDisplayedDetailedKeys(selectedResult).map((item, i) => (
                                            <div key={i} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-3 group">
                                                <div className="flex items-start gap-3 justify-between">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-200 break-all bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                                            {item.key}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {item.lines && item.lines.length > 0 && (
                                                            <button
                                                                onClick={() => setCodeViewLines(item.lines)}
                                                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                                                title="View Code"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleCopy(item.key); }}
                                                            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                                                            title="Copy Key"
                                                        >
                                                            <FileText size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 pl-1">
                                                    {Object.keys(translationFiles[selectedResult.platform] || {}).length === 0 ? (
                                                        <span className="text-xs text-red-500 italic flex items-center gap-1">
                                                            <AlertTriangle size={12} /> No translation files found
                                                        </span>
                                                    ) : (
                                                        Object.keys(translationFiles[selectedResult.platform]).map(lang => {
                                                            const exists = item.status[lang];
                                                            return (
                                                                <span
                                                                    key={lang}
                                                                    className={clsx(
                                                                        "text-xs px-2 py-1 rounded-md border flex items-center gap-1.5 transition-colors",
                                                                        exists
                                                                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                                                                            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                                                                    )}
                                                                >
                                                                    <span className="font-medium">{lang}</span>
                                                                    {exists ? <CheckCircle size={10} /> : <X size={10} />}
                                                                </span>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Fallback if no keys to show (e.g. all valid and showMissingOnly is true)
                                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                            <CheckCircle size={32} className="mb-2 text-green-500/50" />
                                            <p>No keys to display based on current filters.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!codeViewLines && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl flex justify-end">
                                <button
                                    onClick={() => setSelectedResult(null)}
                                    className="px-5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
