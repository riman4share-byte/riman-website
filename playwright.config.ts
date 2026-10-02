import { defineConfig } from '@playwright/test';

// Single config covering BOTH E2E suites (tests/ and e2e/). The former
// duplicate playwright.config.js ran only ./tests and was removed.
//
// The suite starts its own dev server on a dedicated port rather than reusing
// whatever happens to be running on 3001. Two reasons: a stale server used to
// silently serve the tests, and payment-journey.spec.ts needs the Stripe
// checkout endpoint configured in the environment before the bundle is
// transformed, which the ambient dev server cannot be relied on to have.
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
    baseURL: 'http://localhost:3101',
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
    trace: 'on-first-retry',
  },
  // Chromium runs everything. WebKit runs a focused set only: it is the engine
  // behind Safari/iOS, which is where most of this audience browses, and it has
  // historically differed on flex/grid sizing and sticky headers. Running all
  // 230 specs on it would double CI time for little extra signal.
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    {
      name: 'webkit',
      testMatch: /(navigation|click-verification|checkout|payment-journey)\.spec\.(ts|js)/,
      use: { browserName: 'webkit' },
    },
  ],
  // Two servers: the stub Stripe gateway the app is pointed at, and the dev
  // server under test. The stub is a real HTTP server rather than a Playwright
  // route because interception is unreliable for same-origin fetch in WebKit.
  webServer: [
    {
      command: 'node scripts/stub-stripe-server.mjs',
      url: 'http://localhost:3199/hosted-checkout',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'npm run dev -- --port 3101 --strictPort',
      url: 'http://localhost:3101',
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        // Points at the local stub gateway so isStripeConfigured() is true and
        // the checkout path is genuinely exercised.
        VITE_STRIPE_CHECKOUT_ENDPOINT: 'http://localhost:3199/create-checkout',
      },
    },
  ],
});