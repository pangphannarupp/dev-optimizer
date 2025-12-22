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

// Function to set value by path
function setValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

// Translations data for specific missing sections
const TRANSLATIONS = {
    iconGenerator: {
        tabs: {
            "ar": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "أندرويد (Kotlin)", "android_java": "أندرويد (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "de": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "es": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "fr": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "hi": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "एंड्रॉइड (Kotlin)", "android_java": "एंड्रॉइड (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "it": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "ja": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "km": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "ko": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "안드로이드 (Kotlin)", "android_java": "안드로이드 (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "pt": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "ru": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" },
            "zh": { "react": "React (TS)", "vue": "Vue (TS)", "android_kotlin": "Android (Kotlin)", "android_java": "Android (Java)", "ios_swift": "iOS (Swift)", "ios_objc": "iOS (Obj-C)" }
        },
        dashboard: {
            "es": { "overview": "Resumen", "totalFiles": "Archivos Totales", "totalIssues": "Total Problemas", "passed": "Aprobado", "failed": "Fallido", "error": "Error", "warning": "Advertencia", "errors": "Errores", "warnings": "Advertencias", "search": "Buscar archivos...", "filterAll": "Todo", "filterPassed": "Aprobado", "filterFailed": "Fallido", "filterError": "Error", "filterWarning": "Advertencia", "viewDetails": "Ver Detalles" },
            "fr": { "overview": "Aperçu", "totalFiles": "Total Fichiers", "totalIssues": "Total Problèmes", "passed": "Passé", "failed": "Échoué", "error": "Erreur", "warning": "Avertissement", "errors": "Erreurs", "warnings": "Avertissements", "search": "Rechercher...", "filterAll": "Tout", "filterPassed": "Passé", "filterFailed": "Échoué", "filterError": "Erreur", "filterWarning": "Avertissement", "viewDetails": "Voir Détails" },
            "de": { "overview": "Übersicht", "totalFiles": "Gesamtdateien", "totalIssues": "Probleme gesamt", "passed": "Bestanden", "failed": "Fehlgeschlagen", "error": "Fehler", "warning": "Warnung", "errors": "Fehler", "warnings": "Warnungen", "search": "Dateien suchen...", "filterAll": "Alle", "filterPassed": "Bestanden", "filterFailed": "Fehlgeschlagen", "filterError": "Fehler", "filterWarning": "Warnung", "viewDetails": "Details anzeigen" },
            "ja": { "overview": "概要", "totalFiles": "ファイル総数", "totalIssues": "問題総数", "passed": "合格", "failed": "失敗", "error": "エラー", "warning": "警告", "errors": "エラー", "warnings": "警告", "search": "ファイルを検索...", "filterAll": "すべて", "filterPassed": "合格", "filterFailed": "失敗", "filterError": "エラー", "filterWarning": "警告", "viewDetails": "詳細を表示" },
            "km": { "overview": "ទិដ្ឋភាពទូទៅ", "totalFiles": "ឯកសារសរុប", "totalIssues": "បញ្ហាសរុប", "passed": "ជាប់", "failed": "បរាជ័យ", "error": "កំហុស", "warning": "ការព្រមាន", "errors": "កំហុស", "warnings": "ការព្រមាន", "search": "ស្វែងរកឯកសារ...", "filterAll": "ទាំងអស់", "filterPassed": "ជាប់", "filterFailed": "បរាជ័យ", "filterError": "កំហុស", "filterWarning": "ការព្រមាន", "viewDetails": "មើលព័ត៌មានលម្អិត" },
            // Defaults for others to English if detailed translation not available
            "default": { "overview": "Overview", "totalFiles": "Total Files", "totalIssues": "Total Issues", "passed": "Passed", "failed": "Failed", "error": "Error", "warning": "Warning", "errors": "Errors", "warnings": "Warnings", "search": "Search files...", "filterAll": "All", "filterPassed": "Passed", "filterFailed": "Failed", "filterError": "Error", "filterWarning": "Warning", "viewDetails": "View Details" }
        }
    },
    codeQuality: {
        dashboard: {
            "es": { "overview": "Resumen", "totalFiles": "Archivos Totales", "errors": "Errores", "warnings": "Advertencias", "passed": "Aprobado", "error": "Error", "warning": "Advertencia", "filterAll": "Todo", "filterPassed": "Aprobado", "filterWarning": "Advertencia", "filterError": "Error", "search": "Buscar archivos..." },
            "fr": { "overview": "Aperçu", "totalFiles": "Total Fichiers", "errors": "Erreurs", "warnings": "Avertissements", "passed": "Passé", "error": "Erreur", "warning": "Avertissement", "filterAll": "Tout", "filterPassed": "Passé", "filterWarning": "Avertissement", "filterError": "Erreur", "search": "Rechercher..." },
            "km": { "overview": "ទិដ្ឋភាពទូទៅ", "totalFiles": "ឯកសារសរុប", "errors": "កំហុស", "warnings": "ការព្រមាន", "passed": "ជាប់", "error": "កំហុស", "warning": "ការព្រមាន", "filterAll": "ទាំងអស់", "filterPassed": "ជាប់", "filterWarning": "ការព្រមាន", "filterError": "កំហុស", "search": "ស្វែងរកឯកសារ..." }
        },
        rules: {
            // Fallbacks for rules as they are technical messages
            "default": {
                "console-log": { "message": "Avoid console.log in production", "suggestion": "Use logger service" },
                "index-key": { "message": "Avoid array index as key", "suggestion": "Use unique ID" }
                // ... others will use en.json value
            }
        }
    },
    codePlayground: {
        "es": { "title": "Playground de Código", "description": "Escribir y probar código.", "web": "Web (HTML/JS)", "android": "Android (Kotlin)", "refresh": "Actualizar", "code": "Código", "preview": "Vista Previa" },
        "fr": { "title": "Playground de Code", "description": "Écrire et tester du code.", "web": "Web (HTML/JS)", "android": "Android (Kotlin)", "refresh": "Actualiser", "code": "Code", "preview": "Aperçu" },
        "de": { "title": "Code Playground", "description": "Code schreiben und testen.", "web": "Web (HTML/JS)", "android": "Android (Kotlin)", "refresh": "Aktualisieren", "code": "Code", "preview": "Vorschau" },
        "km": { "title": "កន្លែងសរសេរកូដ", "description": "សរសេរនិងសាកល្បងកូដ", "web": "Web (HTML/JS)", "android": "Android (Kotlin)", "refresh": "ផ្ទុកឡើងវិញ", "code": "កូដ", "preview": "មើលជាមុន" },
        "ja": { "title": "コードプレイグラウンド", "description": "コードを書いてテストします。", "web": "Web (HTML/JS)", "android": "Android (Kotlin)", "refresh": "更新", "code": "コード", "preview": "プレビュー" },
        "ko": { "title": "코드 놀이터", "description": "코드를 작성하고 테스트합니다.", "web": "Web (HTML/JS)", "android": "Android (Kotlin)", "refresh": "새로고침", "code": "코드", "preview": "미리보기" }
    },
    markdownEditor: {
        "es": { "title": "Editor Markdown", "description": "Editar y previsualizar contenido Markdown.", "editor": "Editor", "preview": "Vista Previa", "placeholder": "Escribe markdown aquí..." },
        "fr": { "title": "Éditeur Markdown", "description": "Éditer et prévisualiser du contenu Markdown.", "editor": "Éditeur", "preview": "Aperçu", "placeholder": "Tapez markdown ici..." },
        "de": { "title": "Markdown Editor", "description": "Markdown Inhalt bearbeiten und vorschauen.", "editor": "Editor", "preview": "Vorschau", "placeholder": "Markdown hier eingeben..." },
        "km": { "title": "កម្មវិធីកែ Markdown", "description": "កែសម្រួលនិងមើលមាតិកា Markdown ជាមុន", "editor": "អ្នកកែសម្រួល", "preview": "មើលជាមុន", "placeholder": "វាយ markdown នៅទីនេះ..." },
        "ja": { "title": "Markdown エディタ", "description": "Markdownコンテンツを編集してプレビューします。", "editor": "エディタ", "preview": "プレビュー", "placeholder": "ここにMarkdownを入力..." }
    }
};

