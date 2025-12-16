import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyRound, Copy, Check, Info, QrCode as QrIcon, Smartphone, TabletSmartphone, Globe, Code } from 'lucide-react';
import CryptoJS from 'crypto-js';
import QRCode from 'qrcode';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { totpSamples } from '../utils/TotpCodeSamples';
import { clsx } from 'clsx';

// --- Base32 Helper ---
const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const base32Lookup: Record<string, number> = {};
for (let i = 0; i < base32Chars.length; i++) {
    base32Lookup[base32Chars[i]] = i;
}

const base32ToHex = (base32: string): string => {
    let bits = '';
    let hex = '';
    const cleanInput = base32.toUpperCase().replace(/=+$/, ''); // Remove padding

    for (let i = 0; i < cleanInput.length; i++) {
        const val = base32Lookup[cleanInput[i]];
        if (val === undefined) {
            continue;
        }
        bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i + 4 <= bits.length; i += 4) {
        const chunk = bits.substr(i, 4);
        hex += parseInt(chunk, 2).toString(16);
    }
    return hex;
};

// --- TOTP Logic ---
const generateTOTP = (secretBase32: string, window = 30): { code: string; timeLeft: number } => {
    try {
        const secretHex = base32ToHex(secretBase32);
        if (!secretHex) return { code: '------', timeLeft: window };

        const epoch = Math.round(new Date().getTime() / 1000.0);
        const time = Math.floor(epoch / window);

        let timeHex = time.toString(16).toUpperCase();
        while (timeHex.length < 16) timeHex = '0' + timeHex;

        const input = CryptoJS.enc.Hex.parse(timeHex);
        const key = CryptoJS.enc.Hex.parse(secretHex);
        const hmac = CryptoJS.HmacSHA1(input, key);
        const hmacHex = hmac.toString(CryptoJS.enc.Hex);

        // @ts-ignore
        const offset = parseInt(hmacHex.substring(hmacHex.length - 1), 16);
        // @ts-ignore
        const binary =
            ((parseInt(hmacHex.substr(offset * 2, 2), 16) & 0x7f) << 24) |
            ((parseInt(hmacHex.substr(offset * 2 + 2, 2), 16) & 0xff) << 16) |
            ((parseInt(hmacHex.substr(offset * 2 + 4, 2), 16) & 0xff) << 8) |
            (parseInt(hmacHex.substr(offset * 2 + 6, 2), 16) & 0xff);

        const otp = binary % 1000000;
        let result = otp.toString();
        while (result.length < 6) result = '0' + result;

        const timeLeft = window - (epoch % window);

        return { code: result, timeLeft };
    } catch (e) {
        return { code: 'Error', timeLeft: 0 };
    }
};


