export type Severity = 'error' | 'warning' | 'info';

export interface CodeQualityRule {
    id: string;
    message: string;
    severity: Severity;
    pattern: RegExp;
    suggestion?: string;
    url?: string;
    global?: boolean; // New: If true, runs on full content instead of line-by-line
    ignoreStrings?: boolean; // New: If true, ignores matches inside quotes
    docType?: 'block' | 'line'; // New: type of documentation to check for
    shouldIgnore?: (line: string, match: RegExpMatchArray, allLines: string[], lineIndex: number) => boolean; // New: custom ignore logic
}

export type SupportedLanguage = 'react-ts' | 'vue-ts' | 'android-kotlin' | 'android-java' | 'ios-swift' | 'ios-objc' | 'flutter-dart' | 'react-native';

export const RULES: Record<SupportedLanguage, CodeQualityRule[]> = {
    'react-ts': [
        {
            id: 'console-log',
            message: 'Avoid using console.log in production code',
            severity: 'warning',
            pattern: /console\.log\(/,
            suggestion: 'Use a proper logging service or remove before deployment',
            url: 'https://eslint.org/docs/latest/rules/no-console'
        },
        {
            id: 'any-type',
            message: 'Avoid using "any" type',
            severity: 'warning',
            pattern: /:\s*any\b/,
            suggestion: 'Specify a more precise type or use "unknown"',
            url: 'https://typescript-eslint.io/rules/no-explicit-any/'
        },
        {
            id: 'index-key',
            message: 'Avoid using array index as key in mapped elements',
            severity: 'error',
            pattern: /key\s*=\s*{\s*(index|i|idx)\s*}/,
            suggestion: 'Use a unique ID from the data instead',
            url: 'https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key'
        },
        {
            id: 'inline-style',
            message: 'Avoid inline styles',
            severity: 'info',
            pattern: /style\s*=\s*{{/,
            suggestion: 'Use CSS classes or styled components for better performance and maintainability',
            url: 'https://react.dev/dom/elements#style'
        },
        {
            id: 'useEffect-missing-deps',
            message: 'Potential missing dependency in useEffect',
            severity: 'warning',
            pattern: /useEffect\(\s*\(\)\s*=>\s*{[^}]*}\s*,\s*\[\s*\]\s*\)/,
            suggestion: 'Check if you really intend to run this only on mount. Ensure all utilized variables are in the dependency array.',
            url: 'https://react.dev/reference/react/useEffect#specifying-reactive-dependencies'
        },
        {
            id: 'hardcoded-secret',
            message: 'Possible hardcoded secret/token detected',
            severity: 'error',
            pattern: /(api_key|apikey|token|secret)\s*[:=]\s*['"`][a-zA-Z0-9_\-]{20,}['"`]/i,
            suggestion: 'Use environment variables (process.env) instead of hardcoding secrets',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'
        },
        {
            id: 'always-true',
            message: 'Condition is always true/false',
            severity: 'error',
            pattern: /(if|while)\s*\(\s*(true|false)\s*\)/,
            suggestion: 'Remove deterministic condition'
        },
        {
            id: 'bad-equality',
            message: 'Avoid loose equality (==)',
            severity: 'warning',
            pattern: /(?<![=!])==(?!=)/,
            suggestion: 'Use strict equality (===)'
        },
        {
            id: 'naming-class',
            message: 'Class/Interface should be PascalCase',
            severity: 'info',
            pattern: /(class|interface|type)\s+[a-z][a-zA-Z0-9]*/,
            suggestion: 'Rename to start with an uppercase letter'
        },
        {
            id: 'naming-function',
            message: 'Function should be camelCase',
            severity: 'info',
            pattern: /function\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)\s*\(/,
            suggestion: 'Rename to camelCase (e.g., myFunction)'
        },
        {
            id: 'naming-variable',
            message: 'Variable should be camelCase',
            severity: 'info',
            pattern: /\b(const|let|var)\s+[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*\s*[=:]/,
            suggestion: 'Rename to camelCase (avoid snake_case)'
        },
        {
            id: 'todo-comment',
            message: 'TODO/FIXME comment detected',
            severity: 'info',
            pattern: /\/\/\s*(TODO|FIXME):/,
            suggestion: 'Track this task in your project management tool and remove the comment',
            url: 'https://eslint.org/docs/latest/rules/no-warning-comments'
        },
        {
            id: 'debugger',
            message: 'Avoid "debugger" statement',
            severity: 'error',
            pattern: /debugger/,
            suggestion: 'Remove debugger before deployment'
        },
        {
            id: 'no-alert',
            message: 'Avoid "alert()"',
            severity: 'warning',
            pattern: /\balert\(/,
            suggestion: 'Use a proper modal or notification system'
        },
        {
            id: 'empty-block',
            message: 'Empty block detected',
            severity: 'warning',
            pattern: /\{\s*\}/,
            suggestion: 'Remove empty block or add a comment explaining why it is empty'
        },
        {
            id: 'missing-docs',
            message: 'Exported function/class missing JSDoc',
            severity: 'info',
            pattern: /\bexport\s+(?:async\s+)?(?:function|class|const)\s+([a-zA-Z0-9_]+)/g,
            suggestion: 'Add JSDoc (/** ... */) documentation',
            global: true,
            docType: 'block'
        },
        {
            id: 'no-eval',
            message: 'Avoid using "eval()"',
            severity: 'error',
            pattern: /\beval\(/,
            suggestion: 'eval() is dangerous and slow. Refactor to avoid it.'
        },
        {
            id: 'no-var',
            message: 'Avoid "var", use "let" or "const"',
            severity: 'warning',
            pattern: /\bvar\s+/,
            suggestion: 'Use "const" for immutable variables or "let" for mutable ones'
        },
        {
            id: 'dangerously-set-html',
            message: 'Avoid "dangerouslySetInnerHTML"',
            severity: 'error',
            pattern: /dangerouslySetInnerHTML/,
            suggestion: 'This opens the app to XSS attacks.'
        },
        {
            id: 'find-dom-node',
            message: 'Avoid "findDOMNode"',
            severity: 'warning',
            pattern: /findDOMNode\(/,
            suggestion: 'Use refs instead. findDOMNode is deprecated.'
        },
        {
            id: 'jsx-no-bind',
            message: 'Avoid ".bind(this)" in JSX',
            severity: 'info',
            pattern: /\.bind\(this\)/,
            suggestion: 'Use arrow functions in class properties or use functional components.'
        },
        {
            id: 'no-access-state-in-setstate',
            message: 'Avoid accessing this.state inside setState',
            severity: 'warning',
            pattern: /this\.setState\(\s*\{\s*.*this\.state/,
            suggestion: 'Use the functional form: this.setState(prevState => ({...}))'
        },
        {
            id: 'no-http',
            message: 'Avoid insecure "http://"',
            severity: 'error',
            pattern: /http:\/\//,
            suggestion: 'Use "https://" for secure communication.'
        },
        {
            id: 'no-async-use-effect',
            message: 'useEffect callback cannot be async',
            severity: 'error',
            pattern: /useEffect\(\s*async/,
            suggestion: 'Define an async function inside useEffect and call it immediately.'
        },
        {
            id: 'useless-fragment',
            message: 'Avoid useless fragments',
            severity: 'warning',
            pattern: /<>\s*<\/>/,
            suggestion: 'Remove the fragment or add a key if needed.'
        },
        {
            id: 'duplicate-props',
            message: 'Duplicate props detected',
            severity: 'warning',
            pattern: /([a-zA-Z0-9-]+)\s*=[^>]*\1\s*=/,
            suggestion: 'Remove duplicate props.'
        },
        {
            id: 'no-non-null-assertion',
            message: 'Avoid non-null assertion (!)',
            severity: 'warning',
            pattern: /[a-zA-Z0-9_]\!/,
            suggestion: 'Use optional chaining (?.) or null check.'
        },
        {
            id: 'prefer-optional-chaining',
            message: 'Prefer optional chaining',
            severity: 'info',
            pattern: /([a-zA-Z0-9_]+)\s*&&\s*\1\.[a-zA-Z0-9_]+/,
            suggestion: 'Use optional chaining (e.g., foo?.bar).'
        },
        // --- NEW TypeScript ESLint Rules ---
        {
            id: 'ban-ts-comment',
            message: 'Avoid @ts-ignore or @ts-nocheck',
            severity: 'warning',
            pattern: /@ts-(ignore|nocheck)/,
            suggestion: 'Fix the underlying type error instead of suppressing it.',
            url: 'https://typescript-eslint.io/rules/ban-ts-comment/'
        },
        {
            id: 'ban-types',
            message: 'Avoid using wrapper types (String, Number, Boolean, Object)',
            severity: 'error',
            pattern: /:\s*(String|Number|Boolean|Object|Symbol)\b/,
            suggestion: 'Use lowercase primitives (string, number, boolean, object, symbol).',
            url: 'https://typescript-eslint.io/rules/ban-types/'
        },
        {
            id: 'consistent-type-assertions',
            message: 'Use "as Type" assertions instead of angle brackets',
            severity: 'warning',
            pattern: /<[a-zA-Z0-9_]+>[a-zA-Z0-9_]+/,
            suggestion: 'Use "value as Type" syntax for consistency with JSX.',
            url: 'https://typescript-eslint.io/rules/consistent-type-assertions/'
        },
        {
            id: 'no-empty-interface',
            message: 'Avoid empty interfaces',
            severity: 'warning',
            pattern: /interface\s+[a-zA-Z0-9_]+\s*\{\s*\}/,
            suggestion: 'Remove empty interface or use a type alias if intended.',
            url: 'https://typescript-eslint.io/rules/no-empty-interface/'
        },
        {
            id: 'no-inferrable-types',
            message: 'Avoid explicit type for inferrable values',
            severity: 'info',
            pattern: /\b(const|let|var)\s+[a-zA-Z0-9_]+\s*:\s*(string|number|boolean)\s*=\s*/,
            suggestion: 'Remove type annotation; TS authenticates the type.',
            url: 'https://typescript-eslint.io/rules/no-inferrable-types/'
        },
        {
            id: 'no-namespace',
            message: 'Avoid "namespace" or "module"',
            severity: 'error',
            pattern: /\b(namespace|module)\s+[a-zA-Z0-9_]+\s*\{/,
            suggestion: 'Use ES Modules (import/export) instead.',
            url: 'https://typescript-eslint.io/rules/no-namespace/'
        },
        {
            id: 'no-require-imports',
            message: 'Avoid "require()" imports',
            severity: 'error',
            pattern: /require\s*\(/,
            suggestion: 'Use ES6 "import" syntax.',
            url: 'https://typescript-eslint.io/rules/no-require-imports/'
        },
        {
            id: 'no-this-alias',
            message: 'Avoid aliasing "this"',
            severity: 'warning',
            pattern: /const\s+(self|that|_this)\s*=\s*this/,
            suggestion: 'Use arrow functions to preserve "this" context.',
            url: 'https://typescript-eslint.io/rules/no-this-alias/'
        },
        {
            id: 'no-unnecessary-type-constraint',
            message: 'Avoid "extends any" or "extends unknown"',
            severity: 'warning',
            pattern: /<\s*[a-zA-Z0-9_]+\s+extends\s+(any|unknown)\s*>/,
            suggestion: 'Remove the constraint as it is redundant.',
            url: 'https://typescript-eslint.io/rules/no-unnecessary-type-constraint/'
        },
        {
            id: 'triple-slash-reference',
            message: 'Avoid triple-slash references',
            severity: 'warning',
            pattern: /\/\/\/\s*<reference/,
            suggestion: 'Use import statements instead.',
            url: 'https://typescript-eslint.io/rules/triple-slash-reference/'
        },
        {
            id: 'no-confusing-non-null-assertion',
            message: 'Avoid confusing non-null assertion usage',
            severity: 'warning',
            pattern: /!\s*==/,
            suggestion: 'Wrap the assertion in parentheses if intended, or check logic.',
            url: 'https://typescript-eslint.io/rules/no-confusing-non-null-assertion/'
        },
        {
            id: 'array-type',
            message: 'Prefer "T[]" for simple array types',
            severity: 'info',
            pattern: /:\s*Array<[a-zA-Z0-9_]+>\b/,
            suggestion: 'Use short syntax: Type[]',
            url: 'https://typescript-eslint.io/rules/array-type/'
        }
    ],
    'react-native': [
        {
            id: 'console-log',
            message: 'Avoid using console.log in production code',
            severity: 'warning',
            pattern: /console\.log\(/,
            suggestion: 'Use a proper logging service or remove before deployment',
            url: 'https://eslint.org/docs/latest/rules/no-console'
        },
        {
            id: 'inline-style-obj',
            message: 'Avoid inline style objects',
            severity: 'warning',
            pattern: /style\s*=\s*{{/,
            suggestion: 'Use StyleSheet.create() for better performance',
            url: 'https://reactnative.dev/docs/stylesheet'
        },
        {
            id: 'index-key',
            message: 'Avoid using array index as key',
            severity: 'error',
            pattern: /key\s*=\s*{\s*(index|i|idx)\s*}/,
            suggestion: 'Use a unique ID from the data instead',
            url: 'https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key'
        },
        {
            id: 'always-true',
            message: 'Condition is always true/false',
            severity: 'error',
            pattern: /(if|while)\s*\(\s*(true|false)\s*\)/,
            suggestion: 'Remove deterministic condition'
        },
        {
            id: 'bad-equality',
            message: 'Avoid loose equality (==)',
            severity: 'warning',
            pattern: /(?<![=!])==(?!=)/,
            suggestion: 'Use strict equality (===)'
        },
        {
            id: 'naming-class',
            message: 'Class/Interface should be PascalCase',
            severity: 'info',
            pattern: /(class|interface|type)\s+[a-z][a-zA-Z0-9]*/,
            suggestion: 'Rename to start with an uppercase letter'
        },
        {
            id: 'naming-function',
            message: 'Function should be camelCase',
            severity: 'info',
            pattern: /function\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)\s*\(/,
            suggestion: 'Rename to camelCase (e.g., myFunction)'
        },
        {
            id: 'naming-variable',
            message: 'Variable should be camelCase',
            severity: 'info',
            pattern: /\b(const|let|var)\s+[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*\s*[=:]/,
            suggestion: 'Rename to camelCase (avoid snake_case)'
        },
        {
            id: 'any-type',
            message: 'Avoid using "any" type',
            severity: 'warning',
            pattern: /:\s*any\b/,
            suggestion: 'Specify a more precise type',
            url: 'https://typescript-eslint.io/rules/no-explicit-any/'
        },
        {
            id: 'hardcoded-color',
            message: 'Avoid hardcoded colors',
            severity: 'info',
            pattern: /(color|backgroundColor)\s*:\s*['"]#[0-9a-fA-F]{3,6}['"]/i,
            suggestion: 'Use a theme or constants file for colors'
        },
        {
            id: 'debugger',
            message: 'Avoid "debugger" statement',
            severity: 'error',
            pattern: /debugger/,
            suggestion: 'Remove debugger before deployment'
        },
        {
            id: 'empty-block',
            message: 'Empty block detected',
            severity: 'warning',
            pattern: /\{\s*\}/,
            suggestion: 'Remove empty block'
        },
        {
            id: 'missing-docs',
            message: 'Exported function/class missing JSDoc',
            severity: 'info',
            pattern: /\bexport\s+(?:async\s+)?(?:function|class|const)\s+([a-zA-Z0-9_]+)/g,
            suggestion: 'Add JSDoc (/** ... */) documentation',
            global: true,
            docType: 'block'
        },
        {
            id: 'no-eval',
            message: 'Avoid using "eval()"',
            severity: 'error',
            pattern: /\beval\(/,
            suggestion: 'eval() is dangerous and slow. Refactor to avoid it.'
        },
        {
            id: 'no-var',
            message: 'Avoid "var", use "let" or "const"',
            severity: 'warning',
            pattern: /\bvar\s+/,
            suggestion: 'Use "const" for immutable variables or "let" for mutable ones'
        },
        {
            id: 'dangerously-set-html',
            message: 'Avoid "dangerouslySetInnerHTML"',
            severity: 'error',
            pattern: /dangerouslySetInnerHTML/,
            suggestion: 'This opens the app to XSS attacks.'
        },
        {
            id: 'jsx-no-bind',
            message: 'Avoid ".bind(this)" in JSX',
            severity: 'info',
            pattern: /\.bind\(this\)/,
            suggestion: 'Use arrow functions in class properties or use functional components.'
        },
        {
            id: 'no-http',
            message: 'Avoid insecure "http://"',
            severity: 'error',
            pattern: /http:\/\//,
            suggestion: 'Use "https://" for secure communication.'
        },
        {
            id: 'no-async-use-effect',
            message: 'useEffect callback cannot be async',
            severity: 'error',
            pattern: /useEffect\(\s*async/,
            suggestion: 'Define an async function inside useEffect and call it immediately.'
        },
        {
            id: 'useless-fragment',
            message: 'Avoid useless fragments',
            severity: 'warning',
            pattern: /<>\s*<\/>/,
            suggestion: 'Remove the fragment or add a key if needed.'
        },
        {
            id: 'duplicate-props',
            message: 'Duplicate props detected',
            severity: 'warning',
            pattern: /([a-zA-Z0-9-]+)\s*=[^>]*\1\s*=/,
            suggestion: 'Remove duplicate props.'
        },
        {
            id: 'no-non-null-assertion',
            message: 'Avoid non-null assertion (!)',
            severity: 'warning',
            pattern: /[a-zA-Z0-9_]\!/,
            suggestion: 'Use optional chaining (?.) or null check.'
        },
        {
            id: 'prefer-optional-chaining',
            message: 'Prefer optional chaining',
            severity: 'info',
            pattern: /([a-zA-Z0-9_]+)\s*&&\s*\1\.[a-zA-Z0-9_]+/,
            suggestion: 'Use optional chaining (e.g., foo?.bar).'
        }
    ],
    'vue-ts': [
        {
            id: 'console-log',
            message: 'Avoid using console.log in production code',
            severity: 'warning',
            pattern: /console\.log\(/,
            suggestion: 'Use a proper logging service or remove before deployment'
        },
        {
            id: 'v-if-v-for',
            message: 'Avoid using v-if and v-for on the same element',
            severity: 'error',
            pattern: /<[^>]+\bv-if=[^>]+\bv-for=[^>]+>/,
            suggestion: 'Move v-if to a parent element or use a computed property to filter the list',
            url: 'https://vuejs.org/style-guide/rules-essential.html#avoid-v-if-with-v-for'
        },
        {
            id: 'any-type',
            message: 'Avoid using "any" type',
            severity: 'warning',
            pattern: /:\s*any\b/,
            suggestion: 'Specify a more precise type',
            url: 'https://typescript-eslint.io/rules/no-explicit-any/'
        },
        {
            id: 'mutating-props',
            message: 'Avoid mutating props directly',
            severity: 'error',
            pattern: /props\.[a-zA-Z0-9_]+\s*=\s*/,
            suggestion: 'Emit an event to the parent to update the value',
            url: 'https://vuejs.org/guide/components/props.html#one-way-data-flow'
        },
        {
            id: 'todo-comment',
            message: 'TODO/FIXME comment detected',
            severity: 'info',
            pattern: /\/\/\s*(TODO|FIXME):/,
            suggestion: 'Track task externally'
        },
        {
            id: 'always-true',
            message: 'Condition is always true/false',
            severity: 'error',
            pattern: /(if|while)\s*\(\s*(true|false)\s*\)/,
            suggestion: 'Remove deterministic condition'
        },
        {
            id: 'bad-equality',
            message: 'Avoid loose equality (==)',
            severity: 'warning',
            pattern: /(?<![=!])==(?!=)/,
            suggestion: 'Use strict equality (===)'
        },
        {
            id: 'naming-class',
            message: 'Class/Interface should be PascalCase',
            severity: 'info',
            pattern: /(class|interface|type)\s+[a-z][a-zA-Z0-9]*/,
            suggestion: 'Rename to start with an uppercase letter'
        },
        {
            id: 'naming-function',
            message: 'Function should be camelCase',
            severity: 'info',
            pattern: /function\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)\s*\(/,
            suggestion: 'Rename to camelCase (e.g., myFunction)'
        },
        {
            id: 'naming-variable',
            message: 'Variable should be camelCase',
            severity: 'info',
            pattern: /\b(const|let|var)\s+[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*\s*[=:]/,
            suggestion: 'Rename to camelCase (avoid snake_case)'
        },
        {
            id: 'debugger',
            message: 'Avoid "debugger" statement',
            severity: 'error',
            pattern: /debugger/,
            suggestion: 'Remove debugger before deployment'
        },
        {
            id: 'missing-docs',
            message: 'Exported function/class missing JSDoc',
            severity: 'info',
            pattern: /(?<!\*\/\s*)\bexport\s+(?:async\s+)?(?:function|class|const)\s+([a-zA-Z0-9_]+)/g,
            suggestion: 'Add JSDoc (/** ... */) documentation',
            global: true
        },
        {
            id: 'no-v-html',
            message: 'Avoid "v-html" to prevent XSS',
            severity: 'warning',
            pattern: /v-html/,
            suggestion: 'Use text interpolation {{ }} or ensure content is sanitized',
            url: 'https://vuejs.org/guide/best-practices/security.html#potential-dangers'
        },
        {
            id: 'no-template-key',
            message: 'Avoid "key" on <template>',
            severity: 'warning',
            pattern: /<template\s+[^>]*key=/,
            suggestion: 'Key should be placed on the element inside the template or the component tag itself'
        },
        {
            id: 'no-this-in-template',
            message: 'Avoid "this" in templates',
            severity: 'warning',
            pattern: /\{\{\s*this\./,
            suggestion: 'Template variables are automatically unscoped.'
        },
        {
            id: 'complex-template-logic',
            message: 'Avoid complex logic (array methods) in templates',
            severity: 'error',
            pattern: /\{\{[^}]*\.(find|filter|reduce|map|some|every|includes|slice|splice|join|sort|reverse|split|replace)\s*\(.*\}\}/,
            suggestion: 'Move this logic to a computed property.'
        },
        {
            id: 'no-template-ternary',
            message: 'Avoid ternary operators in templates',
            severity: 'warning',
            pattern: /\{\{[^}]*\?[^}]*:[^}]*\}\}/,
            suggestion: 'Use a computed property or v-if.'
        },
        {
            id: 'no-template-logical',
            message: 'Avoid logical operators (&&, ||) in templates',
            severity: 'warning',
            pattern: /\{\{[^}]*(&&|\|\|)[^}]*\}\}/,
            suggestion: 'Use a computed property.'
        },
        {
            id: 'no-http',
            message: 'Avoid insecure "http://"',
            severity: 'error',
            pattern: /http:\/\//,
            suggestion: 'Use "https://" for secure communication.'
        },
        {
            id: 'useless-mustache',
            message: 'Avoid useless mustache interpolation',
            severity: 'warning',
            pattern: /\{\{\s*['"][^'"]+['"]\s*\}\}/,
            suggestion: 'Use static text instead.'
        },
        {
            id: 'no-non-null-assertion',
            message: 'Avoid non-null assertion (!)',
            severity: 'warning',
            pattern: /[a-zA-Z0-9_]\!/,
            suggestion: 'Use optional chaining (?.) or null check.'
        }
    ],
    'android-kotlin': [
        {
            id: 'force-unwrap',
            message: 'Avoid unnecessary force unwrapping (!!)',
            severity: 'error',
            pattern: /!!/,
            suggestion: 'Use safe calls (?) or let block handling instead',
            url: 'https://kotlinlang.org/docs/null-safety.html#the-operator',
            shouldIgnore: (line, match, lines, index) => {
                if (match.index === undefined) return false;
                const variable = line.substring(0, match.index).match(/([a-zA-Z0-9_]+)$/)?.[1];
                if (!variable) return false;
                for (let i = 1; i <= 5; i++) {
                    if (index - i < 0) break;
                    const prev = lines[index - i];
                    if (prev.includes(`if (${variable} != null)`) || prev.includes(`if (null != ${variable})`)) {
                        return true;
                    }
                }
                return false;
            }
        },
        {
            id: 'global-scope-launch',
            message: 'Avoid GlobalScope.launch',
            severity: 'warning',
            pattern: /GlobalScope\.launch/,
            suggestion: 'Use lifecycle-aware scopes like viewModelScope or lifecycleScope',
            url: 'https://developer.android.com/topic/libraries/architecture/coroutines#global-scope'
        },
        {
            id: 'print-stack-trace',
            message: 'Avoid printStackTrace()',
            severity: 'warning',
            pattern: /\.printStackTrace\(\)/,
            suggestion: 'Use a logger (e.g., Timber) to handle exceptions'
        },
        {
            id: 'system-out',
            message: 'Avoid System.out.println',
            severity: 'warning',
            pattern: /System\.out\.println/,
            suggestion: 'Use Android Log class or Timber',
            url: 'https://developer.android.com/reference/android/util/Log'
        },
        {
            id: 'var-usage',
            message: 'Prefer "val" over "var" where possible',
            severity: 'info',
            pattern: /\bvar\s+/,
            suggestion: 'Immutability improves thread safety and reduces bugs',
            url: 'https://kotlinlang.org/docs/properties.html'
        },
        {
            id: 'thread-sleep',
            message: 'Avoid Thread.sleep() on main thread',
            severity: 'error',
            pattern: /Thread\.sleep\(/,
            suggestion: 'Use coroutines delay() or proper async mechanisms',
            url: 'https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html'
        },
        {
            id: 'empty-block',
            message: 'Empty block detected',
            severity: 'warning',
            pattern: /\{\s*\}/,
            suggestion: 'Remove empty block or add a comment'
        },
        {
            id: 'always-true',
            message: 'Condition is always true/false',
            severity: 'error',
            pattern: /(if|while)\s*\(\s*(true|false)\s*\)/,
            suggestion: 'Remove deterministic condition'
        },
        {
            id: 'naming-class',
            message: 'Class/Interface should be PascalCase',
            severity: 'info',
            pattern: /(class|interface|object)\s+[a-z][a-zA-Z0-9]*/,
            suggestion: 'Rename to start with an uppercase letter'
        },
        {
            id: 'naming-function',
            message: 'Function should be camelCase',
            severity: 'info',
            pattern: /fun\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)/,
            suggestion: 'Rename to camelCase (e.g., myFunction)'
        },
        {
            id: 'naming-variable',
            message: 'Variable should be camelCase',
            severity: 'info',
            pattern: /\b(val|var)\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)\s*[:=]/,
            suggestion: 'Rename to camelCase (e.g., myVariable)'
        },
        {
            id: 'missing-kdoc',
            message: 'Public class/function missing KDoc',
            severity: 'info',
            pattern: /\b(?:public|protected)\s+(?:class|fun|interface)\s+([a-zA-Z0-9_]+)/g,
            suggestion: 'Add KDoc (/** ... */) documentation for public API',
            global: true,
            docType: 'block'
        },
        {
            id: 'magic-number',
            message: 'Avoid magic numbers',
            severity: 'info',
            pattern: /(?<!versionCode)\s*=\s*[0-9]{2,}/,
            suggestion: 'Extract magic numbers to constants',
            ignoreStrings: true
        },
        {
            id: 'lateinit-usage',
            message: 'Avoid extensive "lateinit"',
            severity: 'info',
            pattern: /lateinit\s+var/,
            suggestion: 'Consider using nullable types or lazy initialization',
            url: 'https://kotlinlang.org/docs/properties.html#late-initialized-properties-and-variables'
        },
        {
            id: 'nested-blocks',
            message: 'Deeply nested blocks detected',
            severity: 'warning',
            pattern: /\{\s*\{\s*\{\s*\{/g,
            suggestion: 'Refactor code to reduce nesting (guard clauses, extract functions)',
            global: true
        },
        {
            id: 'run-blocking',
            message: 'Avoid "runBlocking" on main thread',
            severity: 'error',
            pattern: /runBlocking\s*\{/,
            suggestion: 'Use suspend functions and proper coroutine scopes.'
        },
        {
            id: 'wildcard-import',
            message: 'Avoid wildcard imports',
            severity: 'info',
            pattern: /import\s+[a-zA-Z0-9._]+\.\*/,
            suggestion: 'Import specific classes to avoid conflicts.'
        },
        {
            id: 'hardcoded-content-desc',
            message: 'Avoid hardcoded contentDescription',
            severity: 'warning',
            pattern: /contentDescription\s*=\s*"[^"]+"/,
            suggestion: 'Use a localized string resource (@string/...)'
        },
        {
            id: 'no-http',
            message: 'Avoid insecure "http://"',
            severity: 'error',
            pattern: /http:\/\//,
            suggestion: 'Use "https://" for secure communication.'
        },
        {
            id: 'toast-show-missing',
            message: 'Toast.makeText() created but not shown',
            severity: 'warning',
            pattern: /Toast\.makeText\(/,
            suggestion: 'Did you forget to call .show()?',
            shouldIgnore: (line) => line.includes('.show()')
        },
        {
            id: 'empty-list-check',
            message: 'Prefer .isEmpty() over .size == 0',
            severity: 'info',
            pattern: /\.size\s*==\s*0/,
            suggestion: 'Use .isEmpty() for clarity and potential performance checks.'
        },
        {
            id: 'useless-elvis',
            message: 'Useless elvis operator',
            severity: 'warning',
            pattern: /\?:\s*null/,
            suggestion: 'Remove redundant elvis operator.'
        },
        {
            id: 'redundant-let',
            message: 'Redundant let block',
            severity: 'info',
            pattern: /\?\.let\s*\{\s*it\s*\}/,
            suggestion: 'Remove .let { it }'
        }
    ],
    'android-java': [
        {
            id: 'system-out',
            message: 'Avoid System.out.println',
            severity: 'warning',
            pattern: /System\.out\.println/,
            suggestion: 'Use Android Log class',
            url: 'https://developer.android.com/reference/android/util/Log'
        },
        {
            id: 'print-stack-trace',
            message: 'Avoid printStackTrace()',
            severity: 'warning',
            pattern: /\.printStackTrace\(\)/,
            suggestion: 'Use a logger to handle exceptions appropriately'
        },
        {
            id: 'raw-types',
            message: 'Avoid raw types',
            severity: 'warning',
            pattern: /List\s+[a-zA-Z0-9_]+\s*=\s*new\s+ArrayList/,
            suggestion: 'Use Generics (e.g., List<String>)'
        },
        {
            id: 'always-true',
            message: 'Condition is always true/false',
            severity: 'error',
            pattern: /(if|while)\s*\(\s*(true|false)\s*\)/,
            suggestion: 'Remove deterministic condition'
        },
        {
            id: 'naming-class',
            message: 'Class/Interface should be PascalCase',
            severity: 'info',
            pattern: /(class|interface)\s+[a-z][a-zA-Z0-9]*/,
            suggestion: 'Rename to start with an uppercase letter'
        },
        {
            id: 'public-field',
            message: 'Avoid public fields',
            severity: 'warning',
            pattern: /public\s+(?!static|final)[a-zA-Z0-9_<>]+\s+[a-zA-Z0-9_]+;/,
            suggestion: 'Use private fields with getters and setters (encapsulation)'
        },
        {
            id: 'naming-method',
            message: 'Method should be camelCase',
            severity: 'info',
            pattern: /\s+void\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)\s*\(/,
            suggestion: 'Rename to camelCase'
        },
        {
            id: 'hardcoded-sdcard',
            message: 'Avoid hardcoded /sdcard path',
            severity: 'warning',
            pattern: /"\/sdcard\/"/,
            suggestion: 'Use Environment.getExternalStorageDirectory()',
            url: 'https://developer.android.com/training/data-storage'
        },
        {
            id: 'empty-block',
            message: 'Empty block detected',
            severity: 'warning',
            pattern: /\{\s*\}/,
            suggestion: 'Remove empty block or add a comment'
        },
        {
            id: 'missing-javadoc',
            message: 'Public class/method missing JavaDoc',
            severity: 'info',
            pattern: /\b(?:public|protected)\s+(?:class|interface|void|[a-zA-Z0-9_]+)\s+([a-zA-Z0-9_]+)/g,
            suggestion: 'Add JavaDoc (/** ... */) documentation',
            global: true,
            docType: 'block'
        },
        {
            id: 'empty-catch',
            message: 'Empty catch block detected',
            severity: 'warning',
            pattern: /catch\s*\([^)]+\)\s*\{\s*\}/,
            suggestion: 'Handle the exception or log it'
        },
        {
            id: 'string-equality',
            message: 'Use ".equals()" for string comparison',
            severity: 'error',
            pattern: /(?<!=)==\s*"/,
            suggestion: 'Strings must be compared using .equals() in Java'
        },
        {
            id: 'thread-stop',
            message: 'Avoid "Thread.stop()"',
            severity: 'error',
            pattern: /Thread\.stop\(\)/,
            suggestion: 'Thread.stop is deprecated and unsafe.'
        },
        {
            id: 'notify-all',
            message: 'Prefer "notifyAll()" over "notify()"',
            severity: 'info',
            pattern: /\.notify\(\)/,
            suggestion: 'notify() can cause lost wake-ups if multiple threads wait on same condition.'
        },
        {
            id: 'static-simple-date-format',
            message: 'Static SimpleDateFormat is not thread-safe',
            severity: 'error',
            pattern: /static\s+SimpleDateFormat/,
            suggestion: 'Use a thread-local usage or java.time API (DateTimeFormatter).'
        },
        {
            id: 'no-http',
            message: 'Avoid insecure "http://"',
            severity: 'error',
            pattern: /http:\/\//,
            suggestion: 'Use "https://" for secure communication.'
        }
    ],
    'ios-swift': [
        {
            id: 'force-unwrap',
            message: 'Avoid force unwrapping (!)',
            severity: 'error',
            pattern: /(?<!@IBOutlet\s)(?<!var\s)[a-zA-Z0-9_]+\!/,
            suggestion: 'Use if let, guard let, or nil coalescence (??)',
            url: 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Forced-Unwrapping',
            ignoreStrings: true // Ignore "String!"
        },
        {
            id: 'force-try',
            message: 'Avoid force try (try!)',
            severity: 'error',
            pattern: /try!/,
            suggestion: 'Use do-catch blocks or try?',
            url: 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/'
        },
        {
            id: 'print-debug',
            message: 'Avoid print() in production',
            severity: 'warning',
            pattern: /print\(/,
            suggestion: 'Use OSLog or a custom logging framework',
            url: 'https://developer.apple.com/documentation/os/oslog'
        },
        {
            id: 'ns-object',
            message: 'Avoid inheriting from NSObject unless necessary',
            severity: 'info',
            pattern: /class\s+[a-zA-Z0-9_]+\s*:\s*NSObject/,
            suggestion: 'Pure Swift classes are more performant if Obj-C interoperability is not needed'
        },
        {
            id: 'hardcoded-secret',
            message: 'Possible hardcoded secret detected',
            severity: 'error',
            pattern: /(let|var)\s+(apiKey|secret)\s*=\s*".*"/i,
            suggestion: 'Store secrets securely in Keychain or build config'
        },
        {
            id: 'empty-block',
            message: 'Empty block detected',
            severity: 'warning',
            pattern: /\{\s*\}/,
            suggestion: 'Remove empty block or add a comment'
        },
        {
            id: 'always-true',
            message: 'Condition is always true/false',
            severity: 'error',
            pattern: /(if|while)\s*\(\s*(true|false)\s*\)/,
            suggestion: 'Remove deterministic condition'
        },
        {
            id: 'naming-class',
            message: 'Class/Struct/Enum should be PascalCase',
            severity: 'info',
            pattern: /(class|struct|enum|protocol)\s+[a-z][a-zA-Z0-9]*/,
            suggestion: 'Rename to start with an uppercase letter'
        },
        {
            id: 'naming-function',
            message: 'Function should be camelCase',
            severity: 'info',
            pattern: /func\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)/,
            suggestion: 'Rename to camelCase'
        },
        {
            id: 'naming-variable',
            message: 'Variable should be camelCase',
            severity: 'info',
            pattern: /\b(let|var)\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)\s*[:=]/,
            suggestion: 'Rename to camelCase'
        },
        {
            id: 'missing-swiftdoc',
            message: 'Public class/func missing documentation',
            severity: 'info',
            pattern: /\b(?:public|open)\s+(?:class|func|struct|var)\s+([a-zA-Z0-9_]+)/g,
            suggestion: 'Add documentation comment (///)',
            global: true,
            docType: 'line'
        },
        {
            id: 'todo-comments',
            message: 'TODO/FIXME detected',
            severity: 'info',
            pattern: /\/\/\s*(TODO|FIXME):/,
            suggestion: 'Track this externally'
        },
        {
            id: 'empty-catch',
            message: 'Empty catch block',
            severity: 'warning',
            pattern: /catch\s*\{\s*\}/,
            suggestion: 'Handle error or log it'
        },
        {
            id: 'force-cast',
            message: 'Avoid force casting (as!)',
            severity: 'error',
            pattern: /\sas!\s/,
            suggestion: 'Use conditional cast (as?) and handle nil.'
        },
        {
            id: 'strong-delegate',
            message: 'Delegate should be weak',
            severity: 'error',
            pattern: /var\s+delegate\s*:/,
            suggestion: 'Use "weak var delegate" to avoid retain cycles'
        },
        {
            id: 'dispatch-sync-main',
            message: 'Avoid DispatchQueue.main.sync',
            severity: 'error',
            pattern: /DispatchQueue\.main\.sync/,
            suggestion: 'Use async or run on a different queue to avoid deadlocks'
        },
        {
            id: 'no-http',
            message: 'Avoid insecure "http://"',
            severity: 'error',
            pattern: /http:\/\//,
            suggestion: 'Use "https://" for secure communication.'
        },
        {
            id: 'collection-empty-check',
            message: 'Prefer .isEmpty over .count == 0',
            severity: 'info',
            pattern: /\.count\s*==\s*0/,
            suggestion: 'Use .isEmpty for clarity and performance.'
        },
        {
            id: 'unowned-self',
            message: 'Avoid [unowned self], prefer [weak self]',
            severity: 'warning',
            pattern: /\[\s*unowned\s+self\s*\]/,
            suggestion: 'Unowned references can crash if the object is deallocated. Use weak.'
        },
        {
            id: 'final-class',
            message: 'Consider making class final',
            severity: 'info',
            pattern: /class\s+[A-Z][a-zA-Z0-9]*/,
            suggestion: 'Mark class as "final" if not intended for subclassing (performance).'
        },
        {
            id: 'legacy-geometry',
            message: 'Use .width/.height directly',
            severity: 'info',
            pattern: /\.size\.(width|height)/,
            suggestion: 'Use .width or .height directly on CGRect.'
        }
    ],
    'ios-objc': [
        {
            id: 'ns-log',
            message: 'Avoid NSLog in production',
            severity: 'warning',
            pattern: /NSLog\(/,
            suggestion: 'Use os_log for better performance and privacy',
            url: 'https://developer.apple.com/documentation/os/os_log'
        },
        {
            id: 'retain-cycle-blocks',
            message: 'Potential retain cycle in block',
            severity: 'warning',
            pattern: /\[self\s+[a-zA-Z0-9_]+\]/,
            suggestion: 'Use __weak typeof(self) weakSelf = self; inside blocks avoiding direct self reference',
            url: 'https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithBlocks/WorkingwithBlocks.html'
        },
        {
            id: 'atomic-property',
            message: 'Consider using nonatomic',
            severity: 'info',
            pattern: /@property\s*\((?:atomic|strong|retain|copy)\)/,
            suggestion: 'most UI properties should be nonatomic for performance'
        },
        {
            id: 'string-literal-compare',
            message: 'Incorrect string literal comparison',
            severity: 'warning',
            pattern: /==\s*@"/,
            suggestion: 'Use [str isEqualToString:@"..."]'
        },
        {
            id: 'empty-block',
            message: 'Empty block detected',
            severity: 'warning',
            pattern: /\{\s*\}/,
            suggestion: 'Remove or comment'
        },
        {
            id: 'synch-self',
            message: 'Avoid locking on self',
            severity: 'warning',
            pattern: /@synchronized\s*\(\s*self\s*\)/,
            suggestion: 'Use a private internal lock object.'
        },
        {
            id: 'literal-conversion',
            message: 'Prefer literal syntax',
            severity: 'info',
            pattern: /\[NSNumber\s+numberWithInt:([0-9]+)\]/,
            suggestion: 'Use @(number) instead.'
        },
        {
            id: 'no-http',
            message: 'Avoid insecure "http://"',
            severity: 'error',
            pattern: /http:\/\//,
            suggestion: 'Use "https://" for secure communication.'
        }
    ],
    'flutter-dart': [
        {
            id: 'print-debug',
            message: 'Avoid print() in production',
            severity: 'warning',
            pattern: /print\(/,
            suggestion: 'Use debugPrint() or a proper Logger',
            url: 'https://api.flutter.dev/flutter/foundation/debugPrint.html'
        },
        {
            id: 'var-usage',
            message: 'Prefer "final" or "const" over "var"',
            severity: 'info',
            pattern: /\bvar\s+/,
            suggestion: 'Immutability improves performance and safety',
            url: 'https://dart.dev/guides/language/language-tour#variables'
        },
        {
            id: 'hardcoded-padding',
            message: 'Avoid hardcoded EdgeInsets',
            severity: 'info',
            pattern: /EdgeInsets\.all\([0-9]+\)/,
            suggestion: 'Use a constant or theme dimension for consistency'
        },
        {
            id: 'set-state-mounted',
            message: 'Check if mounted before setState',
            severity: 'warning',
            pattern: /setState\(/,
            suggestion: 'Ensure "if (mounted)" check wraps setState in async methods',
            url: 'https://api.flutter.dev/flutter/widgets/State/setState.html'
        },
        {
            id: 'debugger',
            message: 'Avoid "debugger" statement',
            severity: 'error',
            pattern: /debugger/,
            suggestion: 'Remove debugger before deployment'
        },
        {
            id: 'empty-block',
            message: 'Empty block detected',
            severity: 'warning',
            pattern: /\{\s*\}/,
            suggestion: 'Remove empty block or add a comment'
        },
        {
            id: 'always-true',
            message: 'Condition is always true/false',
            severity: 'error',
            pattern: /(if|while)\s*\(\s*(true|false)\s*\)/,
            suggestion: 'Remove deterministic condition'
        },
        {
            id: 'naming-class',
            message: 'Class/Enum should be PascalCase',
            severity: 'info',
            pattern: /(class|enum|mixin)\s+[a-z][a-zA-Z0-9]*/,
            suggestion: 'Rename to start with an uppercase letter'
        },
        {
            id: 'naming-variable',
            message: 'Variable should be camelCase',
            severity: 'info',
            pattern: /\b(var|final|const)\s+([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*_[a-zA-Z0-9]*)\s*[:=]/,
            suggestion: 'Rename to camelCase'
        },
        {
            id: 'missing-dartdoc',
            message: 'Public member missing documentation',
            severity: 'info',
            pattern: /\b(?:class|void|Future|[A-Z][a-zA-Z0-9]*)\s+([a-zA-Z0-9_]+)/g,
            suggestion: 'Add documentation comment (///)',
            global: true,
            docType: 'line'
        },
        {
            id: 'todo-comments',
            message: 'TODO/FIXME detected',
            severity: 'info',
            pattern: /\/\/\s*(TODO|FIXME):/,
            suggestion: 'Track this externally'
        },
        {
            id: 'await-in-loop',
            message: 'Avoid "await" inside loops',
            severity: 'warning',
            pattern: /for\s*\([^)]+\)\s*\{[^}]*await\s+/g,
            suggestion: 'Use Future.wait([]) for parallel execution if possible',
            global: true
        },
        {
            id: 'sized-box-shrink',
            message: 'Use SizedBox.shrink()',
            severity: 'info',
            pattern: /SizedBox\(\s*(?:width|height)\s*:\s*0/,
        },
        {
            id: 'no-http',
            message: 'Avoid insecure "http://"',
            severity: 'error',
            pattern: /http:\/\//,
            suggestion: 'Use "https://" for secure communication.'
        },
        {
            id: 'collection-empty-check',
            message: 'Prefer .isEmpty over .length == 0',
            severity: 'info',
            pattern: /\.length\s*==\s*0/,
            suggestion: 'Use .isEmpty for clarity.'
        },
        {
            id: 'unawaited-future',
            message: 'Future not awaited',
            severity: 'warning',
            pattern: /Future\s*\.[a-zA-Z]+\(/,
            suggestion: 'Ensure you await this or use .then()'
        },
        {
            id: 'use-arrow',
            message: 'Prefer arrow syntax for one-line functions',
            severity: 'info',
            pattern: /\{\s*return\s+[^;]+;\s*\}/,
            suggestion: 'Use => syntax.'
        }
    ]
};

export interface QualityIssue {
    ruleId: string;
    message: string;
    line: number;
    severity: Severity;
    suggestion?: string;
    column?: number;
    url?: string;
}

// Helper to check if an index is inside a string
const isInsideString = (line: string, index: number): boolean => {
    let inSingle = false;
    let inDouble = false;
    let inBacktick = false;

    for (let i = 0; i < index && i < line.length; i++) {
        const char = line[i];
        const prev = i > 0 ? line[i - 1] : null;

        if (prev === '\\') continue; // Skip escaped chars

        if (char === "'" && !inDouble && !inBacktick) inSingle = !inSingle;
        if (char === '"' && !inSingle && !inBacktick) inDouble = !inDouble;
        if (char === '`' && !inSingle && !inDouble) inBacktick = !inBacktick;
    }

    // If we are currently in a quote state at matched index
    return inSingle || inDouble || inBacktick;
};

export const analyzeCode = (code: string, language: SupportedLanguage): QualityIssue[] => {
    const issues: QualityIssue[] = [];
    const rules = RULES[language];
    const normalizedCode = code.replace(/\r\n/g, '\n');
    const lines = normalizedCode.split('\n');

    rules.forEach(rule => {
        if (rule.global) {
            // Global check on full content
            const matches = normalizedCode.matchAll(rule.pattern);
            for (const match of matches) {
                if (match.index !== undefined) {
                    // Check logic for documentation presence if docType is specified
                    if (rule.docType) {
                        const precedingCode = normalizedCode.substring(0, match.index).trimEnd();
                        const hasBlockDoc = rule.docType === 'block' && precedingCode.endsWith('*/');

                        // For line docs (///), we check the last non-empty line
                        let hasLineDoc = false;
                        if (rule.docType === 'line') {
                            const precedingLines = precedingCode.split('\n');
                            const lastLine = precedingLines[precedingLines.length - 1]?.trim() || '';
                            hasLineDoc = lastLine.startsWith('///');
                        }

                        if (hasBlockDoc || hasLineDoc) {
                            continue; // Has docs, skip warning
                        }
                    }

                    // Calculate line number
                    const codeUpToMatch = normalizedCode.substring(0, match.index);
                    const lineNum = codeUpToMatch.split('\n').length;

                    issues.push({
                        ruleId: rule.id,
                        message: rule.message,
                        line: lineNum,
                        severity: rule.severity,
                        suggestion: rule.suggestion,
                        column: match.index - codeUpToMatch.lastIndexOf('\n'), // Approximate column
                        url: rule.url
                    });
                }
            }
        } else {
            // Line-by-line check
            let inBlockComment = false;
            lines.forEach((lineContent, lineIndex) => {
                let contentToCheck = lineContent;

                // Handle block comments
                if (inBlockComment) {
                    if (lineContent.includes('*/')) {
                        inBlockComment = false;
                        contentToCheck = lineContent.substring(lineContent.indexOf('*/') + 2);
                    } else {
                        return;
                    }
                } else if (lineContent.includes('/*')) {
                    if (lineContent.includes('*/') && lineContent.lastIndexOf('*/') > lineContent.indexOf('/*')) {
                        // Inline block comment
                        contentToCheck = lineContent.replace(/\/\*.*?\*\//g, '');
                    } else {
                        inBlockComment = true;
                        contentToCheck = lineContent.substring(0, lineContent.indexOf('/*'));
                    }
                }

                // Ignore commented out lines for most rules
                if (contentToCheck.trim().startsWith('//') && rule.id !== 'todo-comment') {
                    return;
                }

                const match = contentToCheck.match(rule.pattern);
                if (match && match.index !== undefined) {
                    // Check if match is inside a string (for rules that request ignoreStrings)
                    if (rule.ignoreStrings && isInsideString(contentToCheck, match.index)) {
                        return;
                    }

                    // Check for custom ignore logic (e.g., checking context)
                    if (rule.shouldIgnore && rule.shouldIgnore(contentToCheck, match, lines, lineIndex)) {
                        return;
                    }

                    issues.push({
                        ruleId: rule.id,
                        message: rule.message,
                        line: lineIndex + 1,
                        severity: rule.severity,
                        suggestion: rule.suggestion,
                        column: match.index,
                        url: rule.url
                    });
                }
            });
        }
    });

    return issues;
};

export interface ProjectFile {
    name: string;
    content: string;
    language: SupportedLanguage;
    issues: QualityIssue[];
}

export const detectLanguage = (filename: string, content: string = ''): SupportedLanguage | null => {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.dart')) return 'flutter-dart';
    if (lower.endsWith('.tsx') || lower.endsWith('.ts')) {
        // Differentiation: Check for react-native import
        if (content.includes('react-native')) {
            return 'react-native';
        }
        return 'react-ts';
    }
    if (lower.endsWith('.vue')) return 'vue-ts';
    if (lower.endsWith('.kt')) return 'android-kotlin';
    if (lower.endsWith('.java')) return 'android-java';
    if (lower.endsWith('.swift')) return 'ios-swift';
    if (lower.endsWith('.m') || lower.endsWith('.h')) return 'ios-objc';
    return null;
};
