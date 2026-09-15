import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.unstubAllEnvs();
  // Baseline: no Supabase project → the derived edge-function default stays
  // off unless a test opts in, so "not configured" paths are deterministic.
  vi.stubEnv('VITE_SUPABASE_URL', '');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
  global.fetch = vi.fn();
});

const baseInput = {
  lines: [{ product_id: 'test-1', quantity: 1, intent: 'sale' as const }],
  returnOrigin: 'http://localhost:3001',
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
};

const sentBody = () => JSON.parse((global.fetch as any).mock.calls[0][1].body);

describe('createCheckoutSession', () => {
  it('returns null when endpoint is not configured', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', '');
    const { createCheckoutSession } = await import('./payment');
    const result = await createCheckoutSession(baseInput);
    expect(result).toBeNull();
  });

  it('returns url and orderId on success', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', 'https://example.com/create-checkout');
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/session_123', orderId: 'o-1' }),
    });
    const { createCheckoutSession } = await import('./payment');

    const result = await createCheckoutSession(baseInput);
    expect(result?.url).toBe('https://checkout.stripe.com/session_123');
    expect(result?.orderId).toBe('o-1');
  });

  it('sends ONLY ids/quantities/intent — never names, prices, subtotals or totals', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', 'https://example.com/create-checkout');
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/s' }),
    });
    const { createCheckoutSession } = await import('./payment');

    await createCheckoutSession({
      lines: [{ product_id: 'gown-1', quantity: 2, intent: 'rent', rental_start_date: '2026-01-01', rental_end_date: '2026-01-08' }],
      returnOrigin: 'https://riman.ae/some/path?x=1',
      customerName: 'Jane',
      customerEmail: 'jane@example.com',
    });

    const body = sentBody();
    // Money-shaped fields must not exist anywhere in the payload.
    for (const forbidden of ['price', 'name', 'subtotal', 'total', 'unit_amount', 'productType', 'orderType', 'successUrl', 'cancelUrl']) {
      expect(JSON.stringify(body)).not.toMatch(new RegExp(`"${forbidden}"`));
    }
    expect(body.lines[0]).toEqual({
      product_id: 'gown-1',
      quantity: 2,
      intent: 'rent',
      rental_start_date: '2026-01-01',
      rental_end_date: '2026-01-08',
    });
    // returnOrigin normalized to bare origin.
    expect(body.returnOrigin).toBe('https://riman.ae');
  });

  it('drops a malformed returnOrigin instead of forwarding it', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', 'https://example.com/create-checkout');
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/s' }),
    });
    const { createCheckoutSession } = await import('./payment');
    await createCheckoutSession({ ...baseInput, returnOrigin: 'not a url' });
    expect(sentBody().returnOrigin).toBeUndefined();
  });

  it('throws with the server error message on API rejection (no silent fallback)', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', 'https://example.com/create-checkout');
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ error: 'Product "Fleur" is not available for those dates' }),
      text: () => Promise.resolve('{"error":"Product \\"Fleur\\" is not available for those dates"}'),
    });
    const { createCheckoutSession } = await import('./payment');
    await expect(createCheckoutSession(baseInput)).rejects.toThrow(/not available for those dates/);
  });

  it('sends the Supabase apikey header when an anon key is configured', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', 'https://example.com/create-checkout');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-test-key');
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/s' }),
    });
    const { createCheckoutSession } = await import('./payment');
    await createCheckoutSession(baseInput);
    const headers = (global.fetch as any).mock.calls[0][1].headers;
    expect(headers.apikey).toBe('anon-test-key');
  });

  it('derives the endpoint from the Supabase project URL when no explicit endpoint is set', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', '');
    vi.stubEnv('VITE_SUPABASE_URL', 'https://ref.supabase.co');
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/s' }),
    });
    const { createCheckoutSession, isStripeConfigured } = await import('./payment');
    expect(isStripeConfigured()).toBe(true);
    await createCheckoutSession(baseInput);
    expect(String((global.fetch as any).mock.calls[0][0])).toBe('https://ref.supabase.co/functions/v1/create-checkout');
  });
});

describe('verifyCheckoutSession', () => {
  it('returns null when endpoint is not configured', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', '');
    const { verifyCheckoutSession } = await import('./payment');
    expect(await verifyCheckoutSession('cs_test_123')).toBeNull();
  });

  it('returns payment status on success', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', 'https://example.com/create-checkout');
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ paid: true, orderId: 'order_123', customerEmail: 'jane@example.com' }),
    });
    const { verifyCheckoutSession } = await import('./payment');
    const result = await verifyCheckoutSession('cs_test_123');
    expect(result?.paid).toBe(true);
    expect(result?.orderId).toBe('order_123');
  });
});

describe('isStripeConfigured', () => {
  it('returns false when env var is not set', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', '');
    const { isStripeConfigured } = await import('./payment');
    expect(isStripeConfigured()).toBe(false);
  });

  it('returns true when env var is set', async () => {
    vi.stubEnv('VITE_STRIPE_CHECKOUT_ENDPOINT', 'https://example.com/create-checkout');
    const { isStripeConfigured } = await import('./payment');
    expect(isStripeConfigured()).toBe(true);
  });
});
