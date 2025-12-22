
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Square, Mic, Settings2, Sparkles, Download, Edit3, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---

type VoiceStyle = 'standard' | 'storyteller' | 'serious' | 'excited' | 'whisper';

interface StylePreset {
    label: string;
    rate: number;
    pitch: number;
    description: string;
}

const STYLES: Record<VoiceStyle, StylePreset> = {
    standard: { label: 'Standard', rate: 1.0, pitch: 1.0, description: 'Natural and balanced' },
    storyteller: { label: 'Storyteller', rate: 0.9, pitch: 1.1, description: 'Slower, engaging tone' },
    serious: { label: 'Serious', rate: 0.85, pitch: 0.8, description: 'Deep and authoritative' },
    excited: { label: 'Excited', rate: 1.2, pitch: 1.3, description: 'Fast and energetic' },
    whisper: { label: 'Soft', rate: 0.9, pitch: 1.4, description: 'Gentle and higher pitch' },
};

export const ScreenAudioMaker = () => {
    const { t } = useTranslation();
    const [text, setText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // --- New State for Highlight & Download ---
    const [highlightIndex, setHighlightIndex] = useState<{ start: number, end: number } | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [showInstallGuide, setShowInstallGuide] = useState(false); // New state for modal

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    const [currentStyle, setCurrentStyle] = useState<VoiceStyle>('standard');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume] = useState(1);

    const synth = useRef(window.speechSynthesis);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // --- Visualization helper ---
    const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(20).fill(10));

    useEffect(() => {
        let animationFrame: number;

        const animate = () => {
            if (isSpeaking && !isPaused) {
                setVisualizerBars(prev => prev.map(() => 10 + Math.random() * 40));
            } else {
                setVisualizerBars(new Array(20).fill(5));
            }
            animationFrame = requestAnimationFrame(animate);
        };

        if (isSpeaking && !isPaused) {
            animate();
        } else {
            setVisualizerBars(new Array(20).fill(5));
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [isSpeaking, isPaused]);

    // --- Voice Loading & Khmer Auto-Select ---
    // Khmer Support Logic
    const isKhmer = /[\u1780-\u17FF]/.test(text);
    const hasKhmerVoice = voices.some(v => v.lang.startsWith('km'));

    useEffect(() => {
        const updateVoices = () => {
            const allVoices = synth.current.getVoices();
            setVoices(allVoices);

            if (!selectedVoice && allVoices.length > 0) {
                const preferred = allVoices.find(v =>
                    v.name.includes('Google') ||
                    v.name.includes('Premium') ||
                    v.name.includes('Enhanced') ||
                    v.name === 'Samantha'
                );
                setSelectedVoice(preferred || allVoices[0]);
            }
        };

        updateVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = updateVoices;
        }

        return () => {
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = null;
            }
            synth.current.cancel();
        }
    }, [selectedVoice]);

    // Auto-switch to Khmer voice
    useEffect(() => {
        if (isKhmer && hasKhmerVoice && selectedVoice && !selectedVoice.lang.startsWith('km')) {
            const kmVoice = voices.find(v => v.lang.startsWith('km'));
            if (kmVoice) setSelectedVoice(kmVoice);
        }
    }, [isKhmer, hasKhmerVoice, voices, selectedVoice]);

    const handleStyleChange = (style: VoiceStyle) => {
        setCurrentStyle(style);
        setRate(STYLES[style].rate);
        setPitch(STYLES[style].pitch);
    };

    const setupUtterance = (txt: string) => {
        const utterance = new SpeechSynthesisUtterance(txt);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                setHighlightIndex({
                    start: event.charIndex,
                    end: event.charIndex + event.charLength
                });
            }
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            setHighlightIndex(null);
            if (isRecording) stopRecording();
        };

        utterance.onerror = (e) => {
            console.error("Speech Error:", e);
            setIsSpeaking(false);
            setIsPaused(false);
            setHighlightIndex(null);
            if (isRecording) stopRecording();
        };

        return utterance;
    };

    const handleSpeak = () => {
        if (isPaused) {
            synth.current.resume();
            setIsPaused(false);
            setIsSpeaking(true);
        } else {
            if (synth.current.speaking) synth.current.cancel();

            if (text.trim()) {
                const utterance = setupUtterance(text);
                utteranceRef.current = utterance;
                synth.current.speak(utterance);
                setIsSpeaking(true);
            }
        }
    };

    const handleStop = () => {
        synth.current.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        setHighlightIndex(null);
        if (isRecording) stopRecording();
    };

    // --- Recording Logic ---
    const startRecordingFlow = async () => {
        try {
            // 1. Request Screen Share (Tab Audio)
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
                // preferCurrentTab removed to avoid experimental constraint issues
            });

            // Check if user shared audio
            if (!stream.getAudioTracks().length) {
                alert("Please share 'Tab Audio' to enable recording.");
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            // 2. Setup Recorder
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
            const mediaRecorder = new MediaRecorder(stream, { mimeType });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: mimeType });
                setAudioBlob(blob);
                setIsRecording(false);
                stream.getTracks().forEach(track => track.stop()); // Stop screen share
            };

            mediaRecorder.start();
            setIsRecording(true);

            // 3. Start Speech
            handleSpeak();

        } catch (err) {
            console.error("Recording setup failed:", err);

            let message = "Recording failed to start.";
            if (err instanceof DOMException) {
                if (err.name === 'NotAllowedError') { // Permission denied or cancelled
                    message = "Recording cancelled or permission denied. Please click 'Share' in the popup (and ensure Audio is checked).";
                } else if (err.name === 'NotSupportedError') {
                    message = "Screen recording is not supported in this browser context (e.g., HTTP vs HTTPS).";
                } else {
                    message = `Error: ${err.message}. Please click the button directly.`;
                }
            }
            alert(message);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const downloadAudio = () => {
        if (!audioBlob) return;
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice-studio-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setAudioBlob(null);
    };

    // --- Highlight Renderer ---
    const renderHighlightedText = () => {
        if (!highlightIndex) return text;

        const before = text.substring(0, highlightIndex.start);
        const highlighted = text.substring(highlightIndex.start, highlightIndex.end);
        const after = text.substring(highlightIndex.end);

        return (
            <>
                {before}
                <span className="bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-0.5 rounded animate-pulse transition-all duration-75">
                    {highlighted}
                </span>
                {after}
            </>
        );
    };

    return (
        <div className="min-h-full w-full bg-gray-50 dark:bg-gray-900 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 flex items-center gap-3">
                            <Mic className="w-8 h-8 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                            {t('screenAudio.title')}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{t('screenAudio.subtitle')}</p>
                    </div>

                    {/* Visualizer */}
                    <div className="h-12 flex items-center gap-1 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        {visualizerBars.map((height, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: `${height}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`w-1.5 rounded-full ${isSpeaking && !isPaused ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Khmer Warning Banner */}
                {isKhmer && !hasKhmerVoice && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex items-center gap-3 text-amber-800 dark:text-amber-200"
                    >
                        <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
                            <Settings2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold">{t('screenAudio.khmerMissingTitle')}</h3>
                            <p className="text-sm opacity-90">
                                {t('screenAudio.khmerMissingText')}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowInstallGuide(true)}
                            className="bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                        >
                            <HelpCircle size={14} />
                            {t('screenAudio.installVoice')}
                        </button>
                    </motion.div>
                )}

                {/* Installation Guide Modal */}
                <AnimatePresence>
                    {showInstallGuide && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowInstallGuide(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Download className="w-5 h-5 text-blue-500" />
                                        {t('screenAudio.installModalTitle')}
                                    </h2>
                                    <button onClick={() => setShowInstallGuide(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200">
                                        <strong>Note:</strong> {t('screenAudio.installModalNote')}
                                    </div>

                                    {/* Windows Instructions */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs">1</span>
                                            {t('screenAudio.windows')}
                                        </h3>
                                        <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                                            <li>Go to <strong>Settings</strong> {'>'} <strong>Time & Language</strong>.</li>
                                            <li>Select <strong>Speech</strong> (or "Region & Language").</li>
                                            <li>Under "Manage voices", click <strong>Add voices</strong>.</li>
                                            <li>Search for <strong>"Khmer"</strong> and select "Khmer (Cambodia)".</li>
                                            <li>Click <strong>Add</strong> and wait for the download to finish.</li>
                                            <li><strong>Restart your browser</strong> to see the new voice.</li>
                                        </ol>
                                    </div>

                                    {/* Mac Instructions */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-xs">2</span>
                                            {t('screenAudio.mac')}
                                        </h3>
                                        <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                                            <li>Open <strong>System Settings</strong> (or Preferences).</li>
                                            <li>Go to <strong>Accessibility</strong> {'>'} <strong>Spoken Content</strong>.</li>
                                            <li>Click the drop-down for "System Voice".</li>
                                            <li>Select <strong>Manage Voices...</strong></li>
                                            <li>Search for <strong>"Khmer"</strong>.</li>
                                            <li>Click the download icon (cloud) next to the voice.</li>
                                            <li><strong>Restart your browser</strong>.</li>
                                        </ol>
                                    </div>

                                    {/* Android Instructions */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs">3</span>
                                            {t('screenAudio.android')}
                                        </h3>
                                        <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                                            <li>Go to <strong>Settings</strong> {'>'} <strong>Accessibility</strong>.</li>
                                            <li>Tap <strong>Text-to-speech output</strong>.</li>
                                            <li>Tap the gear icon next to "Preferred engine".</li>
                                            <li>Tap <strong>Install voice data</strong>.</li>
                                            <li>Find <strong>Khmer (Cambodia)</strong> and download it.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                                    <button
                                        onClick={() => setShowInstallGuide(false)}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                                    >
                                        {t('screenAudio.gotIt')}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN: Controls */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Voice Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-gray-500" />
                                {t('screenAudio.voiceSettings')}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 font-medium mb-1.5 block">{t('screenAudio.characterVoice')}</label>
                                    <select
                                        value={selectedVoice?.name || ''}
                                        onChange={(e) => {
                                            const v = voices.find(voice => voice.name === e.target.value);
                                            if (v) setSelectedVoice(v);
                                        }}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    >
                                        {voices.map(v => (
                                            <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-500">{t('screenAudio.speed')}</span>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{rate}x</span>
                                    </div>
                                    <input
                                        type="range" min="0.5" max="2.0" step="0.1"
                                        value={rate}
                                        onChange={(e) => {
                                            setRate(parseFloat(e.target.value));
                                            setCurrentStyle('standard');
                                        }}
                                        className="w-full accent-blue-600 bg-gray-200 dark:bg-gray-700 rounded-lg h-2 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm text-gray-500">{t('screenAudio.pitch')}</span>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{pitch}</span>
                                    </div>
                                    <input
                                        type="range" min="0.5" max="2.0" step="0.1"
                                        value={pitch}
                                        onChange={(e) => {
                                            setPitch(parseFloat(e.target.value));
                                            setCurrentStyle('standard');
                                        }}
                                        className="w-full accent-blue-600 bg-gray-200 dark:bg-gray-700 rounded-lg h-2 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Styles Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                {t('screenAudio.emotiveStyles')}
                            </h2>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(STYLES) as VoiceStyle[]).map(style => (
                                    <button
                                        key={style}
                                        onClick={() => handleStyleChange(style)}
                                        className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentStyle === style
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
                                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {t(`screenAudio.styles.${style}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Download Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Download className="w-5 h-5 text-green-500" />
                                {t('screenAudio.exportAudio')}
                            </h2>
                            <p className="text-xs text-gray-500 mb-4">
                                {t('screenAudio.exportNote')}
                            </p>

                            {audioBlob ? (
                                <button
                                    onClick={downloadAudio}
                                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all"
                                >
                                    <Download size={18} />
                                    {t('screenAudio.saveRecording')}
                                </button>
                            ) : (
                                <button
                                    onClick={startRecordingFlow}
                                    disabled={isSpeaking || isRecording || !text}
                                    className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isRecording
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        } disabled:opacity-50`}
                                >
                                    {isRecording ? t('screenAudio.recordingState') : t('screenAudio.recordToDownload')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Editor */}
                    <div className="lg:col-span-2 flex flex-col h-[600px]">
                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 flex flex-col relative group overflow-hidden">

                            {/* Mode Toggle Overlay */}
                            {isSpeaking && (
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={handleStop}
                                        className="flex items-center gap-2 bg-gray-900/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
                                    >
                                        <Edit3 size={12} />
                                        {t('screenAudio.editText')}
                                    </button>
                                </div>
                            )}

                            {isSpeaking ? (
                                <div className="w-full h-full p-6 text-xl leading-relaxed text-gray-800 dark:text-gray-100 font-serif overflow-y-auto whitespace-pre-wrap">
                                    {renderHighlightedText()}
                                </div>
                            ) : (
                                <textarea
                                    value={text}
                                    onChange={(e) => {
                                        setText(e.target.value);
                                        setAudioBlob(null); // Clear old recording on edit
                                    }}
                                    placeholder="Enter your script here to convert to speech..."
                                    className="w-full h-full p-6 bg-transparent border-0 outline-none resize-none text-xl leading-relaxed text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 font-serif"
                                />
                            )}
                        </div>

                        {/* Main Action Bar */}
                        <div className="mt-6 flex flex-col-reverse md:flex-row items-center gap-4">
                            <button
                                onClick={() => { setText(''); setAudioBlob(null); }}
                                className="text-sm text-gray-500 hover:text-red-500 transition-colors py-2"
                            >
                                {t('screenAudio.clearScript')}
                            </button>

                            <div className="flex-1 flex justify-center gap-4">
                                <button
                                    onClick={handleStop}
                                    disabled={!isSpeaking && !isPaused}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-all"
                                    title="Stop"
                                >
                                    <Square size={20} fill="currentColor" />
                                </button>

                                {!isSpeaking && !isPaused ? (
                                    <button
                                        onClick={handleSpeak}
                                        disabled={!text}
                                        className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <Play size={26} fill="currentColor" />
                                        {t('screenAudio.startReading')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={isPaused ? handleSpeak : () => {
                                            if (synth.current.speaking && !synth.current.paused) {
                                                synth.current.pause();
                                                setIsPaused(true);
                                                setIsSpeaking(false);
                                            }
                                        }}
                                        className={`h-14 px-8 rounded-full text-white shadow-lg transition-all flex items-center gap-3 text-lg font-bold hover:scale-105 active:scale-95 ${isPaused
                                            ? 'bg-blue-600 shadow-blue-600/30'
                                            : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                                            }`}
                                    >
                                        {isPaused ? (
                                            <> <Play size={26} fill="currentColor" /> {t('screenAudio.resume')} </>
                                        ) : (
                                            <> <Pause size={26} fill="currentColor" /> {t('screenAudio.pause')} </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="w-24"></div> {/* Spacer for balance */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
