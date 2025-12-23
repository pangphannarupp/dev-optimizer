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

export // Helper to check if string contains potential hardcoded text
    const isPotentialHardcodedString = (str: string): boolean => {
        // Filter out short strings, keys (no spaces), imports, urls, data uris
        if (!str || str.length <= 3 || !str.includes(' ') || str.startsWith('http') || str.startsWith('data:') || str.startsWith('file:') || str.startsWith('javascript:') || str === 'use strict' || str === "'use strict'") {
            return false;
        }

        // Ignore strings with underscores (usually technical keys or class names like 'line_top')
        if (str.includes('_')) return false;

        // Ignore separator strings (====, ----, ****) often used in logs
        if (/([=\-*]){3,}/.test(str)) return false;

        // Allow purely alphanumeric underscore/dash/dot strings (often internal IDs)
        if (/^[a-zA-Z0-9_\-\/\.]+$/.test(str)) return false;

        // Exclude SQL
        if (/^(SELECT|INSERT INTO|CREATE TABLE|UPDATE|DELETE FROM|DROP TABLE|ALTER TABLE|VALUES)/i.test(str)) return false;

        // Exclude SQL definitions/fragments
        if (/\b(VARCHAR|PRIMARY KEY|AUTOINCREMENT|CURRENT_TIMESTAMP|NOT NULL)\b/i.test(str)) return false;

        // Exclude Logs/Tech prefixes
        if (/^(notify status|subscribe:|error:|warning:|info:|debug:)/i.test(str)) return false;

        // Exclude date formats (including 'a' for AM/PM marker and comma)
        if (/^[ymdYMDHhmsS\/\-:\sT\.a,]+$/.test(str)) return false;

        // Exclude Time strings (e.g. 12:30 PM, 23:59:59)
        if (/^\d{1,2}:\d{2}(:\d{2})?(\s?[AP]M)?$/i.test(str)) return false;

        // Exclude string format specifiers (e.g. %.1f, %d, %s)
        if (/^%[\d\.]*[sdf]/.test(str)) return false;

        // Exclude Kotlin/Java format strings with units (e.g. %.1fM km, %.1f km)
        if (/^%[\d\.]*[sdf][a-zA-Z\s]*$/.test(str)) return false;

        // Exclude Kotlin string templates starting with $
        if (str.startsWith('$')) return false;

        return true;
    };

