import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScanSearch, HelpCircle, X, Copy, Check, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const FLAGS = [
    { key: 'g', label: 'Global', desc: 'Don\'t return after first match' },
    { key: 'i', label: 'Insensitive', desc: 'Case insensitive match' },
    { key: 'm', label: 'Multiline', desc: '^ and $ match start/end of line' },
    { key: 's', label: 'Single Line', desc: 'Dot matches newline' },
    { key: 'u', label: 'Unicode', desc: 'Enable Unicode support' },
    { key: 'y', label: 'Sticky', desc: 'Anchor to this.lastIndex' },
];

const GUIDE_DATA = {
    anchors: [
        { code: '^', desc: 'Start of string/line' },
        { code: '$', desc: 'End of string/line' },
        { code: '\\b', desc: 'Word boundary' },
        { code: '\\B', desc: 'Not a word boundary' },
    ],
    classes: [
        { code: '.', desc: 'Any character (except newline)' },
        { code: '\\d', desc: 'Digit [0-9]' },
        { code: '\\w', desc: 'Word char [a-zA-Z0-9_]' },
        { code: '\\s', desc: 'Whitespace' },
        { code: '[abc]', desc: 'Any of a, b, or c' },
        { code: '[^abc]', desc: 'Not a, b, or c' },
    ],
    quantifiers: [
        { code: '*', desc: '0 or more' },
        { code: '+', desc: '1 or more' },
        { code: '?', desc: '0 or 1' },
        { code: '{3}', desc: 'Exactly 3' },
        { code: '{3,}', desc: '3 or more' },
        { code: '{3,5}', desc: '3 to 5' },
    ],
    groups: [
        { code: '(...)', desc: 'Capturing group' },
        { code: '(?:...)', desc: 'Non-capturing group' },
        { code: '(?=...)', desc: 'Positive lookahead' },
        { code: '(?!...)', desc: 'Negative lookahead' },
    ],
    common: [
        // Web & Internet
        { name: 'Email', code: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' },
        { name: 'URL (Http/Https)', code: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
        { name: 'URL (Simple)', code: '[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
        { name: 'IPv4 Address', code: '^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$' },
        { name: 'IPv6 Address', code: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$' },
        { name: 'MAC Address', code: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$' },
        { name: 'Slug', code: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
        { name: 'Username (Alphanumeric)', code: '^[a-zA-Z0-9_-]{3,16}$' },
        { name: 'Twitter Handle', code: '^@?(\\w){1,15}$' },
        { name: 'Hashtag', code: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})' },
        { name: 'Subdomain', code: '^([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}$' },

        // Dates & Time
        { name: 'Date (YYYY-MM-DD)', code: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$' },
        { name: 'Date (MM/DD/YYYY)', code: '^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}$' },
        { name: 'Date (DD.MM.YYYY)', code: '^(0[1-9]|[12]\\d|3[01])\\.(0[1-9]|1[0-2])\\.\\d{4}$' },
        { name: 'Time (24h)', code: '^([01]\\d|2[0-3]):[0-5]\\d$' },
        { name: 'Time (12h)', code: '^(0?[1-9]|1[0-2]):[0-5]\\d\\s?[ap]m$' },
        { name: 'ISO 8601 Date', code: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z$' },

        // Numbers & Currency
        { name: 'Integer', code: '^-?\\d+$' },
        { name: 'Decimal', code: '^-?\\d*\\.?\\d+$' },
        { name: 'Percentage', code: '^100(\\.0+)?$|^(\\d|[1-9]\\d)(\\.\\d+)?$' },
        { name: 'Currency (USD)', code: '^\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?$' },
        { name: 'Credit Card (Generic)', code: '^?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11}$' },
        { name: 'Visa', code: '^4[0-9]{12}(?:[0-9]{3})?$' },
        { name: 'MasterCard', code: '^5[1-5][0-9]{14}$' },

        // Security
        { name: 'Password (Strong)', code: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$' },
        { name: 'Password (Medium)', code: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$' },
        { name: 'MD5 Hash', code: '^[a-fA-F0-9]{32}$' },
        { name: 'SHA-1 Hash', code: '^[a-fA-F0-9]{40}$' },
        { name: 'SHA-256 Hash', code: '^[a-fA-F0-9]{64}$' },
        { name: 'UUID', code: '^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$' },

        // Development
        { name: 'Hex Color', code: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$' },
        { name: 'RGB Color', code: '^rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)$' },
        { name: 'HTML Tag', code: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)' },
        { name: 'HTML Comment', code: '<!--[\\s\\S]*?-->' },
        { name: 'JavaScript Comment', code: '\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/' },
        { name: 'SemVer', code: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$' },
        { name: 'Git Branch', code: '^(master|main|develop|feature\\/.*|bugfix\\/.*|hotfix\\/.*|release\\/.*)$' },

        // Contact & ID
        { name: 'Phone (US)', code: '^\\(?([0-9]{3})\\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$' },
        { name: 'Phone (Intl)', code: '^\\+(?:[0-9] ?){6,14}[0-9]$' },
        { name: 'Zip Code (US)', code: '^\\d{5}(-\\d{4})?$' },
        { name: 'SSN (US)', code: '^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$' },
        { name: 'ISBN-13', code: '^(?:ISBN(?:-13)?:? )?(?=[0-9]{13}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9]$' },
        { name: 'VIN (Vehicle)', code: '^[A-HJ-NPR-Z0-9]{17}$' },
        { name: 'Passport (Generic)', code: '^[A-Z0-9]{6,9}$' },

        // Files
        { name: 'Image File', code: '^.*\\.(jpg|jpeg|png|gif|bmp|webp)$' },
        { name: 'Audio File', code: '^.*\\.(mp3|wav|wma|aac|flac)$' },
        { name: 'Video File', code: '^.*\\.(mp4|avi|mov|wmv|flv)$' },
        { name: 'PDF File', code: '^.*\\.pdf$' },
        { name: 'Archive File', code: '^.*\\.(zip|rar|7z|tar|gz)$' },

        // Misc
        { name: 'Bitcoin Address', code: '^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$' },
        { name: 'Ethereum Address', code: '^0x[a-fA-F0-9]{40}$' },
        { name: 'YouTube Video ID', code: '^[a-zA-Z0-9_-]{11}$' },
    ]
};

const RegexGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    const Section = ({ title, items }: { title: string, items: { code: string, desc: string }[] }) => (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                        <code className="text-purple-600 dark:text-purple-400 font-mono text-xs font-bold bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">{item.code}</code>
                        <span className="text-xs text-gray-600 dark:text-gray-300 ml-2 text-right">{item.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('regexTester.guide.title', 'Regex Cheat Sheet')}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('regexTester.guide.description', 'Quick reference for common patterns')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <Section title={t('regexTester.guide.anchors', 'Anchors')} items={GUIDE_DATA.anchors} />
                            <Section title={t('regexTester.guide.classes', 'Character Classes')} items={GUIDE_DATA.classes} />
                            <Section title={t('regexTester.guide.quantifiers', 'Quantifiers')} items={GUIDE_DATA.quantifiers} />
                        </div>
                        <div>
                            <Section title={t('regexTester.guide.groups', 'Groups & Lookaround')} items={GUIDE_DATA.groups} />

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                                    {t('regexTester.guide.common', 'Common Patterns')}
                                </h3>
                                <div className="space-y-3">
                                    {GUIDE_DATA.common.map((item, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 group">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
                                                <button
                                                    onClick={() => handleCopy(item.code)}
                                                    className="p-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-all opacity-0 group-hover:opacity-100"
                                                    title="Copy pattern"
                                                >
                                                    {copied === item.code ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                            <code className="block w-full text-[10px] font-mono text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 break-all">
                                                {item.code}
                                            </code>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <a
                                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full p-3 mt-4 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors border border-purple-100 dark:border-purple-800/50"
                            >
                                <ExternalLink size={14} />
                                View Full MDN Documentation
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const RegexTester: React.FC = () => {
    const { t } = useTranslation();
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState<string[]>(['g']);
    const [testString, setTestString] = useState('');
    const [showGuide, setShowGuide] = useState(false);

    const toggleFlag = (flag: string) => {
        setFlags(prev =>
            prev.includes(flag)
                ? prev.filter(f => f !== flag)
                : [...prev, flag]
        );
    };

    const { matches, error, highlightedText } = useMemo(() => {
        if (!pattern) return { matches: [], error: null, highlightedText: testString };

        try {
            const regex = new RegExp(pattern, flags.join(''));
            const matchesArr = Array.from(testString.matchAll(regex));

            // Generate highlighted text
            let lastIndex = 0;
            const nodes: React.ReactNode[] = [];

            // To handle zero-length matches (like ^ or $) or standard matches
            // We need to be careful not to infinite loop if 'g' is missing and matchAll behaves differently,
            // but matchAll requires 'g' in standard usage often, or works anyway.
            // Actually matchAll automatically works with 'g' mostly.

            // If strict requirement for global flag is not met for matchAll in some envs, we might need fallback.
            // But modern browsers support matchAll fine.

            matchesArr.forEach((match, i) => {
                const start = match.index!;
                const end = start + match[0].length;

                // unmatched part
                if (start > lastIndex) {
                    nodes.push(testString.slice(lastIndex, start));
                }

                // matched part
                nodes.push(
                    <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-[2px]">
                        {match[0] || <span className="text-gray-400 italic font-mono text-[10px]">[empty]</span>}
                    </span>
                );

                lastIndex = end;
            });

            if (lastIndex < testString.length) {
                nodes.push(testString.slice(lastIndex));
            }

            return { matches: matchesArr, error: null, highlightedText: nodes };
        } catch (err) {
            return { matches: [], error: (err as Error).message, highlightedText: testString };
        }
    }, [pattern, flags, testString]);

    return (
        <div className="p-6 h-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                        <ScanSearch className="w-8 h-8 text-purple-500" />
                        {t('regexTester.title', 'Regex Tester')}
                    </h1>
                    <button
                        onClick={() => setShowGuide(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                    >
                        <HelpCircle size={18} />
                        {t('common.guide', 'Guide')}
                    </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('regexTester.description', 'Test and debug your regular expressions in real-time.')}
                </p>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Left Panel: Inputs */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    {/* Regex Input */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('regexTester.regexPattern', 'Regex Pattern')}
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">/</span>
                            <input
                                type="text"
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                className={`w-full pl-6 pr-16 py-2 bg-gray-50 dark:bg-gray-900 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-purple-500'} rounded-lg font-mono text-sm outline-none focus:ring-2 dark:text-white`}
                                placeholder="e.g. [a-z0-9]+"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">/</span>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {FLAGS.map(flag => (
                                <button
                                    key={flag.key}
                                    onClick={() => toggleFlag(flag.key)}
                                    className={`px-2 py-1 text-xs rounded border transition-colors ${flags.includes(flag.key)
                                        ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                        }`}
                                    title={flag.desc}
                                >
                                    {flag.label} ({flag.key})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Test String */}
                    <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('regexTester.testString', 'Test String')}
                        </label>
                        <textarea
                            value={testString}
                            onChange={(e) => setTestString(e.target.value)}
                            className="flex-1 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-xs resize-none focus:ring-2 focus:ring-purple-500 outline-none dark:text-gray-200"
                            placeholder={t('regexTester.testStringPlaceholder', 'Paste your text here...')}
                        />
                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 flex flex-col min-h-0">
                        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
                            {t('regexTester.matchHighlight', 'Match Highlight')}
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">
                                {t('regexTester.matchCount', { count: matches.length, defaultValue: '{{count}} matches' })}
                            </span>
                        </h2>
                        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-xs dark:text-gray-300 whitespace-pre-wrap break-all">
                            {testString ? highlightedText : <span className="text-gray-400 italic">No valid text to match against</span>}
                        </div>
                    </div>

                    {/* Match Info */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-1/3 flex flex-col">
                        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            {t('regexTester.matchDetails', 'Match Details')}
                        </h2>
                        <div className="flex-1 overflow-auto">
                            {matches.length === 0 ? (
                                <p className="text-sm text-gray-400 italic text-center py-4">
                                    {t('regexTester.noMatches', 'No matches found')}
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {matches.map((match, i) => (
                                        <div key={i} className="text-xs p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-700">
                                            <div className="flex gap-2 font-mono mb-1">
                                                <span className="text-purple-600 dark:text-purple-400 font-bold">Match {i + 1}:</span>
                                                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-1 rounded truncate max-w-[200px]">{match[0]}</span>
                                                <span className="text-gray-400 ms-auto">Index: {match.index}</span>
                                            </div>
                                            {match.length > 1 && (
                                                <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-1 space-y-1">
                                                    {Array.from(match).slice(1).map((group, groupIdx) => (
                                                        <div key={groupIdx} className="flex gap-2">
                                                            <span className="text-gray-500">Group {groupIdx + 1}:</span>
                                                            <span className="font-mono text-gray-700 dark:text-gray-300">{group}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showGuide && <RegexGuideModal onClose={() => setShowGuide(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default RegexTester;
