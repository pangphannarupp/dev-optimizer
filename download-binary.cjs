const fs = require('fs');
const https = require('https');
const path = require('path');

const binDir = path.join(__dirname, 'electron', 'bin');
if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
}

const dest = path.join(binDir, 'yt-dlp');
const file = fs.createWriteStream(dest);

console.log('Downloading to:', dest);

function download(url) {
    https.get(url, function (response) {
        if (response.statusCode === 302 || response.statusCode === 301) {
            console.log('Redirecting to:', response.headers.location);
            download(response.headers.location);
        } else if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(() => {
                    fs.chmodSync(dest, 0o755);
                    const stats = fs.statSync(dest);
                    console.log(`Download complete. File size: ${stats.size} bytes`);
                });
            });
        } else {
            console.error(`Download failed with status code: ${response.statusCode}`);
            fs.unlink(dest, () => { });
        }
    }).on('error', function (err) {
        fs.unlink(dest, () => { });
        console.error('Error:', err.message);
    });
}

download('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos');
