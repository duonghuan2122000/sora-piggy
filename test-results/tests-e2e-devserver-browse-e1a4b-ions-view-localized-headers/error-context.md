# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\devserver-browser.spec.ts >> Dev server + Browser: transactions view localized headers
- Location: tests\e2e\devserver-browser.spec.ts:23:5

# Error details

```
TimeoutError: page.waitForSelector: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="transactions-column-date"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - generic [ref=e10]: Sora Piggy
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: Tóm tắt
          - generic [ref=e14]:
            - link "Trang chủ" [ref=e15] [cursor=pointer]:
              - /url: /
              - generic [ref=e16]:
                - img [ref=e17]
                - generic [ref=e19]: Trang chủ
            - link "Giao dịch" [ref=e20] [cursor=pointer]:
              - /url: /transactions
              - generic [ref=e21]:
                - img [ref=e22]
                - generic [ref=e24]: Giao dịch
        - generic [ref=e25]:
          - generic [ref=e26]: Quản lý
          - generic [ref=e27]:
            - link "Ngân sách" [ref=e28] [cursor=pointer]:
              - /url: /budget
              - generic [ref=e29]:
                - img [ref=e30]
                - generic [ref=e32]: Ngân sách
            - link "Mục tiêu" [ref=e33] [cursor=pointer]:
              - /url: /targets
              - generic [ref=e34]:
                - img [ref=e35]
                - generic [ref=e37]: Mục tiêu
            - link "Báo cáo" [ref=e38] [cursor=pointer]:
              - /url: /reports
              - generic [ref=e39]:
                - img [ref=e40]
                - generic [ref=e42]: Báo cáo
        - generic [ref=e43]:
          - generic [ref=e44]: Tài khoản
          - generic [ref=e45]:
            - link "Tiền mặt" [ref=e46] [cursor=pointer]:
              - /url: /accounts/cash
              - generic [ref=e47]:
                - img [ref=e48]
                - generic [ref=e50]: Tiền mặt
            - link "Ngân hàng" [ref=e51] [cursor=pointer]:
              - /url: /accounts/bank
              - generic [ref=e52]:
                - img [ref=e53]
                - generic [ref=e55]: Ngân hàng
  - generic [ref=e56]:
    - generic [ref=e58]:
      - heading "Home" [level=1] [ref=e60]
      - generic [ref=e61]:
        - generic [ref=e64] [cursor=pointer]:
          - generic:
            - combobox [ref=e66]
            - generic [ref=e67]: Tiếng Việt
          - img [ref=e70]
        - button "Thêm" [ref=e72] [cursor=pointer]:
          - img [ref=e74]
          - generic [ref=e76]: Thêm
    - main [ref=e77]:
      - generic [ref=e79]:
        - generic [ref=e81]: Home
        - generic [ref=e82]:
          - paragraph [ref=e83]: Chào mừng bạn đến với ứng dụng!
          - button "Trang chủ" [ref=e84] [cursor=pointer]:
            - generic [ref=e85]:
              - img [ref=e86]
              - text: Trang chủ
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { spawn, ChildProcess } from 'child_process';
  3  | // Use global fetch (Node 18+). If not available, please install node-fetch as devDependency.
  4  | const fetchFn = (globalThis as any).fetch || undefined;
  5  | 
  6  | const DEFAULT_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';
  7  | 
  8  | async function waitForUrl(url: string, timeoutMs = 60000): Promise<void> {
  9  |   const start = Date.now();
  10 |   while (Date.now() - start < timeoutMs) {
  11 |     try {
  12 |       if (!fetchFn) throw new Error('fetch not available in this node runtime');
  13 |       const res = await fetchFn(url, { method: 'GET' });
  14 |       if (res.ok) return;
  15 |     } catch (e) {
  16 |       // ignore
  17 |     }
  18 |     await new Promise((r) => setTimeout(r, 500));
  19 |   }
  20 |   throw new Error(`Timed out waiting for ${url}`);
  21 | }
  22 | 
  23 | test('Dev server + Browser: transactions view localized headers', async ({ page }) => {
  24 |   test.setTimeout(180000);
  25 | 
  26 |   // Start dev server (electron-vite dev) which also starts the renderer dev server
  27 |   const devProc: ChildProcess = spawn('npm', ['run', 'dev'], { shell: true, env: process.env });
  28 | 
  29 |   // Ensure we kill the process in any case
  30 |   try {
  31 |     await waitForUrl(DEFAULT_URL, 90000);
  32 | 
  33 |     await page.goto(DEFAULT_URL);
> 34 |     await page.waitForSelector('[data-testid="transactions-column-date"]', { timeout: 60000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 60000ms exceeded.
  35 |     await expect(page.locator('[data-testid="transactions-column-date"]')).toHaveText('Ngày');
  36 |     await expect(page.locator('[data-testid="transactions-column-amount"]')).toHaveText('Số tiền');
  37 |   } finally {
  38 |     if (!devProc.killed) {
  39 |       try {
  40 |         devProc.kill();
  41 |       } catch (e) {
  42 |         // ignore
  43 |       }
  44 |     }
  45 |   }
  46 | });
  47 | 
```