import * as XLSX from 'xlsx';
import JSZip from 'jszip';

export interface TranslationEntry {
    key: string;
    sourceText: string;
    translations: { [langCode: string]: string };
    context?: string;
    isModified?: boolean;
}

export interface ParsedTranslationProject {
    sourceLanguage: string;
    detectedLanguages: string[];
    entries: TranslationEntry[];
    originalFormat: 'json' | 'android' | 'ios' | 'excel' | 'csv' | 'zip';
    rawFilesCount: number;
}

// Flatten nested JSON object: { "auth": { "login": "Sign In" } } -> { "auth.login": "Sign In" }
export const flattenJSON = (data: any, prefix = ''): { [key: string]: string } => {
    let result: { [key: string]: string } = {};
    if (typeof data !== 'object' || data === null) {
        if (prefix) result[prefix] = String(data);
        return result;
    }
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const nextKey = prefix ? `${prefix}.${key}` : key;
            if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
                const flatObject = flattenJSON(data[key], nextKey);
                result = { ...result, ...flatObject };
            } else if (Array.isArray(data[key])) {
                result[nextKey] = JSON.stringify(data[key]);
            } else {
                result[nextKey] = String(data[key]);
            }
        }
    }
    return result;
};

// Unflatten flat JSON object back to nested object safely
export const unflattenJSON = (flatData: { [key: string]: any }): any => {
    if (!flatData || typeof flatData !== 'object') return {};
    const result: any = {};

    for (const key in flatData) {
        if (!Object.prototype.hasOwnProperty.call(flatData, key)) continue;
        if (!key || typeof key !== 'string') continue;

        const keys = key.split('.').filter(Boolean);
        if (keys.length === 0) continue;

        let current = result;
        let isSafe = true;

        for (let i = 0; i < keys.length - 1; i++) {
            const part = keys[i];
            // Prevent prototype pollution
            if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
                isSafe = false;
                break;
            }
            if (current[part] === undefined || current[part] === null || typeof current[part] !== 'object') {
                current[part] = {};
            }
            current = current[part];
        }

        if (isSafe && current && typeof current === 'object') {
            const lastPart = keys[keys.length - 1];
            if (lastPart !== '__proto__' && lastPart !== 'constructor' && lastPart !== 'prototype') {
                current[lastPart] = flatData[key];
            }
        }
    }
    return result;
};

