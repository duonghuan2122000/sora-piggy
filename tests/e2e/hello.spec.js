const { test, expect } = require('@playwright/test');

test('sanity check', async ({ page }) => {
  await page.goto(process.env.E2E_BASE_URL || 'http://localhost:5173');
  await page.waitForTimeout(1000);
  expect(true).toBe(true);
});
