# AGENTS.md

## 1. Build, Lint, and Test Commands

**Build & Dev:**

- `npm run dev`: Start the Electron app in development mode.
- `npm run build`: Build the app (runs typecheck and `electron-vite build`).
- `npm run build:unpack`: Build unpacked directory.
- `npm run build:win`: Build for Windows.

**Lint & Format:**

- `npm run lint`: Run ESLint on the codebase.
- `npm run format`: Format all files using Prettier.

**Type Checking:**

- `npm run typecheck`: Run TypeScript checks for both Node and Web contexts.
- `npm run typecheck:node`: Check Node process code.
- `npm run typecheck:web`: Check Renderer process code (Vue).

**Testing:**

- There is currently **no test script** defined in `package.json`.
- To run a single test (if using Vitest/Jest in the future): Use the specific binary or script command defined in `package.json` once added.

## 2. Code Style Guidelines

### General

This project uses **Prettier** for formatting and **ESLint** for linting.

- **Single Quotes**: Yes (`singleQuote: true`).
- **Semicolons**: No (`semi: false`).
- **Print Width**: 100 characters.
- **Trailing Commas**: None.

### Imports

- Prefer ES6 module imports (`import ... from '...'`).
- Group imports: External packages first, then internal modules.
- Use absolute paths for internal modules where aliases are configured (e.g., `@renderer/*`).

### TypeScript & Vue

- **Vue Components**: Use `<script setup lang="ts">`.
- **Types**: Prefer explicit types over `any`. Use `interface` for object shapes.
- **Strict Mode**: Enabled in `tsconfig.json`.
- **Path Aliases**:
  - `@renderer/*` maps to `src/renderer/src/*`.
  - Configure in `tsconfig.web.json` and `electron.vite.config.ts`.

### Documentation & Comments

- **Function/Property/Class/File Comments**: Must be fully and concisely commented according to the file type standards (JSDoc for JS/TS, Vue Doc for components).
- **Vue Components**: Must use `<script setup lang="ts">`.

### Naming Conventions

- **Variables & Functions**: `camelCase`.
- **Vue Components**: `PascalCase` with prefix `Sora` (e.g., `SoraButton`, `SoraHeader`).
- **HTML Classes**: Use prefix `sora-` (e.g., `sora-container`, `sora-active`).
- **Constants**: `UPPER_SNAKE_CASE`.
- **Interfaces**: `PascalCase` (prefixed with `I` is optional but not enforced).

### Styling

- **CSS Preprocessor**: Use **SCSS** for all styles. Do not use plain CSS files.
- **Variables**: Create a `_variables.scss` file to define shared variables (colors, fonts, spacing) for the app.
- **Class Naming**: Follow BEM or similar methodology prefixed with `sora-` for consistency.
- **File Extensions**: All style files must use `.scss` extension (e.g., `main.scss`, `base.scss`). Convert existing `.css` files to `.scss`.

### Error Handling

- Use `try-catch` blocks for asynchronous operations.
- Log errors to console or appropriate logging service.
- Return typed `Result` objects or `void` for functions.

### Git Hooks

- This repository likely uses pre-commit hooks (check `.git/hooks` or `package.json` scripts) to enforce linting/formatting before commits.

## 3. Project Structure

```
sora-piggy/
├── .vscode/           # VS Code settings
├── build/             # Build resources
├── out/               # Compiled output
├── resources/         # Static assets
├── src/
│   ├── main/          # Electron main process
│   ├── preload/       # Preload scripts
│   └── renderer/      # Vue frontend
│       └── src/
│           ├── App.vue
│           ├── main.ts
│           └── components/
├── electron.vite.config.ts
├── electron-builder.yml
├── tsconfig.json      # Root config (references node/web)
├── tsconfig.node.json # Config for main process
└── tsconfig.web.json  # Config for renderer
```

## 4. Notes for Agents

- When modifying Vue components, ensure `lang="ts"` is present.
- When adding new dependencies, check if they are already in `package.json` to avoid version conflicts.
- Always run `npm run typecheck` before finalizing changes to ensure no TS errors.
