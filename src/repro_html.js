
const str = "<html><body><h1>Splash not found</h1></body></html>";
const regex = /<[a-z][\s\S]*>/i;

console.log(`String: [${str}]`);
console.log(`Regex: ${regex}`);
console.log(`Match: ${regex.test(str)}`);

if (regex.test(str)) {
    console.log("Result: IGNORED (Correct)");
} else {
    console.log("Result: FLAGGED (Incorrect)");
}
