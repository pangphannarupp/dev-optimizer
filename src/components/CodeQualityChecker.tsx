import React, { useState, useCallback, useMemo, useDeferredValue } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, FileCode, Filter, Loader, Search, X, XCircle, Eye, Download, Trash2, Info, Copy, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import JSZip from 'jszip';
import { analyzeCode, SupportedLanguage, QualityIssue, Severity, ProjectFile, detectLanguage } from '../utils/codeQualityRules';
import { DropZone } from './DropZone';
import { DonutChart } from './DonutChart';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const CodeQualityChecker: React.FC = () => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'manual' | 'project'>('manual');
    const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
    const [selectedFileForModal, setSelectedFileForModal] = useState<ProjectFile | null>(null);

    // Filter/Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'warning' | 'error'>('all');

    // Manual Mode State
    const [manualCode, setManualCode] = useState('');
    const [manualLanguage, setManualLanguage] = useState<SupportedLanguage>('react-ts');
    const [manualIssues, setManualIssues] = useState<QualityIssue[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Progress State
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState('');

    // Derived Data for Dashboard
    const dashboardStats = useMemo(() => {
        const totalFiles = projectFiles.length;
        const errorFiles = projectFiles.filter(f => f.issues.some(i => i.severity === 'error')).length;
        const warningFiles = projectFiles.filter(f => f.issues.some(i => i.severity === 'warning') && !f.issues.some(i => i.severity === 'error')).length;
        const passedFiles = totalFiles - errorFiles - warningFiles;
        const totalIssues = projectFiles.reduce((acc, curr) => acc + curr.issues.length, 0);
        return { totalFiles, errorFiles, warningFiles, passedFiles, totalIssues };
    }, [projectFiles]);

    const filteredFiles = useMemo(() => {
        return projectFiles.filter(file => {
            const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());

            const hasError = file.issues.some(i => i.severity === 'error');
            const hasWarning = file.issues.some(i => i.severity === 'warning');

            // Determine status strictly
            let status: 'passed' | 'warning' | 'error' = 'passed';
            if (hasError) status = 'error';
            else if (hasWarning) status = 'warning';

            if (filterStatus !== 'all' && filterStatus !== status) return false;

            return matchesSearch;
        }).sort((a, b) => {
            // Sort priority: Error > Warning > Passed
            const getScore = (f: ProjectFile) => {
                if (f.issues.some(i => i.severity === 'error')) return 3;
                if (f.issues.some(i => i.severity === 'warning')) return 2;
                return 1;
            };
            return getScore(b) - getScore(a);
        });
    }, [projectFiles, searchTerm, filterStatus]);

    // Defer the modal file content to optimize open performance
    const deferredSelectedFile = useDeferredValue(selectedFileForModal);

    const handleManualAnalyze = () => {
        if (!manualCode.trim()) return;
        setIsAnalyzing(true);
        // Small timeout to allow UI to update
        setTimeout(() => {
            const results = analyzeCode(manualCode, manualLanguage);
            setManualIssues(results);
            setIsAnalyzing(false);
        }, 100);
    };

    const handleClear = () => {
        setManualCode('');
        setManualIssues([]);
        setProjectFiles([]);
        setSelectedFileForModal(null);
        setProgress(0);
        setCurrentFile('');
    };

    const handleZipUpload = useCallback(async (files: File[]) => {
        const zipFile = files[0];
        if (!zipFile) return;

        setIsAnalyzing(true);
        setProgress(0);
        setCurrentFile('');

        try {
            const zip = await JSZip.loadAsync(zipFile);
            const extractedFiles: ProjectFile[] = [];

            // Get all valid entries first to calculate total
            const entries = Object.keys(zip.files).filter(filename => {
                return !zip.files[filename].dir &&
                    !filename.includes('__MACOSX') &&
                    !filename.startsWith('.');
            });

            const totalFiles = entries.length;
            let processedCount = 0;

            for (const filename of entries) {
                // Update progress UI
                setCurrentFile(filename);
                // Allow a small delay for UI to render the state change appropriately
                await new Promise(resolve => setTimeout(resolve, 0));

                const content = await zip.files[filename].async('string');
                const detectedLang = detectLanguage(filename, content);

                if (detectedLang) {
                    const fileIssues = analyzeCode(content, detectedLang);
                    extractedFiles.push({
                        name: filename,
                        content,
                        language: detectedLang,
                        issues: fileIssues
                    });
                }

                processedCount++;
                setProgress(Math.round((processedCount / totalFiles) * 100));
            }

            setProjectFiles(extractedFiles);
            setViewMode('project');
        } catch (error) {
            console.error("Failed to unzip", error);
        } finally {
            setIsAnalyzing(false);
            setProgress(0);
            setCurrentFile('');
        }
    }, []);

    const handleCopyReport = (fileIssues: QualityIssue[]) => {
        if (fileIssues.length === 0) return;
        const report = fileIssues.map(issue =>
            `[${issue.severity.toUpperCase()}] Line ${issue.line}: ${issue.message}\nSuggestion: ${issue.suggestion || 'None'}`
        ).join('\n\n');
        navigator.clipboard.writeText(report);
    };

    const handleExportCSV = () => {
        if (projectFiles.length === 0) return;

        // CSV Header with BOM for Excel support
        let csvContent = "\uFEFFdata:text/csv;charset=utf-8,File,Language,Line,Severity,Message,Suggestion\n";

        // CSV Rows
        projectFiles.forEach(file => {
            file.issues.forEach(issue => {
                const row = [
                    file.name,
                    file.language,
                    issue.line,
                    issue.severity.toUpperCase(),
                    `"${issue.message.replace(/"/g, '""')}"`, // Escape quotes
                    `"${(issue.suggestion || '').replace(/"/g, '""')}"`
                ].join(",");
                csvContent += row + "\n";
            });
        });

        // Use Blob to handle large files and avoid 431 Request Header Fields Too Large error
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "code_quality_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleIssueClick = (line: number) => {
        const element = document.getElementById(`line-${line}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a temporary highlight class
            element.classList.add('animate-pulse');
            setTimeout(() => {
                element.classList.remove('animate-pulse');
            }, 2000);
        }
    };

    const getSeverityIcon = (severity: Severity) => {
        switch (severity) {
            case 'error': return <XCircle className="text-red-500" size={16} />;
            case 'warning': return <AlertTriangle className="text-yellow-500" size={16} />;
            case 'info': return <Info className="text-blue-500" size={16} />;
        }
    };

    const getSeverityColor = (severity: Severity) => {
        switch (severity) {
            case 'error': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800';
            case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800';
            case 'info': return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800';
        }
    };

    const renderIssuesList = (issueList: QualityIssue[]) => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                    {t('codeQuality.issuesFound', { count: issueList.length })}
                </h3>
                <button
                    onClick={() => handleCopyReport(issueList)}
                    className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                    <Copy size={12} />
                    {t('codeQuality.copyReport', 'Copy Report')}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {issueList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-green-600 dark:text-green-400 gap-3">
                        <CheckCircle size={32} />
                        <p className="font-medium text-sm">{t('codeQuality.noIssues', 'No issues found!')}</p>
                    </div>
                ) : (
                    issueList.map((issue, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleIssueClick(issue.line)}
                            className={clsx(
                                "p-3 rounded-lg border flex gap-3 transition-all hover:shadow-md cursor-pointer",
                                getSeverityColor(issue.severity)
                            )}
                        >
                            <div className="mt-0.5 shrink-0">
                                {getSeverityIcon(issue.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={clsx(
                                        "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                        issue.severity === 'error' ? "bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200" :
                                            issue.severity === 'warning' ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200" :
                                                "bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200"
                                    )}>
                                        {t(`codeQuality.severity.${issue.severity}`, issue.severity)}
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono">
                                        Line {issue.line}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">
                                    {t(`codeQuality.rules.${issue.ruleId}.message`, issue.message)}
                                </div>
                                {issue.suggestion && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                                        {t('codeQuality.suggestion', 'Suggestion')}: {t(`codeQuality.rules.${issue.ruleId}.suggestion`, issue.suggestion)}
                                    </div>
                                )}
                                {issue.url && (
                                    <a
                                        href={issue.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1 w-fit"
                                    >
                                        <Info size={12} />
                                        Learn more via Documentation
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
    const getPrismLanguage = (lang: SupportedLanguage) => {
        switch (lang) {
            case 'react-ts':
            case 'react-native':
                return 'tsx';
            case 'vue-ts':
                return 'typescript';
            case 'flutter-dart':
                return 'dart';
            case 'android-kotlin':
                return 'kotlin';
            case 'android-java':
                return 'java';
            case 'ios-swift':
                return 'swift';
            case 'ios-objc':
                return 'objectivec';
            default:
                return 'typescript';
        }
    };

    return (
        <div className="flex flex-col h-full gap-4 p-4 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 relative">
            {/* Loading Overlay */}
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6"
                    >
                        <div className="relative">
                            <svg className="w-24 h-24 transform -rotate-90">
                                <circle
                                    className="text-gray-200 dark:text-gray-700"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="48"
                                    cy="48"
                                />
                                <circle
                                    className="text-blue-600 transition-all duration-300 ease-linear"
                                    strokeWidth="8"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="48"
                                    cy="48"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">{progress}%</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 max-w-sm text-center">
                            <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                {t('codeQuality.analyzing', 'Analyzing codebase...')}
                            </p>
                            {currentFile && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono animate-pulse truncate w-full px-4">
                                    {currentFile}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col h-full gap-6 p-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
                {/* Header */}
                <div className="flex justify-between items-center shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            {t('codeQuality.title', 'Code Quality Checker')}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('codeQuality.description', 'Analyze your code for quality, security, and performance issues.')}
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('manual')}
                            className={clsx(
                                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                viewMode === 'manual'
                                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            {t('codeQuality.mode.manual', 'Manual Check')}
                        </button>
                        <button
                            onClick={() => setViewMode('project')}
                            className={clsx(
                                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                viewMode === 'project'
                                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            {t('codeQuality.mode.project', 'Project Scan')}
                        </button>
                    </div>
                </div>

                {viewMode === 'manual' ? (
                    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
                        {/* Manual Input Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(['react-ts', 'react-native', 'vue-ts', 'android-kotlin', 'android-java', 'ios-swift', 'ios-objc', 'flutter-dart'] as SupportedLanguage[]).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setManualLanguage(lang)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border",
                                            manualLanguage === lang
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {t(`codeQuality.tabs.${lang.replace('-', '_')}`, lang)}
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <textarea
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    placeholder={t('codeQuality.placeholder', 'Paste your code here...')}
                                    className="w-full h-64 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 font-mono text-sm text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                />
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        onClick={handleClear}
                                        className="px-4 py-2 mr-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 font-medium transition-colors"
                                        title={t('codeQuality.clear', 'Clear Code')}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        onClick={handleManualAnalyze}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg shadow-blue-500/20 font-medium transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {t('codeQuality.analyze', 'Analyze Code')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Manual Results */}
                        {manualIssues.length > 0 ? (
                            <div className="h-[400px]">
                                {renderIssuesList(manualIssues)}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-gray-400 dark:text-gray-500 gap-4">
                                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700/50">
                                    <CheckCircle size={48} className="opacity-50" />
                                </div>
                                <p className="text-sm font-medium">{t('codeQuality.description', 'Analyze code snippets for quality issues')}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 h-full">
                        {projectFiles.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                                <DropZone
                                    onFilesDropped={handleZipUpload}
                                    accept=".zip"
                                    multiple={false}
                                    dragDropText={t('codeQuality.dropZip', 'Drag & drop a ZIP file here')}
                                    supportedText={t('codeQuality.zipSupport', 'Supports .zip archives')}
                                    className="border-none bg-transparent hover:bg-transparent"
                                />
                            </div>
                        ) : (
                            <>
                                {/* Dashboard Stats */}
                                <div className="mb-4 shrink-0">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                                        <div className="w-full mb-4 flex items-center justify-between px-4">
                                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('codeQuality.dashboard.overview', 'Overview')}</h3>
                                            <div className="flex gap-4 text-xs font-medium">
                                                <span className="text-gray-500 dark:text-gray-400">Total: <span className="text-gray-900 dark:text-white font-bold">{dashboardStats.totalFiles}</span></span>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-center py-2">
                                            <DonutChart
                                                total={dashboardStats.totalFiles}
                                                items={[
                                                    { id: 'passed', value: dashboardStats.passedFiles, label: t('codeQuality.dashboard.passed', 'Passed'), color: 'text-green-500', bg: 'bg-green-500', icon: CheckCircle },
                                                    { id: 'warning', value: dashboardStats.warningFiles, label: t('codeQuality.dashboard.warning', 'Warning'), color: 'text-yellow-500', bg: 'bg-yellow-500', icon: AlertTriangle },
                                                    { id: 'error', value: dashboardStats.errorFiles, label: t('codeQuality.dashboard.error', 'Error'), color: 'text-red-500', bg: 'bg-red-500', icon: XCircle },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Filters & Table */}
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col min-h-0 flex-1 overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                                        <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                            {(['all', 'passed', 'warning', 'error'] as const).map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setFilterStatus(f)}
                                                    className={clsx(
                                                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize",
                                                        filterStatus === f
                                                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    )}
                                                >
                                                    {t(`codeQuality.dashboard.filter${f.charAt(0).toUpperCase() + f.slice(1)}`, f)}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder={t('codeQuality.dashboard.search', 'Search files...')}
                                                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleClear}
                                                className="p-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
                                                title={t('codeQuality.reupload', 'New Scan')}
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                            <button
                                                onClick={handleExportCSV}
                                                className="p-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
                                                title={t('codeQuality.exportCSV', 'Export to Excel')}
                                            >
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
                                                <tr>
                                                    <th className="p-3 pl-6 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('codeQuality.dashboard.columns.file', 'File')}</th>
                                                    <th className="p-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('codeQuality.dashboard.columns.language', 'Language')}</th>
                                                    <th className="p-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('codeQuality.dashboard.columns.issues', 'Issues')}</th>
                                                    <th className="p-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('codeQuality.dashboard.columns.status', 'Status')}</th>
                                                    <th className="p-3 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right pr-6">{t('codeQuality.dashboard.columns.actions', 'Actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {filteredFiles.map((file, idx) => {
                                                    const errorCount = file.issues.filter(i => i.severity === 'error').length;
                                                    const warningCount = file.issues.filter(i => i.severity === 'warning').length;
                                                    const totalIssues = file.issues.length;

                                                    const isError = errorCount > 0;
                                                    const isWarning = !isError && warningCount > 0;

                                                    return (
                                                        <tr
                                                            key={idx}
                                                            onClick={() => setSelectedFileForModal(file)}
                                                            className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                                                        >
                                                            <td className="p-3 pl-6">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={clsx("p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors shadow-sm")}>
                                                                        <FileCode size={14} />
                                                                    </div>
                                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate max-w-xs">{file.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-3">
                                                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                                    {t(`codeQuality.tabs.${file.language.replace('-', '_')}`, file.language)}
                                                                </span>
                                                            </td>
                                                            <td className="p-3">
                                                                {totalIssues > 0 ? (
                                                                    <div className="flex gap-1.5">
                                                                        {errorCount > 0 && (
                                                                            <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-[10px] font-bold text-red-600 dark:text-red-400 shadow-sm border border-red-200 dark:border-red-900/50">
                                                                                {errorCount}
                                                                            </span>
                                                                        )}
                                                                        {warningCount > 0 && (
                                                                            <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-[10px] font-bold text-yellow-600 dark:text-yellow-400 shadow-sm border border-yellow-200 dark:border-yellow-900/50">
                                                                                {warningCount}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-gray-400 italic">-</span>
                                                                )}
                                                            </td>
                                                            <td className="p-3">
                                                                {isError ? (
                                                                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                                        {t('codeQuality.dashboard.error', 'Error')}
                                                                    </div>
                                                                ) : isWarning ? (
                                                                    <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                                        {t('codeQuality.dashboard.warning', 'Warning')}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-medium">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                                        {t('codeQuality.dashboard.passed', 'Passed')}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="p-3 pr-6 text-right">
                                                                <button className="p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-none hover:shadow-sm ring-1 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700">
                                                                    <Eye size={14} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {filteredFiles.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <Filter size={32} className="opacity-20" />
                                                                <p>No files found matching your criteria.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedFileForModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 md:p-8"
                        onClick={() => setSelectedFileForModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                            className="bg-white dark:bg-gray-900 w-full max-w-7xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-20">
                                <div className="flex items-center gap-4">
                                    <div className={clsx("p-2.5 rounded-xl shadow-sm", selectedFileForModal.issues.some(i => i.severity === 'error') ? "bg-red-50 dark:bg-red-900/20 text-red-600" : selectedFileForModal.issues.length > 0 ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600" : "bg-green-50 dark:bg-green-900/20 text-green-600")}>
                                        <FileCode size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{selectedFileForModal.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                {t(`codeQuality.tabs.${selectedFileForModal.language.replace('-', '_')}`, selectedFileForModal.language)}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                                            {selectedFileForModal.issues.length > 0 ? (
                                                <span className={clsx("text-sm font-medium", selectedFileForModal.issues.some(i => i.severity === 'error') ? "text-red-500" : "text-yellow-500")}>
                                                    {selectedFileForModal.issues.length} Issues Found
                                                </span>
                                            ) : (
                                                <span className="text-sm font-medium text-green-500">Passed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedFileForModal(null)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-[#1e1e1e]">
                                {/* Code View - Deferred for Performance */}
                                <div className="flex-1 overflow-auto relative custom-scrollbar">
                                    {deferredSelectedFile ? (
                                        <SyntaxHighlighter
                                            language={getPrismLanguage(deferredSelectedFile.language)}
                                            style={vscDarkPlus}
                                            showLineNumbers={true}
                                            wrapLines={true}
                                            customStyle={{ margin: 0, padding: '1.5rem', height: '100%', fontSize: '14px', lineHeight: '1.5' }}
                                            lineProps={(lineNumber) => {
                                                const issue = deferredSelectedFile.issues.find(i => i.line === lineNumber);
                                                const style: React.CSSProperties = {};
                                                if (issue) {
                                                    const isError = issue.severity === 'error';
                                                    style.display = 'block';
                                                    style.backgroundColor = isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)';
                                                    style.borderLeft = `3px solid ${isError ? '#ef4444' : '#eab308'}`;
                                                    style.paddingLeft = '12px';
                                                    style.marginLeft = '-15px';
                                                    style.width = 'calc(100% + 15px)';
                                                }
                                                return {
                                                    id: `line-${lineNumber}`,
                                                    style
                                                };
                                            }}
                                        >
                                            {deferredSelectedFile.content}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            <Loader className="animate-spin mb-2" />
                                            Loading code...
                                        </div>
                                    )}
                                </div>

                                {/* Issues Sidebar */}
                                <div className="w-full lg:w-[400px] bg-white dark:bg-gray-900 flex flex-col min-h-0 border-l border-gray-200 dark:border-gray-700 shadow-xl z-10">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0">
                                        <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                            <AlertTriangle size={18} className="text-yellow-500" />
                                            Analysis Results
                                        </h4>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                        {renderIssuesList(selectedFileForModal.issues)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
