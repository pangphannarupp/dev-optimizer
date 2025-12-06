import React, { useState } from 'react';
import { Lock, Copy, Check, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';

type EncryptionMode = 'AES' | 'DES' | 'TripleDES' | 'RC4' | 'Rabbit';
type CipherMode = 'CBC' | 'ECB' | 'CFB' | 'OFB' | 'CTR' | 'GCM';
type PaddingScheme = 'Pkcs7' | 'NoPadding' | 'ZeroPadding' | 'Iso10126' | 'Iso97971';
type OutputFormat = 'Base64' | 'Hex';

// Tooltip component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
    const [show, setShow] = React.useState(false);
    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="cursor-help"
            >
                {children}
            </div>
            {show && (
                <div className="absolute z-50 w-64 p-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg -top-2 left-6">
                    {text}
                    <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"></div>
                </div>
            )}
        </div>
    );
};

export const EncryptionTool: React.FC = () => {
    // Encryption state
    const [encryptInput, setEncryptInput] = useState('');
    const [encryptMode, setEncryptMode] = useState<EncryptionMode>('AES');
    const [encryptCipherMode, setEncryptCipherMode] = useState<CipherMode>('CBC');
    const [encryptPadding, setEncryptPadding] = useState<PaddingScheme>('Pkcs7');
    const [encryptIv, setEncryptIv] = useState('');
    const [encryptKeySize, setEncryptKeySize] = useState<128 | 192 | 256>(128);
    const [encryptKey, setEncryptKey] = useState('');
    const [encryptOutputFormat, setEncryptOutputFormat] = useState<OutputFormat>('Base64');
    const [encryptOutput, setEncryptOutput] = useState('');
    const [encryptError, setEncryptError] = useState('');
    const [encryptCopied, setEncryptCopied] = useState(false);

    // Decryption state
    const [decryptInput, setDecryptInput] = useState('');
    const [decryptCipherMode, setDecryptCipherMode] = useState<CipherMode>('CBC');
    const [decryptPadding, setDecryptPadding] = useState<PaddingScheme>('Pkcs7');
    const [decryptIv, setDecryptIv] = useState('');
    const [decryptKeySize, setDecryptKeySize] = useState<128 | 192 | 256>(128);
    const [decryptKey, setDecryptKey] = useState('');
    const [decryptOutputFormat, setDecryptOutputFormat] = useState<'Plain-Text' | 'Base64'>('Plain-Text');
    const [decryptOutput, setDecryptOutput] = useState('');
    const [decryptError, setDecryptError] = useState('');
    const [decryptCopied, setDecryptCopied] = useState(false);

    const { t } = useTranslation();

    const getPaddingScheme = (padding: PaddingScheme) => {
        switch (padding) {
            case 'Pkcs7': return CryptoJS.pad.Pkcs7;
            case 'NoPadding': return CryptoJS.pad.NoPadding;
            case 'ZeroPadding': return CryptoJS.pad.ZeroPadding;
            case 'Iso10126': return CryptoJS.pad.Iso10126;
            case 'Iso97971': return CryptoJS.pad.Iso97971;
            default: return CryptoJS.pad.Pkcs7;
        }
    };

    const handleEncrypt = async () => {
        setEncryptError('');
        setEncryptOutput('');

        if (!encryptInput || !encryptKey) {
            setEncryptError('Please provide both input text and secret key');
            return;
        }

        // For GCM mode, use Web Crypto API
        if (encryptCipherMode === 'GCM') {
            await encryptWithGCM();
            return;
        }

        try {
            // Standard encryption for other modes
            const keyBytes = CryptoJS.enc.Utf8.parse(encryptKey.padEnd(encryptKeySize / 8, '0').substring(0, encryptKeySize / 8));
            let ivBytes = encryptIv ? CryptoJS.enc.Utf8.parse(encryptIv.padEnd(16, '0').substring(0, 16)) : undefined;

            // Generate a default 16-byte zero IV if none provided and mode requires IV
            if (!ivBytes && encryptCipherMode !== 'ECB') {
                ivBytes = CryptoJS.lib.WordArray.create([0, 0, 0, 0], 16);
            }

            const options: any = {
                mode: (CryptoJS.mode as any)[encryptCipherMode],
                padding: getPaddingScheme(encryptPadding),
            };

            if (ivBytes && encryptCipherMode !== 'ECB') {
                options.iv = ivBytes;
            }

            let encrypted;
            switch (encryptMode) {
                case 'AES':
                    encrypted = CryptoJS.AES.encrypt(encryptInput, keyBytes, options);
                    break;
                case 'DES':
                    encrypted = CryptoJS.DES.encrypt(encryptInput, keyBytes, options);
                    break;
                case 'TripleDES':
                    encrypted = CryptoJS.TripleDES.encrypt(encryptInput, keyBytes, options);
                    break;
                case 'RC4':
                    encrypted = CryptoJS.RC4.encrypt(encryptInput, encryptKey);
                    break;
                case 'Rabbit':
                    encrypted = CryptoJS.Rabbit.encrypt(encryptInput, encryptKey);
                    break;
                default:
                    throw new Error('Unsupported encryption mode');
            }

            const result = encryptOutputFormat === 'Base64'
                ? encrypted.toString()
                : encrypted.ciphertext.toString(CryptoJS.enc.Hex);

            setEncryptOutput(result);
        } catch (err) {
            setEncryptError((err as Error).message);
        }
    };

    // AES-GCM encryption using Web Crypto API
    const encryptWithGCM = async () => {
        try {
            // Prepare key
            const keyData = new TextEncoder().encode(encryptKey.padEnd(encryptKeySize / 8, '0').substring(0, encryptKeySize / 8));
            const key = await window.crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'AES-GCM' },
                false,
                ['encrypt']
            );

            // Generate 12-byte IV
            const iv = window.crypto.getRandomValues(new Uint8Array(12));

            // Encrypt
            const encodedText = new TextEncoder().encode(encryptInput);
            const ciphertext = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                    tagLength: 128
                },
                key,
                encodedText
            );

            // Combine IV + ciphertext
            const combined = new Uint8Array(iv.length + ciphertext.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(ciphertext), iv.length);

            // Convert to Base64 or Hex
            const result = encryptOutputFormat === 'Base64'
                ? btoa(String.fromCharCode(...combined))
                : Array.from(combined).map(b => b.toString(16).padStart(2, '0')).join('');

            setEncryptOutput(result);
        } catch (err) {
            setEncryptError((err as Error).message);
        }
    };

    const handleDecrypt = async () => {
        setDecryptError('');
        setDecryptOutput('');

        if (!decryptInput || !decryptKey) {
            setDecryptError('Please provide both encrypted text and secret key');
            return;
        }

        // For GCM mode, use Web Crypto API
        if (decryptCipherMode === 'GCM') {
            await decryptWithGCM();
            return;
        }

        try {
            // Standard decryption for other modes
            const keyBytes = CryptoJS.enc.Utf8.parse(decryptKey.padEnd(decryptKeySize / 8, '0').substring(0, decryptKeySize / 8));
            let ivBytes = decryptIv ? CryptoJS.enc.Utf8.parse(decryptIv.padEnd(16, '0').substring(0, 16)) : undefined;

            // Generate a default 16-byte zero IV if none provided and mode requires IV
            if (!ivBytes && decryptCipherMode !== 'ECB') {
                ivBytes = CryptoJS.lib.WordArray.create([0, 0, 0, 0], 16);
            }

            const options: any = {
                mode: (CryptoJS.mode as any)[decryptCipherMode],
                padding: getPaddingScheme(decryptPadding),
            };

            if (ivBytes && decryptCipherMode !== 'ECB') {
                options.iv = ivBytes;
            }

            let decrypted;
            switch (encryptMode) {
                case 'AES':
                    decrypted = CryptoJS.AES.decrypt(decryptInput, keyBytes, options);
                    break;
                case 'DES':
                    decrypted = CryptoJS.DES.decrypt(decryptInput, keyBytes, options);
                    break;
                case 'TripleDES':
                    decrypted = CryptoJS.TripleDES.decrypt(decryptInput, keyBytes, options);
                    break;
                case 'RC4':
                    decrypted = CryptoJS.RC4.decrypt(decryptInput, decryptKey);
                    break;
                case 'Rabbit':
                    decrypted = CryptoJS.Rabbit.decrypt(decryptInput, decryptKey);
                    break;
                default:
                    throw new Error('Unsupported decryption mode');
            }

            const result = decrypted.toString(CryptoJS.enc.Utf8);
            if (!result) {
                throw new Error('Decryption failed - check your key and settings');
            }

            const finalOutput = decryptOutputFormat === 'Base64'
                ? CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(result))
                : result;

            setDecryptOutput(finalOutput);
        } catch (err) {
            setDecryptError((err as Error).message);
        }
    };

    // AES-GCM decryption using Web Crypto API
    const decryptWithGCM = async () => {
        try {
            // Prepare key
            const keyData = new TextEncoder().encode(decryptKey.padEnd(decryptKeySize / 8, '0').substring(0, decryptKeySize / 8));
            const key = await window.crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );

            // Decode input
            const combined = decryptInput.includes(' ') || decryptInput.includes('+') || decryptInput.includes('/')
                ? Uint8Array.from(atob(decryptInput), c => c.charCodeAt(0))
                : Uint8Array.from(decryptInput.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

            // Extract IV (first 12 bytes) and ciphertext
            const iv = combined.slice(0, 12);
            const ciphertext = combined.slice(12);

            // Decrypt
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                    tagLength: 128
                },
                key,
                ciphertext
            );

            const result = new TextDecoder().decode(decrypted);

            if (!result) {
                throw new Error('Decryption failed - check your key and settings');
            }

            const finalOutput = decryptOutputFormat === 'Base64'
                ? btoa(result)
                : result;

            setDecryptOutput(finalOutput);
        } catch (err) {
            setDecryptError((err as Error).message || 'Decryption failed - check your key and settings');
        }
    };

    const handleCopy = async (text: string, type: 'encrypt' | 'decrypt') => {
        await navigator.clipboard.writeText(text);
        if (type === 'encrypt') {
            setEncryptCopied(true);
            setTimeout(() => setEncryptCopied(false), 2000);
        } else {
            setDecryptCopied(true);
            setTimeout(() => setDecryptCopied(false), 2000);
        }
    };

    const modesWithIV = ['CBC', 'CFB', 'OFB', 'CTR', 'GCM'];

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <Lock className="text-blue-600" />
                        {encryptMode} {t('encryption.title')}
                    </h2>
                    <div className="flex gap-2 mt-4">
                        {(['AES', 'DES', 'TripleDES', 'RC4', 'Rabbit'] as EncryptionMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setEncryptMode(mode)}
                                className={`px-4 py-2 rounded-lg transition-colors ${encryptMode === mode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Usage Guide */}
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <details>
                            <summary className="cursor-pointer font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                <HelpCircle size={18} />
                                📚 {t('encryption.guide.title')}
                            </summary>
                            <div className="mt-3 space-y-3 text-sm text-blue-800 dark:text-blue-200">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
                                    <p className="font-semibold mb-2">{t('encryption.guide.exampleTitle')}</p>

                                    <div className="space-y-2">
                                        <div>
                                            <p className="font-medium text-green-700 dark:text-green-400">{t('encryption.guide.step1')}</p>
                                            <ul className="ml-4 mt-1 space-y-1 text-xs">
                                                <li>• {t('encryption.guide.plainText')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Hello, World!</code></li>
                                                <li>• {t('encryption.guide.cipherMode')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">GCM</code></li>
                                                <li>• {t('encryption.guide.keySize')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">128 bits</code></li>
                                                <li>• {t('encryption.guide.secretKey')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">mySecretKey12345</code></li>
                                                <li>• {t('encryption.guide.outputFormat')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Base64</code></li>
                                                <li>• {t('encryption.guide.clickEncrypt')}</li>
                                                <li>• {t('encryption.guide.copyOutput')}</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="font-medium text-purple-700 dark:text-purple-400">{t('encryption.guide.step2')}</p>
                                            <ul className="ml-4 mt-1 space-y-1 text-xs">
                                                <li>• {t('encryption.guide.pasteInput')}</li>
                                                <li>• {t('encryption.guide.useSameSettings')}:</li>
                                                <li className="ml-4">- {t('encryption.guide.cipherMode')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">GCM</code></li>
                                                <li className="ml-4">- {t('encryption.guide.keySize')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">128 bits</code></li>
                                                <li className="ml-4">- {t('encryption.guide.secretKey')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">mySecretKey12345</code></li>
                                                <li>• {t('encryption.guide.outputFormat')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Plain-Text</code></li>
                                                <li>• {t('encryption.guide.clickDecrypt')}</li>
                                                <li>• {t('encryption.guide.result')}: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Hello, World!</code></li>
                                            </ul>
                                        </div>

                                        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded">
                                            <p className="font-semibold text-yellow-900 dark:text-yellow-200">⚠️ {t('encryption.guide.importantNotes')}:</p>
                                            <ul className="ml-4 mt-1 space-y-1 text-xs text-yellow-800 dark:text-yellow-300">
                                                <li>• {t('encryption.guide.noteGCM')}</li>
                                                <li>• {t('encryption.guide.noteCBC')}</li>
                                                <li>• {t('encryption.guide.noteKey')}</li>
                                                <li>• {t('encryption.guide.noteSettings')}</li>
                                                <li>• {t('encryption.guide.noteKeySize')}</li>
                                            </ul>
                                        </div>

                                        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded">
                                            <p className="font-semibold text-green-900 dark:text-green-200">💡 {t('encryption.guide.recommendations')}:</p>
                                            <ul className="ml-4 mt-1 space-y-1 text-xs text-green-800 dark:text-green-300">
                                                <li>• {t('encryption.guide.recGCM')}</li>
                                                <li>• {t('encryption.guide.recKey')}</li>
                                                <li>• {t('encryption.guide.recECB')}</li>
                                                <li>• {t('encryption.guide.recAndroid')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    {/* Encryption Panel */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {encryptMode} Encryption
                        </h3>

                        {/* Input Text */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('encryption.plaintext')}
                            </label>
                            <textarea
                                value={encryptInput}
                                onChange={(e) => setEncryptInput(e.target.value)}
                                placeholder={t('encryption.plaintextPlaceholder')}
                                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {['AES', 'DES', 'TripleDES'].includes(encryptMode) && (
                            <>
                                {/* Cipher Mode */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                        {t('encryption.cipherMode')}
                                        <Tooltip text={t('encryption.cipherModeTooltip')}>
                                            <HelpCircle size={14} className="text-gray-400" />
                                        </Tooltip>
                                    </label>
                                    <select
                                        value={encryptCipherMode}
                                        onChange={(e) => setEncryptCipherMode(e.target.value as CipherMode)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="CBC">CBC</option>
                                        <option value="ECB">ECB</option>
                                        <option value="CFB">CFB</option>
                                        <option value="OFB">OFB</option>
                                        <option value="CTR">CTR</option>
                                        <option value="GCM">GCM (Galois/Counter Mode)</option>
                                    </select>
                                </div>

                                {/* Padding */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                        {t('encryption.padding')}
                                        <Tooltip text={t('encryption.paddingTooltip')}>
                                            <HelpCircle size={14} className="text-gray-400" />
                                        </Tooltip>
                                    </label>
                                    <select
                                        value={encryptPadding}
                                        onChange={(e) => setEncryptPadding(e.target.value as PaddingScheme)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pkcs7">PKCS5Padding / PKCS7</option>
                                        <option value="NoPadding">NoPadding</option>
                                        <option value="ZeroPadding">ZeroPadding</option>
                                        <option value="Iso10126">Iso10126</option>
                                        <option value="Iso97971">Iso97971</option>
                                    </select>
                                </div>

                                {/* IV */}
                                {modesWithIV.includes(encryptCipherMode) && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                            {t('encryption.ivLabel')}
                                            <Tooltip text={t('encryption.ivTooltip')}>
                                                <HelpCircle size={14} className="text-gray-400" />
                                            </Tooltip>
                                        </label>
                                        <input
                                            type="text"
                                            value={encryptIv}
                                            onChange={(e) => setEncryptIv(e.target.value)}
                                            placeholder={t('encryption.ivPlaceholder')}
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                {/* Key Size */}
                                {encryptMode === 'AES' && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                            {t('encryption.keySize')}
                                            <Tooltip text={t('encryption.keySizeTooltip')}>
                                                <HelpCircle size={14} className="text-gray-400" />
                                            </Tooltip>
                                        </label>
                                        <select
                                            value={encryptKeySize}
                                            onChange={(e) => setEncryptKeySize(Number(e.target.value) as 128 | 192 | 256)}
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="128">128</option>
                                            <option value="192">192</option>
                                            <option value="256">256</option>
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Secret Key */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                {t('encryption.secretKey')}
                                <Tooltip text={t('encryption.secretKeyTooltip')}>
                                    <HelpCircle size={14} className="text-gray-400" />
                                </Tooltip>
                            </label>
                            <input
                                type="text"
                                value={encryptKey}
                                onChange={(e) => setEncryptKey(e.target.value)}
                                placeholder={t('encryption.passwordPlaceholder')}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Output Format */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('encryption.outputFormat')}
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={encryptOutputFormat === 'Base64'}
                                        onChange={() => setEncryptOutputFormat('Base64')}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Base64</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={encryptOutputFormat === 'Hex'}
                                        onChange={() => setEncryptOutputFormat('Hex')}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Hex</span>
                                </label>
                            </div>
                        </div>

                        {/* Encrypt Button */}
                        <button
                            onClick={handleEncrypt}
                            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            {t('encryption.encrypt')}
                        </button>

                        {/* Output */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('encryption.encryptOutput', { mode: encryptMode })}
                                </label>
                                {encryptOutput && (
                                    <button
                                        onClick={() => handleCopy(encryptOutput, 'encrypt')}
                                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                    >
                                        {encryptCopied ? <Check size={14} /> : <Copy size={14} />}
                                        {encryptCopied ? t('common.copied') : t('common.copy')}
                                    </button>
                                )}
                            </div>
                            <div className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-auto">
                                {encryptError ? (
                                    <div className="text-red-500 text-sm">{encryptError}</div>
                                ) : encryptOutput ? (
                                    <pre className="text-gray-800 dark:text-gray-200 text-sm break-all whitespace-pre-wrap font-mono">
                                        {encryptOutput}
                                    </pre>
                                ) : (
                                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                                        {t('encryption.outputPlaceholder')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Decryption Panel */}
                    <div className="flex flex-col gap-4 border-l-0 lg:border-l border-gray-200 dark:border-gray-700 lg:pl-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {encryptMode} Decryption
                        </h3>

                        {/* Input Text */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('encryption.ciphertext')}
                            </label>
                            <textarea
                                value={decryptInput}
                                onChange={(e) => setDecryptInput(e.target.value)}
                                placeholder={t('encryption.ciphertextPlaceholder')}
                                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {['AES', 'DES', 'TripleDES'].includes(encryptMode) && (
                            <>
                                {/* Cipher Mode */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                        {t('encryption.cipherMode')}
                                        <Tooltip text={t('encryption.cipherModeTooltip')}>
                                            <HelpCircle size={14} className="text-gray-400" />
                                        </Tooltip>
                                    </label>
                                    <select
                                        value={decryptCipherMode}
                                        onChange={(e) => setDecryptCipherMode(e.target.value as CipherMode)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="CBC">CBC</option>
                                        <option value="ECB">ECB</option>
                                        <option value="CFB">CFB</option>
                                        <option value="OFB">OFB</option>
                                        <option value="CTR">CTR</option>
                                        <option value="GCM">GCM (Galois/Counter Mode)</option>
                                    </select>
                                </div>

                                {/* Padding */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                        {t('encryption.padding')}
                                        <Tooltip text={t('encryption.paddingTooltip')}>
                                            <HelpCircle size={14} className="text-gray-400" />
                                        </Tooltip>
                                    </label>
                                    <select
                                        value={decryptPadding}
                                        onChange={(e) => setDecryptPadding(e.target.value as PaddingScheme)}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pkcs7">PKCS5Padding / PKCS7</option>
                                        <option value="NoPadding">NoPadding</option>
                                        <option value="ZeroPadding">ZeroPadding</option>
                                        <option value="Iso10126">Iso10126</option>
                                        <option value="Iso97971">Iso97971</option>
                                    </select>
                                </div>

                                {/* IV */}
                                {modesWithIV.includes(decryptCipherMode) && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                            {t('encryption.ivLabel')}
                                            <Tooltip text={t('encryption.ivTooltip')}>
                                                <HelpCircle size={14} className="text-gray-400" />
                                            </Tooltip>
                                        </label>
                                        <input
                                            type="text"
                                            value={decryptIv}
                                            onChange={(e) => setDecryptIv(e.target.value)}
                                            placeholder={t('encryption.ivPlaceholder')}
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                {/* Key Size */}
                                {encryptMode === 'AES' && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                            {t('encryption.keySize')}
                                            <Tooltip text={t('encryption.keySizeTooltip')}>
                                                <HelpCircle size={14} className="text-gray-400" />
                                            </Tooltip>
                                        </label>
                                        <select
                                            value={decryptKeySize}
                                            onChange={(e) => setDecryptKeySize(Number(e.target.value) as 128 | 192 | 256)}
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="128">128</option>
                                            <option value="192">192</option>
                                            <option value="256">256</option>
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Secret Key */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                {t('encryption.secretKey')}
                                <Tooltip text={t('encryption.secretKeyTooltip')}>
                                    <HelpCircle size={14} className="text-gray-400" />
                                </Tooltip>
                            </label>
                            <input
                                type="text"
                                value={decryptKey}
                                onChange={(e) => setDecryptKey(e.target.value)}
                                placeholder={t('encryption.passwordPlaceholder')}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Output Format */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('encryption.outputFormat')}
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={decryptOutputFormat === 'Plain-Text'}
                                        onChange={() => setDecryptOutputFormat('Plain-Text')}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Plain-Text</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={decryptOutputFormat === 'Base64'}
                                        onChange={() => setDecryptOutputFormat('Base64')}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Base64</span>
                                </label>
                            </div>
                        </div>

                        {/* Decrypt Button */}
                        <button
                            onClick={handleDecrypt}
                            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            {t('encryption.decrypt')}
                        </button>

                        {/* Output */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('encryption.decryptOutput', { mode: encryptMode })}
                                </label>
                                {decryptOutput && (
                                    <button
                                        onClick={() => handleCopy(decryptOutput, 'decrypt')}
                                        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                    >
                                        {decryptCopied ? <Check size={14} /> : <Copy size={14} />}
                                        {decryptCopied ? t('common.copied') : t('common.copy')}
                                    </button>
                                )}
                            </div>
                            <div className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-auto">
                                {decryptError ? (
                                    <div className="text-red-500 text-sm">{decryptError}</div>
                                ) : decryptOutput ? (
                                    <pre className="text-gray-800 dark:text-gray-200 text-sm break-all whitespace-pre-wrap font-mono">
                                        {decryptOutput}
                                    </pre>
                                ) : (
                                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                                        {t('encryption.outputPlaceholder')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
