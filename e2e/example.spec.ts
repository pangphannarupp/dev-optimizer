import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // Adjust this based on your actual page title
    await expect(page).toHaveTitle(/Image Optimizer/);
});
