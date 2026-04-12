Test plan for PBI-18: Update primary color to Ant default and use SCSS variables.

Unit tests
- test/unit/variables.test.ts: ensures $color-primary is set to #1890ff

Integration tests
- test/integration/theme-integration.test.ts: checks ant-theme.scss uses SCSS variables (no CSS vars)

E2E tests
- test/e2e/visual-theme.spec.ts: Playwright test that verifies a primary button renders with Ant default color (expects dev server at http://localhost:3000)

How to run
- Unit & integration: npm run test
- E2E (Playwright): npx playwright test test/e2e --config=playwright.config.ts

Notes
- E2E test expects dev server running. Adjust URL/selector if your dev server differs.
