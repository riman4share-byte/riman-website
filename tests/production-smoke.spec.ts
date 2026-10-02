import { test, expect } from '@playwright/test';

/**
 * Production-build smoke test.
 *
 * Every other Playwright spec runs against the dev server, which can hide
 * problems that only exist in a real bundle: prerendered HTML going stale, lazy
 * chunks failing to resolve, assets 404ing after the copy, canonical tags
 * missing. This runs the same handful of journeys against `vite preview`
 * serving dist/.
 *
 * Run by CI as its own job (see .github/workflows/ci.yml). It is excluded from
 * the dev-server suite by the PRODUCTION_SMOKE=1 guard.
 */

const SMOKE = process.env.PRODUCTION_SMOKE === '1';
const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:4173';

test.describe('production bundle smoke', () => {
  test.skip(!SMOKE, 'Runs only when PRODUCTION_SMOKE=1 (see ci.yml build-smoke job)');

  const pages = [
    { path: '/', mustContain: 'Riman Fashion' },
    { path: '/collections', mustContain: 'Riman Fashion' },
    { path: '/collection/bridal', mustContain: 'Riman Fashion' },
    { path: '/product/1', mustContain: 'Riman Fashion' },
    { path: '/about', mustContain: 'Riman Fashion' },
    { path: '/faq', mustContain: 'Riman Fashion' },
    { path: '/contact', mustContain: 'Riman Fashion' },
    { path: '/gallery', mustContain: 'Riman Fashion' },
  ];

  for (const { path, mustContain } of pages) {
    test(`${path} serves, titles correctly, and has no failed requests`, async ({ page, baseURL }) => {
      const failures: string[] = [];
      page.on('response', (r) => {
        if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
      });
      page.on('pageerror', (e) => failures.push(`pageerror: ${e.message}`));

      await page.goto(`${baseURL ?? BASE}${path}`, { waitUntil: 'load' });
      await expect(page).toHaveTitle(new RegExp(mustContain));

      // Canonical + description must survive prerender injection.
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical, `${path} must have a canonical URL`).toBeTruthy();
      expect(canonical).toMatch(/^https?:\/\//);

      await page.waitForTimeout(600);
      expect(failures, `${path} had failed requests or page errors`).toEqual([]);
    });
  }

  test('the duplicate collection URLs now redirect to their canonical target', async ({ page, baseURL }) => {
    await page.goto(`${baseURL ?? BASE}/collection/evening`);
    await page.waitForURL('**/collection/couture', { timeout: 15000 });

    await page.goto(`${baseURL ?? BASE}/collection/rental`);
    await page.waitForURL('**/collection/all', { timeout: 15000 });
  });

  test('a deep link into a lazy-loaded route resolves', async ({ page, baseURL }) => {
    // /checkout pulls the checkout chunk; a bad chunk reference only shows up
    // against the built output. Seed a bag first, otherwise the route renders
    // its empty state and the form we want to exercise never mounts.
    await page.addInitScript(() => {
      localStorage.setItem('riman_lang', 'en');
      localStorage.setItem(
        'riman_cart',
        JSON.stringify([
          {
            id: '1',
            name: 'Fleur Eternelle Bridal Gown',
            category: 'Bridal Gown',
            productType: 'both',
            intent: 'sale',
            salePrice: 42000,
            rentalPrice: 4200,
            securityDeposit: 8400,
            quantity: 1,
            selectedSize: 'M',
            images: [],
          },
        ]),
      );
    });
    await page.goto(`${baseURL ?? BASE}/checkout`);
    await expect(page.locator('#co-first')).toBeVisible({ timeout: 20000 });
  });

  test('assets referenced by the build actually resolve', async ({ page, baseURL }) => {
    const missing: string[] = [];
    page.on('response', (r) => {
      if (r.status() === 404) missing.push(r.url());
    });
    await page.goto(`${baseURL ?? BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    expect(missing).toEqual([]);
  });
});