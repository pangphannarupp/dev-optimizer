import React, { useState, useCallback, useEffect, useRef } from 'react';
import QRCodeStyling, {
    Options
} from 'qr-code-styling';
import Barcode from 'react-barcode';
import { Html5Qrcode } from 'html5-qrcode';
import { Download, QrCode as QrCodeIcon, ScanBarcode, Eraser, Scan } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';

type QRType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'location' | 'event';
type WifiEncryption = 'WPA' | 'WEP' | 'nopass';
type GeneratorMode = 'qr' | 'barcode' | 'scan';

// Define simple types since export might be missing/different
type DotType = 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
type CornerDotType = 'dot' | 'square';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface QROptions {
    size: number;
    foreground: string;
    background: string;
    errorCorrectionLevel: ErrorCorrectionLevel;
    margin: number;
    dotType: DotType;
    cornerSquareType: CornerSquareType;
    cornerDotType: CornerDotType;
    image?: string;
}


export const QRGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [mode, setMode] = useState<GeneratorMode>('qr');

    // --- QR State ---
    const [qrType, setQrType] = useState<QRType>('text');
    const [qrData, setQrData] = useState('');
    const [qrOptions, setQrOptions] = useState<QROptions>({
        size: 300,
        foreground: '#000000',
        background: '#ffffff',
        errorCorrectionLevel: 'M',
        margin: 4,
        dotType: 'square',
        cornerSquareType: 'square',
        cornerDotType: 'square'
    });

    // Type-specific fields (QR)
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [email, setEmail] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [phone, setPhone] = useState('');
    const [smsNumber, setSmsNumber] = useState('');
    const [smsMessage, setSmsMessage] = useState('');
    const [wifiSSID, setWifiSSID] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [wifiEncryption, setWifiEncryption] = useState<WifiEncryption>('WPA');
    const [vcardName, setVcardName] = useState('');
    const [vcardPhone, setVcardPhone] = useState('');
    const [vcardEmail, setVcardEmail] = useState('');
    const [vcardOrg, setVcardOrg] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventStart, setEventStart] = useState('');
    const [eventEnd, setEventEnd] = useState('');

    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // --- Barcode State ---
    const [barcodeValue, setBarcodeValue] = useState('');
    const [barcodeFormat, setBarcodeFormat] = useState<string>('CODE128');
    const [barcodeWidth, setBarcodeWidth] = useState(2);
    const [barcodeHeight, setBarcodeHeight] = useState(100);
    const [barcodeMargin, setBarcodeMargin] = useState(10);
    const [barcodeDisplayValue, setBarcodeDisplayValue] = useState(true);

    // --- Scanner State ---
    const [scannedResult, setScannedResult] = useState<string>('');
    const [scanError, setScanError] = useState<string>('');
    const [isScanning, setIsScanning] = useState(false);

    // --- QR Generation Logic ---
    const generateQRData = useCallback(() => {
        let data = '';
        switch (qrType) {
            case 'text': data = text; break;
            case 'url': data = url; break;
            case 'email':
                data = `mailto:${email}`;
                if (emailSubject || emailBody) {
                    data += '?';
                    if (emailSubject) data += `subject=${encodeURIComponent(emailSubject)}`;
                    if (emailSubject && emailBody) data += '&';
                    if (emailBody) data += `body=${encodeURIComponent(emailBody)}`;
                }
                break;
            case 'phone': data = `tel:${phone}`; break;
            case 'sms': data = `smsto:${smsNumber}:${smsMessage}`; break;
            case 'wifi': data = `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`; break;
            case 'vcard':
                data = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\n`;
                if (vcardPhone) data += `TEL:${vcardPhone}\n`;
                if (vcardEmail) data += `EMAIL:${vcardEmail}\n`;
                if (vcardOrg) data += `ORG:${vcardOrg}\n`;
                data += 'END:VCARD';
                break;
            case 'location': data = `geo:${latitude},${longitude}`; break;
            case 'event':
                data = `BEGIN:VEVENT\nSUMMARY:${eventTitle}\n`;
                if (eventLocation) data += `LOCATION:${eventLocation}\n`;
                if (eventStart) data += `DTSTART:${eventStart.replace(/[-:]/g, '')}\n`;
                if (eventEnd) data += `DTEND:${eventEnd.replace(/[-:]/g, '')}\n`;
                data += 'END:VEVENT';
                break;
        }
        setQrData(data);
        return data;
    }, [qrType, text, url, email, emailSubject, emailBody, phone, smsNumber, smsMessage,
        wifiSSID, wifiPassword, wifiEncryption, vcardName, vcardPhone, vcardEmail, vcardOrg,
        latitude, longitude, eventTitle, eventLocation, eventStart, eventEnd]);

    // Initialize QR Styling
    useEffect(() => {
        qrCodeRef.current = new QRCodeStyling({
            width: qrOptions.size,
            height: qrOptions.size,
            margin: qrOptions.margin,
            imageOptions: {
                saveAsBlob: true,
                crossOrigin: "anonymous",
                margin: 5
            }
        });
    }, []);

    // Update QR Code
    useEffect(() => {
        if (qrCodeRef.current && canvasRef.current) {
            const data = generateQRData();
            if (!data) return;

            // Clear previous canvas
            canvasRef.current.innerHTML = '';

            const options: Options = {
                width: qrOptions.size,
                height: qrOptions.size,
                data: data,
                margin: qrOptions.margin,
                image: qrOptions.image,
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 5
                },
                dotsOptions: {
                    type: qrOptions.dotType,
                    color: qrOptions.foreground
                },
                backgroundOptions: {
                    color: qrOptions.background,
                },
                cornersSquareOptions: {
                    type: qrOptions.cornerSquareType,
                    color: qrOptions.foreground
                },
                cornersDotOptions: {
                    type: qrOptions.cornerDotType,
                    color: qrOptions.foreground
                },
                qrOptions: {
                    typeNumber: 0,
                    mode: 'Byte',
                    errorCorrectionLevel: qrOptions.errorCorrectionLevel
                }
            };

            qrCodeRef.current.update(options);
            qrCodeRef.current.append(canvasRef.current);
        }
    }, [qrData, qrOptions, generateQRData, mode]);

    const handleImageUpload = (files: File[]) => {
        const file = files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setQrOptions(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setQrOptions(prev => ({ ...prev, image: undefined }));
    };

    const downloadQR = useCallback((format: 'png' | 'svg' | 'jpeg' | 'webp') => {
        if (qrCodeRef.current) {
            qrCodeRef.current.download({
                name: `qrcode-${qrType}`,
                extension: format
            });
        }
    }, [qrType, qrOptions]);

    const downloadBarcodeImage = (format: 'png' | 'svg') => {
        const svg = document.querySelector('#barcode-svg svg');
        if (!svg) return;

        const serializer = new XMLSerializer();
        const svgData = serializer.serializeToString(svg);

        if (format === 'svg') {
            const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `barcode-${barcodeValue || 'code'}.svg`;
            link.click();
        } else {
            // PNG logic
            const canvas = document.createElement('canvas');
            const item = svg.getBoundingClientRect();
            // High res multiplier
            const scale = 2;
            canvas.width = item.width * scale;
            canvas.height = item.height * scale;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(scale, scale);

            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.download = `barcode-${barcodeValue || 'code'}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        }
    };

    const handleScanFile = async (files: File[]) => {
        const file = files[0];
        if (!file) return;

        setIsScanning(true);
        setScanError('');
        setScannedResult('');

        try {
            const html5QrCode = new Html5Qrcode("reader");
            const result = await html5QrCode.scanFile(file, true);
            setScannedResult(result);
        } catch (err) {
            console.error("Error scanning file", err);
            setScanError(t('qrGenerator.scanError') || 'Failed to read QR/Barcode. Please try a clearer image.');
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        {mode === 'qr' && <QrCodeIcon className="text-indigo-600" />}
                        {mode === 'barcode' && <ScanBarcode className="text-indigo-600" />}
                        {mode === 'scan' && <Scan className="text-indigo-600" />}
                        {mode === 'qr' ? t('qrGenerator.title') : mode === 'barcode' ? t('qrGenerator.barcode') : t('qrGenerator.scanner')}
                    </h2>

                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setMode('qr')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'qr'
                                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {t('qrGenerator.modes.qr')}
                        </button>
                        <button
                            onClick={() => setMode('barcode')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'barcode'
                                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {t('qrGenerator.modes.barcode')}
                        </button>
                        <button
                            onClick={() => setMode('scan')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'scan'
                                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {t('qrGenerator.modes.scan')}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Inputs */}
                    <div className="space-y-6">
                        {mode === 'qr' ? (
                            <>
                                {/* QR Type Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('qrGenerator.qrType')}
                                    </label>
                                    <select
                                        value={qrType}
                                        onChange={(e) => setQrType(e.target.value as QRType)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="text">{t('qrGenerator.types.text')}</option>
                                        <option value="url">{t('qrGenerator.types.url')}</option>
                                        <option value="email">{t('qrGenerator.types.email')}</option>
                                        <option value="phone">{t('qrGenerator.types.phone')}</option>
                                        <option value="sms">{t('qrGenerator.types.sms')}</option>
                                        <option value="wifi">{t('qrGenerator.types.wifi')}</option>
                                        <option value="vcard">{t('qrGenerator.types.vcard')}</option>
                                        <option value="location">{t('qrGenerator.types.location')}</option>
                                        <option value="event">{t('qrGenerator.types.event')}</option>
                                    </select>
                                </div>

                                {/* Type-specific inputs */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    {/* ... (Reuse existing conditionals, simplified for brevity here, but keep logic) ... */}
                                    {qrType === 'text' && (
                                        <textarea
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder={t('qrGenerator.placeholders.text')}
                                        />
                                    )}
                                    {qrType === 'url' && (
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder={t('qrGenerator.placeholders.url') || "https://example.com"}
                                        />
                                    )}
                                    {qrType === 'email' && (
                                        <div className="space-y-3">
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.email')} />
                                            <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.subject')} />
                                            <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.body')} />
                                        </div>
                                    )}
                                    {qrType === 'phone' && <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.phone')} />}
                                    {qrType === 'sms' && (
                                        <div className="space-y-3">
                                            <input type="tel" value={smsNumber} onChange={(e) => setSmsNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.phone')} />
                                            <textarea value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.message')} />
                                        </div>
                                    )}
                                    {qrType === 'wifi' && (
                                        <div className="space-y-3">
                                            <input type="text" value={wifiSSID} onChange={(e) => setWifiSSID(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.ssid')} />
                                            <input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.password')} />
                                            <select value={wifiEncryption} onChange={(e) => setWifiEncryption(e.target.value as WifiEncryption)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                                <option value="WPA">{t('qrGenerator.encryption.wpa')}</option>
                                                <option value="WEP">{t('qrGenerator.encryption.wep')}</option>
                                                <option value="nopass">{t('qrGenerator.encryption.none')}</option>
                                            </select>
                                        </div>
                                    )}

                                    {qrType === 'vcard' && (
                                        <div className="space-y-3">
                                            <input type="text" value={vcardName} onChange={(e) => setVcardName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.name')} />
                                            <input type="tel" value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.phone')} />
                                            <input type="email" value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.email')} />
                                            <input type="text" value={vcardOrg} onChange={(e) => setVcardOrg(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.organization')} />
                                        </div>
                                    )}

                                    {qrType === 'location' && (
                                        <div className="space-y-3">
                                            <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.latitude')} />
                                            <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.longitude')} />
                                        </div>
                                    )}

                                    {qrType === 'event' && (
                                        <div className="space-y-3">
                                            <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.eventTitle')} />
                                            <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder={t('qrGenerator.fields.location')} />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                                <input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Customization Options */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        {t('qrGenerator.styles')}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{t('qrGenerator.dots')}</label>
                                            <select
                                                value={qrOptions.dotType}
                                                onChange={(e) => setQrOptions({ ...qrOptions, dotType: e.target.value as DotType })}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="square">{t('qrGenerator.style.square')}</option>
                                                <option value="dots">{t('qrGenerator.style.dots')}</option>
                                                <option value="rounded">{t('qrGenerator.style.rounded')}</option>
                                                <option value="extra-rounded">{t('qrGenerator.style.extraRounded')}</option>
                                                <option value="classy">{t('qrGenerator.style.classy')}</option>
                                                <option value="classy-rounded">{t('qrGenerator.style.classyRounded')}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{t('qrGenerator.cornersSquare')}</label>
                                            <select
                                                value={qrOptions.cornerSquareType}
                                                onChange={(e) => setQrOptions({ ...qrOptions, cornerSquareType: e.target.value as CornerSquareType })}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="square">{t('qrGenerator.style.square')}</option>
                                                <option value="dot">{t('qrGenerator.style.dot')}</option>
                                                <option value="extra-rounded">{t('qrGenerator.style.extraRounded')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{t('qrGenerator.foregroundColor')}</label>
                                            <input type="color" value={qrOptions.foreground} onChange={(e) => setQrOptions({ ...qrOptions, foreground: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{t('qrGenerator.backgroundColor')}</label>
                                            <input type="color" value={qrOptions.background} onChange={(e) => setQrOptions({ ...qrOptions, background: e.target.value })} className="w-full h-8 rounded cursor-pointer" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{t('qrGenerator.uploadLogo')}</label>
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1">
                                                <DropZone
                                                    id="logo-upload"
                                                    onFilesDropped={handleImageUpload}
                                                    multiple={false}
                                                    className="p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    dragDropText={t('qrGenerator.dragLogo')}
                                                    supportedText="PNG, JPG, SVG"
                                                />
                                            </div>
                                            {qrOptions.image && (
                                                <button onClick={removeLogo} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-gray-200 dark:border-gray-700">
                                                    <Eraser size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : mode === 'barcode' ? (
                            // Barcode Inputs
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('qrGenerator.barcodeValue')}
                                    </label>
                                    <input
                                        type="text"
                                        value={barcodeValue}
                                        onChange={(e) => setBarcodeValue(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder={t('qrGenerator.placeholder.enterValue')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('qrGenerator.format')}
                                    </label>
                                    <select
                                        value={barcodeFormat}
                                        onChange={(e) => setBarcodeFormat(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="CODE128">CODE128</option>
                                        <option value="CODE39">CODE39</option>
                                        <option value="EAN13">EAN13</option>
                                        <option value="UPC">UPC</option>
                                        <option value="ITF14">ITF14</option>
                                        <option value="MSI">MSI</option>
                                        <option value="pharmacode">Pharmacode</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('qrGenerator.width')}</label>
                                        <input type="number" value={barcodeWidth} onChange={(e) => setBarcodeWidth(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" step={0.5} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('qrGenerator.height')}</label>
                                        <input type="number" value={barcodeHeight} onChange={(e) => setBarcodeHeight(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('qrGenerator.margin')}</label>
                                    <input type="number" value={barcodeMargin} onChange={(e) => setBarcodeMargin(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <input type="checkbox" checked={barcodeDisplayValue} onChange={(e) => setBarcodeDisplayValue(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-indigo-600" />
                                        {t('qrGenerator.displayValue')}
                                    </label>
                                </div>
                            </div>
                        ) : (
                            // Scan Inputs
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('qrGenerator.uploadImage')}
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <DropZone
                                        id="scan-upload"
                                        onFilesDropped={handleScanFile}
                                        multiple={false}
                                        className="w-full min-h-[160px]"
                                        dragDropText={t('qrGenerator.dragScan')}
                                        supportedText="PNG, JPG, JPEG"
                                    />
                                </div>
                                {isScanning && <p className="text-indigo-600 text-sm animate-pulse">{t('qrGenerator.scanning')}</p>}
                                {scanError && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-sm">{scanError}</div>}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Preview/Result */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            key={mode} // Force re-render to clear previous content
                            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-8 bg-white dark:bg-gray-900 flex items-center justify-center min-h-[300px] w-full relative"
                            style={{ background: mode === 'qr' ? qrOptions.background : undefined }}
                        >
                            {mode === 'qr' && <div ref={canvasRef} />}
                            {mode === 'barcode' && (
                                <div id="barcode-svg" className="bg-white p-4">
                                    <Barcode
                                        value={barcodeValue || 'EXAMPLE'}
                                        format={barcodeFormat as any}
                                        width={barcodeWidth}
                                        height={barcodeHeight}
                                        margin={barcodeMargin}
                                        displayValue={barcodeDisplayValue}
                                    />
                                </div>
                            )}
                            {mode === 'scan' && (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    <div id="reader" className="hidden"></div>
                                    {scannedResult ? (
                                        <div className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-lg break-all">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('qrGenerator.result')}</h3>
                                            <p className="text-gray-900 dark:text-white font-mono text-lg">{scannedResult}</p>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center">
                                            <Scan size={48} className="mb-2 opacity-50" />
                                            <p>{t('qrGenerator.uploadToScan')}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {mode !== 'scan' && (
                            <div className="flex gap-2 w-full max-w-xs">
                                <button
                                    onClick={() => mode === 'qr' ? downloadQR('png') : downloadBarcodeImage('png')}
                                    disabled={mode === 'qr' ? !qrData : !barcodeValue}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download size={18} />
                                    PNG
                                </button>
                                <button
                                    onClick={() => mode === 'qr' ? downloadQR('svg') : downloadBarcodeImage('svg')}
                                    disabled={mode === 'qr' ? !qrData : !barcodeValue}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download size={18} />
                                    SVG
                                </button>
                            </div>
                        )}
                        {mode === 'scan' && scannedResult && (
                            <button
                                onClick={() => navigator.clipboard.writeText(scannedResult)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                {t('qrGenerator.copyText')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
