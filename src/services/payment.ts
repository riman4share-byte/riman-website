/**
 * Stripe checkout client.
 *
 * SECURITY CONTRACT: the browser sends ONLY product ids, quantities, intents
 * and rental dates — plus contact fields. Prices, names, subtotals, totals,
 * order type and availability are derived server-side by the create-checkout
 * Edge Function from the database. Anything else is rejected by the function's
 * strict schema.
 */

export interface CheckoutLine {
  product_id: string;
  quantity: number;
  intent: 'sale' | 'rent';
  rental_start_date?: string;
  rental_end_date?: string;
}

export interface CheckoutInput {
  lines: CheckoutLine[];
  /** window.location.origin; the server validates it against ALLOWED_SITE_ORIGINS. */
  returnOrigin?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  notes?: string;
}

export interface CheckoutResult {
  url: string;
  orderId?: string;
}

function getEndpoint(): string {
  return import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT || '';
}

/** Normalize to an origin only (drops path/query so nothing extra leaks). */
function toOrigin(value?: string): string | undefined {
  try {
    return value ? new URL(value).origin : undefined;
  } catch {
    return undefined;
  }
}

export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult | null> {
  const endpoint = getEndpoint();
  if (!endpoint) {
    console.info('[Riman] Stripe checkout not configured — set VITE_STRIPE_CHECKOUT_ENDPOINT');
    return null;
  }

  // Defensive: strip any accidentally attached money/name fields before send.
  const body = {
    lines: input.lines.map(l => ({
      product_id: l.product_id,
      quantity: l.quantity,
      intent: l.intent,
      ...(l.rental_start_date ? { rental_start_date: l.rental_start_date } : {}),
      ...(l.rental_end_date ? { rental_end_date: l.rental_end_date } : {}),
    })),
    returnOrigin: toOrigin(input.returnOrigin),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    ...(input.customerPhone ? { customerPhone: input.customerPhone } : {}),
    ...(input.customerAddress ? { customerAddress: input.customerAddress } : {}),
    ...(input.customerCity ? { customerCity: input.customerCity } : {}),
    ...(input.customerCountry ? { customerCountry: input.customerCountry } : {}),
    ...(input.notes ? { notes: input.notes } : {}),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Riman] Checkout session creation failed:', err);
      return null;
    }

    const { url, orderId } = await response.json();
    if (!url) return null;
    return { url, ...(orderId ? { orderId } : {}) };
  } catch (err) {
    console.error('[Riman] Failed to create checkout session:', err);
    return null;
  }
}

export async function verifyCheckoutSession(sessionId: string): Promise<{
  paid: boolean;
  orderId?: string;
  customerEmail?: string;
} | null> {
  const endpoint = getEndpoint();
  if (!endpoint) return null;

  try {
    const response = await fetch(`${endpoint}?session_id=${encodeURIComponent(sessionId)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function isStripeConfigured(): boolean {
  return Boolean(getEndpoint());
}