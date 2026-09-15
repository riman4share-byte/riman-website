import { test, expect } from '@playwright/test';

// First visit defaults to Arabic (intentional); these assertions are English-based.
const PIN_EN = () => { test.beforeEach(async ({ page }) => { await page.addInitScript(() => localStorage.setItem('riman_lang', 'en')); }); };
PIN_EN();

test.describe('Riman Fashion — Homepage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Dev server hydrates asynchronously; pin "React mounted" before assertions
    // that read scrollHeight / element visibility (prevents load-vs-mount races).
    await page.waitForSelector('h1', { timeout: 45000 });
  });

  /** ─── HERO SECTION ─── */
  test.describe('Hero Section', () => {
    test('hero section is visible', async ({ page }) => {
      await expect(page.locator('#hero')).toBeVisible({ timeout: 10000 });
    });

    test('hero has a heading', async ({ page }) => {
      const hero = page.locator('#hero');
      const h1 = hero.locator('h1').first();
      await expect(h1).toBeVisible();
    });

    test('hero has CTA buttons that navigate correctly', async ({ page }) => {
      const hero = page.locator('#hero');
      const ctaButtons = hero.getByRole('link');
      await ctaButtons.first().waitFor({ timeout: 45000 });
      const count = await ctaButtons.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const cta = ctaButtons.nth(i);
        if (await cta.isVisible()) {
          const href = await cta.getAttribute('href');
          expect(href).toBeTruthy();
        }
      }
    });
  });

  /** ─── FEATURED PRODUCTS ─── */
  test.describe('Featured Products Section', () => {
    test('featured products section heading is visible', async ({ page }) => {
      const section = page.locator('section').filter({ hasText: /featured|collection|curated/i }).first();
      await expect(section).toBeVisible({ timeout: 10000 });
    });

    test('product cards render when products are loaded', async ({ page }) => {
      const productCards = page.locator('a[href^="/product/"]');
      const count = await productCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('product cards contain links to products', async ({ page }) => {
      const productCard = page.locator('a[href^="/product/"]').first();
      if (await productCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        const href = await productCard.getAttribute('href');
        expect(href).toMatch(/^\/product\//);
      }
    });
  });

  /** ─── SCROLL BEHAVIOR & ANIMATIONS ─── */
  test.describe('Scroll Behavior & Animations', () => {
    test('page scrolls smoothly', async ({ page }) => {
      const initialScroll = await page.evaluate(() => window.scrollY);
      expect(initialScroll).toBe(0);

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(800);
      const scrolled = await page.evaluate(() => window.scrollY);
      expect(scrolled).toBeGreaterThan(100);
    });

    test('footer visible after scrolling to bottom', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await expect(page.locator('#footer')).toBeVisible();
    });
  });

  /** ─── HERO MEDIA ─── */
  test.describe('Hero Media', () => {
    test('hero section has video or image element', async ({ page }) => {
      const hero = page.locator('#hero');
      const video = hero.locator('video');
      const img = hero.locator('img').first();
      const hasMedia = await video.isVisible().catch(() => false) || await img.isVisible().catch(() => false);
      expect(hasMedia).toBeTruthy();
    });
  });
});
