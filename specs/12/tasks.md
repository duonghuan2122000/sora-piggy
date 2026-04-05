PBI: 12
Plan: specs/12/plan.md

# Tasks for PBI 12 — i18n (Quốc tế hóa)

## Change log (bản final)

- 2026-04-05: Bổ sung subtasks thiếu, thêm Checkpoint yêu cầu artifacts (typecheck, lint, npm-audit, unit/e2e logs, e2e traces), thêm hướng dẫn typing cho JSON imports và checkpoints CI. (Author: Tech-Lead placeholder)

## Task TASK-12-01: Kiểm tra dependency vue-i18n

- Status: [ ] Todo
- Priority: High
- Depends on: []
- Description: Kiểm tra package.json để xác nhận presence và version của `vue-i18n`. Nếu version không tương thích (không phải v9.x), báo ngay để xử lý. Ghi lại kết quả kiểm tra (version) trong checkpoint.
- Acceptance: Xác nhận file package.json chứa `vue-i18n` với semver matching `>=9.0.0 <10.0.0` (ví dụ `^9.0.0`). Nếu version không thỏa, tạo issue/PR đề xuất nâng cấp hoặc document constraint.
- Checkpoint:
  - Attach output of `node -e "console.log(require('./package.json').dependencies['vue-i18n'] || require('./package.json').devDependencies['vue-i18n'])"` into `reports/vue-i18n-version-<YYYYMMDD>.txt`.
- Checkpoint:

## Task TASK-12-02: Tạo/Cập nhật module i18n (core)

- Status: [ ] Todo
- Priority: High
- Depends on: [TASK-12-01]
- Description: Thêm file `src/i18n/index.ts` theo mẫu spec (legacy:false, composition API), export i18n instance. Tích hợp i18n vào app bằng cách update `src/renderer/src/main.ts` (app.use(i18n)).
- Acceptance: `src/i18n/index.ts` tồn tại và export default i18n; `main.ts` gọi `app.use(i18n)`; cấu hình `locale: 'vi'` và `fallbackLocale: 'vi'`.
- Checkpoint:
  - Automated unit acceptance: create `tests/unit/i18n.spec.ts` that imports i18n and asserts `i18n.global.locale === 'vi'` and `i18n.global.fallbackLocale === 'vi'`. Attach `tests/unit-log-<YYYYMMDD>.txt`.

### Subtask TASK-12-02-1: Tạo file src/i18n/index.ts

- Status: [ ] Todo
- Priority: High
- Depends on: [TASK-12-01]
- Description: Tạo nội dung module i18n, import messages từ locales, export default createI18n({ legacy:false, locale:'vi', fallbackLocale:'vi', messages })
- Acceptance: File compile, export i18n instance.
- Checkpoint:

### Subtask TASK-12-02-2: Update src/renderer/src/main.ts để mount i18n

- Status: [ ] Todo
- Priority: High
- Depends on: [TASK-12-02-1]
- Description: Import i18n và gọi `app.use(i18n)` trước khi mount app. Thêm types nếu cần.
- Acceptance: App khởi động mà không lỗi liên quan đến i18n; linter/typecheck pass cho main.ts.
- Checkpoint:

## Task TASK-12-03: Tạo folder locales và src/locales/vi.json

- Status: [ ] Todo
- Priority: High
- Depends on: [TASK-12-02]
- Description: Tạo `src/locales/vi.json` với cấu trúc tối thiểu cho transactions (title, empty, columns.date, columns.amount, actions...). Đảm bảo lưu file UTF-8.
- Acceptance: `src/locales/vi.json` tồn tại, JSON hợp lệ và được import bởi `src/i18n/index.ts`.
- Checkpoint:

### Subtask TASK-12-03-1: Khởi tạo nội dung translations tối thiểu

- Status: [ ] Todo
- Priority: High
- Depends on: [TASK-12-02-1]
- Description: Viết nội dung JSON cho khóa `transactions` theo spec (title, empty, columns.date, columns.amount, actions).
- Acceptance: JSON có các key bắt buộc, encoding UTF-8.
- Checkpoint:

## Task TASK-12-04: Chuẩn hóa key và cập nhật component giao dịch

- Status: [ ] Todo
- Priority: High
- Depends on: [TASK-12-03]
- Description: Thay tất cả text hard-coded trong các component liên quan đến danh sách giao dịch bằng `t('transactions.*')`. Các file target chính: `src/renderer/src/components/TransactionList.vue`, `src/renderer/src/components/TransactionItem.vue` (hoặc tương đương). Refactor prop/slot nếu cần để truyền key xuống component con.
- Acceptance: Templates dùng `{{ t('...') }}` hoặc computed gọi `t()`; không còn text cố định liên quan mục tiêu; ứng dụng hiển thị đúng tiếng Việt.
- Checkpoint:

### Subtask TASK-12-04-1: Update TransactionList.vue

- Status: [ ] Todo
- Priority: High
- Depends on: [TASK-12-03-1]
- Description: Import `useI18n`, gọi `const { t } = useI18n()` trong setup, thay `Danh sách giao dịch`, `Không có giao dịch`, column headers bằng keys tương ứng.
- Acceptance: Transaction list hiển thị texts bằng `t('transactions.title')`, `t('transactions.empty')`, cột hiển thị `t('transactions.columns.date')`, `t('transactions.columns.amount')`.
- Checkpoint:

### Subtask TASK-12-04-2: Update TransactionItem.vue (nếu có)

- Status: [ ] Todo
- Priority: Medium
- Depends on: [TASK-12-04-1]
- Description: Thay các label/action text cứng trong item bằng các key; đảm bảo props truyền xuống component con nếu cần chuyển text thành key.
- Acceptance: Item component không chứa hard-coded UI text cho scope PBI12.
- Checkpoint:

