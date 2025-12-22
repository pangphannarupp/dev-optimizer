const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'src/locales');
const DATA_DIR = path.join(__dirname, 'src/data');

const PROG_DATA_PATH = path.join(DATA_DIR, 'ProgrammingData.ts');
const DSA_DATA_PATH = path.join(DATA_DIR, 'DsaData.ts');

// Helper to escape string for regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function processFile(filePath, type) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newTranslations = {}; // { [id]: { title: "...", description: "...", ... } }

    // We need to find objects having an 'id'. Then extraction fields.
    // This regex approach is a bit fragile but should work for the uniform style of these files.
    // We assume properties are on their own lines or clearly separated.

    // Regex to match the object definition roughly
    // We'll iterate through the file and look for "id: '...'" then capture subsequent fields until the next object or end of array
    // BETTER STRATEGY: 
    // 1. Identify valid IDs.
    // 2. For each ID, find its block.
    // 3. In that block, replace title, description, content, explanation.

    // Let's try to match the whole array block first
    const arrayRegex = type === 'prog'
        ? /export const progTopics: ProgTopic\[\] = \[([\s\S]*?)\];/
        : /export const dsaTopics: DsaTopic\[\] = \[([\s\S]*?)\];/;

    const arrayMatch = content.match(arrayRegex);
    if (!arrayMatch) {
        console.error(`Could not find topics array in ${filePath}`);
        return { content, translations: {} };
    }

    let arrayContent = arrayMatch[1];
    let newArrayContent = arrayContent;

    // Split by objects roughly (looking for { and })
    // actually, let's just find "id: '...'" and work from there

    const idRegex = /id:\s*'([^']+)'/g;
    let match;

    while ((match = idRegex.exec(newArrayContent)) !== null) {
        const id = match[1];
        const startIndex = match.index;

        // Find the scope of this object (roughly, until the next '},' or 'id:')
        // Safest is to find the closest 'id:' or end of string, but let's just look for specific fields AFTER the id
        // finding specific fields is safer.

        const fields = ['title', 'description', 'content', 'explanation']; // fields to translate

        if (!newTranslations[id]) newTranslations[id] = {};

        fields.forEach(field => {
            // Regex to find "field: '...'" or "field: `...`" matching THIS object context
            // We search from startIndex ensuring we don't cross into another id
            // But doing this globally in a loop is hard.
            // Let's replace one by one globally? No, duplicate IDs (unlikely) or key conflicts.
            // IDS ARE UNIQUE.

            // We can search for the pattern: 
            // id:\s*'${id}'[\s\S]*?${field}:\s*(['`])([\s\S]*?)\1
            // But we need to make sure we don't cross another 'id:'

            const fieldRegex = new RegExp(`(id:\\s*'${escapeRegExp(id)}'[\\s\\S]*?${field}:\\s*)(['\`])([\\s\\S]*?)\\2`, 'm');

            // Check if matches in the whole content (to extract text)
            // But we must ensure it's the specific occurrence for this ID.
            // Since IDs are unique, `id: 'android-basic-intro' ... title: '...'` is unique enough if we define the range.

            // Let's execute on newArrayContent.
            const fieldMatch = newArrayContent.match(fieldRegex);

            if (fieldMatch) {
                // Ensure there is no "id:" between the id match and the field match (which would mean we crossed into another obj)
                const textBetween = fieldMatch[0].substring(fieldMatch[1].indexOf(id) + id.length, fieldMatch[0].indexOf(field));
                if (textBetween.includes('id:')) return; // Skipped context

                const originalText = fieldMatch[3];
                const cleanText = originalText.trim(); // Trim for JSON

                // Store translation
                newTranslations[id][field] = cleanText;

                // Replace in content
                // key: "content.${type}.${id}.${field}"
                const key = `content.${type}.${id}.${field}`;

                // We perform the replacement on the WHOLE file content to ensure we update the file
                // But we must generate the regex carefully again to match the file

                const fileRegex = new RegExp(`(id:\\s*'${escapeRegExp(id)}'[\\s\\S]*?${field}:\\s*)(['\`])([\\s\\S]*?)\\2`);
                content = content.replace(fileRegex, `$1'${key}'`);
                // Also update newArrayContent so we don't re-match or mess up logic (though we just read it for IDs)
                newArrayContent = newArrayContent.replace(fieldRegex, `$1'${key}'`);
            }
        });
    }

    return { content, translations: newTranslations };
}

function updateLocales(progTrans, dsaTrans) {
    const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        const filePath = path.join(LOCALES_DIR, file);
        const localeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Ensure "content" namespace exists
        if (!localeData.content) localeData.content = {};
        if (!localeData.content.prog) localeData.content.prog = {};
        if (!localeData.content.dsa) localeData.content.dsa = {};

        // Merge Prog
        Object.keys(progTrans).forEach(id => {
            if (!localeData.content.prog[id]) localeData.content.prog[id] = {};
            Object.keys(progTrans[id]).forEach(field => {
                // Only overwrite if missing or extracting new (we assume missing for new schema)
                localeData.content.prog[id][field] = progTrans[id][field];
            });
        });

        // Merge DSA
        Object.keys(dsaTrans).forEach(id => {
            if (!localeData.content.dsa[id]) localeData.content.dsa[id] = {};
            Object.keys(dsaTrans[id]).forEach(field => {
                localeData.content.dsa[id][field] = dsaTrans[id][field];
            });
        });

        fs.writeFileSync(filePath, JSON.stringify(localeData, null, 4));
        console.log(`Updated ${file}`);
    });
}

// Main execution
console.log('Processing ProgrammingData...');
const progResult = processFile(PROG_DATA_PATH, 'prog');

console.log('Processing DsaData...');
const dsaResult = processFile(DSA_DATA_PATH, 'dsa');

console.log('Updating locales...');
updateLocales(progResult.translations, dsaResult.translations);

console.log('Writing back to TS files...');
fs.writeFileSync(PROG_DATA_PATH, progResult.content);
fs.writeFileSync(DSA_DATA_PATH, dsaResult.content);

console.log('Migration complete.');
