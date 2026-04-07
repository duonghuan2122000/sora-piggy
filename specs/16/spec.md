# Spec PBI 16 — Chuyển giao diện về Ant Design

PBI: 16
Branch: feature/16-chuyen-giao-dien-ant-design

## Tóm tắt
Người dùng giao diện ứng dụng sẽ được chuyển từ Element Plus sang Ant Design Vue (ant-design-vue). Mục tiêu là thay thế các thành phần UI, bảo toàn trải nghiệm người dùng, và tối ưu hóa theme/token dùng chung.

## Mục tiêu (Goals)
- Thay thế Element Plus bằng Ant Design Vue trên toàn bộ renderer (Vue 3).
- Giữ tính năng hiện tại không thay đổi; giảm thiểu regressions giao diện cho các luồng chính.
- Thiết lập hệ thống design token / theme để dễ duy trì.
- Cập nhật cấu hình build (Vite) nếu cần để bundling đúng.

## Acceptance Criteria
- Ứng dụng build thành công và chạy (npm run dev / npm run start) sau khi cài dependency ant-design-vue.
- Các trang chính (Dashboard, Transactions list, Transaction form, Settings, Accounts, Categories) sử dụng Ant Design components thay vì Element Plus.
- Các form chính (thêm/sửa giao dịch) hoạt động: validation, submission, error handling tương đương trước.
- Không có lỗi TypeScript nghiêm trọng (npm run typecheck passes).
- QA manual: kiểm tra không có regressions nghiêm trọng trên 5 luồng chính (mở app, xem danh sách giao dịch, lọc/paginate, thêm giao dịch, chỉnh sửa danh mục).
- Styles được chuyển sang design tokens; màu sắc chính, spacing, font tương thích với theme mới.
- i18n vẫn hoạt động (en/vi).

## UX / Flows
- Luồng hiển thị và tương tác không thay đổi về hành vi; chỉ thay đổi controls (ví dụ: ElTable → a-table, ElForm → a-form).
- Các modal/dialog sử dụng a-modal; alerts/notifications dùng a-message / a-notification.
- Pagination / table sorting/filtering dùng a-pagination / a-table built-in APIs.

## Data Model
- Không thay đổi schema database hay data model. Pinia stores và các payload IPC giữ nguyên; chỉ thay đổi binding UI → store.

## Migration plan & Technical approach
1. Dependencies
   - Thêm ant-design-vue (phiên bản Vue 3 compatible) và @ant-design/icons-vue.
   - Loại bỏ Element Plus sau khi migration xong (tách commit).

2. Component mapping (ví dụ)
   - ElButton → a-button
   - ElTable → a-table (với columns)
   - ElForm / ElFormItem → a-form / a-form-item (note: API khác, useForm hook)
   - ElInput → a-input
   - ElSelect → a-select
   - ElDatePicker → a-date-picker (format handling)
   - ElDialog → a-modal
   - ElRadio / ElCheckbox → a-radio / a-checkbox
   - ElIcon → @ant-design/icons-vue equivalents
   - ElTooltip → a-tooltip
   - ElPagination → a-pagination
   - ElAvatar → a-avatar
   - ElDropdown → a-dropdown / a-menu

3. Theming & tokens
   - Create design tokens file (src/renderer/src/assets/scss/_ant_tokens.scss or a JSON token file) mapping existing SCSS variables to Ant Design tokens.
   - Prefer Ant Design theme customization via Vite (less variables) or CSS variables. If ant-design-vue uses Less for theming, enable less support in Vite and migrate color/spacing tokens.
   - Keep existing _variables.scss as canonical source and map/bridge to Ant tokens.

4. Global styles & icons
   - Import ant-design styles in main.ts (on-demand import or full CSS depending on tree-shaking).
   - Migrate icons: replace Element icons with @ant-design/icons-vue components; create an icons wrapper component to provide backward-compatible API for shared components.

5. Forms & Validation
   - Ant Design form validation differs (rules on a-form / a-form-item). Convert validation schemas accordingly. Keep business logic in stores or composables; UI should only handle display/validation wiring.
   - If app uses third-party validation (yup, vee-validate), align usage with Ant Design form hooks.

