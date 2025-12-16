export type MockDataType = 'name' | 'firstName' | 'lastName' | 'email' | 'uuid' | 'boolean' | 'number' | 'date' | 'custom';

export interface SchemaField {
    id: string;
    name: string;
    type: MockDataType;
    options?: {
        min?: number;
        max?: number;
        listItems?: string[]; // comma separated
    };
}

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com"];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

const generateValue = (field: SchemaField): any => {
    switch (field.type) {
        case 'uuid':
            return crypto.randomUUID();
        case 'firstName':
            return randomItem(firstNames);
        case 'lastName':
            return randomItem(lastNames);
        case 'name':
            return `${randomItem(firstNames)} ${randomItem(lastNames)}`;
        case 'email':
            const first = randomItem(firstNames).toLowerCase();
            const last = randomItem(lastNames).toLowerCase();
            return `${first}.${last}@${randomItem(domains)}`;
        case 'boolean':
            return Math.random() > 0.5;
        case 'number':
            const min = field.options?.min ?? 0;
            const max = field.options?.max ?? 100;
            return randomInt(min, max);
        case 'date':
            // Last 5 years to next 1 year
            const start = new Date();
            start.setFullYear(start.getFullYear() - 5);
            const end = new Date();
            end.setFullYear(end.getFullYear() + 1);
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
        case 'custom':
            if (!field.options?.listItems || field.options.listItems.length === 0) return 'item';
            return randomItem(field.options.listItems);
        default:
            return '';
    }
};

export const generateMockData = (schema: SchemaField[], count: number): any[] => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const row: Record<string, any> = {};
        schema.forEach(field => {
            row[field.name] = generateValue(field);
        });
        data.push(row);
    }
    return data;
};