export const validateContent = (content: string, type: 'vue' | 'ts' | 'js' | 'tsx' | 'android-xml' | 'kotlin' | 'java' | 'swift' | 'ios-xib' | 'objc' | 'html'): ValidationResult => {
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
                    !/^&[a-zA-Z0-9#]+;$/.test(text) &&
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
    } else if (type === 'html') {
        // Mask script and style content to avoid false positives
        let meaningfulContent = content.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/gi, (_, open, body, close) => {
            return open + ' '.repeat(body.length) + close;
        });
        meaningfulContent = meaningfulContent.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, open, body, close) => {
            return open + ' '.repeat(body.length) + close;
        });
        meaningfulContent = meaningfulContent.replace(/(<title[^>]*>)([\s\S]*?)(<\/title>)/gi, (_, open, body, close) => {
            return open + ' '.repeat(body.length) + close;
        });

        const textContentRegex = />([^<]+)</g;
        let match;
        while ((match = textContentRegex.exec(meaningfulContent)) !== null) {
            const text = match[1].trim();
            // Ignore template syntax often found in HTML files (EJS, Handlebars cards {{ }})
            if (
                text &&
                !text.startsWith('{{') &&
                !text.startsWith('<%') &&
                !text.startsWith('<!--') &&
                !/^&[a-zA-Z0-9#]+;$/.test(text) &&
                !/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(text)
            ) {
                const absoluteIndex = match.index + match[0].indexOf(match[1]);
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: text,
                    message: `Possible untranslated HTML text`
                });
                isValid = false;
            }
        }

        const attributeRegex = /\s(label|placeholder|title|aria-label)="([^"]+)"/g;
        while ((match = attributeRegex.exec(meaningfulContent)) !== null) {
            const attr = match[1];
            const val = match[2];
            if (val.includes(' ') && !val.startsWith('{{') && !val.startsWith('http') && !val.startsWith('#')) {
                const absoluteIndex = match.index + match[0].indexOf(val);
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: val,
                    message: `Potential untranslated HTML attribute [${attr}]`
                });
                isValid = false;
            }
        }
    } else if (type === 'tsx' || type === 'ts' || type === 'js') {
        // For TSX/TS/JS, we check for JSX text content AND standard string literals

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

            if (!isPotentialHardcodedString(str)) continue;

            // Heuristic: Ignore likely Tailwind/CSS classes
            const tailwindPatterns = [/^(flex|grid|block|hidden|absolute|relative|fixed|w-|h-|p-|m-|text-|bg-|border-|rounded-|gap-|items-|justify-)/];
            if (str.split(' ').filter(word => tailwindPatterns.some(p => p.test(word))).length >= 2) {
                continue;
            }

            const index = stringMatch.index;
            // Check immediate context (preceding text)
            const precedingText = content.substring(Math.max(0, index - 50), index);
            if (/(className|class)\s*[:=]\s*$/.test(precedingText.trimEnd())) {
                continue;
            }

            // Ignore Exceptions/Errors (e.g. throw new Error("..."), new TypeError("..."))
            if (/(throw\s+new\s+[a-zA-Z0-9_$]+|new\s+[a-zA-Z0-9_$]*(Error|Exception)|throw)\s*\(?\s*$/.test(precedingText.trimEnd())) {
                continue;
            }

            const lineStart = content.lastIndexOf('\n', index) + 1;
            const lineEnd = content.indexOf('\n', index);
            const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

            // Ignore comments
            if (lineContent.trim().startsWith('//')) continue;

            if (/(console|BizMOBLogger)\.(log|debug|info|warn|error)|(\.log\()/.test(lineContent)) continue;

            const absoluteIndex = index + 1;
            details.push({
                line: getLineNumber(content, absoluteIndex),
                text: str,
                message: `Suspicious string literal`
            });
            isValid = false;
        }

    } else if (type === 'android-xml') {
        const attributeRegex = /android:(text|hint|contentDescription|title|summary)="([^"]+)"/g;
        let match;
        while ((match = attributeRegex.exec(content)) !== null) {
            const attr = match[1];
            const val = match[2];

            // Ignore if it's a reference (@string/, ?attr/) or data binding (@{...})
            if (val.startsWith('@') || val.startsWith('?')) continue;

            // Ignore pure numbers or symbols
            if (/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(val)) continue;

            const absoluteIndex = match.index + match[0].indexOf(val);
            details.push({
                line: getLineNumber(content, absoluteIndex),
                text: val,
                message: `Hardcoded Android XML attribute [${attr}]`
            });
            isValid = false;
        }
    } else if (type === 'kotlin' || type === 'java') {
        // Basic string literal check for Kotlin/Java
        const stringLiteralRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
        let match;

        // Mask block comments
        const maskedContent = content.replace(/\/\*[\s\S]*?\*\//g, (match) => ' '.repeat(match.length));

        while ((match = stringLiteralRegex.exec(maskedContent)) !== null) {
            const str = match[1];
            if (!isPotentialHardcodedString(str)) continue;

            const index = match.index;
            const lineStart = content.lastIndexOf('\n', index) + 1;
            const lineEnd = content.indexOf('\n', index);
            const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

            // Ignore comments
            if (lineContent.trim().startsWith('//')) continue;

            // Ignore Toast messages
            if (/Toast\.makeText\(/.test(lineContent)) continue;

            // Ignore Logs
            const logContext = content.substring(Math.max(0, index - 300), index);
            if (/(Log\.[civdwe]|Logger\.|System\.out\.|Timber\.|BizMOBLogger\.|println\()|(\.log\()/.test(lineContent) || /(Log\.[civdwe]|Logger\.|System\.out\.|Timber\.|BizMOBLogger\.|println\()[\s\S]*$/.test(logContext)) continue;

            // Ignore HTTP Headers
            if (/(\.addHeader\(|\.header\(|\.setRequestProperty\()/.test(lineContent)) continue;

            // Ignore Annotations (lines starting with @, or string inside @Annotation(...))
            if (lineContent.trim().startsWith('@')) continue;

            // Ignore usual non-translatable keys in maps/intents
            if (/(extra|key|action|name|id|tag|token|pref)/i.test(lineContent) && !lineContent.includes('Title') && !lineContent.includes('Message')) continue;

            // Ignore Exceptions (throw new Exception("...") or throw Exception("..."))
            const exceptionContext = content.substring(Math.max(0, index - 300), index);
            if (/(throw\s+|Exception\(|Error\()/.test(lineContent) || /(throw\s+new\s+[a-zA-Z0-9_.]+|throw\s+[a-zA-Z0-9_.]+\()[\s\S]*$/.test(exceptionContext)) continue;

            details.push({
                line: getLineNumber(content, index + 1), // +1 to point to content inside quote
                text: str,
                message: `Hardcoded string literal`
            });
            isValid = false;
        }
    } else if (type === 'swift' || type === 'objc') {
        // Swift/ObjC string literals
        const stringLiteralRegex = type === 'objc' ? /@"([^"\\]*(?:\\.[^"\\]*)*)"/g : /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
        let match;

        while ((match = stringLiteralRegex.exec(content)) !== null) {
            const str = match[1];
            if (!isPotentialHardcodedString(str)) continue;

            const index = match.index;
            const lineStart = content.lastIndexOf('\n', index) + 1;
            const lineEnd = content.indexOf('\n', index);
            const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

            // Ignore comments
            if (lineContent.trim().startsWith('//')) continue;

            // Ignore NSLocalizedString (Swift/ObjC)
            if (/NSLocalizedString/.test(lineContent)) continue;
            if (type === 'swift' && /Text\(/.test(lineContent) && !/"/.test(str)) {
                // Creating Text("key") usually works if key is LocalizedStringKey.
                // But Text("Hello World") is hardcoded. 
                // We will flag it if it validates isPotentialHardcodedString (space check handles keys vs sentences largely)
            }

            // Ignore logging
            if (/(print\(|NSLog|os_log|debugPrint)/.test(lineContent)) continue;

            // Ignore identifiers
            if (/(identifier|key|name|vc|controller|storyboard|segue)/i.test(lineContent)) continue;

            details.push({
                line: getLineNumber(content, index + 1 + (type === 'objc' ? 1 : 0)),
                text: str,
                message: `Hardcoded string literal`
            });
            isValid = false;
        }
    } else if (type === 'ios-xib') {
        // Check XML attributes for XIB/Storyboard
        const attributeRegex = /\s(text|title|placeholder|headerTitle|footerTitle)="([^"]+)"/g;
        let match;
        while ((match = attributeRegex.exec(content)) !== null) {
            const attr = match[1];
            const val = match[2];

            // Ignore Object IDs (simple heuristic: 3 chars - 3 chars - 3 chars approximately, or pure internal IDs)
            // Or if it looks completely like an ID
            if (/^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/.test(val)) continue;

            if (!isPotentialHardcodedString(val)) continue;

            const absoluteIndex = match.index + match[0].indexOf(val);
            details.push({
                line: getLineNumber(content, absoluteIndex),
                text: val,
                message: `Hardcoded XIB/Storyboard string [${attr}]`
            });
            isValid = false;
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

                if (!isPotentialHardcodedString(str)) continue;

                // Heuristic: Ignore likely Tailwind/CSS classes
                const tailwindPatterns = [/^(flex|grid|block|hidden|absolute|relative|fixed|w-|h-|p-|m-|text-|bg-|border-|rounded-|gap-|items-|justify-)/];
                if (str.split(' ').filter(word => tailwindPatterns.some(p => p.test(word))).length >= 2) {
                    continue;
                }

                const index = stringMatch.index;
                const precedingText = content.substring(Math.max(0, index - 20), index);
                if (/(className|class)\s*[:=]\s*$/.test(precedingText.trimEnd())) {
                    continue;
                }

                const lineStart = content.lastIndexOf('\n', index) + 1;
                const lineEnd = content.indexOf('\n', index);
                const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

                // Ignore comments
                if (lineContent.trim().startsWith('//')) continue;

                if (/(console|BizMOBLogger)\.(log|debug|info|warn|error)/.test(lineContent)) continue;

                suspiciousStringsCount++;
                if (suspiciousStringsCount <= 10) {
                    const absoluteIndex = index + 1;
                    details.push({
                        line: getLineNumber(content, absoluteIndex),
                        text: str,
                        message: `Suspicious string literal`
                    });
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
