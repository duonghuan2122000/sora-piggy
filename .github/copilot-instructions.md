# Copilot instructions for Sora Piggy (tóm tắt dành cho AI assistants)

Lưu ý ngôn ngữ: repository này yêu cầu trả lời bằng tiếng Việt (xem CLAUDE.md / AGENTS.md).

1. Build, test, lint (quick commands)

- Dev (hot-reload Electron + Vite): npm run dev
- Preview production build: npm run start
- Build (includes typecheck): npm run build
- Build variants: npm run build:win | npm run build:mac | npm run build:linux | npm run build:unpack
- Rebuild native deps: npm run rebuild

- Lint: npm run lint
- Format: npm run format
- Type checks: npm run typecheck (node + web)

- Unit tests (Vitest): npm run test or npm run test:unit
- Watch tests: npm run test:watch
- Run a single test by name: npm run test -- -t "<pattern>" OR npx vitest -t "<pattern>"
- Run a single test file: npx vitest run path/to/file.spec.ts

(Chạy npm run typecheck và npm run lint trước khi commit.)

2. High-level architecture (big picture)

- Desktop app: Electron main process (src/main), a preload script (src/preload) exposing a safe API via contextBridge, and a Vue 3 renderer (src/renderer/src).
- Main process: initializes SQLite (better-sqlite3), exposes IPC handlers for DB operations and app lifecycle.
- Preload: an explicit contextBridge API that the renderer calls (e.g., window.api.getTransactions()).
- Renderer: Vue 3 Composition API, Pinia for state, Vue Router for navigation, Ant Design Vue UI components; code organized into views, components, stores, composables.
- Database: local SQLite DB (better-sqlite3). Default DB path referenced in docs: ~/.config/Sora Piggy/sora-piggy.db. DB helpers live under src/main (see database.ts).
- Build toolchain: Vite + electron-vite + electron-builder; separate tsconfigs: tsconfig.node.json (main) and tsconfig.web.json (renderer). Path aliases (eg. @renderer/\*) configured in tsconfig.web.json / electron.vite.config.ts.

  2.1) E2E / Playwright (quick)

- Playwright is available as a dev dependency. Example commands:
  - Run all E2E tests: npx playwright test
  - Run a specific test file: npx playwright test tests/e2e/example.spec.ts
  - Run with headed mode: npx playwright test --headed
- E2E tests typically live under tests/e2e/ (if present). Ensure app is built or dev server is running depending on test setup.

3. Key repository-specific conventions and rules

- Language rule for AI: always respond in Vietnamese (CLAUDE.md / AGENTS.md state this as required).
- Vue SFCs: use <script setup lang="ts"> everywhere. Prefer explicit types; avoid any unless temporary with TODO.
- Styling: SCSS only; central variables in src/renderer/src/assets/scss/\_variables.scss. CSS classes prefixed with sora- (BEM-like).
- Formatting & lint: Prettier is source of truth (single quotes, no semicolons, ~100ch). Run npm run format and npm run lint.
- Imports: ES modules; order external → absolute aliases → relative. Prefer path aliases over deep relative paths.
- UI components: Khi sử dụng component dùng chung nằm tại src/renderer/src/components/ui-wrappers, luôn import qua barrel tại src/renderer/src/components/ui (ví dụ: import { SoraButton } from '@renderer/components/ui') thay vì import trực tiếp từ ui-wrappers.
- Naming: camelCase for variables/functions; PascalCase for components (shared components often prefixed with Sora, e.g., SoraButton); constants UPPER_SNAKE_CASE; types/interfaces PascalCase.
- Tests: use Vitest. Place unit tests next to implementation files where practical. Use npx vitest -t to run by test name.
- Commenting: Luôn comment code cho các biến, hàm và file. Dùng JSDoc/TSDoc cho các hàm/đối tượng xuất khẩu (public) và chú thích ngắn cho biến/hàm nội bộ để giải thích ý định; thêm header comment ở đầu file khi cần để tóm tắt mục đích module.

4. Agent & commit safety rules (important for automated agents)

- Do NOT auto-run git commit / git push / open PRs. Prepare changes and ask user before committing/pushing.
- If GitNexus or similar is available, run impact analysis before editing exported symbols (gitnexus_impact...) and run gitnexus_detect_changes() before committing. If impact analysis reports HIGH/CRITICAL, stop and ask for human review.
- Run typecheck + lint before proposing or committing changes.

5. Quick references (paths and commands)

- Main entry: src/main/index.ts
- DB helpers: src/main/database.ts
- Preload API: src/preload/index.ts
- Renderer entry: src/renderer/src/main.ts
- Run single test: npx vitest run path/to/file.spec.ts or npm run test -- -t "pattern"

  5.1) Pre-commit checklist (recommended for agents)

- npm run typecheck && npm run lint && npx vitest --run --reporter=dot || npx vitest -t "pattern" (run relevant test subset)
- Ensure no native rebuild omitted: npm run rebuild if native deps changed

  5.2) Commit message templates (agent should suggest)

- feat: short description — for new features
- fix: short description — for bug fixes
- perf: short description — performance improvements
- chore: short description — non-functional changes (deps, docs)

6. When editing code

- For any exported symbol change, prefer running call-graph / impact analysis (gitnexus) and then run full typecheck.
- Keep commits small and focused; include a clear imperative commit message when user asks to commit.

--

File created from repository docs (README.md, AGENTS.md, CLAUDE.md) and package.json (scripts). If muốn, có thể mở rộng phần này để bao gồm checklist pre-commit hoặc mẫu commit message dành cho agents.

---

Gợi ý cải tiến đã được áp dụng (nội dung bổ sung):

- Prerequisites: thêm "Node.js 18+" (lấy từ README) để Copilot biết yêu cầu môi trường.
- Ghi chú đường dẫn DB trên Windows: Electron lưu DB trong app.getPath('userData') — trên Windows thường sẽ là %APPDATA%\Sora Piggy\sora-piggy.db (kiểm tra bằng app.getPath('userData')).
- MCP servers (Playwright): thêm hướng dẫn nhanh chạy E2E và gợi ý tạo cấu hình MCP nếu cần. Ví dụ: `npx playwright test` để chạy E2E; test file cụ thể: `npx playwright test tests/e2e/example.spec.ts`.

Nếu muốn, có thể mở rộng thêm: checklist pre-commit, mẫu commit message, hoặc tạo file cấu hình MCP ví dụ (.github/mcp-playwright.yml).
