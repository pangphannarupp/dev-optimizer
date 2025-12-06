import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translations = {
    ar: {
        csvJsonTab: "CSV إلى JSON",
        csvToJson: {
            title: "محول CSV إلى JSON",
            description: "قم بتحويل ملف CSV الخاص بالترجمة إلى JSON متداخل وAndroid XML وiOS Strings.",
            csvEmpty: "ملف CSV فارغ أو غير صالح",
            jsonKeyNotFound: 'العمود "JSON KEY" غير موجود في CSV',
            noLanguages: "لم يتم العثور على أعمدة اللغة",
            uploadCsv: "يرجى تحميل ملف CSV صالح",
            successMessage: "تمت معالجة {{count}} صفًا بنجاح. تم إنشاء ملفات لـ {{languages}} لغة.",
            detectedLanguages: "اللغات المكتشفة:",
            downloadAll: "تنزيل جميع التنسيقات (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    de: {
        csvJsonTab: "CSV zu JSON",
        csvToJson: {
            title: "CSV zu JSON Konverter",
            description: "Konvertieren Sie Ihre Übersetzungs-CSV-Datei in verschachteltes JSON, Android XML und iOS Strings.",
            csvEmpty: "CSV-Datei ist leer oder ungültig",
            jsonKeyNotFound: 'Spalte "JSON KEY" nicht in CSV gefunden',
            noLanguages: "Keine Sprachspalten gefunden",
            uploadCsv: "Bitte laden Sie eine gültige CSV-Datei hoch",
            successMessage: "{{count}} Zeilen erfolgreich verarbeitet. Dateien für {{languages}} Sprachen generiert.",
            detectedLanguages: "Erkannte Sprachen:",
            downloadAll: "Alle Formate herunterladen (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    es: {
        csvJsonTab: "CSV a JSON",
        csvToJson: {
            title: "Convertidor de CSV a JSON",
            description: "Convierte tu archivo CSV de traducción en JSON anidado, Android XML e iOS Strings.",
            csvEmpty: "El archivo CSV está vacío o no es válido",
            jsonKeyNotFound: 'Columna "JSON KEY" no encontrada en CSV',
            noLanguages: "No se encontraron columnas de idioma",
            uploadCsv: "Por favor, sube un archivo CSV válido",
            successMessage: "Se procesaron {{count}} filas con éxito. Se generaron archivos para {{languages}} idiomas.",
            detectedLanguages: "Idiomas detectados:",
            downloadAll: "Descargar todos los formatos (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    fr: {
        csvJsonTab: "CSV vers JSON",
        csvToJson: {
            title: "Convertisseur CSV vers JSON",
            description: "Convertissez votre fichier CSV de traduction en JSON imbriqué, Android XML et iOS Strings.",
            csvEmpty: "Le fichier CSV est vide ou invalide",
            jsonKeyNotFound: 'Colonne "JSON KEY" introuvable dans le CSV',
            noLanguages: "Aucune colonne de langue trouvée",
            uploadCsv: "Veuillez télécharger un fichier CSV valide",
            successMessage: "{{count}} lignes traitées avec succès. Fichiers générés pour {{languages}} langues.",
            detectedLanguages: "Langues détectées :",
            downloadAll: "Télécharger tous les formats (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    hi: {
        csvJsonTab: "CSV से JSON",
        csvToJson: {
            title: "CSV से JSON कनवर्टर",
            description: "अपनी अनुवाद CSV फ़ाइल को नेस्टेड JSON, Android XML और iOS Strings में बदलें।",
            csvEmpty: "CSV फ़ाइल खाली या अमान्य है",
            jsonKeyNotFound: 'CSV में "JSON KEY" कॉलम नहीं मिला',
            noLanguages: "कोई भाषा कॉलम नहीं मिला",
            uploadCsv: "कृपया एक मान्य CSV फ़ाइल अपलोड करें",
            successMessage: "{{count}} पंक्तियों को सफलतापूर्वक संसाधित किया गया। {{languages}} भाषाओं के लिए फ़ाइलें उत्पन्न की गईं।",
            detectedLanguages: "पहचानी गई भाषाएँ:",
            downloadAll: "सभी प्रारूप डाउनलोड करें (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    it: {
        csvJsonTab: "CSV a JSON",
        csvToJson: {
            title: "Convertitore CSV a JSON",
            description: "Converti il tuo file CSV di traduzione in JSON nidificato, Android XML e iOS Strings.",
            csvEmpty: "Il file CSV è vuoto o non valido",
            jsonKeyNotFound: 'Colonna "JSON KEY" non trovata nel CSV',
            noLanguages: "Nessuna colonna lingua trovata",
            uploadCsv: "Carica un file CSV valido",
            successMessage: "{{count}} righe elaborate con successo. File generati per {{languages}} lingue.",
            detectedLanguages: "Lingue rilevate:",
            downloadAll: "Scarica tutti i formati (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    ja: {
        csvJsonTab: "CSVからJSON",
        csvToJson: {
            title: "CSVからJSONコンバーター",
            description: "翻訳CSVファイルをネストされたJSON、Android XML、iOS Stringsに変換します。",
            csvEmpty: "CSVファイルが空または無効です",
            jsonKeyNotFound: 'CSVに「JSON KEY」列が見つかりません',
            noLanguages: "言語列が見つかりません",
            uploadCsv: "有効なCSVファイルをアップロードしてください",
            successMessage: "{{count}}行を正常に処理しました。{{languages}}言語のファイルを生成しました。",
            detectedLanguages: "検出された言語:",
            downloadAll: "すべての形式をダウンロード（ZIP）",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    ko: {
        csvJsonTab: "CSV에서 JSON으로",
        csvToJson: {
            title: "CSV에서 JSON 변환기",
            description: "번역 CSV 파일을 중첩된 JSON, Android XML 및 iOS Strings로 변환합니다.",
            csvEmpty: "CSV 파일이 비어 있거나 유효하지 않습니다",
            jsonKeyNotFound: 'CSV에서 "JSON KEY" 열을 찾을 수 없습니다',
            noLanguages: "언어 열을 찾을 수 없습니다",
            uploadCsv: "유효한 CSV 파일을 업로드하세요",
            successMessage: "{{count}}개 행을 성공적으로 처리했습니다. {{languages}}개 언어에 대한 파일을 생성했습니다.",
            detectedLanguages: "감지된 언어:",
            downloadAll: "모든 형식 다운로드 (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    pt: {
        csvJsonTab: "CSV para JSON",
        csvToJson: {
            title: "Conversor de CSV para JSON",
            description: "Converta seu arquivo CSV de tradução em JSON aninhado, Android XML e iOS Strings.",
            csvEmpty: "O arquivo CSV está vazio ou inválido",
            jsonKeyNotFound: 'Coluna "JSON KEY" não encontrada no CSV',
            noLanguages: "Nenhuma coluna de idioma encontrada",
            uploadCsv: "Por favor, envie um arquivo CSV válido",
            successMessage: "{{count}} linhas processadas com sucesso. Arquivos gerados para {{languages}} idiomas.",
            detectedLanguages: "Idiomas detectados:",
            downloadAll: "Baixar todos os formatos (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    ru: {
        csvJsonTab: "CSV в JSON",
        csvToJson: {
            title: "Конвертер CSV в JSON",
            description: "Преобразуйте ваш CSV-файл переводов во вложенный JSON, Android XML и iOS Strings.",
            csvEmpty: "CSV-файл пуст или недействителен",
            jsonKeyNotFound: 'Столбец "JSON KEY" не найден в CSV',
            noLanguages: "Столбцы языков не найдены",
            uploadCsv: "Пожалуйста, загрузите действительный CSV-файл",
            successMessage: "Успешно обработано {{count}} строк. Созданы файлы для {{languages}} языков.",
            detectedLanguages: "Обнаруженные языки:",
            downloadAll: "Скачать все форматы (ZIP)",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    },
    zh: {
        csvJsonTab: "CSV转JSON",
        csvToJson: {
            title: "CSV转JSON转换器",
            description: "将您的翻译CSV文件转换为嵌套JSON、Android XML和iOS Strings。",
            csvEmpty: "CSV文件为空或无效",
            jsonKeyNotFound: 'CSV中未找到"JSON KEY"列',
            noLanguages: "未找到语言列",
            uploadCsv: "请上传有效的CSV文件",
            successMessage: "成功处理了{{count}}行。为{{languages}}种语言生成了文件。",
            detectedLanguages: "检测到的语言：",
            downloadAll: "下载所有格式（ZIP）",
            formats: {
                json: "JSON",
                android: "Android",
                ios: "iOS"
            }
        }
    }
};

const localesDir = path.join(__dirname, '..', 'src', 'locales');

Object.entries(translations).forEach(([lang, trans]) => {
    const filePath = path.join(localesDir, `${lang}.json`);

    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Add csvJsonTab to app section
        if (!content.app.csvJsonTab) {
            content.app.csvJsonTab = trans.csvJsonTab;
        }

        // Add csvToJson section
        if (!content.csvToJson) {
            content.csvToJson = trans.csvToJson;
        }

        fs.writeFileSync(filePath, JSON.stringify(content, null, 4) + '\n', 'utf8');
        console.log(`✓ Updated ${lang}.json`);
    } catch (error) {
        console.error(`✗ Error updating ${lang}.json:`, error.message);
    }
});

console.log('\nAll translations updated!');
