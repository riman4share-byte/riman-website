import { test, expect, type Page } from '@playwright/test';

// Admin smoke tests. Credentials come from the environment ONLY. They used to
// fall back to a hardcoded password committed to this repository; that has been
// removed, so the suite skips rather than authenticating with a leaked secret.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_READY = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

const ADMIN_ROUTES = [
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/bookings',
  '/admin/appointments',
  '/admin/content',
  '/admin/gallery',
  '/admin/reviews',
  '/admin/settings',
];

function captureErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

const isTransient = (e: string) => /Failed to fetch|NetworkError|net::ERR|ERR_NAME_NOT_RESOLVED/i.test(e);

async function loginAsAdmin(page: Page) {
  await page.goto('/auth');
  await page.fill('input[type="email"]', ADMIN_EMAIL!);
  await page.fill('input[type="password"]', ADMIN_PASSWORD!);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForURL('**/admin**', { timeout: 15000 });
}

test('public home loads with a title and no hard errors', async ({ page }) => {
  const errors = captureErrors(page);
  await page.goto('/');
  await expect(page).toHaveTitle(/Riman Fashion/);
  // NOTE: no networkidle — Vite HMR websocket keeps connections open in dev.
  await page.waitForTimeout(2000);
  expect(errors.filter((e) => !isTransient(e))).toEqual([]);
});

test.describe('admin', () => {
  test.skip(!ADMIN_READY, 'Set ADMIN_EMAIL and ADMIN_PASSWORD to run the admin suite');

  test('admin can log in and reach the dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  for (const route of ADMIN_ROUTES) {
    test(`admin route ${route} renders without hard errors`, async ({ page }) => {
      const errors = captureErrors(page);
      await loginAsAdmin(page);
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // The shared AdminLayout sidebar proves the route mounted (not bounced to /auth).
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
      expect(errors.filter((e) => !isTransient(e))).toEqual([]);
    });
  }
});