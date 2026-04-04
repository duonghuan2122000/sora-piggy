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
