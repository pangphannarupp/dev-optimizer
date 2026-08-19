/**
 * 100% Free Translation Engine
 * Uses smart placeholder preservation and free client endpoints with automatic failover
 */

export interface LanguageOption {
    code: string;
    name: string;
    nativeName: string;
    flag?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
    { code: 'my', name: 'Burmese (Myanmar)', nativeName: 'မြန်မာစာ' },
    { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
    { code: 'tl', name: 'Filipino (Tagalog)', nativeName: 'Tagalog' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română' },
];

/**
 * Mask code placeholders like:
 * %s, %d, %1$s, %2$d, {{name}}, {0}, {count}, @string/app_name, <br>, <b>
 * so translation engines do NOT mangle or translate variable tokens!
 */
export function maskPlaceholders(text: string): { maskedText: string; tokens: string[] } {
    if (!text) return { maskedText: '', tokens: [] };

    const tokens: string[] = [];
    let counter = 0;

    // Combined regex for all common mobile/web localization tokens
    const placeholderRegex = /(%[0-9]*\$?[a-zA-Z]|{{[^{}]+}}|{[^{}]+}|@[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+|<[^>]+>|\$[a-zA-Z0-9_]+|\b__\w+__\b)/g;

    const maskedText = text.replace(placeholderRegex, (match) => {
        const tokenPlaceholder = `___PH${counter}___`;
        tokens.push(match);
        counter++;
        return tokenPlaceholder;
    });

    return { maskedText, tokens };
}

export function unmaskPlaceholders(text: string, tokens: string[]): string {
    if (!text || tokens.length === 0) return text;

    let restored = text;
    tokens.forEach((originalToken, index) => {
        // Look for exact placeholder or slightly modified spaces from MT
        const regex = new RegExp(`___\\s*PH\\s*${index}\\s*___`, 'gi');
        restored = restored.replace(regex, originalToken);
    });

    return restored;
}

/**
 * Free Google Translate Web Client
 */
async function translateViaGoogleFree(text: string, fromLang: string, toLang: string): Promise<string> {
    const sl = fromLang || 'auto';
    const tl = toLang;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Google Free API HTTP ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedParts = data[0].map((item: any) => (item && item[0] ? item[0] : ''));
        return translatedParts.join('');
    }
    throw new Error('Invalid response format from Google Free endpoint');
}

/**
 * Free Lingva Public Open Instance Fallback
 */
async function translateViaLingva(text: string, fromLang: string, toLang: string): Promise<string> {
    const sl = fromLang || 'auto';
    const tl = toLang;
    const instances = [
        'https://lingva.ml/api/v1',
        'https://lingva.thedaviddelta.com/api/v1',
        'https://translate.plausibility.cloud/api/v1'
    ];

    for (const baseUrl of instances) {
        try {
            const url = `${baseUrl}/${encodeURIComponent(sl)}/${encodeURIComponent(tl)}/${encodeURIComponent(text)}`;
            const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
            if (response.ok) {
                const data = await response.json();
                if (data && data.translation) {
                    return data.translation;
                }
            }
        } catch (e) {
            // Try next instance
        }
    }
    throw new Error('Lingva instances unavailable');
}

/**
 * Free MyMemory Fallback
 */
async function translateViaMyMemory(text: string, fromLang: string, toLang: string): Promise<string> {
    const langPair = `${fromLang || 'en'}|${toLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;

    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
        throw new Error(`MyMemory HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
    }
    throw new Error('Invalid MyMemory response');
}

/**
 * Main translation function for a single string with automatic fallback and placeholder preservation
 */
export async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
    if (!text || !text.trim()) return text;
    if (fromLang === toLang) return text;

    // 1. Mask variables / placeholders
    const { maskedText, tokens } = maskPlaceholders(text);

    let rawTranslation = '';
    let success = false;

    // Attempt 1: Google Free Client
    try {
        rawTranslation = await translateViaGoogleFree(maskedText, fromLang, toLang);
        success = true;
    } catch (err1) {
        console.warn('Google Free translation failed, falling back to Lingva...', err1);
    }

    // Attempt 2: Lingva Open Instances
    if (!success) {
        try {
            rawTranslation = await translateViaLingva(maskedText, fromLang, toLang);
            success = true;
        } catch (err2) {
            console.warn('Lingva translation failed, falling back to MyMemory...', err2);
        }
    }

