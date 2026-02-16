
const content = `
public static scrollToViewElement(refElement: any, block: Partial<"center" | "end" | "nearest" | "start"> = "nearest", inline: Partial<"center" | "end" | "nearest" | "start"> = "nearest") {
`;

// Regex from validationUtils.ts
const jsxTextRegex = />([^<{]+)</g;
let match;

console.log("--- Extracting JSX Text ---");
while ((match = jsxTextRegex.exec(content)) !== null) {
    const text = match[1].trim();
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;
    const matchString = match[0];
    const charAfter = content[matchEnd];

    // Check logic from validationUtils.ts
    let wouldBeIgnored = false;
    let reason = "";

    const charBefore = content[matchStart - 1];
    if (charBefore === '=' || charBefore === '-') {
        wouldBeIgnored = true;
        reason = "Preceding char is = or -";
    }

    if (!/[a-zA-Z\/!]/.test(charAfter)) {
        wouldBeIgnored = true;
        reason = `Succeeding char [${charAfter}] is not a tag start`;
    }

    if (/(&&|\|\||>=|<=|==|!=|\.length|\.replace\(|Math\.)/.test(text)) {
        wouldBeIgnored = true;
        reason = "Contains code-like patterns";
    }

    console.log(`Matched: [${text}]`);
    console.log(`Full match: ${matchString}`);
    console.log(`Char after < : [${charAfter}]`);
    console.log(`Would be ignored? ${wouldBeIgnored} (${reason})`);
}