6. i18n
   - Ant components may have built-in locale providers. Ensure vue-i18n usage remains; wrap app with Ant Design locale provider if needed, and keep translations for component texts.

7. Pinia / UI coupling
   - Ensure stores are UI-agnostic. Refactor any store that exports UI-specific constants/components to composables in renderer so migration is isolated.

8. Vite / build
   - Update vite config for style preprocessing (less support) if using Ant's less theming.
   - Check tree-shaking / bundle size; consider on-demand import plugin (babel-plugin-import equivalent for Vite) or use plugin to reduce CSS footprint.

9. IPC / Preload
   - No functional change expected. Ensure any UI changes that affect data shapes (e.g., table selection APIs) are adapted in renderer code only.

## Non-functional Requirements
- Performance: ensure table rendering performance remains acceptable; avoid loading full component library CSS if unnecessary.
- Bundle size: monitor and keep under acceptable threshold.
- Accessibility: Ant Design provides good a11y defaults; keep labels and aria attributes.
- Cross-platform: ensure styling behaves on Windows/macOS/Linux (Electron).

## Risks & Rollback plan
- Risk: Visual regressions and behavior differences in form validation and table APIs.
  - Mitigation: migrate pages incrementally, keep Element Plus in repo until all critical pages pass QA.
- Risk: Theming complexity (Less vs SCSS).
  - Mitigation: choose token mapping and enable Less preprocessor; keep variables mapped to a single source.
- Risk: Type errors from different component props.
  - Mitigation: run typecheck early and fix typings incrementally.
- Rollback: If blockers found, revert to branch head before removal of Element Plus; keep commits small (add ant-design first, migrate pages, then remove element-plus).

## Tasks / Notes (ordered)
1. Frontend: Create branch
   - git checkout -b feature/16-chuyen-giao-dien-ant-design

2. Frontend: Add dependencies
   - npm install ant-design-vue@latest @ant-design/icons-vue
   - Update package.json (do not remove element-plus yet)

3. Frontend: Add Less support & Vite changes
   - Configure Vite to handle less (if theming via Less). Update electron.vite.config.ts accordingly.
   - (DevOps) Verify build pipeline supports less.

4. Frontend: Create design tokens & theme bridge
   - Create src/renderer/src/assets/scss/_ant_tokens.scss mapping existing variables.
   - Create a theme provider or plugin to inject tokens.

5. Frontend: Set up global imports
   - Import Ant styles and register components globally or use on-demand imports.
   - Create src/renderer/src/plugins/ant-design.ts for global registration.

6. Frontend: Convert shared components
   - Migrate commonly used components (Button, Icon wrapper, Form controls, Table wrapper) and expose same props used across app.
   - Keep Element components available until all usages updated.

7. Frontend: Migrate main layout & shell
   - Replace top navigation, sidebar, main layout with Ant components.

8. Frontend: Migrate pages incrementally (by priority)
   - High priority: Transactions list, Transaction form, Settings, Accounts, Categories.
   - For each page: replace UI components, wire validation, adjust styles.

9. Frontend: Update styles & variables
   - Replace SCSS variable usage to map to ant tokens.
   - Fix spacing/layout regressions.

10. QA: Manual testing
    - QA to run manual flows: open app, CRUD transactions, filters, pagination, settings.
    - Document visual regressions and bugs.

11. Frontend: Remove Element Plus
    - After all pages migrated and QA pass, remove element-plus dependency and related styles.

12. CI/DevOps: Typecheck & build
    - Run npm run typecheck and npm run build for target platforms. Fix errors.

13. Release: Prepare changelog
    - Note UI framework migration and any limited-breaking changes for contributors.

### Who should do what
- Frontend devs: tasks 2–9, 11–12.
- QA: task 10.
- DevOps: assist with Vite/less config and CI changes (task 3,12).
- Product/UX: review visual changes for key screens (during tasks 7–9).

### Notes
- Keep commits small and feature-flagged if needed (e.g., expose an env flag to toggle UI library during migration).
- Prefer creating wrappers for components to limit wide-scope changes.
- Run gitnexus_impact on modified symbols (per repository policy) before editing UI-critical symbols.
- After commit, run gitnexus_detect_changes() to verify scope.

End.
