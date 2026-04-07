PBI: 16
Spec: specs/16/spec.md
Branch: feature/16-chuyen-giao-dien-ant-design

# Plan: Chuyển giao diện từ Element Plus sang Ant Design Vue

## Executive Summary
Chuyển toàn bộ renderer từ Element Plus sang Ant Design Vue (ant-design-vue) để thống nhất hệ thống UI và tận dụng thư viện components phù hợp với phong cách thiết kế mới. Kế hoạch thực hiện theo pha: (1) chuẩn bị môi trường và theme bridge, (2) migrate các shared components và layout, (3) migrate các trang ưu tiên (Transactions, Settings, Accounts, Categories), (4) QA và remove Element Plus. Mỗi pha gồm các tasks nhỏ, estimate bằng story points và có sự phối hợp giữa Frontend, QA và DevOps.

## Proposed Architecture
Không thay đổi backend hay data model; mọi thay đổi tập trung ở renderer (Vue 3). Thêm một layer "UI adapter" gồm: component-wrappers (Button, Input, Table, Form), theme-bridge (SCSS/Less tokens), và plugin đăng ký Ant components.

ASCII diagram (renderer scope):

[Renderer App]
  ├─ plugins/ant-design.ts (register)
  ├─ themes/_variables.scss (token bridge)
  ├─ components/
  │   ├─ ui-wrappers/ (Button.vue, Table.vue, Form.vue)
  │   └─ shared/ (Header, Sidebar)
  └─ pages/ (Transactions, Settings...)

## Components & Interfaces
- UI wrappers: nhỏ gọn, giữ API tương tự hiện tại để giảm thay đổi ở pages.
- Icons: icons/AntIconWrapper.vue cung cấp mapping cho @ant-design/icons-vue.
- Table wrapper: a-table compatible props & events mapped to existing usage (selection, sort, pagination).
- Form wrapper: expose submit/validate APIs compatible với current composables — internally use a-form.

## Data Model changes
Không có thay đổi schema DB hay Pinia store structure. Nếu cần thêm transient UI state (e.g., table selection shape), giữ trong composables hoặc local component state.

## APIs & Contracts
IPC and preload APIs không thay đổi. Ui wrappers phải tiếp tục sử dụng existing store actions (no API contract changes).

## Non-functional Requirements
- Build: support Less (ant theming) in Vite.
- Performance: avoid bundling full antd css where possible; prefer on-demand imports or CSS chunking.
- Accessibility: maintain labels and keyboard interaction.

## Migration Plan (Phased)
Phase 0 — Setup (2 sp)
- Add ant-design-vue and icon package. Configure Vite for less support and global imports.

Phase 1 — Foundation (3 sp)
- Implement theme bridge (tokens) and plugin for Ant registration. Create UI wrappers for Button/Input/Icon.

Phase 2 — Shared components & Layout (5 sp)
- Migrate Header, Sidebar, MainLayout; replace global styles.

Phase 3 — Core pages (8 sp)
- Transactions list (table + filters + pagination)
- Transaction form (create/edit) with validation
- Accounts, Categories, Settings pages

Phase 4 — QA & Cleanup (3 sp)
- Manual QA, visual fixes, accessibility checks, resolve type errors.
- Remove Element Plus and unused styles.

## Implementation Tasks (with owners & estimates)
1. Create branch feature/16-chuyen-giao-dien-ant-design — Frontend (0 sp)
2. Add dependencies: ant-design-vue, @ant-design/icons-vue — Frontend (1 sp)
3. Vite less config & CI changes (enable less loader) — DevOps / Frontend (2 sp)
4. Create theme tokens file and bridge to existing _variables.scss — Frontend (2 sp)
5. Implement plugins/ant-design.ts and global CSS import strategy — Frontend (2 sp)
6. Implement UI wrappers: Button, Input, Icon, Table wrapper (initial) — Frontend (3 sp)
7. Migrate MainLayout (TopNav, Sidebar) using wrappers — Frontend (3 sp)
8. Migrate Transactions list page (table + filters + pagination) — Frontend (5 sp)
9. Migrate Transaction form (validation + modal) — Frontend (5 sp)
10. Migrate Accounts, Categories, Settings pages — Frontend (5 sp)
11. QA test plan and manual verification — QA (3 sp)
12. Fix visual regressions & accessibility issues — Frontend/UX (3 sp)
13. Remove Element Plus dependency and cleanup — Frontend (2 sp)
14. Run typecheck and platform builds (Windows/macOS/Linux) — DevOps/Frontend (2 sp)

## Timeline / Phases (suggested)
Sprint 1 (Week 1): Phase 0 + Phase 1 + start Phase 2
Sprint 2 (Week 2): Finish Phase 2 + start Phase 3 (Transactions)
Sprint 3 (Week 3): Finish Phase 3 (forms + secondary pages) + Phase 4 QA
Sprint 4 (Week 4): Cleanup, remove Element Plus, final builds and release notes

## Risks & Mitigations
- Theming mismatch (colors/spacing) → mitigate by token bridge and UX review early.
- Large visual regressions → migrate pages incrementally and keep Element Plus until end.
- Build pipeline issues with Less → involve DevOps early and run CI builds after Vite change.
- TypeScript prop differences → use wrapper components to adapt APIs.

## Open Questions
- Use Less-based theming or CSS variables? (Prefer Less for deeper Ant customization; confirm with DevOps)
- Use global registration or on-demand component imports to optimize bundle size?
- Any brand/visual guideline updates from Product/UX to incorporate?

## Dependencies
- DevOps support for Vite/CI less loader
- UX review for token mapping
- QA availability for manual regression testing

## Acceptance Criteria Mapping
- App builds & runs → Task 2,3,14
- Pages use Ant components → Tasks 6–10
- Forms work (validation) → Task 9
- Typecheck passes → Task 14
- QA manual checks pass → Task 11,12



---
Architecture report and suggested files will be provided separately.
