import { test, expect } from '@playwright/test';

// E2E visual smoke test: open main transaction view and check primary-colored button exists

test.describe('Visual theme e2e', () => {
  test('primary button uses Ant default color', async ({ page }) => {
    // This test assumes the dev server is running at http://localhost:3000
    await page.goto('http://localhost:3000');

    // Wait for app to load
    await page.waitForSelector('.sora-add-transaction-view, .sora-card', { timeout: 10000 });

    // Find primary buttons and check computed color
    const primaryBtn = await page.locator('.ant-btn-primary').first();
    await expect(primaryBtn).toBeVisible();

    const color = await primaryBtn.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('background-color');
    });

    // Ant default #1890ff in rgb is 24, 144, 255
    expect(color.replace(/\s/g, '')).toContain('rgb(24,144,255)');
  });
});
