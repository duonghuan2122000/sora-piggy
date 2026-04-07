PBI: 16
Spec: specs/16/spec.md
Plan: specs/16/plan.md

# Tasks for PBI 16 — Chuyển giao diện về Ant Design Vue

## Phase 0 — Setup

### TASK-16-01: Tạo branch cho PBI 16
- Description: Tạo branch git local `feature/16-chuyen-giao-dien-ant-design` để bắt đầu làm việc.
- Estimate: 0
- Assignee: Frontend
- Status: pending
- Dependencies: none
- Labels: frontend, housekeeping

### TASK-16-02: Thêm dependency ant-design-vue và icons
- Description: Cài đặt `ant-design-vue` và `@ant-design/icons-vue`. Không xóa element-plus lúc này.
- Estimate: 1
- Assignee: Frontend
- Status: done
- Dependencies: TASK-16-01
- Labels: frontend, deps
- Checkpoint: npm install ant-design-vue @ant-design/icons-vue (see package.json)

### TASK-16-03: Cấu hình Vite cho Less (theming)
- Description: Cập nhật cấu hình Vite/electron.vite.config.ts để hỗ trợ Less (nếu chọn Less-based theming). Cập nhật CI nếu cần.
- Estimate: 2
- Assignee: DevOps / Frontend
- Status: pending
- Dependencies: TASK-16-02
- Labels: devops, frontend

## Phase 1 — Foundation

### TASK-16-04: Tạo design tokens & theme bridge
- Description: Tạo file `src/renderer/src/assets/scss/_ant_tokens.scss` mapping các biến SCSS hiện có vào token Ant. Xây plugin/utility để inject tokens.
- Estimate: 2
- Assignee: Frontend / UX
- Status: pending
- Dependencies: TASK-16-03
- Labels: frontend, ux

### TASK-16-05: Tạo plugin ant-design global
- Description: Tạo `src/renderer/src/plugins/ant-design.ts` để đăng ký Ant components, import CSS/less global.
- Estimate: 2
- Assignee: Frontend
- Status: in_progress
- Dependencies: TASK-16-02
- Labels: frontend

### TASK-16-06: Triển khai UI wrappers (Button, Input, Icon, Table basic)
- Description: Tạo thư mục `src/renderer/src/components/ui-wrappers/` với các wrapper giữ API tương tự hiện tại.
- Estimate: 3
- Assignee: Frontend
- Status: in_progress
- Dependencies: TASK-16-05, TASK-16-04
- Labels: frontend
- Checkpoint: created ui-wrappers/SoraButton.vue, SoraInput.vue, SoraIcon.vue, SoraTable.vue and plugin stub src/renderer/src/plugins/ant-design.ts
- Removed legacy non-prefixed wrappers moved to specs/16/backups/ui-wrappers-removed-20260407220229

## Phase 2 — Shared components & Layout

### TASK-16-07: Migrate MainLayout (TopNav, Sidebar)
- Description: Thay thế Header/Sidebar bằng Ant components thông qua wrappers.
- Estimate: 3
- Assignee: Frontend
- Status: pending
- Dependencies: TASK-16-06
- Labels: frontend, ui

### TASK-16-08: Migrate shared components (Icon wrapper, Alerts, Notifications)
- Description: Migrate các thành phần dùng chung, đảm bảo notifications/alerts dùng a-message / a-notification.
- Estimate: 2
- Assignee: Frontend
- Status: pending
- Dependencies: TASK-16-06
- Labels: frontend

## Phase 3 — Core pages

### TASK-16-09: Migrate Transactions list (table + filters + pagination)
- Description: Chuyển ElTable → Table wrapper, đảm bảo filter, sort, pagination và selection hoạt động.
- Estimate: 5
- Assignee: Frontend
- Status: pending
- Dependencies: TASK-16-07
- Labels: frontend, feature

### TASK-16-10: Migrate Transaction form (create/edit) with validation
- Description: Chuyển ElForm → Form wrapper, chuyển validation rules, đảm bảo submission + error handling.
- Estimate: 5
- Assignee: Frontend
- Status: pending
- Dependencies: TASK-16-06
- Labels: frontend, feature

### TASK-16-11: Migrate Accounts, Categories, Settings pages
- Description: Migrate UI components and adjust styles for these pages.
- Estimate: 5
- Assignee: Frontend
- Status: pending
- Dependencies: TASK-16-07
- Labels: frontend

## Phase 4 — QA & Cleanup

### TASK-16-12: QA manual testing
- Description: QA chạy checklist: open app, CRUD transactions, filtering/pagination, add/edit categories, theme checks, accessibility spot checks.
- Estimate: 3
- Assignee: QA
- Status: pending
- Dependencies: TASK-16-09, TASK-16-10, TASK-16-11
- Labels: qa

### TASK-16-13: Fix visual regressions & accessibility issues
- Description: Frontend/UX fix issues found by QA.
- Estimate: 3
- Assignee: Frontend / UX
- Status: pending
- Dependencies: TASK-16-12
- Labels: frontend, ux

### TASK-16-14: Remove Element Plus & cleanup
- Description: Remove element-plus package and any leftover styles, run typecheck and platform builds.
- Estimate: 2
- Assignee: Frontend
- Status: pending
- Dependencies: TASK-16-13
- Labels: frontend, cleanup

### TASK-16-15: Run typecheck and build on CI
- Description: Ensure `npm run typecheck` and `npm run build` pass for target platforms.
- Estimate: 2
- Assignee: DevOps / Frontend
- Status: pending
- Dependencies: TASK-16-14
- Labels: devops, build

## Misc notes
- Tạo commit nhỏ theo từng task. Không xóa element-plus trước khi tất cả pages pass QA.
- Chạy `gitnexus_impact` trước khi sửa component hooks/điểm gọi lớn.


