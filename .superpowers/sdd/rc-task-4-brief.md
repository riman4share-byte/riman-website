### Task 4: Playwright e2e coverage

**Files:**
- Create: `tests/rental-calendar.spec.ts`

**Interfaces:**
- Consumes: running app via Playwright webServer (`npm run dev`, port 3001); rentable product `/product/17` (`productType: 'both'` in `src/data/products.ts:5-8`); selectors produced by Task 3 (`[role="grid"]`, `[data-date]`, `[data-testid="rental-summary"]`, shortcut button name).
- Produces: automated proof of the spec's Success criteria for keyboard + shortcut + Arabic locale.

- [ ] **Step 1: Write the spec**

Create `tests/rental-calendar.spec.ts`:

```ts
import { test, expect, type Page } from '@playwright/test';
import { addDays, format } from 'date-fns';

const PRODUCT_URL = '/product/17';

async function openRental(page: Page, lang: 'en' | 'ar') {
  await page.addInitScript(l => localStorage.setItem('riman_lang', l), lang);
  await page.goto(PRODUCT_URL);
  const grid = page.getByRole('grid');
  await expect(grid).toBeVisible();
  return grid;
}

test.describe('Rental calendar accessibility', () => {
  test('keyboard-only selection: arrows move focus, Enter selects', async ({ page }) => {
    const grid = await openRental(page, 'en');
    const seed = format(addDays(new Date(), 20), 'yyyy-MM-dd');
    await grid.locator(`[data-date="${seed}"]`).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator(`[data-date="${format(addDays(new Date(), 21), 'yyyy-MM-dd')}"]`)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('rental-summary')).toBeVisible();
  });

  test('unavailable days are announced and not selectable', async ({ page }) => {
    const grid = await openRental(page, 'en');
    const yesterday = grid.locator(`[data-date="${format(addDays(new Date(), -1), 'yyyy-MM-dd')}"]`);
    await expect(yesterday).toHaveAttribute('aria-disabled', 'true');
    await yesterday.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('rental-summary')).toHaveCount(0);
  });

  test('"Next available date" jumps, selects, and announces', async ({ page }) => {
    await openRental(page, 'en');
    await page.getByRole('button', { name: /next available date/i }).click();
    const summary = page.getByTestId('rental-summary');
    await expect(summary).toBeVisible();
    const status = page.locator('[role="status"]');
    await expect(status).not.toHaveText('');
    const selectedCell = page.locator('[role="gridcell"][aria-selected="true"] button');
    await expect(selectedCell).toBeFocused();
  });

  test('Arabic locale: labels localize and horizontal arrows invert', async ({ page }) => {
    const grid = await openRental(page, 'ar');
    const seed = format(addDays(new Date(), 20), 'yyyy-MM-dd');
    await grid.locator(`[data-date="${seed}"]`).focus();
    const before = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    await page.keyboard.press('ArrowRight');
    const after = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    expect(before).not.toEqual(after);
    await expect(page.getByRole('button', { name: /أقرب تاريخ متاح/ })).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the spec**

Run: `npx playwright test tests/rental-calendar.spec.ts`
Expected: 4 passed (config auto-starts the dev server on port 3001; retries=1 absorbs first-run flakes). If port 3001 is busy from another session, stop that server first.

- [ ] **Step 3: Run the full Playwright suite for regressions**

Run: `npx playwright test`
Expected: all existing specs in `tests/` plus the new one pass.

- [ ] **Step 4: Commit**

```bash
git add tests/rental-calendar.spec.ts
git commit -m "test(e2e): rental calendar keyboard, next-available, and RTL coverage"
```

---

