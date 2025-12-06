/// <reference types="vite/client" />

declare module 'svg2vectordrawable/src/main.browser' {
    export default function svg2vectordrawable(svgCode: string, options?: any): Promise<string>;
}
