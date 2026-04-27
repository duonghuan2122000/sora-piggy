# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Tệp này hướng dẫn Claude Code khi làm việc trong repository Sora Piggy. Luôn trả lời bằng tiếng Việt.

I only speak Vietnamese so you must always respond in Vietnamese.

<CRITICAL>
  ALWAYS RESPOND IN VIETNAMESE
</CRITICAL>

## Common Commands

```bash
# Development
npm run dev                    # Start development server (Electron + Vite)
npm run start                  # Preview production build

# Building
npm run build                  # Type check and build for current platform
npm run build:win              # Build for Windows
npm run build:mac              # Build for macOS
npm run build:linux            # Build for Linux
npm run build:unpack           # Build without packaging

# Code quality
npm run lint                   # Run ESLint
npm run format                 # Format code with Prettier
npm run typecheck              # Run TypeScript checks (node + web)
npm run typecheck:node         # Type check main process
npm run typecheck:web          # Type check renderer
npm run rebuild                # Rebuild native dependencies (better-sqlite3)

# Testing
npm run test                   # Run all tests with Vitest (unit + integration)
npm run test:unit              # Alias for unit tests
npm run test:watch             # Run Vitest in watch mode
# Run a single test: npm run test -- -t "<pattern>" or npx vitest -t "<pattern>"

# CI (check before push / PR)
npm run ci:check               # Lint + typecheck + test
npm run ci:build               # ci:check + build
npm run ci:package             # ci:build + package (electron-builder)

# E2E tests (Playwright — needs dev server at localhost:3000)
# npx playwright test test/e2e --config=playwright.config.cjs
```

## Kiến trúc tổng quan

**Sora Piggy** là ứng dụng desktop local-first để quản lý chi tiêu được xây dựng với:

- **Electron** cho shell desktop (main process + preload)
- **Vue 3 + Composition API** cho phần renderer (UI)
- **TypeScript** cho type safety
- **SQLite** qua `better-sqlite3` cho lưu trữ local
- **Pinia** cho quản lý state
- **Ant Design Vue** cho UI components (xem package.json)
- **SCSS** với CSS variables cho theming

### Project Structure (high-level)

```
src/
├── main/                    # Electron main process
│   ├── index.ts            # App entry point, IPC handlers
│   └── database.ts         # SQLite CRUD operations (transactions, categories, accounts)
├── preload/                 # Preload scripts (context bridge)
│   └── index.ts            # Exposes IPC APIs to renderer
└── renderer/                # Vue frontend
    ├── src/
    │   ├── App.vue         # Root component
    │   ├── main.ts         # Vue app entry point
    │   ├── router/         # Vue Router configuration
    │   ├── stores/         # Pinia stores (transactionForm, etc.)
    │   ├── views/          # Page-level components
    │   │   └── transactions/
    │   ├── layouts/        # MainLayout, Sidebar, TopNav
    │   ├── components/     # Reusable UI components
    │   ├── types/          # TypeScript interfaces
    │   ├── constants/      # ROUTE_NAMES, etc.
    │   ├── locales/        # i18n messages (en, vi)
    │   └── assets/
    │       └── scss/       # SCSS variables and mixins
    └── index.html
```

## Data Flow

1. **Main Process** (`src/main/index.ts`):
   - Khởi tạo SQLite database khi app start
   - Đăng ký IPC handlers cho các thao tác database
   - Ví dụ: `ipcMain.handle('db:getAllTransactions', () => getAllTransactions())`

2. **Preload Script** (`src/preload/index.ts`):
   - Dùng `contextBridge` để expose API an toàn cho renderer
   - Ví dụ: `getTransactions: () => ipcRenderer.invoke('db:getAllTransactions')`

3. **Renderer (Vue)** (`src/renderer/src/`):
   - Gọi `window.api.getTransactions()` từ component
   - Lưu data vào Pinia stores hoặc refs
   - UI components render dữ liệu