// Android XML Parser
export const parseAndroidXml = (xmlText: string): { [key: string]: string } => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const strings = xmlDoc.getElementsByTagName('string');
    const result: { [key: string]: string } = {};

    for (let i = 0; i < strings.length; i++) {
        const name = strings[i].getAttribute('name');
        if (name) {
            let val = strings[i].textContent || '';
            // Unescape common Android escapes
            val = val
                .replace(/\\'/g, "'")
                .replace(/\\"/g, '"')
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t');
            result[name] = val;
        }
    }
    return result;
};

// Android XML Serializer
export const serializeAndroidXml = (data: { [key: string]: string }): string => {
    const lines: string[] = ['<?xml version="1.0" encoding="utf-8"?>', '<resources>'];
    for (const [key, value] of Object.entries(data)) {
        if (!key) continue;
        const escaped = (value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n');
        lines.push(`    <string name="${key}">${escaped}</string>`);
    }
    lines.push('</resources>');
    return lines.join('\n');
};

// iOS Localizable.strings Parser
export const parseIosStrings = (text: string): { [key: string]: string } => {
    const result: { [key: string]: string } = {};
    const lines = text.split('\n');

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
            continue;
        }
        const match = line.match(/^"((?:\\.|[^"\\])*)"\s*=\s*"((?:\\.|[^"\\])*)"\s*;?/);
        if (match) {
            const key = match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
            const val = match[2].replace(/\\"/g, '"').replace(/\\n/g, '\n');
            result[key] = val;
        }
    }
    return result;
};

// iOS Localizable.strings Serializer
export const serializeIosStrings = (data: { [key: string]: string }): string => {
    const lines: string[] = ['/* Localizable.strings */', ''];
    for (const [key, value] of Object.entries(data)) {
        if (!key) continue;
        const escapedKey = key.replace(/"/g, '\\"').replace(/\n/g, '\\n');
        const escapedVal = (value || '').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        lines.push(`"${escapedKey}" = "${escapedVal}";`);
    }
    return lines.join('\n');
};

// Helper: infer language from file name or folder path
export const inferLanguageFromPath = (path: string): string | null => {
    const cleanPath = path.toLowerCase().replace(/\\/g, '/');

    // Check Android pattern: values-es, values-fr-rFR, values-km
    const androidMatch = cleanPath.match(/values-([a-z]{2,3}(?:-r?[a-z]{2,4})?)\//i);
    if (androidMatch) {
        return androidMatch[1].replace('-r', '-').toLowerCase();
    }
    if (cleanPath.includes('/values/')) {
        return 'en'; // default android
    }

    // Check iOS pattern: es.lproj/Localizable.strings, zh-Hans.lproj
    const iosMatch = cleanPath.match(/([a-z]{2,3}(?:-[a-z0-9]+)?)\.lproj\//i);
    if (iosMatch) {
        return iosMatch[1].toLowerCase();
    }

    // Check filename: en.json, es.json, strings_de.xml, strings-ja.json
    const filename = cleanPath.split('/').pop() || '';
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;

    // Direct match: en, km, es, zh, fr, ja, ko, de, ru, it, pt, ar, etc.
    if (/^[a-z]{2,3}(?:-[a-z0-9]+)?$/i.test(nameWithoutExt)) {
        return nameWithoutExt.toLowerCase();
    }

    // Suffix match: strings_en, localizable-es, translations_fr
    const suffixMatch = nameWithoutExt.match(/[_\-]([a-z]{2,3}(?:-[a-z0-9]+)?)$/i);
    if (suffixMatch) {
        return suffixMatch[1].toLowerCase();
    }

    return null;
};

// Excel / CSV Parser
export const parseExcelOrCsv = async (
    file: File,
    onProgress?: (progress: number, status: string) => void
): Promise<{
    languages: string[];
    keys: string[];
    data: { [lang: string]: { [key: string]: string } };
}> => {
    if (onProgress) onProgress(20, 'Reading spreadsheet buffer...');
    const arrayBuffer = await file.arrayBuffer();

    if (onProgress) onProgress(40, 'Parsing workbook sheets...');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    if (onProgress) onProgress(60, 'Extracting data rows...');
    const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    if (!rows || rows.length < 2) {
        throw new Error('Spreadsheet must contain at least a header row and one data row.');
    }

    // Find header row and column indices
    let headerRowIdx = 0;
    let keyColIdx = -1;

    for (let r = 0; r < Math.min(5, rows.length); r++) {
        const row = rows[r].map(c => String(c).trim().toLowerCase());
        const keyIdx = row.findIndex(c =>
            c === 'key' || c === 'json key' || c === 'id' || c === 'string_id' || c === 'name' || c.includes('key')
        );
        if (keyIdx !== -1) {
            headerRowIdx = r;
            keyColIdx = keyIdx;
            break;
        }
    }

    if (keyColIdx === -1) {
        keyColIdx = 0; // Default to first column
    }

    const headers = rows[headerRowIdx].map(c => String(c).trim());
    const langIndices: { [lang: string]: number } = {};
    const languages: string[] = [];

    headers.forEach((h, idx) => {
        if (idx === keyColIdx) return;
        if (!h) return;
        // Ignore "Level 1", "Level 2", "Comment", "Context", "Notes"
        if (/^level\s*\d+$/i.test(h) || /^context$/i.test(h) || /^comment$/i.test(h) || /^notes?$/i.test(h)) {
            return;
        }
        const langCode = h.toLowerCase();
        langIndices[langCode] = idx;
        languages.push(langCode);
    });

    if (languages.length === 0) {
        languages.push('en');
        langIndices['en'] = keyColIdx === 0 ? 1 : 0;
    }

    const data: { [lang: string]: { [key: string]: string } } = {};
    languages.forEach(l => { data[l] = {}; });
    const keys: string[] = [];

    const totalRows = rows.length - (headerRowIdx + 1);
    for (let r = headerRowIdx + 1; r < rows.length; r++) {
        const row = rows[r];
        const key = String(row[keyColIdx] || '').trim();
        if (!key) continue;

        keys.push(key);
        languages.forEach(lang => {
            const col = langIndices[lang];
            const val = col !== undefined && col < row.length ? String(row[col] || '') : '';
            data[lang][key] = val;
        });

        if (onProgress && r % 250 === 0) {
            const pct = Math.min(95, 60 + Math.round(((r - headerRowIdx) / Math.max(1, totalRows)) * 35));
            onProgress(pct, `Processed ${keys.length} keys...`);
        }
    }

    if (onProgress) onProgress(100, `Done loading ${keys.length} keys`);
    return { languages, keys, data };
};

// Universal File Ingestion
export const parseUploadedFiles = async (
    files: File[],
    onProgress?: (progress: number, status: string) => void
): Promise<ParsedTranslationProject> => {
    if (files.length === 0) {
        throw new Error('No files provided');
    }

    // Check if single zip file
    if (files.length === 1 && files[0].name.toLowerCase().endsWith('.zip')) {
        return parseZipPackage(files[0], onProgress);
    }

    // Check if single Excel / CSV
    const firstFile = files[0];
    const isExcelOrCsv = /\.(xlsx|xls|csv)$/i.test(firstFile.name);
    if (files.length === 1 && isExcelOrCsv) {
        if (onProgress) onProgress(10, `Reading ${firstFile.name}...`);
        const { languages, keys, data } = await parseExcelOrCsv(firstFile, onProgress);
        const sourceLang = languages[0] || 'en';
        const entries: TranslationEntry[] = keys.map(key => {
            const translations: { [lang: string]: string } = {};
            languages.forEach(l => {
                translations[l] = data[l][key] || '';
            });
            return {
                key,
                sourceText: translations[sourceLang] || '',
                translations
            };
        });

        return {
            sourceLanguage: sourceLang,
            detectedLanguages: languages,
            entries,
            originalFormat: firstFile.name.toLowerCase().endsWith('.csv') ? 'csv' : 'excel',
            rawFilesCount: 1
        };
    }

    // Multiple or single code translation files (.json, .xml, .strings)
    const fileDataMap: { [lang: string]: { [key: string]: string } } = {};
    let detectedFormat: 'json' | 'android' | 'ios' = 'json';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (onProgress) {
            const pct = Math.round(((i + 1) / files.length) * 70);
            onProgress(pct, `Reading file ${i + 1} of ${files.length} (${file.name})...`);
        }

        const text = await file.text();
        let lang = inferLanguageFromPath(file.name) || `lang_${i + 1}`;

        if (file.name.endsWith('.json')) {
            detectedFormat = 'json';
            try {
                const parsed = JSON.parse(text);
                fileDataMap[lang] = flattenJSON(parsed);
            } catch (e) {
                console.warn('Could not parse JSON:', file.name);
            }
        } else if (file.name.endsWith('.xml')) {
            detectedFormat = 'android';
            fileDataMap[lang] = parseAndroidXml(text);
        } else if (file.name.endsWith('.strings')) {
            detectedFormat = 'ios';
            fileDataMap[lang] = parseIosStrings(text);
        }
    }

    if (onProgress) onProgress(80, 'Aggregating and sorting translation keys...');

    const detectedLanguages = Object.keys(fileDataMap);
    if (detectedLanguages.length === 0) {
        throw new Error('No valid translation entries found in uploaded files.');
    }

    const allKeysSet = new Set<string>();
    detectedLanguages.forEach(l => {
        Object.keys(fileDataMap[l]).forEach(k => allKeysSet.add(k));
    });

    const sortedKeys = Array.from(allKeysSet).sort();
    const sourceLanguage = detectedLanguages.includes('en') ? 'en' : detectedLanguages[0];

    const entries: TranslationEntry[] = sortedKeys.map(key => {
        const translations: { [lang: string]: string } = {};
        detectedLanguages.forEach(lang => {
            translations[lang] = fileDataMap[lang][key] || '';
        });
        return {
            key,
            sourceText: translations[sourceLanguage] || Object.values(translations).find(v => !!v) || '',
            translations
        };
    });

    if (onProgress) onProgress(100, `Finished! Loaded ${entries.length} keys.`);

    return {
        sourceLanguage,
        detectedLanguages,
        entries,
        originalFormat: detectedFormat,
        rawFilesCount: files.length
    };
};

// Zip Archive Parser
export const parseZipPackage = async (
    zipFile: File,
    onProgress?: (progress: number, status: string) => void
): Promise<ParsedTranslationProject> => {
    if (onProgress) onProgress(15, `Unpacking ${zipFile.name}...`);
    const zip = await JSZip.loadAsync(zipFile);
    const fileDataMap: { [lang: string]: { [key: string]: string } } = {};
    let detectedFormat: 'json' | 'android' | 'ios' | 'zip' = 'json';
    let count = 0;

    const fileEntries = Object.keys(zip.files).filter(path => !zip.files[path].dir && !path.startsWith('__MACOSX'));

    for (let i = 0; i < fileEntries.length; i++) {
        const path = fileEntries[i];
        const entry = zip.files[path];
        const lowerPath = path.toLowerCase();
        let lang = inferLanguageFromPath(path) || `lang_${count + 1}`;

        if (onProgress) {
            const pct = Math.min(85, 20 + Math.round(((i + 1) / fileEntries.length) * 65));
            onProgress(pct, `Extracting ${path.split('/').pop()}...`);
        }

        if (lowerPath.endsWith('.json')) {
            detectedFormat = 'json';
            const text = await entry.async('text');
            try {
                const parsed = JSON.parse(text);
                fileDataMap[lang] = { ...(fileDataMap[lang] || {}), ...flattenJSON(parsed) };
                count++;
            } catch (e) {}
        } else if (lowerPath.endsWith('.xml') && lowerPath.includes('string')) {
            detectedFormat = 'android';
            const text = await entry.async('text');
            fileDataMap[lang] = { ...(fileDataMap[lang] || {}), ...parseAndroidXml(text) };
            count++;
        } else if (lowerPath.endsWith('.strings')) {
            detectedFormat = 'ios';
            const text = await entry.async('text');
            fileDataMap[lang] = { ...(fileDataMap[lang] || {}), ...parseIosStrings(text) };
            count++;
        }
    }

    const detectedLanguages = Object.keys(fileDataMap);
    if (detectedLanguages.length === 0) {
        throw new Error('No translation files (.json, .xml, .strings) found in the ZIP.');
    }

    if (onProgress) onProgress(90, 'Processing unique keys and languages...');

    const allKeysSet = new Set<string>();
    detectedLanguages.forEach(l => {
        Object.keys(fileDataMap[l]).forEach(k => allKeysSet.add(k));
    });

    const sortedKeys = Array.from(allKeysSet).sort();
    const sourceLanguage = detectedLanguages.includes('en') ? 'en' : detectedLanguages[0];

    const entries: TranslationEntry[] = sortedKeys.map(key => {
        const translations: { [lang: string]: string } = {};
        detectedLanguages.forEach(lang => {
            translations[lang] = fileDataMap[lang][key] || '';
        });
        return {
            key,
            sourceText: translations[sourceLanguage] || Object.values(translations).find(v => !!v) || '',
            translations
        };
    });

    if (onProgress) onProgress(100, `Done! Loaded ${entries.length} keys.`);

    return {
        sourceLanguage,
        detectedLanguages,
        entries,
        originalFormat: detectedFormat,
        rawFilesCount: count
    };
};
