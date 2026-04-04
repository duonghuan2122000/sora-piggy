<!--
Sync Impact Report
==================
Version change: [UNINITIALIZED] → 1.0.0 (initial constitution)
Modified principles: N/A (new file)
Added sections: Core Principles (5), Technical Standards, Development Workflow, Governance
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - No change needed
  ✅ .specify/templates/spec-template.md - No change needed
  ✅ .specify/templates/tasks-template.md - No change needed
Follow-up TODOs: None
-->

# Sora Piggy Constitution

## Core Principles

### I. Local-First Architecture (NON-NEGOTIABLE)

All data must be stored locally on the user's machine using SQLite. The application must function fully offline without requiring internet connectivity. Cloud synchronization is optional and must never block core functionality.

### II. Type-Safe Development (NON-NEGOTIABLE)

All code must be written in TypeScript. No `any` types are permitted in production code. All database operations, IPC handlers, and component props must have proper type definitions.

### III. Data Integrity & Validation

All user input must be validated at multiple layers: client-side validation in Vue components, server-side validation in database operations, and schema enforcement via SQLite constraints. No data corruption or loss should occur during operations.

### IV. Component-Based UI Architecture

UI must be built using Vue 3 Composition API with reusable, scoped components. State management must use Pinia stores. Element Plus components are preferred but custom components must follow established patterns.

### V. Offline-First User Experience

The app must provide seamless offline experience. All features must work without network connectivity. Network-dependent features must have clear offline states and graceful degradation.

## Technical Standards

### Technology Stack

- **Frontend**: Vue 3 + Composition API + TypeScript + Element Plus UI
- **State Management**: Pinia stores
- **Styling**: SCSS with CSS variables
- **Backend**: Electron main process with IPC handlers
- **Database**: SQLite via better-sqlite3 (local storage)
- **Build Tool**: Vite

### Code Quality Requirements

- All code must pass TypeScript type checking (`npm run typecheck`)
- ESLint must pass with no errors (`npm run lint`)
- Code must be formatted with Prettier (`npm run format`)
- No test files exist currently - consider adding Vitest for future tests

### Database Standards

- SQLite database stored in user's userData directory: `~/.config/Sora Piggy/sora-piggy.db`
- Transactions must be used for any multi-operation database writes
- Queries must be efficient (synchronous better-sqlite3 operations)
- Schema must include: transactions, categories, accounts tables

## Development Workflow

### Project Structure

```
src/
├── main/                    # Electron main process
│   ├── index.ts            # App entry point, IPC handlers
│   └── database.ts         # SQLite CRUD operations
├── preload/                 # Preload scripts (context bridge)
│   └── index.ts            # Exposes IPC APIs to renderer
└── renderer/                # Vue frontend
    └── src/
        ├── App.vue
        ├── main.ts
        ├── router/
        ├── stores/
        ├── views/
        ├── layouts/
        ├── components/
        ├── types/
        ├── constants/
        ├── locales/
        └── assets/scss/
```

### IPC Communication Pattern

- Main process registers IPC handlers for database operations
- Preload script uses contextBridge to expose APIs safely
- Renderer calls `window.api.methodName()` for all IPC calls
- IPC calls are async in renderer, synchronous in main

### Code Review Checklist

- [ ] TypeScript type checking passes
- [ ] ESLint passes with no errors
- [ ] Code follows existing patterns and conventions
- [ ] IPC handlers properly exposed via preload
- [ ] Database operations use transactions for writes
- [ ] Components follow Vue 3 Composition API patterns

## Development Workflow - AI Agent Pipeline

Dự án sử dụng spec-driven development với Claude Code agents tự động hóa SDLC.

### Quy trình chi tiết

