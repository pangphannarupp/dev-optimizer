// Utility for parsing code symbols
import { SupportedLanguage } from './codeQualityRules';

export interface CodeSymbol {
    id: string;
    name: string;
    type: 'class' | 'interface' | 'function' | 'property' | 'enum' | 'type';
    signature: string;
    description?: string;
    line: number;
    children?: CodeSymbol[]; // For classes containing methods/props
}

export interface ParsedFile {
    fileName: string;
    language: SupportedLanguage;
    symbols: CodeSymbol[];
}

// Helper to clean documentation comments
const cleanDoc = (docBlock: string): string => {
    return docBlock
        .replace(/\/\*\*|\*\/|\/\/\/|\/\//g, '') // Remove comment markers
        .split('\n')
        .map(line => line.trim().replace(/^\*\s?/, '')) // Remove leading asterisks
        .filter(line => line.length > 0)
        .join('\n');
};

const extractDocComment = (code: string, index: number): string | undefined => {
    // Look backwards from the match index for comments
    const precedingCode = code.substring(0, index).trimEnd();

    // Check for block comment /** ... */
    if (precedingCode.endsWith('*/')) {
        const start = precedingCode.lastIndexOf('/**');
        if (start !== -1) {
            return cleanDoc(precedingCode.substring(start));
        }
    }

    // Check for line comments /// (Swift/Dart/C# style doc) or //
    const lines = precedingCode.split('\n');
    const docLines: string[] = [];
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('///') || line.startsWith('//')) {
            docLines.unshift(line);
        } else {
            break;
        }
    }

    if (docLines.length > 0) {
        return cleanDoc(docLines.join('\n'));
    }

    return undefined;
};

const extractBlockContent = (code: string, startIndex: number): string | null => {
    let openCount = 0;
    let foundStart = false;
    let actualStart = -1;

    for (let i = startIndex; i < code.length; i++) {
        if (code[i] === '{') {
            if (!foundStart) {
                foundStart = true;
                actualStart = i;
            }
            openCount++;
        } else if (code[i] === '}') {
            openCount--;
            if (foundStart && openCount === 0) {
                return code.substring(actualStart + 1, i); // Return content EXCLUDING braces
            }
        }
    }
    return null;
};

