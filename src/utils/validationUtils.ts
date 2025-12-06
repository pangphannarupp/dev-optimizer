export interface ValidationError {
    line: number;
    text: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    details: ValidationError[];
}

const getLineNumber = (content: string, index: number): number => {
    return content.substring(0, index).split('\n').length;
};

export const validateContent = (content: string, type: 'vue' | 'ts' | 'js' | 'tsx'): ValidationResult => {
    const details: ValidationError[] = [];
    let isValid = true;

    if (type === 'vue') {
        // Extract template content
        const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/);

        if (templateMatch && templateMatch[1]) {
            const templateContent = templateMatch[1];
            // Calculate where the template content starts in the file
            // templateMatch.index gives start of <template...
            // We need to find the start of the actual content captured in group 1
            const matchIndex = templateMatch.index || 0;
            const fullMatch = templateMatch[0];
            const contentStartIndex = matchIndex + fullMatch.indexOf(templateContent);

            const textContentRegex = />([^<]+)</g;
            let match;
            while ((match = textContentRegex.exec(templateContent)) !== null) {
                const text = match[1].trim();
                if (
                    text &&
                    !text.startsWith('{{') &&
                    !text.startsWith('<!--') &&
                    !/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(text)
                ) {
                    const localIndex = match.index + match[0].indexOf(match[1]); // Index of the captured text
                    const absoluteIndex = contentStartIndex + localIndex;
                    details.push({
                        line: getLineNumber(content, absoluteIndex),
                        text: text,
                        message: `Possible untranslated text in template`
                    });
                    isValid = false;
                }
            }

            const attributeRegex = /\s(label|placeholder|title|alt)="([^"]+)"/g;
            while ((match = attributeRegex.exec(templateContent)) !== null) {
                const attr = match[1];
                const val = match[2];
                if (val.includes(' ') && !val.startsWith('{{') && !val.startsWith('http')) {
                    const localIndex = match.index + match[0].indexOf(val);
                    const absoluteIndex = contentStartIndex + localIndex;
                    details.push({
                        line: getLineNumber(content, absoluteIndex),
                        text: val,
                        message: `Potential untranslated attribute [${attr}]`
                    });
                    isValid = false;
                }
            }
        }
    } else if (type === 'tsx') {
        // For TSX, we check for JSX text content AND standard string literals

        // 1. Check for JSX text content between tags: >Text<
        const jsxTextRegex = />([^<{]+)</g;
        let match;
        while ((match = jsxTextRegex.exec(content)) !== null) {
            const text = match[1].trim();
            if (
                text &&
                !text.startsWith('{') && // Should be covered by regex but double check
                !/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(text)
            ) {
                const absoluteIndex = match.index + match[0].indexOf(match[1]);
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: text,
                    message: `Possible untranslated JSX text`
                });
                isValid = false;
            }
        }

        // 2. Check for attributes in JSX
        const attributeRegex = /\s(label|placeholder|title|alt)="([^"]+)"/g;
        while ((match = attributeRegex.exec(content)) !== null) {
            const attr = match[1];
            const val = match[2];
            if (val.includes(' ') && !val.startsWith('{') && !val.startsWith('http')) {
                const absoluteIndex = match.index + match[0].indexOf(val);
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: val,
                    message: `Potential untranslated JSX attribute [${attr}]`
                });
                isValid = false;
            }
        }

        // 3. Fallback to standard string literal check
        const stringLiteralRegex = /(['"`])(.*?)\1/g;
        let stringMatch;

        while ((stringMatch = stringLiteralRegex.exec(content)) !== null) {
            const str = stringMatch[2];
            // Filter out short strings, keys (no spaces), imports
            if (str.length > 5 && str.includes(' ') && !str.includes('import ') && !str.startsWith('http') && !str.startsWith('data:')) {
                if (/^[a-zA-Z0-9_\-\/\.]+$/.test(str)) continue;
                if (/^(SELECT|INSERT INTO|CREATE TABLE|UPDATE|DELETE FROM|DROP TABLE|ALTER TABLE)/i.test(str)) continue;
                if (/^(notify status|subscribe:|error:|warning:|info:)/i.test(str)) continue;

                // Heuristic: Ignore likely Tailwind/CSS classes
                // If contains multiple common utility words or patterns
                const tailwindPatterns = [/^(flex|grid|block|hidden|absolute|relative|fixed|w-|h-|p-|m-|text-|bg-|border-|rounded-|gap-|items-|justify-)/];
                if (str.split(' ').filter(word => tailwindPatterns.some(p => p.test(word))).length >= 2) {
                    continue;
                }

                const index = stringMatch.index;
                // Check immediate context (preceding text)
                const precedingText = content.substring(Math.max(0, index - 20), index);
                if (/(className|class)\s*=\s*$/.test(precedingText.trimEnd())) {
                    continue;
                }

                const lineStart = content.lastIndexOf('\n', index) + 1;
                const lineEnd = content.indexOf('\n', index);
                const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

                if (/console\.(log|debug|info|warn|error)/.test(lineContent)) continue;

                const absoluteIndex = index + 1;
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: str,
                    message: `Suspicious string literal`
                });
                isValid = false;
            }
        }

    } else {
        const hasTranslationImport = /import.*(i18n|vue-i18n|react-i18next|useTranslation)/.test(content);
        const usesTranslationFunction = /(\$t\(|t\(|i18n\.t\()/.test(content);

        if (!hasTranslationImport && !usesTranslationFunction) {
            const stringLiteralRegex = /(['"`])(.*?)\1/g;
            let stringMatch;
            let suspiciousStringsCount = 0;

            while ((stringMatch = stringLiteralRegex.exec(content)) !== null) {
                const str = stringMatch[2];
                // Filter out short strings, keys (no spaces), imports
                if (str.length > 5 && str.includes(' ') && !str.includes('import ') && !str.startsWith('http') && !str.startsWith('data:')) {
                    // Exclude some common code-like patterns
                    if (/^[a-zA-Z0-9_\-\/\.]+$/.test(str)) continue;

                    // Exclude SQL
                    if (/^(SELECT|INSERT INTO|CREATE TABLE|UPDATE|DELETE FROM|DROP TABLE|ALTER TABLE)/i.test(str)) continue;

                    // Exclude Logs (simple heuristic)
                    if (/^(notify status|subscribe:|error:|warning:|info:)/i.test(str)) continue;

                    // Heuristic: Ignore likely Tailwind/CSS classes
                    const tailwindPatterns = [/^(flex|grid|block|hidden|absolute|relative|fixed|w-|h-|p-|m-|text-|bg-|border-|rounded-|gap-|items-|justify-)/];
                    if (str.split(' ').filter(word => tailwindPatterns.some(p => p.test(word))).length >= 2) {
                        continue;
                    }

                    const index = stringMatch.index;
                    // Check immediate context (preceding text)
                    const precedingText = content.substring(Math.max(0, index - 20), index);
                    // Check if it's a class attribute (Vue often uses class="..." or :class="...")
                    // Or simple object keys in JS?
                    if (/(className|class)\s*=\s*$/.test(precedingText.trimEnd())) {
                        continue;
                    }

                    const lineStart = content.lastIndexOf('\n', index) + 1;
                    const lineEnd = content.indexOf('\n', index);
                    const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

                    if (/console\.(log|debug|info|warn|error)/.test(lineContent)) continue;

                    suspiciousStringsCount++;
                    if (suspiciousStringsCount <= 10) { // Increased limit slightly since we have more detail now
                        // Fix index to point to string content, not quote
                        const absoluteIndex = index + 1;
                        details.push({
                            line: getLineNumber(content, absoluteIndex),
                            text: str,
                            message: `Suspicious string literal`
                        });
                    }
                }
            }

            if (suspiciousStringsCount > 0) {
                isValid = false;
                if (details.length === 0) {
                    details.push({
                        line: 0,
                        text: `${suspiciousStringsCount} potentially untranslated strings found`,
                        message: "General file check"
                    });
                }
            }
        }
    }

    return { isValid, details };
};
