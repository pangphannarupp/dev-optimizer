
const content = `
/**
 * Maximum time expect() should wait using "await expect(locator).toHaveText();"
 * For example in \`await expect(locator).toHaveText();\`
 */
const x = "valid string";
`;

// Simple regex from validationUtils.ts fallback for strings
const stringLiteralRegex = /(['"`])(.*?)\1/g;
let match;

console.log("--- Extracting Strings (No Block Comment Masking) ---");
while ((match = stringLiteralRegex.exec(content)) !== null) {
    const str = match[2];
    console.log(`Matched: [${str}]`);
}
