import React, { useState, useCallback, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode as QrCodeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type QRType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'location' | 'event';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

interface QROptions {
    size: number;
    foreground: string;
    background: string;
    errorCorrectionLevel: ErrorCorrectionLevel;
    margin: number;
}

export const QRGenerator: React.FC = () => {
    const [qrType, setQrType] = useState<QRType>('text');
    const [qrData, setQrData] = useState('');
    const [qrOptions, setQrOptions] = useState<QROptions>({
        size: 300,
        foreground: '#000000',
        background: '#ffffff',
        errorCorrectionLevel: 'M',
        margin: 4
    });

    // Type-specific fields
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

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useTranslation();

    // Generate QR data based on type
    const generateQRData = useCallback(() => {
        let data = '';

        switch (qrType) {
            case 'text':
                data = text;
                break;
            case 'url':
                data = url;
                break;
            case 'email':
                data = `mailto:${email}`;
                if (emailSubject || emailBody) {
                    data += '?';
                    if (emailSubject) data += `subject=${encodeURIComponent(emailSubject)}`;
                    if (emailSubject && emailBody) data += '&';
                    if (emailBody) data += `body=${encodeURIComponent(emailBody)}`;
                }
                break;
            case 'phone':
                data = `tel:${phone}`;
                break;
            case 'sms':
                data = `smsto:${smsNumber}:${smsMessage}`;
                break;
            case 'wifi':
                data = `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`;
                break;
            case 'vcard':
                data = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\n`;
                if (vcardPhone) data += `TEL:${vcardPhone}\n`;
                if (vcardEmail) data += `EMAIL:${vcardEmail}\n`;
                if (vcardOrg) data += `ORG:${vcardOrg}\n`;
                data += 'END:VCARD';
                break;
            case 'location':
                data = `geo:${latitude},${longitude}`;
                break;
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

    // Generate QR code on canvas
    useEffect(() => {
        const data = generateQRData();
        if (!data || !canvasRef.current) return;

        QRCode.toCanvas(canvasRef.current, data, {
            width: qrOptions.size,
            margin: qrOptions.margin,
            color: {
                dark: qrOptions.foreground,
                light: qrOptions.background
            },
            errorCorrectionLevel: qrOptions.errorCorrectionLevel
        }).catch(err => {
            console.error('QR Code generation error:', err);
        });
    }, [qrData, qrOptions, generateQRData]);

    const downloadQR = useCallback((format: 'png' | 'svg') => {
        const data = generateQRData();
        if (!data) return;

        if (format === 'png' && canvasRef.current) {
            const url = canvasRef.current.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode-${qrType}.png`;
            link.click();
        } else if (format === 'svg') {
            QRCode.toString(data, {
                type: 'svg',
                width: qrOptions.size,
                margin: qrOptions.margin,
                color: {
                    dark: qrOptions.foreground,
                    light: qrOptions.background
                },
                errorCorrectionLevel: qrOptions.errorCorrectionLevel
            }).then(svg => {
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qrcode-${qrType}.svg`;
                link.click();
                URL.revokeObjectURL(url);
            });
        }
    }, [qrType, qrOptions, generateQRData]);

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <QrCodeIcon className="text-indigo-600" />
                    {t('qrGenerator.title')}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column - Inputs */}
                    <div className="space-y-4">
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
                            {qrType === 'text' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('qrGenerator.fields.text')}
                                    </label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                        placeholder={t('qrGenerator.placeholders.text')}
                                    />
                                </div>
                            )}

                            {qrType === 'url' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('qrGenerator.fields.url')}
                                    </label>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            )}

                            {qrType === 'email' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.email')}
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.subject')}
                                        </label>
                                        <input
                                            type="text"
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder={t('qrGenerator.placeholders.subject')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.body')}
                                        </label>
                                        <textarea
                                            value={emailBody}
                                            onChange={(e) => setEmailBody(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder={t('qrGenerator.placeholders.body')}
                                        />
                                    </div>
                                </div>
                            )}

                            {qrType === 'phone' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('qrGenerator.fields.phone')}
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                        placeholder="+1234567890"
                                    />
                                </div>
                            )}

                            {qrType === 'sms' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.phone')}
                                        </label>
                                        <input
                                            type="tel"
                                            value={smsNumber}
                                            onChange={(e) => setSmsNumber(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.message')}
                                        </label>
                                        <textarea
                                            value={smsMessage}
                                            onChange={(e) => setSmsMessage(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder={t('qrGenerator.placeholders.message')}
                                        />
                                    </div>
                                </div>
                            )}

                            {qrType === 'wifi' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.ssid')}
                                        </label>
                                        <input
                                            type="text"
                                            value={wifiSSID}
                                            onChange={(e) => setWifiSSID(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="Network Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.password')}
                                        </label>
                                        <input
                                            type="text"
                                            value={wifiPassword}
                                            onChange={(e) => setWifiPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.encryption')}
                                        </label>
                                        <select
                                            value={wifiEncryption}
                                            onChange={(e) => setWifiEncryption(e.target.value as WifiEncryption)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                        >
                                            <option value="WPA">WPA/WPA2</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">{t('qrGenerator.noPassword')}</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {qrType === 'vcard' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.name')}
                                        </label>
                                        <input
                                            type="text"
                                            value={vcardName}
                                            onChange={(e) => setVcardName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.phone')}
                                        </label>
                                        <input
                                            type="tel"
                                            value={vcardPhone}
                                            onChange={(e) => setVcardPhone(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.email')}
                                        </label>
                                        <input
                                            type="email"
                                            value={vcardEmail}
                                            onChange={(e) => setVcardEmail(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.organization')}
                                        </label>
                                        <input
                                            type="text"
                                            value={vcardOrg}
                                            onChange={(e) => setVcardOrg(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="Company Name"
                                        />
                                    </div>
                                </div>
                            )}

                            {qrType === 'location' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.latitude')}
                                        </label>
                                        <input
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="37.7749"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.longitude')}
                                        </label>
                                        <input
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="-122.4194"
                                        />
                                    </div>
                                </div>
                            )}

                            {qrType === 'event' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.eventTitle')}
                                        </label>
                                        <input
                                            type="text"
                                            value={eventTitle}
                                            onChange={(e) => setEventTitle(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="Event Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.location')}
                                        </label>
                                        <input
                                            type="text"
                                            value={eventLocation}
                                            onChange={(e) => setEventLocation(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            placeholder="Event Location"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.startTime')}
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={eventStart}
                                            onChange={(e) => setEventStart(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t('qrGenerator.fields.endTime')}
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={eventEnd}
                                            onChange={(e) => setEventEnd(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Customization Options */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {t('qrGenerator.customization')}
                            </h3>

                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    {t('qrGenerator.size')}: {qrOptions.size}px
                                </label>
                                <input
                                    type="range"
                                    min="128"
                                    max="1024"
                                    step="32"
                                    value={qrOptions.size}
                                    onChange={(e) => setQrOptions({ ...qrOptions, size: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                        {t('qrGenerator.foregroundColor')}
                                    </label>
                                    <input
                                        type="color"
                                        value={qrOptions.foreground}
                                        onChange={(e) => setQrOptions({ ...qrOptions, foreground: e.target.value })}
                                        className="w-full h-10 rounded cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                        {t('qrGenerator.backgroundColor')}
                                    </label>
                                    <input
                                        type="color"
                                        value={qrOptions.background}
                                        onChange={(e) => setQrOptions({ ...qrOptions, background: e.target.value })}
                                        className="w-full h-10 rounded cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    {t('qrGenerator.errorCorrection')}
                                </label>
                                <select
                                    value={qrOptions.errorCorrectionLevel}
                                    onChange={(e) => setQrOptions({ ...qrOptions, errorCorrectionLevel: e.target.value as ErrorCorrectionLevel })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                >
                                    <option value="L">Low (7%)</option>
                                    <option value="M">Medium (15%)</option>
                                    <option value="Q">Quartile (25%)</option>
                                    <option value="H">High (30%)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview & Download */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900">
                            <canvas ref={canvasRef} className="max-w-full h-auto" />
                        </div>

                        <div className="flex gap-2 w-full">
                            <button
                                onClick={() => downloadQR('png')}
                                disabled={!qrData}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                PNG
                            </button>
                            <button
                                onClick={() => downloadQR('svg')}
                                disabled={!qrData}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                SVG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
