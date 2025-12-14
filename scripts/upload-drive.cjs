const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const mime = require('mime-types');
const { authenticate } = require('@google-cloud/local-auth');

// --- Configuration ---
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');
const TOKEN_PATH = path.join(__dirname, '../token.json');

const FOLDER_IDS = {
    'windows': '1umhaW-bJrl_GaTAVsZyekPaVztLe2QKt',
    'linux': '1tpJmmQmuuBMoxamWr-Xtxn3Ibpdov-G5',
    'mac-intel': '1xd2sYW_zR91wHx8dBhV3QfZGiLEhEAyC',
    'mac-silicon': '134eVXPi8bzMV4zrgOM0y7ZwyXINfTk3c'
};
// Scope for full file access (needed to upload)
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function loadSavedCredentialsIfExist() {
    try {
        const content = fs.readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function verifyClient(client) {
    try {
        const drive = google.drive({ version: 'v3', auth: client });
        await drive.about.get({ fields: 'user' });
        console.log('✅ Verify token success');
        return true;
    } catch (err) {
        console.warn('⚠️ Token verification failed:', err.message);
        return false;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFileSync(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        console.log('🔍 Validating saved token...');
        const isValid = await verifyClient(client);
        if (isValid) {
            return client;
        }
        console.warn('⚠️ Saved token is invalid or expired. Deleting it...');
        try { fs.unlinkSync(TOKEN_PATH); } catch (e) { } // Delete bad token
    }

    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.error(`❌ OAuth Credentials file not found at: ${CREDENTIALS_PATH}`);
        console.error('   Please create an OAuth Client ID in Google Cloud Console, download the JSON, and save it as "credentials.json" in the project root.');
        console.error('   See GOOGLE_DRIVE_SETUP.md for instructions.');
        process.exit(1);
    }

    console.log('🔐 Authenticating via Browser...');
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });

    if (client.credentials) {
        console.log('✅ Auth successful. Credentials received.');
        if (!client.credentials.refresh_token) {
            console.warn('⚠️ No refresh token received! Token handling might fail later.');
        }
        await saveCredentials(client);
    }

    // Verify immediately
    const valid = await verifyClient(client);
    if (!valid) {
        console.error('❌ Immediate token verification failed!');
        process.exit(1);
    }

    return client;
}

async function uploadFile(drive, filePath, folderId) {
    const fileName = path.basename(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId],
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath),
            },
            fields: 'id, name, webViewLink',
        });
        console.log(`✅ Uploaded ${fileName}: ${response.data.webViewLink}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to upload ${fileName}:`, error.message);

        if (error.code === 401 || error.message.includes('Login Required')) {
            console.error('⚠️ Auth error detected. Deleting invalid token. Please run the script again.');
            try { fs.unlinkSync(TOKEN_PATH); } catch (e) { }
            process.exit(1);
        }
    }
}

async function main() {
    console.log('🚀 Starting Google Drive Upload (OAuth Mode)...');

    // 1. Authenticate (User Login)
    const auth = await authorize();
    const drive = google.drive({ version: 'v3', auth });

    // 2. Identify Release Directory
    const version = require('../package.json').version;
    const releaseDir = path.join(__dirname, `../release/${version}`);

    if (!fs.existsSync(releaseDir)) {
        console.warn(`⚠️ Release directory not found: ${releaseDir}`);
        console.warn('   Proceeding locally for testing auth flow, but normally you should run "npm run build:all" first.');
        // For testing auth, successfully getting here means auth worked. 
        // We will exit gracefully if just testing.
        return;
    }

    console.log(`📂 Release directory: ${releaseDir}`);

    // 3. Find Artifacts
    const artifacts = [];
    function findFiles(dir, extension, platformKey, nameIncludes = '') {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                findFiles(fullPath, extension, platformKey, nameIncludes);
            } else if (file.endsWith(extension) && file.includes(nameIncludes)) {
                if (platformKey === 'mac') {
                    if (file.includes('arm64')) {
                        artifacts.push({ path: fullPath, platform: 'mac-silicon' });
                    } else {
                        artifacts.push({ path: fullPath, platform: 'mac-intel' });
                    }
                } else {
                    artifacts.push({ path: fullPath, platform: platformKey });
                }
            }
        }
    }

    findFiles(releaseDir, '.exe', 'windows');
    findFiles(releaseDir, '.AppImage', 'linux');
    findFiles(releaseDir, '.dmg', 'mac');

    // 4. Upload
    if (artifacts.length === 0) {
        console.warn('⚠️ No build artifacts found to upload.');
        return;
    }

    console.log(`found ${artifacts.length} artifacts.`);

    for (const artifact of artifacts) {
        const folderId = FOLDER_IDS[artifact.platform];
        if (folderId) {
            console.log(`⬆️ Uploading ${path.basename(artifact.path)} to ${artifact.platform}...`);
            await uploadFile(drive, artifact.path, folderId);
        } else {
            console.warn(`⚠️ No folder ID configured for platform ${artifact.platform}`);
        }
    }

    console.log('🎉 Upload process completed!');
}

main().catch(console.error);