## Key Files

| File                                         | Purpose                                                       |
| -------------------------------------------- | ------------------------------------------------------------- |
| `src/main/database.ts`                       | SQLite CRUD operations for transactions, categories, accounts |
| `src/main/index.ts`                          | Electron main process, IPC handlers, app lifecycle            |
| `src/preload/index.ts`                       | Context bridge exposing APIs to renderer                      |
| `src/renderer/src/main.ts`                   | Vue app initialization (plugins, router, Pinia, i18n)         |
| `src/renderer/src/router/index.ts`           | Vue Router routes configuration                               |
| `src/renderer/src/stores/transactionForm.ts` | Pinia store for transaction form state                        |
| `src/renderer/src/constants/index.ts`        | Route names constants                                         |

## Styling

- **SCSS** với CSS variables ở `src/renderer/src/assets/scss/_variables.scss`
- Scoped styles trong Vue components (không dùng CSS Modules)
- Ant Design Vue/Ant theme overrides được sử dụng — check các file SCSS trong assets để biết biến và mixins

## TypeScript Configuration

- Hai tsconfig: `tsconfig.node.json` (main) và `tsconfig.web.json` (renderer)
- Type aliases:
  - `@renderer` → `src/renderer/src`
  - `@assets` → `src/renderer/src/assets`
  - `@scss` → `src/renderer/src/assets/scss`

## Database Schema

SQLite database ở `~/.config/Sora Piggy/sora-piggy.db` (userData directory):

- `transactions`: id (UUID v7), name, description, categoryId, accountId, amount, time
- `categories`: id, name, type, icon, color
- `accounts`: id, name, type, balance

### Migrations

- Dùng `PRAGMA user_version` để track schema version (hiện tại: version 2)
- Migration code trong `src/main/database.ts` — chạy tự động khi app khởi động
- Migration history: v1 (text columns `category`/`account`) → v2 (UUID v7 + FK columns `categoryId`/`accountId`)
- Tự động tạo backup file `.db.bak` trước khi migrate
- Seed data: `npm run dev` tự động tạo categories và accounts mặc định nếu chưa có

## Testing

- **Unit + Integration**: Vitest (`npm run test`) — cấu hình ở `vitest.config.ts`, dùng jsdom environment
- **E2E**: Playwright (`npx playwright test test/e2e --config=playwright.config.cjs`) — cần dev server đang chạy
- Vitest config exclude `test/e2e/` và `tests/e2e/` để tránh xung đột

### Test directory structure

```
test/unit/           # Unit tests (Vitest)
test/integration/    # Integration tests (Vitest)
test/e2e/            # E2E tests (Playwright)
tests/unit/          # Unit tests (alternative location)
tests/e2e/           # E2E tests (alternative location)
```

- Chạy một test cụ thể: `npm run test -- -t "<pattern>"` hoặc `npx vitest -t "<pattern>"`
- Nếu test tương tác với DB thật, tạo DB test riêng để tránh ghi đè data người dùng

## Development Tips

- Luôn chạy `npm run typecheck` trước khi build để bắt TypeScript errors
- Database operations dùng better-sqlite3 (synchronous) — giữ queries hiệu quả
- IPC calls: async ở renderer, handlers sync hoặc async ở main
- Dùng alias `@renderer/` cho imports trong Vue để code sạch hơn
- Kiểm tra `_variables.scss` khi gặp vấn đề styling
- **Wrapper components**: Các component bọc (wrap) Ant Design UI phải có tiền tố `Sora` (vd: `SoraButton`, `SoraModal`, `SoraTable`, `SoraInput`, ...) — xem trong `src/renderer/src/components/ui-wrappers/`
- Khi tham chiếu code, ghi kèm `file_path:line_number` (vd: `src/main/index.ts:1`)
- **Seed data**: Gọi `window.api.importFakeTransactions()` từ console renderer để tạo dữ liệu giả

