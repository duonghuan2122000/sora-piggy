import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
// Use global fetch (Node 18+). If not available, please install node-fetch as devDependency.
const fetchFn = (globalThis as any).fetch || undefined;

const DEFAULT_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';

async function waitForUrl(url: string, timeoutMs = 60000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if (!fetchFn) throw new Error('fetch not available in this node runtime');
      const res = await fetchFn(url, { method: 'GET' });
      if (res.ok) return;
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

test('Dev server + Browser: transactions view localized headers', async ({ page }) => {
  test.setTimeout(180000);

  // Start dev server (electron-vite dev) which also starts the renderer dev server
  const devProc: ChildProcess = spawn('npm', ['run', 'dev'], { shell: true, env: process.env });

  // Ensure we kill the process in any case
  try {
    await waitForUrl(DEFAULT_URL, 90000);

    await page.goto(DEFAULT_URL);
    await page.waitForSelector('[data-testid="transactions-column-date"]', { timeout: 60000 });
    await expect(page.locator('[data-testid="transactions-column-date"]')).toHaveText('Ngày');
    await expect(page.locator('[data-testid="transactions-column-amount"]')).toHaveText('Số tiền');
  } finally {
    if (!devProc.killed) {
      try {
        devProc.kill();
      } catch (e) {
        // ignore
      }
    }
  }
});