export const TotpGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [secret, setSecret] = useState('');
    const [account, setAccount] = useState('');
    const [issuer, setIssuer] = useState('MyApp');
    const [totp, setTotp] = useState('000 000');
    const [timeLeft, setTimeLeft] = useState(30);
    const [copied, setCopied] = useState(false);
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<keyof typeof totpSamples>('android');

    // Update Timer loop
    useEffect(() => {
        if (!secret) {
            setTotp('------');
            setTimeLeft(30);
            return;
        }

        const tick = () => {
            const { code, timeLeft: tl } = generateTOTP(secret);
            const formatted = code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code;
            setTotp(formatted);
            setTimeLeft(tl);
        };

        tick();
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [secret]);

    // Update QR Code
    useEffect(() => {
        if (!secret || !account) {
            setQrUrl(null);
            return;
        }
        const label = issuer ? `${issuer}:${account}` : account;
        const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer || ''}`;

        QRCode.toDataURL(otpauth, { width: 200, margin: 1 }, (err, url) => {
            if (!err) setQrUrl(url);
        });

    }, [secret, account, issuer]);


    const handleCopy = () => {
        const rawCode = totp.replace(' ', '');
        if (!rawCode || rawCode === '------') return;

        navigator.clipboard.writeText(rawCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const progressPercent = (timeLeft / 30) * 100;

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
            <div className="flex flex-col gap-2 text-center items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-2">
                    <KeyRound size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('totp.title', 'TOTP Generator')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    {t('totp.description', 'Generate 2FA codes manually by entering your secret key. Useful for testing or recovery.')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Configuration Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Configuration</h2>

                    {/* Secret Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('totp.secretLabel', 'Secret Key (Base32)')}
                        </label>
                        <input
                            type="text"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value.replace(/\s/g, '').toUpperCase())}
                            placeholder="JBSWY3DPEHPK3PXP"
                            className="w-full px-4 py-2 font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Info size={12} />
                            {t('totp.secretHint', 'Enter the key provided by the service.')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
                            <input
                                type="text"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                placeholder="user@example.com"
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issuer</label>
                            <input
                                type="text"
                                value={issuer}
                                onChange={(e) => setIssuer(e.target.value)}
                                placeholder="MyApp"
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center gap-6">
                    {/* TOTP Display */}
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle
                                    cx="48" cy="48" r="44"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    className="text-gray-100 dark:text-gray-700"
                                />
                                <circle
                                    cx="48" cy="48" r="44"
                                    fill="none"
                                    stroke={timeLeft < 5 ? '#ef4444' : '#3b82f6'}
                                    strokeWidth="6"
                                    strokeDasharray={276}
                                    strokeDashoffset={276 - (276 * progressPercent) / 100}
                                    className="transition-all duration-1000 ease-linear"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className={`text-2xl font-bold font-mono ${timeLeft < 5 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                {timeLeft}s
                            </span>
                        </div>

                        <div
                            onClick={handleCopy}
                            className="group relative cursor-pointer flex items-center gap-4 bg-gray-50 dark:bg-gray-900 px-8 py-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors"
                        >
                            <span className="text-4xl font-mono font-bold tracking-wider text-gray-800 dark:text-gray-100">
                                {totp}
                            </span>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {copied ? <Check className="text-green-500" size={16} /> : <Copy className="text-gray-400" size={16} />}
                            </div>
                        </div>
                    </div>

                    {/* QR Code */}
                    {qrUrl ? (
                        <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-dashed border-gray-300">
                            <img src={qrUrl} alt="TOTP QR Code" className="w-40 h-40 mix-blend-multiply" />
                            <p className="text-xs text-gray-500">Scan with Authenticator App</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 p-4 w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400">
                            <QrIcon size={40} className="opacity-20" />
                            <p className="text-xs text-center">Fill Secret & Account to generate QR</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Implementation Guide */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <Code size={20} className="text-blue-500" />
                        Sample Implementations
                    </h2>
                </div>

                {/* Tabs */}
                <div className="flex w-full overflow-x-auto gap-2 p-2 bg-gray-50/50 dark:bg-gray-900/30 scrollbar-none">
                    {Object.entries(totpSamples).map(([key, sample]) => {
                        const Icon = (() => {
                            if (key.includes('android')) return Smartphone;
                            if (key.includes('ios')) return TabletSmartphone;
                            if (key === 'flutter' || key === 'reactNative') return Smartphone;
                            if (['react', 'vue', 'angular'].includes(key)) return Globe;
                            return Code;
                        })();

                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={clsx(
                                    "flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    activeTab === key
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 transform scale-105"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300"
                                )}
                            >
                                <Icon size={16} className={activeTab === key ? "text-white" : "text-gray-400"} />
                                {sample.label}
                            </button>
                        );
                    })}
                </div>

                {/* Code View */}
                <div className="relative bg-[#1e1e1e] group border-t border-gray-800">
                    <div className="absolute top-0 right-0 p-2 flex items-center gap-2 z-10">
                        <span className="text-xs text-gray-500 font-mono px-2 py-1">
                            {totpSamples[activeTab].language}
                        </span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(totpSamples[activeTab].code);
                                const btn = document.getElementById('code-copy-btn');
                                if (btn) {
                                    btn.innerHTML = '<span class="text-green-400 text-xs font-bold px-2">Copied!</span>';
                                    setTimeout(() => {
                                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy text-gray-400"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
                                    }, 2000);
                                }
                            }}
                            id="code-copy-btn"
                            className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-700 border border-gray-700/50 transition-all shadow-lg"
                            title="Copy Code"
                        >
                            <Copy size={16} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="max-h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pt-8">
                        <SyntaxHighlighter
                            language={totpSamples[activeTab].language}
                            style={vscDarkPlus}
                            customStyle={{ margin: 0, borderRadius: 0, padding: '1.5rem', fontSize: '13px', background: 'transparent', minHeight: '100%' }}
                            showLineNumbers={true}
                            wrapLines={true}
                        >
                            {totpSamples[activeTab].code}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
            {/* Spacer for comfortable scrolling */}
            <div className="h-8 shrink-0" />
        </div>
    );
};
