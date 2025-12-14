import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Zap } from 'lucide-react';
import * as curlConverter from 'curlconverter';
import { Collection, Item, ItemGroup } from 'postman-collection';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import dart from 'react-syntax-highlighter/dist/esm/languages/hljs/dart';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin';
import objectivec from 'react-syntax-highlighter/dist/esm/languages/hljs/objectivec';
import { DropZone } from './DropZone';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('dart', dart);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('objectivec', objectivec);

type Language = 'python' | 'javascript' | 'node' | 'java' | 'android' | 'kotlin' | 'swift' | 'objc' | 'dart' | 'php' | 'go' | 'rust';

const InputPanel: React.FC<{
    mode: 'curl' | 'postman';
    curlInput: string;
    onCurlChange: (val: string) => void;
    onFileUpload: (files: File[]) => void;
    requests: any[];
    selectedRequestId: string | null;
    onSelectRequest: (id: string, curl: string) => void;
    isLoading: boolean;
}> = ({ mode, curlInput, onCurlChange, onFileUpload, requests, selectedRequestId, onSelectRequest, isLoading }) => {
    const { t } = useTranslation();

    const handleRequestClick = (item: any) => {
        // Construct cURL manually from Postman Item
        // Note: curlconverter might not export a 'toCurl' from Postman object directly.
        // We might need to map it. Ideally, we can just use the Item's properties.
        // For simplicity, we can try to extract the raw request and assume the user wants code off that.
        // Wait, postman-collection likely has a way to describe the request.
        // A simple workaround: The prompt asked for "upload collection... then convert".
        // CurlConverter library usually takes a cURL string.
        // Postman SDK has `item.request.url.toString()`, `item.request.method`, etc.
        // To properly use 'curlconverter', we need a valid CURL string.
        // Let's implement a basic 'Postman Request -> cURL' builder here.

        const req = item.request;
        let curl = `curl --location '${req.url.toString()}' \\\n--header 'Content-Type: application/json'`;
        // Basic approximation for now.
        // Real implementation would iterate headers.

        if (req.headers && req.headers.each) {
            req.headers.each((h: any) => {
                curl += ` \\\n--header '${h.key}: ${h.value}'`;
            });
        }

        if (req.body && req.body.mode === 'raw') {
            curl += ` \\\n--data-raw '${req.body.raw}'`;
        }

        onSelectRequest(item.id, curl);
    };

    return (
        <div className="h-full flex flex-col">
            {mode === 'curl' ? (
                <textarea
                    className="flex-1 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-gray-200"
                    placeholder="curl https://api.example.com/data ..."
                    value={curlInput}
                    onChange={(e) => onCurlChange(e.target.value)}
                />
            ) : (
                <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {requests.length === 0 ? (
                        <div className="p-4 h-full flex flex-col">
                            <DropZone
                                onFilesDropped={onFileUpload}
                                accept=".json"
                                dragDropText={t('curlConverter.uploadPostmanDesc')}
                                className="h-full flex flex-col justify-center"
                            />
                            {isLoading && <p className="mt-2 text-sm text-gray-500 text-center">Parsing...</p>}
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="flex justify-between items-center px-2 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Requests</span>
                                <button onClick={() => window.location.reload()} className="text-xs text-red-500 hover:text-red-600">Clear</button>
                            </div>
                            {requests.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleRequestClick(item)}
                                    className={`w-full text-left px-3 py-2 rounded-md mb-1 text-sm flex items-center gap-2 ${selectedRequestId === item.id
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.request.method === 'GET' ? 'bg-green-100 text-green-700' :
                                        item.request.method === 'POST' ? 'bg-yellow-100 text-yellow-700' :
                                            item.request.method === 'PUT' ? 'bg-blue-100 text-blue-700' :
                                                item.request.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                                        {item.request.method}
                                    </span>
                                    <span className="truncate">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const CurlConverter = () => {
    const { t } = useTranslation();
    const [mode, setMode] = useState<'curl' | 'postman'>('curl');
    const [curlInput, setCurlInput] = useState('');
    const [targetLang, setTargetLang] = useState<Language>('python');
    const [generatedCode, setGeneratedCode] = useState('');
    const [requests, setRequests] = useState<any[]>([]);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'code' | 'headers' | 'body'>('code');
    const [parsedRequest, setParsedRequest] = useState<any>(null);

    useEffect(() => {
        if (!curlInput.trim()) {
            setGeneratedCode('');
            setParsedRequest(null);
            return;
        }

        const converter = curlConverter as any;

        // Parse Request Details
        try {
            if (converter.toJsonString) {
                const jsonStr = converter.toJsonString(curlInput);
                const json = JSON.parse(jsonStr);
                setParsedRequest(json);
            }
        } catch (e) {
            console.warn('Failed to parse cURL details', e);
            setParsedRequest(null);
        }

        // Generate Code
        try {
            let code = '';
            switch (targetLang) {
                case 'python': code = converter.toPython(curlInput); break;
                case 'javascript': code = converter.toJavaScript(curlInput); break;
                case 'node': code = converter.toNode(curlInput); break;
                case 'java': code = converter.toJava(curlInput); break;
                case 'android': code = converter.toJava(curlInput); break;
                case 'kotlin': code = converter.toKotlin ? converter.toKotlin(curlInput) : '// Kotlin generator not available'; break;
                case 'swift': code = converter.toSwift(curlInput); break;
                case 'objc': code = converter.toObjectiveC ? converter.toObjectiveC(curlInput) : '// Objective-C generator not available'; break;
                case 'dart': code = converter.toDart(curlInput); break;
                case 'php': code = converter.toPhp(curlInput); break;
                case 'go': code = converter.toGo(curlInput); break;
                case 'rust': code = converter.toRust(curlInput); break;
                default: code = converter.toPython(curlInput);
            }
            setGeneratedCode(code);
        } catch (error) {
            console.error(error);
            setGeneratedCode('Error parsing cURL: ' + (error as any).message);
        }
    }, [curlInput, targetLang]);

    const handleFileUpload = async (files: File[]) => {
        const file = files[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                const collection = new Collection(json);

                const extractedRequests: any[] = [];

                // Helper to recursive find items
                const traverse = (item: any) => {
                    if (Item.isItem(item)) {
                        extractedRequests.push(item);
                    } else if (ItemGroup.isItemGroup(item)) {
                        item.items.each(traverse);
                    } else if (item.items) {
                        // Sometimes simple JSON structure
                        item.items.forEach((sub: any) => traverse(sub));
                    }
                };

                collection.items.each(traverse);
                setRequests(extractedRequests);
            } catch (err) {
                alert('Failed to parse Postman Collection');
            } finally {
                setIsLoading(false);
            }
        };

        reader.readAsText(file);
    };

    const handleCopy = () => {
        if (activeTab === 'code') {
            navigator.clipboard.writeText(generatedCode);
        } else if (activeTab === 'body' && parsedRequest?.data) {
            navigator.clipboard.writeText(JSON.stringify(parsedRequest.data, null, 2));
        } else if (activeTab === 'headers' && parsedRequest?.headers) {
            navigator.clipboard.writeText(JSON.stringify(parsedRequest.headers, null, 2));
        }
    };

    return (
        <div className="p-6 h-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    {t('curlConverter.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('curlConverter.description')}
                </p>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Left Panel: Input */}
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setMode('curl')}
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${mode === 'curl'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            cURL Input
                        </button>
                        <button
                            onClick={() => setMode('postman')}
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${mode === 'postman'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            Postman Collection
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-hidden">
                        <InputPanel
                            mode={mode}
                            curlInput={curlInput}
                            onCurlChange={setCurlInput}
                            onFileUpload={handleFileUpload}
                            requests={requests}
                            selectedRequestId={selectedRequestId}
                            onSelectRequest={(id, curl) => {
                                setSelectedRequestId(id);
                                setCurlInput(curl);
                            }}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'code'
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Code
                            </button>
                            <button
                                onClick={() => setActiveTab('headers')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'headers'
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Headers
                            </button>
                            <button
                                onClick={() => setActiveTab('body')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'body'
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Body
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {activeTab === 'code' && (
                                <select
                                    value={targetLang}
                                    onChange={(e) => setTargetLang(e.target.value as Language)}
                                    className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
                                >
                                    <option value="python">Python (Requests)</option>
                                    <option value="javascript">JavaScript (Fetch)</option>
                                    <option value="node">Node.js (Fetch)</option>
                                    <option value="java">Java (HttpURLConnection)</option>
                                    <option value="android">Android (Java)</option>
                                    <option value="kotlin">Android (Kotlin)</option>
                                    <option value="swift">iOS (Swift)</option>
                                    <option value="objc">iOS (Objective-C)</option>
                                    <option value="dart">Dart (Http)</option>
                                    <option value="php">PHP</option>
                                    <option value="go">Go</option>
                                    <option value="rust">Rust</option>
                                </select>
                            )}
                            <button
                                onClick={handleCopy}
                                className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-[#1e1e1e] relative">
                        {/* Display Method & URL if parsed */}
                        {parsedRequest && (
                            <div className="absolute top-0 left-0 right-0 bg-gray-800/90 text-white text-xs px-2 py-1 border-b border-gray-700 flex gap-2 z-10 backdrop-blur-sm">
                                <span className={`font-bold px-1 rounded ${parsedRequest.method === 'get' ? 'bg-green-600' :
                                    parsedRequest.method === 'post' ? 'bg-yellow-600' :
                                        parsedRequest.method === 'put' ? 'bg-blue-600' :
                                            parsedRequest.method === 'delete' ? 'bg-red-600' : 'bg-gray-600'
                                    }`}>{parsedRequest.method.toUpperCase()}</span>
                                <span className="truncate opacity-80" title={parsedRequest.url}>{parsedRequest.url}</span>
                            </div>
                        )}

                        {activeTab === 'code' && (
                            <div className={parsedRequest ? 'pt-8 h-full' : 'h-full'}>
                                <SyntaxHighlighter
                                    language={targetLang === 'node' || targetLang === 'android' ? 'javascript' : (targetLang === 'objc' ? 'objectivec' : targetLang)} // mapping fallback
                                    style={vs2015}
                                    customStyle={{ margin: 0, height: '100%', fontSize: '14px', lineHeight: '1.5' }}
                                >
                                    {generatedCode || '// Generated code will appear here'}
                                </SyntaxHighlighter>
                            </div>
                        )}

                        {activeTab === 'headers' && (
                            <div className={`p-4 text-gray-300 font-mono text-sm ${parsedRequest ? 'pt-10' : ''}`}>
                                {parsedRequest?.headers ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-700 text-gray-500">
                                                <th className="py-2 pr-4 w-1/3">Key</th>
                                                <th className="py-2">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(parsedRequest.headers).map(([k, v]) => (
                                                <tr key={k} className="border-b border-gray-700/50">
                                                    <td className="py-2 pr-4 text-blue-400">{k}</td>
                                                    <td className="py-2 text-green-400 break-all">{String(v)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-500 italic">No headers found or invalid cURL.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'body' && (
                            <div className={`p-4 text-gray-300 font-mono text-sm ${parsedRequest ? 'pt-10' : ''}`}>
                                {parsedRequest?.data ? (
                                    <pre className="whitespace-pre-wrap">
                                        {typeof parsedRequest.data === 'string'
                                            ? parsedRequest.data
                                            : JSON.stringify(parsedRequest.data, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500 italic">No body data found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurlConverter;
