
import * as curlConverter from 'curlconverter';

const curl = "curl --location 'https://example.com/api' --header 'Authorization: Bearer 123' --header 'Content-Type: application/json' --data '{\"foo\":\"bar\"}'";

try {
    if (curlConverter.toJsonString) {
        const json = curlConverter.toJsonString(curl);
        console.log("JSON Output:", json);
    } else {
        console.log("toJsonString not found. Available:", Object.keys(curlConverter));
    }
} catch (e) {
    console.error("Error:", e.message);
    console.log("Available:", Object.keys(curlConverter));
}
