
const content = `
export interface RouterOptionalParams {
    query?: Record<string, any>;
    params?: Record<string, any>;
    allowSwipeBack?: boolean;
}
`;

// Simulate validationUtils.ts
const maskedContent = content.replace(/\/\*[\s\S]*?\*\//g, (match) => ' '.repeat(match.length));
const jsxTextRegex = />([^<{]+)</g;

console.log("--- Testing JSX Text Regex ---");
let match;
while ((match = jsxTextRegex.exec(maskedContent)) !== null) {
    const text = match[1].trim();
    console.log(`Matched JSX: [${text}]`);

    // Check Heuristics
    if (/(&&|\|\||>=|<=|==|!=|\.length|\.replace\(|Math\.|^\s*=\s*['"]|,\s*[a-zA-Z0-9_$]+\s*:\s*[a-zA-Z0-9_$]+)/.test(text)) {
        console.log("  -> Ignored by Heuristic (code-like)");
    } else {
        console.log("  -> WOULD BE FLAGGED");
    }
}
