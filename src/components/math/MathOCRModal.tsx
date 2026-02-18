import { useState, useEffect, useCallback } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface MathOCRModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (latex: string) => void;
}

export const MathOCRModal = ({ isOpen, onClose, onInsert }: MathOCRModalProps) => {
    // OCR State
    const [ocrProvider, setOcrProvider] = useState<'mathpix' | 'gemini'>(() => (localStorage.getItem('ocr_provider') as 'mathpix' | 'gemini') || 'mathpix');

    // Mathpix Keys
    const [appId, setAppId] = useState(() => localStorage.getItem('mathpix_app_id') || '');
    const [appKey, setAppKey] = useState(() => localStorage.getItem('mathpix_app_key') || '');

    // Gemini Keys
    const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [geminiModel, setGeminiModel] = useState(() => localStorage.getItem('gemini_model') || 'gemini-1.5-flash');

    const [isScanning, setIsScanning] = useState(false);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    useEffect(() => {
        localStorage.setItem('ocr_provider', ocrProvider);
        localStorage.setItem('mathpix_app_id', appId);
        localStorage.setItem('mathpix_app_key', appKey);
        localStorage.setItem('gemini_api_key', geminiKey);
        localStorage.setItem('gemini_model', geminiModel);
    }, [ocrProvider, appId, appKey, geminiKey, geminiModel]);

    const processMathpix = async (base64: string) => {
        const response = await fetch('https://api.mathpix.com/v3/text', {
            method: 'POST',
            headers: {
                'app_id': appId,
                'app_key': appKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                src: base64,
                formats: ['latex_simplified'],
            }),
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);
        if (!data.latex_simplified) throw new Error('No math execution detected');

        return data.latex_simplified;
    };

    const processGemini = async (base64: string) => {
        // Extract mime type and base64 data
        const matches = base64.match(/^data:(.+);base64,(.+)$/);
        if (!matches) throw new Error('Invalid image data');

        const mimeType = matches[1];
        const base64Data = matches[2];

        // Use selected model
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Convert this image to LaTeX. Output ONLY the LaTeX code. Do not wrap in markdown or code blocks." },
                        { inline_data: { mime_type: mimeType, data: base64Data } }
                    ]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error?.message || response.statusText;
            if (response.status === 404) throw new Error(`Model '${geminiModel}' not found. Please check the Model ID.`);
            if (response.status === 400) throw new Error(`Invalid request: ${errorMsg}`);
            if (response.status === 403) throw new Error(`Permission denied: Check your API key.`);
            if (response.status === 429) throw new Error(`Rate limit exceeded. Please wait a moment.`);
            throw new Error(`Gemini API Error (${response.status}): ${errorMsg}`);
        }

        if (data.error) throw new Error(data.error.message || 'Gemini API Error');

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('No result from Gemini');

        // Clean up markdown code blocks if Gemini ignores instruction
        let cleanLatex = text.replace(/```latex/g, '').replace(/```/g, '').trim();
        // Remove $ delimiters if present
        if (cleanLatex.startsWith('$') && cleanLatex.endsWith('$')) {
            cleanLatex = cleanLatex.slice(1, -1);
        }
        if (cleanLatex.startsWith('$$') && cleanLatex.endsWith('$$')) {
            cleanLatex = cleanLatex.slice(2, -2);
        }

        return cleanLatex;
    };

    const fetchGeminiModels = async () => {
        if (!geminiKey) {
            alert('Please enter your Gemini API Key first.');
            return;
        }

        setIsLoadingModels(true);
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || response.statusText);
            }

            if (data.models) {
                // Filter for Gemini models that support generateContent
                const models = data.models
                    .filter((m: any) => m.name.includes('gemini') && m.supportedGenerationMethods?.includes('generateContent'))
                    .map((m: any) => m.name.replace('models/', ''));

                if (models.length > 0) {
                    setAvailableModels(models);
                    alert(`Found ${models.length} compatible models:\n\n${models.join('\n')}\n\nPlease select one from the list.`);
                    if (!models.includes(geminiModel) && models.includes('gemini-1.5-flash')) {
                        setGeminiModel('gemini-1.5-flash');
                    } else if (models.length > 0) {
                        setGeminiModel(models[0]);
                    }
                } else {
                    alert('No compatible Gemini models found for this key.');
                }
            }
        } catch (error: any) {
            console.error('Failed to fetch models:', error);
            alert(`Failed to fetch models: ${error.message}`);
        } finally {
            setIsLoadingModels(false);
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (ocrProvider === 'mathpix' && (!appId || !appKey)) {
            alert('Please enter your Mathpix App ID and Key.');
            return;
        }
        if (ocrProvider === 'gemini' && !geminiKey) {
            alert('Please enter your Gemini API Key.');
            return;
        }

        setIsScanning(true);
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            let resultLatex = '';

            if (ocrProvider === 'mathpix') {
                resultLatex = await processMathpix(base64);
            } else {
                resultLatex = await processGemini(base64);
            }

            onInsert(resultLatex);
            onClose();

        } catch (err: any) {
            console.error('OCR Error:', err);
            alert(`Scan failed: ${err.message}`);
        } finally {
            setIsScanning(false);
        }
    }, [ocrProvider, appId, appKey, geminiKey, geminiModel, onInsert, onClose]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        multiple: false
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        <Camera className="text-purple-500" />
                        Scan Math ({ocrProvider === 'mathpix' ? 'Mathpix' : 'Gemini'})
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">OCR Provider</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOcrProvider('mathpix')}
                                    className={`flex-1 py-2 text-sm rounded-lg border transition-all ${ocrProvider === 'mathpix'
                                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500'
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    Mathpix
                                </button>
                                <button
                                    onClick={() => setOcrProvider('gemini')}
                                    className={`flex-1 py-2 text-sm rounded-lg border transition-all ${ocrProvider === 'gemini'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    Google Gemini (Free)
                                </button>
                            </div>
                        </div>

                        {ocrProvider === 'mathpix' ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mathpix Configuration</label>
                                <input
                                    type="text"
                                    value={appId}
                                    onChange={(e) => setAppId(e.target.value)}
                                    placeholder="App ID"
                                    className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <input
                                    type="password"
                                    value={appKey}
                                    onChange={(e) => setAppKey(e.target.value)}
                                    placeholder="App Key"
                                    className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <p className="text-[10px] text-gray-400">
                                    Get free keys at <a href="https://mathpix.com/ocr" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">mathpix.com</a>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gemini Configuration</label>
                                <input
                                    type="password"
                                    value={geminiKey}
                                    onChange={(e) => setGeminiKey(e.target.value)}
                                    placeholder="Gemini API Key"
                                    className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-baseline">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-wider">Model</label>
                                        <button
                                            onClick={fetchGeminiModels}
                                            disabled={isLoadingModels || !geminiKey}
                                            className="text-[10px] text-blue-500 hover:text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoadingModels ? 'Checking...' : 'Check Available Models'}
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-exp', ...availableModels].includes(geminiModel) ? geminiModel : 'custom'}
                                            onChange={(e) => {
                                                if (e.target.value !== 'custom') {
                                                    setGeminiModel(e.target.value);
                                                } else {
                                                    setGeminiModel(''); // Clear for custom input
                                                }
                                            }}
                                            className="flex-1 p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <optgroup label="Recommended">
                                                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                            </optgroup>
                                            {availableModels.length > 0 && (
                                                <optgroup label="Available for your Key">
                                                    {availableModels.filter(m => !['gemini-1.5-flash', 'gemini-1.5-pro'].includes(m)).map(model => (
                                                        <option key={model} value={model}>{model}</option>
                                                    ))}
                                                </optgroup>
                                            )}
                                            <optgroup label="Other">
                                                <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8B</option>
                                                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Exp)</option>
                                                <option value="custom">Custom Model ID</option>
                                            </optgroup>
                                        </select>
                                        {['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-exp', ...availableModels].includes(geminiModel) ? null : (
                                            <input
                                                type="text"
                                                value={geminiModel}
                                                onChange={(e) => setGeminiModel(e.target.value)}
                                                placeholder="Model ID"
                                                className="w-32 p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                                autoFocus
                                            />
                                        )}
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400">
                                    Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">aistudio.google.com</a>
                                </p>
                            </div>
                        )}
                    </div>

                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                            ${isDragActive ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'}
                        `}
                    >
                        <input {...getInputProps()} />
                        {isScanning ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                                <p className="text-sm text-gray-500">Processing image...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Upload size={32} />
                                <p className="text-sm">Drop equation image here</p>
                                <p className="text-xs opacity-70">(or click to browse)</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
