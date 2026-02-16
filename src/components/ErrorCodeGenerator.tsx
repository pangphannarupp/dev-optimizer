import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Copy, Check, FileCode, Maximize2, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// Checking package.json, react-dropzone is NOT listed. Custom DropZone is used in App.tsx. 
// I will implement a simple drag and drop using the existing DropZone component or native.
// App.tsx uses `import { DropZone } from './components/DropZone';`
// Let's check DropZone component.

// Actually, I'll stick to a simple native implementation or reuse DropZone if possible.
// But DropZone in App.tsx seems specific to image processing (files dropped -> handleFilesDropped for images).
// I will build a simple drop zone inside this component.

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';

SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('swift', swift);





const sanitizeValue = (str: string, wordLimit: number = 4) => {
    // If user inputs "Wrong parameter", it becomes "wrongParameter"
    // Limit to first `wordLimit` words (default 4)
    if (!str) return '';
    const words = str.split(/[\s_-]+/).filter(w => w.length > 0).slice(0, wordLimit);
    return words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
        if (!cleanWord) return '';
        if (index === 0) return cleanWord.toLowerCase();
        return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1).toLowerCase();
    }).join('');
};

export function ErrorCodeGenerator() {
    const { t } = useTranslation();
    const [kotlinCode, setKotlinCode] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copiedKotlin, setCopiedKotlin] = useState(false);
    const [copiedSwift, setCopiedSwift] = useState(false);
    const [androidXmlCode, setAndroidXmlCode] = useState('');
    const [iosStringsCode, setIosStringsCode] = useState('');
    const [copiedAndroidXml, setCopiedAndroidXml] = useState(false);
    const [copiedIosStrings, setCopiedIosStrings] = useState(false);

    // Full Screen State
    const [fullScreenMode, setFullScreenMode] = useState<'kotlin' | 'swift' | 'androidXml' | 'iosStrings' | null>(null);

    // New State for Manual Selection
    const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
    const [sheets, setSheets] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string>('');
    const [columns, setColumns] = useState<string[]>([]);

    const [keyCol, setKeyCol] = useState<string>('');
    const [codeCol, setCodeCol] = useState<string>('');
    const [msgCol, setMsgCol] = useState<string>('');


    const generateCode = useCallback((sheetName: string, kCol: string, cCol: string, mCol: string, wb: XLSX.WorkBook) => {
        if (!wb || !sheetName || !cCol) { // kCol is optional now if we generate from msg
            setKotlinCode('');
            setSwiftCode('');
            setAndroidXmlCode('');
            setIosStringsCode('');
            return;
        }

        try {
            const worksheet = wb.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Array of arrays

            if (jsonData.length < 2) {
                setKotlinCode('');
                setSwiftCode('');
                setAndroidXmlCode('');
                setIosStringsCode('');
                return;
            }

            const headers = (jsonData[0] as string[]).map(h => h.trim());

            const kIndex = kCol === 'GENERATE_FROM_MESSAGE' ? -99 : headers.indexOf(kCol);
            const cIndex = headers.indexOf(cCol);
            const mIndex = mCol ? headers.indexOf(mCol) : -1;

            if (cIndex === -1) {
                setKotlinCode('');
                setSwiftCode('');
                setAndroidXmlCode('');
                setIosStringsCode('');
                return;
            }

            let kCode = '// AUTO-GENERATED. DO NOT MODIFY.\nobject ErrorCode {\n';
            let sCode = '// AUTO-GENERATED. DO NOT MODIFY.\nstruct ErrorCode {\n';
            let xmlCode = '<!-- AUTO-GENERATED. DO NOT MODIFY. -->\n<resources>\n';
            let stringsCode = '// AUTO-GENERATED. DO NOT MODIFY.\n';

            const messagesMapKotlin: string[] = [];
            const messagesMapSwift: string[] = [];
            const generatedKeys = new Set<string>();

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i] as any[];
                if (!row || row.length === 0) continue;

                const code = row[cIndex];
                const msg = mIndex !== -1 ? row[mIndex] : '';

                let key = '';
                if (kIndex === -99) {
                    // Generate from message
                    const rawMsg = msg || '';
                    let limit = 4;
                    let tempKey = sanitizeValue(rawMsg, limit);

                    // If duplicate, try increasing word limit to resolve collision
                    while (generatedKeys.has(tempKey)) {
                        const nextKey = sanitizeValue(rawMsg, limit + 1);
                        if (nextKey === tempKey) break; // No more words available to add
                        limit++;
                        tempKey = nextKey;
                    }

                    key = tempKey;

                    // Fallback if msg empty
                    if (!key) key = sanitizeValue(code || `Error${i}`);
                } else if (kIndex !== -1) {
                    key = row[kIndex];
                }

                if (!key || !code) continue;

                // Handle duplicates
                let uniqueKey = key;
                let counter = 1;
                while (generatedKeys.has(uniqueKey)) {
                    uniqueKey = `${key}${counter}`;
                    counter++;
                }
                generatedKeys.add(uniqueKey);
                key = uniqueKey;

                // Kotlin
                kCode += `    const val ${key} = "${code}"\n`;
                // kCode += `    const val ${key}Tr = "${msg}"\n`;

                // Swift
                sCode += `    static let ${key} = "${code}"\n`;
                // sCode += `    static let ${key}Tr = "${msg}"\n`;

                if (msg) {
                    messagesMapKotlin.push(`        ${key} to "${code}"`);
                    // messagesMapKotlin.push(`        "${key}Tr" to "${msg}"`);
                    messagesMapSwift.push(`        ${key}: "${code}"`);
                    // messagesMapSwift.push(`        "${key}Tr": "${msg}"`);

                    // Android XML
                    xmlCode += `    <string name="${code}">${msg}</string>\n`;

                    // iOS .strings
                    stringsCode += `"${code}" = "${msg}";\n`;
                }
            }

            kCode += '\n    val messages = mapOf(\n';
            kCode += messagesMapKotlin.join(',\n');
            kCode += '\n    )\n}';

            sCode += '\n    let messages = [\n';
            sCode += messagesMapSwift.join(',\n');
            sCode += '\n    ]\n}';

            xmlCode += '</resources>';

            setKotlinCode(kCode);
            setSwiftCode(sCode);
            setAndroidXmlCode(xmlCode);
            setIosStringsCode(stringsCode);
        } catch (err) {
            console.error("Generation error", err);
            setError("Error generating code");
        }
    }, []);

    // Auto-detect columns when available columns change
    // This is called when sheet changes and we have new columns
    const detectColumns = (headers: string[]) => {
        const lowerHeaders = headers.map(h => h.toLowerCase());

        const kIndex = lowerHeaders.findIndex(h => h.includes('name') || h.includes('key') || h.includes('variable'));
        const cIndex = lowerHeaders.findIndex(h => h.includes('code') || h.includes('id') || h.includes('value'));
        const mIndex = lowerHeaders.findIndex(h => h.includes('message') || h.includes('msg') || h.includes('text') || h.includes('description'));

        let newKeyCol = '';
        let newCodeCol = '';
        let newMsgCol = '';

        if (kIndex !== -1) newKeyCol = headers[kIndex];
        // If no explicit Key column found, default to GENERATE if Message column exists
        else if (mIndex !== -1) newKeyCol = 'GENERATE_FROM_MESSAGE';

        if (cIndex !== -1) newCodeCol = headers[cIndex];
        if (mIndex !== -1) newMsgCol = headers[mIndex];

        // Fallbacks if only 3 columns and not found
        if (!newKeyCol && !newCodeCol && headers.length >= 2) {
            newKeyCol = headers[0];
            newCodeCol = headers[1];
            if (headers.length > 2) newMsgCol = headers[2];
        }

        setKeyCol(newKeyCol);
        setCodeCol(newCodeCol);
        setMsgCol(newMsgCol);

        return { newKeyCol, newCodeCol, newMsgCol };
    };

    const handleSheetChange = (newSheet: string, wb: XLSX.WorkBook) => {
        setSelectedSheet(newSheet);
        const worksheet = wb.Sheets[newSheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
            const headers = (jsonData[0] as string[]).map(h => h ? h.trim() : `Col ${Math.random()}`); // Handle empty headers?
            setColumns(headers);
            const { newKeyCol, newCodeCol, newMsgCol } = detectColumns(headers);
            generateCode(newSheet, newKeyCol, newCodeCol, newMsgCol, wb);
        } else {
            setColumns([]);
            setKeyCol('');
            setCodeCol('');
            setMsgCol('');
            setKotlinCode('');
            setSwiftCode('');
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (!file.name.match(/\.(xlsx|xls)$/)) {
            setError(t('errorCodeGenerator.invalidFile', 'Please upload a valid Excel file.'));
            return;
        }

        setFileName(file.name);
        setError(null);
        setKotlinCode('');
        setSwiftCode('');
        setAndroidXmlCode('');
        setIosStringsCode('');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const wb = XLSX.read(data, { type: 'binary' });
                setWorkbook(wb);

                const sheetNames = wb.SheetNames;
                setSheets(sheetNames);

                if (sheetNames.length > 0) {
                    handleSheetChange(sheetNames[0], wb);
                }

            } catch (err) {
                console.error(err);
                setError('Failed to parse Excel file.');
            }
        };
        reader.readAsBinaryString(file);
    }, [t, generateCode]);

    // Update code when mappings change
    const handleMappingChange = (type: 'key' | 'code' | 'msg', value: string) => {
        let k = keyCol;
        let c = codeCol;
        let m = msgCol;

        if (type === 'key') { setKeyCol(value); k = value; }
        if (type === 'code') { setCodeCol(value); c = value; }
        if (type === 'msg') { setMsgCol(value); m = value; }

        if (workbook && selectedSheet) {
            generateCode(selectedSheet, k, c, m, workbook);
        }
    };


    const copyToClipboard = (text: string, isKotlin: boolean) => {
        navigator.clipboard.writeText(text);
        if (isKotlin) {
            setCopiedKotlin(true);
            setTimeout(() => setCopiedKotlin(false), 2000);
        } else if (text === androidXmlCode) {
            setCopiedAndroidXml(true);
            setTimeout(() => setCopiedAndroidXml(false), 2000);
        } else if (text === iosStringsCode) {
            setCopiedIosStrings(true);
            setTimeout(() => setCopiedIosStrings(false), 2000);
        } else {
            setCopiedSwift(true);
            setTimeout(() => setCopiedSwift(false), 2000);
        }
    };

    const handleDownloadAll = async () => {
        const zip = new JSZip();

        // Android
        zip.file("ErrorCode.kt", kotlinCode);
        zip.file("strings.xml", androidXmlCode);

        // iOS
        zip.file("ErrorCode.swift", swiftCode);
        zip.file("Localizable.strings", iosStringsCode);

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "error_codes_bundle.zip");
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        if (files && files.length > 0) {
            onDrop(files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) onDrop(files);
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="text-green-600" />
                    {t('errorCodeGenerator.title', 'Error Code Generator')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('errorCodeGenerator.description', 'Upload an Excel file to generate Android (Kotlin) and iOS (Swift) error code constants.')}
                </p>
            </div>

            <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer relative group"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                />

                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                </div>

                {fileName ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <FileSpreadsheet size={20} />
                        {fileName}
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            {t('errorCodeGenerator.dropText', 'Click or drag Excel file here')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            .xlsx or .xls files supported
                        </p>
                    </>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {error}
                </div>
            )}

            {/* Configuration Panel */}
            {fileName && workbook && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm flex flex-col gap-4"
                >
                    <h3 className="font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                        Configuration
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Sheet Selector */}
                        {sheets.length > 0 && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase">Sheet</label>
                                <select
                                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={selectedSheet}
                                    onChange={(e) => handleSheetChange(e.target.value, workbook)}
                                >
                                    {sheets.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Columns */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase">Key / Variable Name</label>
                            <select
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={keyCol}
                                onChange={(e) => handleMappingChange('key', e.target.value)}
                            >
                                <option value="">Select Column...</option>
                                <option value="GENERATE_FROM_MESSAGE">✨ Generate from Description</option>
                                {columns.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase">Error Code</label>
                            <select
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={codeCol}
                                onChange={(e) => handleMappingChange('code', e.target.value)}
                            >
                                <option value="">Select Column...</option>
                                {columns.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500 uppercase">Description / Message</label>
                            <select
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={msgCol}
                                onChange={(e) => handleMappingChange('msg', e.target.value)}
                            >
                                <option value="">(Optional) Skip...</option>
                                {columns.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </motion.div>
            )}

            {(kotlinCode || swiftCode) && (
                <div className="flex flex-col gap-6 pb-10">
                    <div className="flex justify-end">
                        <button
                            onClick={handleDownloadAll}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                        >
                            <Download size={18} />
                            {t('errorCodeGenerator.downloadAll', 'Download All')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Android / Kotlin */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <FileCode size={20} className="text-purple-600" />
                                    Android (Kotlin)
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setFullScreenMode('kotlin')}
                                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Full Screen"
                                    >
                                        <Maximize2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(kotlinCode, true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                    >
                                        {copiedKotlin ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                        {copiedKotlin ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E1E1E] max-h-[600px] overflow-auto">
                                <SyntaxHighlighter
                                    language="kotlin"
                                    style={vs2015}
                                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                    showLineNumbers={true}
                                    wrapLongLines={true}
                                >
                                    {kotlinCode}
                                </SyntaxHighlighter>
                            </div>
                        </motion.div>

                        {/* iOS / Swift */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <FileCode size={20} className="text-orange-600" />
                                    iOS (Swift)
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setFullScreenMode('swift')}
                                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Full Screen"
                                    >
                                        <Maximize2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(swiftCode, false)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                    >
                                        {copiedSwift ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                        {copiedSwift ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E1E1E] max-h-[600px] overflow-auto">
                                <SyntaxHighlighter
                                    language="swift"
                                    style={vs2015}
                                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                    showLineNumbers={true}
                                    wrapLongLines={true}
                                >
                                    {swiftCode}
                                </SyntaxHighlighter>
                            </div>
                        </motion.div>

                        {/* Android XML */}
                        {(androidXmlCode) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col gap-2"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <FileCode size={20} className="text-green-600" />
                                        Android (strings.xml)
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setFullScreenMode('androidXml')}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Full Screen"
                                        >
                                            <Maximize2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(androidXmlCode, false)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                        >
                                            {copiedAndroidXml ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            {copiedAndroidXml ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                                <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E1E1E] max-h-[600px] overflow-auto">
                                    <SyntaxHighlighter
                                        language="xml"
                                        style={vs2015}
                                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                        showLineNumbers={true}
                                        wrapLongLines={true}
                                    >
                                        {androidXmlCode}
                                    </SyntaxHighlighter>
                                </div>
                            </motion.div>
                        )}

                        {/* iOS Strings */}
                        {(iosStringsCode) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col gap-2"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <FileCode size={20} className="text-blue-500" />
                                        iOS (Localizable.strings)
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setFullScreenMode('iosStrings')}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Full Screen"
                                        >
                                            <Maximize2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(iosStringsCode, false)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                                        >
                                            {copiedIosStrings ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            {copiedIosStrings ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                                <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E1E1E] max-h-[600px] overflow-auto">
                                    <SyntaxHighlighter
                                        language="swift" // Using swift highlighting for simplicity for .strings file
                                        style={vs2015}
                                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                        showLineNumbers={true}
                                        wrapLongLines={true}
                                    >
                                        {iosStringsCode}
                                    </SyntaxHighlighter>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {/* Full Screen Modal */}
            <AnimatePresence>
                {fullScreenMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <FileCode className={fullScreenMode === 'kotlin' ? 'text-purple-600' : fullScreenMode === 'swift' ? 'text-orange-600' : fullScreenMode === 'androidXml' ? 'text-green-600' : 'text-blue-500'} />
                                {fullScreenMode === 'kotlin' ? 'Android (Kotlin)' : fullScreenMode === 'swift' ? 'iOS (Swift)' : fullScreenMode === 'androidXml' ? 'Android (strings.xml)' : 'iOS (Localizable.strings)'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        let code = '';
                                        if (fullScreenMode === 'kotlin') code = kotlinCode;
                                        else if (fullScreenMode === 'swift') code = swiftCode;
                                        else if (fullScreenMode === 'androidXml') code = androidXmlCode;
                                        else if (fullScreenMode === 'iosStrings') code = iosStringsCode;
                                        copyToClipboard(code, fullScreenMode === 'kotlin');
                                    }}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                    {fullScreenMode === 'kotlin' ? (copiedKotlin ? <Check size={18} /> : <Copy size={18} />) :
                                        fullScreenMode === 'swift' ? (copiedSwift ? <Check size={18} /> : <Copy size={18} />) :
                                            fullScreenMode === 'androidXml' ? (copiedAndroidXml ? <Check size={18} /> : <Copy size={18} />) :
                                                (copiedIosStrings ? <Check size={18} /> : <Copy size={18} />)}

                                    {(fullScreenMode === 'kotlin' && copiedKotlin) ||
                                        (fullScreenMode === 'swift' && copiedSwift) ||
                                        (fullScreenMode === 'androidXml' && copiedAndroidXml) ||
                                        (fullScreenMode === 'iosStrings' && copiedIosStrings) ? 'Copied' : 'Copy Code'}
                                </button>
                                <button
                                    onClick={() => setFullScreenMode(null)}
                                    className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-[#1E1E1E] p-6">
                            <div className="max-w-7xl mx-auto">
                                <SyntaxHighlighter
                                    language={fullScreenMode === 'kotlin' ? 'kotlin' : fullScreenMode === 'androidXml' ? 'xml' : 'swift'}
                                    style={vs2015}
                                    customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                                    showLineNumbers={true}
                                    wrapLongLines={true}
                                >
                                    {fullScreenMode === 'kotlin' ? kotlinCode : fullScreenMode === 'swift' ? swiftCode : fullScreenMode === 'androidXml' ? androidXmlCode : iosStringsCode}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}


