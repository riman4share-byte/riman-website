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

test('homepage has dark Ken Burns interstitial with the atelier quote', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const band = page.locator('section.couture-interstitial');
  await expect(band).toHaveCount(1);
  await expect(band.locator('img')).toHaveCount(1);
  await expect(band.locator('p')).toContainText('tension');
  const anim = await band.locator('.ken-burns img').evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe('ken-burns');
});

test('phase 2: .card-couture and .field-couture classes are live in the bundle', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 45000 });
  const probe = await page.evaluate(() => {
    const card = document.createElement('div');
    card.className = 'card-couture';
    const img = document.createElement('img');
    card.appendChild(img);
    document.body.appendChild(card);
    const field = document.createElement('input');
    field.className = 'field-couture';
    document.body.appendChild(field);
    const c = getComputedStyle(card);
    const i = getComputedStyle(img);
    const f = getComputedStyle(field);
    const out = {
      cardBorder: c.borderTopWidth, cardShadow: c.boxShadow, cardRadius: c.borderTopLeftRadius,
      cardOverflow: c.overflow, imgTransition: i.transitionDuration,
      fieldTop: f.borderTopWidth, fieldBottom: f.borderBottomWidth,
      fieldRadius: f.borderTopLeftRadius, fieldBg: f.backgroundColor,
    };
    card.remove(); field.remove();
    return out;
  });
  expect(probe.cardBorder).toBe('0px');
  expect(probe.cardShadow).toBe('none');
  expect(probe.cardRadius).toBe('0px');
  expect(probe.cardOverflow).toBe('hidden');
  expect(probe.imgTransition).toContain('1.2s');
  expect(probe.fieldTop).toBe('0px');
  expect(probe.fieldBottom).toBe('1px');
  expect(probe.fieldRadius).toBe('0px');
  expect(probe.fieldBg).toBe('rgba(0, 0, 0, 0)');
});

test('phase 2: mobile bottom-nav is an ink band with gold active state', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const nav = page.locator('nav.fixed.bottom-0');
  await expect(nav).toBeVisible({ timeout: 45000 });
  const styles = await nav.evaluate((el) => {
    const cs = getComputedStyle(el);
    const active = el.querySelector('a.text-gold-light') as HTMLElement | null;
    const linkCs = active ? getComputedStyle(active) : null;
    return { bg: cs.backgroundColor, hasActive: !!active, activeColor: linkCs?.color ?? null };
  });
  expect(styles.bg).toBe('rgb(15, 13, 10)');
  expect(styles.hasActive).toBe(true);
  expect(styles.activeColor).toBe('rgb(201, 169, 111)');
});

test('phase 2: collections page renders borderless couture cards', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/collections', { waitUntil: 'domcontentloaded' });
  const card = page.locator('.card-couture').first();
  await expect(card).toBeVisible({ timeout: 45000 });
  const styles = await card.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { border: cs.borderTopWidth, radius: cs.borderTopLeftRadius, overflow: cs.overflow };
  });
  expect(styles.border).toBe('0px');
  expect(styles.radius).toBe('0px');
  expect(styles.overflow).toBe('hidden');
});

test('phase 2: contact form controls are hairline .field-couture', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  const field = page.locator('main .field-couture').first();
  await expect(field).toBeVisible({ timeout: 45000 });
  const styles = await field.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { top: cs.borderTopWidth, bottom: cs.borderBottomWidth, radius: cs.borderTopLeftRadius, bg: cs.backgroundColor };
  });
  expect(styles.top).toBe('0px');
  expect(styles.bottom).toBe('1px');
  expect(styles.radius).toBe('0px');
  expect(styles.bg).toBe('rgba(0, 0, 0, 0)');
});

test('phase 2: product detail has no plate borders and hairline review fields', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const href = await page.locator('a[href^="/product/"]').first().getAttribute('href');
  expect(href).toBeTruthy();
  await page.goto('http://localhost:3001' + href!, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main', { timeout: 45000 });
  await page.locator('button:has(h3)').first().click(); // expand "Client Reflections" accordion
  await page.waitForSelector('main .field-couture', { timeout: 10000 });
  const probe = await page.evaluate(() => {
    const plates = [...document.querySelectorAll('main *')].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.borderTopWidth !== '0px' && cs.borderLeftWidth === cs.borderTopWidth && cs.borderTopWidth === cs.borderBottomWidth && cs.borderTopWidth === cs.borderRightWidth && parseFloat(cs.borderTopLeftRadius) > 0;
    }).length;
    const boxedInputs = [...document.querySelectorAll('main input, main textarea')].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.borderTopWidth !== '0px';
    }).length;
    const reviewFields = document.querySelectorAll('main .field-couture').length;
    return { plates, boxedInputs, reviewFields };
  });
  expect(probe.reviewFields).toBeGreaterThanOrEqual(2);
  expect(probe.boxedInputs).toBe(0);
  expect(probe.plates).toBe(0);
});
