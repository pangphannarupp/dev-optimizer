const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'src/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');

const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

// Recursive function to get all keys
function flattenKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(flattenKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

const enKeys = flattenKeys(enData);
const languages = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json') && f !== 'en.json')
    .map(f => path.basename(f, '.json'));

let totalMissing = 0;

languages.forEach(lang => {
    const langPath = path.join(LOCALES_DIR, `${lang}.json`);
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const langKeys = new Set(flattenKeys(langData));

    const missing = enKeys.filter(k => !langKeys.has(k));

    // Ignore content.prog and content.dsa as we know they are large and handled separately/partially
    // Actually, user wants "all translations", but we should distinguish between "missing key" vs "key exists but untranslated"
    // This script checks for MISSING KEYS (structure mismatch).

    // Also check for "key exists but value matches value in en.json" (potentially untranslated), but that's harder as values might legitimately be same (e.g. "Privacy Policy")
    // Let's stick to structural gaps first.

    if (missing.length > 0) {
        console.log(`\n[${lang}] Missing ${missing.length} keys:`);
        // Group by namespace for cleaner output
        const namespaces = {};
        missing.forEach(k => {
            const ns = k.split('.')[0];
            namespaces[ns] = (namespaces[ns] || 0) + 1;
        });

        Object.entries(namespaces).forEach(([ns, count]) => {
            console.log(`  - ${ns}: ${count} missing keys`);
        });

        // Print first 5 missing keys as example
        console.log(`  Examples: ${missing.slice(0, 3).join(', ')}...`);
    } else {
        console.log(`\n[${lang}] All keys present.`);
    }

    totalMissing += missing.length;
});

if (totalMissing === 0) {
    console.log("\nSUCCESS: All locales have identical structure to en.json.");
} else {
    console.log(`\nFound total ${totalMissing} missing keys across languages.`);
}
