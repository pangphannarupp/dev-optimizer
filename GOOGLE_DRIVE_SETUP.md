# Google Drive Upload Setup Guide (OAuth 2.0)

To enable automated uploads using your own Google Account (popup login), follow these steps:

## 1. Create a Google Cloud Project
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select or create a new project.

## 2. Enable Google Drive API
1.  Go to **"APIs & Services" > "Library"**.
2.  Search for **"Google Drive API"**.
3.  Click **Enable**.

## 3. Configure OAuth Consent Screen
1.  Go to **"APIs & Services" > "OAuth consent screen"**.
2.  Select **External** (or Internal if you have a Workspace).
3.  Fill in required fields (App name: "Dev Optimizer Uploader", Email, etc.).
4.  **Scopes**: Add `.../auth/drive.file`.
5.  **Test Users**: Add your own Google email address (since the app is in "Testing" mode).
6.  Save and Continue.

## 4. Create Credentials (OAuth Client ID)
1.  Go to **"APIs & Services" > "Credentials"**.
2.  Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**.
3.  Application type: **Desktop app**.
4.  Name: "Desktop Uploader".
5.  Click **Create**.

## 5. Download Credentials
1.  Download the JSON file.
2.  Rename it to **`credentials.json`**.
3.  Place it in the **root folder** of your project (same level as `package.json`).

## 6. Run the Script
1.  Run `npm run upload:drive` (or `npm run release:all` to build first).
2.  A browser window will open.
3.  Log in with your Google account and allow access.
4.  The script will save a `token.json` file for future runs.

## Troubleshooting

### Error 403: access_denied (App not verified)
If you see an error saying **"The app is currently being tested, and can only be accessed by developer-approved testers"**:
1.  Go to **[Google Cloud Console > APIs & Services > OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)**.
2.  Scroll down to the **"Test users"** section.
3.  Click **"+ ADD USERS"**.
4.  Enter the **exact email address** you are trying to log in with.
5.  Click **Save**.
6.  Try running the script again.
