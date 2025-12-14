import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyRound, Copy, Check, Info } from 'lucide-react';
import CryptoJS from 'crypto-js';

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
            // Skip invalid chars, or throw error. For now, we'll try to be lenient or let it fail gracefully.
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

        // Convert time to hex (8 bytes, padded)
        let timeHex = time.toString(16).toUpperCase();
        while (timeHex.length < 16) timeHex = '0' + timeHex;

        // HMAC-SHA1
        const input = CryptoJS.enc.Hex.parse(timeHex);
        const key = CryptoJS.enc.Hex.parse(secretHex);
        const hmac = CryptoJS.HmacSHA1(input, key);
        const hmacHex = hmac.toString(CryptoJS.enc.Hex);

        // Dynamic Truncation
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
        // console.error(e);
        return { code: 'Error', timeLeft: 0 };
    }
};


export const TotpGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [secret, setSecret] = useState('');
    const [totp, setTotp] = useState('000 000');
    const [timeLeft, setTimeLeft] = useState(30);
    const [copied, setCopied] = useState(false);

    // Update Timer loop
    useEffect(() => {
        if (!secret) {
            setTotp('------');
            setTimeLeft(30);
            return;
        }

        const tick = () => {
            const { code, timeLeft: tl } = generateTOTP(secret);
            // Format code with space
            const formatted = code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code;
            setTotp(formatted);
            setTimeLeft(tl);
        };

        tick(); // Immediate
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [secret]);

    const handleCopy = () => {
        const rawCode = totp.replace(' ', '');
        if (!rawCode || rawCode === '------') return;

        navigator.clipboard.writeText(rawCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const progressPercent = (timeLeft / 30) * 100;

    return (
        <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto max-w-2xl mx-auto">
            <div className="flex flex-col gap-2 text-center items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-2">
                    <KeyRound size={32} />
                </div>
                <h1 className="text-2xl font-bold dark:text-white">
                    {t('totp.title', 'TOTP Generator')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    {t('totp.description', 'Generate 2FA codes manually by entering your secret key. Useful for testing or recovery.')}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col gap-8">

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
                        className="w-full px-4 py-3 text-lg font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Info size={12} />
                        {t('totp.secretHint', 'Enter the key provided by the service (usually hidden behind the QR code).')}
                    </p>
                </div>



                {/* TOTP Display */}
                <div className="flex flex-col items-center gap-6 py-6 border-t border-b border-gray-100 dark:border-gray-700">

                    {/* Countdown Circle */}
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
                                stroke={timeLeft < 5 ? '#ef4444' : '#3b82f6'} // Red when expiring
                                strokeWidth="6"
                                strokeDasharray={276} // 2 * PI * 44
                                strokeDashoffset={276 - (276 * progressPercent) / 100}
                                className="transition-all duration-1000 ease-linear"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className={`text-2xl font-bold font-mono ${timeLeft < 5 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                            {timeLeft}s
                        </span>
                    </div>

                    {/* Code */}
                    <div
                        onClick={handleCopy}
                        className="group relative cursor-pointer flex items-center gap-4 bg-gray-50 dark:bg-gray-900 px-8 py-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors"
                    >
                        <span className="text-5xl font-mono font-bold tracking-wider text-gray-800 dark:text-gray-100">
                            {totp}
                        </span>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {copied ? <Check className="text-green-500" size={20} /> : <Copy className="text-gray-400" size={20} />}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 h-4">
                        {copied ? t('common.copied', 'Copied!') : t('totp.clickCopy', 'Click to copy')}
                    </p>
                </div>

            </div>
        </div>
    );
};
