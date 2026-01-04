import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supportsCsvTranslations = {
    ar: "يدعم CSV",
    de: "Unterstützt CSV",
    es: "Soporta CSV",
    fr: "Prend en charge CSV",
    hi: "CSV समर्थित",
    it: "Supporta CSV",
    ja: "CSVサポート",
    km: "គាំទ្រ CSV",
    ko: "CSV 지원",
    pt: "Suporta CSV",
    ru: "Поддерживает CSV",
    zh: "支持CSV"
};

const localesDir = path.join(__dirname, '..', 'src', 'locales');

Object.entries(supportsCsvTranslations).forEach(([lang, translation]) => {
    const filePath = path.join(localesDir, `${lang}.json`);

    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Add supportsCsv to csvToJson section
        if (content.csvToJson && !content.csvToJson.supportsCsv) {
            // Insert supportsCsv after description
            const csvToJson = content.csvToJson;
            const newCsvToJson = {
                title: csvToJson.title,
                description: csvToJson.description,
                supportsCsv: translation,
                csvEmpty: csvToJson.csvEmpty,
                jsonKeyNotFound: csvToJson.jsonKeyNotFound,
                noLanguages: csvToJson.noLanguages,
                uploadCsv: csvToJson.uploadCsv,
                successMessage: csvToJson.successMessage,
                detectedLanguages: csvToJson.detectedLanguages,
                downloadAll: csvToJson.downloadAll,
                formats: csvToJson.formats
            };
            content.csvToJson = newCsvToJson;

            fs.writeFileSync(filePath, JSON.stringify(content, null, 4) + '\n', 'utf8');
            console.log(`✓ Updated ${lang}.json`);
        } else {
            console.log(`⊘ Skipped ${lang}.json (already has supportsCsv or missing csvToJson)`);
        }
    } catch (error) {
        console.error(`✗ Error updating ${lang}.json:`, error.message);
    }
});

console.log('\nAll "Supports CSV" translations added!');
