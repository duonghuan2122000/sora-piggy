AGENTS.md

I only speak Vietnamese so you must always respond in Vietnamese.

Assume I know little to no english.

<CRITICAL>
  ALWAYS RESPOND IN VIETNAMESE
</CRITICAL>

Purpose: Operational guide for autonomous agents working in this repository. This file
collects build/test/lint commands, coding style rules, safety checks and minimal
process guidance agents must follow before editing and committing code.

1. Build, lint & test (commands you'll use frequently)

- Development: `npm run dev` — start the Electron + Vite development environment.
- Build: `npm run build` — runs TypeScript checks and `electron-vite build`.
- Build variants: `npm run build:unpack`, `npm run build:win`.
- Rebuild native modules: `npm run rebuild` — required for native deps (better-sqlite3,
  etc.). This also runs automatically on `npm install` via postinstall.

- Lint: `npm run lint` — run ESLint across the codebase.
- Format: `npm run format` — run Prettier using repo configuration.
- Type checks: `npm run typecheck` (root), `npm run typecheck:node`, `npm run typecheck:web`.

Testing notes

- This repository currently does not include an opinionated test runner entry in
  `package.json`. When adding tests prefer Vitest (Vite-friendly) or Jest.
- Examples for running a single test once Vitest is added:
  - By file: `npx vitest run path/to/file.spec.ts`
  - By name: `npx vitest -t "partial name of test"`
- Examples for Jest:
  - By file: `npx jest path/to/file.test.ts`
  - By name: `npx jest -t "partial name of test"`
- If you add tests, ensure `npm run typecheck` and `npm run lint` pass before committing.

2. Code style and conventions

Formatting & linting

- Prettier is the source of truth for formatting. Project preferences: single quotes,
  no semicolons, ~100 char print width. Use `npm run format` to apply formatting.
- ESLint is mandatory for code quality. Run `npm run lint` and fix problems early.

Imports

- Use ES modules: `import X from 'x'`.
- Import order: external packages, then absolute aliases, then local relative imports.
- Avoid deep relative imports (`../../../foo`), prefer path aliases where configured.

TypeScript & Vue

- Vue SFCs: use `<script setup lang="ts">` for all components.
- Prefer explicit typing; avoid `any` unless temporary with a clear TODO.
- Use `interface` for object shapes and `type` for unions/aliases.
- Keep `strict` compiler options enabled in tsconfig and run `npm run typecheck`.
- Path alias reference: `@renderer/*` -> `src/renderer/src/*` (configured in
  `tsconfig.web.json` and `electron.vite.config.ts`).

Naming conventions

- Variables & functions: `camelCase`.
- Components: `PascalCase` with `Sora` prefix for shared components (e.g. `SoraButton`).
- CSS classes: prefix with `sora-` followed by BEM-like structure (e.g.
  `sora-card__title`).
- Constants: `UPPER_SNAKE_CASE`.
- Types/interfaces: `PascalCase` (optional `I` prefix is allowed but not required).

Styling

- Use SCSS exclusively for styles. Do not add plain `.css` files.
- Create a central `_variables.scss` for colors, spacing, typography and theme tokens.
- Default theme is light; use light theme variables by default. Dark theme tokens may
  exist for opt-in features.

Documentation and comments

- Public functions, modules and complex algorithms should have concise JSDoc comments.
- One-line comments are acceptable for small helpers when intent is not obvious.
- Vue components: list props and emitted events in the component's script section.

Error handling and async

- Wrap asynchronous calls with `try { await ... } catch (err) {}` where failures are
  expected or user-visible.
- When rethrowing, preserve the original error or attach contextual information.
- Prefer returning typed result objects (Result<T, E>) for predictable flow in
  frequently exercised code paths.

3. Git, commits and CI safety

- Keep commits small and focused. Use an imperative subject line (e.g. "fix: ...",
  "feat: ..."). Include a short body if the reason is not obvious.
- Do not bypass pre-commit hooks. If hooks fail, fix the underlying issues.
- If you change public API (exported functions/classes), add or update type tests and
  run typecheck and lint locally.

4. Agent safety checks and GitNexus guidance

- If GitNexus (or similar code-intel tooling) is available, run an impact analysis
  before editing exported or widely-used symbols: `gitnexus_impact({target: "Symbol",
direction: "upstream"})`.
- Run `gitnexus_detect_changes({scope: "staged"})` before committing so the agent can
  verify only expected symbols changed.
- If impact analysis reports HIGH/CRITICAL risk, stop and ask for human review.

Cursor & Copilot rules

- No Cursor rules (`.cursor/rules/` or `.cursorrules`) were detected in the repository at
  the time this file was generated.
- No Copilot instructions file (`.github/copilot-instructions.md`) was detected.
- If either file is added later, update this AGENTS.md summary so agents incorporate
  repository-specific prompts or suppression rules.

5. Project layout (quick reference)

- `src/main` — Electron main process and node utilities.
- `src/preload` — Preload scripts that expose safe APIs to renderer.
- `src/renderer/src` — Vue renderer app (App.vue, main.ts, components/, styles/).
- `electron.vite.config.ts` — Vite/Electron integration and alias configuration.
- `tsconfig.json`, `tsconfig.node.json`, `tsconfig.web.json` — TypeScript configs.

Quick checklist for autonomous edits

- Pull latest main and run `npm ci` / `npm install` when dependencies change.
- Run `npm run typecheck` and `npm run lint` locally; fix errors before pushing.
- If touching exported symbols: run `gitnexus_impact(...)` and inspect dependents.
- Add or update unit tests; run the single-test command (Vitest/Jest examples above).
- Run `gitnexus_detect_changes({scope: "staged"})` and commit only after verification.

Helpful commands summary (copy-paste)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run format`
- `npm run typecheck`
- `npx vitest run path/to/test` — run a single Vitest file (if added)
- `npx vitest -t "test name"` — run a single Vitest test by name

If you make structural changes (moves/renames) consider running a full typecheck and
reviewing call sites; prefer small, incremental commits. When uncertain, open a draft PR
and request a short code review from a maintainer.

End of AGENTS.md
