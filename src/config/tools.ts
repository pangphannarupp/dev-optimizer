import { useTranslation } from 'react-i18next';
import {
    Image as ImageIcon, Layers, Sparkles, QrCode, FileCode, Code, Key, Lock, Hash,
    FileUp, Split, Film, Link, ScanLine, Palette, Zap, Clock, Monitor,
    Smartphone, KeyRound, CheckCircle, Database, Book, Binary, Terminal, Mic, FileText, Download
} from 'lucide-react';

export type ToolId =
    | 'optimizer' | 'generator' | 'enhancer' | 'source-compare' | 'lottie-player'
    | 'store-validator' | 'js-minifier' | 'curl-converter' | 'unix-timestamp'
    | 'density-converter' | 'regex-tester' | 'css-generator' | 'screenshot-framer'
    | 'totp-generator' | 'deeplink-generator' | 'qr' | 'svg-drawable' | 'base64'
    | 'json' | 'json-to-code' | 'csv-json' | 'validate-translation' | 'jwt' | 'encryption' | 'sha'
    | 'download' | 'editor' | 'code-quality' | 'mock-data' | 'markdown-editor' | 'developer-guide' | 'code-playground' | 'dsa-tutorial' | 'programming-tutorial' | 'screen-audio-maker' | 'cv-generator' | 'youtube-downloader' | 'project-translation-verifier' | 'watermark-remover';

export interface Tool {
    id: ToolId;
    icon: any;
    label: string;
    description?: string;
    path?: string;
    category?: string;
}

export const useTools = () => {
    const { t } = useTranslation();

    const tools: Tool[] = [
        { id: 'optimizer', icon: ImageIcon, label: t('app.optimizerTab'), description: 'Compress and optimize images' },
        { id: 'generator', icon: Layers, label: t('app.generatorTab'), description: 'Generate app icons and assets' },
        { id: 'enhancer', icon: Sparkles, label: t('app.enhancerTab'), description: 'Enhance image quality' },
        { id: 'source-compare', icon: Split, label: t('sourceCompare.title'), description: 'Compare code or text files' },
        { id: 'lottie-player', icon: Film, label: t('lottie.title', 'Lottie Player'), description: 'Preview Lottie animations/JSON' },
        { id: 'store-validator', icon: Layers, label: t('app.storeValidatorTab'), description: 'Validate App Store assets' },
        { id: 'js-minifier', icon: FileCode, label: t('jsMinifier.title', 'JS Minifier'), description: 'Minify JavaScript code' },
        { id: 'curl-converter', icon: Zap, label: t('curlConverter.title', 'CURL Converter'), description: 'Convert cURL to code' },
        { id: 'unix-timestamp', icon: Clock, label: t('unixConverter.title', 'Unix Timestamp Converter'), description: 'Convert epoch timestamps' },
        { id: 'density-converter', icon: Monitor, label: t('densityConverter.title', 'Density Converter'), description: 'Px to dp/pt converter' },
        { id: 'regex-tester', icon: ScanLine, label: t('regexTester.title', 'Regex Tester'), description: 'Test regular expressions' },
        { id: 'css-generator', icon: Palette, label: t('cssGenerator.title', 'CSS Generator'), description: 'Generate CSS snippets' },
        { id: 'screenshot-framer', icon: Smartphone, label: t('screenshotFramer.title', 'Screenshot Framer'), description: 'Frame screenshots for stores' },
        { id: 'totp-generator', icon: KeyRound, label: t('totp.title', 'TOTP Generator'), description: 'Generate 2FA codes' },
        { id: 'deeplink-generator', icon: Link, label: t('deeplink.title', 'Deeplink Generator'), description: 'Create mobile deep links' },
        { id: 'qr', icon: QrCode, label: t('app.qrTab'), description: 'Generate QR codes' },
        { id: 'svg-drawable', icon: FileCode, label: t('app.svgTab'), description: 'Convert SVG to Android Drawable' },
        { id: 'base64', icon: FileCode, label: t('app.base64Tab'), description: 'Image to Base64 converter' },
        { id: 'json-to-code', icon: FileCode, label: t('jsonToCode.title'), description: t('jsonToCode.description') },
        { id: 'json', icon: Code, label: t('app.jsonTab'), description: 'Format and validate JSON' },
        { id: 'csv-json', icon: FileCode, label: t('app.csvJsonTab'), description: 'Convert CSV to JSON' },
        { id: 'validate-translation', icon: FileUp, label: t('app.validateTranslation', 'Validate Translation'), description: 'Check translation files' },
        { id: 'jwt', icon: Key, label: t('app.jwtTab'), description: 'Decode JWT tokens' },
        { id: 'encryption', icon: Lock, label: t('app.encryptionTab'), description: 'Encrypt/Decrypt text' },
        { id: 'sha', icon: Hash, label: t('app.shaTab'), description: 'Generate SHA hashes' },
        { id: 'code-quality', icon: CheckCircle, label: t('codeQuality.title', 'Code Quality Checker'), description: t('codeQuality.description') },
        { id: 'mock-data', icon: Database, label: t('mockData.title'), description: t('mockData.description') },
        { id: 'markdown-editor', icon: FileCode, label: t('markdownEditor.title', 'Markdown Editor'), description: t('markdownEditor.description', 'Edit and Preview Markdown') },
        { id: 'developer-guide', icon: Book, label: t('developerGuide.title', 'Developer Guide'), description: t('developerGuide.description', 'Generate documentation from code') },
        // { id: 'download', icon: Download, label: t('app.downloadTab', 'Download App'), description: 'Get the mobile app' },
        { id: 'code-playground', icon: Code, label: t('codePlayground.title', 'Code Playground'), description: t('codePlayground.description', 'Write and run code (Kotlin, Swift, Flutter, Web)') },
        { id: 'dsa-tutorial', icon: Binary, label: t('dsa.title', 'DSA Tutorial'), description: t('dsa.description', 'Learn Data Structures & Algorithms') },
        { id: 'programming-tutorial', icon: Terminal, label: 'Programming Tutorial', description: 'Learn Android, iOS, Web & More' },
        { id: 'screen-audio-maker', icon: Mic, label: 'Screen Audio Maker', description: 'Convert text to speech' },
        { id: 'cv-generator', icon: FileText, label: 'CV Generator', description: 'Create professionals resumes and export to PDF/Word' },
        { id: 'youtube-downloader', icon: Download, label: 'YouTube Downloader', description: 'Download videos and playlists' },
        { id: 'project-translation-verifier', icon: CheckCircle, label: t('projectTranslationVerifier.title', 'Project Translation Verifier'), description: t('projectTranslationVerifier.description', 'Verify translation keys in project') },
        { id: 'watermark-remover', icon: Sparkles, label: t('watermarkRemover.title', 'Watermark Remover AI'), description: t('watermarkRemover.description', 'Remove watermarks from images using AI') },
    ];

    return tools;
};
