/// <reference types="vite/client" />

declare module 'svg2vectordrawable/src/main.browser' {
    export default function svg2vectordrawable(svgCode: string, options?: any): Promise<string>;
}

interface Window {
    ipcRenderer: {
        send(channel: string, ...args: any[]): void;
        on(channel: string, func: (...args: any[]) => void): () => void;
        once(channel: string, func: (...args: any[]) => void): void;
        invoke(channel: string, ...args: any[]): Promise<any>;
        off(channel: string, func: (...args: any[]) => void): void;
    };
}
