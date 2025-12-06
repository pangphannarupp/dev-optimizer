import { test, expect } from '@playwright/test';

test.describe('Encryption Tool', () => {
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

        // Click on the Encryption/Decryption tab in the sidebar (10th button in the nav)
        const encryptionButton = page.locator('nav button').nth(9); // 0-indexed
        await encryptionButton.waitFor({ state: 'visible', timeout: 15000 });
        await encryptionButton.click();

        // Wait for the Encryption Tool component to be visible
        await page.waitForSelector('textarea[placeholder*="Enter text to encrypt"]', { state: 'visible', timeout: 10000 });
    });

    test('should encrypt text with AES', async ({ page }) => {
        const plaintext = 'Secret Message';
        const secretKey = 'mysecretkey';

        // Fill in the plaintext (first textarea)
        const plaintextArea = page.getByPlaceholder('Enter text to encrypt...');
        await plaintextArea.fill(plaintext);

        // Fill in the secret key (look for input with placeholder)
        const keyInput = page.getByPlaceholder('Enter encryption password');
        await keyInput.first().fill(secretKey);

        // Click Encrypt button (first one)
        const encryptButton = page.getByRole('button', { name: 'Encrypt', exact: true });
        await encryptButton.click();

        // Wait for output to be generated (look for the pre element with encrypted content)
        await page.waitForSelector('pre', { state: 'visible', timeout: 10000 });
        await page.waitForTimeout(500);

        // Verify that encrypted output is generated
        // Find the first pre element that contains the encrypted output
        const outputPre = page.locator('pre').first();
        const outputText = await outputPre.textContent();
        expect(outputText).toBeTruthy();
        expect(outputText!.trim().length).toBeGreaterThan(0);
    });

    test('should encrypt and decrypt text with AES-GCM', async ({ page }) => {
        const plaintext = 'Hello, World!';
        const secretKey = 'mySecretKey12345';

        // Select GCM mode for encryption (first select)
        const cipherModeSelect = page.locator('select').first();
        await cipherModeSelect.selectOption('GCM');

        // Fill in the plaintext
        const plaintextArea = page.getByPlaceholder('Enter text to encrypt...');
        await plaintextArea.fill(plaintext);

        // Fill in the secret key for encryption (first password input)
        const encryptKeyInput = page.getByPlaceholder('Enter encryption password').first();
        await encryptKeyInput.fill(secretKey);

        // Click Encrypt button
        const encryptButton = page.getByRole('button', { name: 'Encrypt', exact: true });
        await encryptButton.click();

        // Wait for encryption to complete
        await page.waitForSelector('pre', { state: 'visible', timeout: 10000 });
        await page.waitForTimeout(1000);

        // Get the encrypted output from the first pre element
        const encryptedOutput = await page.locator('pre').first().textContent();
        expect(encryptedOutput).toBeTruthy();
        expect(encryptedOutput!.trim().length).toBeGreaterThan(0);

        // Now decrypt
        // Fill in the ciphertext in the decryption panel (second textarea)
        const ciphertextArea = page.getByPlaceholder('Enter encrypted text to decrypt...');
        await ciphertextArea.fill(encryptedOutput!.trim());

        // Select GCM mode for decryption (fourth select element - index 3)
        // There are 6 selects total: encrypt cipher(0), encrypt padding(1), encrypt keysize(2),
        // decrypt cipher(3), decrypt padding(4), decrypt keysize(5)
        const decryptCipherModeSelect = page.locator('select').nth(3);
        await decryptCipherModeSelect.selectOption('GCM');

        // Fill in the secret key for decryption (second password input)
        const decryptKeyInput = page.getByPlaceholder('Enter encryption password').nth(1);
        await decryptKeyInput.fill(secretKey);

        // Click Decrypt button
        const decryptButton = page.getByRole('button', { name: 'Decrypt', exact: true });
        await decryptButton.click();

        // Wait for decryption to complete
        await page.waitForTimeout(1000);

        // Verify the decrypted output matches the original plaintext
        // The second pre element should contain the decrypted text
        const decryptedOutput = await page.locator('pre').nth(1).textContent();
        expect(decryptedOutput!.trim()).toBe(plaintext);
    });
});
