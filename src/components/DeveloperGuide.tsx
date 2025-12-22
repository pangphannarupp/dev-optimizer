import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Book, FileCode, Search, Code, Box, Type, Activity, Info, FolderTree, RotateCcw, Download } from 'lucide-react';
import { clsx } from 'clsx';
import JSZip from 'jszip';
// import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DropZone } from './DropZone';
import { detectLanguage } from '../utils/codeQualityRules';
import { extractSymbols, ParsedFile, CodeSymbol } from '../utils/parser';

export const DeveloperGuide: React.FC = () => {
    const { t } = useTranslation();
    const [files, setFiles] = useState<ParsedFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<ParsedFile | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, fileName: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleZipUpload = useCallback(async (uploadedFiles: File[]) => {
        const zipFile = uploadedFiles[0];
        if (!zipFile) return;

        setIsProcessing(true);
        try {
            const zip = await JSZip.loadAsync(zipFile);
            const parsedFiles: ParsedFile[] = [];

            // Count valid files first
            const entries = Object.keys(zip.files).filter(filename => {
                const pathParts = filename.split('/');
                const ignoredDirs = new Set(['.git', '.gradle', 'node_modules', 'dist', 'build', '.idea', '__pycache__', '.DS_Store']);
                return !zip.files[filename].dir &&
                    !pathParts.some(part => ignoredDirs.has(part)) &&
                    !filename.includes('__MACOSX') &&
                    !filename.startsWith('.');
            });

            setProgress({ current: 0, total: entries.length, fileName: t('developerGuide.parsing') });

            for (let i = 0; i < entries.length; i++) {
                const filename = entries[i];
                setProgress({ current: i + 1, total: entries.length, fileName: filename });

                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 0));

                const content = await zip.files[filename].async('string');
                const detectedLang = detectLanguage(filename, content);

                if (detectedLang) {
                    const symbols = extractSymbols(content, detectedLang);
                    // Only add files that have parsed symbols or are significant
                    if (symbols.length > 0) {
                        parsedFiles.push({
                            fileName: filename,
                            language: detectedLang,
                            symbols
                        });
                    }
                }
            }

            setFiles(parsedFiles.sort((a, b) => a.fileName.localeCompare(b.fileName)));
        } catch (error) {
            console.error("Failed to process zip", error);
        } finally {
            setIsProcessing(false);
            setProgress({ current: 0, total: 0, fileName: '' });
        }
    }, []);

    const filteredFiles = useMemo(() => {
        return files.filter(f => f.fileName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [files, searchTerm]);

    const getSymbolIcon = (type: CodeSymbol['type']) => {
        switch (type) {
            case 'class': return <Box size={14} className="text-orange-500" />;
            case 'interface': return <Type size={14} className="text-blue-500" />;
            case 'function': return <Code size={14} className="text-purple-500" />;
            case 'property': return <Activity size={14} className="text-green-500" />;
            default: return <Box size={14} className="text-gray-500" />;
        }
    };

    const handleExportHtml = async () => {
        if (files.length === 0) return;

        const zip = new JSZip();
        const folder = zip.folder("documentation");
        if (!folder) return;

        // CSS
        const css = `
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; display: flex; gap: 20px; }
            nav { width: 300px; border-right: 1px solid #eee; padding-right: 20px; max-height: 100vh; overflow-y: auto; }
            main { flex: 1; min-width: 0; }
            a { text-decoration: none; color: #0366d6; }
            a:hover { text-decoration: underline; }
            .nav-item { display: block; padding: 5px 0; color: #555; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .nav-item:hover { color: #0366d6; }
            .symbol { margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
            .symbol-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 0.5rem; }
            .symbol-name { font-size: 1.1rem; font-weight: 600; }
            .symbol-type { font-size: 0.8rem; text-transform: uppercase; color: #666; background: #f6f8fa; padding: 2px 6px; rounded: 4px; }
            .signature { background: #f6f8fa; padding: 10px; border-radius: 6px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; font-size: 0.9em; overflow-x: auto; margin-bottom: 10px; }
            .doc-comment { background: #eef7ff; padding: 15px; border-left: 4px solid #0366d6; color: #24292e; white-space: pre-wrap; }
            .file-header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #eaecef; }
            h1 { margin: 0; font-size: 1.5rem; }
            h2 { font-size: 1.2rem; margin-top: 1.5rem; border-bottom: 1px solid #eaecef; padding-bottom: 0.3rem; }
        `;
        folder.file("styles.css", css);

        // Sidebar Content
        const sidebar = files.map(f => `<a href="${f.fileName.replace(/\//g, '_')}.html" class="nav-item">${f.fileName}</a>`).join('');

        // Generate Page for each file
        files.forEach(file => {
            const symbolsHtml = ['class', 'interface', 'function', 'property'].map(type => {
                const typeSymbols = file.symbols.filter(s => s.type === type);
                if (typeSymbols.length === 0) return '';

                return `
                    <h2>${type.charAt(0).toUpperCase() + type.slice(1)}s</h2>
                    ${typeSymbols.map(s => `
                        <div class="symbol">
                            <div class="symbol-header">
                                <span class="symbol-name">${s.name}</span>
                                <span class="symbol-type">${s.type}</span>
                                <span style="font-size: 0.8em; color: #999;">Line ${s.line}</span>
                            </div>
                            <div class="signature">${s.signature}</div>
                            ${s.description ? `<div class="doc-comment">${s.description}</div>` : ''}
                        </div>
                    `).join('')}
                `;
            }).join('');

            const content = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${file.fileName} - Developer Guide</title>
                    <link rel="stylesheet" href="styles.css">
                </head>
                <body>
                    <nav>
                        <h3>Files</h3>
                        ${sidebar}
                    </nav>
                    <main>
                        <div class="file-header">
                            <h1>${file.fileName}</h1>
                            <span style="background: #e1e4e8; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${file.language}</span>
                        </div>
                        ${symbolsHtml || '<p>No public symbols detected.</p>'}
                    </main>
                </body>
                </html>
            `;
            folder.file(`${file.fileName.replace(/\//g, '_')}.html`, content);
        });

        // Index Page
        const indexContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Developer Guide</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <nav>
                    <h3>Files</h3>
                    ${sidebar}
                </nav>
                <main style="display: flex; align-items: center; justify-content: center; color: #666; height: 80vh;">
                    <div style="text-align: center;">
                        <h1>Developer Guide</h1>
                        <p>Select a file from the sidebar to view documentation.</p>
                        <p>Generated on ${new Date().toLocaleDateString()}</p>
                    </div>
                </main>
            </body>
            </html>
        `;
        folder.file("index.html", indexContent);

        // Generate Zip
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "documentation.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setFiles([]);
        setSelectedFile(null);
        setSearchTerm('');
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50">
            {/* Header */}
            <div className="p-6 pb-2 shrink-0 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center gap-2">
                        <Book size={24} className="text-blue-600 dark:text-blue-400" />
                        {t('developerGuide.title')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('developerGuide.subtitle')}
                    </p>
                </div>
                {files.length > 0 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportHtml}
                            className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                        >
                            <Download size={14} />
                            {t('developerGuide.exportHtml')}
                        </button>
                        <button
                            onClick={handleClear}
                            className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors shadow-sm"
                        >
                            <RotateCcw size={14} />
                            {t('developerGuide.newProject')}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 flex min-h-0 p-6 pt-4 gap-6">
                {files.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800/50">
                        {isProcessing ? (
                            <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full overflow-visible">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="36"
                                            className="text-gray-200 dark:text-gray-700"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="36"
                                            className="text-blue-500 transition-all duration-300 ease-out"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            strokeDasharray="226.2"
                                            strokeDashoffset={226.2 - (226.2 * (progress.current / Math.max(progress.total, 1)))}
                                            transform="rotate(-90 48 48)"
                                        />
                                        <text
                                            x="48"
                                            y="48"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            className="text-xl font-bold text-gray-700 dark:text-gray-200"
                                            fill="currentColor"
                                        >
                                            {Math.round((progress.current / Math.max(progress.total, 1)) * 100)}%
                                        </text>
                                    </svg>
                                </div>

                                <div className="text-center w-full space-y-1">
                                    <p className="text-gray-600 dark:text-gray-300 font-medium">{t('developerGuide.parsing')}</p>
                                    <p className="text-xs text-gray-400 font-mono whitespace-nowrap overflow-x-auto px-4 max-w-full no-scrollbar">
                                        {progress.fileName}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <DropZone
                                onFilesDropped={handleZipUpload}
                                accept=".zip"
                                multiple={false}
                                dragDropText={t('developerGuide.uploadZip')}
                                supportedText={t('developerGuide.supports')}
                                className="border-none"
                            />
                        )}
                    </div>
                ) : (
                    <>
                        {/* Sidebar */}
                        <div className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={t('developerGuide.searchPlaceholder')}
                                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {filteredFiles.map((file, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedFile(file)}
                                        className={clsx(
                                            "w-full text-left px-4 py-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-2 group",
                                            selectedFile?.fileName === file.fileName ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                                        )}
                                    >
                                        <FileCode size={16} className={clsx(
                                            "shrink-0",
                                            selectedFile?.fileName === file.fileName ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                        )} />
                                        <div className="min-w-0">
                                            <div className={clsx("text-sm font-medium truncate", selectedFile?.fileName === file.fileName ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300")}>
                                                {file.fileName.split('/').pop()}
                                            </div>
                                            <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                                                <span>{file.symbols.length} symbols</span>
                                                •
                                                <span className="uppercase">{file.language.split('-')[1]}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                            {selectedFile ? (
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30">
                                        <div className="flex items-center gap-3 mb-2 text-gray-400 text-xs font-mono">
                                            <FolderTree size={12} />
                                            {selectedFile.fileName}
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                            {selectedFile.fileName.split('/').pop()}
                                        </h2>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                                                {selectedFile.language.split('-')[1]}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        {selectedFile.symbols.length === 0 && (
                                            <p className="text-gray-500 italic">{t('developerGuide.noSymbols')}</p>
                                        )}

                                        {/* Organize symbols by type */}
                                        {['class', 'interface', 'function', 'property'].map(typeCategory => {
                                            const categorySymbols = selectedFile.symbols.filter(s => s.type === typeCategory);
                                            if (categorySymbols.length === 0) return null;

                                            return (
                                                <div key={typeCategory} className="space-y-4">
                                                    <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                                                        {getSymbolIcon(typeCategory as any)}
                                                        {typeCategory === 'class' ? t('developerGuide.classes') : typeCategory === 'property' ? t('developerGuide.properties') : typeCategory === 'function' ? t('developerGuide.functions') : t('developerGuide.interfaces')}
                                                    </h3>
                                                    <div className="grid gap-6">
                                                        {categorySymbols.map((symbol) => (
                                                            <div key={symbol.id} className="group">
                                                                <div className="flex items-baseline gap-2 mb-2">
                                                                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                                                        {symbol.name}
                                                                    </h4>
                                                                    <span className="text-xs text-gray-400 font-mono">{t('developerGuide.line')} {symbol.line}</span>
                                                                </div>

                                                                {/* Signature Block */}
                                                                <div className="bg-gray-50 dark:bg-gray-950 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 mb-3">
                                                                    <SyntaxHighlighter
                                                                        language="typescript" // Generic highlighting usually works well
                                                                        style={vscDarkPlus}
                                                                        customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                                                    >
                                                                        {symbol.signature}
                                                                    </SyntaxHighlighter>
                                                                </div>

                                                                {/* Documentation */}
                                                                {symbol.description && (
                                                                    <div className="prose dark:prose-invert prose-sm text-gray-600 dark:text-gray-400 max-w-none bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border-l-4 border-blue-400">
                                                                        <div className="flex items-start gap-2">
                                                                            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                                                            <div className="whitespace-pre-line">{symbol.description}</div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Children (Properties/Methods) */}
                                                                {symbol.children && symbol.children.length > 0 && (
                                                                    <div className="mt-4 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
                                                                        <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-2 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                                            {t('developerGuide.members')}
                                                                        </div>
                                                                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                                                            {symbol.children.map(child => (
                                                                                <div key={child.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                                                    <div className="flex items-baseline gap-2 mb-1">
                                                                                        <span className={clsx(
                                                                                            "text-xs px-1.5 py-0.5 rounded border font-mono",
                                                                                            child.type === 'function' ? "border-purple-200 text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800" : "border-green-200 text-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-800"
                                                                                        )}>
                                                                                            {child.type === 'function' ? 'M' : 'P'}
                                                                                        </span>
                                                                                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{child.name}</span>
                                                                                    </div>
                                                                                    <div className="font-mono text-xs text-gray-500 dark:text-gray-400 pl-7">
                                                                                        {child.signature}
                                                                                    </div>
                                                                                    {child.description && (
                                                                                        <div className="text-xs text-gray-500 mt-1 pl-7 italic">
                                                                                            {child.description}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                                    <Book size={48} className="opacity-20" />
                                    <p>{t('developerGuide.selectFile')}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
