const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvFilePath = path.join(__dirname, '.firebase', 'translation.csv');
const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n').filter(line => line.trim() !== '');
const headers = lines[0].split(',');

// Find column indices
const jsonKeyIndex = 2; // JSON KEY column
const languageColumns = {
    'English': 6,
    'Khmer': 7,
    'Korean': 8,
    'Chinese': 9,
    'Japanese': 10
};

// Initialize language objects
const translations = {
    'English': {},
    'Khmer': {},
    'Korean': {},
    'Chinese': {},
    'Japanese': {}
};

// Helper function to set nested object value
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
}

// Helper function to parse CSV line (handles quotes and commas within fields)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Add last field
    result.push(current.trim());

    return result;
}

// Process each line (skip header)
for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);

    // Skip empty lines or lines without JSON key
    if (fields.length < 7 || !fields[jsonKeyIndex] || fields[jsonKeyIndex].trim() === '') {
        continue;
    }

    const jsonKey = fields[jsonKeyIndex].trim();

    // Process each language
    for (const [language, columnIndex] of Object.entries(languageColumns)) {
        if (fields[columnIndex] && fields[columnIndex].trim() !== '') {
            let value = fields[columnIndex].trim();

            // Remove surrounding quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }

            // Replace escaped quotes
            value = value.replace(/""/g, '"');

            setNestedValue(translations[language], jsonKey, value);
        }
    }
}

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'translations');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write JSON files
for (const [language, data] of Object.entries(translations)) {
    const outputPath = path.join(outputDir, `${language}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✓ Generated ${language}.json`);
}

console.log('\n✅ All translation files generated successfully!');
console.log(`📁 Output directory: ${outputDir}`);
