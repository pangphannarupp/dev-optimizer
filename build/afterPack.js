exports.default = async function (context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');

    const appName = context.packager.appInfo.productFilename;
    const appPath = path.join(appOutDir, `${appName}.app`);

    try {
        console.log(`  • removing quarantine attributes from ${appPath}`);
        execSync(`xattr -cr "${appPath}"`);
    } catch (error) {
        console.error(`  x failed to remove quarantine attributes: ${error.message}`);
    }
};
