# Design: Migration Element Plus → Ant Design Vue

## Tổng quan chiến lược
1. Thực hiện incremental migration bằng cách tạo một lớp Sora UI wrappers (src/renderer/src/ui/) dùng làm API thống nhất cho UI components. Các component Vue trong app sẽ import từ wrappers thay vì trực tiếp import Element/Ant.
2. Đặt priority migration: layouts (MainLayout, Sidebar, TopNav) → pages (transactions view) → common components → form components → tables/complex widgets.
3. Khi một vùng hoàn tất, xóa import ElementPlus tương ứng và thay bằng wrapper/ant component.

## Cấu trúc đề xuất
- src/renderer/src/plugins/ant-design.ts — cấu hình Ant Design Vue (locale, global config, icons)
- src/renderer/src/ui/ — thư mục wrappers
  - ui/Button/index.vue (SoraButton)
  - ui/Input/index.vue (SoraInput)
  - ui/Select/index.vue
  - ui/Modal/index.vue
  - ui/Form/* (SoraForm, SoraFormItem)
  - ui/Table/index.vue
  - ui/Icon/* (wrapper cho icons sử dụng ant-design/icons-vue hoặc svg)
- src/renderer/src/styles/ant-theme.scss — biến/override cho ant-design
- src/renderer/src/assets/scss/_variables.scss — thêm mapping từ biến cũ sang biến mới (ví dụ: --color-primary → @primary-color)

## Component mapping (từ Element → Ant)
- ElButton → a-button (SoraButton wrapper)
- ElInput → a-input (SoraInput)
- ElSelect → a-select (SoraSelect)
- ElDialog → a-modal (SoraModal)
- ElForm / ElFormItem → a-form / a-form-item (SoraForm)
- ElTable → a-table (SoraTable)
- ElIcon → ant icons

(Lưu ý: props/even mapping cần xử lý trong wrappers)

## Theming & styles
- Ant Design Vue dùng Less variables; nhưng project hiện dùng SCSS. Giải pháp:
  - Sử dụng biến SCSS dự phòng: map SCSS variables sang Less vars thông qua build-time config hoặc dùng CSS variables và Ant Design CSS variables override.
  - Tạo file styles/ant-theme.scss chứa map biến quan trọng (primary, success, warning, bg, text) và import vào main renderer entry.
  - Giữ src/renderer/src/assets/scss/_variables.scss là source-of-truth: ghi rõ mapping và hướng dẫn cập nhật.

## Build & deps
- package.json: thêm dep dev/runtime: ant-design-vue, @ant-design/icons-vue
- Vite config: nếu cần, enable Less handling for antd theming (install less, less-loader / vite-plugin-style-import nếu dùng)

## Rollback plan
- Migrate trong một branch riêng (hiện có). Nếu regressions nặng, revert commit hoặc open a revert PR. Giữ commits theo bước nhỏ (install deps → add plugin → create wrappers → migrate layouts → migrate pages → remove element-plus).

## GitNexus / Impact analysis
- Trước khi sửa symbol (component, layout), chạy gitnexus_impact({target: "<symbol>", direction: "upstream"}) per guidance in CLAUDE.md. Báo cáo blast radius.
- Trước commit: gitnexus_detect_changes({scope: "staged"}). Nếu risk HIGH/CRITICAL, stop and review.

## QA checklist
- Launch dev build (npm run dev) → verify main flows: add transaction, edit transaction, list filtering, account balance updates.
- Visual smoke tests for TopNav, Sidebar, Forms, Modal dialogs, Tables.
- Accessibility quick checks for keyboard nav in modal and forms.

