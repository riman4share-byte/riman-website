import { test, expect } from '@playwright/test';

async function waitForApp(page) {
  await page.goto('/');
  await page.waitForSelector('#root > *', { timeout: 45000 });
}

test.describe('Booking-first conversion', () => {
  test('PDP reserve CTA prefills appointment', async ({ page }) => {
    await waitForApp(page);
    await page.goto('/collection/all');
    await page.waitForSelector('#root > *');
    const card = page.locator('a[href^="/product/"]').first();
    await card.click();
    await expect(page).toHaveURL(/\/product\//);

    const reserve = page.getByRole('button', { name: /reserve a private viewing|احجزي مشاهدة خاصة/i }).first();
    await expect(reserve).toBeVisible();
    await reserve.click();

    await expect(page).toHaveURL(/\/appointment/);
    await expect(page.locator('text=/your selected pieces|قطعك المختارة/i')).toBeVisible();

    // Notes field mounts on scheduling step; details must be filled to reach it.
    await page.fill('input[placeholder="Your full name"]', 'Test Client');
    await page.fill('input[placeholder="your@email.com"]', 'client@example.com');
    await page.fill('input[placeholder="+971 50 000 0000"]', '+971500000001');
    await page.getByRole('button', { name: /continue to scheduling|متابعة إلى تحديد الموعد/i }).first().click();
    await expect(page.locator('textarea').first()).toBeVisible();
    await expect(page.locator('textarea, input[name="notes"]').first()).toHaveValue(/interested in:/i);
  });

  test('wishlist request CTA carries all saved gowns', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
    // Cards navigate programmatically (no product anchors) and each card
    // carries its own "Add to Wishlist" button — save two cards in place.
    await page.goto('/collection/all', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('.aspect-\\[3\\/4\\]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    await cards.nth(0).locator('button', { hasText: /add to wishlist/i }).click();
    await cards.nth(1).locator('button', { hasText: /add to wishlist/i }).click();

    await page.goto('/wishlist');
    const req = page.getByRole('button', { name: /book a private fitting|request private viewing|احجزي قياسًا خاصًا|طلب مشاهدة خاصة/i }).first();
    await expect(req).toBeVisible();
    await req.click();
    await expect(page).toHaveURL(/\/appointment/);
    await expect(page.locator('text=/your selected pieces|قطعك المختارة/i')).toBeVisible();
  });

  test('first visit defaults to English LTR', async ({ page }) => {
    // Was 'defaults to Arabic RTL'. The default is now English: bridal
    // clientele for a UAE atelier is overwhelmingly international, so a
    // first-time visitor should not land on a mirrored page by default.
    // Arabic is still one tap away, in the header and the mobile drawer.
    await page.addInitScript(() => localStorage.removeItem('riman_lang'));
    await waitForApp(page);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('a returning Arabic visitor keeps Arabic RTL', async ({ page }) => {
    // The other half of the change: the default only applies to a first visit.
    // An explicit stored preference must survive.
    await page.addInitScript(() => localStorage.setItem('riman_lang', 'ar'));
    await waitForApp(page);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