| Bước         | Command                                          | Agents                               |
| ------------ | ------------------------------------------------ | ------------------------------------ |
| 1. Specify   | `/sora-specify <pbi_id> <yêu cầu>`              | business-analyst                     |
| 2. Clarify   | `/sora-clarify <pbi_id> [notes]`                | product-manager                      |
| 3. Plan      | `/sora-plan <pbi_id> [notes]`                   | solution-architect                   |
| 4. Tasks     | `/sora-tasks <pbi_id> [notes]`                  | tech-lead + qc → architect + qc-lead |
| 5. Implement | `/sora-implement <pbi_id> [task_id]`            | dev → qc + architect (loop)          |

### Cấu trúc thư mục theo PBI

Mỗi Product Backlog Item có thư mục riêng trong `specs/`:

```
specs/
└── {PBI_ID}/          # Ví dụ: specs/003/
    ├── spec.md        # Thông tin PBI + branch git
    ├── plan.md        # Giải pháp kỹ thuật
    ├── tasks.md       # Danh sách tasks
    └── test-case.md   # Test cases
```

### Command Details

#### /sora-specify
- **Cú pháp**: `/sora-specify <pbi_id> <yêu cầu>`
- **Tác vụ**: Tạo branch, folder specs/{PBI_ID}/, và template spec.md với branch info
- **Ví dụ**: `/sora-specify 003 Tạo tính năng đăng nhập bằng email`

#### /sora-clarify
- **Cú pháp**: `/sora-clarify <pbi_id> [nội dung mô tả bổ sung]`
- **Tác vụ**: Đọc branch từ spec.md, switch sang branch, gọi product-manager
- **Ví dụ**: `/sora-clarify 003 Xác nhận tính năng cần bảo mật`

#### /sora-plan
- **Cú pháp**: `/sora-plan <pbi_id> [nội dung mô tả bổ sung]`
- **Tác vụ**: Đọc branch từ spec.md, switch sang branch, gọi solution-architect
- **Ví dụ**: `/sora-plan 003 Xác nhận yêu cầu bảo mật cho giải pháp`

#### /sora-tasks
- **Cú pháp**: `/sora-tasks <pbi_id> [nội dung mô tả bổ sung]`
- **Tác vụ**: Đọc branch từ spec.md, switch sang branch, tạo tasks.md và test-case.md
- **Ví dụ**: `/sora-tasks 003 Xác nhận yêu cầu bổ sung cho tasks`

#### /sora-implement
- **Cú pháp**: `/sora-implement <pbi_id> [task_id]`
- **Tác vụ**: Đọc branch từ spec.md, switch sang branch, implement tasks
- **Ví dụ**: `/sora-implement 003` (all tasks) hoặc `/sora-implement 003 task-001` (specific task)

### Files được quản lý

- `spec.md` - Giải pháp nghiệp vụ + thông tin branch
- `plan.md` - Giải pháp kỹ thuật
- `tasks.md` - Danh sách task với checkpoint
- `test-case.md` - Test cases với trạng thái

### Conventions

- Luôn chạy đủ quy trình từ specify → implement
- Sử dụng PBI ID để xác định thư mục làm việc
- Đọc branch từ spec.md để đảm bảo làm việc trên đúng nhánh
- Không skip bước review (tối đa 3 iterations cho mỗi task)
- Cập nhật checkpoint ngay sau khi task hoàn thành

## Governance

### Amendment Procedure

1. Propose changes via pull request with clear justification
2. Update constitution version according to semantic versioning:
   - MAJOR: Backward incompatible principle changes
   - MINOR: New principles or substantial guidance additions
   - PATCH: Clarifications and wording improvements
3. Update `LAST_AMENDED_DATE` to current date
4. Document changes in Sync Impact Report at top of file
5. Ensure all templates remain consistent with constitution

### Compliance Review

- All PRs must verify compliance with constitution principles
- Code review must check for TypeScript type safety
- Database operations must respect local-first architecture
- UI changes must follow component-based patterns

### Versioning Policy

- Constitution versions follow semantic versioning (MAJOR.MINOR.PATCH)
- Version changes must be documented in Sync Impact Report
- Retroactive updates to past versions are not permitted

**Version**: 1.0.0 | **Ratified**: 2026-04-04 | **Last Amended**: 2026-04-04
