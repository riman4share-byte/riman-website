/**
 * Shared, dependency-free validation & pricing logic for checkout/order
 * edge functions (Deno) and vitest (node). Keep this file PURE:
 * no Deno APIs, no supabase-js, no DOM — so it can be type-checked and
 * unit-tested in every runtime.
 *
 * Security contract:
 *  - The browser may ONLY send: product ids, quantities, intent, rental dates,
 *    an optional returnOrigin, and customer contact fields.
 *  - Names, prices, subtotals, totals, product types and availability are
 *    ALWAYS derived from the database here.
 *  - All money math is integer minor units (AED cents). DB stores integer AED.
 */

export const MAX_CART_LINES = 20;
export const MAX_QUANTITY = 10;
export const CURRENCY = 'aed';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Intent = 'sale' | 'rent';

export interface CheckoutLineInput {
  product_id: string;
  quantity: number;
  intent: Intent;
  rental_start_date?: string;
  rental_end_date?: string;
  size?: string;
}

export interface CheckoutRequest {
  lines: CheckoutLineInput[];
  returnOrigin?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  notes?: string;
}

export interface ProductRow {
  id: string;
  name: string;
  product_type: string; // 'sale' | 'rent' | 'both'
  sale_price: number | null; // integer AED
  rental_price: number | null; // integer AED
  security_deposit?: number | null; // integer AED
  is_active: boolean;
}

export interface DerivedLine {
  product_id: string;
  product_name: string;
  intent: Intent;
  quantity: number;
  unit_price_aed: number;
  line_total_aed: number;
  line_total_cents: number;
  size?: string;
  rental_start_date?: string;
  rental_end_date?: string;
  security_deposit?: number;
}

export type ValidationError = { ok: false; error: string };
export type Validated<T> = { ok: true; value: T } | ValidationError;

