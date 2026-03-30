import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';
import * as Diff from 'diff';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileDiff, FolderArchive, RefreshCw, Layers, Check, X, File as FileIcon, Download, ArrowRight, ChevronDown, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { DonutChart } from './DonutChart';
import { createArchive, IArchive, ArchiveEntry } from '../utils/ArchiveHandler';

type FileType = 'file' | 'zip' | 'rar' | 'unknown';
type SourceData = {
    file: File;
    type: FileType;
    content?: string; // For text files
    archive?: IArchive; // For zips/rars
};

type ZipEntryDiff = {
    path: string;
    status: 'added' | 'deleted' | 'modified' | 'identical';
    sizeA?: number;
    sizeB?: number;
    entryA?: ArchiveEntry;
    entryB?: ArchiveEntry;
};

export const SourceComparator: React.FC = () => {
    const { t } = useTranslation();
    const [sourceA, setSourceA] = useState<SourceData | null>(null);
    const [sourceB, setSourceB] = useState<SourceData | null>(null);
    const [isComparing, setIsComparing] = useState(false);
    const [diffResult, setDiffResult] = useState<Diff.Change[] | null>(null);
    const [zipDiffs, setZipDiffs] = useState<ZipEntryDiff[] | null>(null);
    const [selectedZipFile, setSelectedZipFile] = useState<string | null>(null);
    const [zipFileContentDiff, setZipFileContentDiff] = useState<Diff.Change[] | null>(null);
    const [mergeSelections, setMergeSelections] = useState<Record<string, 'A' | 'B'>>({});
    const [searchQuery, setSearchQuery] = useState('');

    const detectType = (file: File): FileType => {
        const name = file.name.toLowerCase();
        if (name.endsWith('.zip')) return 'zip';
        if (name.endsWith('.rar')) return 'rar';
        if (file.type === 'application/zip') return 'zip';
        if (file.type === 'application/x-rar-compressed') return 'rar';
        return 'file';
    };

    const loadSource = async (file: File, isA: boolean) => {
        const type = detectType(file);
        const data: SourceData = { file, type };

        if (type === 'file') {
            const text = await file.text();
            data.content = text;
        } else if (type === 'zip' || type === 'rar') {
            try {
                data.archive = await createArchive(file);
            } catch (error) {
                console.error("Failed to load archive", error);
                alert("Failed to load archive: " + (error as Error).message);
                return;
            }
        }

        if (isA) setSourceA(data);
        else setSourceB(data);

        // Reset results on new load
        setDiffResult(null);
        setZipDiffs(null);
        setSelectedZipFile(null);
        setZipFileContentDiff(null);
        setMergeSelections({});
    };

    const handleCompare = async () => {
        if (!sourceA || !sourceB) return;
        setIsComparing(true);

        try {
            if (sourceA.type === 'file' && sourceB.type === 'file') {
                const diff = Diff.diffLines(sourceA.content || '', sourceB.content || '');
                setDiffResult(diff);
            } else if ((sourceA.type === 'zip' || sourceA.type === 'rar') && (sourceB.type === 'zip' || sourceB.type === 'rar')) {
                await compareArchives();
            } else {
                alert('Please compare two files or two archives.');
            }
        } finally {
            setIsComparing(false);
        }
    };

    const compareArchives = async () => {
        if (!sourceA?.archive || !sourceB?.archive) return;

        const filesA = sourceA.archive.files;
        const filesB = sourceB.archive.files;
        const allPaths = new Set([...Object.keys(filesA), ...Object.keys(filesB)]);
        const diffs: ZipEntryDiff[] = [];

        for (const path of allPaths) {
            const entryA = filesA[path];
            const entryB = filesB[path];

            if (entryA && !entryB) {
                diffs.push({ path, status: 'deleted', sizeA: entryA.size, entryA });
            } else if (!entryA && entryB) {
                diffs.push({ path, status: 'added', sizeB: entryB.size, entryB });
            } else {
                const isDir = entryA.isDir;
                if (isDir) {
                    diffs.push({ path, status: 'identical', entryA, entryB });
                    continue;
                }

                const contentA = await entryA.readString();
                const contentB = await entryB.readString();

                if (contentA !== contentB) {
                    diffs.push({
                        path,
                        status: 'modified',
                        sizeA: entryA.size,
                        sizeB: entryB.size,
                        entryA,
                        entryB
                    });
                } else {
                    diffs.push({
                        path,
                        status: 'identical',
                        sizeA: entryA.size,
                        sizeB: entryB.size,
                        entryA,
                        entryB
                    });
                }
            }
        }

        diffs.sort((a, b) => {
            const order = { modified: 0, added: 1, deleted: 2, identical: 3 };
            return order[a.status] - order[b.status] || a.path.localeCompare(b.path);
        });

        const initialSelections: Record<string, 'A' | 'B'> = {};
        diffs.forEach(d => {
            if (d.status === 'modified') initialSelections[d.path] = 'B';
        });
        setZipDiffs(diffs);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const downloadStats = React.useMemo(() => {
        if (!zipDiffs) return { merge: { count: 0, size: 0 }, modified: { count: 0, size: 0 }, identical: { count: 0, size: 0 } };

        let mergeSize = 0;
        let modifiedSize = 0;
        let identicalSize = 0;

        zipDiffs.forEach(d => {
            // Identical
            if (d.status === 'identical') {
                identicalSize += d.sizeA || 0;
            }

            // Modified (Diff Only) - typically includes Modified (B) and Added (B)
            if (d.status === 'modified') {
                modifiedSize += d.sizeB || 0;
            } else if (d.status === 'added') {
                modifiedSize += d.sizeB || 0;
            }

            // Merge
            if (d.status === 'identical') {
                mergeSize += d.sizeA || 0;
            } else if (d.status === 'added') {
                mergeSize += d.sizeB || 0;
            } else if (d.status === 'modified') {
                // Check selection
                const choice = mergeSelections[d.path] || 'B';
                mergeSize += (choice === 'A' ? d.sizeA : d.sizeB) || 0;
            }
        });

        return {
            merge: {
                count: zipDiffs.filter(d => d.status !== 'deleted').length,
                size: mergeSize
            },
            modified: {
                count: zipDiffs.filter(d => d.status === 'modified' || d.status === 'added').length,
                size: modifiedSize
            },
            identical: {
                count: zipDiffs.filter(d => d.status === 'identical').length,
                size: identicalSize
            }
        };
    }, [zipDiffs, mergeSelections]);

    const handleMergeDownload = async (mode: 'merge' | 'modified' | 'identical' = 'merge') => {
        if (!sourceA?.archive || !sourceB?.archive || !zipDiffs) return;
        const newZip = new JSZip();

        for (const diff of zipDiffs) {
            // Logic based on mode
            if (mode === 'identical') {
                if (diff.status === 'identical') {
                    const content = await diff.entryA!.readBlob();
                    newZip.file(diff.path, content);
                }
            } else if (mode === 'modified') {
                if (diff.status === 'modified') {
                    const content = await diff.entryB!.readBlob();
                    newZip.file(diff.path, content);
                } else if (diff.status === 'added') {
                    const content = await diff.entryB!.readBlob();
                    newZip.file(diff.path, content);
                }
            } else {
                // Merge Mode (default)
                if (diff.status === 'identical') {
                    const content = await diff.entryA!.readBlob();
                    newZip.file(diff.path, content);
                } else if (diff.status === 'added') {
                    const content = await diff.entryB!.readBlob();
                    newZip.file(diff.path, content);
                } else if (diff.status === 'modified') {
                    const choice = mergeSelections[diff.path] || 'B';
                    const entry = choice === 'A' ? diff.entryA! : diff.entryB!;
                    const content = await entry.readBlob();
                    newZip.file(diff.path, content);
                }
            }
        }

        const filename = mode === 'identical' ? 'identical_files.zip' : mode === 'modified' ? 'modified_files.zip' : 'merged_source.zip';
        const content = await newZip.generateAsync({ type: 'blob' });
        saveAs(content, filename);
    };

    const toggleSelection = (path: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setMergeSelections(prev => ({
            ...prev,
            [path]: prev[path] === 'A' ? 'B' : 'A'
        }));
    };

    const handleZipFileClick = async (diff: ZipEntryDiff) => {
        if (diff.status === 'modified' && diff.entryA && diff.entryB) {
            setSelectedZipFile(diff.path);
            const contentA = await diff.entryA.readString();
            const contentB = await diff.entryB.readString();
            setZipFileContentDiff(Diff.diffLines(contentA, contentB));
        }
    };

    const handleDrop = (src: 'A' | 'B') => (files: File[]) => {
        if (files[0]) loadSource(files[0], src === 'A');
    };

    const renderDiffView = (diff: Diff.Change[]) => {
        // Expand diff into individual lines with metadata
        interface LineInfo {
            text: string;
            type: 'added' | 'removed' | 'context';
            lineA: number | null;
            lineB: number | null;
        }

        const lines: LineInfo[] = [];
        let lineA = 1;
        let lineB = 1;

        diff.forEach(part => {
            const partLines = part.value.split('\n');
            // Remove trailing empty string from split
            if (partLines[partLines.length - 1] === '') partLines.pop();

            partLines.forEach(text => {
                if (part.added) {
                    lines.push({ text, type: 'added', lineA: null, lineB: lineB++ });
                } else if (part.removed) {
                    lines.push({ text, type: 'removed', lineA: lineA++, lineB: null });
                } else {
                    lines.push({ text, type: 'context', lineA: lineA++, lineB: lineB++ });
                }
            });
        });

        const CONTEXT = 3;
        const changedIndices = new Set(
            lines.map((l, i) => l.type !== 'context' ? i : -1).filter(i => i !== -1)
        );

        // Build visible ranges: changed lines ± CONTEXT
        const visible = new Set<number>();
        changedIndices.forEach(idx => {
            for (let i = Math.max(0, idx - CONTEXT); i <= Math.min(lines.length - 1, idx + CONTEXT); i++) {
                visible.add(i);
            }
        });

        if (visible.size === 0) {
            return (
                <div className="font-mono text-xs bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 text-center text-gray-400">
                    Files are identical — no changes found.
                </div>
            );
        }

        // Render rows, inserting collapse indicators between gaps
        const rows: React.ReactNode[] = [];
        let prevIdx = -1;

        Array.from(visible).sort((a, b) => a - b).forEach((idx) => {
            if (prevIdx !== -1 && idx > prevIdx + 1) {
                const skipped = idx - prevIdx - 1;
                rows.push(
                    <tr key={`skip-${idx}`} className="bg-gray-50 dark:bg-gray-900/50">
                        <td className="py-1 px-2 text-gray-400 text-right text-[11px] select-none w-12 border-r border-gray-100 dark:border-gray-700">···</td>
                        <td className="py-1 px-2 text-gray-400 text-right text-[11px] select-none w-12 border-r border-gray-200 dark:border-gray-600">···</td>
                        <td className="py-1 pl-4 text-[11px] text-gray-400 italic">{skipped} unchanged line{skipped > 1 ? 's' : ''}</td>
                    </tr>
                );
            }

            const line = lines[idx];
            rows.push(
                <tr key={idx} className={clsx(
                    line.type === 'added' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                        line.type === 'removed' ? 'bg-rose-50 dark:bg-rose-900/20' : ''
                )}>
                    <td className="py-0.5 px-2 text-[11px] text-gray-400 dark:text-gray-600 select-none text-right w-12 border-r border-gray-100 dark:border-gray-700 font-mono">
                        {line.lineA ?? ''}
                    </td>
                    <td className="py-0.5 px-2 text-[11px] text-gray-400 dark:text-gray-600 select-none text-right w-12 border-r border-gray-200 dark:border-gray-600 font-mono">
                        {line.lineB ?? ''}
                    </td>
                    <td className={clsx(
                        'py-0.5 pl-2 pr-4 font-mono text-xs whitespace-pre-wrap break-all',
                        line.type === 'added' ? 'text-emerald-700 dark:text-emerald-300' :
                            line.type === 'removed' ? 'text-rose-700 dark:text-rose-300' :
                                'text-gray-600 dark:text-gray-400'
                    )}>
                        <span className={clsx(
                            'mr-2 select-none font-bold',
                            line.type === 'added' ? 'text-emerald-500' :
                                line.type === 'removed' ? 'text-rose-500' : 'text-transparent'
                        )}>
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
                        </span>
                        {line.text}
                    </td>
                </tr>
            );

            prevIdx = idx;
        });

        const addedCount = lines.filter(l => l.type === 'added').length;
        const removedCount = lines.filter(l => l.type === 'removed').length;

        return (
            <div className="font-mono text-xs bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs">
                    <span className="text-emerald-600 font-semibold">+{addedCount} additions</span>
                    <span className="text-rose-600 font-semibold">−{removedCount} deletions</span>
                    <span className="ml-auto text-gray-400">{changedIndices.size} changed line{changedIndices.size !== 1 ? 's' : ''}</span>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full border-collapse">
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            </div>
        );
    };



    const filteredZipDiffs = React.useMemo(() => {
        if (!zipDiffs) return null;
        if (!searchQuery) return zipDiffs;
        return zipDiffs.filter(d => d.path.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [zipDiffs, searchQuery]);

    const renderZipDiffs = () => {
        if (!zipDiffs) return null;

        const stats = {
            modified: zipDiffs.filter(d => d.status === 'modified').length,
            added: zipDiffs.filter(d => d.status === 'added').length,
            deleted: zipDiffs.filter(d => d.status === 'deleted').length,
            identical: zipDiffs.filter(d => d.status === 'identical').length
        };
        const total = zipDiffs.length;

        return (
            <div className="flex flex-col gap-6 flex-1 min-h-0">
                {/* Stats Chart */}
                <div className="h-32 shrink-0">
                    <DonutChart
                        items={[
                            { id: 'modified', value: stats.modified, color: 'text-yellow-500', bg: 'bg-yellow-500', icon: RefreshCw, label: t('sourceCompare.modifiedCount') },
                            { id: 'added', value: stats.added, color: 'text-green-500', bg: 'bg-green-500', icon: Layers, label: t('sourceCompare.addedCount') },
                            { id: 'deleted', value: stats.deleted, color: 'text-red-500', bg: 'bg-red-500', icon: X, label: t('sourceCompare.deletedCount') },
                            { id: 'identical', value: stats.identical, color: 'text-gray-300 dark:text-gray-600', bg: 'bg-gray-300 dark:bg-gray-600', icon: Check, label: t('sourceCompare.identicalCount') },
                        ]}
                        total={total}
                        centerSubLabel={t('sourceCompare.files')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* File List */}
                    <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[600px]">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-medium text-sm flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span>{t('sourceCompare.files')}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs">{t('sourceCompare.totalFiles')}: {total}</span>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder={t('sourceCompare.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {filteredZipDiffs?.map((d) => (
                                <div
                                    key={d.path}
                                    onClick={() => handleZipFileClick(d)}
                                    className={clsx(
                                        "flex items-center gap-2 p-2 rounded cursor-pointer text-sm transition-colors",
                                        selectedZipFile === d.path ? "bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500" : "hover:bg-gray-50 dark:hover:bg-gray-700",
                                        d.status === 'modified' ? "text-yellow-600 dark:text-yellow-400" :
                                            d.status === 'added' ? "text-green-600 dark:text-green-400" :
                                                d.status === 'deleted' ? "text-red-600 dark:text-red-400" :
                                                    "text-gray-400 dark:text-gray-500"
                                    )}
                                >
                                    {d.status === 'modified' ? <RefreshCw size={14} /> :
                                        d.status === 'added' ? <Layers size={14} /> :
                                            d.status === 'deleted' ? <X size={14} /> :
                                                <Check size={14} />}
                                    <span className="truncate flex-1">{d.path}</span>
                                    {d.status === 'modified' && (
                                        <button
                                            onClick={(e) => toggleSelection(d.path, e)}
                                            className={clsx(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors",
                                                (mergeSelections[d.path] || 'B') === 'A'
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                            )}
                                            title="Click to toggle version (A/B)"
                                        >
                                            {(mergeSelections[d.path] || 'B') === 'A' ? 'A' : 'B'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Diff Viewer */}
                    <div className="col-span-1 md:col-span-2 flex flex-col h-full gap-4 max-h-[600px]">
                        {selectedZipFile && zipFileContentDiff ? (
                            <>
                                <div className="p-2 font-medium text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded">
                                    <span>{selectedZipFile}</span>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-green-600">A: {(zipDiffs.find(d => d.path === selectedZipFile)?.sizeA || 0).toLocaleString()} B</span>
                                        <ArrowRight size={12} className="text-gray-400" />
                                        <span className="text-blue-600">B: {(zipDiffs.find(d => d.path === selectedZipFile)?.sizeB || 0).toLocaleString()} B</span>
                                    </div>
                                </div>
                                {renderDiffView(zipFileContentDiff)}
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                Select a modified file to view changes
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 h-full p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('sourceCompare.sourceA')}</label>
                    <DropZone
                        onFilesDropped={handleDrop('A')}
                        multiple={false}
                        accept="*"
                        validator={() => true}
                        dragDropText="Drag & drop zip file or file here"
                        supportedText={t('sourceCompare.supports')}
                        className={clsx("min-h-[200px]", sourceA ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "")}
                    />
                    {sourceA && (
                        <div className="text-xs text-green-600 flex items-center gap-1">
                            {sourceA.type === 'zip' ? <FolderArchive size={12} /> : <FileIcon size={12} />}
                            {sourceA.file.name} ({formatBytes(sourceA.file.size)})
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('sourceCompare.sourceB')}</label>
                    <DropZone
                        onFilesDropped={handleDrop('B')}
                        multiple={false}
                        accept="*"
                        validator={() => true}
                        dragDropText="Drag & drop zip file or file here"
                        supportedText={t('sourceCompare.supports')}
                        className={clsx("min-h-[200px]", sourceB ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : "")}
                    />
                    {sourceB && (
                        <div className="text-xs text-blue-600 flex items-center gap-1">
                            {sourceB.type === 'zip' ? <FolderArchive size={12} /> : <FileIcon size={12} />}
                            {sourceB.file.name} ({formatBytes(sourceB.file.size)})
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={handleCompare}
                    disabled={!sourceA || !sourceB || isComparing}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isComparing ? <RefreshCw className="animate-spin" size={18} /> : <FileDiff size={18} />}
                    {t('sourceCompare.compare')}
                </button>

                {zipDiffs && (
                    <div className="relative group">
                        <button
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                            <Download size={18} />
                            {t('sourceCompare.merge')}
                            <ChevronDown size={14} className="ml-1 opacity-80" />
                        </button>

                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10 hidden group-hover:block animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={() => handleMergeDownload('merge')} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between font-medium">
                                    <span>{t('sourceCompare.downloadMerge')}</span>
                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900/40 dark:text-blue-300">
                                        {t('sourceCompare.filesData', { count: downloadStats.merge.count })} ({formatBytes(downloadStats.merge.size)})
                                    </span>
                                </div>
                                <span className="block text-xs text-gray-400 mt-1">{t('sourceCompare.downloadMergeDesc')}</span>
                            </button>
                            <button onClick={() => handleMergeDownload('modified')} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between font-medium">
                                    <span>{t('sourceCompare.downloadDiff')}</span>
                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full dark:bg-yellow-900/40 dark:text-yellow-300">
                                        {t('sourceCompare.filesData', { count: downloadStats.modified.count })} ({formatBytes(downloadStats.modified.size)})
                                    </span>
                                </div>
                                <span className="block text-xs text-gray-400 mt-1">{t('sourceCompare.downloadDiffDesc')}</span>
                            </button>
                            <button onClick={() => handleMergeDownload('identical')} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                                <div className="flex justify-between font-medium">
                                    <span>{t('sourceCompare.downloadIdentical')}</span>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full dark:bg-green-900/40 dark:text-green-300">
                                        {t('sourceCompare.filesData', { count: downloadStats.identical.count })} ({formatBytes(downloadStats.identical.size)})
                                    </span>
                                </div>
                                <span className="block text-xs text-gray-400 mt-1">{t('sourceCompare.downloadIdenticalDesc')}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {diffResult && !zipDiffs && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('sourceCompare.comparisonResult')}</h3>
                        <div className="text-sm text-gray-500">
                            {t('sourceCompare.sizeDiff')}: <span className={clsx(
                                (sourceB!.file.size - sourceA!.file.size) > 0 ? "text-red-500" : "text-green-500"
                            )}>
                                {(sourceB!.file.size - sourceA!.file.size) > 0 ? "+" : "-"}
                                {formatBytes(Math.abs(sourceB!.file.size - sourceA!.file.size))}
                            </span>
                        </div>
                    </div>
                    {renderDiffView(diffResult)}
                </div>
            )}

            {zipDiffs && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('sourceCompare.archiveContentComparison')}</h3>
                    {renderZipDiffs()}
                </div>
            )}
        </div>
    );
};
