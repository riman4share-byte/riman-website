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
