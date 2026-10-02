import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // testDir '.' with no testMatch collects *.test.ts as well, so Playwright
  // tried to load the vitest suites (vite/static.test.ts) and aborted with
  // "Total: 0 tests in 0 files" — the entire e2e suite silently stopped
  // running. Restrict collection to *.spec.*, which is where the Playwright
  // suites live (tests/ and e2e/).
  testDir: '.',
  testMatch: '**/*.spec.{ts,js}',
  // testDir '.' also reaches into agent worktree checkouts under .kilo/ and
  // .worktrees/, which contain whole copies of this suite. They were being
  // collected and run as duplicates, and stale copies of the specs there
  // reported failures that no longer exist in the real tree.
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.kilo/**',
    '**/.worktrees/**',
    '**/graphify-out/**',
    '**/test-results/**',
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3002',
    reuseExistingServer: true,
    timeout: 120000,
  },
});