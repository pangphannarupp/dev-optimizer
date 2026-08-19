import { useState, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Languages, Download, Search, Plus, Trash2,
    RefreshCw, Copy, Check,
    Sparkles, ArrowRight, Table, FileSpreadsheet, Eye,
    CheckSquare, Square, ShieldCheck, X, ArrowDown
} from 'lucide-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { DropZone } from './DropZone';
import {
    TranslationEntry,
    parseUploadedFiles,
    serializeAndroidXml,
    serializeIosStrings,
    unflattenJSON
} from '../utils/translationParser';
import {
    SUPPORTED_LANGUAGES,
    batchTranslate,
    translateText
} from '../utils/translationEngine';

export function Translator() {
    const { t } = useTranslation();

    // Data State
    const [entries, setEntries] = useState<TranslationEntry[]>([]);
    const [sourceLanguage, setSourceLanguage] = useState<string>('en');
    const [targetLanguages, setTargetLanguages] = useState<string[]>(['km']);
    const [fileName, setFileName] = useState<string>('');

    // UI & Filter State
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'missing' | 'translated' | 'modified'>('all');
    const [selectedLanguageTab, setSelectedLanguageTab] = useState<string>('km');
    const [activeView, setActiveView] = useState<'table' | 'preview'>('table');
    const [previewFormat, setPreviewFormat] = useState<'json' | 'android' | 'ios' | 'excel'>('json');
    const [previewLanguages, setPreviewLanguages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(200);

    // Auto-scroll State
    const [autoScroll, setAutoScroll] = useState<boolean>(true);
    const autoScrollRef = useRef<boolean>(true);
    autoScrollRef.current = autoScroll;

    const [activeTranslatingKey, setActiveTranslatingKey] = useState<string | null>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});
    const previewContainersRef = useRef<{ [lang: string]: HTMLDivElement | null }>({});

    // File Reading Progress State
    const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
    const [readProgress, setReadProgress] = useState<{ percent: number; status: string }>({ percent: 0, status: '' });

    // Translation Processing State
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [translateProgress, setTranslateProgress] = useState<{ completed: number; total: number; targetLang?: string }>({ completed: 0, total: 0 });
    const [translatingKey, setTranslatingKey] = useState<string | null>(null);

    // Modal & Selection State
    const [showLangSelectorModal, setShowLangSelectorModal] = useState<boolean>(false);
    const [showAddKeyModal, setShowAddKeyModal] = useState<boolean>(false);
    const [showExportModal, setShowExportModal] = useState<boolean>(false);
    const [exportFormats, setExportFormats] = useState<{ json: boolean; android: boolean; ios: boolean; excel: boolean; csv: boolean }>({
        json: true,
        android: true,
        ios: true,
        excel: true,
        csv: false
    });
    const [exportLanguages, setExportLanguages] = useState<string[]>([]);
    const [newKeyName, setNewKeyName] = useState<string>('');
    const [newKeySourceText, setNewKeySourceText] = useState<string>('');
    const [newKeyContext, setNewKeyContext] = useState<string>('');
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

    // Quick Alert Notification helper
    const showAlert = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertMessage({ text, type });
        setTimeout(() => setAlertMessage(null), 4000);
    };

    // File Upload Handler
    const handleFilesDropped = async (files: File[]) => {
        if (files.length === 0) return;
        setIsReadingFile(true);
        setReadProgress({ percent: 5, status: `Preparing to read ${files.length} file(s)...` });

        try {
            const project = await parseUploadedFiles(files, (percent, status) => {
                setReadProgress({ percent, status });
            });

            setEntries(project.entries);
            setSourceLanguage(project.sourceLanguage);
            setFileName(files[0].name);

            // Merge detected target languages
            const newTargets = new Set([...targetLanguages, ...project.detectedLanguages.filter(l => l !== project.sourceLanguage)]);
            setTargetLanguages(Array.from(newTargets));

            if (project.detectedLanguages.length > 0) {
                const firstNonSource = project.detectedLanguages.find(l => l !== project.sourceLanguage);
                if (firstNonSource) setSelectedLanguageTab(firstNonSource);
            }

            showAlert(t('translator.loadedSuccess', { count: project.entries.length, defaultValue: `Successfully loaded ${project.entries.length} translation keys!` }), 'success');
        } catch (err: any) {
            console.error(err);
            showAlert(err.message || 'Failed to parse translation files', 'error');
        } finally {
            setIsReadingFile(false);
            setReadProgress({ percent: 0, status: '' });
        }
    };

    // Add New Key
    const handleAddKey = () => {
        if (!newKeyName.trim()) {
            showAlert('Key name cannot be empty', 'error');
            return;
        }
        if (entries.some(e => e.key.toLowerCase() === newKeyName.trim().toLowerCase())) {
            showAlert('Key name already exists', 'error');
            return;
        }

        const newEntry: TranslationEntry = {
            key: newKeyName.trim(),
            sourceText: newKeySourceText.trim(),
            translations: {
                [sourceLanguage]: newKeySourceText.trim()
            },
            context: newKeyContext.trim(),
            isModified: true
        };

        setEntries([newEntry, ...entries]);
        setNewKeyName('');
        setNewKeySourceText('');
        setNewKeyContext('');
        setShowAddKeyModal(false);
        showAlert(`Key "${newEntry.key}" added`, 'success');
    };

    // Delete Key
    const handleDeleteKey = (keyToDelete: string) => {
        setEntries(entries.filter(e => e.key !== keyToDelete));
    };

    // Update Source or Translation Value
    const handleValueChange = (key: string, langCode: string, newValue: string) => {
        setEntries(prev => prev.map(entry => {
            if (entry.key === key) {
                const updatedTranslations = { ...entry.translations, [langCode]: newValue };
                return {
                    ...entry,
                    sourceText: langCode === sourceLanguage ? newValue : entry.sourceText,
                    translations: updatedTranslations,
                    isModified: true
                };
            }
            return entry;
        }));
    };

    // Translate Single Key
    const handleTranslateSingle = async (key: string, targetLang: string) => {
        const entry = entries.find(e => e.key === key);
        if (!entry || !entry.sourceText) {
            showAlert('Source text is empty', 'error');
            return;
        }

        setTranslatingKey(`${key}_${targetLang}`);
        try {
            const translated = await translateText(entry.sourceText, sourceLanguage, targetLang);
            handleValueChange(key, targetLang, translated);
            showAlert(`Translated "${key}" to ${targetLang}`, 'success');
        } catch (e: any) {
            showAlert(e.message || 'Translation failed', 'error');
        } finally {
            setTranslatingKey(null);
        }
    };

    // Batch Translate Missing Keys for Active Tab or All Selected Target Languages
    const handleBatchTranslate = async (forSpecificLanguage?: string) => {
        if (entries.length === 0) return;

        const languagesToProcess = forSpecificLanguage ? [forSpecificLanguage] : targetLanguages;
        setIsTranslating(true);

        try {
            let totalOperations = 0;
            const tasksByLang: { [lang: string]: { id: string; text: string }[] } = {};

            languagesToProcess.forEach(lang => {
                const missingEntries = entries
                    .filter(e => e.sourceText && (!e.translations[lang] || !e.translations[lang].trim()))
                    .map(e => ({ id: e.key, text: e.sourceText }));
                tasksByLang[lang] = missingEntries;
                totalOperations += missingEntries.length;
            });

            if (totalOperations === 0) {
                showAlert('All selected keys already have translations!', 'info');
                setIsTranslating(false);
                return;
            }

            setTranslateProgress({ completed: 0, total: totalOperations });
            let overallCompleted = 0;

            for (const lang of languagesToProcess) {
                const tasks = tasksByLang[lang];
                if (tasks.length === 0) continue;

                // Auto switch active table tab to this language so the user sees the progress live!
                setSelectedLanguageTab(lang);
                setTranslateProgress(prev => ({ ...prev, targetLang: lang }));

                await batchTranslate(
                    tasks,
                    sourceLanguage,
                    lang,
                    (completedCount) => {
                        setTranslateProgress({
                            completed: overallCompleted + completedCount,
                            total: totalOperations,
                            targetLang: lang
                        });
                    },
                    (key, translatedText) => {
                        // Live update each row one-by-one in the UI!
                        setActiveTranslatingKey(key);

                        setEntries(prev => prev.map(entry => {
                            if (entry.key === key) {
                                return {
                                    ...entry,
                                    translations: {
                                        ...entry.translations,
                                        [lang]: translatedText
                                    },
                                    isModified: true
                                };
                            }
                            return entry;
                        }));

                        // Auto advance page and auto scroll to completed row / code preview if enabled
                        if (autoScrollRef.current) {
                            // 1. In Table view: Find index of this key in filteredEntries to auto-navigate page
                            const keyIndex = filteredEntries.findIndex(e => e.key === key);
                            if (keyIndex !== -1) {
                                const targetPage = Math.floor(keyIndex / pageSize) + 1;
                                setCurrentPage(prevPage => (prevPage !== targetPage ? targetPage : prevPage));
                            }

                            const rowEl = rowRefs.current[key];
                            if (rowEl) {
                                rowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }

                            // 2. In Code Preview view: Find and scroll precisely to the line containing the active key
                            const previewBox = previewContainersRef.current[lang];
                            if (previewBox) {
                                const fullText = previewBox.innerText || previewBox.textContent || '';
                                const lines = fullText.split('\n');
                                const lineIdx = lines.findIndex(l => l.includes(`"${key}"`) || l.includes(`name="${key}"`) || l.includes(key));
                                if (lineIdx !== -1 && lines.length > 0) {
                                    const approxLineHeight = 18; // approx font-mono text-xs line height in px
                                    const targetScrollTop = Math.max(0, (lineIdx * approxLineHeight) - (previewBox.clientHeight / 2));
                                    previewBox.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
                                }
                            }
                        }
                    },
                    6
                );

                overallCompleted += tasks.length;
            }

            setActiveTranslatingKey(null);
            showAlert(`Batch translation complete! (${totalOperations} keys translated)`, 'success');
        } catch (err: any) {
            console.error(err);
            showAlert(err.message || 'Batch translation encountered an error', 'error');
        } finally {
            setIsTranslating(false);
        }
    };

    // Filter and Search Entries
    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            // Search Query
            const matchesSearch = !searchQuery ||
                entry.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                Object.values(entry.translations).some(t => String(t).toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            // Status Filter
            const currentTabTranslation = entry.translations[selectedLanguageTab];
            const isMissing = !currentTabTranslation || !currentTabTranslation.trim();

            if (statusFilter === 'missing') return isMissing;
            if (statusFilter === 'translated') return !isMissing;
            if (statusFilter === 'modified') return !!entry.isModified;

            return true;
        });
    }, [entries, searchQuery, statusFilter, selectedLanguageTab]);

    // Paginated Entries for maximum rendering performance with large datasets
    const totalPages = Math.max(1, Math.ceil(filteredEntries.length / pageSize));
    const paginatedEntries = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredEntries.slice(start, start + pageSize);
    }, [filteredEntries, currentPage, pageSize]);

    // Statistics
    const stats = useMemo(() => {
        const total = entries.length;
        if (total === 0) return { total: 0, translated: 0, missing: 0, percent: 0 };

        const translated = entries.filter(e => e.translations[selectedLanguageTab] && e.translations[selectedLanguageTab].trim()).length;
        const missing = total - translated;
        const percent = Math.round((translated / total) * 100);

        return { total, translated, missing, percent };
    }, [entries, selectedLanguageTab]);

    // Language Toggle for Target Selector
    const toggleTargetLanguage = (langCode: string) => {
        if (langCode === sourceLanguage) return;
        if (targetLanguages.includes(langCode)) {
            if (targetLanguages.length === 1) {
                showAlert('You must keep at least one target language', 'info');
                return;
            }
            const updated = targetLanguages.filter(l => l !== langCode);
            setTargetLanguages(updated);
            if (selectedLanguageTab === langCode) {
                setSelectedLanguageTab(updated[0]);
            }
        } else {
            const updated = [...targetLanguages, langCode];
            setTargetLanguages(updated);
            setSelectedLanguageTab(langCode);
        }
    };

    // Generate Preview Content String
    const getPreviewContent = useCallback((format: 'json' | 'android' | 'ios', langCode: string): string => {
        try {
            const langData: { [key: string]: string } = {};
            entries.forEach(e => {
                langData[e.key] = e.translations[langCode] || (langCode === sourceLanguage ? e.sourceText : '');
            });

            if (format === 'json') {
                const nested = unflattenJSON(langData);
                return JSON.stringify(nested, null, 2);
            } else if (format === 'android') {
                return serializeAndroidXml(langData);
            } else if (format === 'ios') {
                return serializeIosStrings(langData);
            }
        } catch (err) {
            console.error('Error generating preview for:', format, langCode, err);
            return `// Error generating ${format.toUpperCase()} preview: ${String(err)}`;
        }
        return '';
    }, [entries, sourceLanguage]);

    // Export Specific File
    const handleExportFile = (format: 'json' | 'android' | 'ios' | 'excel' | 'csv', langCode: string) => {
        if (entries.length === 0) return;

        if (format === 'excel' || format === 'csv') {
            const headerRow = ['KEY', sourceLanguage.toUpperCase(), ...targetLanguages.map(l => l.toUpperCase())];
            const dataRows = entries.map(e => [
                e.key,
                e.sourceText || e.translations[sourceLanguage] || '',
                ...targetLanguages.map(l => e.translations[l] || '')
            ]);

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
            XLSX.utils.book_append_sheet(wb, ws, 'Translations');

            if (format === 'excel') {
                XLSX.writeFile(wb, `${fileName ? fileName.replace(/\.[^/.]+$/, '') : 'translations'}.xlsx`);
            } else {
                XLSX.writeFile(wb, `${fileName ? fileName.replace(/\.[^/.]+$/, '') : 'translations'}.csv`, { bookType: 'csv' });
            }
            showAlert(`Exported ${format.toUpperCase()} spreadsheet!`, 'success');
            return;
        }

        const content = getPreviewContent(format, langCode);
        let blob: Blob;
        let exportFileName = `${langCode}.json`;

        if (format === 'json') {
            blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
            exportFileName = `${langCode}.json`;
        } else if (format === 'android') {
            blob = new Blob([content], { type: 'application/xml;charset=utf-8;' });
            exportFileName = `strings-${langCode}.xml`;
        } else {
            blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
            exportFileName = `Localizable-${langCode}.strings`;
        }

        saveAs(blob, exportFileName);
        showAlert(`Exported ${exportFileName}`, 'success');
    };

    // Export Custom Selection As ZIP or Single File
    const handleExecuteCustomExport = async () => {
        if (entries.length === 0) return;

        const langsToExport = exportLanguages.length > 0
            ? exportLanguages
            : Array.from(new Set([sourceLanguage, ...targetLanguages]));

        const hasAnyFormat = exportFormats.json || exportFormats.android || exportFormats.ios || exportFormats.excel || exportFormats.csv;
        if (!hasAnyFormat) {
            showAlert('Please select at least one format to export', 'error');
            return;
        }

        // Count how many formats are chosen
        const activeFormatCount = Object.values(exportFormats).filter(Boolean).length;

        // If only 1 format is chosen and only 1 language (for json/android/ios), export directly as single file
        if (activeFormatCount === 1 && langsToExport.length === 1 && !exportFormats.excel && !exportFormats.csv) {
            const format = exportFormats.json ? 'json' : exportFormats.android ? 'android' : 'ios';
            handleExportFile(format, langsToExport[0]);
            setShowExportModal(false);
            return;
        }

        if (activeFormatCount === 1 && exportFormats.excel) {
            handleExportFile('excel', selectedLanguageTab);
            setShowExportModal(false);
            return;
        }

        if (activeFormatCount === 1 && exportFormats.csv) {
            handleExportFile('csv', selectedLanguageTab);
            setShowExportModal(false);
            return;
        }

        // Build Custom ZIP
        const zip = new JSZip();

        // 1. JSON Folder
        if (exportFormats.json) {
            const jsonFolder = zip.folder('locales_json');
            langsToExport.forEach(lang => {
                const content = getPreviewContent('json', lang);
                jsonFolder?.file(`${lang}.json`, content);
            });
        }

        // 2. Android Folder
        if (exportFormats.android) {
            const androidFolder = zip.folder('android_res');
            langsToExport.forEach(lang => {
                const content = getPreviewContent('android', lang);
                const folderName = lang === sourceLanguage ? 'values' : `values-${lang}`;
                androidFolder?.file(`${folderName}/strings.xml`, content);
            });
        }

        // 3. iOS Folder
        if (exportFormats.ios) {
            const iosFolder = zip.folder('ios_strings');
            langsToExport.forEach(lang => {
                const content = getPreviewContent('ios', lang);
                iosFolder?.file(`${lang}.lproj/Localizable.strings`, content);
            });
        }

        // 4. Excel
        if (exportFormats.excel) {
            const headerRow = ['KEY', ...langsToExport.map(l => l.toUpperCase())];
            const dataRows = entries.map(e => [
                e.key,
                ...langsToExport.map(l => e.translations[l] || (l === sourceLanguage ? e.sourceText : ''))
            ]);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
            XLSX.utils.book_append_sheet(wb, ws, 'Translations');
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            zip.file('translations.xlsx', excelBuffer);
        }

        // 5. CSV
        if (exportFormats.csv) {
            const headerRow = ['KEY', ...langsToExport.map(l => l.toUpperCase())];
            const dataRows = entries.map(e => [
                e.key,
                ...langsToExport.map(l => e.translations[l] || (l === sourceLanguage ? e.sourceText : ''))
            ]);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
            XLSX.utils.book_append_sheet(wb, ws, 'Translations');
            const csvBuffer = XLSX.write(wb, { bookType: 'csv', type: 'string' });
            zip.file('translations.csv', csvBuffer);
        }

        const zipContent = await zip.generateAsync({ type: 'blob' });
        saveAs(zipContent, 'translations_export.zip');
        setShowExportModal(false);
        showAlert('Downloaded custom export package!', 'success');
    };

    // Copy Preview to Clipboard
    const handleCopyPreview = (content: string, format: string) => {
        navigator.clipboard.writeText(content);
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 2000);
        showAlert('Copied to clipboard!', 'success');
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Top Navigation & Status Bar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Languages className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight">App Translation Studio</h1>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                <ShieldCheck className="w-3 h-3" /> 100% Free Engine
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Translate JSON, Android XML, iOS Strings & Excel with placeholder protection
                        </p>
                    </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2">
                    {entries.length > 0 && (
                        <>
                            <button
                                onClick={() => handleBatchTranslate(selectedLanguageTab)}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                                title={`Translate missing for ${selectedLanguageTab.toUpperCase()}`}
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Translate {selectedLanguageTab.toUpperCase()}</span>
                            </button>

                            <button
                                onClick={() => handleBatchTranslate()}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                <RefreshCw className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
                                <span>Translate All</span>
                            </button>

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

                            <button
                                onClick={() => {
                                    setExportLanguages(Array.from(new Set([sourceLanguage, ...targetLanguages])));
                                    setShowExportModal(true);
                                }}
                                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition-colors shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export / Download</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Notification Banner */}
            {alertMessage && (
                <div className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between transition-colors ${alertMessage.type === 'success' ? 'bg-emerald-500 text-white' :
                    alertMessage.type === 'error' ? 'bg-rose-500 text-white' :
                        'bg-blue-500 text-white'
                    }`}>
                    <span>{alertMessage.text}</span>
                    <button onClick={() => setAlertMessage(null)} className="hover:opacity-75">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Translation Progress Indicator */}
            {isTranslating && (
                <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 px-6 py-3">
                    <div className="flex items-center justify-between text-xs font-medium text-blue-700 dark:text-blue-300 mb-1.5">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Translating to {translateProgress.targetLang?.toUpperCase() || 'Target Languages'}...</span>
                        </div>
                        <span>{translateProgress.completed} / {translateProgress.total} keys ({Math.round((translateProgress.completed / Math.max(1, translateProgress.total)) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-900/60 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                            style={{ width: `${(translateProgress.completed / Math.max(1, translateProgress.total)) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {entries.length === 0 ? (
                /* Empty / Upload State */
                <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
                    <div className="max-w-xl w-full">
                        {isReadingFile ? (
                            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg text-center animate-in fade-in zoom-in-95 duration-200">
                                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                                    <RefreshCw className="w-7 h-7 animate-spin" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                    Reading & Parsing Translation Files...
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">
                                    {readProgress.status || 'Extracting keys and languages...'}
                                </p>

                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 shadow-xs"
                                        style={{ width: `${readProgress.percent}%` }}
                                    />
                                </div>
                                <div className="mt-2 text-right text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                    {readProgress.percent}%
                                </div>
                            </div>
                        ) : (
                            <>
                                <DropZone
                                    onFilesDropped={handleFilesDropped}
                                    accept=".json,.xml,.strings,.xlsx,.xls,.csv,.zip"
                                    dragDropText="Drop JSON, Android XML, iOS Strings, Excel or ZIP"
                                    supportedText="Supports .json, .xml, .strings, .xlsx, .xls, .csv, .zip"
                                />

                                <div className="mt-6 flex items-center justify-center gap-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Or start with a blank project:</span>
                                    <button
                                        onClick={() => {
                                            setEntries([
                                                { key: 'app_title', sourceText: 'My Amazing App', translations: { en: 'My Amazing App' } },
                                                { key: 'welcome_message', sourceText: 'Welcome %s to our platform!', translations: { en: 'Welcome %s to our platform!' } },
                                                { key: 'button_signin', sourceText: 'Sign In', translations: { en: 'Sign In' } }
                                            ]);
                                            setSourceLanguage('en');
                                            showAlert('Started with template entries', 'info');
                                        }}
                                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Load Example Template
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                /* Interactive Editor / Table / Preview Stage */
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Control Ribbon */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                        {/* Left: Source Language Selector & Language Tabs */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/60 px-2.5 py-1.5 rounded-lg text-xs font-medium">
                                <span className="text-gray-500 dark:text-gray-400">Source:</span>
                                <select
                                    value={sourceLanguage}
                                    onChange={(e) => setSourceLanguage(e.target.value)}
                                    className="bg-transparent font-bold text-blue-600 dark:text-blue-400 outline-none cursor-pointer"
                                >
                                    {SUPPORTED_LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code} className="dark:bg-gray-800 dark:text-white">
                                            {lang.name} ({lang.code.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <ArrowRight className="w-4 h-4 text-gray-400 mx-0.5" />

                            {/* Target Language Tabs */}
                            <div className="flex items-center gap-1.5 overflow-x-auto max-w-2xl py-1 no-scrollbar">
                                {targetLanguages.map(langCode => {
                                    const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                                    const langTranslatedCount = entries.filter(e => e.translations[langCode]?.trim()).length;
                                    const isComplete = langTranslatedCount === entries.length && entries.length > 0;
                                    const isActive = selectedLanguageTab === langCode;

                                    return (
                                        <button
                                            key={langCode}
                                            onClick={() => setSelectedLanguageTab(langCode)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap shadow-2xs ${isActive
                                                ? 'bg-blue-600 text-white shadow-blue-500/20'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200/80 dark:border-gray-700'
                                                }`}
                                        >
                                            <span>{langMeta?.name || langCode.toUpperCase()}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive
                                                ? 'bg-white/20 text-white'
                                                : isComplete
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                {langTranslatedCount}/{entries.length}
                                            </span>
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setShowLangSelectorModal(true)}
                                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl flex items-center gap-1.5 transition-all border border-blue-200 dark:border-blue-800/60 whitespace-nowrap"
                                    title="Add or remove languages"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Manage ({targetLanguages.length})</span>
                                </button>
                            </div>
                        </div>

                        {/* Right: View Toggles & Search */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search keys or text..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e: any) => setStatusFilter(e.target.value)}
                                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none"
                            >
                                <option value="all">All Keys ({entries.length})</option>
                                <option value="missing">Missing Only ({stats.missing})</option>
                                <option value="translated">Translated ({stats.translated})</option>
                                <option value="modified">Modified</option>
                            </select>

                            <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-0.5">
                                <button
                                    onClick={() => setActiveView('table')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeView === 'table' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    <Table className="w-3.5 h-3.5" /> Table
                                </button>
                                <button
                                    onClick={() => setActiveView('preview')}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${activeView === 'preview' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    <Eye className="w-3.5 h-3.5" /> Code Preview
                                </button>
                            </div>

                            <button
                                onClick={() => setAutoScroll(!autoScroll)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${autoScroll
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
                                    }`}
                                title="Auto-scroll table to current translating key"
                            >
                                <ArrowDown className={`w-3.5 h-3.5 ${autoScroll ? 'animate-bounce' : ''}`} />
                                <span>Auto-Scroll</span>
                            </button>

                            <button
                                onClick={() => setShowAddKeyModal(true)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Key</span>
                            </button>
                        </div>
                    </div>

                    {/* View Body */}
                    {activeView === 'table' ? (
                        /* Table View */
                        <div ref={tableContainerRef} className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4 scroll-smooth">
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                                            <th className="py-3 px-4 w-1/4">Key Name</th>
                                            <th className="py-3 px-4 w-1/3">
                                                Source ({sourceLanguage.toUpperCase()})
                                            </th>
                                            <th className="py-3 px-4 w-1/3">
                                                Target ({selectedLanguageTab.toUpperCase()})
                                            </th>
                                            <th className="py-3 px-4 text-right w-24">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {paginatedEntries.map((entry) => {
                                            const targetVal = entry.translations[selectedLanguageTab] || '';
                                            const isRowTranslating = translatingKey === `${entry.key}_${selectedLanguageTab}` || activeTranslatingKey === entry.key;

                                            return (
                                                <tr
                                                    key={entry.key}
                                                    ref={(el) => { rowRefs.current[entry.key] = el; }}
                                                    className={`transition-colors ${isRowTranslating
                                                        ? 'bg-blue-100/70 dark:bg-blue-900/50 ring-1 ring-blue-500'
                                                        : 'hover:bg-blue-50/40 dark:hover:bg-gray-700/30'
                                                        }`}
                                                >
                                                    <td className="py-3 px-4 align-top font-mono text-gray-800 dark:text-gray-200 font-semibold select-all break-all">
                                                        {entry.key}
                                                        {entry.context && (
                                                            <div className="text-[11px] font-sans font-normal text-gray-400 mt-0.5">
                                                                {entry.context}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 align-top">
                                                        <textarea
                                                            value={entry.sourceText}
                                                            onChange={(e) => handleValueChange(entry.key, sourceLanguage, e.target.value)}
                                                            rows={Math.max(1, Math.min(4, Math.ceil((entry.sourceText.length || 1) / 45)))}
                                                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans resize-none"
                                                            placeholder="Source text..."
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 align-top">
                                                        <textarea
                                                            value={targetVal}
                                                            onChange={(e) => handleValueChange(entry.key, selectedLanguageTab, e.target.value)}
                                                            rows={Math.max(1, Math.min(4, Math.ceil((targetVal.length || 1) / 45)))}
                                                            className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-1 font-sans resize-none transition-colors ${!targetVal.trim()
                                                                ? 'border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/20 focus:ring-amber-500'
                                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500'
                                                                }`}
                                                            placeholder={`Translation in ${selectedLanguageTab.toUpperCase()}...`}
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 align-top text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => handleTranslateSingle(entry.key, selectedLanguageTab)}
                                                                disabled={isRowTranslating || !entry.sourceText}
                                                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg disabled:opacity-40 transition-colors"
                                                                title="Translate this key"
                                                            >
                                                                <Sparkles className={`w-4 h-4 ${isRowTranslating ? 'animate-spin' : ''}`} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteKey(entry.key)}
                                                                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                                                title="Delete key"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Pagination Footer */}
                                {filteredEntries.length > 0 && (
                                    <div className="px-4 py-3 bg-gray-50/80 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <span>
                                                Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                                <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * pageSize, filteredEntries.length)}</span> of{' '}
                                                <span className="font-semibold text-gray-900 dark:text-white">{filteredEntries.length}</span> entries
                                            </span>
                                            <span className="text-gray-300 dark:text-gray-700">|</span>
                                            <span>Rows per page:</span>
                                            <select
                                                value={pageSize}
                                                onChange={(e) => {
                                                    setPageSize(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-0.5 text-gray-700 dark:text-gray-200"
                                            >
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                                <option value={200}>200</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(1)}
                                                className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                            >
                                                First
                                            </button>
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                            >
                                                Prev
                                            </button>
                                            <span className="px-3 py-1 font-semibold text-blue-600 dark:text-blue-400">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                disabled={currentPage >= totalPages}
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                            >
                                                Next
                                            </button>
                                            <button
                                                disabled={currentPage >= totalPages}
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                            >
                                                Last
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {filteredEntries.length === 0 && (
                                    <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                                        No keys matching current filter criteria.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Code Preview View */
                        <div className="flex-1 flex flex-col p-4 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden shadow-xs">
                                {/* Preview Sub-header */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-900/50">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {(['json', 'android', 'ios', 'excel'] as const).map(fmt => (
                                            <button
                                                key={fmt}
                                                onClick={() => setPreviewFormat(fmt)}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${previewFormat === fmt
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {fmt === 'android' ? 'Android XML' : fmt === 'ios' ? 'iOS .strings' : fmt === 'excel' ? 'Excel / CSV' : 'JSON'}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Multi-Language Selector Pills for Preview */}
                                    {previewFormat !== 'excel' && (
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-xs text-gray-500 font-medium mr-1">Languages:</span>
                                            <button
                                                onClick={() => {
                                                    const all = Array.from(new Set([sourceLanguage, ...targetLanguages]));
                                                    setPreviewLanguages(previewLanguages.length === all.length ? [selectedLanguageTab] : all);
                                                }}
                                                className="px-2 py-1 text-[11px] font-semibold rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 transition-colors"
                                            >
                                                {previewLanguages.length === Array.from(new Set([sourceLanguage, ...targetLanguages])).length ? 'Deselect All' : 'Select All'}
                                            </button>
                                            {Array.from(new Set([sourceLanguage, ...targetLanguages])).map(langCode => {
                                                const isSelected = previewLanguages.length === 0
                                                    ? langCode === selectedLanguageTab
                                                    : previewLanguages.includes(langCode);

                                                return (
                                                    <button
                                                        key={langCode}
                                                        onClick={() => {
                                                            if (previewLanguages.length === 0) {
                                                                const initial = [selectedLanguageTab, langCode].filter((v, i, a) => a.indexOf(v) === i);
                                                                setPreviewLanguages(initial);
                                                            } else if (previewLanguages.includes(langCode)) {
                                                                if (previewLanguages.length > 1) {
                                                                    setPreviewLanguages(previewLanguages.filter(l => l !== langCode));
                                                                }
                                                            } else {
                                                                setPreviewLanguages([...previewLanguages, langCode]);
                                                            }
                                                        }}
                                                        className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1 transition-all ${isSelected
                                                                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-bold'
                                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {isSelected ? <CheckSquare className="w-3 h-3 text-blue-600 dark:text-blue-400" /> : <Square className="w-3 h-3 text-gray-400" />}
                                                        <span>{langCode.toUpperCase()}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setExportLanguages(Array.from(new Set([sourceLanguage, ...targetLanguages])));
                                                setShowExportModal(true);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Export Options</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Editor Body */}
                                <div className="flex-1 p-4 overflow-auto bg-gray-900 text-gray-100 rounded-b-xl">
                                    {previewFormat === 'excel' ? (
                                        <div className="font-sans text-gray-300 max-w-xl">
                                            <p className="mb-2 font-semibold text-white">Multi-Language Spreadsheet Export:</p>
                                            <p className="text-xs text-gray-400 mb-4">
                                                All {entries.length} keys across {targetLanguages.length + 1} languages ({sourceLanguage.toUpperCase()} + {targetLanguages.map(l => l.toUpperCase()).join(', ')}) will be formatted with separate columns for each language.
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleExportFile('excel', selectedLanguageTab)}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 flex items-center gap-2 shadow-xs"
                                                >
                                                    <FileSpreadsheet className="w-4 h-4" /> Download .XLSX Workbook
                                                </button>
                                                <button
                                                    onClick={() => handleExportFile('csv', selectedLanguageTab)}
                                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg text-xs font-medium hover:bg-gray-600 flex items-center gap-2 shadow-xs"
                                                >
                                                    <FileSpreadsheet className="w-4 h-4" /> Download .CSV
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Multi-Language Code Preview Grid */
                                        <div className={`grid gap-4 ${(previewLanguages.length > 0 ? previewLanguages : [selectedLanguageTab]).length === 1
                                                ? 'grid-cols-1'
                                                : 'grid-cols-1 xl:grid-cols-2'
                                            }`}>
                                            {(previewLanguages.length > 0 ? previewLanguages : [selectedLanguageTab]).map(langCode => {
                                                const content = getPreviewContent(previewFormat, langCode);
                                                const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === langCode);

                                                return (
                                                    <div key={langCode} className="flex flex-col bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
                                                        <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-xs text-blue-400 font-mono">{langCode.toUpperCase()}</span>
                                                                <span className="text-[11px] text-gray-400">({langMeta?.name || langCode})</span>
                                                                <span className="text-[10px] text-gray-500 font-mono">
                                                                    {previewFormat === 'json' ? `${langCode}.json` : previewFormat === 'android' ? `values-${langCode}/strings.xml` : `${langCode}.lproj/Localizable.strings`}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    onClick={() => handleCopyPreview(content, `${previewFormat}_${langCode}`)}
                                                                    className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
                                                                    title="Copy this code"
                                                                >
                                                                    {copiedFormat === `${previewFormat}_${langCode}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleExportFile(previewFormat, langCode)}
                                                                    className="p-1.5 text-blue-400 hover:text-blue-300 rounded-md hover:bg-gray-800 transition-colors"
                                                                    title={`Export ${langCode.toUpperCase()}`}
                                                                >
                                                                    <Download className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div
                                                            ref={(el) => { previewContainersRef.current[langCode] = el; }}
                                                            className="p-3 font-mono text-xs overflow-auto max-h-[500px] scroll-smooth custom-scrollbar"
                                                        >
                                                            <pre className="whitespace-pre-wrap">{content}</pre>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Target Language Manager Modal */}
            {showLangSelectorModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-750 flex flex-col max-h-[88vh]">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Languages className="w-5 h-5 text-blue-400" />
                                    <span>Target Languages ({targetLanguages.length} selected)</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Choose languages for automatic translation and multi-format exports.
                                </p>
                            </div>
                            <button onClick={() => setShowLangSelectorModal(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Quick Presets & Controls */}
                        <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold text-slate-400 mr-1">Presets:</span>
                                <button
                                    onClick={() => setTargetLanguages(['km', 'es', 'fr', 'zh', 'ja', 'ko', 'de', 'ru', 'ar', 'th', 'vi'])}
                                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 font-medium transition-colors border border-slate-700 hover:border-blue-500"
                                >
                                    Top Global
                                </button>
                                <button
                                    onClick={() => setTargetLanguages(['km', 'th', 'vi', 'id', 'ms', 'my', 'lo', 'tl'])}
                                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 font-medium transition-colors border border-slate-700 hover:border-blue-500"
                                >
                                    Southeast Asia
                                </button>
                                <button
                                    onClick={() => setTargetLanguages(['es', 'fr', 'de', 'it', 'pt', 'ru', 'nl', 'pl'])}
                                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 font-medium transition-colors border border-slate-700 hover:border-blue-500"
                                >
                                    European
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setTargetLanguages(SUPPORTED_LANGUAGES.filter(l => l.code !== sourceLanguage).map(l => l.code))}
                                    className="text-xs text-blue-400 font-semibold hover:text-blue-300 hover:underline"
                                >
                                    Select All
                                </button>
                                <span className="text-slate-600">|</span>
                                <button
                                    onClick={() => setTargetLanguages([])}
                                    className="text-xs text-rose-400 font-semibold hover:text-rose-300 hover:underline"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>

                        {/* Language Grid */}
                        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1 py-1 custom-scrollbar">
                            {SUPPORTED_LANGUAGES.map(lang => {
                                const isSource = lang.code === sourceLanguage;
                                const isSelected = targetLanguages.includes(lang.code);

                                return (
                                    <button
                                        key={lang.code}
                                        disabled={isSource}
                                        onClick={() => toggleTargetLanguage(lang.code)}
                                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${isSource
                                                ? 'opacity-30 border-slate-800 bg-slate-950/50 cursor-not-allowed text-slate-500'
                                                : isSelected
                                                    ? 'border-blue-500 bg-blue-950/50 text-white ring-1 ring-blue-500 shadow-sm shadow-blue-950'
                                                    : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:border-slate-700'
                                            }`}
                                    >
                                        <div>
                                            <div className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                                                {lang.name}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                {lang.nativeName} <span className="font-bold text-blue-400">({lang.code.toUpperCase()})</span>
                                            </div>
                                        </div>
                                        {isSelected ? (
                                            <CheckSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                        ) : (
                                            <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
                            <button
                                onClick={() => setShowLangSelectorModal(false)}
                                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/30 transition-colors"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export & Download Customization Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-750 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Download className="w-5 h-5 text-blue-400" />
                                    <span>Export Options</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Select target file formats and languages to generate
                                </p>
                            </div>
                            <button onClick={() => setShowExportModal(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Format Selection Cards */}
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-slate-300 mb-2">
                                Select Export Formats:
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {[
                                    { key: 'json', title: 'Web / JSON', desc: '.json (i18next/React)' },
                                    { key: 'android', title: 'Android XML', desc: 'res/values/strings.xml' },
                                    { key: 'ios', title: 'iOS .strings', desc: 'Localizable.strings' },
                                    { key: 'excel', title: 'Excel Workbook', desc: '.xlsx multi-column' },
                                    { key: 'csv', title: 'CSV File', desc: '.csv spreadsheet' }
                                ].map(fmt => {
                                    const isChecked = exportFormats[fmt.key as keyof typeof exportFormats];
                                    return (
                                        <button
                                            key={fmt.key}
                                            onClick={() => setExportFormats(prev => ({
                                                ...prev,
                                                [fmt.key]: !prev[fmt.key as keyof typeof exportFormats]
                                            }))}
                                            className={`p-3 rounded-xl border text-left transition-all ${isChecked
                                                    ? 'border-blue-500 bg-blue-950/50 text-white ring-1 ring-blue-500 shadow-sm shadow-blue-950'
                                                    : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:border-slate-700'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-bold ${isChecked ? 'text-blue-300' : 'text-slate-200'}`}>{fmt.title}</span>
                                                {isChecked ? (
                                                    <CheckSquare className="w-4 h-4 text-blue-400" />
                                                ) : (
                                                    <Square className="w-4 h-4 text-slate-500" />
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-mono">{fmt.desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Language Selection Filter */}
                        <div className="flex-1 flex flex-col min-h-0 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-slate-300">
                                    Include Languages ({exportLanguages.length > 0 ? exportLanguages.length : targetLanguages.length + 1}):
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setExportLanguages(Array.from(new Set([sourceLanguage, ...targetLanguages])))}
                                        className="text-xs text-blue-400 font-semibold hover:text-blue-300 hover:underline"
                                    >
                                        Select All
                                    </button>
                                    <span className="text-slate-600">|</span>
                                    <button
                                        onClick={() => setExportLanguages([selectedLanguageTab])}
                                        className="text-xs text-slate-400 hover:text-slate-200 hover:underline"
                                    >
                                        Only {selectedLanguageTab.toUpperCase()}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/60 custom-scrollbar">
                                {Array.from(new Set([sourceLanguage, ...targetLanguages])).map(langCode => {
                                    const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                                    const isSelected = exportLanguages.length === 0 || exportLanguages.includes(langCode);

                                    return (
                                        <button
                                            key={langCode}
                                            onClick={() => {
                                                if (exportLanguages.length === 0) {
                                                    const all = Array.from(new Set([sourceLanguage, ...targetLanguages]));
                                                    setExportLanguages(all.filter(l => l !== langCode));
                                                } else if (exportLanguages.includes(langCode)) {
                                                    if (exportLanguages.length > 1) {
                                                        setExportLanguages(exportLanguages.filter(l => l !== langCode));
                                                    }
                                                } else {
                                                    setExportLanguages([...exportLanguages, langCode]);
                                                }
                                            }}
                                            className={`p-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${isSelected
                                                    ? 'bg-blue-950/70 text-blue-200 border border-blue-600'
                                                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                                                }`}
                                        >
                                            <span className="font-bold">{langCode.toUpperCase()} <span className="font-normal text-[11px] text-slate-400">({langMeta?.name || langCode})</span></span>
                                            {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-blue-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Export Action Buttons */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-mono">
                                Total: {entries.length} keys
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExecuteCustomExport}
                                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/30 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download Selected</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Key Modal */}
            {showAddKeyModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Translation Key</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Key Identifier
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. auth.signin_button or welcome_text"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    className="w-full p-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Source Text ({sourceLanguage.toUpperCase()})
                                </label>
                                <textarea
                                    placeholder="e.g. Sign in to your account"
                                    value={newKeySourceText}
                                    onChange={(e) => setNewKeySourceText(e.target.value)}
                                    rows={3}
                                    className="w-full p-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Context / Notes (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Header button on authentication screen"
                                    value={newKeyContext}
                                    onChange={(e) => setNewKeyContext(e.target.value)}
                                    className="w-full p-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setShowAddKeyModal(false)}
                                className="px-4 py-2 text-xs font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddKey}
                                className="px-5 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Add Key
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
