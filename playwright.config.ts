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
    // Must match the port `npm run dev` binds (vite --port=3001). This was
    // 3002 while the specs hardcoded 3001, so webServer polled a port the dev
    // script never opened and every origin-absolute goto hit a dead server.
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Two servers: the stub Stripe gateway the payment spec drives, and the app
  // pointed at it. Without the stub the two happy-path checkout tests can never
  // redirect, so they must start together (this pairing was dropped in 4cb0680
  // and the payment suite has been unrunnable since).
  webServer: [
    {
      command: 'node scripts/stub-stripe-server.mjs',
      url: 'http://localhost:3199/hosted-checkout',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:3001',
      reuseExistingServer: true,
      timeout: 120000,
      env: {
        VITE_STRIPE_CHECKOUT_ENDPOINT: 'http://localhost:3199/create-checkout',
      },
    },
  ],
});