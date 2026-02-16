

export const TEMPLATES = {
    web_basic: (url: string) => `import { test, expect } from '@playwright/test';

test('basic web navigation', async ({ page }) => {
  await page.goto('${url.includes('http') ? url : 'https://example.com'}');
  await expect(page).toHaveTitle(/Example/);
  await page.screenshot({ path: 'web-basic.png' });
});`,

    web_form: (url: string) => `import { test, expect } from '@playwright/test';

test('web form interaction', async ({ page }) => {
  await page.goto('${url}');
  
  // Fill inputs (Select by name, placeholder, or CSS)
  // await page.getByLabel('Username').fill('testuser');
  // await page.getByLabel('Password').fill('password123');
  
  // Click Submit
  // await page.getByRole('button', { name: 'Submit' }).click();
  
  // Verify
  // await expect(page.getByText('Success')).toBeVisible();
});`,

    mobile_search: () => `import { test, _android as android } from '@playwright/test';

// ROBUST NATIVE AUTOMATION (YOUTUBE EXAMPLE)
test('android native search', async () => {
  const devices = await android.devices();
  // Select specific device if env var is set, otherwise default to first
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No device found' + (process.env.DEVICE_MODEL ? \` matching "\${process.env.DEVICE_MODEL}"\` : '') + '. Connect via ADB.');
      test.skip(); return;
  }
  
  // 1. Launch App (YouTube)
  await device.shell('am force-stop com.google.android.youtube');
  await device.shell('am start -a android.intent.action.VIEW -d "https://www.youtube.com" com.google.android.youtube');
  await new Promise(r => setTimeout(r, 5000));

  // 2. Search Interaction (Using KeyEvents for reliability)
  console.log('Tapping Search (Key 84)...');
  await device.shell('input keyevent 84');
  await new Promise(r => setTimeout(r, 1500));

  console.log('Typing text...');
  // Type char-by-char to avoid IME issues
  const text = "Playwright Android";
  const chars: Record<string, number> = { 
    ' ': 62, 'a': 29, 'b': 30, 'c': 31, 'd': 32, 'e': 33, 'f': 34, 'g': 35, 'h': 36, 'i': 37, 'j': 38,
    'k': 39, 'l': 40, 'm': 41, 'n': 42, 'o': 43, 'p': 44, 'q': 45, 'r': 46, 's': 47, 't': 48,
    'u': 49, 'v': 50, 'w': 51, 'x': 52, 'y': 53, 'z': 54 
  };
  
  for (const char of text.toLowerCase()) {
      if (chars[char]) await device.shell(\`input keyevent \${chars[char]}\`);
      await new Promise(r => setTimeout(r, 100));
  }
  
  await device.shell('input keyevent 66'); // Enter
  await new Promise(r => setTimeout(r, 4000));

  // 3. Click Result (Coordinate Tap + D-Pad fallback)
  console.log('Selecting video...');
  await device.shell('input tap 540 600'); // Center screen tap
  await device.shell('input keyevent 23');  // D-Pad Center
  await device.shell('input keyevent 66');  // Enter
});`,

    mobile_swipe: () => `import { test, _android as android } from '@playwright/test';

test('android swipe interaction', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found.');
      test.skip(); return;
  }

  // Example: Swipe Up (Scroll Down)
  // input swipe <x1> <y1> <x2> <y2> [duration(ms)]
  console.log('Swiping up...');
  await device.shell('input swipe 500 1500 500 500 300');
  
  await new Promise(r => setTimeout(r, 1000));
  await device.screenshot({ path: 'android-swiped.png' });
});`,

    desktop: (appPath: string) => `import { test, _electron as electron } from '@playwright/test';

test('launch electron app', async () => {
    // Launch app with path
    const electronApp = await electron.launch({ args: ['${appPath}'] });
    
    // Get first window
    const window = await electronApp.firstWindow();
    console.log(await window.title());
    
    await window.screenshot({ path: 'desktop-app.png' });
    await electronApp.close();
}); `,

    web_ecommerce: (url: string) => `import { test, expect } from '@playwright/test';

test('ecommerce add to cart flow', async ({ page }) => {
  await page.goto('${url.includes('http') ? url : 'https://www.saucedemo.com/'}');
  
  // Login
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
  
  // Add item to cart
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  
  // Go to cart
  await page.click('.shopping_cart_link');
  
  // Verify item
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await page.screenshot({ path: 'cart-verified.png' });
});`,

    web_api_mock: (url: string) => `import { test, expect } from '@playwright/test';

test('api mocking and network interception', async ({ page }) => {
  // Mock an API response
  await page.route('*/**/api/v1/fruits', async route => {
    const json = [{ name: 'Strawberry', id: 21 }];
    await route.fulfill({ json });
  });

  // Navigate to page that uses this API
  await page.goto('${url.includes('http') ? url : 'https://demo.playwright.dev/api-mocking'}');

  // Verify that the mocked data is displayed
  await expect(page.getByText('Strawberry')).toBeVisible();
});`,

    mobile_gestures: () => `import { test, _android as android } from '@playwright/test';

test('android complex gestures', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found. Check ADB connection.');
      test.skip(); return;
  }

  // 1. Long Press (simulated by swipe with duration)
  // Swipe from (500,500) to (500,500) over 2000ms
  console.log('Simulating Long Press...');
  await device.shell('input swipe 500 500 500 500 2000');
  
  // 2. Drag and Drop
  // Swipe from A to B
  console.log('Drag and Drop...');
  await device.shell('input swipe 200 500 800 500 1000');
  
  // 3. Hardware Buttons
  // Volume Up: 24, Volume Down: 25, Power: 26
  await device.shell('input keyevent 24');
  await device.shell('input keyevent 25');
  
  await device.screenshot({ path: 'android-gestures.png' });
});`,

    desktop_menu: (appPath: string) => `import { test, _electron as electron } from '@playwright/test';

test('electron menu interaction', async () => {
    const electronApp = await electron.launch({ args: ['${appPath}'] });
    
    // Evaluate in main process to click menu
    await electronApp.evaluate(async ({ Menu }) => {
        const menu = Menu.getApplicationMenu();
        const viewMenu = menu?.items.find(item => item.label === 'View');
        const toggleItem = viewMenu?.submenu?.items.find(item => item.label === 'Toggle Full Screen');
        toggleItem?.click();
    });
    
    const window = await electronApp.firstWindow();
    await window.screenshot({ path: 'desktop-menu.png' });
    await electronApp.close();
});`,

    mobile_grant_permissions: (packageName: string) => `import { test, _android as android } from '@playwright/test';

test('android grant runtime permissions', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found.');
      test.skip(); return;
  }
  
  const pkg = '${packageName && packageName !== 'Pixel 6' ? packageName : 'mcnc.dbcs.losapp.sit'}';

  console.log(\`Granting permissions for \${pkg}...\`);

  // Grant permissions found in Manifest
  const perms = [
    'android.permission.CAMERA',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.RECORD_AUDIO',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.READ_CONTACTS'
  ];

  for (const p of perms) {
    await device.shell(\`pm grant \${pkg} \${p}\`);
  }
  
  // Restart app to ensure permissions take effect
  await device.shell(\`am force-stop \${pkg}\`);
  await device.shell(\`monkey -p \${pkg} -c android.intent.category.LAUNCHER 1\`);
  
  await device.screenshot({ path: 'android-perms-granted.png' });
});`,

    mobile_deeplink: (schemeUrl: string) => `import { test, _android as android } from '@playwright/test';

test('android deep link navigation', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found.');
      test.skip(); return;
  }

  // Test Deep Link: e.g. bizmob.base://test
  // Based on Manifest: <data android:scheme="bizmob.base" />
  const url = '${schemeUrl.includes('://') ? schemeUrl : 'bizmob.base://login'}';
  
  console.log(\`Opening deep link: \${url}\`);
  
  // Simulate opening via Intent
  await device.shell(\`am start -a android.intent.action.VIEW -d "\${url}"\`);
  
  await new Promise(r => setTimeout(r, 3000));
  await device.screenshot({ path: 'android-deeplink.png' });
});`,

    mobile_activity_launch: (activityName: string) => `import { test, _android as android } from '@playwright/test';

test('android specific activity launch', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found. Please connect via ADB.');
      test.skip(); return;
  }

  // NOTE: Activities must be 'exported=true' in AndroidManifest.xml to be launched via ADB!
  // 'IdCardCheckActivity' is NOT exported, so we default to the Main Launcher Activity here.
  // Using User provided App ID: mcnc.dbcs.losapp.sit
  
  const component = '${activityName.includes('/') ? activityName : 'mcnc.dbcs.losapp.sit/com.mcnc.bizmob.base.SlideFragmentActivity'}';
  
  console.log(\`Launching component: \${component}\`);
  
  // Capture output to see permissions errors
  const output = await device.shell(\`am start -n \${component}\`);
  console.log(output.toString());
  
  await new Promise(r => setTimeout(r, 5000));
  await device.screenshot({ path: 'android-activity.png' });
});`,

    mobile_click_text: (textToClick: string) => `import { test, _android as android } from '@playwright/test';

test('android click element by text', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found.');
      test.skip(); return;
  }

  // Handle default "Pixel 6" case by switching to "OK"
  const rawInput = '${textToClick}';
  const targetText = (rawInput === 'Pixel 6' || !rawInput) ? 'OK' : rawInput;
  
  console.log(\`Attempting to find and tap element with text: "\${targetText}"...\`);
  
  try {
      // Use Playwright's selector engine to tap by text
      await device.tap({ text: targetText }, { timeout: 10000 });
      console.log('✅ Tapped successfully!');
  } catch (e) {
      console.log(\`❌ Failed to find text "\${targetText}". Trying UIAutomator dump...\`);
      // Fallback: Dump UI hierarchy to see what's actually visible
      // const dump = await device.shell('uiautomator dump /dev/tty'); // Simplified
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await device.screenshot({ path: 'android-clicked.png' });
});`,

    mobile_launch_and_handle_error: (pkg: string) => `import { test, _android as android } from '@playwright/test';

test('android launch and dismiss error', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found.');
      test.skip(); return;
  }

  const appPackage = '${pkg && pkg !== 'Pixel 6' ? pkg : 'mcnc.dbcs.losapp.sit'}';
  const component = \`\${appPackage}/com.mcnc.bizmob.base.SlideFragmentActivity\`;

  console.log(\`🚀 Launching \${component}...\`);
  await device.shell(\`am start -n \${component}\`);
  
  // Wait for potential error dialog
  console.log('Waiting for app load / error dialog...');
  await new Promise(r => setTimeout(r, 8000));

  // Try to click "OK"
  console.log('Attempting to click "OK"...');
  try {
      await device.tap({ text: 'OK' }, { timeout: 5000 });
      console.log('✅ "OK" button clicked (Error dismissed).');
  } catch(e) {
       console.log('ℹ️ "OK" button not found or not needed.');
  }

  await new Promise(r => setTimeout(r, 2000));
  await device.screenshot({ path: 'launch-and-error.png' });
});`,

    web_security_headers: (url: string) => `import { test, expect } from '@playwright/test';

test('security headers check', async ({ page }) => {
  console.log('Checking security headers for: ${url || 'https://example.com'}');
  const response = await page.goto('${url || 'https://example.com'}');
  
  if (!response) {
      console.log('❌ Only got null response. Page might not have loaded.');
      return;
  }
  
  const headers = response.headers();
  console.log('Headers received:', JSON.stringify(headers, null, 2));

  // 1. Content-Security-Policy (CSP)
  // Helps prevent Cross-Site Scripting (XSS)
  if (headers['content-security-policy']) {
      console.log('✅ CSP is present');
  } else {
       console.log('⚠️ CSP is MISSING');
  }

  // 2. Strict-Transport-Security (HSTS)
  // Enforces HTTPS
  if (headers['strict-transport-security']) {
      console.log('✅ HSTS is present');
  } else {
      console.log('⚠️ HSTS is MISSING');
  }

  // 3. X-Frame-Options
  // Prevents Clickjacking
  if (headers['x-frame-options']) {
       console.log('✅ X-Frame-Options is present');
  } else {
       console.log('⚠️ X-Frame-Options is MISSING');
  }
});`,

    web_security_sqli: (url: string) => `import { test, expect } from '@playwright/test';

test('login form sql injection fuzzing', async ({ page }) => {
  const targetUrl = '${url || 'https://the-internet.herokuapp.com/login'}';
  await page.goto(targetUrl);

  const payloads = [
      "' OR '1'='1",
      "admin' --",
      "' OR 1=1 --",
      "admin' #",
      "' UNION SELECT 1, 'admin', 'password' --"
  ];

  for (const payload of payloads) {
      console.log(\`Testing payload: "\${payload}"\`);
      
      // Attempt to fill common username fields
      await page.fill('input[type="text"], input[name="username"], input[name="email"]', payload);
      await page.fill('input[type="password"]', 'password123'); // Random password
      
      await page.click('button[type="submit"], input[type="submit"]');
      
      await page.waitForTimeout(1000);
      
      // Check for signs of success (bypass) or database errors
      const content = await page.content();
      if (content.includes('Welcome') || content.includes('Dashboard') || content.includes('syntax error')) {
          console.log(\`⚠️ POTENTIAL VULNERABILITY FOUND with payload: \${payload}\`);
      } else {
          console.log('Protected.');
      }
      
      // Reset for next
      await page.goto(targetUrl);
  }
});`,

    mobile_security_root: (pkg: string) => `import { test, _android as android } from '@playwright/test';

test('android root detection bypass check', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found.');
      test.skip(); return;
  }

  const appPackage = '${pkg && pkg !== 'Pixel 6' ? pkg : 'mcnc.dbcs.losapp.sit'}';
  const component = \`\${appPackage}/com.mcnc.bizmob.base.SlideFragmentActivity\`;

  console.log(\`🚀 Launching \${component}...\`);
  await device.shell(\`am start -n \${component}\`);
  
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('🔍 Scanning for Security/Root warnings...');
  
  // Common strings found in banking apps for root detection
  const threats = ['rooted', 'jailbreak', 'security violation', 'unauthorized', 'compromised'];
  
  // Dump hierarchy to check text (since we might not know the exact selector)
  const hierarchy = await device.shell('uiautomator dump /dev/tty').then(b => b.toString());
  
  let found = false;
  for (const threat of threats) {
     if (hierarchy.toLowerCase().includes(threat)) {
         console.log(\`⚠️ FOUND ROOT WARNING CONTAINING: "\${threat}"\`);
         found = true;
         
         // Try to click OK/Close if it exists
         try {
            await device.tap({ text: 'OK' }); 
            console.log('Clicked OK.');
         } catch(e) {}
     }
  }
  
  if (!found) {
      console.log('✅ No obvious root detection warning found (or app crashed/did not load).');
  }
  
  await device.screenshot({ path: 'security-root-check.png' });
});`,

    mobile_webview: (pkg: string) => `import { test, _android as android } from '@playwright/test';

test('android hybrid webview interaction', async () => {
  const devices = await android.devices();
  const device = process.env.DEVICE_MODEL 
      ? devices.find(d => d.serial() === process.env.DEVICE_MODEL) 
      : devices[0];

  if (!device) {
      console.log('❌ No Android device found.');
      test.skip(); return;
  }

  const appPackage = '${pkg && pkg !== 'Pixel 6' ? pkg : 'mcnc.dbcs.losapp.sit'}';
  const component = \`\${appPackage}/com.mcnc.bizmob.base.SlideFragmentActivity\`;

  console.log(\`🚀 Launching \${component}...\`);
  await device.shell(\`am start -n \${component}\`);

  console.log('⏳ Waiting for WebView context and App Load...');
  // Wait longer for full app load
  await new Promise(r => setTimeout(r, 8000));
  
  // Connect to the WebView
  const context = await device.webView({ pkg: appPackage });
  const page = await context.page();
  
  console.log(\`✅ Connected to WebView! [\${await page.title()}] @ \${await page.url()}\`);

  // 1. Handle JavaScript Dialogs (Alerts/Confirms)
  page.on('dialog', async dialog => {
      console.log(\`🔔 JS Dialog detected: "\${dialog.message()}"\`);
      await dialog.accept();
      console.log('✅ Dialog accepted via Event Listener.');
  });

  // 2. Try Clicking "OK" in DOM (Regex for case-insensitivity)
  console.log('Attempting to click "OK" inside WebView DOM...');
  try {
      const okButton = page.locator('text=/OK/i').first(); 
      if (await okButton.isVisible({ timeout: 3000 })) {
           await okButton.click();
           console.log('✅ Clicked "OK" via DOM Selector.');
      } else {
           console.log('⚠️ "OK" not found in DOM. Checking for Native overlay...');
           throw new Error('Not visible in DOM');
      }
  } catch(e) {
      // 3. Fallback: Native Tap (If it's a native Android dialog overlaying WebView)
      try {
          console.log('👉 Trying Native Tap fallback...');
          await device.tap({ text: 'OK' }, { timeout: 5000 });
          console.log('✅ Clicked "OK" via Native Tap.');
      } catch (nativeErr) {
          console.log('❌ Failed to click "OK" via DOM or Native Tap.');
          // Debug: Print simplified DOM
          // console.log('DOM Dump:', await page.content());
      }
  }

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'webview-final.png' });
});`
};
