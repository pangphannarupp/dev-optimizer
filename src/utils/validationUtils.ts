export interface ValidationError {
    line: number;
    text: string;
    message: string;
    context?: string; // New field: Tag name (e.g. "Button") or Attribute name (e.g. "placeholder")
}

export interface ValidationResult {
    isValid: boolean;
    details: ValidationError[];
    context?: string;
}

const getLineNumber = (content: string, index: number): number => {
    return content.substring(0, index).split('\n').length;
};

// Helper: Try to find the tag name surrounding the text at 'index'
// This is a heuristic and matches the nearest preceding opening tag.
const getLastOpenTag = (content: string, index: number): string | undefined => {
    // Look backwards from index for the last <Tag...
    // We limit the search to ~500 chars to avoid performance issues
    const preceding = content.substring(Math.max(0, index - 500), index);

    // Regex to find tags. We want the LAST one.
    // Matches <Tag, but excludes </Tag and <Tag/> (self-closing check is hard with regex, we assume standard structure)
    // Actually, we just want to know "what are we inside?".
    // Simple heuristic: Find the last <[Word] that is not </[Word].

    // Matches <Tag, but excludes </Tag
    // We do NOT require the closing > because we might be inside the tag (attributes) or right at the closing > (text content)
    const matches = [...preceding.matchAll(/<(?!\/)([a-zA-Z0-9\-\.]+)/g)];
    if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const tagName = lastMatch[1];

        // Ignore void tags if they appear immediately before?
        // e.g. <div><br>Text</div> -> We want div, not br.
        const voidTags = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);
        if (!voidTags.has(tagName.toLowerCase())) {
            return tagName;
        }
        // If it was void, maybe look at the one before?
        if (matches.length > 1) {
            return matches[matches.length - 2][1];
        }
    }
    return undefined;
};

