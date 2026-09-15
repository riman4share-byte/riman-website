import { test, expect } from '@playwright/test';

// Phase-1 couture token surgery must be observable in computed styles.
test('couture palette + Prata display face are active', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);

  const probe = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const h1 = document.querySelector('h1')!;
    const warm = document.querySelector('main p.text-stone-600') ?? document.querySelector('footer p');
    return {
      gold: cs.getPropertyValue('--color-gold').trim().toLowerCase(),
      onyx: cs.getPropertyValue('--color-onyx').trim().toLowerCase(),
      h1Font: getComputedStyle(h1).fontFamily,
      warmColor: warm ? getComputedStyle(warm).color : null,
    };
  });

  expect(probe.gold).toBe('#b08d57');
  expect(probe.onyx).toBe('#0f0d0a');
  expect(probe.h1Font).toMatch(/Prata/);
  // stone-600 must be the warm taupe #655C49, not the old cool #78716c
  expect(probe.warmColor).toBe('rgb(101, 92, 73)');
});

test('hero CTAs are borderless ink + ghost-underline, no boxes', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const primary = page.locator('#hero a[href="/appointment"]');
  await primary.waitFor({ timeout: 45000 });
  const styles = await primary.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { borderWidth: cs.borderTopWidth, boxShadow: cs.boxShadow, bg: cs.backgroundColor };
  });
  expect(styles.borderWidth).toBe('0px');
  expect(styles.boxShadow).toBe('none');
  expect(styles.bg).toBe('rgb(15, 13, 10)'); // couture ink
  await expect(page.locator('#hero .btn-couture-ghost')).toHaveCount(1);
});

test('couture hairline form-field base rule is active', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main input', { timeout: 15000 }).catch(() => {});
  // Probes the @layer base rule itself: a class-less input (as used by dynamic
  // admin/booking forms) must render hairline + warm, not browser-boxed.
  // Utility-classed public inputs keep their boxes until Phase 2 cleanup.
  const styles = await page.evaluate(() => {
    const probe = document.createElement('input');
    probe.type = 'text';
    document.body.appendChild(probe);
    const cs = getComputedStyle(probe);
    const out = { top: cs.borderTopWidth, bottom: cs.borderBottomWidth, radius: cs.borderTopLeftRadius, bottomColor: cs.borderBottomColor };
    probe.remove();
    return out;
  });
  expect(styles.top).toBe('0px');
  expect(styles.bottom).toBe('1px');
  expect(styles.radius).toBe('0px');
  expect(styles.bottomColor).toBe('rgb(210, 200, 182)'); // warm stone-300 hairline
});
