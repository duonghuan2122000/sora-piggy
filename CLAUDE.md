# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
```

## Architecture Overview

**Sora Piggy** is a local-first desktop expense tracking app built with:

- **Electron** for desktop shell (main process + preload)
- **Vue 3 + Composition API** for the renderer (UI)
- **TypeScript** for type safety
- **SQLite** via `better-sqlite3` for local data storage
- **Pinia** for state management
- **Element Plus** for UI components
- **SCSS** with CSS variables for theming

### Project Structure

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
   - Initializes SQLite database on app startup
   - Registers IPC handlers for database operations
   - Example: `ipcMain.handle('db:getAllTransactions', () => getAllTransactions())`

2. **Preload Script** (`src/preload/index.ts`):
   - Uses `contextBridge` to safely expose IPC APIs to renderer
   - Example: `getTransactions: () => ipcRenderer.invoke('db:getAllTransactions')`

3. **Renderer (Vue)** (`src/renderer/src/`):
   - Calls `window.api.getTransactions()` from components
   - Stores returned data in Pinia stores or component refs
   - UI components render the data

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

- **SCSS** with CSS variables defined in `src/renderer/src/assets/scss/_variables.scss`
- **CSS Modules not used** - scoped styles in Vue components
- **Element Plus** for base UI components with custom styling
- Variables are auto-imported via `electron.vite.config.ts`:
  ```scss
  @use '@scss/variables' as *;
  ```

## TypeScript Configuration

- **Two tsconfig files**: `tsconfig.node.json` (main) and `tsconfig.web.json` (renderer)
- **Type aliases** configured:
  - `@renderer` → `src/renderer/src`
  - `@assets` → `src/renderer/src/assets`
  - `@scss` → `src/renderer/src/assets/scss`

## Database Schema

SQLite database at `~/.config/Sora Piggy/sora-piggy.db` (userData directory):

- **transactions**: id, name, description, category, account, amount, time
- **categories**: id, name, type, icon, color
- **accounts**: id, name, type, balance

## Testing

No test files currently exist in the repository. Consider using Vitest for future tests.

## Development Tips

- Always run `npm run typecheck` before building to catch TypeScript errors
- Database operations use synchronous better-sqlite3 - keep queries efficient
- IPC calls are async in renderer, synchronous in main
- Use `@renderer/` alias for cleaner imports in Vue files
- For styling issues, check `_variables.scss` for available CSS variables

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **sora-piggy** (171 symbols, 182 relationships, 0 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

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

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/sora-piggy/context` | Codebase overview, check index freshness |
| `gitnexus://repo/sora-piggy/clusters` | All functional areas |
| `gitnexus://repo/sora-piggy/processes` | All execution flows |
| `gitnexus://repo/sora-piggy/process/{name}` | Step-by-step execution trace |

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

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
