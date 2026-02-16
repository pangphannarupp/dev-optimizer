
const content = `
// This is a "comment" with an unclosed quote
print("Hello");
print("World");
`;

const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
let match;

console.log("--- Extracting Strings ---");
while ((match = regex.exec(content)) !== null) {
    const str = match[1];
    console.log(`Matched: [${str}]`);
}