    // Attempt 3: MyMemory
    if (!success) {
        try {
            rawTranslation = await translateViaMyMemory(maskedText, fromLang, toLang);
            success = true;
        } catch (err3) {
            console.error('All free translation providers failed for text:', text, err3);
            throw new Error(`Translation failed for target language "${toLang}". Please check network connection.`);
        }
    }

    // 2. Unmask variables / placeholders
    return unmaskPlaceholders(rawTranslation, tokens);
}

export interface BatchTranslateItem {
    id: string; // key name
    text: string;
}

/**
 * Batch translation with multi-text payload combining and concurrent workers for high throughput
 */
export async function batchTranslate(
    items: BatchTranslateItem[],
    fromLang: string,
    toLang: string,
    onProgress?: (completed: number, total: number, currentItem?: BatchTranslateItem) => void,
    onItemComplete?: (id: string, translatedText: string) => void,
    concurrency = 6
): Promise<{ [id: string]: string }> {
    const results: { [id: string]: string } = {};
    const total = items.length;
    let completed = 0;

    if (total === 0) return results;

    // Filter out empty items directly
    const validItems: BatchTranslateItem[] = [];
    items.forEach(item => {
        if (!item.text || !item.text.trim()) {
            results[item.id] = '';
            completed++;
            if (onProgress) onProgress(completed, total, item);
        } else {
            validItems.push(item);
        }
    });

    // Group items into small batches (up to 8 items or ~800 chars per HTTP request)
    // using a unique delimiter that machine translation preserves
    const DELIMITER = '\n###SPLIT###\n';
    const batches: BatchTranslateItem[][] = [];
    let currentBatch: BatchTranslateItem[] = [];
    let currentBatchLen = 0;

    for (const item of validItems) {
        if (currentBatch.length >= 8 || currentBatchLen + item.text.length > 800) {
            batches.push(currentBatch);
            currentBatch = [item];
            currentBatchLen = item.text.length;
        } else {
            currentBatch.push(item);
            currentBatchLen += item.text.length;
        }
    }
    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    const queue = [...batches];

    // Concurrency runner
    const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
        while (queue.length > 0) {
            const batch = queue.shift();
            if (!batch) break;

            if (batch.length === 1) {
                const item = batch[0];
                let translated = '';
                try {
                    translated = await translateText(item.text, fromLang, toLang);
                } catch (e) {
                    console.error(`Failed to translate "${item.id}":`, e);
                }
                results[item.id] = translated;
                if (onItemComplete && translated) onItemComplete(item.id, translated);
                completed++;
                if (onProgress) onProgress(completed, total, item);
            } else {
                // Multi-item combined translation
                const combinedText = batch.map(b => b.text).join(DELIMITER);
                try {
                    const translatedCombined = await translateText(combinedText, fromLang, toLang);
                    const parts = translatedCombined.split(/\s*###\s*SPLIT\s*###\s*/i);

                    if (parts.length === batch.length) {
                        for (let i = 0; i < batch.length; i++) {
                            const item = batch[i];
                            const translated = parts[i].trim();
                            results[item.id] = translated;
                            if (onItemComplete && translated) onItemComplete(item.id, translated);
                            completed++;
                            if (onProgress) onProgress(completed, total, item);
                        }
                    } else {
                        // Fallback: translate individually if delimiter was mangled
                        for (const item of batch) {
                            let singleTrans = '';
                            try {
                                singleTrans = await translateText(item.text, fromLang, toLang);
                            } catch (err) {}
                            results[item.id] = singleTrans;
                            if (onItemComplete && singleTrans) onItemComplete(item.id, singleTrans);
                            completed++;
                            if (onProgress) onProgress(completed, total, item);
                        }
                    }
                } catch (e) {
                    // Fallback on batch failure
                    for (const item of batch) {
                        let singleTrans = '';
                        try {
                            singleTrans = await translateText(item.text, fromLang, toLang);
                        } catch (err) {}
                        results[item.id] = singleTrans;
                        if (onItemComplete && singleTrans) onItemComplete(item.id, singleTrans);
                        completed++;
                        if (onProgress) onProgress(completed, total, item);
                    }
                }
            }

            // Minimal delay
            await new Promise(r => setTimeout(r, 20));
        }
    });

    await Promise.all(workers);
    return results;
}
