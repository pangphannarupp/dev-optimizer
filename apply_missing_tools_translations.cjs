const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'src/locales');

const TRANSLATIONS = {
    es: {
        mockData: {
            title: "Generador de Datos Mock",
            description: "Genera datos JSON aleatorios para pruebas.",
            configTitle: "Configuración",
            addField: "Añadir Campo",
            rowCount: "Filas a Generar",
            generate: "Generar Datos",
            preview: "Vista Previa",
            noData: "Sin datos. Haz clic en 'Generar Datos' para empezar.",
            types: {
                uuid: "UUID",
                name: "Nombre Completo",
                firstName: "Nombre",
                lastName: "Apellido",
                email: "Email",
                boolean: "Booleano",
                number: "Número",
                date: "Fecha",
                custom: "Lista Personalizada"
            }
        },
        jsonToCode: {
            title: "JSON a Código",
            description: "Genera modelos TypeScript, Kotlin, Swift o Dart desde JSON",
            inputJson: "JSON de Entrada",
            loadExample: "Cargar Ejemplo"
        },
        unixConverter: {
            title: "Conversor Unix Timestamp",
            description: "Convierte entre timestamps Unix y fechas legibles."
        }
    },
    fr: {
        mockData: {
            title: "Générateur de Données Mock",
            description: "Générez des données JSON aléatoires pour les tests.",
            configTitle: "Configuration",
            addField: "Ajouter un champ",
            rowCount: "Lignes à générer",
            generate: "Générer",
            preview: "Aperçu des données",
            noData: "Aucune donnée. Cliquez sur 'Générer' pour commencer.",
            types: {
                uuid: "UUID",
                name: "Nom Complet",
                firstName: "Prénom",
                lastName: "Nom",
                email: "Email",
                boolean: "Booléen",
                number: "Nombre",
                date: "Date",
                custom: "Liste Personnalisée"
            }
        },
        jsonToCode: {
            title: "JSON vers Code",
            description: "Générez des modèles TypeScript, Kotlin, Swift ou Dart à partir de JSON",
            inputJson: "Entrée JSON",
            loadExample: "Charger Exemple"
        },
        unixConverter: {
            title: "Convertisseur Unix Timestamp",
            description: "Convertir entre les timestamps Unix et les dates lisibles."
        }
    },
    de: {
        mockData: {
            title: "Mock-Daten Generator",
            description: "Generieren Sie zufällige JSON-Daten für Tests.",
            configTitle: "Konfiguration",
            addField: "Feld hinzufügen",
            rowCount: "Zeilen generieren",
            generate: "Daten generieren",
            preview: "Datenvorschau",
            noData: "Keine Daten. Klicken Sie auf 'Generieren', um zu beginnen.",
            types: {
                uuid: "UUID",
                name: "Vollständiger Name",
                firstName: "Vorname",
                lastName: "Nachname",
                email: "E-Mail",
                boolean: "Boolesch",
                number: "Nummer",
                date: "Datum",
                custom: "Benutzerdefinierte Liste"
            }
        },
        jsonToCode: {
            title: "JSON zu Code",
            description: "Generieren Sie TypeScript, Kotlin, Swift oder Dart Modelle aus JSON",
            inputJson: "Eingabe JSON",
            loadExample: "Beispiel laden"
        },
        unixConverter: {
            title: "Unix Zeitstempel Konverter",
            description: "Konvertieren Sie zwischen Unix-Zeitstempeln und lesbaren Daten."
        }
    },
    zh: {
        mockData: {
            title: "模拟数据生成器",
            description: "生成用于测试的随机 JSON 数据。",
            configTitle: "配置",
            addField: "添加字段",
            rowCount: "生成行数",
            generate: "生成数据",
            preview: "数据预览",
            noData: "无数据。点击“生成数据”开始。",
            types: {
                uuid: "UUID",
                name: "全名",
                firstName: "名字",
                lastName: "姓氏",
                email: "电子邮件",
                boolean: "布尔值",
                number: "数字",
                date: "日期",
                custom: "自定义列表"
            }
        },
        jsonToCode: {
            title: "JSON 转代码",
            description: "从 JSON 生成 TypeScript, Kotlin, Swift 或 Dart 模型",
            inputJson: "输入 JSON",
            loadExample: "加载示例"
        },
        unixConverter: {
            title: "Unix 时间戳转换器",
            description: "在 Unix 时间戳和可读日期之间转换。"
        }
    },
    ja: {
        mockData: {
            title: "モックデータジェネレーター",
            description: "テスト用のランダムなJSONデータを生成します。",
            configTitle: "設定",
            addField: "フィールドを追加",
            rowCount: "生成する行数",
            generate: "データを生成",
            preview: "データプレビュー",
            noData: "データがありません。「データを生成」をクリックして開始してください。",
            types: {
                uuid: "UUID",
                name: "氏名",
                firstName: "名",
                lastName: "姓",
                email: "メール",
                boolean: "ブール値",
                number: "数値",
                date: "日付",
                custom: "カスタムリスト"
            }
        },
        jsonToCode: {
            title: "JSON コード変換",
            description: "JSONからTypeScript、Kotlin、Swift、またはDartモデルを生成",
            inputJson: "入力 JSON",
            loadExample: "例を読み込む"
        },
        unixConverter: {
            title: "Unix タイムスタンプ変換",
            description: "Unixタイムスタンプと読み取り可能な日付の間で変換します。"
        }
    },
    km: {
        mockData: {
            title: "អ្នកបង្កើតទិន្នន័យក្លែងក្លាយ",
            description: "បង្កើតទិន្នន័យ JSON ដោយចៃដន្យសម្រាប់ការធ្វើតេស្ត។",
            configTitle: "ការកំណត់",
            addField: "បន្ថែមវាល",
            rowCount: "ជួរដេកដើម្បីបង្កើត",
            generate: "បង្កើតទិន្នន័យ",
            preview: "មើលទិន្នន័យជាមុន",
            noData: "គ្មានទិន្នន័យ។ ចុច 'បង្កើតទិន្នន័យ' ដើម្បីចាប់ផ្តើម។",
            types: {
                uuid: "UUID",
                name: "ឈ្មោះពេញ",
                firstName: "នាមខ្លួន",
                lastName: "នាមត្រកូល",
                email: "អ៊ីមែល",
                boolean: "Boolean",
                number: "លេខ",
                date: "កាលបរិច្ឆេទ",
                custom: "បញ្ជីផ្ទាល់ខ្លួន"
            }
        },
        jsonToCode: {
            title: "JSON ទៅកូដ",
            description: "បង្កើតម៉ូដែល TypeScript, Kotlin, Swift ឬ Dart ពី JSON",
            inputJson: "បញ្ចូល JSON",
            loadExample: "ផ្ទុកឧទាហរណ៍"
        },
        unixConverter: {
            title: "ឧបករណ៍បម្លែងពេលវេលា Unix",
            description: "បម្លែងរវាងត្រាពេលវេលា Unix និងកាលបរិច្ឆេទដែលអានបាន។"
        }
    },
    pt: {
        mockData: {
            title: "Gerador de Dados Mock",
            description: "Gere dados JSON aleatórios para testes.",
            configTitle: "Configuração",
            addField: "Adicionar Campo",
            rowCount: "Linhas para Gerar",
            generate: "Gerar Dados",
            preview: "Pré-visualização",
            noData: "Sem dados. Clique em 'Gerar Dados' para começar.",
            types: {
                uuid: "UUID",
                name: "Nome Completo",
                firstName: "Nome",
                lastName: "Sobrenome",
                email: "E-mail",
                boolean: "Booleano",
                number: "Número",
                date: "Data",
                custom: "Lista Personalizada"
            }
        },
        jsonToCode: {
            title: "JSON para Código",
            description: "Gere modelos TypeScript, Kotlin, Swift ou Dart a partir de JSON",
            inputJson: "JSON de Entrada",
            loadExample: "Carregar Exemplo"
        },
        unixConverter: {
            title: "Conversor de Timestamp Unix",
            description: "Converta entre timestamps Unix e datas legíveis."
        }
    },
    it: {
        mockData: {
            title: "Generatore Dati Mock",
            description: "Genera dati JSON casuali per i test.",
            configTitle: "Configurazione",
            addField: "Aggiungi Campo",
            rowCount: "Righe da Generare",
            generate: "Genera Dati",
            preview: "Anteprima Dati",
            noData: "Nessun dato. Clicca 'Genera Dati' per iniziare.",
            types: {
                uuid: "UUID",
                name: "Nome Completo",
                firstName: "Nome",
                lastName: "Cognome",
                email: "Email",
                boolean: "Booleano",
                number: "Numero",
                date: "Data",
                custom: "Lista Personalizzata"
            }
        },
        jsonToCode: {
            title: "JSON a Codice",
            description: "Genera modelli TypeScript, Kotlin, Swift o Dart da JSON",
            inputJson: "Input JSON",
            loadExample: "Carica Esempio"
        },
        unixConverter: {
            title: "Convertitore Unix Timestamp",
            description: "Converti tra timestamp Unix e date leggibili."
        }
    },
    ru: {
        mockData: {
            title: "Генератор Mock-данных",
            description: "Генерация случайных данных JSON для тестирования.",
            configTitle: "Конфигурация",
            addField: "Добавить поле",
            rowCount: "Строк для генерации",
            generate: "Создать данные",
            preview: "Предпросмотр",
            noData: "Нет данных. Нажмите «Создать данные», чтобы начать.",
            types: {
                uuid: "UUID",
                name: "Полное имя",
                firstName: "Имя",
                lastName: "Фамилия",
                email: "Email",
                boolean: "Булево",
                number: "Число",
                date: "Дата",
                custom: "Свой список"
            }
        },
        jsonToCode: {
            title: "JSON в Код",
            description: "Генерация моделей TypeScript, Kotlin, Swift или Dart из JSON",
            inputJson: "Входной JSON",
            loadExample: "Загрузить пример"
        },
        unixConverter: {
            title: "Конвертер Unix Timestamp",
            description: "Преобразование между метками времени Unix и читаемыми датами."
        }
    },
    ko: {
        mockData: {
            title: "모의 데이터 생성기",
            description: "테스트용 무작위 JSON 데이터 생성.",
            configTitle: "구성",
            addField: "필드 추가",
            rowCount: "생성할 행 수",
            generate: "데이터 생성",
            preview: "데이터 미리보기",
            noData: "데이터가 없습니다. 시작하려면 '데이터 생성'을 클릭하세요.",
            types: {
                uuid: "UUID",
                name: "성명",
                firstName: "이름",
                lastName: "성",
                email: "이메일",
                boolean: "불리언",
                number: "숫자",
                date: "날짜",
                custom: "사용자 지정 목록"
            }
        },
        jsonToCode: {
            title: "JSON을 코드로",
            description: "JSON에서 TypeScript, Kotlin, Swift 또는 Dart 모델 생성",
            inputJson: "입력 JSON",
            loadExample: "예제 불러오기"
        },
        unixConverter: {
            title: "Unix 타임스탬프 변환기",
            description: "Unix 타임스탬프와 사람이 읽을 수 있는 날짜 간 변환."
        }
    },
    ar: {
        mockData: {
            title: "مولد البيانات الوهمية",
            description: "توليد بيانات JSON عشوائية للاختبار.",
            configTitle: "تكوين",
            addField: "إضافة حقل",
            rowCount: "صفوف للتوليد",
            generate: "توليد البيانات",
            preview: "معاينة البيانات",
            noData: "لا توجد بيانات. انقر فوق 'توليد البيانات' للبدء.",
            types: {
                uuid: "UUID",
                name: "الاسم الكامل",
                firstName: "الاسم الأول",
                lastName: "الاسم الأخير",
                email: "البريد الإلكتروني",
                boolean: "منطقي",
                number: "رقم",
                date: "تاريخ",
                custom: "قائمة مخصصة"
            }
        },
        jsonToCode: {
            title: "JSON إلى كود",
            description: "توليد نماذج TypeScript أو Kotlin أو Swift أو Dart من JSON",
            inputJson: "إدخال JSON",
            loadExample: "تحميل مثال"
        },
        unixConverter: {
            title: "محول Unix Timestamp",
            description: "التحويل بين طوابع Unix والتواريخ المقروءة."
        }
    },
    hi: {
        mockData: {
            title: "मॉक डेटा जेनरेटर",
            description: "परीक्षण के लिए यादृच्छिक JSON डेटा उत्पन्न करें।",
            configTitle: "कॉन्फ़िगरेशन",
            addField: "फ़ील्ड जोड़ें",
            rowCount: "पंक्तियों की संख्या",
            generate: "डेटा जनरेट करें",
            preview: "डेटा पूर्वावलोकन",
            noData: "कोई डेटा नहीं। शुरू करने के लिए 'डेटा जनरेट करें' पर क्लिक करें।",
            types: {
                uuid: "UUID",
                name: "पूरा नाम",
                firstName: "पहला नाम",
                lastName: "सरनेम",
                email: "ईमेल",
                boolean: "बूलियन",
                number: "संख्या",
                date: "तारीख",
                custom: "कस्टम सूची"
            }
        },
        jsonToCode: {
            title: "JSON से कोड",
            description: "JSON से TypeScript, Kotlin, Swift या Dart मॉडल उत्पन्न करें",
            inputJson: "इनपुट JSON",
            loadExample: "उदाहरण लोड करें"
        },
        unixConverter: {
            title: "Unix टाइमस्टैम्प कनवर्टर",
            description: "Unix टाइमस्टैम्प और पठनीय तिथियों के बीच कनवर्ट करें।"
        }
    }
};

