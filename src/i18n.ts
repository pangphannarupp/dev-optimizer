import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';
import pt from './locales/pt.json';
import it from './locales/it.json';
import hi from './locales/hi.json';
import ar from './locales/ar.json';
import km from './locales/km.json';

export const resources = {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    zh: { translation: zh },
    de: { translation: de },
    ja: { translation: ja },
    ko: { translation: ko },
    ru: { translation: ru },
    pt: { translation: pt },
    it: { translation: it },
    hi: { translation: hi },
    ar: { translation: ar },
    km: { translation: km },
} as const;

// Initialize with language detector
const initLanguage = () => {
    const savedLang = localStorage.getItem('i18nextLng');
    // If no saved preference, default to Khmer
    if (!savedLang) {
        return 'km';
    }
    return savedLang;
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: initLanguage(), // Use saved language or default to Khmer
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
