
import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css/github-markdown.css';
import {
    FileCode, Copy, Check, Download, Trash2, Bold, Italic, Strikethrough,
    Heading, List, ListOrdered, CheckSquare, Quote, Code, Link as LinkIcon,
    Image as ImageIcon, Table, Minus, Type, Settings, AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { saveAs } from 'file-saver';

type Theme = {
    name: string;
    bg: string;
    color: string;
    borderColor: string;
    codeBg: string;
    codeColor?: string;
};

const THEMES: Record<string, Theme> = {
    github: {
        name: 'GitHub',
        bg: '#ffffff',
        color: '#24292f',
        borderColor: '#d0d7de',
        codeBg: '#f6f8fa'
    },
    dracula: {
        name: 'Dracula',
        bg: '#282a36',
        color: '#f8f8f2',
        borderColor: '#44475a',
        codeBg: '#44475a',
        codeColor: '#50fa7b'
    },
    solarized: {
        name: 'Solarized Light',
        bg: '#fdf6e3',
        color: '#657b83',
        borderColor: '#93a1a1',
        codeBg: '#eee8d5'
    },
    nordic: {
        name: 'Nordic',
        bg: '#2e3440',
        color: '#d8dee9',
        borderColor: '#4c566a',
        codeBg: '#3b4252'
    }
};

export function MarkdownEditor() {
    const { t } = useTranslation();
    const [markdown, setMarkdown] = useState<string>('# Hello Markdown\n\nStart typing...');
    const [copied, setCopied] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<string>('github');
    const [showSettings, setShowSettings] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, 'document.md');
    };

    const handleClear = () => {
        setShowClearConfirm(true);
    };

    const confirmClear = () => {
        setMarkdown('');
        setShowClearConfirm(false);
    };

    const insertText = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousText = textarea.value;
        const selectedText = previousText.substring(start, end);

        const newText = previousText.substring(0, start) +
            before + selectedText + after +
            previousText.substring(end);

        setMarkdown(newText);

        // Restore focus and update cursor selection properly
        requestAnimationFrame(() => {
            textarea.focus();
            // If wrapping text, select the wrapped content
            if (selectedText.length > 0) {
                textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
            } else {
                // Move cursor inside the tags if nothing was selected
                textarea.setSelectionRange(start + before.length, start + before.length);
            }
        });
    };

    // ...

    return (
        <div className="h-full flex flex-col p-6 max-w-[1600px] mx-auto w-full gap-6 relative">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <FileCode size={24} />
                    </div>
                    {t('markdownEditor.title', 'Markdown Editor')}
                </h1>

                <div className="flex items-center gap-2 relative">
                    <button
                        onClick={handleClear}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title={t('common.clear', 'Clear')}
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title={t('common.copy', 'Copy')}
                    >
                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title={t('common.download', 'Download')}
                    >
                        <Download size={20} />
                    </button>

                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={clsx(
                            "p-2 rounded-lg transition-colors",
                            showSettings
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                        title={t('common.settings', 'Settings')}
                    >
                        <Settings size={20} />
                    </button>

                    {showSettings && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Theme
                                </span>
                            </div>
                            <div className="p-1">
                                {Object.entries(THEMES).map(([key, theme]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setCurrentTheme(key);
                                            setShowSettings(false);
                                        }}
                                        className={clsx(
                                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                                            currentTheme === key
                                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {theme.name}
                                        {currentTheme === key && <Check size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                {/* Editor */}
                <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex-wrap">
                        <ToolbarButton title="Bold" icon={<Bold size={16} />} onClick={() => insertText('**', '**')} />
                        <ToolbarButton title="Italic" icon={<Italic size={16} />} onClick={() => insertText('*', '*')} />
                        <ToolbarButton title="Strikethrough" icon={<Strikethrough size={16} />} onClick={() => insertText('~~', '~~')} />
                        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <ToolbarButton title="Heading 1" icon={<Heading size={16} />} onClick={() => insertText('# ', '')} />
                        <ToolbarButton title="Heading 2" icon={<Type size={16} />} onClick={() => insertText('## ', '')} />
                        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <ToolbarButton title="Unordered List" icon={<List size={16} />} onClick={() => insertText('- ', '')} />
                        <ToolbarButton title="Ordered List" icon={<ListOrdered size={16} />} onClick={() => insertText('1. ', '')} />
                        <ToolbarButton title="Checklist" icon={<CheckSquare size={16} />} onClick={() => insertText('- [ ] ', '')} />
                        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <ToolbarButton title="Blockquote" icon={<Quote size={16} />} onClick={() => insertText('> ', '')} />
                        <ToolbarButton title="Code Block" icon={<Code size={16} />} onClick={() => insertText('```\n', '\n```')} />
                        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <ToolbarButton title="Link" icon={<LinkIcon size={16} />} onClick={() => insertText('[', '](url)')} />
                        <ToolbarButton title="Image" icon={<ImageIcon size={16} />} onClick={() => insertText('![alt](', ')')} />
                        <ToolbarButton title="Table" icon={<Table size={16} />} onClick={() => insertText('| Header | Header |\n| --- | --- |\n| Cell | Cell |', '')} />
                        <ToolbarButton title="Horizontal Rule" icon={<Minus size={16} />} onClick={() => insertText('\n---\n', '')} />
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        className="flex-1 w-full p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                        placeholder={t('markdownEditor.placeholder', 'Type markdown here...')}
                        spellCheck={false}
                    />
                </div>

                {/* Preview */}
                <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                    style={{
                        backgroundColor: THEMES[currentTheme].bg,
                        borderColor: THEMES[currentTheme].borderColor
                    }}
                >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50"
                        style={{
                            backgroundColor: currentTheme === 'github' ? undefined : THEMES[currentTheme].codeBg,
                            borderColor: currentTheme === 'github' ? undefined : THEMES[currentTheme].borderColor
                        }}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            style={{ color: currentTheme === 'github' ? undefined : THEMES[currentTheme].color }}
                        >
                            {t('markdownEditor.preview', 'Preview')}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 transition-colors duration-200"
                        style={{
                            backgroundColor: THEMES[currentTheme].bg,
                            color: THEMES[currentTheme].color
                        }}
                    >
                        <div className="markdown-body transition-colors duration-200"
                            style={{
                                backgroundColor: 'transparent',
                                color: THEMES[currentTheme].color,
                                '--color-fg-default': THEMES[currentTheme].color,
                                '--color-canvas-default': 'transparent',
                                '--color-canvas-subtle': THEMES[currentTheme].codeBg,
                                '--color-border-default': THEMES[currentTheme].borderColor,
                                '--color-border-muted': THEMES[currentTheme].borderColor,
                                fontFamily: 'inherit'
                            } as React.CSSProperties}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                {...props}
                                                children={String(children).replace(/\n$/, '')}
                                                style={vscDarkPlus} // Always use dark theme for code blocks for better contrast or switch based on theme
                                                language={match[1]}
                                                PreTag="div"
                                            />
                                        ) : (
                                            <code {...props} className={className}>
                                                {children}
                                            </code>
                                        )
                                    }
                                }}
                            >
                                {markdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Confirmation Dialog */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full border border-gray-200 dark:border-gray-700 p-6 transform transition-all scale-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {t('common.clear', 'Clear')}?
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('common.confirmClear', 'Are you sure you want to clear?')}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                {t('common.cancel', 'Cancel')}
                            </button>
                            <button
                                onClick={confirmClear}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                {t('common.confirm', 'Confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ToolbarButton({ icon, onClick, title }: { icon: React.ReactNode, onClick: () => void, title: string }) {
    return (
        <button
            onClick={onClick}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={title}
        >
            {icon}
        </button>
    );
}
