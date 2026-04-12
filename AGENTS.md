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

Testing

- Unit tests: `npm run test:unit` hoặc `npx vitest run` (Vitest)
- E2E tests: Playwright (xem `tests/e2e/`)
- Run single test: `npx vitest run path/to/file.spec.ts`
- Run single test by name: `npx vitest -t "test name"`
- Watch mode: `npm run test:watch`
- Ensure typecheck + lint pass before committing.

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
- Add or update unit tests; run the single-test command (Vitest examples above).
- Run `gitnexus_detect_changes({scope: "staged"})` and commit only after verification.

Helpful commands summary (copy-paste)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run format`
- `npm run typecheck`
- `npx vitest run path/to/test` — run a single Vitest file
- `npx vitest -t "test name"` — run a single Vitest test by name

If you make structural changes (moves/renames) consider running a full typecheck and
reviewing call sites; prefer small, incremental commits. When uncertain, open a draft PR
and request a short code review from a maintainer.

End of AGENTS.md

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
