
import { saveAs } from 'file-saver';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { Upload, FileText, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Layers, Eye, EyeOff, Download, X, Code, List, FileSpreadsheet, Search, Copy, Check, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import * as XLSX from 'xlsx';
import { validateContent, ValidationError } from '../utils/validationUtils';
import { DonutChart } from './DonutChart';

interface FileValidationResult {
    path: string;
    isValid: boolean;
    error?: string;
    details?: ValidationError[];
    type: 'vue' | 'ts' | 'js' | 'tsx' | 'android-xml' | 'kotlin' | 'java' | 'swift' | 'ios-xib' | 'objc' | 'html' | 'other';
    content?: string;
}

export function ValidateTranslation() {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<FileValidationResult[]>([]);
    const [ignoredPaths, setIgnoredPaths] = useState<Set<string>>(new Set());
    const [ignoredExtensions, setIgnoredExtensions] = useState<string[]>([]);
    const [extensionInput, setExtensionInput] = useState('');
    const [hideIgnored, setHideIgnored] = useState(false);
    const [showInvalidOnly, setShowInvalidOnly] = useState(true);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [selectedResult, setSelectedResult] = useState<FileValidationResult | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'code'>('list');
    const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [processingFile, setProcessingFile] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedText, setCopiedText] = useState<string | null>(null);

    // Settings for source code fix
    const [translationPattern, setTranslationPattern] = useState("t('{key}')");
    const [androidTranslationPattern, setAndroidTranslationPattern] = useState("@string/{key}");
    const [androidCodePattern, setAndroidCodePattern] = useState("getString(R.string.{key})");
    const [iosTranslationPattern, setIosTranslationPattern] = useState('NSLocalizedString("{key}", comment: "")');
    const [showFixSettings, setShowFixSettings] = useState(false);

    // ... existing code ...



    // TEMP: Mock data for scroll testing
    // useEffect(() => {
    //     const mockFiles = Array.from({ length: 50 }, (_, i) => ({
    //         path: `src/mock/file_${i}.ts`,
    //         isValid: i % 2 === 0,
    //         type: 'ts' as const,
    //         details: i % 2 !== 0 ? [{ line: 10, text: 'Hello', message: 'Untranslated' }] : undefined
    //     }));
    //     setResults(mockFiles);
    //     setIgnoredPaths(new Set());
    // }, []);

    // Ref for the code view container to scroll
    const codeViewRef = useRef<HTMLDivElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const toggleIgnore = useCallback((path: string) => {
        setIgnoredPaths(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    }, []);

    const handleUploadNew = useCallback(() => {
        setResults([]);
        setIgnoredPaths(new Set());
        setHideIgnored(false);
        setCurrentFile(null);
    }, []);

    const isFileIgnored = useCallback((path: string) => {
        if (ignoredPaths.has(path)) return true;
        const fileName = path.split('/').pop()?.toLowerCase() || '';
        return ignoredExtensions.some(ext => fileName.endsWith(ext));
    }, [ignoredPaths, ignoredExtensions]);

    const stats = useMemo(() => {
        const activeResults = results.filter(r => !isFileIgnored(r.path));
        const total = activeResults.length;
        const valid = activeResults.filter(r => r.isValid).length;
        const invalid = total - valid;
        return { total, valid, invalid };
    }, [results, isFileIgnored]);

    const displayedResults = useMemo(() => {
        let filtered = results;
        if (hideIgnored) {
            filtered = filtered.filter(r => !isFileIgnored(r.path));
        }
        if (showInvalidOnly) {
            filtered = filtered.filter(r => !r.isValid);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r => r.path.toLowerCase().includes(query));
        }
        return filtered;
    }, [results, isFileIgnored, hideIgnored, showInvalidOnly, searchQuery]);

    const processFile = useCallback(async (file: File, keepIgnored = false) => {
        setIsAnalyzing(true);
        setResults([]);
        if (!keepIgnored) {
            setIgnoredPaths(new Set());
        }
        setHideIgnored(false); // Reset hideIgnored on new upload
        setShowInvalidOnly(true); // Default to showing invalid only
        setCurrentFile(file);

        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            const validationResults: FileValidationResult[] = [];

            const entries = Object.entries(contents.files).filter(([relativePath, zipEntry]) => {
                const pathParts = relativePath.split('/');
                const fileName = pathParts[pathParts.length - 1];

                // Ignore directories, hidden files, and system folders
                if (zipEntry.dir) return false;

                // Check for user-ignored extensions
                if (ignoredExtensions.some(ext => fileName.toLowerCase().endsWith(ext))) {
                    return false;
                }

                if (relativePath.includes('__MACOSX') ||
                    relativePath.includes('node_modules') ||
                    relativePath.includes('.git') ||
                    relativePath.includes('/build/') ||
                    relativePath.startsWith('build/') ||
                    relativePath.includes('/Pods/') ||
                    relativePath.startsWith('Pods/') ||
                    relativePath.includes('/test/') ||
                    relativePath.startsWith('test/') ||
                    fileName.startsWith('.')) {
                    return false;
                }

                return true;
            });

            const totalFiles = entries.length;
            let processedCount = 0;

            for (const [relativePath, zipEntry] of entries) {
                processedCount++;
                const currentProgress = (processedCount / totalFiles) * 100;

                setProgress(currentProgress);
                setProcessingFile(relativePath);

                // Small delay to allow UI to update
                await new Promise(resolve => setTimeout(resolve, 1));

                const lowerPath = relativePath.toLowerCase();
                let type: FileValidationResult['type'] = 'other';

                if (lowerPath.endsWith('.vue')) type = 'vue';
                else if (lowerPath.endsWith('.ts')) type = 'ts';
                else if (lowerPath.endsWith('.js')) type = 'js';
                else if (lowerPath.endsWith('.tsx')) type = 'tsx';
                else if (lowerPath.endsWith('.xml')) type = 'android-xml';
                else if (lowerPath.endsWith('.kt')) type = 'kotlin';
                else if (lowerPath.endsWith('.java')) type = 'java';
                else if (lowerPath.endsWith('.swift')) type = 'swift';
                else if (lowerPath.endsWith('.xib') || lowerPath.endsWith('.storyboard')) type = 'ios-xib';
                else if (lowerPath.endsWith('.m') || lowerPath.endsWith('.h')) type = 'objc';
                else if (lowerPath.endsWith('.html') || lowerPath.endsWith('.htm')) type = 'html';

                if (type === 'other') continue;

                const content = await zipEntry.async('string');
                const validation = validateContent(content, type);

                validationResults.push({
                    path: relativePath,
                    isValid: validation.isValid,
                    details: validation.details,
                    type,
                    content // Store content for detailed view
                });
            }

            setResults(validationResults.sort((a, b) => (a.isValid === b.isValid ? 0 : a.isValid ? 1 : -1)));

        } catch (error) {
            console.error("Failed to unzip or analyze", error);
        } finally {
            setIsAnalyzing(false);
            setProgress(0);
            setProcessingFile('');
        }
    }, [ignoredExtensions]);

    const handleReAnalyze = useCallback(() => {
        if (currentFile) {
            processFile(currentFile, true);
        }
    }, [currentFile, processFile]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const zipFile = files.find(f => f.name.endsWith('.zip'));

        if (zipFile) {
            processFile(zipFile);
        }
    }, [processFile]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleExportCsv = useCallback(() => {
        // Generate CSV content
        const headers = [
            t('validation.fileName'),
            t('validation.type'),
            t('validation.status'),
            t('validation.ignored'),
            t('validation.line'),
            t('validation.untranslatedText'),
            t('validation.contextMessage')
        ];

        // Filter out ignored files regardless of UI state
        // Flatten the data so each error is a row
        const rows: string[] = [];

        displayedResults
            .filter(r => !isFileIgnored(r.path))
            .forEach(r => {
                const isIgnored = isFileIgnored(r.path); // Should always be false now, but harmless
                const status = r.isValid ? t('validation.translated') : t('validation.untranslated');
                const ignoredStr = isIgnored ? t('validation.statusLabel.ignored') : t('common.no');

                if (r.details && r.details.length > 0) {
                    r.details.forEach(detail => {
                        rows.push([
                            `"${r.path}"`,
                            `"${r.type}"`,
                            `"${status}"`,
                            `"${ignoredStr}"`,
                            `"${detail.line}"`,
                            `"${detail.text.replace(/"/g, '""')}"`,
                            `"${detail.message.replace(/"/g, '""')}"`
                        ].join(','));
                    });
                } else {
                    // For valid files or files with no details, add one row
                    rows.push([
                        `"${r.path}"`,
                        `"${r.type}"`,
                        `"${status}"`,
                        `"${ignoredStr}"`,
                        `""`, // No line
                        `""`, // No text
                        `""`  // No message
                    ].join(','));
                }
            });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'validation_report.csv');
    }, [displayedResults, isFileIgnored]);

    const handleExportExcel = useCallback(() => {
        const headers = [
            t('validation.filePath'),
            t('validation.fileName'),
            t('validation.type'),
            t('validation.status'),
            t('validation.ignored'),
            t('validation.line'),
            t('validation.untranslatedText'),
            t('validation.contextMessage')
        ];
        const rows: any[][] = [headers];

        displayedResults
            .filter(r => !isFileIgnored(r.path))
            .forEach(r => {
                const isIgnored = isFileIgnored(r.path);
                const status = r.isValid ? t('validation.translated') : t('validation.untranslated');
                const ignoredStr = isIgnored ? t('validation.statusLabel.ignored') : t('common.no');
                const fileName = r.path.split('/').pop() || r.path;

                if (r.details && r.details.length > 0) {
                    r.details.forEach(detail => {
                        rows.push([
                            r.path,
                            fileName,
                            r.type,
                            status,
                            ignoredStr,
                            detail.line,
                            detail.text,
                            detail.message
                        ]);
                    });
                } else {
                    rows.push([
                        r.path,
                        fileName,
                        r.type,
                        status,
                        ignoredStr,
                        '',
                        '',
                        ''
                    ]);
                }
            });

        const ws = XLSX.utils.aoa_to_sheet(rows);

        // Auto-width for columns
        const wscols = headers.map((_, i) => {
            // Calculate max width for this column based on data
            const maxLen = rows.reduce((max, row) => {
                const cell = row[i] ? String(row[i]) : "";
                return Math.max(max, cell.length);
            }, 10); // Minimum width 10
            return { wch: Math.min(maxLen, 50) }; // Cap at 50 chars
        });
        ws['!cols'] = wscols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Validation Report");
        XLSX.writeFile(wb, "validation_report.xlsx");
    }, [displayedResults, ignoredPaths]);

    // Handle initial open of modal
    const openModal = (file: FileValidationResult) => {
        setSelectedResult(file);
        setViewMode(file.isValid ? 'code' : 'list'); // Default to list if invalid, code if valid
        setHighlightedLine(null);
    };

    // Scroll to highlighted line when view mode is code and highlightedLine is set
    useEffect(() => {
        if (viewMode === 'code' && highlightedLine && codeViewRef.current) {
            const lineElement = codeViewRef.current.querySelector(`[data-line="${highlightedLine}"]`);
            if (lineElement) {
                lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [viewMode, highlightedLine]);

    const handleJumpToCode = (line: number) => {
        setViewMode('code');
        setHighlightedLine(line);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
    };

    // Helper to generate a CONSTANT_CASE key from text
    // Smart key generation: Use first 4 words. If collision, add more words. If no more words, add suffix.
    const generateSmartKey = (text: string, existingKeys: Set<string>): string => {
        const cleanText = text.replace(/['"]/g, '').replace(/[^\w\s]/g, '');
        const words = cleanText.split(/\s+/).filter(w => w.length > 0);

        if (words.length === 0) {
            // Fallback for purely symbolic strings or empty ones
            let i = 1;
            while (existingKeys.has(`UNKNOWN_${i}`)) i++;
            return `UNKNOWN_${i}`;
        }

        // Start with max 4 words, or limit to available words if fewer
        let currentWordCount = Math.min(4, words.length);
        let key = '';

        while (true) {
            const slice = words.slice(0, currentWordCount);
            key = toConstantCase(slice.join(' ')); // Ensure reuse of clean key formatting

            // If key is unique, return it
            if (!existingKeys.has(key)) {
                return key;
            }

            // If collision, try to add another word if available
            if (currentWordCount < words.length) {
                currentWordCount++;
            } else {
                // No more words to add, append numeric suffix
                let i = 1;
                while (existingKeys.has(`${key}_${i}`)) i++;
                return `${key}_${i}`;
            }
        }
    };

    const toConstantCase = (str: string): string => {
        return str
            .replace(/([a-z])([A-Z])/g, '$1_$2') // camelCase to snake_case
            .replace(/[\s\W-]+/g, '_') // replace spaces and non-word chars with underscore
            .toUpperCase()
            .replace(/^_+|_+$/g, ''); // trim leading/trailing underscores
    };

    // Helper to extract screen name from path
    const getScreenName = (path: string): string => {
        const fileName = path.split('/').pop() || path;
        const name = fileName.split('.')[0]; // Remove extension
        return toConstantCase(name);
    };

    // Helper to determine type from message and context
    const getTypeFromDetail = (detail: ValidationError): string => {
        // 1. Check Context first (Tag name or Attribute name)
        if (detail.context) {
            const ctx = detail.context.toLowerCase();

            // Buttons
            if (/button|touchable|pressable/.test(ctx)) return 'BUTTON';

            // Titles / Headers
            if (/h[1-6]|header|title|heading/.test(ctx) && !/subtitle|description/.test(ctx)) return 'TITLE';

            // Labels / Placeholders
            if (/label|placeholder|hint|accessibility|testid/.test(ctx)) return 'LABEL';

            // Specific Attributes
            if (ctx === 'text' || ctx === 'value') return 'TEXT';
            if (ctx === 'title' || ctx === 'headerTitle') return 'TITLE';
        }

        // 2. Fallback to Message (Legacy logic)
        const message = detail.message;
        const match = message.match(/attribute \[(.*?)\]/);
        if (match && match[1]) {
            // Map attribute names to types
            const attr = match[1].toLowerCase();
            if (attr === 'placeholder' || attr === 'label' || attr === 'hint') return 'LABEL';
            if (attr === 'title') return 'TITLE';
            return 'TEXT'; // Default attribute text
        }

        if (message.toLowerCase().includes('button')) return 'BUTTON'; // If message says "Button text"
        if (message.toLowerCase().includes('title')) return 'TITLE';
        if (message.includes('attribute')) return 'LABEL'; // Generic attribute fallback

        return 'TEXT';
    };

    // Data structure: Screen -> Type -> Key -> Value
    type TranslationData = Record<string, Record<string, Record<string, string>>>;

    // Collect all unique untranslated strings structured by Screen and Type
    const collectInvalidTranslations = useCallback((): TranslationData => {
        const data: TranslationData = {};
        // Keep track of used keys per screen.type to avoid collisions
        const usedKeysPerScope: Record<string, Set<string>> = {};

        results.filter(r => !isFileIgnored(r.path) && !r.isValid)
            .forEach(r => {
                const screenName = getScreenName(r.path);

                r.details?.forEach(d => {
                    // Filter out non-text errors
                    if (!d.text || !d.text.trim()) return;

                    const type = getTypeFromDetail(d);
                    const scopeId = `${screenName}.${type}`;

                    if (!data[screenName]) data[screenName] = {};
                    if (!data[screenName][type]) data[screenName][type] = {};
                    if (!usedKeysPerScope[scopeId]) usedKeysPerScope[scopeId] = new Set();

                    // Check if this text already has a key in this scope (deduplication by value)
                    const existingEntry = Object.entries(data[screenName][type]).find(([_, v]) => v === d.text);
                    let key = existingEntry ? existingEntry[0] : '';

                    if (!key) {
                        key = generateSmartKey(d.text, usedKeysPerScope[scopeId]);
                        usedKeysPerScope[scopeId].add(key);
                        data[screenName][type][key] = d.text;
                    }
                });
            });
        return data;
    }, [results, isFileIgnored]);

    const handleExportJSON = useCallback(() => {
        const data = collectInvalidTranslations();
        // The data is already in the requested nested format: { SCREEN: { TYPE: { KEY: VALUE } } }
        const content = JSON.stringify(data, null, 2);
        const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
        saveAs(blob, 'missing_translations.json');
    }, [collectInvalidTranslations]);

    const handleExportAndroid = useCallback(() => {
        const data = collectInvalidTranslations();
        let content = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';

        Object.entries(data).forEach(([screen, types]) => {
            Object.entries(types).forEach(([type, keys]) => {
                Object.entries(keys).forEach(([key, value]) => {
                    const fullKey = `${screen}.${type}.${key}`;
                    // Escape special characters for XML
                    const escapedText = value
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, "\\'");
                    content += `    <string name="${fullKey}">${escapedText}</string>\n`;
                });
            });
        });
        content += '</resources>';

        const blob = new Blob([content], { type: 'text/xml;charset=utf-8' });
        saveAs(blob, 'strings.xml');
    }, [collectInvalidTranslations]);

    const handleExportIOS = useCallback(() => {
        const data = collectInvalidTranslations();
        let content = '';

        Object.entries(data).forEach(([screen, types]) => {
            Object.entries(types).forEach(([type, keys]) => {
                Object.entries(keys).forEach(([key, value]) => {
                    const fullKey = `${screen}.${type}.${key}`;
                    // Escape double quotes
                    const escapedText = value.replace(/"/g, '\\"');
                    content += `"${fullKey}" = "${escapedText}";\n`;
                });
            });
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'Localizable.strings');
    }, [collectInvalidTranslations]);

    // IMPORTANT: applyTranslationsToFile must use the SAME key generation logic
    // We should pass the generated data map to it, OR (simpler) generate the map in handleDownloadFixedSources and pass it down.

    // UPDATED applyTranslationsToFile
    const applyTranslationsToFile = useCallback((content: string, details: ValidationError[], screenName: string, type: string, translationData: TranslationData) => {
        let modifiedContent = content;

        // Sort details by text length descending to avoid partial replacements
        const sortedDetails = [...details].sort((a, b) => b.text.length - a.text.length);

        sortedDetails.forEach(d => {
            if (!d.text || !d.text.trim()) return;

            const keyType = getTypeFromDetail(d);

            // Find the key for this text in translationData
            // We assume translationData is already populated (which it is, see handleDownloadFixedSources)
            let keyName = '';
            if (translationData[screenName] && translationData[screenName][keyType]) {
                const entry = Object.entries(translationData[screenName][keyType]).find(([_, v]) => v === d.text);
                if (entry) keyName = entry[0];
            }

            // Fallback if not found (should not happen if data is sync)
            if (!keyName) keyName = toConstantCase(d.text);

            const fullKey = `${screenName}.${keyType}.${keyName}`;

            // Escape special regex characters in the text to match
            const escapedText = d.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            if (type === 'tsx' || type === 'ts' || type === 'js' || type === 'vue') {
                // Generate replacement based on user pattern (default: t('{key}'))
                const replacementExpr = translationPattern.replace('{key}', fullKey);

                // 1. Replace JSX attributes: title="Text" -> title={t('KEY')}
                modifiedContent = modifiedContent.replace(
                    new RegExp(`([a-zA-Z0-9_-]+)=["']${escapedText}["']`, 'g'),
                    `$1={${replacementExpr}}`
                );

                // 2. Replace JSX text content: >Text< -> >{t('KEY')}<
                modifiedContent = modifiedContent.replace(
                    new RegExp(`>${escapedText}<`, 'g'),
                    `>{${replacementExpr}}<`
                );

                // 3. Replace text inside curly braces: {"Text"} -> {t('KEY')}
                modifiedContent = modifiedContent.replace(
                    new RegExp(`{["']${escapedText}["']}`, 'g'),
                    `{${replacementExpr}}`
                );
            } else if (type === 'android-xml') {
                // Generate replacement based on user pattern (default: @string/{key})
                // For Android XML, the pattern usually replaces just the value inside quotes
                // But users typically just want to change the reference format if needed

                // If the user pattern is just the reference (e.g. @string/{key}), we use it inside quotes

                // logic: replace "Text" with "PATTERN"

                const replacement = androidTranslationPattern.replace('{key}', fullKey);

                // Replace android:text="Text" -> android:text="PATTERN"
                modifiedContent = modifiedContent.replace(
                    new RegExp(`([a-zA-Z0-9_:]+)=["']${escapedText}["']`, 'g'),
                    `$1="${replacement}"`
                );
                // Replace >Text< -> >PATTERN<
                modifiedContent = modifiedContent.replace(
                    new RegExp(`>${escapedText}<`, 'g'),
                    `>${replacement}<`
                );
            } else if (type === 'kotlin' || type === 'java') {
                // Generate replacement based on user pattern (default: getString(R.string.{key}))
                const replacement = androidCodePattern.replace('{key}', fullKey);

                // Replace "Text" -> PATTERN
                modifiedContent = modifiedContent.replace(
                    new RegExp(`"${escapedText}"`, 'g'),
                    replacement
                );
            } else if (type === 'swift' || type === 'objc') {
                // Generate replacement based on user pattern (default: NSLocalizedString("{key}", comment: ""))
                // This replaces the WHOLE string literal including quotes

                const replacement = iosTranslationPattern.replace('{key}', fullKey);

                // Replace "Text" -> PATTERN
                modifiedContent = modifiedContent.replace(
                    new RegExp(`"${escapedText}"`, 'g'),
                    replacement
                );
            } else if (type === 'ios-xib') {
                // For XIBs, it's usually just the key ID or value
                // We keep the logic simple here: title="Text" -> title="KEY"
                // XIBs are complex and usually use ObjectID specific strings, but for now we follow the existing pattern
                modifiedContent = modifiedContent.replace(
                    new RegExp(`([a-zA-Z0-9_-]+)=["']${escapedText}["']`, 'g'),
                    `$1="${fullKey}"`
                );
            }
        });

        return modifiedContent;
    }, [translationPattern, androidTranslationPattern, androidCodePattern, iosTranslationPattern]);

    const handleDownloadFixedSources = useCallback(async () => {
        setIsAnalyzing(true);
        setProcessingFile("Initializing...");

        // Allow UI to update
        await new Promise(resolve => setTimeout(resolve, 100));

        const zip = new JSZip();
        let hasFixedFiles = false;

        // 1. Generate Global Translation Data (to ensure keys are consistent)
        const translationData = collectInvalidTranslations();

        // Filter files to process
        const filesToProcess = results.filter(r => !r.isValid && !isFileIgnored(r.path) && r.details && r.content);
        const totalFiles = filesToProcess.length;
        const CHUNK_SIZE = 10;

        for (let i = 0; i < totalFiles; i += CHUNK_SIZE) {
            const chunk = filesToProcess.slice(i, i + CHUNK_SIZE);

            // Process chunk
            chunk.forEach(r => {
                const screenName = getScreenName(r.path);
                const fixedContent = applyTranslationsToFile(r.content!, r.details!, screenName, r.type as string, translationData);

                if (fixedContent !== r.content) {
                    zip.file(r.path, fixedContent);
                    hasFixedFiles = true;
                }
            });

            // Update progress
            const processedCount = Math.min(i + CHUNK_SIZE, totalFiles);
            const progressPercent = Math.round((processedCount / totalFiles) * 100);
            setProgress(progressPercent);
            setProcessingFile(`Processing ${processedCount}/${totalFiles} files...`);

            // Yield to main thread
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (hasFixedFiles) {
            setProcessingFile("Compressing...");
            // Yield again before heavy compression
            await new Promise(resolve => setTimeout(resolve, 50));

            const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
                setProcessingFile(`Compressing ${metadata.percent.toFixed(0)}%...`);
            });
            saveAs(content, 'fixed_sources.zip');
        } else {
            alert('No files were modified.');
        }

        setIsAnalyzing(false);
        setProcessingFile("");
        setProgress(0);
    }, [results, isFileIgnored, applyTranslationsToFile, collectInvalidTranslations]);

    return (
        <div className="h-full flex flex-col p-8 max-w-[1400px] mx-auto w-full relative font-khmer">
            <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white flex items-center gap-3">
                <Layers className="text-blue-600" size={32} />
                {t('app.validateTranslation', 'Validate Translation')}
            </h1>

            {results.length === 0 && (
                <div
                    className={clsx(
                        "relative border-2 border-dashed rounded-xl p-12 transition-all text-center mb-8 bg-white dark:bg-gray-800 flex flex-col items-center justify-center min-h-[400px]",
                        isDragging && !isAnalyzing
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700",
                        !isAnalyzing && "cursor-pointer hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    )}
                    onDragEnter={!isAnalyzing ? handleDrag : undefined}
                    onDragOver={!isAnalyzing ? handleDrag : undefined}
                    onDragLeave={!isAnalyzing ? handleDrag : undefined}
                    onDrop={!isAnalyzing ? handleDrop : undefined}
                    onClick={() => !isAnalyzing && document.getElementById('file-upload')?.click()}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".zip"
                        onChange={handleFileSelect}
                        disabled={isAnalyzing}
                    />

                    {isAnalyzing ? (
                        <div className="flex flex-col items-center animate-in fade-in duration-500">
                            <div className="relative w-32 h-32 mb-8">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        className="text-gray-100 dark:text-gray-700 stroke-current"
                                        strokeWidth="8"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                    ></circle>
                                    <circle
                                        className="text-blue-500 progress-ring__circle stroke-current transition-all duration-300 ease-out"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                    ></circle>
                                </svg>
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                    <span className="text-3xl font-bold text-slate-700 dark:text-white">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                                {t('validation.analyzing', 'Analyzing codebase...')}
                            </h3>

                            <div className="w-full max-w-2xl text-center mt-2 px-4">
                                <p
                                    className="text-xs font-mono text-slate-500 dark:text-gray-400 truncate animate-pulse leading-relaxed"
                                    style={{ direction: 'rtl' }}
                                    title={processingFile}
                                >
                                    {processingFile} &lrm;
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Upload size={40} />
                            </div>
                            <div>
                                <p className="text-xl font-semibold text-slate-700 dark:text-gray-200">
                                    {t('validation.dragDrop')}
                                </p>
                                <p className="text-base text-slate-500 dark:text-gray-400 mt-2">
                                    {t('validation.browse')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {results.length > 0 && (
                <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
                    {/* Stats & Actions Header */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <DonutChart
                            items={[
                                { id: 'valid', value: stats.valid, color: 'text-green-500', bg: 'bg-green-500', icon: CheckCircle, label: t('validation.valid') },
                                { id: 'invalid', value: stats.invalid, color: 'text-red-500', bg: 'bg-red-500', icon: AlertTriangle, label: t('validation.invalid') },
                            ]}
                            total={stats.total}
                            centerSubLabel={t('validation.total')}
                        />

                        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full lg:w-auto">
                            <div className="relative group grow lg:grow-0">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t('validation.searchFiles', 'Search files...')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-gray-900 border-none rounded-lg w-full lg:w-56 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 text-slate-700 dark:text-gray-200"
                                />
                            </div>

                            <div
                                className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-gray-900 border border-transparent focus-within:ring-2 focus-within:ring-blue-500/50 rounded-lg w-full sm:max-w-xs transition-all cursor-text min-h-[36px]"
                                onClick={() => document.getElementById('extension-input')?.focus()}
                            >
                                <EyeOff size={14} className="text-gray-400 mr-1" />
                                {ignoredExtensions.map((ext, i) => (
                                    <span key={i} className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md">
                                        {ext}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIgnoredExtensions(prev => prev.filter((_, idx) => idx !== i));
                                            }}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    id="extension-input"
                                    type="text"
                                    placeholder={ignoredExtensions.length === 0 ? "Ignore ext (.spec.ts)" : ""}
                                    value={extensionInput}
                                    onChange={(e) => setExtensionInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ',') {
                                            e.preventDefault();
                                            const val = extensionInput.trim().toLowerCase();
                                            if (val && !ignoredExtensions.includes(val)) {
                                                setIgnoredExtensions([...ignoredExtensions, val]);
                                                setExtensionInput('');
                                            }
                                        } else if (e.key === 'Backspace' && !extensionInput && ignoredExtensions.length > 0) {
                                            setIgnoredExtensions(ignoredExtensions.slice(0, -1));
                                        }
                                    }}
                                    className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-gray-200 placeholder:text-slate-400 min-w-[80px] flex-1 p-0"
                                />
                            </div>

                            <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                            <label className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-gray-300 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                <input
                                    type="checkbox"
                                    checked={showInvalidOnly}
                                    onChange={(e) => setShowInvalidOnly(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                {t('validation.showInvalidOnly')}
                            </label>

                            <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                            <label className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-gray-300 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                <input
                                    type="checkbox"
                                    checked={hideIgnored}
                                    onChange={(e) => setHideIgnored(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                {t('validation.hideIgnored')}
                            </label>

                            <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExportExcel}
                                    className="p-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-all active:scale-95"
                                    title={t('validation.exportExcel')}
                                >
                                    <FileSpreadsheet size={18} />
                                </button>

                                <button
                                    onClick={handleExportCsv}
                                    className="p-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all active:scale-95"
                                    title={t('validation.exportCsv')}
                                >
                                    <Download size={18} />
                                </button>

                                <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                                <button
                                    onClick={handleExportJSON}
                                    className="px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all active:scale-95 whitespace-nowrap"
                                    title="Export Missing as JSON"
                                >
                                    JSON
                                </button>
                                <button
                                    onClick={handleExportAndroid}
                                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-all active:scale-95 whitespace-nowrap"
                                    title="Export Missing as Android XML"
                                >
                                    Android
                                </button>
                                <button
                                    onClick={handleExportIOS}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg transition-all active:scale-95 whitespace-nowrap"
                                    title="Export Missing as iOS Strings"
                                >
                                    iOS
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowFixSettings(!showFixSettings)}
                                        className={clsx(
                                            "p-1.5 rounded-lg transition-colors",
                                            showFixSettings
                                                ? "bg-slate-200 dark:bg-gray-600 text-slate-800 dark:text-white"
                                                : "text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700"
                                        )}
                                        title="Source Fix Settings"
                                    >
                                        <Settings size={18} />
                                    </button>
                                    {showFixSettings && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowFixSettings(false)}></div>
                                            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                                                            JS/TS Pattern
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={translationPattern}
                                                            onChange={(e) => setTranslationPattern(e.target.value)}
                                                            placeholder="t('{key}')"
                                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                                                            Android XML Pattern
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={androidTranslationPattern}
                                                            onChange={(e) => setAndroidTranslationPattern(e.target.value)}
                                                            placeholder="@string/{key}"
                                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                                                            Android Kotlin/Java Pattern
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={androidCodePattern}
                                                            onChange={(e) => setAndroidCodePattern(e.target.value)}
                                                            placeholder="getString(R.string.{key})"
                                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                                                            iOS Swift/ObjC Pattern
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={iosTranslationPattern}
                                                            onChange={(e) => setIosTranslationPattern(e.target.value)}
                                                            placeholder='NSLocalizedString("{key}", comment: "")'
                                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                                                        />
                                                    </div>

                                                    <p className="text-[10px] text-slate-400 dark:text-gray-500 leading-normal border-t border-gray-100 dark:border-gray-700 pt-2 mt-1">
                                                        Use <code className="bg-slate-100 dark:bg-gray-700 px-1 rounded text-slate-600 dark:text-gray-300 font-mono">{'{key}'}</code> as a placeholder for the translation key.
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={handleDownloadFixedSources}
                                    className="px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all active:scale-95 whitespace-nowrap flex items-center gap-1"
                                    title="Download Fixed Source Files"
                                >
                                    <Download size={14} />
                                    Fix Sources
                                </button>

                                <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                                <button
                                    onClick={handleReAnalyze}
                                    disabled={isAnalyzing}
                                    className="p-2 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                                    title={t('validation.reAnalyze')}
                                >
                                    <RefreshCw size={18} className={clsx(isAnalyzing && "animate-spin")} />
                                </button>

                                <button
                                    onClick={handleUploadNew}
                                    className="p-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg transition-all active:scale-95"
                                    title={t('validation.uploadNew')}
                                >
                                    <Upload size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-0">
                        <table className="w-full text-left table-fixed">
                            <thead className="bg-gray-50/50 dark:bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="p-5 w-16 text-center"></th>
                                    <th className="p-5 font-semibold text-slate-500 dark:text-slate-400 text-sm w-56">{t('validation.fileName')}</th>
                                    <th className="p-5 font-semibold text-slate-500 dark:text-slate-400 text-sm w-24 text-center">{t('validation.type')}</th>
                                    <th className="p-5 font-semibold text-slate-500 dark:text-slate-400 text-sm w-40 text-right">{t('validation.status')}</th>
                                    <th className="p-5 font-semibold text-slate-500 dark:text-slate-400 text-sm text-right">{t('validation.issuesOverview')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {displayedResults.map((file, i) => {
                                    const isIgnored = ignoredPaths.has(file.path);
                                    const issueCount = file.details?.length || 0;
                                    const fileName = file.path.split('/').pop() || file.path;

                                    return (
                                        <tr
                                            key={i}
                                            onClick={() => openModal(file)}
                                            className={clsx(
                                                "group hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer",
                                                isIgnored && "opacity-50 grayscale"
                                            )}
                                        >
                                            <td className="p-5 text-center">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleIgnore(file.path); }}
                                                    className={clsx(
                                                        "p-2 rounded-full transition-all duration-200",
                                                        isIgnored
                                                            ? "text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                                                            : "text-slate-300 group-hover:text-slate-500 dark:text-gray-600 dark:group-hover:text-gray-400"
                                                    )}
                                                    title={isIgnored ? "Unignore" : "Ignore file"}
                                                >
                                                    {isIgnored ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </td>
                                            <td className="p-5">
                                                <div className="font-mono text-sm text-slate-700 dark:text-gray-300 truncate" title={file.path}>
                                                    {fileName}
                                                </div>

                                                {isIgnored && <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-gray-700 dark:text-gray-400 px-2 py-0.5 rounded-full">{t('validation.statusLabel.ignored')}</span>}
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className="inline-block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                                    {file.type}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                {file.isValid ? (
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                                                            <CheckCircle size={14} className="stroke-[2.5]" />
                                                            {t('validation.translated')}
                                                        </span>
                                                    </div>
                                                ) : isIgnored ? (
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400 border border-slate-200 dark:border-gray-700">
                                                            <EyeOff size={14} className="stroke-[2.5]" />
                                                            {t('validation.ignored')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                            {t('validation.untranslated')}
                                                            <span className="ml-1 bg-white dark:bg-red-900/40 px-1.5 rounded-md text-xs py-0.5 shadow-sm text-red-700 dark:text-red-300">
                                                                {issueCount}
                                                            </span>
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-5">
                                                {file.details && file.details.length > 0 ? (
                                                    <div className="flex flex-col gap-2 items-end">
                                                        {file.details.slice(0, 3).map((d, k) => (
                                                            <div key={k} className="flex items-center gap-3 text-sm max-w-full">
                                                                <span className="truncate text-slate-600 dark:text-gray-400 max-w-[200px]" title={d.text}>{d.text}</span>
                                                                <span className="shrink-0 flex items-center justify-center bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold min-w-[24px]">
                                                                    L{d.line}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {file.details.length > 3 && (
                                                            <span className="text-xs font-medium text-slate-400 dark:text-gray-500 italic mt-1">
                                                                +{file.details.length - 3} more issues
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-right text-sm text-slate-300 dark:text-gray-600 italic">{t('validation.noIssues')}</div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }

            {/* Detail Modal */}
            {
                selectedResult && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm rounded-xl">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden ring-1 ring-black/5">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="flex flex-col overflow-hidden">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate flex items-center gap-2">
                                        <FileText size={20} className="text-blue-500" />
                                        {selectedResult.path}
                                    </h3>
                                    <span className="text-xs text-slate-400 dark:text-gray-500 font-mono mt-0.5 ml-7">
                                        {selectedResult.type.toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 ml-4">
                                    {/* Toggle View Mode */}
                                    <div className="flex items-center bg-slate-100 dark:bg-gray-700 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={clsx(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
                                                viewMode === 'list'
                                                    ? "bg-white dark:bg-gray-600 text-slate-800 dark:text-white shadow-sm"
                                                    : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
                                            )}
                                        >
                                            <List size={16} />
                                            {t('validation.view.list')}
                                        </button>
                                        <button
                                            onClick={() => setViewMode('code')}
                                            className={clsx(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
                                                viewMode === 'code'
                                                    ? "bg-white dark:bg-gray-600 text-slate-800 dark:text-white shadow-sm"
                                                    : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
                                            )}
                                        >
                                            <Code size={16} />
                                            {t('validation.view.code')}
                                        </button>
                                    </div>

                                    <div className="w-px h-8 bg-slate-200 dark:bg-gray-700 mx-1"></div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedResult(null); }}
                                        className="p-2 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-0 overflow-hidden flex-1 flex flex-col bg-slate-50 dark:bg-gray-900">
                                {viewMode === 'list' ? (
                                    <>
                                        <div className="p-6 flex-shrink-0 grid grid-cols-2 gap-4">
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{t('validation.status')}</div>
                                                    {selectedResult.isValid ? (
                                                        <span className="inline-flex items-center gap-1.5 text-base font-bold text-green-600 dark:text-green-400">
                                                            <CheckCircle size={18} /> {t('validation.translated')}
                                                        </span>
                                                    ) : ignoredPaths.has(selectedResult.path) ? (
                                                        <span className="inline-flex items-center gap-1.5 text-base font-bold text-slate-500 dark:text-gray-400">
                                                            <EyeOff size={18} /> {t('validation.ignored')}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-base font-bold text-red-600 dark:text-red-400">
                                                            <AlertCircle size={18} /> {t('validation.untranslated')}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={clsx(
                                                    "p-3 rounded-full bg-opacity-10",
                                                    selectedResult.isValid ? "bg-green-500 text-green-500" : "bg-red-500 text-red-500"
                                                )}>
                                                    {selectedResult.isValid ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{t('validation.totalIssues')}</div>
                                                    <div className="text-2xl font-black text-slate-800 dark:text-white">{selectedResult.details?.length || 0}</div>
                                                </div>
                                                <div className="p-3 rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
                                                    <List size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                            {selectedResult.details && selectedResult.details.length > 0 ? (
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-gray-50 dark:bg-gray-800/80 sticky top-0 border-b border-gray-100 dark:border-gray-700 font-semibold text-slate-500 dark:text-gray-400">
                                                        <tr>
                                                            <th className="p-4 w-20 text-center">{t('validation.line')}</th>
                                                            <th className="p-4 w-1/3">{t('validation.untranslatedText')}</th>
                                                            <th className="p-4">{t('validation.contextMessage')}</th>
                                                            <th className="p-4 w-16"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                                        {selectedResult.details.map((detail, idx) => (
                                                            <tr
                                                                key={idx}
                                                                className="hover:bg-blue-50/50 dark:hover:bg-gray-700/30 cursor-pointer group transition-colors"
                                                                onClick={() => handleJumpToCode(detail.line)}
                                                            >
                                                                <td className="p-4 text-center">
                                                                    <span className="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400 font-mono text-xs font-bold">
                                                                        {detail.line}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="flex items-center gap-2 group/text">
                                                                        <div className="font-mono text-sm break-all text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-100 dark:border-red-900/20 flex-1">
                                                                            {detail.text}
                                                                        </div>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleCopy(detail.text);
                                                                            }}
                                                                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all opacity-0 group-hover/text:opacity-100 focus:opacity-100"
                                                                            title={t('common.copy')}
                                                                        >
                                                                            {copiedText === detail.text ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-slate-600 dark:text-gray-300 text-sm">
                                                                    {detail.message}
                                                                </td>
                                                                <td className="p-4 text-center text-slate-300 group-hover:text-blue-500">
                                                                    <Code size={16} />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-center p-12 text-slate-400">
                                                    <CheckCircle size={48} className="mb-4 text-green-100 dark:text-green-900/30" />
                                                    <p className="text-lg font-medium text-slate-600 dark:text-gray-300">{t('validation.noUntranslatedFound')}</p>
                                                    <p className="text-sm text-slate-400">{t('validation.noIssues')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    // Code View
                                    <div className="flex-1 overflow-auto bg-[#1e1e1e] text-blue-100 text-sm font-mono p-6 leading-relaxed" ref={codeViewRef}>
                                        {selectedResult.content ? (
                                            <div className="relative">
                                                {selectedResult.content.split('\n').map((line, idx) => {
                                                    const lineNumber = idx + 1;
                                                    const issuesOnLine = selectedResult.details?.filter(d => d.line === lineNumber);
                                                    const hasIssues = issuesOnLine && issuesOnLine.length > 0;
                                                    const isHighlighted = highlightedLine === lineNumber;

                                                    // Very basic syntax highlighting for text/tags
                                                    const highlightedLineContent = (text: string) => {
                                                        // Simple heuristic to colorize tags and values
                                                        const parts = text.split(/(<[^>]+>)/g);
                                                        return parts.map((part, i) => {
                                                            if (part.startsWith('<') && part.endsWith('>')) {
                                                                return <span key={i} className="text-blue-400">{part}</span>
                                                            } else {
                                                                return <span key={i} className="text-gray-300">{part}</span>
                                                            }
                                                        });
                                                    };

                                                    return (
                                                        <div
                                                            key={idx}
                                                            data-line={lineNumber}
                                                            className={clsx(
                                                                "flex -mx-6 px-6 border-l-4",
                                                                isHighlighted
                                                                    ? "bg-yellow-900/30 border-yellow-500"
                                                                    : hasIssues
                                                                        ? "bg-red-900/10 border-red-500/50"
                                                                        : "border-transparent hover:bg-white/5"
                                                            )}
                                                        >
                                                            <div className="w-12 text-right pr-4 text-gray-500 select-none flex-shrink-0 text-xs py-0.5">
                                                                {lineNumber}
                                                            </div>
                                                            <div className="flex-1 whitespace-pre-wrap break-all py-0.5">
                                                                {hasIssues ? (() => {
                                                                    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                                                    const uniqueTexts = Array.from(new Set(issuesOnLine.map(d => d.text)))
                                                                        .sort((a, b) => b.length - a.length);

                                                                    if (uniqueTexts.length === 0) return highlightedLineContent(line);

                                                                    const pattern = new RegExp(`(${uniqueTexts.map(escapeRegExp).join('|')})`, 'g');
                                                                    const parts = line.split(pattern);

                                                                    return (
                                                                        <>
                                                                            {parts.map((part, i) => {
                                                                                const isMatch = uniqueTexts.includes(part);
                                                                                if (isMatch) {
                                                                                    return (
                                                                                        <span key={i} className="bg-red-500/30 text-red-200 rounded px-0.5 box-decoration-clone outline outline-1 outline-red-500/60 relative group cursor-help">
                                                                                            {part}
                                                                                            <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
                                                                                                {t('validation.untranslatedText')}
                                                                                            </span>
                                                                                        </span>
                                                                                    );
                                                                                }
                                                                                return highlightedLineContent(part);
                                                                            })}
                                                                        </>
                                                                    );
                                                                })() : (
                                                                    highlightedLineContent(line)
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 text-gray-500 italic">
                                                {t('validation.noContent')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Progress Overlay for Fixed Source Download */}
            {isAnalyzing && results.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
                        <div className="relative w-24 h-24 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    className="text-gray-100 dark:text-gray-700 stroke-current"
                                    strokeWidth="8"
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                ></circle>
                                <circle
                                    className="text-blue-500 progress-ring__circle stroke-current transition-all duration-300 ease-out"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                ></circle>
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <span className="text-xl font-bold text-slate-700 dark:text-white">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>
                        {/* <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                            {progress < 100 ? 'Processing Files...' : 'Compressing...'}
                        </h3> */}
                        <p className="text-sm text-slate-500 dark:text-gray-400 text-center animate-pulse">
                            {processingFile}
                        </p>
                    </div>
                </div>
            )}
        </div >
    );
}
