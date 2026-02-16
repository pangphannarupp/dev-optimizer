# Test Automation Tool Usage Guide

This tool empowers you to generate and execute automated tests for Web, Mobile, and Desktop applications directly from the Dev Optimizer interface, leveraging the power of **Playwright**.

## Prerequisites

Before using this tool, ensure that your environment is set up correctly:

1.  **Node.js**: Ensure Node.js is installed.
2.  **Playwright**: The tool relies on `npx playwright`. If you haven't run Playwright before, you may need to install browsers:
    ```bash
    npx playwright install
    ```

## Features

### 1. Web Testing
Automate interactions with websites.
- **Mode**: Select **Web**.
- **Input**: Enter the target URL (e.g., `https://example.com`).
- **Action**: Click **Generate Script** to create a basic test that visits the page and takes a screenshot.
- **Run**: Click **Run Test** to execute. The screenshot will be saved in the root directory (or temp folder depending on script).

### 2. Mobile Emulation
Test how your site looks on mobile devices.
- **Mode**: Select **Mobile**.
- **Input**: Enter a device name (e.g., `iPhone 12`, `Pixel 5`).
- **Action**: Click **Generate Script**. The script will use Playwright's device emulation.

### 3. Desktop Application Testing
Automate Electron app testing.
- **Mode**: Select **Desktop**.
- **Input**: Enter the absolute path to your Electron application executable (e.g., `/path/to/my-app`).
- **Action**: Click **Generate Script**. This uses Playwright's `_electron` launcher.

## Customizing Scripts

The **Code Editor** allows you to modify the generated script before running it. 
- You can add more complex logic, assertions, or interactions.
- Standard Playwright API is supported.
- Example:
  ```typescript
  await page.click('#submit-button');
  await expect(page.locator('.success')).toBeVisible();
  ```

## Troubleshooting

- **"playwright: command not found"**: Ensure `npx` is in your system PATH.
- **IPC Error**: This tool works best when running Dev Optimizer as an Electron app, not just in the web browser.
