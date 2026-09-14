import { describe, it, expect } from 'vitest';
import {
  parseCheckoutRequest,
  deriveTrustedLines,
  toMinorUnits,
  isAllowedOrigin,
  parseAllowedOrigins,
  rentalPeriodIsFree,
  extractWebhookOrderRef,
  MAX_QUANTITY,
  MAX_CART_LINES,
  type ProductRow,
  type CheckoutLineInput,
} from '../../supabase/functions/_shared/checkoutValidation';
import { verifyStripeSignature, processOnce } from '../../supabase/functions/_shared/stripeSignature';

const product = (over: Partial<ProductRow> = {}): ProductRow => ({
  id: 'p1',
  name: 'Fleur Éternelle',
  product_type: 'both',
  sale_price: 42000,
  rental_price: 4200,
  is_active: true,
  ...over,
});

const line = (over: Partial<CheckoutLineInput> = {}): CheckoutLineInput => ({
  product_id: 'p1',
  quantity: 1,
  intent: 'sale',
  ...over,
});

const baseRequest = (lines: unknown[]) => ({
  lines,
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
});

describe('parseCheckoutRequest — strict schema', () => {
  it('accepts a minimal valid request', () => {
    const r = parseCheckoutRequest(baseRequest([line()]));
    expect(r.ok).toBe(true);
  });

  it('rejects browser-provided name/price/subtotal/productType fields (tampering surface)', () => {
    const r = parseCheckoutRequest(baseRequest([{ ...line(), price: 1, name: 'x', productType: 'sale' }]));
    expect(r.ok).toBe(false);
    expect((r as { error: string }).error).toMatch(/unknown field/i);
  });

  it('rejects a top-level subtotal or orderType (server derives them)', () => {
    const r = parseCheckoutRequest({ ...baseRequest([line()]), subtotal: 999999, orderType: 'sale' });
    expect(r.ok).toBe(false);
  });

  it('rejects invalid, unknown-shaped payloads', () => {
    expect(parseCheckoutRequest(null).ok).toBe(false);
    expect(parseCheckoutRequest('str').ok).toBe(false);
    expect(parseCheckoutRequest({ lines: 'not-array' }).ok).toBe(false);
    expect(parseCheckoutRequest(baseRequest([])).ok).toBe(false);
    expect(parseCheckoutRequest(baseRequest([{ product_id: 'x' }])).ok).toBe(false);
    expect(parseCheckoutRequest(baseRequest([{ ...line(), intent: 'lease' }])).ok).toBe(false);
    expect(parseCheckoutRequest(baseRequest([{ ...line(), quantity: 1.5 }])).ok).toBe(false);
    expect(parseCheckoutRequest(baseRequest([{ ...line(), quantity: 0 }])).ok).toBe(false);
    expect(parseCheckoutRequest(baseRequest([line()]) ).ok).toBe(true);
  });

  it('rejects excessive quantities and oversized carts', () => {
    const tooMany = parseCheckoutRequest(baseRequest([line({ quantity: MAX_QUANTITY + 1 })]));
    expect(tooMany.ok).toBe(false);
    expect((tooMany as { error: string }).error).toMatch(/quantity/i);

    const merged = parseCheckoutRequest(baseRequest(
      Array.from({ length: MAX_QUANTITY + 1 }, () => line()),
    ));
    expect(merged.ok).toBe(false);

    const bigCart = parseCheckoutRequest(baseRequest(
      Array.from({ length: MAX_CART_LINES + 1 }, (_, i) => line({ product_id: `p${i}` })),
    ));
    expect(bigCart.ok).toBe(false);
    expect((bigCart as { error: string }).error).toMatch(/max/i);
  });

  it('rejects invalid rental dates', () => {
    const bad = parseCheckoutRequest(baseRequest([line({
      intent: 'rent',
      rental_start_date: '2025-13-45',
      rental_end_date: '2025-01-01',
    })]));
    expect(bad.ok).toBe(false);
  });
});

describe('deriveTrustedLines — server-authoritative pricing', () => {
  it('ignores browser prices entirely: amount comes from DB even if client claimed otherwise', () => {
    // Client cannot even send a price (rejected above); server recomputes from DB.
    const r = deriveTrustedLines([line({ quantity: 2 })], [product()]);
    expect(r.ok).toBe(true);
    const v = (r as { value: { trusted: Array<{ unit_price_aed: number; line_total_cents: number }> } }).value;
    expect(v.trusted[0].unit_price_aed).toBe(42000);
    expect(v.trusted[0].line_total_cents).toBe(8_400_000); // 84000 AED × 100
  });

  it('rejects unknown product ids', () => {
    const r = deriveTrustedLines([line({ product_id: 'ghost' })], [product()]);
    expect(r.ok).toBe(false);
    expect((r as { error: string }).error).toMatch(/inactive|Invalid/i);
  });

  it('rejects inactive products', () => {
    const r = deriveTrustedLines([line()], [product({ is_active: false })]);
    expect(r.ok).toBe(false);
  });

  it('rejects sale intent on rent-only products and vice versa', () => {
    expect(deriveTrustedLines([line({ intent: 'sale' })], [product({ product_type: 'rent' })]).ok).toBe(false);
    expect(deriveTrustedLines([line({ intent: 'rent' })], [product({ product_type: 'sale' })]).ok).toBe(false);
  });

  it('computes integer cents and detects zero/absent prices', () => {
    const ok = deriveTrustedLines([line({ intent: 'rent' })], [product()]);
    expect(ok.ok).toBe(true);
    expect(deriveTrustedLines([line()], [product({ sale_price: null })]).ok).toBe(false);
    expect(deriveTrustedLines([line()], [product({ sale_price: 0 })]).ok).toBe(false);
  });

  it('derives orderType from intents, never from the client', () => {
    const mixed = deriveTrustedLines(
      [line(), line({ intent: 'rent' })],
      [product()],
    );
    expect(mixed.ok).toBe(true);
    expect((mixed as { value: { orderType: string } }).value.orderType).toBe('mixed');
  });
});

