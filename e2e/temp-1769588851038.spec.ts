import { test, _electron as electron } from '@playwright/test';

test('launch electron app', async () => {
    // Launch app with path
    const electronApp = await electron.launch({ args: ['/Applications/Calculator.app'] });
    
    // Get first window
    const window = await electronApp.firstWindow();
    console.log(await window.title());
    
    await window.screenshot({ path: 'desktop-app.png' });
    await electronApp.close();
}); 