## Git & PR Conventions

- Trợ lý KHÔNG tự động git commit/push/tạo PR — phải chờ xác nhận rõ ràng từ người dùng
- Commit message format: `<type>(<scope>): <description>` (vd: `feat(transactions): add pagination`)
- **KHÔNG thêm dòng `Co-Authored-By`** vào commit message
- Trước khi commit, chạy `typecheck && lint && test` và `gitnexus_detect_changes()`
- Khi tạo PR, cung cấp: tiêu đề ngắn, tóm tắt 1-3 bullet points, checklist test plan
- Nếu thay đổi ảnh hưởng nhiều file/symbol, kèm kết quả `gitnexus_impact` trong mô tả PR
- Không thực hiện hành động phá hủy (force push, xóa branch remote) trừ khi có yêu cầu rõ ràng

<!-- gitnexus:start -->

# GitNexus — Code Intelligence

This project is indexed by GitNexus as **sora-piggy** (280 symbols, 320 relationships, 4 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/sora-piggy/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool             | When to use                   | Command                                                                 |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `query`          | Find code by concept          | `gitnexus_query({query: "auth validation"})`                            |
| `context`        | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})`                              |
| `impact`         | Blast radius before editing   | `gitnexus_impact({target: "X", direction: "upstream"})`                 |
| `detect_changes` | Pre-commit scope check        | `gitnexus_detect_changes({scope: "staged"})`                            |
| `rename`         | Safe multi-file rename        | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher`         | Custom graph queries          | `gitnexus_cypher({query: "MATCH ..."})`                                 |

## Impact Risk Levels

| Depth | Meaning                               | Action                |
| ----- | ------------------------------------- | --------------------- |
| d=1   | WILL BREAK — direct callers/importers | MUST update these     |
| d=2   | LIKELY AFFECTED — indirect deps       | Should test           |
| d=3   | MAY NEED TESTING — transitive         | Test if critical path |

## Resources

| Resource                                    | Use for                                  |
| ------------------------------------------- | ---------------------------------------- |
| `gitnexus://repo/sora-piggy/context`        | Codebase overview, check index freshness |
| `gitnexus://repo/sora-piggy/clusters`       | All functional areas                     |
| `gitnexus://repo/sora-piggy/processes`      | All execution flows                      |
| `gitnexus://repo/sora-piggy/process/{name}` | Step-by-step execution trace             |

## Self-Check Before Finishing

Before completing any code modification task, verify:

1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task                                         | Read this skill file                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md`       |
| Blast radius / "What breaks if I change X?"  | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?"             | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md`       |
| Rename / extract / split / refactor          | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md`     |
| Tools, resources, schema reference           | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md`           |
| Index, status, clean, wiki CLI commands      | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md`             |

<!-- gitnexus:end -->

# Project AI Agent Pipeline

Dự án sử dụng spec-driven development với Claude Code agents tự động hóa SDLC.

## Quy trình

| Bước         | Command                              | Agents                               |
| ------------ | ------------------------------------ | ------------------------------------ |
| 1. Specify   | `/sora-specify <pbi_id> <yêu cầu>`   | business-analyst                     |
| 2. Clarify   | `/sora-clarify <pbi_id> [notes]`     | product-manager                      |
| 3. Plan      | `/sora-plan <pbi_id> [notes]`        | solution-architect                   |
| 4. Tasks     | `/sora-tasks <pbi_id> [notes]`       | tech-lead + qc → architect + qc-lead |
| 5. Implement | `/sora-implement <pbi_id> [task_id]` | dev → qc + architect (loop)          |

## Cấu trúc thư mục theo PBI

Mỗi Product Backlog Item có thư mục riêng trong `specs/`:

```
specs/
└── {PBI_ID}/          # Ví dụ: specs/003/
    ├── spec.md        # Thông tin PBI + branch git (tạo bởi specify)
    ├── plan.md        # Giải pháp kỹ thuật (tạo bởi plan)
    ├── tasks.md       # Danh sách tasks (tạo bởi tasks)
    └── test-case.md   # Test cases (tạo bởi tasks)
