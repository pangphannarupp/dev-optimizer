import { test, _electron as electron } from '@playwright/test';

test('launch app', async () => {
    const electronApp = await electron.launch({ args: ['/path/to/app'] });
    const window = await electronApp.firstWindow();
    await window.screenshot({ path: 'app-screenshot.png' });
    await electronApp.close();
}); 