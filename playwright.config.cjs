/** Minimal Playwright config to avoid global parsing issues */
module.exports = {
  testDir: 'tests/e2e',
  timeout: 120000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  reporter: [['list']],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', headless: true }
    }
  ],
  use: { actionTimeout: 0 }
};
