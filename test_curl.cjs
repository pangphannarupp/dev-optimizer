
const curlConverter = require('curlconverter');

const curl = "curl --location 'https://example.com/api' --header 'Authorization: Bearer 123' --header 'Content-Type: application/json' --data '{\"foo\":\"bar\"}'";

try {
    const json = curlConverter.toJsonString(curl);
    console.log("JSON Output:", json);
} catch (e) {
    console.error("Error:", e.message);
    console.log("Available methods:", Object.keys(curlConverter));
}
