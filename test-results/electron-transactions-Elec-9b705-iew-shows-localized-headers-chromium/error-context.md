# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: electron-transactions.spec.ts >> Electron: transactions view shows localized headers
- Location: tests\e2e\electron-transactions.spec.ts:9:5

# Error details

```
TimeoutError: page.waitForSelector: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="transactions-column-date"]') to be visible

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { _electron as electron } from 'playwright';
  3  |
  4  | // Electron E2E test (attempt to launch local electron app)
  5  | // Requirements:
  6  | // - electron installed in devDependencies (or set ELECTRON_PATH env to electron executable)
  7  | // - For dev flow, you may need to run the dev server first (npm run dev) or build the app (npm run build)
  8  |
  9  | test('Electron: transactions view shows localized headers', async () => {
  10 |   // Allow longer timeout for starting electron app
  11 |   test.setTimeout(120000);
  12 |
  13 |   // Try to discover electron executable path; fallback to environment variable
  14 |   const electronPath = process.env.ELECTRON_PATH || undefined;
  15 |
  16 |   // Launch Electron app. If your project requires running a dev server first, start it separately
  17 |   const electronApp = await electron.launch({ executablePath: electronPath, args: ['.'] });
  18 |
  19 |   try {
  20 |     const window = await electronApp.firstWindow();
  21 |     // wait for UI to render and selectors to appear
> 22 |     await window.waitForSelector('[data-testid="transactions-column-date"]', { timeout: 60000 });
     |                  ^ TimeoutError: page.waitForSelector: Timeout 60000ms exceeded.
  23 |     const dateText = await window.textContent('[data-testid="transactions-column-date"]');
  24 |     const amountText = await window.textContent('[data-testid="transactions-column-amount"]');
  25 |
  26 |     expect(dateText).toBeTruthy();
  27 |     expect(amountText).toBeTruthy();
  28 |   } finally {
  29 |     await electronApp.close();
  30 |   }
  31 | });
  32 |
```
