
function check(content) {
    const stringLiteralRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let match;
    while ((match = stringLiteralRegex.exec(content)) !== null) {
        const str = match[1];
        console.log(`Checking string: [${str}]`);

        if (str.startsWith('\\(')) {
            console.log(`  -> Ignored by startsWith('\\(')`);
        } else {
            console.log(`  -> NOT Ignored`);
        }
    }
}

const input = 'return "\\(outputDateStr) \\(outputTimeStr)"';
// Note: In JS string literal for input, backslash needs escaping. 
// So "\\(" represents literal "\(" in the string content, matching what would be in the file.
check(input);
