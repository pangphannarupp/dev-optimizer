import { test, expect } from '@playwright/test';

test.describe('SHA Generator', () => {
    test.beforeEach(async ({ page }) => {
        // Set language to English before loading the page
        await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
        await page.evaluate(() => {
            localStorage.setItem('i18nextLng', 'en');
        });
        await page.reload({ waitUntil: 'networkidle', timeout: 60000 });

        // Wait for the page to fully load
        await page.waitForLoadState('networkidle');

        // Wait for the sidebar to be visible
        await page.waitForSelector('aside', { state: 'visible', timeout: 15000 });

        // Click on the SHA Generator tab in the sidebar (11th button in the nav)
        const shaButton = page.locator('nav button').nth(10); // 0-indexed, so 10 is the 11th button
        await shaButton.waitFor({ state: 'visible', timeout: 15000 });
        await shaButton.click();

        // Wait for the SHA Generator component to be visible
        await page.waitForSelector('textarea[placeholder*="Enter text to hash"]', { state: 'visible', timeout: 10000 });
    });

    test('should generate hashes for input text', async ({ page }) => {
        const input = 'hello';

        // Find the input textarea and type 'hello'
        const textarea = page.getByPlaceholder('Enter text to hash...');
        await textarea.fill(input);

        // Wait a bit for hashes to generate
        await page.waitForTimeout(500);

        // Verify MD5 hash
        await expect(page.locator('text=MD5').first()).toBeVisible();
        await expect(page.locator('text=5d41402abc4b2a76b9719d911017c592')).toBeVisible();

        // Verify SHA-1 hash
        await expect(page.locator('text=SHA-1').first()).toBeVisible();
        await expect(page.locator('text=aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d')).toBeVisible();

        // Verify SHA-256 hash
        await expect(page.locator('text=SHA-256').first()).toBeVisible();
        await expect(page.locator('text=2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')).toBeVisible();
    });

    test('should copy hash to clipboard', async ({ page }) => {
        const input = 'test';
        const textarea = page.getByPlaceholder('Enter text to hash...');
        await textarea.fill(input);

        // Wait for hashes to generate
        await page.waitForTimeout(500);

        // Grant clipboard permissions (WebKit doesn't support 'clipboard-write', only 'clipboard-read')
        try {
            await page.context().grantPermissions(['clipboard-read']);
        } catch (e) {
            // Some browsers may not support clipboard permissions
            console.log('Clipboard permissions not supported:', e);
        }

        // Click the first copy button (MD5)
        const copyButton = page.locator('button:has-text("Copy")').first();
        await copyButton.click();

        // Verify button text changes to "Copied"
        await expect(page.locator('button:has-text("Copied")').first()).toBeVisible({ timeout: 3000 });

        // Verify clipboard content
        const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
        expect(clipboardContent).toBe('098f6bcd4621d373cade4e832627b4f6'); // MD5 of 'test'
    });
});