function updateFile(lang, filePath) {
    if (!TRANSLATIONS[lang]) return;

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Merge Mock Data
        if (!data.mockData) {
            data.mockData = TRANSLATIONS[lang].mockData;
        } else {
            // Deep merge types if mockData exists partially
            data.mockData = { ...data.mockData, ...TRANSLATIONS[lang].mockData };
            if (TRANSLATIONS[lang].mockData.types) {
                data.mockData.types = { ...(data.mockData.types || {}), ...TRANSLATIONS[lang].mockData.types };
            }
        }

        // Merge JsonToCode
        if (!data.jsonToCode) {
            data.jsonToCode = TRANSLATIONS[lang].jsonToCode;
        } else {
            data.jsonToCode = { ...data.jsonToCode, ...TRANSLATIONS[lang].jsonToCode };
        }

        // Merge UnixConverter
        if (!data.unixConverter) {
            data.unixConverter = TRANSLATIONS[lang].unixConverter;
        } else {
            data.unixConverter = { ...data.unixConverter, ...TRANSLATIONS[lang].unixConverter };
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log(`Updated ${path.basename(filePath)} with ${lang} translations (MockData, JsonToCode, UnixConverter)`);
    } catch (e) {
        console.error(`Error updating ${filePath}:`, e);
    }
}

const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
files.forEach(f => {
    const lang = path.basename(f, '.json');
    if (lang === 'en') return; // Skip English
    updateFile(lang, path.join(LOCALES_DIR, f));
});
console.log("Locales updated with additional missing tools.");
