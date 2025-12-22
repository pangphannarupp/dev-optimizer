const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'src/locales');

const NEW_KEYS = {
    codeQuality: {
        analyzing: "Analyzing codebase...",
        copyReport: "Copy Report",
        reupload: "New Scan",
        suggestion: "Suggestion",
        severity: {
            error: "Error",
            warning: "Warning",
            info: "Info"
        }
    }
};

function updateFile(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Ensure codeQuality exists
    if (!data.codeQuality) data.codeQuality = {};

    // Assign missing keys
    // We overwrite/ensure these keys exist.
    data.codeQuality.analyzing = data.codeQuality.analyzing || NEW_KEYS.codeQuality.analyzing;
    data.codeQuality.copyReport = data.codeQuality.copyReport || NEW_KEYS.codeQuality.copyReport;
    data.codeQuality.reupload = data.codeQuality.reupload || NEW_KEYS.codeQuality.reupload;
    data.codeQuality.suggestion = data.codeQuality.suggestion || NEW_KEYS.codeQuality.suggestion;

    if (!data.codeQuality.severity) {
        data.codeQuality.severity = NEW_KEYS.codeQuality.severity;
    } else {
        // Merge in case some exist
        data.codeQuality.severity = { ...NEW_KEYS.codeQuality.severity, ...data.codeQuality.severity };
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    console.log(`Updated ${path.basename(filePath)}`);
}

const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
files.forEach(f => updateFile(path.join(LOCALES_DIR, f)));
console.log("Locales updated with missing CodeQuality keys.");
