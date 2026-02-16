
const content = `
// Handle negative values
if (value < 0) {
    return useParens ? \`(\${result.replace("-", "")})\` : result;
}
`;

// Regex from validationUtils.ts
const jsxTextRegex = />([^<{]+)</g;
const stringLiteralRegex = /(['"`])(.*?)\1/g;

let match;

console.log("--- Extracting JSX Text ---");
let maskedContent = content.replace(/\/\*[\s\S]*?\*\//g, (match) => ' '.repeat(match.length));
while ((match = jsxTextRegex.exec(maskedContent)) !== null) {
    const text = match[1].trim();
    console.log(`Matched JSX: [${text}]`);
}

console.log("--- Extracting String Literals ---");
while ((match = stringLiteralRegex.exec(content)) !== null) {
    const str = match[2];
    const quote = match[1];
    console.log(`Matched String: [${str}] with quote: [${quote}]`);
}
