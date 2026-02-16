
const content = `
// This is a "comment" with an unclosed quote
print("Hello");
/* Block comment with "quote" */
print("World");
let x = """
Multiline "quote"
"""
`;

// Swift Tokenizer Regex from validationUtils.ts
const tokenizerRegex = /"""([\s\S]*?)"""|"([^"\\]*(?:\\.[^"\\]*)*)"|(\/\/.*)|(\/\*[\s\S]*?\*\/)/g;
let match;

console.log("--- Extracting Strings with Tokenizer ---");
while ((match = tokenizerRegex.exec(content)) !== null) {
    if (match[3] || match[4]) {
        console.log(`Skipped Comment: ${match[0].trim()}`);
        continue;
    }

    let str = '';
    if (match[1] !== undefined) {
        str = match[1];
        console.log(`Matched Multiline: [${str.replace(/\n/g, '\\n')}]`);
    } else if (match[2] !== undefined) {
        str = match[2];
        console.log(`Matched String: [${str}]`);
    }
}
