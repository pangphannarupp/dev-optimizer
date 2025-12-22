const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'src/locales');

// Define translations for the UI tools
const TRANSLATIONS = {
    es: {
        developerGuide: {
            title: "Guía del Desarrollador",
            subtitle: "Documentación generada automáticamente desde tu código fuente.",
            exportHtml: "Exportar HTML",
            newProject: "Nuevo Proyecto",
            parsing: "Analizando estructura...",
            uploadZip: "Subir ZIP del Proyecto",
            supports: "Soporta TS, Nativo (Kotlin, Swift, etc.)",
            searchPlaceholder: "Buscar archivos...",
            noSymbols: "No se detectaron símbolos públicos.",
            classes: "Clases",
            properties: "Propiedades",
            functions: "Funciones",
            interfaces: "Interfaces",
            members: "Miembros",
            line: "Línea",
            selectFile: "Selecciona un archivo para ver la documentación.",
            files: "Archivos",
            generatedOn: "Generado el"
        },
        regexTester: {
            title: "Probador de Regex",
            description: "Prueba y depura tus expresiones regulares en tiempo real.",
            regexPattern: "Patrón Regex",
            testString: "Cadena de Prueba",
            testStringPlaceholder: "Pega tu texto aquí...",
            matchHighlight: "Resaltado de Coincidencias",
            matchCount: "{{count}} coincidencias",
            guide: {
                title: "Hoja de Trucos",
                common: "Patrones Comunes",
                viewDocs: "Ver Documentación MDN Completa"
            }
        },
        codeQuality: {
            analyzing: "Analizando código...",
            copyReport: "Copiar Informe",
            reupload: "Nuevo Escaneo",
            suggestion: "Sugerencia",
            severity: { error: "Error", warning: "Advertencia", info: "Info" }
        }
    },
    fr: {
        developerGuide: {
            title: "Guide du Développeur",
            subtitle: "Documentation générée automatiquement à partir de votre code source.",
            exportHtml: "Exporter HTML",
            newProject: "Nouveau Projet",
            parsing: "Analyse de la structure...",
            uploadZip: "Télécharger le ZIP du Projet",
            supports: "Supporte TS, Natif (Kotlin, Swift, etc.)",
            searchPlaceholder: "Rechercher des fichiers...",
            noSymbols: "Aucun symbole public détecté.",
            classes: "Classes",
            properties: "Propriétés",
            functions: "Fonctions",
            interfaces: "Interfaces",
            members: "Membres",
            line: "Ligne",
            selectFile: "Sélectionnez un fichier pour voir la documentation.",
            files: "Fichiers",
            generatedOn: "Généré le"
        },
        regexTester: {
            title: "Testeur Regex",
            description: "Testez et déboguez vos expressions régulières en temps réel.",
            regexPattern: "Motif Regex",
            testString: "Chaîne de Test",
            testStringPlaceholder: "Collez votre texte ici...",
            matchHighlight: "Mise en évidence",
            matchCount: "{{count}} correspondances",
            guide: {
                title: "Aide-mémoire",
                common: "Motifs Courants",
                viewDocs: "Voir Documentation MDN"
            }
        },
        codeQuality: {
            analyzing: "Analyse du code...",
            copyReport: "Copier le Rapport",
            reupload: "Nouveau Scan",
            suggestion: "Suggestion",
            severity: { error: "Erreur", warning: "Avertissement", info: "Info" }
        }
    },
    de: {
        developerGuide: {
            title: "Entwicklerhandbuch",
            subtitle: "Automatisch generierte Dokumentation aus Ihrem Quellcode.",
            exportHtml: "HTML Exportieren",
            newProject: "Neues Projekt",
            parsing: "Analysiere Struktur...",
            uploadZip: "Projekt-ZIP Hochladen",
            supports: "Unterstützt TS, Native (Kotlin, Swift, etc.)",
            searchPlaceholder: "Dateien suchen...",
            noSymbols: "Keine öffentlichen Symbole erkannt.",
            classes: "Klassen",
            properties: "Eigenschaften",
            functions: "Funktionen",
            interfaces: "Schnittstellen",
            members: "Mitglieder",
            line: "Zeile",
            selectFile: "Wählen Sie eine Datei aus, um die Dokumentation anzuzeigen.",
            files: "Dateien",
            generatedOn: "Generiert am"
        },
        regexTester: {
            title: "Regex Tester",
            description: "Testen und debuggen Sie Ihre regulären Ausdrücke.",
            regexPattern: "Regex Muster",
            testString: "Testzeichenfolge",
            testStringPlaceholder: "Text hier einfügen...",
            matchHighlight: "Treffer hervorheben",
            matchCount: "{{count}} Treffer",
            guide: {
                title: "Spickzettel",
                common: "Häufige Muster",
                viewDocs: "Vollständige MDN-Dokumentation"
            }
        },
        codeQuality: {
            analyzing: "Analysiere Codebasis...",
            copyReport: "Bericht Kopieren",
            reupload: "Neuer Scan",
            suggestion: "Vorschlag",
            severity: { error: "Fehler", warning: "Warnung", info: "Info" }
        }
    },
    zh: {
        developerGuide: {
            title: "开发者指南",
            subtitle: "从源代码自动生成文档。",
            exportHtml: "导出 HTML",
            newProject: "新项目",
            parsing: "正在解析项目结构...",
            uploadZip: "上传项目 ZIP",
            supports: "支持 TS, Native (Kotlin, Swift 等)",
            searchPlaceholder: "搜索文件...",
            noSymbols: "未检测到公共符号。",
            classes: "类",
            properties: "属性",
            functions: "函数",
            interfaces: "接口",
            members: "成员",
            line: "行",
            selectFile: "从侧边栏选择文件以查看文档。",
            files: "文件",
            generatedOn: "生成于"
        },
        regexTester: {
            title: "Regex 测试器",
            description: "实时测试和调试正则表达式。",
            regexPattern: "Regex 模式",
            testString: "测试字符串",
            testStringPlaceholder: "在此粘贴文本...",
            matchHighlight: "匹配高亮",
            matchCount: "{{count}} 个匹配",
            guide: {
                title: "速查表",
                common: "常用模式",
                viewDocs: "查看完整 MDN 文档"
            }
        },
        codeQuality: {
            analyzing: "正在分析代码库...",
            copyReport: "复制报告",
            reupload: "重新扫描",
            suggestion: "建议",
            severity: { error: "错误", warning: "警告", info: "信息" }
        }
    },
    ja: {
        developerGuide: {
            title: "開発者ガイド",
            subtitle: "ソースコードからドキュメントを自動生成します。",
            exportHtml: "HTMLをエクスポート",
            newProject: "新規プロジェクト",
            parsing: "構造を解析中...",
            uploadZip: "プロジェクトZIPをアップロード",
            supports: "TS, Native (Kotlin, Swiftなど) 対応",
            searchPlaceholder: "ファイルを検索...",
            noSymbols: "公開シンボルが見つかりません。",
            classes: "クラス",
            properties: "プロパティ",
            functions: "関数",
            interfaces: "インターフェース",
            members: "メンバー",
            line: "行",
            selectFile: "ドキュメントを表示するにはファイルを選択してください。",
            files: "ファイル",
            generatedOn: "生成日時"
        },
        regexTester: {
            title: "正規表現テスター",
            description: "正規表現をリアルタイムでテストおよびデバッグします。",
            regexPattern: "正規表現パターン",
            testString: "テスト文字列",
            testStringPlaceholder: "ここにテキストを貼り付け...",
            matchHighlight: "一致のハイライト",
            matchCount: "{{count}} 件の一致",
            guide: {
                title: "チートシート",
                common: "一般的なパターン",
                viewDocs: "MDNの完全なドキュメントを見る"
            }
        },
        codeQuality: {
            analyzing: "コードベースを分析中...",
            copyReport: "レポートをコピー",
            reupload: "新しいスキャン",
            suggestion: "提案",
            severity: { error: "エラー", warning: "警告", info: "情報" }
        }
    },
    km: {
        developerGuide: {
            title: "មគ្គុទ្ទេសក៍អ្នកអភិវឌ្ឍន៍",
            subtitle: "អត្ថបទទិន្នន័យដែលបង្កើតដោយស្វ័យប្រវត្តិពីកូដរបស់អ្នក។",
            exportHtml: "នាំចេញ HTML",
            newProject: "គម្រោងថ្មី",
            parsing: "កំពុងញែករចនាសម្ព័ន្ធ...",
            uploadZip: "ផ្ទុកឡើង ZIP គម្រោង",
            supports: "គាំទ្រ TS, Native (Kotlin, Swift, etc.)",
            searchPlaceholder: "ស្វែងរកឯកសារ...",
            noSymbols: "មិនរកឃើញនិមិត្តសញ្ញាសាធារណៈទេ។",
            classes: "ថ្នាក់ (Classes)",
            properties: "លក្ខណសម្បត្តិ",
            functions: "អនុគមន៍",
            interfaces: "ចំណុចប្រទាក់",
            members: "សមាជិក",
            line: "ជួរ",
            selectFile: "ជ្រើសរើសឯកសារដើម្បីមើលឯកសារ។",
            files: "ឯកសារ",
            generatedOn: "បានបង្កើតនៅ"
        },
        regexTester: {
            title: "អ្នកសាកល្បង Regex",
            description: "សាកល្បងនិងកែសម្រួលកន្សោមធម្មតារបស់អ្នក។",
            regexPattern: "លំនាំ Regex",
            testString: "អត្ថបទសាកល្បង",
            testStringPlaceholder: "បិទភ្ជាប់អត្ថបទរបស់អ្នកនៅទីនេះ...",
            matchHighlight: "គូសបញ្ជាក់ការផ្គូផ្គង",
            matchCount: "{{count}} ការផ្គូផ្គង",
            guide: {
                title: "សន្លឹកបន្លំ",
                common: "លំនាំទូទៅ",
                viewDocs: "មើលឯកសារ MDN ពេញលេញ"
            }
        },
        codeQuality: {
            analyzing: "កំពុងវិភាគ...",
            copyReport: "ចម្លងរបាយការណ៍",
            reupload: "ស្កេនថ្មី",
            suggestion: "ការណែនាំ",
            severity: { error: "កំហុស", warning: "ការព្រមាន", info: "ព័ត៌មាន" }
        }
    },
    pt: {
        developerGuide: {
            title: "Guia do Desenvolvedor",
            subtitle: "Documentação gerada automaticamente.",
            exportHtml: "Exportar HTML",
            newProject: "Novo Projeto",
            parsing: "Analisando...",
            uploadZip: "Carregar ZIP",
            supports: "Suporta TS, Native, etc.",
            searchPlaceholder: "Pesquisar arquivos...",
            noSymbols: "Nenhum símbolo detectado.",
            classes: "Classes",
            properties: "Propriedades",
            functions: "Funções",
            interfaces: "Interfaces",
            members: "Membros",
            line: "Linha",
            selectFile: "Selecione um arquivo.",
            files: "Arquivos",
            generatedOn: "Gerado em"
        },
        regexTester: {
            title: "Testador Regex",
            description: "Teste suas expressões regulares.",
            regexPattern: "Padrão Regex",
            testString: "Texto de Teste",
            testStringPlaceholder: "Cole seu texto...",
            matchHighlight: "Destaque",
            matchCount: "{{count}} correspondências",
            guide: {
                title: "Folha de Dicas",
                common: "Padrões Comuns",
                viewDocs: "Ver Documentação MDN"
            }
        },
        codeQuality: {
            analyzing: "Analisando...",
            copyReport: "Copiar Relatório",
            reupload: "Novo Scan",
            suggestion: "Sugestão",
            severity: { error: "Erro", warning: "Aviso", info: "Info" }
        }
    },
    it: {
        developerGuide: {
            title: "Guida Sviluppatore",
            subtitle: "Documentazione generata automaticamente.",
            exportHtml: "Esporta HTML",
            newProject: "Nuovo Progetto",
            parsing: "Analisi in corso...",
            uploadZip: "Carica ZIP",
            supports: "Supporta TS, Native, ecc.",
            searchPlaceholder: "Cerca file...",
            noSymbols: "Nessun simbolo rilevato.",
            classes: "Classi",
            properties: "Proprietà",
            functions: "Funzioni",
            interfaces: "Interfacce",
            members: "Membri",
            line: "Linea",
            selectFile: "Seleziona un file.",
            files: "File",
            generatedOn: "Generato il"
        },
        regexTester: {
            title: "Tester Regex",
            description: "Testa le tue espressioni regolari.",
            regexPattern: "Pattern Regex",
            testString: "Stringa di Test",
            testStringPlaceholder: "Incolla qui...",
            matchHighlight: "Evidenziazione",
            matchCount: "{{count}} corrispondenze",
            guide: {
                title: "Scheda",
                common: "Pattern Comuni",
                viewDocs: "Vedi Doc MDN"
            }
        },
        codeQuality: {
            analyzing: "Analisi in corso...",
            copyReport: "Copia Report",
            reupload: "Nuova Scansione",
            suggestion: "Suggerimento",
            severity: { error: "Errore", warning: "Avviso", info: "Info" }
        }
    },
    ru: {
        developerGuide: {
            title: "Руководство Разработчика",
            subtitle: "Автоматически сгенерированная документация.",
            exportHtml: "Экспорт HTML",
            newProject: "Новый Проект",
            parsing: "Анализ структуры...",
            uploadZip: "Загрузить ZIP",
            supports: "Поддержка TS, Native и др.",
            searchPlaceholder: "Поиск файлов...",
            noSymbols: "Символы не найдены.",
            classes: "Классы",
            properties: "Свойства",
            functions: "Функции",
            interfaces: "Интерфейсы",
            members: "Члены",
            line: "Строка",
            selectFile: "Выберите файл.",
            files: "Файлы",
            generatedOn: "Создано"
        },
        regexTester: {
            title: "Тестер Regex",
            description: "Тестирование регулярных выражений.",
            regexPattern: "Паттерн Regex",
            testString: "Текст для теста",
            testStringPlaceholder: "Вставьте текст...",
            matchHighlight: "Подсветка",
            matchCount: "{{count}} совпадений",
            guide: {
                title: "Шпаргалка",
                common: "Общие паттерны",
                viewDocs: "Документация MDN"
            }
        },
        codeQuality: {
            analyzing: "Анализ...",
            copyReport: "Копировать отчет",
            reupload: "Новый скан",
            suggestion: "Совет",
            severity: { error: "Ошибка", warning: "Внимание", info: "Инфо" }
        }
    },
    ko: {
        developerGuide: {
            title: "개발자 가이드",
            subtitle: "소스 코드에서 자동 생성된 문서.",
            exportHtml: "HTML 내보내기",
            newProject: "새 프로젝트",
            parsing: "구조 분석 중...",
            uploadZip: "프로젝트 ZIP 업로드",
            supports: "TS, Native (Kotlin, Swift 등) 지원",
            searchPlaceholder: "파일 검색...",
            noSymbols: "감지된 심볼 없음.",
            classes: "클래스",
            properties: "속성",
            functions: "함수",
            interfaces: "인터페이스",
            members: "멤버",
            line: "줄",
            selectFile: "문서를 보려면 파일을 선택하세요.",
            files: "파일",
            generatedOn: "생성일"
        },
        regexTester: {
            title: "Regex 테스터",
            description: "정규 표현식 테스트 및 디버깅.",
            regexPattern: "Regex 패턴",
            testString: "테스트 문자열",
            testStringPlaceholder: "텍스트 붙여넣기...",
            matchHighlight: "일치 강조",
            matchCount: "{{count}} 일치",
            guide: {
                title: "치트 시트",
                common: "일반적인 패턴",
                viewDocs: "MDN 문서 보기"
            }
        },
        codeQuality: {
            analyzing: "코드 분석 중...",
            copyReport: "보고서 복사",
            reupload: "새 스캔",
            suggestion: "제안",
            severity: { error: "오류", warning: "경고", info: "정보" }
        }
    },
    ar: {
        developerGuide: {
            title: "دليل المطور",
            subtitle: "توثيق تم إنشاؤه تلقائيًا من التعليمات البرمجية.",
            exportHtml: "تصدير HTML",
            newProject: "مشروع جديد",
            parsing: "تحليل الهيكل...",
            uploadZip: "رفع ملف ZIP",
            supports: "يدعم TS و Native وغيرها",
            searchPlaceholder: "بحث في الملفات...",
            noSymbols: "لم يتم الكشف عن رموز.",
            classes: "فئات",
            properties: "خصائص",
            functions: "وظائف",
            interfaces: "واجهات",
            members: "أعضاء",
            line: "خط",
            selectFile: "اختر ملفًا لعرض التوثيق.",
            files: "الملفات",
            generatedOn: "تم إنشاؤه في"
        },
        regexTester: {
            title: "مختبر Regex",
            description: "اختبار وتصحيح التعبيرات العادية.",
            regexPattern: "نمط Regex",
            testString: "نص الاختبار",
            testStringPlaceholder: "الصق النص هنا...",
            matchHighlight: "تظليل التطابق",
            matchCount: "{{count}} تطابق",
            guide: {
                title: "ورقة الغش",
                common: "أنماط شائعة",
                viewDocs: "عرض وثائق MDN"
            }
        },
        codeQuality: {
            analyzing: "تحليل الكود...",
            copyReport: "نسخ التقرير",
            reupload: "فحص جديد",
            suggestion: "اقتراح",
            severity: { error: "خطأ", warning: "تحذير", info: "معلومة" }
        }
    },
    hi: {
        developerGuide: {
            title: "डेवलपर गाइड",
            subtitle: "आपके स्रोत कोड से स्वतः जनरेट दस्तावेज़।",
            exportHtml: "HTML निर्यात करें",
            newProject: "नया प्रोजेक्ट",
            parsing: "पार्सिंग चल रही है...",
            uploadZip: "ZIP अपलोड करें",
            supports: "TS, Native का समर्थन करता है",
            searchPlaceholder: "फ़ाइलें खोजें...",
            noSymbols: "कोई प्रतीक नहीं मिला।",
            classes: "क्लास",
            properties: "गुण",
            functions: "फंक्शन",
            interfaces: "इंटरफेस",
            members: "सदस्य",
            line: "लाइन",
            selectFile: "दस्तावेज़ देखने के लिए फ़ाइल चुनें।",
            files: "फ़ाइलें",
            generatedOn: "जनरेट किया गया"
        },
        regexTester: {
            title: "Regex टेस्टर",
            description: "अपने रेगुलर एक्सप्रेशन का परीक्षण करें।",
            regexPattern: "Regex पैटर्न",
            testString: "टेक्स्ट टेस्ट करें",
            testStringPlaceholder: "यहाँ टेक्स्ट पेस्ट करें...",
            matchHighlight: "मैच हाइलाइट",
            matchCount: "{{count}} मिलान",
            guide: {
                title: "चीट शीट",
                common: "सामान्य पैटर्न",
                viewDocs: "MDN दस्तावेज़ देखें"
            }
        },
        codeQuality: {
            analyzing: "कोड स्कैनिंग...",
            copyReport: "रिपोर्ट कॉपी करें",
            reupload: "नया स्कैन",
            suggestion: "सुझाव",
            severity: { error: "त्रुटि", warning: "चेतावनी", info: "जानकारी" }
        }
    }
};