### Subtask TASK-12-04-3: Refactor props/slots nếu cần

- Status: [ ] Todo
- Priority: Medium
- Depends on: [TASK-12-04-1, TASK-12-04-2]
- Description: Nếu shared components yêu cầu đổi prop text thành key hoặc hỗ trợ truyền key, update usages.
- Acceptance: Các component con nhận key thay vì raw string where applicable.
- Checkpoint:

## Task TASK-12-05: Kiểm tra TypeScript & Lint

- Status: [ ] Todo
- Priority: Medium
- Depends on: [TASK-12-04]
- Description: Chạy `npm run typecheck` và `npm run lint`, sửa warnings/errors liên quan đến imports/unused/typing do i18n thay đổi.
- Acceptance: `npm run typecheck` và `npm run lint` không có lỗi blocking; warnings low-priority được ghi chú.
- Checkpoint:
  - Artifacts to produce & attach in checkpoint (standardized file name patterns):
    - logs/typecheck-<YYYYMMDD>.txt (output of `npm run typecheck`)
    - logs/lint-<YYYYMMDD>.txt (output of `npm run lint`)
    - reports/npm-audit-<YYYYMMDD>.json (output of `npm audit --json`)
    - tests/unit-log-<YYYYMMDD>.txt (unit test run log)
    - tests/e2e-trace-<testname>-<YYYYMMDD>.zip (Playwright trace) and tests/e2e-screenshots-<testname>-<YYYYMMDD>.zip
  - Artifact upload location (CI): `artifacts/pbi12/` (CI job should upload artifacts here for PR attachment)
  - CI gating: required passing jobs before merge: `ci:typecheck`, `ci:lint`. Unit/E2E jobs are recommended to pass; at minimum unit tests must pass: `ci:unit`.
  - npm-audit policy: report must have no HIGH/CRITICAL unmitigated issues OR PR description must document accepted risk with remediation plan.
  - Confirm JSON typing: either `resolveJsonModule: true` in tsconfig OR a declaration file `src/env.d.ts` exists (see TASK-12-09). Reviewer will check the diff for tsconfig.\* or the new declaration file in PR.

## Task TASK-12-06: QA & Test cases

- Status: [ ] Todo
- Priority: Medium
- Depends on: [TASK-12-05]
- Description: QA thực hiện checklist: khởi chạy app, xác nhận default locale = vi, thử xóa 1 key trong vi.json để kiểm tra fallback behaviour, kiểm tra các view liên quan hiển thị đúng.
- Acceptance: QA xác nhận app hiển thị tiếng Việt; khi xóa key fallback không gây crash và hiển thị key/fallback value theo spec; QA report pass.
- Checkpoint:

## Task TASK-12-07: Documentation: docs/i18n.md

- Status: [ ] Todo
- Priority: Low
- Depends on: [TASK-12-02, TASK-12-03]
- Description: Tạo hoặc cập nhật `docs/i18n.md` gồm: vị trí file locales, cách thêm key, quy ước đặt tên keys, ví dụ sử dụng trong components (useI18n + t()).
- Acceptance: docs/i18n.md có hướng dẫn đủ để dev khác thêm key và dùng trong component; link vào checklist trước merge.
- Checkpoint:

## Task TASK-12-08: PR, Code review & merge

- Status: [ ] Todo
- Priority: Medium
- Depends on: [TASK-12-06, TASK-12-07]
- Description: Tạo branch `feature/12-localize-danh-sach-giao-dich`, push commits, mở PR, xử lý feedback review, và merge khi approved. Không dùng force-push.
- Acceptance: PR được merge vào feature branch; checklist trước merge (typecheck, lint, QA pass, docs updated) đã hoàn tất.
- Checkpoint:

## Task TASK-12-09: Typings / TSConfig for JSON imports

- Status: [ ] Todo
- Priority: Medium
- Depends on: [TASK-12-02, TASK-12-03]
- Description: Ensure TypeScript can import JSON translation files without errors. Options:
  - Enable `resolveJsonModule: true` in the appropriate tsconfig(s): `tsconfig.web.json`, `tsconfig.node.json` (if present), OR
  - Add a declaration file (e.g. `src/env.d.ts` / `src/i18n.d.ts`) with `declare module '*.json'`.
- Acceptance: `npm run typecheck` succeeds when importing `import vi from '@/locales/vi.json'` AND tsconfig/declaration diff is attached to the checkpoint.
- Checkpoint:
  - Attach changed tsconfig file(s) or new declaration file and the `logs/typecheck-<YYYYMMDD>.txt` showing a clean result. Reviewer will verify `tsconfig.web.json` and `tsconfig.node.json` (if present) in the PR diff.

## Task TASK-12-10: Lockfile & Dependency update policy

- Status: [ ] Todo
- Priority: High
- Depends on: [TASK-12-01]
- Description: If any dependency updates are applied (e.g., upgrading vue-i18n), update the repo lockfile (package-lock.json, pnpm-lock.yaml or yarn.lock) and include lockfile changes in PR.
- Acceptance: PR includes updated lockfile when package.json changed; CI installs dependencies from lockfile and passes tests.
- Checkpoint:
  - Attach lockfile diff and note package manager used; if lockfile not updated where expected, note reason.

---

<!-- Estimates summary (hours): TASK-12-01:0.5, TASK-12-02:2 (split), TASK-12-03:1.5 (split), TASK-12-04:3 (subtasks), TASK-12-05:1, TASK-12-06:2, TASK-12-07:1, TASK-12-08:1.5 -->
