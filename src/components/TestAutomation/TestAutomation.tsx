import { useState, useEffect, useRef } from 'react';
import { PlayCircle, Smartphone, Monitor, Globe, Terminal, Copy, HelpCircle, X, Plus, Trash2, CheckCircle, AlertCircle, Loader2, BookOpen, Edit3 } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { TEMPLATES } from './TemplateUtils';
import { v4 as uuidv4 } from 'uuid';

SyntaxHighlighter.registerLanguage('typescript', ts);

type TestMode = 'web' | 'mobile' | 'desktop';
type TestStatus = 'idle' | 'running' | 'passed' | 'failed';

interface TestCase {
    id: string;
    name: string;
    type: TestMode;
    script: string;
    status: TestStatus;
    logs: string;
    deviceModel?: string; // Optional: target specific device
}

export function TestAutomation() {
    // Scroll Sync Ref
    const editorRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (editorRef.current) {
            editorRef.current.scrollTop = e.currentTarget.scrollTop;
            editorRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
    };

    const [testCases, setTestCases] = useState<TestCase[]>(() => {
        const saved = localStorage.getItem('testCases');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved test cases', e);
            }
        }

        // Generate initial test cases from ALL available templates
        return [
            { id: uuidv4(), name: 'Web Basic', type: 'web', script: TEMPLATES.web_basic('https://youtube.com'), status: 'idle', logs: '' },
            { id: uuidv4(), name: 'Web Form', type: 'web', script: TEMPLATES.web_form('https://the-internet.herokuapp.com/login'), status: 'idle', logs: '' },
            { id: uuidv4(), name: 'Web Ecommerce', type: 'web', script: TEMPLATES.web_ecommerce('https://www.saucedemo.com/'), status: 'idle', logs: '' },

            { id: uuidv4(), name: 'Mobile App Launch', type: 'mobile', script: TEMPLATES.mobile_launch_and_handle_error('mcnc.dbcs.losapp.sit'), status: 'idle', logs: '' },
            { id: uuidv4(), name: 'Mobile WebView', type: 'mobile', script: TEMPLATES.mobile_webview('mcnc.dbcs.losapp.sit'), status: 'idle', logs: '' },
            { id: uuidv4(), name: 'Mobile Search', type: 'mobile', script: TEMPLATES.mobile_search(), status: 'idle', logs: '' },
            { id: uuidv4(), name: 'Mobile Swipe', type: 'mobile', script: TEMPLATES.mobile_swipe(), status: 'idle', logs: '' },
            { id: uuidv4(), name: 'Mobile Gestures', type: 'mobile', script: TEMPLATES.mobile_gestures(), status: 'idle', logs: '' },
            { id: uuidv4(), name: 'Mobile Click Text', type: 'mobile', script: TEMPLATES.mobile_click_text('OK'), status: 'idle', logs: '' },

            { id: uuidv4(), name: 'Desktop App', type: 'desktop', script: TEMPLATES.desktop('/Applications/Calculator.app'), status: 'idle', logs: '' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('testCases', JSON.stringify(testCases));
    }, [testCases]);

    // Consolidated Data Hygiene: Fix types, normalize data, and ensure defaults exist
    useEffect(() => {
        setTestCases(prev => {
            let updated = prev.map(tc => {
                // 1. Fix specific known mislabels
                if (tc.name === 'Wait for YouTube Search' && tc.type !== 'web') return { ...tc, type: 'web' as TestMode };
                if (tc.name === 'Mobile App Launch' && tc.type !== 'mobile') return { ...tc, type: 'mobile' as TestMode };

                // 2. Heuristic: Check script content for mobile-only commands
                if (tc.type !== 'mobile' && (tc.script.includes('mobile_launch_and_handle_error') || tc.script.includes('mobile_click_text'))) {
                    return { ...tc, type: 'mobile' as TestMode };
                }

                // 3. General normalization
                const lowerType = (tc.type || 'web').toLowerCase().trim();
                if (['web', 'mobile', 'desktop'].includes(lowerType) && tc.type !== lowerType) {
                    return { ...tc, type: lowerType as TestMode };
                }

                return tc;
            });

            // 4. Ensure at least one mobile test exists
            // 4. Ensure ALL default templates exist (Hybrid Seeding)
            // This ensures existing users get the new templates (Security, etc.) without losing custom ones.
            const defaultTests = [
                // Mobile Defaults
                { name: 'Mobile App Launch', type: 'mobile', script: TEMPLATES.mobile_launch_and_handle_error('mcnc.dbcs.losapp.sit') },
                { name: 'Mobile WebView', type: 'mobile', script: TEMPLATES.mobile_webview('mcnc.dbcs.losapp.sit') },
                { name: 'Mobile Search', type: 'mobile', script: TEMPLATES.mobile_search() },
                { name: 'Mobile Swipe', type: 'mobile', script: TEMPLATES.mobile_swipe() },
                { name: 'Mobile Gestures', type: 'mobile', script: TEMPLATES.mobile_gestures() },
                { name: 'Mobile Click Text', type: 'mobile', script: TEMPLATES.mobile_click_text('OK') },
                { name: 'Mobile Root Detect', type: 'mobile', script: TEMPLATES.mobile_security_root('mcnc.dbcs.losapp.sit') },

                // Web Defaults
                { name: 'Web Security Headers', type: 'web', script: TEMPLATES.web_security_headers('https://example.com') },
                { name: 'Web Security SQLi', type: 'web', script: TEMPLATES.web_security_sqli('https://the-internet.herokuapp.com/login') }
            ];

            defaultTests.forEach(def => {
                // Check if this specific template already exists (by name & type)
                const exists = updated.some(tc => tc.name === def.name && tc.type === def.type);
                if (!exists) {
                    updated.push({
                        id: uuidv4(),
                        name: def.name,
                        type: def.type as TestMode,
                        script: def.script,
                        status: 'idle',
                        logs: ''
                    });
                }
            });

            // Only update if changes occurred to avoid infinite loops or unnecessary re-renders
            if (JSON.stringify(updated) !== JSON.stringify(prev)) {
                return updated;
            }
            return prev;
        });
    }, []);

    const [activeTestId, setActiveTestId] = useState<string>(() => {
        // Try to keep the first one active if available
        const saved = localStorage.getItem('testCases');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.length > 0) return parsed[0].id;
            } catch { }
        }
        return '1';
    });
    const [selectedTestIds, setSelectedTestIds] = useState<Set<string>>(new Set(['1']));
    const [globalRunning, setGlobalRunning] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [filterType, setFilterType] = useState<TestMode | 'all'>('all');
    const filteredTestCases = testCases.filter(tc => filterType === 'all' || tc.type === filterType);
    const visibleSelectedTests = filteredTestCases.filter(tc => selectedTestIds.has(tc.id));
    const visibleSelectedCount = visibleSelectedTests.length;
    // Active test derived state
    const activeTest = testCases.find(t => t.id === activeTestId) || testCases[0];

    const updateActiveTest = (updates: Partial<TestCase>) => {
        setTestCases(prev => prev.map(tc => tc.id === activeTestId ? { ...tc, ...updates } : tc));
    };

    const runSingleTest = async (id: string) => {
        const testCase = testCases.find(t => t.id === id);
        if (!testCase) return;

        // Reset status
        setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, status: 'running', logs: 'Starting test...\n' } : tc));

        try {
            if ((window as any).ipcRenderer) {
                // Pass DEVICE_MODEL env var if present
                const env = testCase.deviceModel ? { DEVICE_MODEL: testCase.deviceModel } : undefined;

                const result = await (window as any).ipcRenderer.invoke('playwright:run', {
                    script: testCase.script,
                    mode: testCase.type,
                    env
                });

                // Analyze Result
                const isFail = result.includes('failed') || result.includes('Error:');

                setTestCases(prev => prev.map(tc => tc.id === id ? {
                    ...tc,
                    status: isFail ? 'failed' : 'passed',
                    logs: tc.logs + result + '\nTest Finished.'
                } : tc));
            } else {
                setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, status: 'failed', logs: 'Error: IPC not available.' } : tc));
            }
        } catch (error: any) {
            setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, status: 'failed', logs: 'Error: ' + error.message } : tc));
        }
    };

    const runSelectedTests = async () => {
        setGlobalRunning(true);
        // Only run tests that are currently visible (filtered) AND selected
        const idsToRun = visibleSelectedTests.map(tc => tc.id);

        for (const id of idsToRun) {
            // Scroll to test or indicate active
            setActiveTestId(id);
            await runSingleTest(id);
        }
        setGlobalRunning(false);
    };

    const addNewTest = () => {
        // Determine type based on current filter (default to web if 'all')
        const newType: TestMode = (filterType === 'all') ? 'web' : filterType;

        let initialScript = '';
        if (newType === 'web') initialScript = TEMPLATES.web_basic('https://example.com');
        else if (newType === 'mobile') initialScript = TEMPLATES.mobile_launch_and_handle_error('mcnc.dbcs.losapp.sit');
        else initialScript = TEMPLATES.desktop('/path/to/app');

        const newTest: TestCase = {
            id: uuidv4(),
            name: `New ${newType.charAt(0).toUpperCase() + newType.slice(1)} Test`,
            type: newType,
            script: initialScript,
            status: 'idle',
            logs: ''
        };
        setTestCases([...testCases, newTest]);
        setActiveTestId(newTest.id);
        setSelectedTestIds(prev => new Set(prev).add(newTest.id));
    };

    const deleteTest = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newCases = testCases.filter(tc => tc.id !== id);
        setTestCases(newCases);
        if (activeTestId === id && newCases.length > 0) setActiveTestId(newCases[0].id);
        setSelectedTestIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const toggleSelection = (id: string) => {
        setSelectedTestIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(activeTest.script);
    };



    return (
        <div className="flex h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">

            {/* Sidebar: Test List */}
            <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-bold flex items-center gap-2">
                            <Terminal className="text-blue-600 w-5 h-5" />
                            Test Cases
                        </h2>
                        <button onClick={addNewTest} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-blue-600">
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        {(['all', 'web', 'mobile', 'desktop'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilterType(f)}
                                className={`flex-1 py-1 rounded-md text-[10px] uppercase font-bold transition-all ${filterType === f
                                    ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredTestCases.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-xs italic">
                            No {filterType !== 'all' ? filterType : ''} tests found.
                        </div>
                    )}
                    {filteredTestCases.map(tc => (
                        <div
                            key={tc.id}
                            onClick={() => setActiveTestId(tc.id)}
                            className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${activeTestId === tc.id
                                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 shadow-sm'
                                : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-750'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedTestIds.has(tc.id)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => toggleSelection(tc.id)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-medium text-sm truncate">{tc.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {tc.type === 'web' && <Globe size={12} />}
                                    {tc.type === 'mobile' && <Smartphone size={12} />}
                                    {tc.type === 'desktop' && <Monitor size={12} />}
                                    <span className="capitalize">{tc.type}</span>
                                </div>
                            </div>

                            {/* Status Icon */}
                            {tc.status === 'running' && <Loader2 size={16} className="animate-spin text-blue-500" />}
                            {tc.status === 'passed' && <CheckCircle size={16} className="text-green-500" />}
                            {tc.status === 'failed' && <AlertCircle size={16} className="text-red-500" />}

                            <button
                                onClick={(e) => deleteTest(tc.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={runSelectedTests}
                        disabled={globalRunning || visibleSelectedCount === 0}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-white shadow-sm transition-all ${globalRunning || visibleSelectedCount === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 hover:shadow-md active:scale-95'
                            }`}
                    >
                        {globalRunning ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
                        {globalRunning ? 'Running Queue...' : `Run Selected (${visibleSelectedCount})`}
                    </button>
                </div>
            </div>

            {/* Main Content: Editor */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 flex items-center justify-between shrink-0 z-10 gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <input
                            value={activeTest.name}
                            onChange={(e) => updateActiveTest({ name: e.target.value })}
                            className="text-lg font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-1 transition-colors min-w-0 w-48 truncate"
                            placeholder="Test Name"
                        />
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                        {/* Controls Removed as per user request (Cleaner UI) */}

                        {/* Mobile Device Model Input */}
                        {activeTest.type === 'mobile' && (
                            <>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-1.5 rounded-md border border-transparent focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                    <Smartphone size={14} />
                                    <input
                                        type="text"
                                        placeholder="Device Serial (Optional)"
                                        className="bg-transparent border-none outline-none w-48 placeholder-gray-400 text-gray-700 dark:text-gray-200"
                                        value={activeTest.deviceModel || ''}
                                        onChange={(e) => updateActiveTest({ deviceModel: e.target.value })}
                                        title="Enter specific device serial (e.g. emulator-5554) to target it"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowGuide(true)} className="text-gray-400 hover:text-gray-600">
                            <HelpCircle size={20} />
                        </button>
                    </div>
                </div>

                {/* Editor & Console Split (Vertical) */}
                <div className="flex-1 flex flex-col gap-0 overflow-hidden">
                    {/* Code Editor */}
                    <div className="flex-1 flex flex-col border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 relative group min-h-0">
                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={handleCopy} className="p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 rounded-md hover:text-blue-600">
                                <Copy size={14} />
                            </button>
                        </div>
                        <textarea
                            value={activeTest.script}
                            onChange={(e) => updateActiveTest({ script: e.target.value })}
                            onScroll={handleScroll}
                            className="absolute inset-0 w-full h-full p-6 font-mono text-sm resize-none bg-transparent text-transparent caret-gray-900 dark:caret-white z-10 focus:outline-none leading-6 whitespace-pre-wrap"
                            spellCheck={false}
                        />
                        <div
                            ref={editorRef}
                            className="absolute inset-0 pointer-events-none p-6 overflow-hidden"
                        >
                            <SyntaxHighlighter
                                language="typescript"
                                style={vs2015}
                                wrapLongLines={true}
                                customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '0.875rem', lineHeight: '1.5rem', fontFamily: 'inherit' }}
                            >
                                {activeTest.script}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Console Output */}
                    <div className="h-48 bg-black text-green-400 font-mono text-xs flex flex-col shrink-0 border-t border-gray-700">
                        <div className="p-2 bg-gray-900 border-b border-gray-800 flex justify-between items-center h-8">
                            <span className="font-bold">Console Output</span>
                            {activeTest.status === 'running' && <span className="text-yellow-400 animate-pulse">Running...</span>}
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto whitespace-pre-wrap font-mono">
                            {activeTest.logs || <span className="text-gray-600 italic">Ready to run...</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Modal */}
            {showGuide && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowGuide(false)}>
                    <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <BookOpen className="text-blue-600" />
                                Test Writing Guide
                            </h2>
                            <button onClick={() => setShowGuide(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-8 space-y-8">
                            {/* Section 1: Basic */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Globe size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Basic: Navigation & Interaction</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">Start by navigating to a URL, finding elements by text or ID, and performing basic clicks.</p>
                                <div className="bg-gray-950 text-gray-200 p-5 rounded-xl font-mono text-sm border border-gray-800 shadow-inner">
                                    <div className="text-gray-500 mb-2">// 1. Import Playwright</div>
                                    <div className="mb-4 text-purple-400">import <span className="text-white">{'{ test, expect }'}</span> from <span className="text-green-400">'@playwright/test'</span>;</div>

                                    <div className="text-yellow-400">test<span className="text-white">('basic interactions', </span><span className="text-purple-400">async</span><span className="text-white"> ({'{ page }'}) ={'>'} {'{'}</span></div>
                                    <div className="pl-6 text-gray-500 mt-2">// 2. Navigate</div>
                                    <div className="pl-6">await page.<span className="text-blue-400">goto</span>(<span className="text-green-400">'https://example.com'</span>);</div>

                                    <div className="pl-6 text-gray-500 mt-2">// 3. Click buttons (Text or CSS)</div>
                                    <div className="pl-6">await page.<span className="text-blue-400">click</span>(<span className="text-green-400">'text=Get Started'</span>);</div>
                                    <div className="pl-6">await page.<span className="text-blue-400">click</span>(<span className="text-green-400">'#submit-btn'</span>);</div>

                                    <div className="pl-6 text-gray-500 mt-2">// 4. Basic Assertion</div>
                                    <div className="pl-6">await <span className="text-purple-400">expect</span>(page).<span className="text-blue-400">toHaveTitle</span>(/Example/);</div>
                                    <div className="text-white">{'}'});</div>
                                </div>
                            </section>

                            <div className="h-px bg-gray-100 dark:bg-gray-700" />

                            {/* Section 2: Intermediate */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <Edit3 size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Intermediate: Forms & Waiting</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">Handle form inputs, async operations, and ensure elements are visible before interacting.</p>
                                <div className="bg-gray-950 text-gray-200 p-5 rounded-xl font-mono text-sm border border-gray-800 shadow-inner">
                                    <div className="text-yellow-400">test<span className="text-white">('login flow', </span><span className="text-purple-400">async</span><span className="text-white"> ({'{ page }'}) ={'>'} {'{'}</span></div>
                                    <div className="pl-6">await page.<span className="text-blue-400">goto</span>(<span className="text-green-400">'https://site.com/login'</span>);</div>

                                    <div className="pl-6 text-gray-500 mt-2">// 1. Fill Inputs</div>
                                    <div className="pl-6">await page.<span className="text-blue-400">fill</span>(<span className="text-green-400">'input[name="user"]'</span>, <span className="text-green-400">'admin'</span>);</div>
                                    <div className="pl-6">await page.<span className="text-blue-400">fill</span>(<span className="text-green-400">'input[type="password"]'</span>, <span className="text-green-400">'secret'</span>);</div>

                                    <div className="pl-6 text-gray-500 mt-2">// 2. Wait for navigation after click</div>
                                    <div className="pl-6 text-purple-400">await Promise.all<span className="text-white">([</span></div>
                                    <div className="pl-12">page.<span className="text-blue-400">waitForURL</span>(<span className="text-green-400">'**/dashboard'</span>),</div>
                                    <div className="pl-12">page.<span className="text-blue-400">click</span>(<span className="text-green-400">'button[type="submit"]'</span>)</div>
                                    <div className="pl-6 text-white">]);</div>

                                    <div className="pl-6 text-gray-500 mt-2">// 3. Verify Visibility</div>
                                    <div className="pl-6">await <span className="text-purple-400">expect</span>(page.<span className="text-blue-400">locator</span>(<span className="text-green-400">'.welcome-msg'</span>)).<span className="text-blue-400">toBeVisible</span>();</div>
                                    <div className="text-white">{'}'});</div>
                                </div>
                            </section>

                            <div className="h-px bg-gray-100 dark:bg-gray-700" />

                            {/* Section 3: Advanced */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                        <Smartphone size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. Advanced: Mobile & Mocking</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">Directly control Android via ADB (touch/shell) and intercept API requests to test edge cases.</p>
                                <div className="bg-gray-950 text-gray-200 p-5 rounded-xl font-mono text-sm border border-gray-800 shadow-inner">
                                    <div className="text-gray-500 mb-2">// Android Automation</div>
                                    <div className="mb-4 text-purple-400">import <span className="text-white">{'{ test, _android as android }'}</span> from <span className="text-green-400">'@playwright/test'</span>;</div>

                                    <div className="text-yellow-400">test<span className="text-white">('mobile control', </span><span className="text-purple-400">async</span><span className="text-white"> () ={'>'} {'{'}</span></div>
                                    <div className="pl-6">const [device] = <span className="text-purple-400">await</span> android.<span className="text-blue-400">devices</span>();</div>
                                    <div className="pl-6 text-gray-500 mt-2">// Execute ADB Commands directly</div>
                                    <div className="pl-6">await device.<span className="text-blue-400">shell</span>(<span className="text-green-400">'input tap 500 500'</span>);</div>
                                    <div className="pl-6">await device.<span className="text-blue-400">shell</span>(<span className="text-green-400">'am start -n com.app/.MainActivity'</span>);</div>
                                    <div className="text-white">{'}'});</div>

                                    <div className="my-6 border-t border-gray-800" />

                                    <div className="text-gray-500 mb-2">// API Mocking</div>
                                    <div className="text-yellow-400">test<span className="text-white">('mock api', </span><span className="text-purple-400">async</span><span className="text-white"> ({'{ page }'}) ={'>'} {'{'}</span></div>
                                    <div className="pl-6 text-gray-500 mt-2">// Intercept Network Requests</div>
                                    <div className="pl-6">await page.<span className="text-blue-400">route</span>(<span className="text-green-400">'**/api/users'</span>, route ={'>'} {'{'}</div>
                                    <div className="pl-12">route.<span className="text-blue-400">fulfill</span>({'{'}</div>
                                    <div className="pl-16">status: 200,</div>
                                    <div className="pl-16">contentType: <span className="text-green-400">'application/json'</span>,</div>
                                    <div className="pl-16">body: JSON.<span className="text-blue-400">stringify</span>([{'{'} id: 1, name: <span className="text-green-400">'Test User'</span> {'}'}])</div>
                                    <div className="pl-12">{'}'});</div>
                                    <div className="pl-6">{'}'});</div>
                                    <div className="text-white">{'}'});</div>
                                </div>
                            </section>

                            <div className="h-px bg-gray-100 dark:bg-gray-700" />

                            {/* Section 4: Expert */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                        <Terminal size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">4. Expert: Network & Data-Driven</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">Advanced patterns for verifying network traffic and running tests with multiple data sets.</p>
                                <div className="bg-gray-950 text-gray-200 p-5 rounded-xl font-mono text-sm border border-gray-800 shadow-inner">
                                    <div className="text-gray-500 mb-2">// 1. Network Validation</div>
                                    <div className="text-yellow-400">test<span className="text-white">('intercept response', </span><span className="text-purple-400">async</span><span className="text-white"> ({'{ page }'}) ={'>'} {'{'}</span></div>
                                    <div className="pl-6">await page.<span className="text-blue-400">goto</span>(<span className="text-green-400">'https://example.com'</span>);</div>
                                    <div className="pl-6 text-gray-500 mt-2">// Wait for specific API call</div>
                                    <div className="pl-6">const response = <span className="text-purple-400">await</span> page.<span className="text-blue-400">waitForResponse</span>(resp ={'>'} </div>
                                    <div className="pl-12">resp.<span className="text-blue-400">url</span>().<span className="text-blue-400">includes</span>(<span className="text-green-400">'/api/data'</span>) && resp.<span className="text-blue-400">status</span>() === 200</div>
                                    <div className="pl-6">);</div>
                                    <div className="pl-6">const data = <span className="text-purple-400">await</span> response.<span className="text-blue-400">json</span>();</div>
                                    <div className="pl-6">expect(data.id).<span className="text-blue-400">toBeDefined</span>();</div>
                                    <div className="text-white">{'}'});</div>

                                    <div className="my-6 border-t border-gray-800" />

                                    <div className="text-gray-500 mb-2">// 2. Data-Driven Tests</div>
                                    <div className="text-yellow-400">test<span className="text-white">('multiple inputs', </span><span className="text-purple-400">async</span><span className="text-white"> ({'{ page }'}) ={'>'} {'{'}</span></div>
                                    <div className="pl-6">const inputs = [<span className="text-green-400">'user1'</span>, <span className="text-green-400">'admin'</span>, <span className="text-green-400">'guest'</span>];</div>
                                    <div className="pl-6"><span className="text-purple-400">for</span> (const user of inputs) {'{'}</div>
                                    <div className="pl-12">await page.<span className="text-blue-400">goto</span>(<span className="text-green-400">'/login'</span>);</div>
                                    <div className="pl-12">await page.<span className="text-blue-400">fill</span>(<span className="text-green-400">'#username'</span>, user);</div>
                                    <div className="pl-12">await page.<span className="text-blue-400">click</span>(<span className="text-green-400">'#submit'</span>);</div>
                                    <div className="pl-12">await expect(page).<span className="text-blue-400">toHaveURL</span>(/dashboard|error/);</div>
                                    <div className="pl-6">{'}'}</div>
                                    <div className="text-white">{'}'});</div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestAutomation;