function updateFile(lang, filePath) {
    if (!TRANSLATIONS[lang]) return;

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Merge translations
        data.developerGuide = { ...data.developerGuide, ...TRANSLATIONS[lang].developerGuide };
        data.regexTester = { ...data.regexTester, ...TRANSLATIONS[lang].regexTester }; // Shallow merge mostly for UI strings
        // Deep merge Regex Guide if needed, or just let shallow merge overwrite top levels
        // For 'guide', we have a nested object, so we should be careful. 
        // My definition maps 'guide' fully for title/common/viewDocs.
        if (TRANSLATIONS[lang].regexTester.guide && data.regexTester && data.regexTester.guide) {
            data.regexTester.guide = { ...data.regexTester.guide, ...TRANSLATIONS[lang].regexTester.guide };
        }

        data.codeQuality = { ...data.codeQuality, ...TRANSLATIONS[lang].codeQuality };
        if (TRANSLATIONS[lang].codeQuality.severity) {
            data.codeQuality.severity = { ...data.codeQuality.severity, ...TRANSLATIONS[lang].codeQuality.severity };
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log(`Updated ${path.basename(filePath)} with ${lang} translations`);
    } catch (e) {
        console.error(`Error updating ${filePath}:`, e);
    }
}

const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
files.forEach(f => {
    const lang = path.basename(f, '.json');
    if (lang === 'en') return; // Skip English as it's the source
    updateFile(lang, path.join(LOCALES_DIR, f));
});
console.log("Locales updated with UI translations.");
