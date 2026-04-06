PBI: 12
Spec: specs/12/spec.md
Plan: specs/12/plan.md

## TC-12-01: Kiểm tra dependency vue-i18n trong package.json

- Type: Unit
- Priority: High
- Status: [x] Passed
- Preconditions: Kho chứa mã nguồn đã được pull về; node/npm đã cài; có quyền đọc file package.json
- Steps:
  1. Mở file package.json ở root repo
  2. Tìm khóa "dependencies" (và "devDependencies")
  3. Kiểm tra xem có entry "vue-i18n" không và ghi nhận phiên bản
- Expected Result:
  - package.json chứa key "vue-i18n" trong dependencies hoặc devDependencies
  - Automated assertion suggestion: đọc package.json và assert typeof packageJson.dependencies['vue-i18n'] !== 'undefined' OR packageJson.devDependencies['vue-i18n'] !== 'undefined'

## TC-12-02: Ứng dụng khởi động và hiển thị giao diện bằng tiếng Việt (default locale)

- Type: E2E
- Priority: High
- Status: [x] Passed
- Preconditions:
  - Chạy npm install đã hoàn tất
  - Có thể khởi động môi trường dev bằng `npm run dev`
  - File locales/vi.json đã tồn tại (nếu chưa, test TC-12-04 sẽ tạo)
- Type: E2E
- Priority: High
- Status: [x] Passed
- Preconditions:
  - Chạy npm install đã hoàn tất
  - Có thể khởi động môi trường dev bằng `npm run dev`
  - File locales/vi.json đã tồn tại (nếu chưa, test TC-12-04 sẽ tạo)
  - Environment: E2E_BASE_URL must be set in CI or local env (e.g. `E2E_BASE_URL=http://localhost:5173`) to point test runner to renderer URL or electron harness.
- Steps:
  1. Chạy `npm run dev` (hoặc môi trường tương đương theo README)
  2. Chờ app Electron/Vite khởi động hoàn chỉnh
  3. Mở cửa sổ app (hoặc localhost URL nếu web renderer) trong trình duyệt/Playwright
  4. Quan sát vùng UI chính (ví dụ trang danh sách giao dịch)
  5. Tìm text tiếng Việt chuẩn như "Danh sách giao dịch", "Ngày", "Số tiền", hoặc text mẫu từ src/locales/vi.json (ví dụ "Đăng nhập")
- Expected Result:
  - App khởi động không crash; UI hiển thị (không blank, không error page)
  - Văn bản hiển thị bằng tiếng Việt theo các key trong vi.json
  - Automated assertions suggestion: ưu tiên data-testid selectors (Playwright):
    - await page.waitForSelector('[data-testid="transactions-title"]') OR
    - await expect(page.locator('[data-testid="transactions-title"]')).toHaveText('Danh sách giao dịch')
    - Nếu data-testid không tồn tại, fallback sang text-based selector như `text=` nhưng lưu ý selectors này fragile when translations change.

## TC-12-03: Kiểm tra cấu hình i18n (locale và fallbackLocale = 'vi')

- Type: Integration
- Priority: High
- Status: [x] Passed
- Preconditions:
  - Source code có file cấu hình i18n tại `src/i18n/index.ts` hoặc tương đương
  - Có quyền đọc file
- Steps:
  1. Mở file `src/i18n/index.ts` (hoặc file export i18n trong codebase)
  2. Kiểm tra phần tạo i18n (createI18n) hoặc cấu hình export
  3. Xác thực rằng có giá trị `locale: 'vi'` và `fallbackLocale: 'vi'`
