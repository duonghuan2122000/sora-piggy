# Tasks: Migration plan (task list)

Working branch: feature/16-chuyen-giao-dien-ant-design

## Apply requires
- proposal.md (done)
- design.md (done)
- tasks.md (this file) — ready for /opsx:apply

## Tasks

- [x] TASK-001 — Create change branch and scaffold (if needed)
- [ ] TASK-002 — Install dependencies
- [ ] TASK-003 — Add Ant Design plugin
- [ ] TASK-004 — Create Sora UI wrappers (initial set)
- [ ] TASK-005 — Migrate global layouts
- [ ] TASK-006 — Migrate pages (priority: transactions view)
- [ ] TASK-007 — Migrate common components
- [ ] TASK-008 — Update styles & variables
- [ ] TASK-009 — Remove Element Plus & cleanup
- [ ] TASK-010 — Run checks & GitNexus analysis
- [ ] TASK-011 — Manual QA & visual review
- [ ] TASK-012 — Documentation & PR

TASK-001 — Create change branch and scaffold (if needed)
- Subject: Ensure branch exists and is up-to-date
- Actions:
  - Confirm on branch feature/16-chuyen-giao-dien-ant-design
  - rtk git fetch && rtk git rebase origin/master (or merge per team policy)
- Files: none

TASK-002 — Install dependencies
- Subject: Add ant-design-vue and icons
- Actions:
  - rtk pnpm add ant-design-vue @ant-design/icons-vue
  - rtk pnpm add -D less
- Verify: package.json updated, node_modules present
- Files:
  - package.json

TASK-003 — Add Ant Design plugin
- Subject: Register Ant Design Vue in renderer
- Actions:
  - Create src/renderer/src/plugins/ant-design.ts
  - Update src/renderer/src/main.ts to use plugin
- Files:
  - src/renderer/src/plugins/ant-design.ts
  - src/renderer/src/main.ts: add import and app.use(antPlugin)

TASK-004 — Create Sora UI wrappers (initial set)
- Subject: Create wrappers that map Element API to Ant API
- Actions:
  - Create src/renderer/src/ui/{Button,Input,Select,Form,Modal,Table,Icon} with thin wrappers
  - Export an index barrel: src/renderer/src/ui/index.ts
- Rationale: Isolate prop/event mapping in one place

TASK-005 — Migrate global layouts
- Subject: Replace Element-based layout elements
- Actions:
  - Migrate MainLayout, Sidebar, TopNav to use Sora wrappers / antd Layout
  - Fix styles and CSS variable mapping
- Files likely:
  - src/renderer/src/layouts/MainLayout.vue
  - src/renderer/src/layouts/Sidebar.vue
  - src/renderer/src/layouts/TopNav.vue

TASK-006 — Migrate pages (priority: transactions view)
- Subject: Migrate page-level components used by core flows
- Actions:
  - Migrate src/renderer/src/views/transactions/* to wrappers
  - Replace ElTable, ElForm, ElDialog usages

TASK-007 — Migrate common components
- Subject: Migrate small reusable components under src/renderer/src/components
- Actions:
  - One-by-one replace Element usage with Sora wrappers
  - Prefer small commits per component

TASK-008 — Update styles & variables
- Subject: Map SCSS variables to Ant theme
- Actions:
  - Update src/renderer/src/assets/scss/_variables.scss with mapping notes
  - Create styles/ant-theme.scss for Ant overrides
  - Adjust Vite config if Less support required

TASK-009 — Remove Element Plus & cleanup
- Subject: Uninstall element-plus when migration complete
- Actions:
  - rtk pnpm remove element-plus
  - Remove unused CSS and imports

TASK-010 — Run checks & GitNexus analysis
- Subject: Impact analysis and pre-commit verification
- Actions:
  - For each modified symbol run gitnexus_impact({target: "<symbol>", direction: "upstream"})
  - Run rtk git add for modified files, then gitnexus_detect_changes({scope: "staged"}) before commit
  - Run rtk npm run typecheck

TASK-011 — Manual QA & visual review
- Subject: Smoke tests across app flows
- Actions:
  - Run npm run dev and exercise: add/edit transaction, open dialogs, navigation
  - Check responsiveness and theming

TASK-012 — Documentation & PR
- Subject: Prepare PR description and testing instructions
- Actions:
  - Document migration notes in CHANGELOG or PR body
  - Include QA checklist and rollback steps

## Notes
- Make small, reviewable commits: one logical change per commit.
- Always run gitnexus impact for symbols you edit. If impact returns HIGH/CRITICAL, stop and discuss.

---
Ready to implement: run /opsx:apply to begin executing the tasks above.