```

## Command Details

### /sora-specify

- **Cú pháp**: `/sora-specify <pbi_id> <yêu cầu>`
- **Tác vụ**: Tạo branch, folder specs/{PBI_ID}/, và template spec.md với branch info
- **Ví dụ**: `/sora-specify 003 Tạo tính năng đăng nhập bằng email`

### /sora-clarify

- **Cú pháp**: `/sora-clarify <pbi_id> [nội dung mô tả bổ sung]`
- **Tác vụ**: Đọc branch từ spec.md, switch sang branch, gọi product-manager
- **Ví dụ**: `/sora-clarify 003 Xác nhận tính năng cần bảo mật`

### /sora-plan

- **Cú pháp**: `/sora-plan <pbi_id> [nội dung mô tả bổ sung]`
- **Tác vụ**: Đọc branch từ spec.md, switch sang branch, gọi solution-architect
- **Ví dụ**: `/sora-plan 003 Xác nhận yêu cầu bảo mật cho giải pháp`

### /sora-tasks

- **Cú pháp**: `/sora-tasks <pbi_id> [nội dung mô tả bổ sung]`
- **Tác vụ**: Đọc branch từ spec.md, switch sang branch, tạo tasks.md và test-case.md
- **Ví dụ**: `/sora-tasks 003 Xác nhận yêu cầu bổ sung cho tasks`

### /sora-implement

- **Cú pháp**: `/sora-implement <pbi_id> [task_id]`
- **Tác vụ**: Đọc branch từ spec.md, switch sang branch, implement tasks
- **Ví dụ**: `/sora-implement 003` (all tasks) hoặc `/sora-implement 003 task-001` (specific task)

## Files được quản lý

- `spec.md` - Giải pháp nghiệp vụ + thông tin branch
- `plan.md` - Giải pháp kỹ thuật
- `tasks.md` - Danh sách task với checkpoint
- `test-case.md` - Test cases với trạng thái

## Conventions

- Luôn chạy đủ quy trình từ specify → implement
- Sử dụng PBI ID để xác định thư mục làm việc
- Đọc branch từ spec.md để đảm bảo làm việc trên đúng nhánh
- Không skip bước review (tối đa 3 iterations cho mỗi task)
- Cập nhật checkpoint ngay sau khi task hoàn thành

## Repository rules

- Không tự động git commit / git push / tạo PR: Trợ lý KHÔNG được thực hiện các lệnh git commit, git push hoặc tự động mở Pull Request. Khi cần commit hoặc tạo PR, trợ lý sẽ soạn thay đổi, đề xuất commit message và chờ xác nhận rõ ràng từ người dùng trước khi chạy các lệnh đó.

- Hành vi cho luồng openspec (`/opsx:apply`): Khi người dùng gọi skill `/opsx:apply`, trợ lý được phép thực thi toàn bộ các task trong spec hiện tại một cách tuần tự mà không yêu cầu xác nhận bổ sung từ người dùng. (Chỉ áp dụng cho thao tác cụ thể này; các thao tác khác vẫn phải hỏi xác nhận nếu cần hành động phá hủy hoặc ảnh hưởng bên ngoài.)

- Các quy tắc an toàn gitnexus: Tiếp tục tuân thủ các yêu cầu GitNexus (ví dụ: chạy `gitnexus_impact` trước khi sửa symbol và `gitnexus_detect_changes()` trước khi commit). Nếu impact report là HIGH/CRITICAL, trợ lý phải cảnh báo và chờ chỉ thị của người dùng trước khi tiếp tục.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan at:
`specs/001-fix-pagination-giao-dich/plan.md`
<!-- SPECKIT END -->
