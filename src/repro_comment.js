
const content = `
/**
 * Executes HTTP fetch with retry logic and timeout handling
 * @param {HttpFetchParams} param - Fetch parameters
 * @returns {Promise<HttpResponse>} Promise that resolves to HTTP response
 */
async httpFetch(param: HttpFetchParams): Promise<HttpResponse> {
`;

// Regex from validationUtils.ts
const maskingRegex = /\/\*[\s\S]*?\*\//g;
const maskedContent = content.replace(maskingRegex, (match) => ' '.repeat(match.length));

console.log("--- Original Content ---");
console.log(content);
console.log("--- Masked Content ---");
console.log(maskedContent);

// Check if JSX regex finds anything in masked content
const jsxTextRegex = />([^<{]+)</g;
let match;
while ((match = maskedContent.match(jsxTextRegex)) !== null) { // match isn't iterable like exec loop in simple check, but let's use exec
    // re-create regex loop
}
let execMatch;
while ((execMatch = jsxTextRegex.exec(maskedContent)) !== null) {
    console.log(`Matched JSX text in masked content: [${execMatch[1]}]`);
}

// Check with original content to see if it Matches
console.log("--- Original Content JSX Match ---");
while ((execMatch = jsxTextRegex.exec(content)) !== null) {
    console.log(`Matched JSX text in ORIGINAL content: [${execMatch[1]}]`);
}
