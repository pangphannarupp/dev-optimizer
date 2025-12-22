
const fs = require('fs');
const path = require('path');

const templatesDir = '/Users/pangphanna/personal/dev-optimizer/src/components/cv-templates';

// Map of texts to finding/replacing logic
// We are handling specific known strings. 
const replacements = [
    { regex: /<h2([^>]*)>Profile<\/h2>/g, replace: "<h2$1>{t('cv.profile')}</h2>" },
    { regex: /<h2([^>]*)>Experience<\/h2>/g, replace: "<h2$1>{t('cv.experience')}</h2>" },
    { regex: /<h2([^>]*)>Education<\/h2>/g, replace: "<h2$1>{t('cv.education')}</h2>" },
    { regex: /<h2([^>]*)>Skills<\/h2>/g, replace: "<h2$1>{t('cv.skills')}</h2>" },
    { regex: /<h2([^>]*)>Languages<\/h2>/g, replace: "<h2$1>{t('cv.languages')}</h2>" },
    { regex: /<h2([^>]*)>Certifications<\/h2>/g, replace: "<h2$1>{t('cv.certifications')}</h2>" },
    { regex: /<h2([^>]*)>References<\/h2>/g, replace: "<h2$1>{t('cv.references')}</h2>" },
    { regex: /<h2([^>]*)>Portfolio<\/h2>/g, replace: "<h2$1>{t('cv.portfolio')}</h2>" },
    // Variations found in templates
    { regex: /Profile<\/h1>/g, replace: "{t('cv.profile')}</h1>" }, // Header variation
    { regex: /Contact Details<\/h3>/g, replace: "{t('cv.contactDetails')}</h3>" },
    { regex: /Contact<\/h2>/g, replace: "{t('cv.contact')}</h2>" },
    { regex: /Contact<\/h3>/g, replace: "{t('cv.contact')}</h3>" },
    { regex: /Summary<\/h3>/g, replace: "{t('cv.summary')}</h3>" },
    { regex: /Work Experience<\/h2>/g, replace: "{t('cv.experience')}</h2>" }, // Creative Template
    { regex: /Projects<\/h2>/g, replace: "{t('cv.projects')}</h2>" },
    { regex: /About Me<\/h2>/g, replace: "{t('cv.about')}</h2>" },
    { regex: /Professional Profile<\/h2>/g, replace: "{t('cv.professionalSummary')}</h2>" },
    { regex: /Selected Works<\/h2>/g, replace: "{t('cv.selectedWorks')}</h2>" },
    { regex: /Expertise<\/h2>/g, replace: "{t('cv.expertise')}</h2>" },
    { regex: /SUMMARY<\/h2>/g, replace: "{t('cv.summary').toUpperCase()}</h2>" }, // Tech Template
    { regex: /GIT_REPOS<\/h2>/g, replace: "{t('cv.projects').toUpperCase()}</h2>" }, // Tech
    { regex: /EXPERIENCE_LOG<\/h2>/g, replace: "{t('cv.experience').toUpperCase()}</h2>" }, // Tech
    { regex: /SKILLS_ARRAY<\/h2>/g, replace: "{t('cv.skills').toUpperCase()}</h2>" }, // Tech
    { regex: /LANGUAGES<\/h2>/g, replace: "{t('cv.languages').toUpperCase()}</h2>" }, // Tech
    { regex: /Badges<\/h2>/g, replace: "{t('cv.awards')}</h2>" }, // Tech
    { regex: /REFS<\/h2>/g, replace: "{t('cv.references').toUpperCase()}</h2>" }, // Tech
    { regex: /Professional Experience<\/h3>/g, replace: "{t('cv.experience')}</h3>" },
    { regex: /Research & Experience<\/h2>/g, replace: "{t('cv.research')}</h2>" },
    { regex: /Publications & Projects<\/h2>/g, replace: "{t('cv.publications')}</h2>" },
    { regex: /Awards & Certifications<\/h2>/g, replace: "{t('cv.awards')}</h2>" },
    { regex: /Skills & Languages<\/h2>/g, replace: "{t('cv.skills')} & {t('cv.languages')}</h2>" },
    { regex: /Core Competencies<\/h3>/g, replace: "{t('cv.coreCompetencies')}</h3>" },
    { regex: /Latest Experience<\/h2>/g, replace: "{t('cv.latestExperience')}</h2>" },
    { regex: /Skills & Additional Info<\/h2>/g, replace: "{t('cv.skills')}</h2>" },
    { regex: />Professional Summary<\/h2>/g, replace: ">{t('cv.professionalSummary')}</h2>" },
    { regex: />About<\/h3>/g, replace: ">{t('cv.about')}</h3>" },
    { regex: /Work<\/h2>/g, replace: "{t('cv.work')}</h2>" },
    { regex: /Key Projects<\/h2>/g, replace: "{t('cv.keyProjects')}</h2>" },
    { regex: /Executive Summary<\/h2>/g, replace: "{t('cv.professionalSummary')}</h2>" },
    // Add more specific ones if needed based on inspection
];

if (!fs.existsSync(templatesDir)) {
    console.error("Templates directory not found");
    process.exit(1);
}

const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx') && f !== 'index.tsx');

files.forEach(file => {
    const filePath = path.join(templatesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add import
    if (!content.includes("useTranslation")) {
        content = "import { useTranslation } from 'react-i18next';\n" + content;
    }

    // 2. Add hook
    if (!content.includes("const { t } = useTranslation()")) {
        content = content.replace(
            /export const (\w+): React\.FC<TemplateProps> = \(\{ data, design \}\) => \{/,
            "export const $1: React.FC<TemplateProps> = ({ data, design }) => {\n    const { t } = useTranslation();"
        );
    }

    // 3. Replacements
    replacements.forEach(({ regex, replace }) => {
        content = content.replace(regex, replace);
    });

    // Special cases for Tech template uppercase logic or others can be refined here
    // But consistent keys like t('cv.profile') handle most cases.
    // For "SUMMARY", we replaced with t('cv.summary').toUpperCase().

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
