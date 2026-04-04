# AGENTS.md

## 1. Build, Lint, and Test Commands

**Build & Dev:**

- `npm run dev`: Start the Electron app in development mode.
- `npm run build`: Build the app (runs typecheck and `electron-vite build`).
- `npm run build:unpack`: Build unpacked directory.
- `npm run build:win`: Build for Windows.

**Native Modules:**

- `npm run rebuild`: Rebuild native modules (like better-sqlite3) for Electron. This is automatically run during `npm install` via the postinstall script.

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

#### Theme

- **Default Theme**: All views and components should use **light color theme** as the default theme for the app.
- **Light Theme Variables**: Use the following variables from `_variables.scss` for light theme styling:
  - **Backgrounds**: `$bg-primary-light`, `$bg-secondary-light`, `$bg-tertiary-light`
  - **Text Colors**: `$text-primary-light`, `$text-secondary-light`, `$text-tertiary-light`
- **Dark Theme Variables**: The existing dark theme variables (`$bg-primary`, `$bg-secondary`, `$bg-tertiary`, `$text-primary`, `$text-secondary`, `$text-tertiary`) are retained for reference but should not be used in default views.

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
