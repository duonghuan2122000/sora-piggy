PBI: 16
Spec: specs/16/spec.md
Plan: specs/16/plan.md

# Test Cases — PBI 16: Chuyển giao diện về Ant Design Vue

## Scope
- Kiểm tra build, chức năng chính (5 luồng), form validation, theming, i18n, và accessibility cơ bản.

## Smoke Tests (Sanity)

TC-16-001 — Ứng dụng khởi động
- Preconditions: Node/npm installed, dependencies installed
- Steps:
  1. npm run dev
  2. Mở ứng dụng Electron
- Expected: Ứng dụng khởi động, không crash, main window hiển thị.
- Type: manual
- Regression: true

TC-16-002 — Build production
- Preconditions: CI environment
- Steps:
  1. npm run build
  2. npm run start (preview)
- Expected: Build thành công và preview chạy.
- Type: automation/manual
- Regression: true

## Core flow tests (Transactions)

TC-16-010 — Xem danh sách giao dịch
- Preconditions: Có ít nhất 10 giao dịch trong DB
- Steps:
  1. Mở trang Transactions
  2. Kiểm tra table hiển thị dữ liệu, pagination hoạt động
- Expected: Dòng dữ liệu hiển thị, phân trang hoạt động, sort/filter hoạt động.
- Type: manual
- Regression: true

TC-16-011 — Thêm giao dịch mới (form validation)
- Preconditions: App chạy
- Steps:
  1. Mở form Thêm giao dịch
  2. Bấm submit mà không điền required fields
  3. Điền dữ liệu hợp lệ và submit
- Expected: Validation messages hiển thị khi thiếu, sau khi điền hợp lệ, giao dịch được lưu và xuất hiện trên list.
- Type: manual
- Regression: true

TC-16-012 — Chỉnh sửa giao dịch
- Preconditions: Có giao dịch sẵn có
- Steps:
  1. Chọn giao dịch -> Edit
  2. Thay đổi giá trị và lưu
- Expected: Dữ liệu cập nhật và hiển thị mới.
- Type: manual
- Regression: true

## Pages: Accounts / Categories / Settings

TC-16-020 — CRUD Categories
- Preconditions: App chạy
- Steps:
  1. Mở Categories
  2. Tạo mới, chỉnh sửa, xóa category
- Expected: Các thao tác thực hiện được, list cập nhật.
- Type: manual
- Regression: true

TC-16-021 — Accounts list & update
- Preconditions: Có accounts
- Steps:
  1. Mở Accounts
  2. Check balances, edit account name
- Expected: Các thao tác phản hồi đúng.
- Type: manual
- Regression: true

## Theming & Visual checks

TC-16-030 — Theme tokens mapping
- Preconditions: Theme bridge implemented
- Steps:
  1. So sánh màu chính, spacing và font giữa staging (Element) và new UI
  2. Kiểm tra biến đổi khi đổi theme (nếu có)
- Expected: Màu chủ đạo, spacing tương đương hoặc phù hợp với UI mới; không có elements bị tràn hoặc misaligned.
- Type: manual
- Regression: false

## i18n

TC-16-040 — i18n en/vi
- Preconditions: Translations available
- Steps:
  1. Chuyển locale sang vi và en
  2. Kiểm tra texts trên pages chính
- Expected: Texts hiển thị đúng language; component texts (buttons/labels) cũng tuân thủ i18n.
- Type: manual
- Regression: true

## Accessibility spot checks

TC-16-050 — Keyboard navigation basic
- Preconditions: App chạy
- Steps:
  1. Dùng keyboard (Tab/Enter) để điều hướng form và controls trên Transaction form
- Expected: Focus order hợp lý, press Enter submit form.
- Type: manual
- Regression: false

## Typecheck & CI

TC-16-060 — TypeScript check
- Preconditions: CI
- Steps:
  1. npm run typecheck
- Expected: Không có lỗi nghiêm trọng.
- Type: automation
- Regression: true

## Notes
- Mỗi test case nên có step-by-step thực hiện và screenshot nơi cần thiết.
- Các test cases có thể được convert thành automation (Playwright/Vitest) sau migration hoàn tất.