function fail(error: string): ValidationError {
  return { ok: false, error };
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function assertNoUnknownKeys(obj: Record<string, unknown>, allowed: string[], label: string): string | null {
  for (const key of Object.keys(obj)) {
    if (!allowed.includes(key)) return `${label} contains unknown field "${key}"`;
  }
  return null;
}

const LINE_KEYS = ['product_id', 'quantity', 'intent', 'rental_start_date', 'rental_end_date', 'size'];
const REQUEST_KEYS = [
  'lines', 'returnOrigin', 'customerName', 'customerEmail', 'customerPhone',
  'customerAddress', 'customerCity', 'customerCountry', 'notes',
];

function isValidDateOnly(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Strict request validation. Rejects unknown fields, oversized carts, bad types. */
export function parseCheckoutRequest(raw: unknown): Validated<CheckoutRequest> {
  if (!isPlainObject(raw)) return fail('Invalid request body');

  const unknownField = assertNoUnknownKeys(raw, REQUEST_KEYS, 'Request');
  if (unknownField) return fail(unknownField);

  const { lines, returnOrigin, customerName, customerEmail, customerPhone, customerAddress, customerCity, customerCountry, notes } = raw;

  if (!Array.isArray(lines) || lines.length === 0) return fail('No items provided');
  if (lines.length > MAX_CART_LINES) return fail(`Too many cart lines (max ${MAX_CART_LINES})`);

  if (typeof customerName !== 'string' || !customerName.trim() || customerName.length > 200) return fail('Invalid customer name');
  if (typeof customerEmail !== 'string' || !EMAIL_RE.test(customerEmail) || customerEmail.length > 254) return fail('Invalid customer email');
  for (const [key, value] of Object.entries({ customerPhone, customerAddress, customerCity, customerCountry, notes }) as [string, unknown][]) {
    if (value !== undefined && (typeof value !== 'string' || (value as string).length > 500)) return fail(`Invalid ${key}`);
  }
  if (returnOrigin !== undefined && typeof returnOrigin !== 'string') return fail('Invalid returnOrigin');

  const parsedLines: CheckoutLineInput[] = [];
  const seen = new Set<string>();
  for (const entry of lines) {
    if (!isPlainObject(entry)) return fail('Invalid cart line');
    const lineUnknown = assertNoUnknownKeys(entry, LINE_KEYS, 'Cart line');
    if (lineUnknown) return fail(lineUnknown);

    const { product_id, quantity, intent, rental_start_date, rental_end_date, size } = entry;
    if (typeof product_id !== 'string' || !product_id || product_id.length > 64) return fail('Invalid product id');
    if (size !== undefined && (typeof size !== 'string' || size.length > 20)) return fail('Invalid size');

    // Merge duplicate ids by summing quantities (capped below).
    const qty = quantity;
    if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1) return fail('Invalid quantity');

    if (intent !== 'sale' && intent !== 'rent') return fail('Invalid intent');

    if (rental_start_date !== undefined && (typeof rental_start_date !== 'string' || !isValidDateOnly(rental_start_date))) return fail('Invalid rental start date');
    if (rental_end_date !== undefined && (typeof rental_end_date !== 'string' || !isValidDateOnly(rental_end_date))) return fail('Invalid rental end date');
    if (rental_start_date && rental_end_date && rental_start_date >= rental_end_date) return fail('Rental end date must be after start date');

    const key = `${product_id}|${intent}`;
    const existing = parsedLines.find(l => `${l.product_id}|${l.intent}` === key);
    if (existing) {
      existing.quantity += qty;
      if (existing.quantity > MAX_QUANTITY) return fail(`Excessive quantity (max ${MAX_QUANTITY})`);
    } else {
      if (qty > MAX_QUANTITY) return fail(`Excessive quantity (max ${MAX_QUANTITY})`);
      parsedLines.push({
        product_id,
        quantity: qty,
        intent,
        ...(rental_start_date ? { rental_start_date: rental_start_date as string } : {}),
        ...(rental_end_date ? { rental_end_date: rental_end_date as string } : {}),
      });
    }
    seen.add(product_id);
  }

  return {
    ok: true,
    value: {
      lines: parsedLines,
      ...(typeof returnOrigin === 'string' ? { returnOrigin } : {}),
      customerName: (customerName as string).trim(),
      customerEmail: (customerEmail as string).trim().toLowerCase(),
      ...(typeof customerPhone === 'string' ? { customerPhone } : {}),
      ...(typeof customerAddress === 'string' ? { customerAddress } : {}),
      ...(typeof customerCity === 'string' ? { customerCity } : {}),
      ...(typeof customerCountry === 'string' ? { customerCountry } : {}),
      ...(typeof notes === 'string' ? { notes } : {}),
    },
  };
}

/** Integer AED → integer cents. Rejects non-integers / unsafe values. */
export function toMinorUnits(aedAmount: number): number | null {
  if (!Number.isInteger(aedAmount) || !Number.isSafeInteger(aedAmount) || aedAmount < 0) return null;
  const cents = aedAmount * 100;
  return Number.isSafeInteger(cents) ? cents : null;
}

/** Does `origin` exactly match an allowlist entry? */
export function isAllowedOrigin(origin: string | undefined | null, allowlist: string[]): boolean {
  if (!origin) return false;
  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
  if (parsed.protocol === 'http:' && !['http://localhost:3001', 'http://127.0.0.1:3001'].includes(origin)) return false;
  const normalized = origin.replace(/\/+$/, '');
  return allowlist.map(a => a.replace(/\/+$/, '')).includes(normalized);
}

export function parseAllowedOrigins(env: Record<string, string | undefined>): string[] {
  const sites = [
    env.SITE_URL,
    ...(env.ALLOWED_SITE_ORIGINS || '').split(','),
    env.APP_URL,
  ];
  return [...new Set(sites.map(s => (s || '').trim().replace(/\/+$/, '')).filter(Boolean))];
}

/**
 * Derive trusted lines from DB rows. Every price/name/type used downstream
 * comes from `dbProducts`, never from the request.
 */
export function deriveTrustedLines(
  lines: CheckoutLineInput[],
  dbProducts: ProductRow[],
): Validated<{ trusted: DerivedLine[]; subtotalAed: number; subtotalCents: number; orderType: 'sale' | 'rental' | 'mixed' }> {
  const byId = new Map(dbProducts.map(p => [p.id, p]));
  const trusted: DerivedLine[] = [];
  let subtotalAed = 0;

  for (const line of lines) {
    const db = byId.get(line.product_id);
    if (!db || !db.is_active) return fail(`Invalid or inactive product: ${line.product_id}`);

    const intentIsRent = line.intent === 'rent';
    const allowedForIntent = intentIsRent
      ? (db.product_type === 'rent' || db.product_type === 'both')
      : (db.product_type === 'sale' || db.product_type === 'both');
    if (!allowedForIntent) return fail(`Product "${db.name}" is not available for ${line.intent}`);

    const unit = intentIsRent ? db.rental_price : db.sale_price;
    if (typeof unit !== 'number' || !Number.isInteger(unit) || unit <= 0) {
      return fail(`Product "${db.name}" has no valid ${line.intent} price`);
    }

    const lineAed = unit * line.quantity; // integer × integer = integer
    const lineCents = toMinorUnits(lineAed);
    if (lineCents === null) return fail('Amount overflow');

    subtotalAed += lineAed;
    trusted.push({
      product_id: db.id,
      product_name: db.name,
      intent: line.intent,
      quantity: line.quantity,
      unit_price_aed: unit,
      line_total_aed: lineAed,
      line_total_cents: lineCents,
      ...(line.size ? { size: line.size } : {}),
      ...(line.rental_start_date ? { rental_start_date: line.rental_start_date } : {}),
      ...(line.rental_end_date ? { rental_end_date: line.rental_end_date } : {}),
      // Deposit is a DB fact, never a client input.
      ...(intentIsRent && typeof db.security_deposit === 'number' && db.security_deposit > 0
        ? { security_deposit: db.security_deposit }
        : {}),
    });
  }

  if (!Number.isSafeInteger(subtotalAed) || subtotalAed <= 0) return fail('Invalid subtotal');
  const subtotalCents = toMinorUnits(subtotalAed);
  if (subtotalCents === null) return fail('Subtotal overflow');

  const intents = new Set(trusted.map(t => t.intent));
  const orderType: 'sale' | 'rental' | 'mixed' =
    intents.size === 2 ? 'mixed' : intents.has('rent') ? 'rental' : 'sale';

  return { ok: true, value: { trusted, subtotalAed, subtotalCents, orderType } };
}

/** Overlap check for rental dates against existing bookings. */
export function rentalPeriodIsFree(
  bookings: Array<{ start_date: string; end_date: string }>,
  startDate: string,
  endDate: string,
): boolean {
  return !bookings.some(b => b.start_date < endDate && b.end_date > startDate);
}

/**
 * Normalizes a signature-verified Stripe webhook event.
 * Returns null for events we ignore; `fail` for malformed payment events.
 */
export function extractWebhookOrderRef(event: unknown): Validated<{
  eventId: string;
  eventType: string;
  orderId: string;
  sessionId: string;
  amountTotalCents: number | null;
  currency: string | null;
  paymentStatus: string;
}> | { ok: false; ignore: true } {
  if (!isPlainObject(event)) return fail('Invalid event');
  const eventId = event.id;
  const eventType = event.type;
  if (typeof eventId !== 'string' || !eventId || typeof eventType !== 'string' || !eventType) return fail('Invalid event envelope');

  if (eventType !== 'checkout.session.completed' && eventType !== 'checkout.session.expired') {
    return { ok: false, ignore: true } as const;
  }

  const data = event.data;
  const session = isPlainObject(data) ? data.object : undefined;
  if (!isPlainObject(session)) return fail('Invalid session object');

  const meta = session.metadata;
  const orderId = isPlainObject(meta) ? meta.order_id : undefined;
  if (typeof orderId !== 'string' || !orderId) return fail('Session missing order_id metadata');

  const sessionId = typeof session.id === 'string' ? session.id : '';
  if (!sessionId) return fail('Session missing id');

  return {
    ok: true,
    value: {
      eventId,
      eventType,
      orderId,
      sessionId,
      amountTotalCents: typeof session.amount_total === 'number' ? session.amount_total : null,
      currency: typeof session.currency === 'string' ? session.currency : null,
      paymentStatus: typeof session.payment_status === 'string' ? session.payment_status : '',
    },
  };
}
