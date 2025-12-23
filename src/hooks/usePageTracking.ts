import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';


import { useTools } from '../config/tools';

export const usePageTracking = () => {
    const location = useLocation();
    const tools = useTools();

    useEffect(() => {
        const trackPageUpdate = () => {
            const page_path = location.pathname + location.search;
            const page_location = window.location.href;

            // Build dynamic map from tools
            const toolMap = tools.reduce((acc, tool) => {
                acc[`/${tool.id}`] = tool.label;
                return acc;
            }, {} as Record<string, string>);

            // Add static routes
            const routeTitles: Record<string, string> = {
                '/': 'Home',
                '/download': 'Download App',
                ...toolMap
            };

            // Determine title
            const baseTitle = 'Dev Optimizer';
            const routeTitle = routeTitles[location.pathname] || 'Unknown Page';
            const fullTitle = `${routeTitle} | ${baseTitle}`;

            // Update document title
            document.title = fullTitle;

            // Collect detailed info
            const ua = navigator.userAgent;
            const screen_res = `${window.screen.width}x${window.screen.height}`;
            const language = navigator.language;
            const platform = navigator.platform;
            const is_electron = !!window.ipcRenderer;

            // console.log(`[Firebase Analytics] Tracking page_view: ${page_path}`, {
            //     ua, screen_res, language, platform, is_electron
            // });

            logEvent(analytics, 'page_view', {
                page_path,
                page_location,
                page_title: fullTitle,
                browser_user_agent: ua,
                screen_resolution: screen_res,
                device_language: language,
                platform_os: platform,
                is_electron_app: is_electron
            });
        };

        trackPageUpdate();
    }, [location, tools]);
};
