import { test, expect, type Page } from '@playwright/test';

/**
 * Payment journey — Layer 1.
 *
 * Stripe keys are not available in this environment, so the app is pointed at a
 * local stub gateway (scripts/stub-stripe-server.mjs) via
 * VITE_STRIPE_CHECKOUT_ENDPOINT. This covers the half we own and the half that
 * silently breaks: the browser wiring from the checkout form to the hosted
 * checkout redirect to the confirmation page, and the money contract we send.
 *
 * It cannot prove that Stripe accepts our parameters or delivers a webhook.
 * That needs Stripe test mode - see docs/PAYMENT-TESTING.md.
 */

const SALE_PRICE = 42000;
const RENTAL_PRICE = 4200;

// A gown carrying BOTH prices. This is the exact shape that produced the
// production bug where checkout displayed the rental figure for a gown the
// client was buying.
const SALE_LINE = {
  id: '1',
  name: 'Fleur Eternelle Bridal Gown',
  category: 'Bridal Gown',
  productType: 'both',
  intent: 'sale',
  salePrice: SALE_PRICE,
  rentalPrice: RENTAL_PRICE,
  securityDeposit: 8400,
  quantity: 1,
  selectedSize: 'M',
  images: ['/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg'],
};

// The stub gateway branches on the customer email, so each scenario is
// independent and parallel-safe.
const EMAIL = {
  paid: 'amira@example.com',
  unpaid: 'unpaid@example.com',
  gatewayFailure: 'fail@example.com',
};

async function seedCart(page: Page) {
  await page.addInitScript((line) => {
    localStorage.setItem('riman_cart', JSON.stringify([line]));
    localStorage.setItem('riman_lang', 'en');
  }, SALE_LINE);
}

async function reachReviewStep(page: Page, email: string) {
  await page.goto('/checkout');
  await page.locator('#co-first').waitFor({ timeout: 30000 });
  await page.locator('#co-first').fill('Amira');
  await page.locator('#co-last').fill('Haddad');
  await page.locator('#co-email').fill(email);
  await page.locator('#co-phone').fill('+971500000000');
  await page.getByRole('button', { name: /continue to logistics/i }).click();
  await page.locator('#co-address').waitFor({ timeout: 15000 });
  await page.locator('#co-address').fill('Al Zahra St');
  await page.locator('#co-city').fill('Sharjah');
  await page.getByRole('button', { name: /review order/i }).click();
  await page.getByRole('button', { name: /confirm order/i }).waitFor({ timeout: 15000 });
}

test.describe('payment journey (stub gateway)', () => {
  // The site is Arabic-first, so an unset locale renders Arabic copy. Pin
  // English for these assertions rather than matching either language.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  });

  test('shows the purchase price for a gown being bought, never the rental price', async ({ page }) => {
    await seedCart(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await reachReviewStep(page, EMAIL.paid);

    // Desktop review list and the sticky sidebar each render the line price
    // through their own expression; both read the buggy one before the fix.
    const money = await page.evaluate(() => {
      const body = document.body.innerText;
      return {
        showsSale: body.includes('AED 42,000'),
        showsRental: body.includes('AED 4,200'),
      };
    });
    expect(money.showsSale, 'checkout must display the purchase price').toBe(true);
    expect(money.showsRental, 'checkout must never show the rental price for a sale line').toBe(false);

    // Mobile summary renders the same line again in its own component.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.locator('#co-first').waitFor({ timeout: 30000 });
    await page.waitForTimeout(800);
    const mobileText = await page.evaluate(() => document.body.innerText);
    expect(mobileText.includes('AED 4,200'), 'mobile summary must not show the rental price').toBe(false);
  });

  test('sends only ids, quantities and intent — never money — then redirects to hosted checkout', async ({ page }) => {
    await seedCart(page);

    // Capture what the browser actually sends by watching the stub's request.
    const sent: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('3199/create-checkout') && r.method() === 'POST') sent.push(r.postData() || '');
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await reachReviewStep(page, EMAIL.paid);
    await page.getByRole('button', { name: /confirm order/i }).click();

    await page.waitForURL('**/hosted-checkout', { timeout: 20000 });
    expect(await page.title()).toContain('Stripe');

    expect(sent, 'the checkout gateway must be called').toHaveLength(1);
    const body = JSON.parse(sent[0]);

    // The security contract, asserted end to end rather than only in unit tests.
    expect(Array.isArray(body.lines)).toBe(true);
    expect(body.lines).toHaveLength(1);
    expect(Object.keys(body.lines[0]).sort()).toEqual(['intent', 'product_id', 'quantity']);
    expect(body.lines[0].intent).toBe('sale');
    expect(body.lines[0].product_id).toBe('1');
    expect(body.lines[0].quantity).toBe(1);

    const serialised = JSON.stringify(body).toLowerCase();
    const forbiddenFields = ['saleprice', 'rentalprice', 'unit_price', 'subtotal', 'total', 'amount'];
    for (const forbidden of forbiddenFields) {
      expect(serialised, `request must not contain ${forbidden}`).not.toContain(forbidden);
    }

    // returnOrigin is normalised to a bare origin, never a path or query.
    expect(body.returnOrigin).toBe('http://localhost:3101');
  });

  test('confirms the order after a paid session and empties the bag', async ({ page }) => {
    await seedCart(page);
    await page.goto('/payment/success?session_id=cs_test_123');

    await expect(page.getByText('Payment Successful')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/received/i).first()).toBeVisible();

    // The bag is emptied only once the payment is verified as paid.
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const raw = localStorage.getItem('riman_cart');
          return raw === null || raw === '[]';
        }),
      )
      .toBe(true);
  });

  test('does not claim success when the session is not paid', async ({ page }) => {
    await seedCart(page);
    // The stub answers `paid:false` for any unpaid@ address.
    await page.goto('/payment/success?session_id=cs_test_unpaid&email=unpaid');
    await expect(page.getByText('Payment Not Verified')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Payment Successful')).toHaveCount(0);
  });

  test('keeps the client on checkout and offers the atelier handoff when the gateway fails', async ({ page }) => {
    await seedCart(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await reachReviewStep(page, EMAIL.gatewayFailure);
    await page.getByRole('button', { name: /confirm order/i }).click();

    // A failed payment must never look like a success.
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByText(/whatsapp|temporarily unavailable|try again/i).first()).toBeVisible({ timeout: 20000 });
  });
});