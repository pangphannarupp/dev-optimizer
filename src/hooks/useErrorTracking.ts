import { useEffect } from 'react';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

export const useErrorTracking = () => {
    useEffect(() => {
        // 1. Global JS Errors
        const handleError = (event: ErrorEvent) => {
            logEvent(analytics, 'exception', {
                description: `Global Error: ${event.message} at ${event.filename}:${event.lineno}`,
                fatal: true
            });
        };

        // 2. Unhandled Promise Rejections
        const handleRejection = (event: PromiseRejectionEvent) => {
            let errorMsg = 'Unknown Promise Error';
            if (event.reason instanceof Error) {
                errorMsg = event.reason.message;
            } else if (typeof event.reason === 'string') {
                errorMsg = event.reason;
            } else {
                try {
                    errorMsg = JSON.stringify(event.reason);
                } catch (e) {
                    // ignore circular structure etc
                }
            }

            logEvent(analytics, 'exception', {
                description: `Unhandled Promise Rejection: ${errorMsg}`,
                fatal: true
            });
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);
};
