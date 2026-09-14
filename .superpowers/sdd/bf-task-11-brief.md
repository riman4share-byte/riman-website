### Task 11: Playwright regression spec — selection → viewing

**Files:**
- Create: `tests/selection-to-viewing.spec.js`

**Interfaces:**
- Consumes: running dev server (Playwright webServer config starts it), routes `/collection/all` (or any listing), `/product/:id`, `/appointment`, `/wishlist`.
- Pattern reference: copy the app-mount wait (`waitForApp`) helper from `tests/helpers.js` if present, else from any existing spec.

- [ ] **Step 1: Write the spec**

```js
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
    await expect(page.locator('textarea, input[name="notes"]').first()).toHaveValue(/interested in:/i);
  });

  test('wishlist request CTA carries all saved gowns', async ({ page }) => {
    await waitForApp(page);
    await page.goto('/collection/all');
    const cards = page.locator('a[href^="/product/"]');
    await cards.nth(0).click();
    const heart = page.getByRole('button', { name: /add to wishlist|أضف/i }).first();
    if (await heart.isVisible()) await heart.click();
    await page.goBack();
    await cards.nth(1).click();
    const heart2 = page.getByRole('button', { name: /add to wishlist|أضف/i }).first();
    if (await heart2.isVisible()) await heart2.click();

    await page.goto('/wishlist');
    const req = page.getByRole('button', { name: /request private viewing|طلب مشاهدة خاصة/i });
    await expect(req).toBeVisible();
    await req.click();
    await expect(page).toHaveURL(/\/appointment/);
    await expect(page.locator('text=/your selected pieces|قطعك المختارة/i')).toBeVisible();
  });

  test('first visit defaults to Arabic RTL', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('riman_lang'));
    await waitForApp(page);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
```

Adjust selectors against reality while writing (aria-labels may differ); the assertions above are the contract.

- [ ] **Step 2: Run the new spec**

Run: `npx playwright test tests/selection-to-viewing.spec.js`
Expected: 3 passed (fix selectors/code until green).

- [ ] **Step 3: Full suite**

Run: `npx playwright test`
Expected: all pass including pre-existing suites; repair any click-verification specs broken by the new PDP button order (they may target the first `btn-luxury` button — point them at the bag-secondary button by name `book rental|add to collection`).

- [ ] **Step 4: Commit**

```bash
git add tests/selection-to-viewing.spec.js tests/
git commit -m "test(e2e): selection-to-viewing conversion flow + RTL default"
```

---