export // Helper to check if string contains potential hardcoded text
    const isPotentialHardcodedString = (str: string): boolean => {
        const trimmed = str.trim();
        if (!str || str.length <= 1 || (str.length <= 3 && !/[a-zA-Z]/.test(str))) {
            return false;
        }

        if (trimmed.startsWith('http') || trimmed.startsWith('https') || trimmed.startsWith('data:') || trimmed.startsWith('file:') || trimmed.startsWith('javascript:')) {
            return false;
        }

        if (str === 'use strict' || str === "'use strict'") return false;

        // Define safe words (Titlecase or Acronyms) that should NOT be filtered by strict checks
        const codeKeywords = new Set(['String', 'Number', 'Boolean', 'Object', 'Array', 'Function', 'Promise', 'Date', 'RegExp', 'Error', 'undefined', 'null', 'NaN', 'Infinity', 'Symbol', 'BigInt', 'Math', 'JSON', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Intl', 'Reflect', 'Proxy', 'Buffer', 'Process', 'global']);

        let isSafeWord = false;
        if (!str.includes(' ')) {
            // Allow Titlecase words (e.g. "Land", "Factory", "Submit") if strictly alphabetic
            if (/^[A-Z][a-z]+$/.test(str) && !codeKeywords.has(str)) {
                isSafeWord = true;
            } else if (/^(OK|FAQ|ID|OS|UI|UX|API|URL)$/.test(str)) {
                // Allow specific capitalized acronyms
                isSafeWord = true;
            }
        }

        if (!str.includes(' ') && !isSafeWord) {
            // If it's a single word and NOT safe, revert to strict filtering 
            // This excludes 'id', 'key', 'timestamp', 'LAND_ROVER', 'camelCase'
            return false;
        }

        // Ignore strings with underscores (usually technical keys or class names like 'line_top')
        if (str.includes('_')) return false;

        // Ignore separator strings (====, ----, ****) often used in logs
        if (/([=\-*]){3,}/.test(str)) return false;

        // Allow purely alphanumeric underscore/dash/dot strings (often internal IDs)
        // IMPORTANT: If it is a safe word, we skip this check because "Land" matches this regex!
        if (!isSafeWord && /^[a-zA-Z0-9_\-\/\.]+$/.test(str)) return false;

        // Exclude SQL
        if (/^(SELECT|INSERT INTO|CREATE TABLE|UPDATE|DELETE FROM|DROP TABLE|ALTER TABLE|VALUES)/i.test(str)) return false;

        // Exclude SQL definitions/fragments
        if (/\b(VARCHAR|PRIMARY KEY|AUTOINCREMENT|CURRENT_TIMESTAMP|NOT NULL)\b/i.test(str)) return false;

        // Exclude Logs/Tech prefixes
        if (/^(notify status|subscribe:|error:|warning:|info:|debug:)/i.test(str)) return false;

        // Exclude date formats (including 'a' for AM/PM marker and comma)
        if (/^[ymdYMDHhmsSkKzZ\/\-:\sT\.a,]+$/.test(str)) return false;

        // Exclude Time strings (e.g. 12:30 PM, 23:59:59)
        if (/^\d{1,2}:\d{2}(:\d{2})?(\s?[AP]M)?$/i.test(str)) return false;

        // Exclude string format specifiers (e.g. %.1f, %d, %s)
        if (/^%[\d\.]*[sdf]/.test(str)) return false;

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

                // Heuristic: If the text contains HTML attribute assignments (e.g. class="foo"), it's likely we matched inside a tag due to unescaped '>' in an attribute
                // e.g. <div v-if="a > b" class="foo"> -> matched ">" in v-if, so text is ' b" class="foo"'
                if (/\s[a-zA-Z0-9:_-]+=['"]/.test(text)) continue;

                if (
                    text &&
                    !text.startsWith('{{') &&
                    !/^.{0,3}\{\{.*\}\}.{0,3}$/.test(text) &&
                    !text.startsWith('<!--') &&
                    !/^&[a-zA-Z0-9#]+;$/.test(text) &&
                    !/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(text)
                ) {
                    const localIndex = match.index + match[0].indexOf(match[1]); // Index of the captured text
                    const absoluteIndex = contentStartIndex + localIndex;

                    // Determine Context (Tag Name) logic
                    const tagName = getLastOpenTag(templateContent, match.index);

                    details.push({
                        line: getLineNumber(content, absoluteIndex),
                        text: text,
                        message: `Possible untranslated text in template`,
                        context: tagName,
                    });
                    isValid = false;
                }
            }

            const attributeRegex = /\s(label|placeholder|title|alt)="([^"]+)"/g;
            while ((match = attributeRegex.exec(templateContent)) !== null) {
                const attr = match[1];
                const val = match[2];
                if (isPotentialHardcodedString(val) && !val.startsWith('{{') && !val.startsWith('http')) {
                    const localIndex = match.index + match[0].indexOf(val);
                    const absoluteIndex = contentStartIndex + localIndex;
                    details.push({
                        line: getLineNumber(content, absoluteIndex),
                        text: val,
                        message: `Potential untranslated attribute [${attr}]`,
                        context: attr // For attributes, context is the attribute name
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
                const tagName = getLastOpenTag(meaningfulContent, match.index);
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: text,
                    message: `Possible untranslated HTML text`,
                    context: tagName
                });
                isValid = false;
            }
        }

        const attributeRegex = /\s(label|placeholder|title|aria-label)="([^"]+)"/g;
        while ((match = attributeRegex.exec(meaningfulContent)) !== null) {
            const attr = match[1];
            const val = match[2];
            if (isPotentialHardcodedString(val) && !val.startsWith('{{') && !val.startsWith('http') && !val.startsWith('#')) {
                const absoluteIndex = match.index + match[0].indexOf(val);
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: val,
                    message: `Potential untranslated HTML attribute [${attr}]`,
                    context: attr
                });
                isValid = false;
            }
        }
    } else if (type === 'tsx' || type === 'ts' || type === 'js') {
        // For TSX/TS/JS, we check for JSX text content AND standard string literals
        // Mask block comments to avoid matching text inside them (e.g. JSDoc)
        const maskedContent = content.replace(/\/\*[\s\S]*?\*\//g, (match) => ' '.repeat(match.length));

        // 1. Check for JSX text content between tags: >Text<
        // Note: maskedContent has comments masked.
        // We might want to use 'content' for context lookup to be safe, or maskedContent if tags are safe.
        // Tags are safe in maskedContent.
        const jsxTextRegex = />([^<{]+)</g;
        let match;
        while ((match = jsxTextRegex.exec(maskedContent)) !== null) {
            const text = match[1].trim();
            // Check absolute index in original content to verify context
            const matchStart = match.index;
            const matchEnd = match.index + match[0].length;

            // Check preceding char (avoid match if it is '=>' or '>=')
            const charBefore = content[matchStart - 1];
            if (charBefore === '=' || charBefore === '-') continue;

            // Check succeeding char (after <). Should be a tag start (letter, /, !)
            // match[0] ends with '<', so look at content[matchEnd]
            // Actually regex consumes <, so next char is at (match.index + match[0].length)
            // Wait, match[0] includes the trailing <. So the char *after* the match in content is content[match.index + match[0].length]??
            // references: match[0] is the whole string ">text<". 
            // The character immediately following the match is content[match.index + match[0].length].
            // Ignore if index is within a line that looks like a comment (e.g. JSDoc)
            // Masking should handle this, but if it fails, this is a fallback.
            const lineStart = content.lastIndexOf('\n', matchStart) + 1;
            const lineEnd = content.indexOf('\n', matchStart);
            const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);
            const trimmedLine = lineContent.trim();
            if (trimmedLine.startsWith('*') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) continue;

            const charAfter = content[matchEnd];
            if (!/[a-zA-Z\/!]/.test(charAfter)) continue;

            // Heuristic: If the captured text contains code-like patterns (&&, ||, member access, assignment), ignore it
            // This catches cases like "length > 0 && length < 10" and TS generics: `> = "nearest", inline: Partial<`
            if (/(&&|\|\||>=|<=|==|!=|\.length|\.replace\(|Math\.|^\s*=\s*['"]|,\s*[a-zA-Z0-9_$]+\s*:\s*[a-zA-Z0-9_$]+)/.test(text)) continue;

            // Heuristic: Ignore TS/JS keywords or syntax that suggests this is code (e.g. between generic types: Record<A>; x: Record<B>)
            if (/(^|\s)(interface|export|import|const|let|var|function|class|return|type|public|private|protected|readonly)\s/.test(text)) continue;
            if (text.includes(';\n') || text.includes('?:') || text.includes('):') || text.includes('=>')) continue;

            // Heuristic: If the text contains HTML attribute assignments (e.g. class="foo"), it's likely we matched inside a tag due to unescaped '>' in an attribute
            if (/\s[a-zA-Z0-9:_-]+=['"]/.test(text)) continue;

            if (
                text &&
                !text.startsWith('{') && // Should be covered by regex but double check
                !/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(text)
            ) {
                const absoluteIndex = match.index + match[0].indexOf(match[1]);
                const tagName = getLastOpenTag(maskedContent, match.index); // Use maskedContent as we want tag context, and comments are masked with spaces
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: text,
                    message: `Possible untranslated JSX text`,
                    context: tagName
                });
                isValid = false;
            }
        }
        // 2. Check for attributes in JSX
        const attributeRegex = /\s(label|placeholder|title|alt)="([^"]+)"/g;
        while ((match = attributeRegex.exec(maskedContent)) !== null) {
            const attr = match[1];
            const val = match[2];
            if (isPotentialHardcodedString(val) && !val.startsWith('{') && !val.startsWith('http')) {
                const absoluteIndex = match.index + match[0].indexOf(val);
                details.push({
                    line: getLineNumber(content, absoluteIndex),
                    text: val,
                    message: `Potential untranslated JSX attribute [${attr}]`,
                    context: attr
                });
                isValid = false;
            }
        }

        // 3. Fallback to standard string literal check
        const stringLiteralRegex = /(['"`])(.*?)\1/g;
        let stringMatch;

        while ((stringMatch = stringLiteralRegex.exec(maskedContent)) !== null) {
            const quote = stringMatch[1];
            const str = stringMatch[2];

            // Ignore template literals with interpolations (e.g. `Value: ${val}`)
            // Since we replaced the content with spaces in maskedContent check if original had it?
            // Actually maskedContent masks comments, not code. Code is intact.
            if (quote === '`' && /\$\{/.test(str)) continue;

            if (!isPotentialHardcodedString(str)) continue;

            // Heuristic: Ignore likely Tailwind/CSS classes
            const tailwindPatterns = [/^(flex|grid|block|hidden|absolute|relative|fixed|w-|h-|p-|m-|text-|bg-|border-|rounded-|gap-|items-|justify-)/];
            if (str.split(' ').filter(word => tailwindPatterns.some(p => p.test(word))).length >= 2) {
                continue;
            }

            // Heuristic: Ignore likely Regex patterns or strings with many unicode escapes
            // e.g. "(?:[\u2700-\u27bf]|...)"
            if (str.length > 50 && (str.match(/\\u[0-9a-fA-F]{4}/g) || []).length > 3) continue;
            if (str.startsWith('^') || str.endsWith('$') || (str.includes('[') && str.includes(']')) || (str.includes('(') && str.includes(')'))) {
                // If it looks like a complex regex (has many escapes and special chars)
                if ((str.match(/\\[dswDSW\.\[\]\(\)\{\}\+\*\?]/g) || []).length > 2) continue;
            }

            // Ignore Regex modifiers or captured fragments (e.g. "/g, ", "]+/g, ")
            if (/[\]\)]+\/([gimuy]*),\s*$/.test(str) || /\/([gimuy]*),\s*$/.test(str)) continue;

            // Ignore code fragments captured between strings (e.g. ").split(", ").trim()")
            if (str.startsWith(').') || str.startsWith('].') || str.startsWith(',') || str.startsWith(')')) continue;

            const index = stringMatch.index;
            // Check immediate context (preceding text)
            const precedingText = content.substring(Math.max(0, index - 50), index);
            if (/(className|class)\s*[:=]\s*$/.test(precedingText.trimEnd())) {
                continue;
            }

            // Ignore property access and setAttribute style
            if (/[a-zA-Z0-9_$!]\s*\[\s*$/.test(precedingText.trimEnd()) || /setAttribute\(\s*['"]style['"]\s*,\s*$/.test(precedingText.trimEnd())) continue;

            // Ignore MIME types and charset (e.g. "application/json", "charset=UTF-8")
            if (/^(application|text|image|audio|video|multipart)\//.test(str) || str.includes('charset=')) continue;

            // Ignore inline CSS styles (e.g. "width: 25px; height: 25px;")
            if ((str.match(/[a-z-]+\s*:\s*[^;]+;/g) || []).length >= 1) continue;

            // Ignore switch case strings (e.g. case "count":)
            if (/case$/.test(precedingText.trimEnd())) {
                continue;
            }

            // Ignore Exceptions/Errors (e.g. throw new Error("..."), new TypeError("..."))
            if (/(throw\s+new\s+[a-zA-Z0-9_$]+|new\s+[a-zA-Z0-9_$]*(Error|Exception)|throw)\s*\(?\s*$/.test(precedingText.trimEnd())) {
                continue;
            }

            // Ignore CSS selectors (e.g. querySelector(".class"), $(...))
            if (/(querySelector|querySelectorAll|closest|\$)\s*\(\s*$/.test(precedingText.trimEnd())) {
                continue;
            }
            // Heuristic for CSS strings: starts with . or # and contains css chars
            if (/^[\.#][a-zA-Z0-9_\-\s,\.>+~]+$/.test(str)) {
                continue;
            }

            // Ignore CSS values (e.g. style.overflow = "hidden", "cubic-bezier(...)")
            if (/\.style\.[a-zA-Z0-9_$]+\s*=\s*$/.test(precedingText.trimEnd())) continue;
            if (/(px|rem|em|%|vh|vw|deg|rad|turn|s|ms)$/.test(str) && /\d/.test(str)) continue;
            if (/(cubic-bezier|rgb|rgba|hsl|hsla|calc|var|url|linear-gradient)\(/.test(str)) continue;

            // Ignore if key is a known CSS property (e.g. transition: "...", 'background-color': "...", style.margin = "...")
            const cssProps = ["transition", "transform", "animation", "background", "margin", "padding", "border", "font", "color", "opacity", "display", "position", "top", "left", "right", "bottom", "width", "height", "zIndex", "cursor", "overflow", "pointerEvents", "whiteSpace", "wordBreak", "textOverflow", "boxShadow", "borderRadius"];
            // Matches: property: "...", property: '...', property= "..."
            const propRegex = new RegExp(`(${cssProps.join('|')})\\s*[:=]\\s*$`, 'i');
            if (propRegex.test(precedingText.trimEnd())) continue;

            const cssKeywords = ["hidden", "visible", "scroll", "auto", "pointer", "block", "inline", "flex", "grid", "none", "solid", "dashed", "dotted", "absolute", "relative", "fixed", "sticky", "bold", "italic", "underline", "center", "left", "right", "top", "bottom", "middle", "justify", "contain", "cover", "row", "column", "wrap", "nowrap", "ease", "ease-in", "ease-out", "ease-in-out", "linear"];
            if (cssKeywords.includes(str)) continue;
            // Shorthands like "all .1s ease"
            if (/^\s*(all|none|\d+(\.\d+)?[a-z%]+)(\s+(all|none|\d+(\.\d+)?[a-z%]+|ease|linear|cubic-bezier.*))*\s*$/.test(str)) continue;

            const lineStart = content.lastIndexOf('\n', index) + 1;
            const lineEnd = content.indexOf('\n', index);
            const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

            // Ignore comments
            if (lineContent.trim().startsWith('//')) continue;

            if (/(console|BizMOBLogger|BMCLog|Logger)\.(log|debug|info|warn|error)|(\.log\(|print\(|println\()/.test(lineContent)) continue;

            // Ignore Shell commands (e.g. "npm run dev", "node script.js")
            if (/^(npm|node|yarn|pnpm|npx)\s+/.test(str)) continue;

            // Ignore env vars key access often found in config (e.g. process.env.CI)
            if (lineContent.includes('process.env.')) continue;
            if (str.includes('process.env.')) continue;

            // Check succeeding text for object key pattern (e.g. "key": value)
            const succeedingText = content.substring(index + stringMatch[0].length, index + stringMatch[0].length + 50);
            if (/^\s*:/.test(succeedingText)) continue;

            // Ignore date/time patterns (e.g. "hh:mm tt", "YYYY-MM-DD")
            if (/^[ymdYMDHhmsSkKzZ\/\-:\sT\.a,]+$/.test(str) || /tt/.test(str)) continue;

            const absoluteIndex = index + 1;
            details.push({
                line: getLineNumber(content, absoluteIndex),
                text: str,
                message: `Suspicious string literal`
                // No specific context for generic string literals
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
                message: `Hardcoded Android XML attribute [${attr}]`,
                context: attr // e.g. "text", "hint", "title"
            });
            isValid = false;
        }
    } else if (type === 'kotlin' || type === 'java') {
        // Basic string literal check for Kotlin/Java
        const stringLiteralRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
        let match;

        // Mask block comments
        const maskedContent = content.replace(/\/\*[\s\S]*?\/\//g, (match) => ' '.repeat(match.length));

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
            if (/(Log\.[civdwe]|Logger\.|System\.out\.|Timber\.|BizMOBLogger\.|BMCLog\.|print\(|println\()|(\.log\()/.test(lineContent) || /(Log\.[civdwe]|Logger\.|System\.out\.|Timber\.|BizMOBLogger\.|BMCLog\.|print\(|println\()[\s\S]*$/.test(logContext)) continue;

            // Ignore HTTP Headers
            if (/(\.addHeader\(|\.header\(|\.setRequestProperty\()/.test(lineContent)) continue;

            // Ignore string methods (startsWith, endsWith, contains, equals, matches, replace, split) using hardcoded technical strings
            // e.g. url.startsWith("http") -> "http" is technical
            if (/\.(startsWith|endsWith|contains|equals|indexOf|lastIndexOf|matches|replace|split)\(/.test(lineContent)) continue;

            // Ignore Annotations (lines starting with @, or string inside @Annotation(...))
            if (lineContent.trim().startsWith('@')) continue;

            // Ignore usual non-translatable keys in maps/intents
            if (/(extra|key|action|name|id|tag|token|pref)/i.test(lineContent) && !lineContent.includes('Title') && !lineContent.includes('Message')) continue;

            // Ignore Exceptions (throw new Exception("...") or throw Exception("..."))
            const exceptionContext = content.substring(Math.max(0, index - 300), index);
            if (/(throw\s+|Exception\(|Error\()/.test(lineContent) || /(throw\s+new\s+[a-zA-Z0-9_.]+|throw\s+[a-zA-Z0-9_.]+\()[\s\S]*$/.test(exceptionContext)) continue;

            // Try to extract context from preceding text
            const precedingText = content.substring(Math.max(0, index - 50), index).trim();
            let context: string | undefined = undefined;

            // Match method calls or assignments: setTitle(...), text = ..., title = ...
            // Kotlin named args: title = "..."
            const contextMatch = precedingText.match(/(\w+)\s*[=(]\s*$/);
            if (contextMatch) {
                context = contextMatch[1];
            }

            details.push({
                line: getLineNumber(content, match.index + 1), // +1 to point to content inside quote
                text: str,
                message: `Hardcoded string literal`,
                context: context
            });
            isValid = false;
        }
    } else if (type === 'swift' || type === 'objc') {
        // Swift/ObjC string literals
        // Tokenizer regex: Matches multiline strings ("""..."""), single line strings ("..."), line comments (//...), and block comments (/*...*/)
        // Capture groups:
        // 1: Multiline string content (Swift only)
        // 2: Single line string content
        // 3: Line comment
        // 4: Block comment
        const tokenizerRegex = type === 'objc'
            ? /@"([^"\\]*(?:\\.[^"\\]*)*)"|(\/\/.*)|(\/\*[\s\S]*?\*\/)/g
            : /"""([\s\S]*?)"""|"([^"\\]*(?:\\.[^"\\]*)*)"|(\/\/.*)|(\/\*[\s\S]*?\*\/)/g;

        let match;

        while ((match = tokenizerRegex.exec(content)) !== null) {
            // If it's a comment, skip
            if (match[3] || match[4] || (type === 'objc' && (match[2] || match[3]))) { // Adjust group indices for ObjC
                // For ObjC regex: Group 1 is string, Group 2 is line comment, Group 3 is block comment.
                // For Swift regex: Group 1 is multiline, Group 2 is single line, Group 3 is line comment, Group 4 is block comment.
                continue;
            }

            // Extract the string content
            let str = '';
            let isMultiline = false;

            if (type === 'swift') {
                if (match[1] !== undefined) {
                    str = match[1];
                    isMultiline = true;
                } else if (match[2] !== undefined) {
                    str = match[2];
                } else {
                    // Comment matched (Group 3 or 4) - verify logic above handles this, but strict check here.
                    continue;
                }
            } else {
                // ObjC
                if (match[1] !== undefined) {
                    str = match[1];
                } else {
                    continue;
                }
            }

            if (!isPotentialHardcodedString(str)) continue;

            // ... (rest of logic)
            // Note: For multiline strings, lineContent calculation needs adjust if we want to check context.
            // But simple context checks (like checking previous line) are complex with regex iteration.
            // Rely on strict regex parsing.

            const index = match.index;
            const lineStart = content.lastIndexOf('\n', index) + 1;
            const lineEnd = content.indexOf('\n', index);
            const lineContent = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

            // Ignore NSLocalizedString (Swift/ObjC)
            // Check previous lines if multiline?
            if (/NSLocalizedString/.test(lineContent)) continue;

            // ... (check other ignore rules)
            // Important: Multiline strings might contain newlines, so we should check the content itself for ignore rules.

            // Check context for single line strings
            if (!isMultiline) {
                if (type === 'swift' && /Text\(/.test(lineContent) && !/"/.test(str)) {
                    // ...
                }
                // Ignore logging and fatal errors
                if (/(print\(|println\(|NSLog|os_log|debugPrint|BMCLog|Logger|fatalError)/.test(lineContent)) continue;

                // Ignore identifiers
                if (/(identifier|key|name|vc|controller|storyboard|segue)/i.test(lineContent)) continue;
            }

            // Validation logic for str (same as before)

            // Ignore SQL fragments (e.g. "title, ", "category) ", "VALUES (?,?)")
            if (str.endsWith(', ') || str.endsWith(') ') || str.includes('VALUES') || str.includes('INSERT INTO') || str.includes('SELECT') || str.includes('FROM')) continue;

            // Ignore JavaScript code (e.g. "document.documentElement...")
            if (str.includes('document.') || str.includes('window.') || str.includes('.style.') || str.includes('javascript:') || str.includes('function(') || str.includes('bizMOB.')) continue;

            // Ignore Regex definitions
            if (/_REGEX\s*=/.test(lineContent) || /_PATTERN\s*=/.test(lineContent) || str.includes('(?<') || (str.startsWith('^') && str.endsWith('$'))) continue;

            // Ignore NSPredicate formats
            if (str.includes('SELF MATCHES') || str.includes('CONTAINS[c]') || str.includes('BEGINSWITH[c]')) continue;

            // Ignore Swift string interpolation if the string is mostly interpolation (e.g. "\(a) \(b)")
            if (str.startsWith('\\(') && str.endsWith(')')) continue;
            if (str.includes('\\(')) {
                const withoutInterpolation = str.replace(/\\\([^)]+\)/g, '');
                if (!/[a-zA-Z]/.test(withoutInterpolation)) continue;
            }

            // Ignore HTML and CSS
            if ((str.trim().startsWith('<') && str.includes('>')) || /<[a-z][\s\S]*>/i.test(str) || (str.includes('{') && str.includes('}') && str.includes(':') && str.includes(';'))) continue;

            // Ignore File Paths and URL components
            if (lineContent.includes('appendPathComponent(') || lineContent.includes('path(forResource:') || lineContent.includes('contentsOf:') || str.includes('/') || str.startsWith('.')) continue;

            // Ignore HTTP Content-Type or Boundary strings or raw HTTP body
            if (str.includes('multipart/form-data') || str.startsWith('Boundary-') || str.includes('application/json') || str.includes('application/x-www-form-urlencoded') || str.startsWith('Content-Type:') || str.includes('\\r\\n')) continue;

            // Ignore JSON strings (starts with { and contains :)
            if (str.trim().startsWith('{') && str.includes(':')) continue;


            // Try to extract context from preceding text for single-line strings
            let context: string | undefined = undefined;
            if (!isMultiline) {
                const precedingText = content.substring(Math.max(0, index - 50), index).trim();
                // Swift/ObjC: Button("..."), Text("..."), title: "...", text = "..."
                const contextMatch = precedingText.match(/(\w+)\s*[:=(]\s*$/);
                if (contextMatch) {
                    context = contextMatch[1];
                }
            }

            details.push({
                line: getLineNumber(content, index + 1 + (type === 'objc' ? 1 : 0)), // Approximation for multiline
                text: str,
                message: `Hardcoded string literal`,
                context: context
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
                message: `Hardcoded XIB/Storyboard string [${attr}]`,
                context: attr
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

                if (/(console|BizMOBLogger|BMCLog|Logger)\.(log|debug|info|warn|error)|(print\(|println\()/.test(lineContent)) continue;

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
