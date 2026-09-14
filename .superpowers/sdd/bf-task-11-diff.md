## Commits
0e0ea58 test(e2e): selection-to-viewing conversion flow + RTL default

## Stat
 tests/click-verification.spec.js   |  6 ++--
 tests/selection-to-viewing.spec.js | 58 ++++++++++++++++++++++++++++++++++++++
 2 files changed, 62 insertions(+), 2 deletions(-)

## Diff
diff --git a/tests/click-verification.spec.js b/tests/click-verification.spec.js
index fb7bbb4..38ed81b 100644
--- a/tests/click-verification.spec.js
+++ b/tests/click-verification.spec.js
@@ -59,21 +59,22 @@ test.describe('Header Desktop Navigation', () => {
 // 2. HEADER ΓÇö Icon Action Links
 // ---------------------------------------------------------------------------
 
 test.describe('Header Icon Links', () => {
   test.beforeEach(async ({ page }) => {
     await goHome(page);
   });
 
   const iconLinks = [
     { name: 'Search', path: '/search', ariaLabel: 'Search' },
-    { name: 'Wishlist', path: '/wishlist', ariaLabel: 'Wishlist' },
+    // Wishlist icon was rebranded to "Your Selection" ΓÇö match by href instead of aria-label.
+    { name: 'Wishlist', path: '/wishlist', ariaLabel: null },
     { name: 'Account', path: '/profile', ariaLabel: 'Account' },
     { name: 'Cart', path: '/checkout', ariaLabel: null },
   ];
 
   for (const { name, path, ariaLabel } of iconLinks) {
     test(`icon "${name}" navigates to ${path}`, async ({ page }) => {
       let selector = ariaLabel
         ? `a[aria-label="${ariaLabel}"]`
         : `a[href="${path}"]`;
       const el = page.locator(selector).first();
@@ -317,21 +318,22 @@ test.describe('Product Detail Page', () => {
   });
 
   test('Add to cart / Book rental button exists', async ({ page }) => {
     // Don't hard-code a product id (DB ids change between Supabase projects) ΓÇö
     // open whatever product is listed first in the collection.
     await page.goto('/collection/all', { waitUntil: 'domcontentloaded' });
     const card = page.locator('a[href^="/product/"]').first();
     await expect(card).toBeVisible({ timeout: 30000 });
     await card.click();
     await waitForApp(page);
-    const addBtn = page.locator('button:has-text("Add to Collection"), button:has-text("Book Rental")').first();
+    // Bag-secondary CTA ΓÇö bilingual (site defaults to Arabic).
+    const addBtn = page.getByRole('button', { name: /book rental|add to collection|╪º╪¡╪¼╪▓ ╪º┘ä╪Ñ┘è╪¼╪º╪▒|╪ú╪╢┘ü ┘ä┘ä┘à╪¼┘à┘ê╪╣╪⌐/i }).first();
     await expect(addBtn).toBeVisible({ timeout: 15000 });
   });
 
   test('Wishlist button toggles', async ({ page }) => {
     await page.goto('/product/prod-001', { waitUntil: 'domcontentloaded' });
     await waitForApp(page);
     const wishlistBtn = page.locator('button[aria-label*="wishlist"]').first();
     if (await wishlistBtn.count() > 0) {
       await wishlistBtn.scrollIntoViewIfNeeded();
       await expect(wishlistBtn).toBeVisible({ timeout: 5000 });
diff --git a/tests/selection-to-viewing.spec.js b/tests/selection-to-viewing.spec.js
new file mode 100644
index 0000000..1221382
--- /dev/null
+++ b/tests/selection-to-viewing.spec.js
@@ -0,0 +1,58 @@
+import { test, expect } from '@playwright/test';
+
+async function waitForApp(page) {
+  await page.goto('/');
+  await page.waitForSelector('#root > *', { timeout: 45000 });
+}
+
+test.describe('Booking-first conversion', () => {
+  test('PDP reserve CTA prefills appointment', async ({ page }) => {
+    await waitForApp(page);
+    await page.goto('/collection/all');
+    await page.waitForSelector('#root > *');
+    const card = page.locator('a[href^="/product/"]').first();
+    await card.click();
+    await expect(page).toHaveURL(/\/product\//);
+
+    const reserve = page.getByRole('button', { name: /reserve a private viewing|╪º╪¡╪¼╪▓┘è ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐/i }).first();
+    await expect(reserve).toBeVisible();
+    await reserve.click();
+
+    await expect(page).toHaveURL(/\/appointment/);
+    await expect(page.locator('text=/your selected pieces|┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐/i')).toBeVisible();
+
+    // Notes field mounts on scheduling step; details must be filled to reach it.
+    await page.fill('input[placeholder="Your full name"]', 'Test Client');
+    await page.fill('input[placeholder="your@email.com"]', 'client@example.com');
+    await page.fill('input[placeholder="+971 50 000 0000"]', '+971500000001');
+    await page.getByRole('button', { name: /continue to scheduling|┘à╪¬╪º╪¿╪╣╪⌐ ╪Ñ┘ä┘ë ╪¬╪¡╪»┘è╪» ╪º┘ä┘à┘ê╪╣╪»/i }).first().click();
+    await expect(page.locator('textarea').first()).toBeVisible();
+    await expect(page.locator('textarea, input[name="notes"]').first()).toHaveValue(/interested in:/i);
+  });
+
+  test('wishlist request CTA carries all saved gowns', async ({ page }) => {
+    await waitForApp(page);
+    await page.goto('/collection/all');
+    const cards = page.locator('a[href^="/product/"]');
+    await cards.nth(0).click();
+    const heart = page.locator('button[aria-label="Add to wishlist"]').first();
+    if (await heart.isVisible()) await heart.click();
+    await page.goBack();
+    await cards.nth(1).click();
+    const heart2 = page.locator('button[aria-label="Add to wishlist"]').first();
+    if (await heart2.isVisible()) await heart2.click();
+
+    await page.goto('/wishlist');
+    const req = page.getByRole('button', { name: /request private viewing|╪╖┘ä╪¿ ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐/i }).first();
+    await expect(req).toBeVisible();
+    await req.click();
+    await expect(page).toHaveURL(/\/appointment/);
+    await expect(page.locator('text=/your selected pieces|┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐/i')).toBeVisible();
+  });
+
+  test('first visit defaults to Arabic RTL', async ({ page }) => {
+    await page.addInitScript(() => localStorage.removeItem('riman_lang'));
+    await waitForApp(page);
+    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
+  });
+});
