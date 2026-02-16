
const content = `
const description = args[5].replace(/"/g, "").trim(); 
let components = [];
components = args[3].replace(/[\[\]"]+/g, "").split(",");
`;

// Simple regex from validationUtils.ts
const stringLiteralRegex = /(['"`])(.*?)\1/g;
let match;

console.log("--- Extracting Strings ---");
while ((match = stringLiteralRegex.exec(content)) !== null) {
    const str = match[2];
    console.log(`Matched: [${str}]`);
}