export const extractSymbols = (code: string, language: SupportedLanguage): CodeSymbol[] => {
    const symbols: CodeSymbol[] = [];
    const normalizedCode = code.replace(/\r\n/g, '\n');

    // --- Regex Patterns per Language ---

    if (language === 'react-ts' || language === 'vue-ts' || language === 'react-native') {
        // TypeScript / JavaScript

        // Classes / Interfaces
        const classRegex = /(?:\/\*\*[\s\S]*?\*\/[\s\S]*?)?\b(export\s+)?(default\s+)?(class|interface|type|enum)\s+([A-Z][a-zA-Z0-9_]*)/g;
        let match;
        while ((match = classRegex.exec(normalizedCode)) !== null) {
            const [, isExport, isDefault, type, name] = match;
            const index = match.index;
            const doc = extractDocComment(normalizedCode, index);

            // Extract Children (Properties/Methods)
            let children: CodeSymbol[] = [];
            const matchEnd = index + match[0].length;
            const openBraceIndex = normalizedCode.indexOf('{', matchEnd);

            // Only look for body if it's reasonably close (avoid capturing unrelated blocks)
            if (openBraceIndex !== -1 && openBraceIndex < matchEnd + 50) {
                const body = extractBlockContent(normalizedCode, matchEnd);
                if (body) {
                    // 1. Properties: prop: Type; or prop?: Type;
                    const propRegex = /(?:\/\*\*[\s\S]*?\*\/[\s\S]*?)?\b([a-zA-Z0-9_]+)(\?)?\s*:\s*([a-zA-Z0-9_<>\[\]|&\s.]+)(?:;|=|$)/g;
                    let propMatch;
                    while ((propMatch = propRegex.exec(body)) !== null) {
                        const [, pName, pOpt, pType] = propMatch;
                        const pDoc = extractDocComment(body, propMatch.index);
                        // Filter out noise
                        if (['constructor', 'return'].includes(pName)) continue;

                        children.push({
                            id: `${name}-prop-${pName}-${propMatch.index}`,
                            name: pName,
                            type: 'property',
                            signature: `${pName}${pOpt || ''}: ${pType.trim()}`,
                            description: pDoc,
                            line: 0 // Relative line, hard to calc relative to file efficiently without more work
                        });
                    }

                    // 2. Methods: method(args): Type
                    const methodRegex = /(?:\/\*\*[\s\S]*?\*\/[\s\S]*?)?\b([a-zA-Z0-9_]+)\s*(\(.*?\))\s*:\s*([a-zA-Z0-9_<>\[\]|&\s.]+)(?:;|$)/g;
                    let methodMatch;
                    while ((methodMatch = methodRegex.exec(body)) !== null) {
                        const [, mName, mArgs, mType] = methodMatch;
                        const mDoc = extractDocComment(body, methodMatch.index);
                        children.push({
                            id: `${name}-method-${mName}-${methodMatch.index}`,
                            name: mName,
                            type: 'function',
                            signature: `${mName}${mArgs}: ${mType.trim()}`,
                            description: mDoc,
                            line: 0
                        });
                    }
                }
            }

            symbols.push({
                id: `${type}-${name}-${index}`,
                name,
                type: type as any,
                signature: `${isExport || ''}${isDefault || ''}${type} ${name}`.trim(),
                description: doc,
                line: normalizedCode.substring(0, index).split('\n').length,
                children: children.length > 0 ? children : undefined
            });
        }

        // Functions (const x = () => {}, function x() {})
        // Captures: 1=export, 2=async, 3=funcName, 4=funcParams, 5=constName, 6=constParams
        const funcRegex = /(?:\/\*\*[\s\S]*?\*\/[\s\S]*?)?\b(export\s+)?(?:async\s+)?(?:function\s+([a-zA-Z0-9_]+)\s*((?:<[^>]+>)?\s*\([^)]*\)(?:\s*:\s*[^{]+)?)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?((?:<[^>]+>)?\s*\([^)]*\)(?:\s*=>|\s*:\s*[^{]+)|[a-zA-Z0-9_]+\s*=>))/g;
        while ((match = funcRegex.exec(normalizedCode)) !== null) {
            const [, isExport, isAsync, funcName, funcParams, constName, constParams] = match;
            const name = funcName || constName;
            const params = (funcParams || constParams || '').replace(/\s*=>\s*$/, '').trim();
            const index = match.index;
            const doc = extractDocComment(normalizedCode, index);

            // Avoid duplicates
            if (name && !symbols.some(s => s.name === name)) {
                symbols.push({
                    id: `func-${name}-${index}`,
                    name,
                    type: 'function',
                    signature: `${isExport || ''}${isAsync ? 'async ' : ''}function ${name}${params.startsWith('(') || params.startsWith('<') ? params : `(${params})`}`,
                    description: doc,
                    line: normalizedCode.substring(0, index).split('\n').length
                });
            }
        }
    }

    else if (language === 'android-kotlin') {
        // Kotlin
        // Updated regex to capture properties, functions, classes, interfaces, objects, and enums
        const kotlinRegex = /(?:\/\*\*[\s\S]*?\*\/[\s\S]*?)?\b(class|interface|object|enum|fun|val|var)\s+([a-zA-Z0-9_]+)(?:<[^>]+>)?\s*(?:\(([^)]*)\))?(?:\s*:\s*([^{=]+))?/g;
        let match;
        while ((match = kotlinRegex.exec(normalizedCode)) !== null) {
            const [, typeKeyword, name, params, returnTypeOrSuperType] = match;
            const index = match.index;
            const doc = extractDocComment(normalizedCode, index);

            let symbolType: CodeSymbol['type'];
            let signature = `${typeKeyword} ${name}`;

            if (['class', 'interface', 'object', 'enum'].includes(typeKeyword)) {
                symbolType = typeKeyword === 'enum' ? 'enum' : 'class'; // Kotlin 'object' and 'interface' map to 'class' or 'interface'
                if (returnTypeOrSuperType) {
                    signature += `: ${returnTypeOrSuperType.trim()}`;
                }
                // For classes/objects/interfaces, we might want to extract children later
            } else if (typeKeyword === 'fun') {
                symbolType = 'function';
                signature += `(${params || ''})`;
                if (returnTypeOrSuperType) {
                    signature += `: ${returnTypeOrSuperType.trim()}`;
                }
            } else { // val, var
                symbolType = 'property';
                if (returnTypeOrSuperType) {
                    signature += `: ${returnTypeOrSuperType.trim()}`;
                }
            }

            symbols.push({
                id: `${typeKeyword}-${name}-${index}`,
                name,
                type: symbolType,
                signature,
                description: doc,
                line: normalizedCode.substring(0, index).split('\n').length
            });
        }
    }

    else if (language === 'flutter-dart') {
        // Dart - Matches: Type name(params) or void name(params) or class Name
        const dartRegex = /(?:\/\*\*[\s\S]*?\*\/[\s\S]*?)?\b(class|mixin|enum|void|Future|Stream|List|Map|String|bool|int|double|[A-Z][a-zA-Z0-9]*)\s+([a-zA-Z0-9_]+)(?:<[^>]+>)?\s*(?:\(([^)]*)\))?/g;
        let match;
        while ((match = dartRegex.exec(normalizedCode)) !== null) {
            const [, typeKeyword, name, params] = match;

            // Filter keywords
            if (['return', 'if', 'else', 'switch', 'for', 'while', 'throw', 'new', 'const', 'final'].includes(typeKeyword)) continue;

            const index = match.index;
            const doc = extractDocComment(normalizedCode, index);

            let symbolType: CodeSymbol['type'] = 'function';
            let signature = `${typeKeyword} ${name}`;

            if (['class', 'mixin', 'enum'].includes(typeKeyword) || typeKeyword.startsWith('Abstract')) {
                symbolType = 'class';
            } else {
                // It's likely a function or property. 
                if (params !== undefined) {
                    signature += `(${params})`;
                } else {
                    symbolType = 'property';
                }
            }

            symbols.push({
                id: `${typeKeyword}-${name}-${index}`,
                name,
                type: symbolType,
                signature,
                description: doc,
                line: normalizedCode.substring(0, index).split('\n').length
            });
        }
    }

    else {
        // Fallback or other languages (Java/ObjC) - basic extraction
        const regex = /\b(class|interface|void|func|function)\s+([a-zA-Z0-9_]+)/g;
        let match;
        while ((match = regex.exec(normalizedCode)) !== null) {
            const [, type, name] = match;
            const index = match.index;
            symbols.push({
                id: `${type}-${name}-${index}`,
                name,
                type: 'class', // simplified
                signature: `${type} ${name}`,
                line: normalizedCode.substring(0, index).split('\n').length
            });
        }
    }

    return symbols;
};
