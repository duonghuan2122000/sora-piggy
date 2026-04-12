# Tasks — PBI 20: Cập nhật TopNav

## Tổng quan
Các bước triển khai theo thứ tự ưu tiên. Hoàn thành mỗi bước rồi chạy gitnexus impact/detect_changes theo quy trình.

### task-001: Update TopNav layout
- File: src/renderer/src/layouts/TopNav.vue
- Hành động: Đảm bảo container sử dụng flexbox và justify-content: space-between giữa title và toolbar. Không thay đổi location file.
- Test: Snapshot hoặc DOM assertion kiểm tra 2 phần
- Status: done

### task-002: Add SoraLanguageSelect component
- File: src/renderer/src/components/ui-wrappers/SoraLanguageSelect.vue
- Hành động: Implement combobox dùng Ant Design Vue `a-select`, options từ locales, aria-label và emit event khi thay đổi.
- Test: kiểm tra emit sự kiện khi thay đổi giá trị
- Status: done

### task-003: SCSS variables
- File: src/renderer/src/assets/scss/_variables.scss
- Hành động: Thêm $topnav-height, $topnav-padding, $topnav-bg và mixin center-flex

### task-004: Migrate shared UI components
- File(s): src/renderer/src/components/ui/ (or ui-wrappers)
- Hành động: Tạo Sora* components (Button, Select, Combobox, AutoComplete) hoặc re-export từ ui-wrappers. Ensure TopNav imports Sora components.

### task-005: i18n strings
- Files: src/renderer/src/locales/vi.ts, src/renderer/src/locales/en.ts
- Hành động: Thêm label cho combobox nếu cần

### task-006: Tests & typecheck
- Run vitest, npm run typecheck, lint. Fix issues.

### task-007: Impact analysis & commit
- Run gitnexus impact/detect_changes per repo rules
- Commit changes and create PR with checklist


(Updated to reflect using Sora* components and not moving TopNav file.)
---

Khi bạn muốn tôi bắt đầu implement, chạy /opsx:apply hoặc yêu cầu tôi bắt đầu implement task-001.