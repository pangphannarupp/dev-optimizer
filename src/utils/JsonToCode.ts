
export type Language = 'typescript' | 'kotlin' | 'swift' | 'dart';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const getTypeScriptType = (value: any): string => {
    if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]';
        return `${getTypeScriptType(value[0])}[]`;
    }
    if (value === null) return 'any';
    if (typeof value === 'object') return 'object'; // Should be replaced by interface name in recursive calls
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    return 'string';
};

const getKotlinType = (value: any): string => {
    if (Array.isArray(value)) {
        if (value.length === 0) return 'List<Any>';
        return `List<${getKotlinType(value[0])}>`;
    }
    if (value === null) return 'Any?';
    if (typeof value === 'object') return 'Any'; // Placeholder
    if (typeof value === 'boolean') return 'Boolean';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
    return 'String';
};

const getSwiftType = (value: any): string => {
    if (Array.isArray(value)) {
        if (value.length === 0) return '[Any]';
        return `[${getSwiftType(value[0])}]`;
    }
    if (value === null) return 'Any?';
    if (typeof value === 'object') return 'Any'; // Placeholder
    if (typeof value === 'boolean') return 'Bool';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
    return 'String';
};

const getDartType = (value: any): string => {
    if (Array.isArray(value)) {
        if (value.length === 0) return 'List<dynamic>';
        return `List<${getDartType(value[0])}>`;
    }
    if (value === null) return 'dynamic';
    if (typeof value === 'object') return 'Object'; // Placeholder
    if (typeof value === 'boolean') return 'bool';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
    return 'String';
};

// --- TypeScript Generator ---
export const generateTypeScriptTypes = (json: any, rootName: string): string => {
    let output = '';
    const interfaces: Map<string, any> = new Map();

    const processObject = (name: string, obj: any) => {
        if (interfaces.has(name)) return;
        interfaces.set(name, obj);

        Object.entries(obj).forEach(([key, value]) => {
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                processObject(capitalize(key), value);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                processObject(capitalize(key), value[0]);
            }
        });
    };

    processObject(rootName, json);

    interfaces.forEach((obj, name) => {
        output += `export interface ${name} {\n`;
        Object.entries(obj).forEach(([key, value]) => {
            let type = getTypeScriptType(value);
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                type = capitalize(key);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                type = `${capitalize(key)}[]`;
            }
            output += `    ${key}: ${type};\n`;
        });
        output += `}\n\n`;
    });

    return output.trim();
};

// --- Kotlin Generator ---
export const generateKotlinDataClasses = (json: any, rootName: string): string => {
    let output = '';
    const classes: Map<string, any> = new Map();

    const processObject = (name: string, obj: any) => {
        if (classes.has(name)) return;
        classes.set(name, obj);

        Object.entries(obj).forEach(([key, value]) => {
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                processObject(capitalize(key), value);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                processObject(capitalize(key), value[0]);
            }
        });
    };

    processObject(rootName, json);

    classes.forEach((obj, name) => {
        output += `data class ${name}(\n`;
        const entries = Object.entries(obj);
        entries.forEach(([key, value], index) => {
            let type = getKotlinType(value);
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                type = capitalize(key);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                type = `List<${capitalize(key)}>`;
            }
            const comma = index < entries.length - 1 ? ',' : '';
            output += `    val ${key}: ${type}${comma}\n`;
        });
        output += `)\n\n`;
    });

    return output.trim();
};

// --- Swift Generator ---
export const generateSwiftStructs = (json: any, rootName: string): string => {
    let output = '';
    const structs: Map<string, any> = new Map();

    const processObject = (name: string, obj: any) => {
        if (structs.has(name)) return;
        structs.set(name, obj);

        Object.entries(obj).forEach(([key, value]) => {
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                processObject(capitalize(key), value);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                processObject(capitalize(key), value[0]);
            }
        });
    };

    processObject(rootName, json);

    structs.forEach((obj, name) => {
        output += `struct ${name}: Codable {\n`;
        Object.entries(obj).forEach(([key, value]) => {
            let type = getSwiftType(value);
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                type = capitalize(key);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                type = `[${capitalize(key)}]`;
            }
            output += `    let ${key}: ${type}\n`;
        });
        output += `}\n\n`;
    });

    return output.trim();
};

// --- Dart Generator ---
export const generateDartClasses = (json: any, rootName: string): string => {
    let output = '';
    const classes: Map<string, any> = new Map();

    const processObject = (name: string, obj: any) => {
        if (classes.has(name)) return;
        classes.set(name, obj);

        Object.entries(obj).forEach(([key, value]) => {
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                processObject(capitalize(key), value);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                processObject(capitalize(key), value[0]);
            }
        });
    };

    processObject(rootName, json);

    classes.forEach((obj, name) => {
        output += `class ${name} {\n`;
        Object.entries(obj).forEach(([key, value]) => {
            let type = getDartType(value);
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                type = capitalize(key);
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                type = `List<${capitalize(key)}>`;
            }
            output += `  final ${type} ${key};\n`;
        });

        output += `\n  ${name}({\n`;
        Object.entries(obj).forEach(([key]) => {
            output += `    required this.${key},\n`;
        });
        output += `  });\n`;

        output += `\n  factory ${name}.fromJson(Map<String, dynamic> json) {\n`;
        output += `    return ${name}(\n`;
        Object.entries(obj).forEach(([key, value]) => {
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                output += `      ${key}: ${capitalize(key)}.fromJson(json['${key}']),\n`;
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                output += `      ${key}: (json['${key}'] as List).map((i) => ${capitalize(key)}.fromJson(i)).toList(),\n`;
            } else {
                output += `      ${key}: json['${key}'],\n`;
            }
        });
        output += `    );\n  }\n`;

        output += `}\n\n`;
    });

    return output.trim();
};

export const generateCode = (jsonString: string, language: Language, rootName: string): string => {
    try {
        const json = JSON.parse(jsonString);
        switch (language) {
            case 'typescript': return generateTypeScriptTypes(json, rootName);
            case 'kotlin': return generateKotlinDataClasses(json, rootName);
            case 'swift': return generateSwiftStructs(json, rootName);
            case 'dart': return generateDartClasses(json, rootName);
            default: return '';
        }
    } catch (e) {
        return `Error parsing JSON: ${(e as Error).message}`;
    }
};
