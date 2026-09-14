import { defineConfig } from '@playwright/test';

// Single config covering BOTH E2E suites (tests/ and e2e/). The former
// duplicate playwright.config.js ran only ./tests and was removed.
export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.{ts,js}', 'e2e/**/*.spec.{ts,js}'],
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 1,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
