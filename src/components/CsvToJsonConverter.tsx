import { useState, useEffect } from 'react';
import { Download, AlertCircle, CheckCircle, ArrowRightLeft, Upload, FileSpreadsheet, Loader2, X, Table, Network, Search, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { MindmapViewer } from './MindmapViewer';
import jsonIcon from '../assets/json-icon.svg';
import androidIcon from '../assets/android-icon.svg';
import iosIcon from '../assets/ios-icon.svg';

interface TranslationData {
    [language: string]: any;
}

interface GeneratedContent {
    json: TranslationData;
    android: { [language: string]: string };
    ios: { [language: string]: string };
}

type Mode = 'import' | 'export'; // import: CSV -> Code, export: Code -> CSV
type Format = 'json' | 'android' | 'ios';

export function CsvToJsonConverter() {
    const { t } = useTranslation();
    const [mode, setMode] = useState<Mode>('import');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Import Mode State
    const [generatedFiles, setGeneratedFiles] = useState<GeneratedContent | null>(null);
    const [detectedLanguages, setDetectedLanguages] = useState<string[]>([]);
    const [activePreviewTab, setActivePreviewTab] = useState<string>('');
    const [activeFormat, setActiveFormat] = useState<Format>('json');

    // Manual Column Selection State
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [columnsForSelection, setColumnsForSelection] = useState<string[]>([]);
    const [rawImportRows, setRawImportRows] = useState<any[][] | null>(null);
    const [headerRowIndexState, setHeaderRowIndexState] = useState<number>(-1);

    // Sheet Selection State
    const [showSheetSelector, setShowSheetSelector] = useState(false);
    const [availableSheets, setAvailableSheets] = useState<string[]>([]);
    const [tempWorkbook, setTempWorkbook] = useState<XLSX.WorkBook | null>(null);

    // Language Selection State
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [pendingRows, setPendingRows] = useState<any[][] | null>(null);
    const [pendingKeyIndex, setPendingKeyIndex] = useState<number>(-1);
    const [pendingHeaderRowIndex, setPendingHeaderRowIndex] = useState<number>(-1);

    // Mindmap State
    const [viewMode, setViewMode] = useState<'text' | 'mindmap'>('text');

    // Export Mode State
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [generatedCsv, setGeneratedCsv] = useState<string | null>(null);
    const [exportData, setExportData] = useState<any[][] | null>(null);

    // Progress State
    const [processingProgress, setProcessingProgress] = useState(0);
    const [processingFile, setProcessingFile] = useState<string>('');

    // Search and Detail Popup State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedRow, setSelectedRow] = useState<any[] | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Sort State
    const [sortConfig, setSortConfig] = useState<{ key: number | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
    const [isSorting, setIsSorting] = useState(false);

    const resetState = () => {
        setError(null);
        setSuccess(null);
        setGeneratedFiles(null);
        setDetectedLanguages([]);
        setActivePreviewTab('');
        setUploadedFiles([]);
        setGeneratedCsv(null);
        setExportData(null);
        setShowColumnSelector(false);
        setColumnsForSelection([]);
        setRawImportRows(null);
        setHeaderRowIndexState(-1);
        setShowSheetSelector(false);
        setAvailableSheets([]);
        setTempWorkbook(null);
        setShowLanguageSelector(false);
        setDetectedHeaders([]);
        setSelectedIndices([]);
        setPendingRows(null);
        setPendingKeyIndex(-1);
        setPendingHeaderRowIndex(-1);
        setProcessingProgress(0);
        setProcessingFile('');
        setSearchQuery('');
        setDebouncedSearchQuery('');
        setSelectedRow(null);
        setShowDetailModal(false);
        setSortConfig({ key: null, direction: 'asc' });
    };

    const handleModeChange = (newMode: Mode) => {
        setMode(newMode);
        resetState();
    };

    // Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // --- Import (CSV/Excel -> Code) Logic ---

    const processImportFile = async (file: File) => {
        resetState();
        setIsProcessing(true);

        // Small delay to allow UI to render spinner
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            let rows: any[][] = [];

            if (file.name.endsWith('.csv')) {
                const text = await file.text();
                rows = parseCSV(text);
                processRows(rows);
            } else if (file.name.match(/\.(xlsx|xls)$/)) {
                const arrayBuffer = await file.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                if (workbook.SheetNames.length > 1) {
                    setTempWorkbook(workbook);
                    setAvailableSheets(workbook.SheetNames);
                    setShowSheetSelector(true);
                    setIsProcessing(false);
                    return;
                }

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Obtain full array of arrays
                rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                processRows(rows);
            } else {
                throw new Error(t('csvToJson.invalidFileType', 'Invalid file type'));
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to process file');
            setIsProcessing(false);
        }
    };

    const handleSheetSelect = (sheetName: string) => {
        if (!tempWorkbook) return;

        setShowSheetSelector(false);
        setIsProcessing(true);

        setTimeout(() => {
            try {
                const worksheet = tempWorkbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
                processRows(rows);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to process sheet');
                setIsProcessing(false);
            }
        }, 100);
    };

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

        if (currentField || currentRow.length > 0) {
            currentRow.push(currentField.trim());
            rows.push(currentRow);
        }

        return rows;
    };

    const processRows = (rows: any[][], manualKeyIndex: number = -1, manualHeaderRowIndex: number = -1) => {
        try {
            if (rows.length < 1) {
                throw new Error(t('csvToJson.csvEmpty'));
            }

            let headerRowIndex = manualHeaderRowIndex;
            let headers: string[] = [];

            if (headerRowIndex !== -1) {
                headers = rows[headerRowIndex].map(h => (h !== undefined && h !== null ? String(h).trim() : ''));
            } else {
                // Find header row by searching for 'JSON KEY'
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i].map(h => (h !== undefined && h !== null ? String(h).trim() : ''));
                    if (row.includes('JSON KEY')) {
                        headerRowIndex = i;
                        headers = row;
                        break;
                    }
                }
            }

            // If still not found, trigger manual selection
            if (headerRowIndex === -1) {
                console.log("JSON KEY not found, triggering manual selection");
                setRawImportRows(rows);
                // Default to the first row as headers for selection
                setHeaderRowIndexState(0);
                // Try to sanitize the headers
                const potentialHeaders = rows[0].map(h => (h !== undefined && h !== null ? String(h).trim() : 'Column ' + Math.random().toString(36).substr(2, 5)));
                setColumnsForSelection(potentialHeaders);
                setShowColumnSelector(true);
                setIsProcessing(false); // Stop loading spinner
                return;
            }

            let jsonKeyIndex = manualKeyIndex;
            if (jsonKeyIndex === -1) {
                jsonKeyIndex = headers.findIndex(h => h === 'JSON KEY');
            }

            if (jsonKeyIndex === -1 && manualKeyIndex === -1) {
                // Trigger manual selection if key not found even if header row was guessed
                setRawImportRows(rows);
                setHeaderRowIndexState(headerRowIndex);
                setColumnsForSelection(headers);
                setShowColumnSelector(true);
                setIsProcessing(false);
                return;
            }

            // Store state and prompt user
            setPendingRows(rows);
            setPendingKeyIndex(jsonKeyIndex);
            setPendingHeaderRowIndex(headerRowIndex);

            // Prepare headers for selection (excluding key index)
            setDetectedHeaders(headers);

            // Pre-select based on standard columns logic
            const initialSelectedIndices: number[] = [];

            const standardColumns = [
                'NO', 'PART', 'JSON KEY', 'SCREEN_ID', 'LABEL_TYPE', 'KEY_VALUE',
                'No', 'New Screen ID', 'Screen ID', 'Revised SID', 'LABEL Type', 'Key Value', 'Value', 'Value Revise'
            ];

            headers.forEach((header, index) => {
                const isLevelColumn = /^Level \d+$/i.test(header);
                // Case-insensitive check for standard columns
                const isStandardColumn = standardColumns.some(sc => sc.toLowerCase() === header.toLowerCase());

                if (!isStandardColumn && !isLevelColumn && header.length > 0 && index !== jsonKeyIndex) {
                    initialSelectedIndices.push(index);
                }
            });

            setSelectedIndices(initialSelectedIndices);
            setShowLanguageSelector(true);
            setIsProcessing(false);

        } catch (err: any) {
            setError(err.message);
            setIsProcessing(false);
        }
    };

    const finalizeProcessing = () => {
        if (!pendingRows || pendingKeyIndex === -1) return;

        setIsProcessing(true);
        setShowLanguageSelector(false);

        setTimeout(() => {
            try {
                const rows = pendingRows;
                const jsonKeyIndex = pendingKeyIndex;
                const headerRowIndex = pendingHeaderRowIndex;

                const headers = rows[headerRowIndex].map(h => String(h || '').trim());

                // Build language map from selection
                const languageIndices: { [lang: string]: number } = {};
                selectedIndices.forEach(index => {
                    const header = headers[index];
                    if (header) {
                        languageIndices[header] = index;
                    }
                });

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

                for (let i = headerRowIndex + 1; i < rows.length; i++) {
                    const fields = rows[i];

                    if (fields.length <= jsonKeyIndex || !fields[jsonKeyIndex]) {
                        continue;
                    }

                    const jsonKey = String(fields[jsonKeyIndex]).trim();
                    if (!jsonKey) continue;

                    Object.entries(languageIndices).forEach(([lang, index]) => {
                        if (index < fields.length) {
                            const cellValue = fields[index];
                            const value = cellValue !== undefined && cellValue !== null ? String(cellValue) : '';
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
                setIsProcessing(false);
            } catch (err: any) {
                setError(err.message);
                setIsProcessing(false);
            }
        }, 100);
    };

    const handleManualColumnSelect = (index: number) => {
        if (!rawImportRows) return;
        setShowColumnSelector(false);
        setIsProcessing(true);
        setTimeout(() => {
            processRows(rawImportRows, index, headerRowIndexState);
        }, 100);
    };

    // --- Export (Code -> CSV) Logic ---

    const processExportFiles = async (files: File[]) => {
        resetState();
        setIsProcessing(true);
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setUploadedFiles(files);

        try {
            const parsedFiles: { language: string, data: { [key: string]: string } }[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setProcessingFile(file.name);
                setProcessingProgress(Math.round((i / files.length) * 100));

                // Allow UI to render
                await new Promise(resolve => setTimeout(resolve, 50));

                const text = await file.text();
                let data: { [key: string]: string } = {};
                let language = file.name.split('.')[0]; // Default language from filename

                if (file.name.endsWith('.json')) {
                    try {
                        const json = JSON.parse(text);
                        data = flattenJSON(json);
                    } catch (e) {
                        throw new Error(`Failed to parse JSON file: ${file.name}`);
                    }
                } else if (file.name.endsWith('.xml')) {
                    // For Android, try to deduce language from parent folder if possible, currently simplistic
                    if (file.name === 'strings.xml') {
                        // If generic name, use 'android' or prompt? For now, append index or generic
                        language = `android_${parsedFiles.length + 1}`;
                    }
                    data = parseAndroidXML(text);
                } else if (file.name.endsWith('.strings')) {
                    if (file.name === 'Localizable.strings') {
                        language = `ios_${parsedFiles.length + 1}`;
                    }
                    data = parseIOSStrings(text);
                } else {
                    continue; // Skip unsupported
                }

                parsedFiles.push({ language, data });
            }

            setProcessingProgress(100);
            await new Promise(resolve => setTimeout(resolve, 200)); // Show 100% briefly

            if (parsedFiles.length === 0) {
                throw new Error(t('csvToJson.csvEmpty')); // Reuse generic empty error or new one
            }

            // Merge keys
            const allKeys = new Set<string>();
            parsedFiles.forEach(f => Object.keys(f.data).forEach(k => allKeys.add(k)));
            const sortedKeys = Array.from(allKeys).sort();
            const languages = parsedFiles.map(f => f.language);

            // Calculate max depth for Level columns
            const maxDepth = Math.max(...sortedKeys.map(k => k.split('.').length));
            const levelHeaders = Array.from({ length: maxDepth }, (_, i) => `Level ${i + 1}`);

            // Generate Data Arrays
            const headerRow = ['JSON KEY', ...levelHeaders, ...languages];
            const dataRows = sortedKeys.map(key => {
                const keyParts = key.split('.');
                const levelColumns = Array.from({ length: maxDepth }, (_, i) => keyParts[i] || '');

                const row = [key, ...levelColumns];
                parsedFiles.forEach(f => {
                    row.push(f.data[key] || '');
                });
                return row;
            });

            // Store for Excel export
            setExportData([headerRow, ...dataRows]);

            // Generate CSV string
            let csvContent = `JSON KEY,${levelHeaders.join(',')},${languages.join(',')}\n`;
            sortedKeys.forEach(key => {
                const keyParts = key.split('.');
                const levelColumns = Array.from({ length: maxDepth }, (_, i) => keyParts[i] || '');

                const row = [key, ...levelColumns];
                parsedFiles.forEach(f => {
                    let value = f.data[key] || '';
                    // Escape CSV quotes
                    if (value.includes('"') || value.includes(',') || value.includes('\n')) {
                        value = `"${value.replace(/"/g, '""')}"`;
                    }
                    row.push(value);
                });
                csvContent += row.join(',') + '\n';
            });

            setGeneratedCsv(csvContent);
            setSuccess(`Processed ${files.length} files. Found ${sortedKeys.length} unique keys.`);
            setIsProcessing(false);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to process files');
            setIsProcessing(false);
        }
    };

    const handleDownloadAll = async () => {
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

    const handleDownloadCsv = () => {
        if (!generatedCsv) return;
        const blob = new Blob([generatedCsv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'translations.csv');
    };

    const handleDownloadExcel = () => {
        if (!exportData) return;

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(exportData);

        // Auto-width columns
        const colWidths = exportData[0].map(() => {
            // Basic width estimation
            return { wch: 20 };
        });
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, "Translations");
        XLSX.writeFile(wb, "translations.xlsx");
    };

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
        <div className="w-full min-h-full flex flex-col space-y-6 p-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('csvToJson.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('csvToJson.description')}
                </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex justify-center mb-6">
                <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 inline-flex flex-shrink-0">
                    <button
                        onClick={() => handleModeChange('import')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'import'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        <Upload size={16} />
                        {t('csvToJson.importMode')}
                    </button>
                    <button
                        onClick={() => handleModeChange('export')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'export'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        <ArrowRightLeft size={16} />
                        {t('csvToJson.exportMode')}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden min-h-[500px]">
                {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 z-10 flex flex-col items-center justify-center backdrop-blur-sm transition-all animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-full shadow-lg">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium animate-pulse">{t('csvToJson.processing')}</p>
                        {processingFile && (
                            <div className="mt-4 w-64 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span className="truncate max-w-[150px] font-medium">{processingFile}</span>
                                    <span className="font-mono">{processingProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${processingProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Column Selection Modal */}
                {showColumnSelector && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 z-20 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
                        <div className="w-full max-w-lg space-y-4 text-center my-auto">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('csvToJson.selectKey')}</h3>
                                <button onClick={() => setShowColumnSelector(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t('csvToJson.selectKeyDesc')}
                            </p>
                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2">
                                {columnsForSelection.map((col, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleManualColumnSelect(index)}
                                        className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800 font-medium break-all"
                                    >
                                        {col || `Column ${index + 1}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Sheet Selection Modal */}
                {showSheetSelector && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 z-20 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
                        <div className="w-full max-w-lg space-y-4 text-center my-auto">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('csvToJson.selectSheet')}</h3>
                                <button onClick={() => setShowSheetSelector(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t('csvToJson.selectSheetDesc')}
                            </p>
                            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto p-2">
                                {availableSheets.map((sheet, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSheetSelect(sheet)}
                                        className="px-4 py-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors border border-green-200 dark:border-green-800 font-medium flex items-center justify-center gap-2"
                                    >
                                        <Table size={18} />
                                        {sheet}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Language Selection Modal */}
                {showLanguageSelector && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 z-20 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
                        <div className="w-full max-w-lg space-y-4 text-center my-auto flex flex-col h-full max-h-[500px]">
                            <div className="flex justify-between items-center mb-2 flex-shrink-0">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('csvToJson.selectLanguages')}</h3>
                                <button onClick={() => setShowLanguageSelector(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 flex-shrink-0">
                                {t('csvToJson.selectLanguagesDesc')}
                            </p>
                            <div className="grid grid-cols-2 gap-3 overflow-y-auto p-2 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                {detectedHeaders.map((header, index) => {
                                    if (index === pendingKeyIndex) return null; // Don't allow selecting the key
                                    if (!header) return null;

                                    const isSelected = selectedIndices.includes(index);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedIndices(prev =>
                                                    isSelected
                                                        ? prev.filter(i => i !== index)
                                                        : [...prev, index]
                                                );
                                            }}
                                            className={`px-3 py-2 text-left rounded-lg transition-colors border flex items-center gap-3 ${isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                                                }`}>
                                                {isSelected && <CheckCircle size={12} className="text-white" />}
                                            </div>
                                            <span className="truncate">{header}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex-shrink-0 pt-4">
                                <button
                                    onClick={finalizeProcessing}
                                    disabled={selectedIndices.length === 0}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle size={20} />
                                    {t('csvToJson.processSelected', { count: selectedIndices.length })}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'import' ? (
                    <DropZone
                        onFilesDropped={(files) => {
                            if (files.length > 0) processImportFile(files[0]);
                        }}
                        accept=".csv,text/csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        validator={(file) => file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')}
                        dragDropText={t('csvToJson.dragDrop')}
                        supportedText="Supports .csv, .xlsx, .xls"
                    />
                ) : (
                    <DropZone
                        onFilesDropped={processExportFiles}
                        accept=".json,.xml,.strings"
                        validator={(file) => file.name.endsWith('.json') || file.name.endsWith('.xml') || file.name.endsWith('.strings')}
                        dragDropText={t('csvToJson.dragDropExport')}
                        supportedText={t('csvToJson.supportsExport')}
                    />
                )}

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
                        {mode === 'import' && detectedLanguages.length > 0 && (
                            <div className="ml-7 text-sm">
                                <span className="font-semibold">{t('csvToJson.detectedLanguages')}</span> {detectedLanguages.join(', ')}
                            </div>
                        )}
                        {mode === 'export' && uploadedFiles.length > 0 && (
                            <div className="ml-7 text-sm">
                                <span className="font-semibold">{t('csvToJson.processedFiles')}</span> {uploadedFiles.map(f => f.name).join(', ')}
                            </div>
                        )}
                    </div>
                )}

                {/* Import Mode Download */}
                {mode === 'import' && generatedFiles && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleDownloadAll}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                        >
                            <Download size={20} />
                            {t('csvToJson.downloadAll')}
                        </button>
                    </div>
                )}

                {/* Export Mode Table Preview */}
                {mode === 'export' && exportData && exportData.length > 0 && (
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                        {isSorting && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-20 flex items-center justify-center backdrop-blur-sm">
                                <div className="bg-white dark:bg-gray-900 p-3 rounded-full shadow-lg flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('common.sorting', 'Sorting...')}</span>
                                </div>
                            </div>
                        )}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Table size={18} className="text-blue-500" />
                                    {t('csvToJson.previewData', 'Data Preview')}
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder={t('csvToJson.searchPlaceholder', 'Search...')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-48 transition-all focus:w-64"
                                    />
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t('csvToJson.totalRows', 'Total Rows')}: {exportData.length - 1}
                            </span>
                        </div>
                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                                    <tr>
                                        {exportData[0].map((header: string, index: number) => (
                                            <th
                                                key={index}
                                                className="px-6 py-3 whitespace-nowrap font-semibold border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors select-none group"
                                                onClick={() => {
                                                    setIsSorting(true);
                                                    // Use setTimeout to allow UI to render loading state before heavy sort
                                                    setTimeout(() => {
                                                        let direction: 'asc' | 'desc' = 'asc';
                                                        if (sortConfig.key === index && sortConfig.direction === 'asc') {
                                                            direction = 'desc';
                                                        }
                                                        setSortConfig({ key: index, direction });
                                                        setIsSorting(false);
                                                    }, 10);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {header}
                                                    <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                                                        {sortConfig.key === index ? (
                                                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                                        ) : (
                                                            <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50" />
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {exportData.slice(1)
                                        .filter(row => {
                                            if (!debouncedSearchQuery) return true;
                                            const query = debouncedSearchQuery.toLowerCase();
                                            return row.some((cell: any) => String(cell).toLowerCase().includes(query));
                                        })
                                        .sort((a, b) => {
                                            if (sortConfig.key === null) return 0;
                                            const aValue = String(a[sortConfig.key] || '').toLowerCase();
                                            const bValue = String(b[sortConfig.key] || '').toLowerCase();
                                            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                                            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                                            return 0;
                                        })
                                        .map((row, rowIndex) => (
                                            <tr
                                                key={rowIndex}
                                                onClick={() => {
                                                    setSelectedRow(row);
                                                    setShowDetailModal(true);
                                                }}
                                                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                            >
                                                {row.map((cell: any, cellIndex: number) => (
                                                    <td key={cellIndex} className="px-6 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300 border-r border-gray-100 dark:border-gray-700 last:border-r-0 max-w-[300px] truncate relative" title={String(cell)}>
                                                        {String(cell)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Detail Modal */}
                {showDetailModal && selectedRow && exportData && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 z-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[80vh]">
                            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Eye size={20} className="text-blue-500" />
                                    {t('csvToJson.rowDetails', 'Row Details')}
                                </h3>
                                <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-6 space-y-4">
                                {exportData[0].map((header: string, index: number) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{header}</span>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap font-mono">
                                            {String(selectedRow[index])}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl flex justify-end">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {t('common.close', 'Close')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Export Mode Download */}
                {mode === 'export' && generatedCsv && (
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={handleDownloadCsv}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm font-medium"
                        >
                            <Download size={20} />
                            {t('csvToJson.downloadCsv')}
                        </button>
                        <button
                            onClick={handleDownloadExcel}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                        >
                            <FileSpreadsheet size={20} />
                            {t('csvToJson.downloadExcel')}
                        </button>
                    </div>
                )}
            </div>

            {/* Import Mode Preview (Existing) */}
            {mode === 'import' && generatedFiles && detectedLanguages.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex gap-1">
                            <button
                                onClick={() => { setActiveFormat('json'); setViewMode('text'); }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeFormat === 'json'
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <img src={jsonIcon} alt="JSON" className="w-5 h-5" />
                                {t('csvToJson.formats.json')}
                            </button>
                            <button
                                onClick={() => { setActiveFormat('android'); setViewMode('text'); }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeFormat === 'android'
                                    ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <img src={androidIcon} alt="Android" className="w-5 h-5" />
                                {t('csvToJson.formats.android')}
                            </button>
                            <button
                                onClick={() => { setActiveFormat('ios'); setViewMode('text'); }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeFormat === 'ios'
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                <img src={iosIcon} alt="iOS" className="w-5 h-5" />
                                {t('csvToJson.formats.ios')}
                            </button>
                        </div>

                        {/* Mindmap Toggle - Only for JSON */}
                        {activeFormat === 'json' && (
                            <div className="flex bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg">
                                <button
                                    onClick={() => setViewMode('text')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'text'
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    Text
                                </button>
                                <button
                                    onClick={() => setViewMode('mindmap')}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'mindmap'
                                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    <Network size={14} />
                                    Mindmap
                                </button>
                            </div>
                        )}
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

                    <div className="p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                            {activeFormat === 'json' && <img src={jsonIcon} alt="JSON" className="w-6 h-6" />}
                            {activeFormat === 'android' && <img src={androidIcon} alt="Android" className="w-6 h-6" />}
                            {activeFormat === 'ios' && <img src={iosIcon} alt="iOS" className="w-6 h-6" />}
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                                {activePreviewTab}
                                {activeFormat === 'json' ? '.json' : activeFormat === 'android' ? '.xml' : '.strings'}
                            </h3>
                        </div>

                        <div className="flex-1 overflow-hidden relative rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            {viewMode === 'text' ? (
                                <pre className="absolute inset-0 overflow-auto p-4 text-xs text-gray-600 dark:text-gray-300 font-mono">
                                    {getPreviewContent()}
                                </pre>
                            ) : (
                                <MindmapViewer data={generatedFiles.json[activePreviewTab]} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helpers must be defined outside if we want to avoid re-creation,
// OR inside the component if we want cleaner single file stricture.
// Since we are replacing the file content, it's safer to include them.

const flattenJSON = (data: any, prefix = ''): { [key: string]: string } => {
    let result: { [key: string]: string } = {};
    for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
            const flatObject = flattenJSON(data[key], prefix ? `${prefix}.${key}` : key);
            result = { ...result, ...flatObject };
        } else {
            result[prefix ? `${prefix}.${key}` : key] = String(data[key]);
        }
    }
    return result;
};

const parseAndroidXML = (xmlText: string): { [key: string]: string } => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const strings = xmlDoc.getElementsByTagName('string');
    const result: { [key: string]: string } = {};

    for (let i = 0; i < strings.length; i++) {
        const name = strings[i].getAttribute('name');
        if (name) {
            result[name] = strings[i].textContent || '';
        }
    }
    return result;
};

const parseIOSStrings = (text: string): { [key: string]: string } => {
    const result: { [key: string]: string } = {};
    const lines = text.split('\n');
    const regex = /"(.+)"\s*=\s*"(.+)";/;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            result[match[1]] = match[2];
        }
    }
    return result;
};
