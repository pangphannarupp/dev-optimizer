import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Copy, Pause, Play, RefreshCw, Calendar, ArrowRightLeft } from 'lucide-react';

const UnixTimestampConverter = () => {
    const { t } = useTranslation();
    const [currentTimestamp, setCurrentTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
    const [isPaused, setIsPaused] = useState(false);
    const [input, setInput] = useState('');
    const [inputType, setInputType] = useState<'seconds' | 'milliseconds' | 'date'>('seconds');
    const [convertedDate, setConvertedDate] = useState<Date | null>(null);

    // Live Clock
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentTimestamp(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [isPaused]);

    // Handle Input Change
    useEffect(() => {
        if (!input) {
            setConvertedDate(null);
            return;
        }

        try {
            let date: Date;
            // Check if input is likely a timestamp (digits only)
            if (/^\d+$/.test(input)) {
                const ts = parseInt(input, 10);
                // Simple heuristic: if likely seconds (less than year 3000 in seconds)
                // or user explicitly selected type. 
                // Year 3000 in seconds is ~32503680000 (11 digits)
                // Year 1973 in millis is ~100000000000 (12 digits)

                let isMillis = inputType === 'milliseconds';
                // Auto-detect if user hasn't strictly enforced
                if (input.length > 11 && inputType === 'seconds') {
                    // Suggestion: might be millis, but respect current toggle for now?
                    // Let's just follow the toggle rigidly to avoid confusion, 
                    // OR we can add an "Auto" mode but the requirements said toggle.
                }

                if (isMillis) {
                    date = new Date(ts);
                } else {
                    date = new Date(ts * 1000);
                }
            } else {
                // Try parsing as date string
                date = new Date(input);
            }

            if (!isNaN(date.getTime())) {
                setConvertedDate(date);
            } else {
                setConvertedDate(null);
            }
        } catch (e) {
            setConvertedDate(null);
        }
    }, [input, inputType]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        if (Math.abs(diff) < 60) return rtf.format(-diff, 'second');
        if (Math.abs(diff) < 3600) return rtf.format(-Math.floor(diff / 60), 'minute');
        if (Math.abs(diff) < 86400) return rtf.format(-Math.floor(diff / 3600), 'hour');
        if (Math.abs(diff) < 2592000) return rtf.format(-Math.floor(diff / 86400), 'day'); // 30 days
        if (Math.abs(diff) < 31536000) return rtf.format(-Math.floor(diff / 2592000), 'month');
        return rtf.format(-Math.floor(diff / 31536000), 'year');
    };

    return (
        <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                    <Clock className="w-8 h-8 text-blue-500" />
                    {t('unixConverter.title', 'Unix Timestamp Converter')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('unixConverter.description', 'Convert between Unix timestamps and human-readable dates.')}
                </p>
            </div>

            {/* Current Timestamp Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-8 text-white shadow-lg flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Clock size={120} />
                </div>

                <div className="z-10 flex flex-col items-center gap-2">
                    <span className="text-blue-100 font-medium tracking-wide uppercase text-sm">Current Unix Timestamp</span>
                    <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-shadow">
                        {currentTimestamp}
                    </div>
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-all text-sm font-medium backdrop-blur-sm"
                        >
                            {isPaused ? <Play size={16} /> : <Pause size={16} />}
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button
                            onClick={() => handleCopy(currentTimestamp.toString())}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-all text-sm font-medium backdrop-blur-sm"
                        >
                            <Copy size={16} />
                            Copy
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Input Section */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <ArrowRightLeft className="text-gray-500" size={20} />
                        Converter
                    </h2>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Enter Timestamp or Date string
                            </label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                placeholder="e.g. 1609459200 or 2021-01-01"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>

                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 self-start">
                            <button
                                onClick={() => setInputType('seconds')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'seconds'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                            >
                                Seconds
                            </button>
                            <button
                                onClick={() => setInputType('milliseconds')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'milliseconds'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                            >
                                Milliseconds
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            <button
                                onClick={() => setInput(currentTimestamp.toString())}
                                className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                            >
                                Use Current Time
                            </button>
                            <button
                                onClick={() => setInput('0')}
                                className="text-xs px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                Epoch (0)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="text-gray-500" size={20} />
                        Results
                    </h2>

                    {convertedDate ? (
                        <div className="flex flex-col gap-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            {[
                                { label: 'Unix Timestamp (Seconds)', value: Math.floor(convertedDate.getTime() / 1000).toString(), mono: true },
                                { label: 'Unix Timestamp (Millis)', value: convertedDate.getTime().toString(), mono: true },
                                { label: 'UTC / GMT', value: convertedDate.toUTCString() },
                                { label: 'Local Time', value: convertedDate.toLocaleString() },
                                { label: 'ISO 8601', value: convertedDate.toISOString(), mono: true },
                                { label: 'Relative', value: getRelativeTime(convertedDate), highlight: true }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row border-b last:border-0 border-gray-200 dark:border-gray-700 group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="w-full sm:w-1/3 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase font-semibold tracking-wider flex items-center">
                                        {item.label}
                                    </div>
                                    <div className={`w-full sm:w-2/3 px-4 py-3 text-gray-800 dark:text-gray-200 flex justify-between items-center ${item.mono ? 'font-mono text-sm' : 'text-sm'} ${item.highlight ? 'font-medium text-blue-600 dark:text-blue-400' : ''}`}>
                                        <span className="truncate mr-2">{item.value}</span>
                                        <button
                                            onClick={() => handleCopy(item.value)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-500 transition-all"
                                            title="Copy"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                            <RefreshCw size={32} className="mb-2 opacity-50" />
                            <p className="text-sm">Enter a valid timestamp or date to see results</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnixTimestampConverter;
