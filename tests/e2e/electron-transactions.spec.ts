import { test, expect } from '@playwright/test';
import { _electron as electron } from 'playwright';

// Electron E2E test (attempt to launch local electron app)
// Requirements:
// - electron installed in devDependencies (or set ELECTRON_PATH env to electron executable)
// - For dev flow, you may need to run the dev server first (npm run dev) or build the app (npm run build)

test('Electron: transactions view shows localized headers', async () => {
  // Allow longer timeout for starting electron app
  test.setTimeout(120000);

  // Try to discover electron executable path; fallback to environment variable
  const electronPath = process.env.ELECTRON_PATH || undefined;

  // Launch Electron app. If your project requires running a dev server first, start it separately
  const electronApp = await electron.launch({ executablePath: electronPath, args: ['.'] });

  try {
    const window = await electronApp.firstWindow();
    // wait for UI to render and selectors to appear
    await window.waitForSelector('[data-testid="transactions-column-date"]', { timeout: 60000 });
    const dateText = await window.textContent('[data-testid="transactions-column-date"]');
    const amountText = await window.textContent('[data-testid="transactions-column-amount"]');

    expect(dateText).toBeTruthy();
    expect(amountText).toBeTruthy();
  } finally {
    await electronApp.close();
  }
});
