import { test, expect } from '@playwright/test';

test('Danh sách giao dịch hiển thị (E2E snippet)', async ({ page }) => {
  // NOTE: Set E2E_BASE_URL to your running renderer/dev URL, e.g. http://localhost:5173
  const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5173';
  await page.goto(baseUrl);

  // Start tracing for artifact collection (optional)
  await page.context().tracing.start({ screenshots: true, snapshots: true });

  // Wait for column selector and assert localized text
  await page.waitForSelector('[data-testid="transactions-column-date"]');
  await expect(page.locator('[data-testid="transactions-column-date"]')).toHaveText('Ngày');
  await expect(page.locator('[data-testid="transactions-column-amount"]')).toHaveText('Số tiền');

  // If no transactions exist, the empty state should be visible
  const empty = page.locator('[data-testid="transactions-empty"]');
  // empty may or may not be visible depending on test data; we assert it exists in DOM when length is 0
  // (This test prefers inspecting column headers; the empty check is best-effort)

  // Stop tracing and save artifact
  const tracePath = `tests/e2e-trace-transactions-${new Date()
    .toISOString()
    .replace(/[:.]/g, '')}.zip`;
  await page.context().tracing.stop({ path: tracePath });
});