const enKeys = flattenKeys(enData);
const languages = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json') && f !== 'en.json')
    .map(f => path.basename(f, '.json'));

languages.forEach(lang => {
    const langPath = path.join(LOCALES_DIR, `${lang}.json`);
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const langKeys = new Set(flattenKeys(langData));

    const missing = enKeys.filter(k => !langKeys.has(k));

    if (missing.length === 0) {
        console.log(`[${lang}] No missing keys.`);
        return;
    }

    console.log(`[${lang}] Filling ${missing.length} missing keys...`);

    missing.forEach(key => {
        // Try to find translation in our dictionary
        const parts = key.split('.');
        const ns = parts[0];
        const section = parts[1];
        const item = parts[2];

        let value = null;

        // Lookup specific manual translations
        if (TRANSLATIONS[ns]) {
            if (parts.length === 2 && TRANSLATIONS[ns][lang] && TRANSLATIONS[ns][lang][section]) {
                value = TRANSLATIONS[ns][lang][section];
            } else if (parts.length === 3 && TRANSLATIONS[ns][section] && TRANSLATIONS[ns][section][lang] && TRANSLATIONS[ns][section][lang][item]) {
                value = TRANSLATIONS[ns][section][lang][item];
            } else if (parts.length === 2 && TRANSLATIONS[ns][lang] && typeof TRANSLATIONS[ns][lang][section] === 'string') {
                value = TRANSLATIONS[ns][lang][section];
            }
        }

        // Special handling for nested maps like dashboard.columns.file
        if (!value && ns === 'iconGenerator' && section === 'dashboard' && parts[2] === 'columns') {
            // Fallback to English for deeper nested column headers if not found, or map basic terms
            const col = parts[3];
            if (col === 'file') value = (lang === 'es' ? 'Archivo' : (lang === 'fr' ? 'Fichier' : 'File'));
            // ... simplistic fallback
        }

        // Use English value if no translation found
        if (!value) {
            // Get value from EN data
            let enValue = enData;
            for (const p of parts) {
                enValue = enValue ? enValue[p] : null;
            }
            value = enValue;

            // Mark as TODO check? No, user just wants it fixed so it doesn't crash or show empty.
            // value = `[${lang}] ` + value; // Optional: mark it
        }

        if (value) {
            setValue(langData, key, value);
        }
    });

    fs.writeFileSync(langPath, JSON.stringify(langData, null, 4));
});

console.log("All missing translations filled.");
