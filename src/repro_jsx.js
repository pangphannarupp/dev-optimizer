
const content = `
function validate(cleaned) {
    // International format validation
    return cleaned.length >= 10 && cleaned.length <= 15;
}
`;

// Regex from validationUtils.ts
const jsxTextRegex = />([^<{]+)</g;
let match;

console.log("--- Extracting JSX Text ---");
while ((match = jsxTextRegex.exec(content)) !== null) {
    const text = match[1].trim();
    console.log(`Matched: [${text}]`);
    console.log(`Full match: ${match[0]}`);
    console.log(`Index: ${match.index}`);
}
