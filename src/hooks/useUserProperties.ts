import { useEffect } from 'react';
import { analytics } from '../firebase';
import { setUserProperties } from 'firebase/analytics';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export const useUserProperties = () => {
    const { theme, fontSize } = useTheme();
    const { i18n } = useTranslation();

    useEffect(() => {
        const setProperties = () => {
            const platform = !!window.ipcRenderer ? 'electron' : 'web';
            const os = navigator.platform;
            const userAgent = navigator.userAgent;
            let browser = 'unknown';

            if (userAgent.indexOf("Firefox") > -1) {
                browser = "Mozilla Firefox";
            } else if (userAgent.indexOf("SamsungBrowser") > -1) {
                browser = "Samsung Internet";
            } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
                browser = "Opera";
            } else if (userAgent.indexOf("Trident") > -1) {
                browser = "Microsoft Internet Explorer";
            } else if (userAgent.indexOf("Edge") > -1) {
                browser = "Microsoft Edge";
            } else if (userAgent.indexOf("Chrome") > -1) {
                browser = "Google Chrome";
            } else if (userAgent.indexOf("Safari") > -1) {
                browser = "Apple Safari";
            }

            console.log(`[Firebase Analytics] Setting user properties`, {
                app_platform: platform,
                operating_system: os,
                browser_name: browser,
                preferred_theme: theme,
                font_size_preference: fontSize,
                preferred_language: i18n.language
            });

            setUserProperties(analytics, {
                app_platform: platform,
                operating_system: os,
                browser_name: browser,
                preferred_theme: theme,
                font_size_preference: fontSize,
                preferred_language: i18n.language
            });
        };

        setProperties();
    }, [theme, fontSize, i18n.language]);
};
