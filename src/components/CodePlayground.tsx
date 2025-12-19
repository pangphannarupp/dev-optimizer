
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Code, Smartphone, Globe, Monitor, Terminal, FileCode,
    Maximize2, Minimize2, RefreshCw, Layout
} from 'lucide-react';
import { clsx } from 'clsx';

type LanguageType = 'web' | 'android' | 'ios' | 'flutter' | 'java' | 'react' | 'vue' | 'c' | 'cpp' | 'python' | 'go' | 'rust' | 'csharp' | 'php' | 'ruby';

interface PlaygroundConfig {
    id: LanguageType;
    label: string;
    icon: React.ElementType;
    defaultCode?: string;
    embedUrl?: string;
    description: string;
}

const PLAYGROUNDS: PlaygroundConfig[] = [
    {
        id: 'web',
        label: 'HTML/JS/TS',
        icon: Globe,
        description: 'Web Development (UI Supported)',
        defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: sans-serif; padding: 20px; background: #1e1e1e; color: white; }
        h1 { color: #60a5fa; }
        button { padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #1d4ed8; }
        #output { margin-top: 20px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Hello World</h1>
    <p>Edit the code to see changes instantly.</p>
    <button onclick="showMessage()">Click Me</button>
    <div id="output"></div>

    <script>
        function showMessage() {
            document.getElementById('output').innerText = 'Button Clicked at ' + new Date().toLocaleTimeString();
        }
        
        console.log('Console test: System ready');
    </script>
</body>
</html>`
    },
    {
        id: 'react',
        label: 'React (TS)',
        icon: Layout,
        description: 'React + TypeScript (Classic)',
        // StackBlitz Classic React TS (runs in iframe without headers)
        embedUrl: 'https://stackblitz.com/edit/react-ts?embed=1&theme=dark&view=preview'
    },
    {
        id: 'vue',
        label: 'Vue (TS)',
        icon: Layout,
        description: 'Vue 3 + TypeScript (Official)',
        // Official Vue SFC Playground (Most reliable)
        embedUrl: 'https://play.vuejs.org/'
    },
    {
        id: 'android',
        label: 'Android (Kotlin)',
        icon: Smartphone,
        description: 'Kotlin Playground (Console Only)',
        // Official Kotlin Playground Embed has reliability issues (black screen).
        // Switching to OneCompiler for consistent behavior.
        embedUrl: 'https://onecompiler.com/embed/kotlin?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'ios',
        label: 'iOS (Swift)',
        icon: Smartphone,
        description: 'Swift Playground (Console Only)',
        // SwiftFiddle requires specific IDs for embedding.
        // OneCompiler provides a stable generic embed for Swift.
        embedUrl: 'https://onecompiler.com/embed/swift?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'flutter',
        label: 'Flutter',
        icon: Smartphone,
        description: 'Flutter & Dart (UI Supported)',
        // Using verified simple Flutter Counter Gist
        embedUrl: 'https://dartpad.dev/embed-flutter.html?id=0ba2a3aaf3fb2d0d4209dd5764274b72&theme=dark&run=true&split=50'
    },
    {
        id: 'java',
        label: 'Java',
        icon: FileCode,
        description: 'Java Playground (Console Only)',
        // Using common accessible Java compiler or similar. 
        // If we can't find a good ad-free one, we might link to one or use a generic one.
        // Assuming JDoodle or similar has a free embed. 
        // For now, let's use a placeholder or generic online compiler embed if available. 
        // Actually, let's use OneCompiler as it has a nice embed.
        embedUrl: 'https://onecompiler.com/embed/java?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'c',
        label: 'C',
        icon: Terminal,
        description: 'C Playground (Console Only)',
        embedUrl: 'https://onecompiler.com/embed/c?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'cpp',
        label: 'C++',
        icon: Terminal,
        description: 'C++ Playground (Console Only)',
        embedUrl: 'https://onecompiler.com/embed/cpp?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'python',
        label: 'Python',
        icon: FileCode,
        description: 'Python 3 Playground',
        embedUrl: 'https://onecompiler.com/embed/python?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'go',
        label: 'Go',
        icon: Terminal,
        description: 'Go (Golang) Playground',
        embedUrl: 'https://onecompiler.com/embed/go?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'rust',
        label: 'Rust',
        icon: Terminal,
        description: 'Rust Playground',
        embedUrl: 'https://onecompiler.com/embed/rust?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'csharp',
        label: 'C#',
        icon: Terminal,
        description: 'C# (.NET) Playground',
        embedUrl: 'https://onecompiler.com/embed/csharp?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'php',
        label: 'PHP',
        icon: FileCode,
        description: 'PHP Playground',
        embedUrl: 'https://onecompiler.com/embed/php?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    },
    {
        id: 'ruby',
        label: 'Ruby',
        icon: FileCode,
        description: 'Ruby Playground',
        embedUrl: 'https://onecompiler.com/embed/ruby?theme=dark&hideLanguageSelection=true&hideNew=true&hideNewFile=true'
    }
];

export function CodePlayground() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<LanguageType>('web');
    const [webCode, setWebCode] = useState(PLAYGROUNDS[0].defaultCode || '');
    const [iframeKey, setIframeKey] = useState(0); // To force refresh if needed
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // For Web Playground
    const [htmlPreview, setHtmlPreview] = useState(webCode);

    useEffect(() => {
        setIsLoading(true);
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'web') {
            const timeout = setTimeout(() => {
                setHtmlPreview(webCode);
            }, 800); // Debounce typing
            return () => clearTimeout(timeout);
        }
    }, [webCode, activeTab]);

    const handleRefresh = () => {
        setIframeKey(prev => prev + 1);
        setIsLoading(true);
        if (activeTab === 'web') {
            setHtmlPreview(webCode);
        }
    };

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const currentConfig = PLAYGROUNDS.find(p => p.id === activeTab) || PLAYGROUNDS[0];

    return (
        <div className={clsx(
            "flex flex-col gap-6 w-full mx-auto p-6 transition-all duration-300",
            isFullscreen ? "fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 p-0" : "h-full max-w-[1920px]"
        )}>
            {/* Header */}
            <div className={clsx("flex flex-wrap items-center justify-between gap-4", isFullscreen && "p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800")}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('codePlayground.title', 'Code Playground')}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('codePlayground.description', 'Write and run code in multiple languages')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Language Tabs */}
                    <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-x-auto max-w-[60vw] scrollbar-hide">
                        {PLAYGROUNDS.map((playground) => (
                            <button
                                key={playground.id}
                                onClick={() => setActiveTab(playground.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                    activeTab === playground.id
                                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                            >
                                <playground.icon size={16} />
                                {playground.label}
                            </button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>

                    <button
                        onClick={handleRefresh}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Refresh/Restart"
                    >
                        <RefreshCw size={20} />
                    </button>

                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className={clsx(
                "flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative",
                isFullscreen ? "rounded-none border-0" : ""
            )}>
                {activeTab === 'web' ? (
                    <div className="h-full flex flex-col md:flex-row">
                        {/* Editor Side */}
                        <div className="flex-1 flex flex-col min-h-[300px] border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Code size={14} /> Source Code
                                </span>
                            </div>
                            <textarea
                                value={webCode}
                                onChange={(e) => setWebCode(e.target.value)}
                                className="flex-1 w-full p-4 bg-[#1e1e1e] text-gray-200 font-mono text-sm leading-relaxed resize-none focus:outline-none"
                                spellCheck={false}
                                placeholder="<!-- Write your HTML/JS/CSS here -->"
                            />
                        </div>

                        {/* Preview Side */}
                        <div className="flex-1 flex flex-col min-h-[300px] relative">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Monitor size={14} /> Preview
                                </span>
                            </div>
                            <div className="flex-1 w-full h-full relative">
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10 transition-opacity">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Loading Preview...</span>
                                        </div>
                                    </div>
                                )}
                                <iframe
                                    key={iframeKey}
                                    srcDoc={htmlPreview}
                                    className="w-full h-full bg-white relative z-0"
                                    sandbox="allow-scripts allow-popups allow-modals allow-forms allow-same-origin"
                                    title="Web Preview"
                                    onLoad={handleIframeLoad}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    // External Embeds
                    <div className="h-full w-full bg-[#1e1e1e] relative">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10 transition-opacity">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Loading Playground...</span>
                                </div>
                            </div>
                        )}
                        <iframe
                            key={`${activeTab}-${iframeKey}`}
                            src={currentConfig.embedUrl}
                            className="w-full h-full border-0 relative z-0"
                            allow="clipboard-write; clipboard-read; fullscreen"
                            title={`${currentConfig.label} Playground`}
                            loading="lazy"
                            onLoad={handleIframeLoad}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
