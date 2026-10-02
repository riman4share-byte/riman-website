import { defineConfig } from '@playwright/test';

/**
 * Smoke configuration for the PRODUCTION bundle.
 *
 * Deliberately has no `webServer`: the caller serves an already-built dist/ with
 * `vite preview` (CI downloads the artifact from the build job). Running the
 * dev server here would defeat the purpose - this suite exists to catch
 * failures that only appear in a real bundle.
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['tests/production-smoke.spec.ts'],
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.SMOKE_BASE_URL || 'http://localhost:4173',
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
    trace: 'on-first-retry',
  },
});