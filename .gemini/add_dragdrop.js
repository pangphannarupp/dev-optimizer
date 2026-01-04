import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dragDropTranslations = {
    ar: "اسحب وأفلت ملف CSV هنا",
    de: "CSV-Datei hier ablegen",
    es: "Arrastra y suelta el archivo CSV aquí",
    fr: "Glissez et déposez le fichier CSV ici",
    hi: "CSV फ़ाइल यहाँ खींचें और छोड़ें",
    it: "Trascina e rilascia il file CSV qui",
    ja: "CSVファイルをここにドラッグ＆ドロップ",
    km: "អូសនិងទម្លាក់ឯកសារ CSV នៅទីនេះ",
    ko: "CSV 파일을 여기에 드래그 앤 드롭",
    pt: "Arraste e solte o arquivo CSV aqui",
    ru: "Перетащите CSV-файл сюда",
    zh: "拖放CSV文件到这里"
};

const localesDir = path.join(__dirname, '..', 'src', 'locales');

Object.entries(dragDropTranslations).forEach(([lang, translation]) => {
    const filePath = path.join(localesDir, `${lang}.json`);

    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Add dragDrop to csvToJson section
        if (content.csvToJson && !content.csvToJson.dragDrop) {
            // Insert dragDrop after description
            const csvToJson = content.csvToJson;
            const newCsvToJson = {
                title: csvToJson.title,
                description: csvToJson.description,
                dragDrop: translation,
                supportsCsv: csvToJson.supportsCsv,
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
            console.log(`⊘ Skipped ${lang}.json (already has dragDrop or missing csvToJson)`);
        }
    } catch (error) {
        console.error(`✗ Error updating ${lang}.json:`, error.message);
    }
});

console.log('\nAll "Drag & Drop CSV file here" translations added!');