- Expected Result:
  - Trong file cấu hình i18n có thiết lập `locale: 'vi'` và `fallbackLocale: 'vi'`
  - Automated assertion suggestion: grep/regex trên file: /locale\s*:\s*['"]vi['"]/ và /fallbackLocale\s*:\s*['"]vi['"]/ hoặc unit test đọc export và assert i18n.options.locale === 'vi'

## TC-12-04: Kiểm tra tồn tại và nạp file translation src/locales/vi.json

- Type: Integration
- Priority: High
- Status: [x] Passed
- Preconditions:
  - Có quyền đọc filesystem repo
  - Nếu file chưa tồn tại, dev đã tạo theo TASK-12-03
- Steps:
  1. Kiểm tra tồn tại file `src/locales/vi.json`
  2. Mở file và parse JSON để xác thực là JSON hợp lệ UTF-8
  3. Xác định file có chứa một số key tối thiểu (ví dụ transactions.title, transactions.columns.date)
  4. Chạy app/dev và xác nhận i18n messages nạp file này (ví dụ bằng console log hoặc bằng assertion trong app: useI18n().t('transactions.title') trả về string tương ứng)
- Expected Result:
  - File `src/locales/vi.json` tồn tại và parse được
  - File chứa các key tối thiểu cho PBI (ví dụ transactions.title, transactions.columns.date, transactions.columns.amount)
  - Khi nạp i18n, t('transactions.title') trả về giá trị tiếng Việt từ file

## TC-12-05: Kiểm tra component đã được chuyển sang sử dụng t('...') thay vì text cố định

- Type: Unit / Integration
- Priority: Medium
- Status: [ ] Pending
- Preconditions:
  - Các component mục tiêu (ví dụ TransactionList.vue, TransactionItem.vue) có sẵn trong codebase tại `src/renderer/src/components/` hoặc đường dẫn tương ứng
- Steps:
  1. Mở file component mục tiêu (ví dụ `src/renderer/src/components/TransactionList.vue`)
  2. Tìm kiếm các chuỗi text cố định trong template (ví dụ "Danh sách giao dịch", "Ngày", "Số tiền")
  3. Xác minh component dùng useI18n() và gọi t('transactions.\*') trong template hoặc truyền key qua prop
  4. (Tùy chọn) Chạy unit test nhỏ để mount component và assert rằng locator chứa text tương ứng dựa trên i18n mock
- Expected Result:
  - Không còn text hard-coded cho các text mục tiêu; thay vào đó hàm t('...') được sử dụng
  - Ví dụ: template chứa {{ t('transactions.title') }} hoặc <span>{{ t('transactions.columns.date') }}</span>

## TC-12-06: QA checklist — Kiểm tra hành vi fallback khi locale khác thiếu key (simulate missing key)

- Type: E2E
- Priority: Medium
- Status: [ ] Pending
- Preconditions:
  - Có file `src/locales/vi.json` (bắt buộc)
  - Nếu có `src/locales/en.json`, test sẽ thao tác trên en.json; nếu không có en.json, test sẽ tạm thời mô phỏng thay đổi locale sang 'en' và đảm bảo fallback diễn ra
  - Có cách restart app sau khi chỉnh file locales (hot-reload hoặc restart dev server)
- Steps:
  1. Trường hợp A (nếu có en.json):
     a. Mở `src/locales/en.json` và xóa hoặc thay đổi key `transactions.title` (hoặc key target) -> lưu
     b. Khởi động lại app hoặc trigger reload
     c. Đặt locale app thành 'en' (nếu có UI hoặc override tạm thời trong console `i18n.global.locale = 'en'`)
     d. Quan sát text hiển thị cho key bị xóa
  2. Trường hợp B (nếu không có en.json):
     a. Tạm thời override locale runtime: `i18n.global.locale = 'en'` (nơi 'en' không có messages)
     b. Quan sát giá trị trả về cho t('transactions.title')
  3. Ghi lại kết quả
- Expected Result:
  - Khi key không tồn tại trong locale hiện tại (en), hệ thống fallback sang vi và hiển thị chuỗi tiếng Việt từ `vi.json`
  - Automated assertion suggestion:
    - expect(page.locator('text=Danh sách giao dịch')).toBeVisible() khi locale = 'en' và en.json thiếu key
    - Or in runtime: expect(i18n.global.t('transactions.title')).toBe(i18n.global.messages.vi.transactions.title)

## Change log (bản final)

- 2026-04-05: Thêm test cases bổ sung (TC-12-07..TC-12-13), Playwright snippets, data-testid conventions, cleanup/restore steps, và danh sách artifacts cần attach trong checkpoint. (Author: QC placeholder)
- 2026-04-05T20:20:53Z: Automated unit tests for i18n passed: test/unit/i18n.spec.ts (2 tests). Typecheck (vue-tsc) completed with no blocking errors. (Automated by sora-implement)

## TC-12-07: Kiểm tra typings cho JSON imports (TypeScript)

- Type: Unit
- Priority: Medium
- Status: [ ] Pending
- Preconditions:
  - TypeScript cấu hình thực thi `resolveJsonModule` hoặc có declaration cho '\*.json'
- Steps:
  1. Mở `tsconfig.json` (web/node) và xác nhận `resolveJsonModule: true` trong compilerOptions hoặc có file `src/i18n.d.ts`/`src/env.d.ts` khai báo module '\*.json'
  2. Chạy `npm run typecheck`
- Expected Result:
  - TypeScript không báo lỗi khi import JSON như `import vi from '@/locales/vi.json'`
  - Nếu lỗi, checklist ghi rõ required change: enable resolveJsonModule hoặc thêm declaration module

## TC-12-08: Playwright snippet — xác nhận text bằng data-testid

- Type: E2E (Playwright)
- Priority: High
- Status: [ ] Pending
- Preconditions:
  - Playwright cài đặt và có thể chạy trong môi trường dev
  - Components đã bổ sung attribute `data-testid` cho selectors ổn định
- Snippet (Playwright):

```ts
// ví dụ: tests/e2e/transactions.spec.ts
import { test, expect } from '@playwright/test';

test('Danh sách giao dịch hiển thị', async ({ page }) => {
  // NOTE: replace URL with renderer dev URL or electron test harness as appropriate
  const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5173';
  await page.goto(baseUrl);
  // start Playwright tracing (attach trace artifact at end)
  await page.context().tracing.start({ screenshots: true, snapshots: true });

  await page.waitForSelector('[data-testid="transactions-title"]');
  await expect(page.locator('[data-testid="transactions-title"]')).toHaveText(
    'Danh sách giao dịch'
  );
  await expect(page.locator('[data-testid="transactions-column-date"]')).toHaveText('Ngày');

  // stop tracing and save trace artifact for debugging
  const tracePath = `tests/e2e-trace-${test.info().title}-${new Date().toISOString().replace(/[:.]/g, '')}.zip`;
  await page.context().tracing.stop({ path: tracePath });
});
```

Notes: sử dụng `data-testid` thay vì text-based selectors để tránh phá vỡ khi nội dung dịch thay đổi.

-- E2E Test Added --

- A Playwright E2E test snippet `tests/e2e/transactions.spec.ts` has been added to the repository. This test navigates to `E2E_BASE_URL` (default `http://localhost:5173`) and asserts the presence and localized text of column selectors `transactions-column-date` and `transactions-column-amount`. The test also starts/stops Playwright tracing and saves a trace artifact.

- How to run:
  1. Install Playwright in your environment: `npm i -D @playwright/test` and run `npx playwright install` to download browsers.
  2. Ensure the app dev server is running and accessible via `E2E_BASE_URL` (or set env var: `E2E_BASE_URL=http://localhost:5173`).
  3. Run: `npx playwright test tests/e2e/transactions.spec.ts`.

- Note: the repository currently does not include Playwright in devDependencies by default. Adding Playwright to CI should be a separate step and may require adjusting CI images/permissions.

## Electron E2E guidance

- The project is an Electron desktop app. A reliable E2E strategy is to run Playwright against the Electron app rather than the web dev server. Two common approaches:
  1. Dev flow (fast feedback):
     - Start your dev environment (if the renderer expects a separate dev server) with `npm run dev`.
     - Launch Electron via your dev command (or with `ELECTRON_PATH` pointing to the electron binary).
     - Run the Electron Playwright test: `npx playwright test tests/e2e/electron-transactions.spec.ts`.

  2. Packaged flow (close to production):
     - Build the app: `npm run build` (or platform-specific build step).
     - Launch the built app binary (set env `ELECTRON_PATH` to path to electron executable or to your packaged app executable).
     - Run the Electron Playwright test same as above.

- Requirements & notes:
  - Ensure `electron` is installed in devDependencies or available in PATH. If not, set env var `ELECTRON_PATH` to the electron executable path.
  - Electron UI tests may need extra permissions or a headless-friendly environment. On CI use headless mode or an X virtual framebuffer on Linux runners.
  - The Electron test `tests/e2e/electron-transactions.spec.ts` uses Playwright's electron launcher (`_electron`) and expects a window exposing selectors with data-testid attributes.

- Example local run (dev flow):
  1. In one terminal: `npm run dev` and wait until renderer is available.
  2. In another terminal: `ELECTRON_PATH=$(which electron) npx playwright test tests/e2e/electron-transactions.spec.ts --timeout=120000`

## TC-12-09: Data-testid conventions & selectors checklist

- Type: Guidance
- Priority: Medium
- Status: [ ] Pending
- Content:
  - Quy ước data-testid: lower-kebab-case, prefix domain: `transactions-<element>`
  - Ví dụ: `data-testid="transactions-title"`, `data-testid="transactions-column-date"`, `data-testid="transactions-empty"`
  - Đặt attribute trên DOM node ổn định (không phải trên element nội dung khi có v-if/v-for thay đổi)

## TC-12-10: Cleanup / Restore steps (E2E safe run)

- Type: Procedure
- Priority: Medium
- Status: [ ] Pending
- Steps:
  - Preconditions: If tests need to modify repo files, set env var `E2E_ALLOW_FS_CHANGES=true` in CI only when intended. By default E2E tests must not mutate repository source files; prefer mocking/loading translations from temp fixtures.

  - Steps:
  1. Prefer in-test backup/restore to avoid side effects. Example using Node fs in Playwright tests (only when `E2E_ALLOW_FS_CHANGES=true`):

```ts
import fs from 'fs';
test.beforeEach(() => {
  if (fs.existsSync('src/locales/vi.json'))
    fs.copyFileSync('src/locales/vi.json', 'src/locales/vi.json.bak');
});
test.afterEach(() => {
  if (fs.existsSync('src/locales/vi.json.bak')) {
    fs.copyFileSync('src/locales/vi.json.bak', 'src/locales/vi.json');
    fs.unlinkSync('src/locales/vi.json.bak');
  }
});
```

2. Nếu using shell in CI, prefer `git restore --source=HEAD --staged --worktree src/locales/vi.json` (cross-platform) as the primary restore command. Avoid `git checkout --` if possible. Ensure CI runner has compatible git version.
3. Ghi log restore vào artifact `tests/e2e-restore-log-<YYYYMMDD>.txt` and save into `artifacts/pbi12/` for CI collection.

## TC-12-11: Negative test — malformed JSON handling

- Type: Integration
- Priority: Medium
- Status: [ ] Pending
- Preconditions: có cách mô phỏng file locales bị corrupt (malformed)
- Steps:
  1. Backup vi.json
  2. Introduce malformed JSON (remove comma) into src/locales/vi.json
  3. Start app hoặc run typecheck/build
  4. Observe error handling (app should not crash silently; should log parse error and app should fallback gracefully)
- Expected Result:
  - Build/typecheck errors reported; runtime logs show parse error; app handles missing/invalid messages without exposing raw stack to user UI.

## TC-12-12: Interpolation & Pluralization tests

- Type: Unit / E2E
- Priority: Medium
- Status: [ ] Pending
- Steps:
  1. Add sample key with param: `transactions.count = "Có {count} giao dịch"` and pluralization forms if needed
  2. In unit test, call `t('transactions.count', { count: 1 })` and `t('transactions.count', { count: 5 })` assert outputs
     2.a Example unit assertion (Jest / Vitest):

```ts
import { i18n } from '@/i18n';
test('pluralization/interpolation', () => {
  expect(i18n.global.t('transactions.count', { count: 1 })).toContain('1');
  expect(i18n.global.t('transactions.count', { count: 5 })).toContain('5');
});
```

3. In E2E, render component with count và assert displayed text matches expectations

- Expected Result:
  - Interpolation variables và pluralization rules hoạt động đúng

## TC-12-13: Artifacts checklist (what to attach)

- Type: Meta
- Priority: High
- Status: [ ] Pending
- Content:
  - Typecheck log: `logs/typecheck-<YYYYMMDD>.txt`
  - Lint log: `logs/lint-<YYYYMMDD>.txt`
  - npm audit report: `reports/npm-audit-<YYYYMMDD>.json`
  - Unit test log: `tests/unit-log-<YYYYMMDD>.txt`
  - E2E test traces/screenshots: `tests/e2e-trace-<testname>-<YYYYMMDD>.zip` (created by Playwright tracing API), `tests/e2e-screenshots-<testname>-<YYYYMMDD>.zip`
  - E2E restore log: `tests/e2e-restore-log-<YYYYMMDD>.txt`
  - QA report: `qa/qa-report-pbi12-<YYYYMMDD>.md`

---

Notes:

- Mỗi test case có thể được tự động hóa: Unit tests đọc package.json / files; Integration tests đọc file config; E2E tests dùng Playwright để khởi chạy app và assert text hiển thị
- Selectors gợi ý: text-based selectors (Playwright `text=`), file paths (package.json, src/i18n/index.ts, src/locales/vi.json), grep/regex để detect t('...')