describe('integer money math', () => {
  it('converts integer AED to cents and rejects floats', () => {
    expect(toMinorUnits(42000)).toBe(4_200_000);
    expect(toMinorUnits(42000.5)).toBeNull();
    expect(toMinorUnits(-1)).toBeNull();
    expect(toMinorUnits(Number.MAX_SAFE_INTEGER)).toBeNull();
  });
});

describe('return origin allowlist', () => {
  const origins = parseAllowedOrigins({ SITE_URL: 'https://riman.ae', ALLOWED_SITE_ORIGINS: 'https://staging.riman.ae' });

  it('accepts configured https origins', () => {
    expect(isAllowedOrigin('https://riman.ae', origins)).toBe(true);
    expect(isAllowedOrigin('https://staging.riman.ae', origins)).toBe(true);
  });

  it('rejects unconfigured, http, and javascript origins', () => {
    expect(isAllowedOrigin('https://evil.example', origins)).toBe(false);
    expect(isAllowedOrigin('http://riman.ae', origins)).toBe(false);
    expect(isAllowedOrigin('javascript:alert(1)', origins)).toBe(false);
    expect(isAllowedOrigin('https://riman.ae.evil.example', origins)).toBe(false);
    expect(isAllowedOrigin(undefined, origins)).toBe(false);
  });

  it('dev builds allow http://localhost:3001 explicitly', () => {
    const dev = parseAllowedOrigins({ SITE_URL: 'http://localhost:3001' });
    expect(isAllowedOrigin('http://localhost:3001', dev)).toBe(true);
  });
});

describe('rental availability', () => {
  it('detects overlapping bookings', () => {
    const bookings = [{ start_date: '2026-01-10', end_date: '2026-01-17' }];
    expect(rentalPeriodIsFree(bookings, '2026-01-12', '2026-01-19')).toBe(false);
    expect(rentalPeriodIsFree(bookings, '2026-01-17', '2026-01-24')).toBe(true);
    expect(rentalPeriodIsFree(bookings, '2026-01-03', '2026-01-10')).toBe(true);
  });
});

describe('stripe webhook — forged signatures and replay', () => {
  const secret = 'whsec_test_123';
  const encoder = new TextEncoder();

  async function sign(timestamp: string, body: string): Promise<string> {
    const key = await globalThis.crypto.subtle.importKey(
      'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
    );
    const mac = new Uint8Array(await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${body}`)));
    return Array.from(mac, b => b.toString(16).padStart(2, '0')).join('');
  }

  const now = () => Math.floor(Date.now() / 1000);

  it('rejects a forged signature', async () => {
    await expect(verifyStripeSignature('{"id":"evt_1"}', 't=1,v1=deadbeef', secret)).rejects.toThrow();
  });

  it('rejects a validly-signed body that was tampered with after signing', async () => {
    const t = String(now());
    const original = JSON.stringify({ id: 'evt_1', type: 'ping' });
    const goodHeader = `t=${t},v1=${await sign(t, original)}`;
    const tampered = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed' });
    await expect(verifyStripeSignature(tampered, goodHeader, secret)).rejects.toThrow(/Invalid signature/);
  });

  it('rejects stale timestamps (replay protection)', async () => {
    const old = String(now() - 3600);
    const body = JSON.stringify({ id: 'evt_1' });
    const header = `t=${old},v1=${await sign(old, body)}`;
    await expect(verifyStripeSignature(body, header, secret)).rejects.toThrow(/Timestamp/);
  });

  it('accepts a properly signed event', async () => {
    const t = String(now());
    const body = JSON.stringify({ id: 'evt_ok', type: 'ping' });
    const header = `t=${t},v1=${await sign(t, body)}`;
    const result = await verifyStripeSignature(body, header, secret);
    expect(result.event.id).toBe('evt_ok');
  });

  it('the same webhook event cannot be processed twice (unique claim)', async () => {
    const claimed = new Set<string>();
    const claim = async (id: string) => {
      if (claimed.has(id)) return false;
      claimed.add(id);
      return true;
    };
    let fulfillments = 0;
    const work = async () => { fulfillments += 1; };

    const first = await processOnce('evt_abc', claim, work);
    const second = await processOnce('evt_abc', claim, work);
    const third = await processOnce('evt_abc', claim, work);

    expect(first).toBe('processed');
    expect(second).toBe('duplicate');
    expect(third).toBe('duplicate');
    expect(fulfillments).toBe(1);
  });

  it('extractWebhookOrderRef ignores unrelated events and rejects missing metadata', () => {
    const ignored = extractWebhookOrderRef({ id: 'e1', type: 'customer.created', data: {} });
    expect('ignore' in ignored).toBe(true);

    const noMeta = extractWebhookOrderRef({ id: 'e2', type: 'checkout.session.completed', data: { object: { id: 'cs_1' } } });
    expect(noMeta.ok).toBe(false);

    const good = extractWebhookOrderRef({
      id: 'e3',
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_1', metadata: { order_id: 'order-9' }, payment_status: 'paid', amount_total: 4200000, currency: 'aed' } },
    });
    expect(good.ok).toBe(true);
  });
});
