import { describe, it, expect } from 'vitest';
import { extractWebhookOrderRef } from '../../supabase/functions/_shared/checkoutValidation';

/**
 * Webhook payload fidelity.
 *
 * The signature and idempotency tests in edgeCheckout.test.ts feed the handler
 * minimal payloads that we wrote ourselves, so they cannot catch a mismatch
 * between what we assume Stripe sends and what Stripe actually sends. These
 * fixtures mirror the documented shape of a real `checkout.session.completed`
 * event - every field Stripe includes, the real nesting, real enum values.
 *
 * The cases worth defending are the ones Stripe genuinely varies:
 *   - `amount_total` is nullable (delayed / non-determinable totals)
 *   - `payment_status` is an enum: paid | unpaid | no_payment_required
 *   - `metadata` is absent unless we set it
 *   - delayed payment methods emit async_* events we do not handle
 */

const ORDER_ID = '3f9c1a2e-7b4d-4a11-9c8e-2d5b6f0a1c33';

function realCheckoutSessionEvent(overrides: Record<string, unknown> = {}, sessionOverrides: Record<string, unknown> = {}) {
  return {
    id: 'evt_1P3Q9kJ2HvKJ7c0dRb8xYz2eVa',
    object: 'event',
    api_version: '2024-06-20',
    created: 1758403200,
    data: {
      object: {
        id: 'cs_test_a1RimanCheckoutSession00000000000000000000000000',
        object: 'checkout.session',
        amount_subtotal: 4200000,
        amount_total: 4200000,
        currency: 'aed',
        customer: 'cus_RimanCustomer0000000000000000000000',
        customer_creation: 1758403100,
        customer_details: {
          address: {
            city: 'Sharjah',
            country: 'AE',
            line1: 'Al Zahra St',
            line2: null,
            postal_code: null,
            state: null,
          },
          email: 'amira@example.com',
          name: 'Amira Haddad',
          phone: '+971500000000',
          tax_exempt: 'none',
        },
        expires_at: 1758495600,
        invoice: null,
        livemode: false,
        metadata: { order_id: ORDER_ID },
        mode: 'payment',
        payment_intent: 'pi_3P3Q9kJ2HvKJ7c0dRb8xYz2eVb',
        payment_method_types: ['card'],
        payment_status: 'paid',
        status: 'complete',
        ui_mode: 'hosted',
        // Stripe sends a null here for sessions whose total is not determinable
        // at session time. It must not be treated as zero.
        ...sessionOverrides,
      },
    },
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type: 'checkout.session.completed',
    ...overrides,
  };
}

describe('extractWebhookOrderRef against real Stripe payloads', () => {
  it('parses a full, realistic checkout.session.completed event', () => {
    const result = extractWebhookOrderRef(realCheckoutSessionEvent());
    expect(result.ok).toBe(true);
    if (!result.ok || 'ignore' in result) return;
    expect(result.value).toEqual({
      eventId: 'evt_1P3Q9kJ2HvKJ7c0dRb8xYz2eVa',
      eventType: 'checkout.session.completed',
      orderId: ORDER_ID,
      sessionId: 'cs_test_a1RimanCheckoutSession00000000000000000000000000',
      // Captured so a later charge.refunded can be matched back to this order.
      paymentIntentId: 'pi_3P3Q9kJ2HvKJ7c0dRb8xYz2eVb',
      amountTotalCents: 4200000,
      currency: 'aed',
      paymentStatus: 'paid',
    });
  });

  it('treats a null payment_intent as unknown, not as a bad value', () => {
    const result = extractWebhookOrderRef(realCheckoutSessionEvent({}, { payment_intent: null }));
    expect(result.ok).toBe(true);
    if (!result.ok || 'ignore' in result) return;
    expect(result.value.paymentIntentId).toBeNull();
  });

  it('treats a null amount_total as unknown, never as zero', () => {
    // Stripe sends amount_total: null when the total is not determinable. The
    // webhook cross-checks the charged amount against the order snapshot and
    // must skip that check rather than flag a 0-vs-order mismatch.
    const result = extractWebhookOrderRef(realCheckoutSessionEvent({}, { amount_total: null }));
    expect(result.ok).toBe(true);
    if (!result.ok || 'ignore' in result) return;
    expect(result.value.amountTotalCents).toBeNull();
  });

  it.each(['paid', 'unpaid', 'no_payment_required'])('passes through payment_status %s verbatim', (status) => {
    const result = extractWebhookOrderRef(realCheckoutSessionEvent({}, { payment_status: status }));
    expect(result.ok).toBe(true);
    if (!result.ok || 'ignore' in result) return;
    expect(result.value.paymentStatus).toBe(status);
  });

  it('rejects a completed session that carries no order metadata', () => {
    // metadata is only present because we set it at session creation.
    const event = realCheckoutSessionEvent();
    delete (event.data.object as Record<string, unknown>).metadata;
    const result = extractWebhookOrderRef(event);
    expect(result.ok).toBe(false);
  });

  it('rejects an empty-string order_id rather than trusting it', () => {
    const result = extractWebhookOrderRef(realCheckoutSessionEvent({}, { metadata: { order_id: '' } }));
    expect(result.ok).toBe(false);
  });

  it('ignores the async payment events Stripe emits for delayed methods', () => {
    // These are real events, but we do not fulfil on them: the site only
    // accepts cards, and fulfilling from an async event would skip the
    // amount cross-check. They must be ignored, never partially applied.
    for (const type of [
      'checkout.session.async_payment_succeeded',
      'checkout.session.async_payment_failed',
      'payment_intent.succeeded',
      'charge.refunded',
    ]) {
      const result = extractWebhookOrderRef(realCheckoutSessionEvent({ type }));
      expect('ignore' in result, `${type} must be ignored`).toBe(true);
    }
  });

  it('handles checkout.session.expired, which carries no payment', () => {
    const result = extractWebhookOrderRef(
      realCheckoutSessionEvent(
        { type: 'checkout.session.expired' },
        { payment_status: 'unpaid', status: 'expired', amount_total: null, payment_intent: null },
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok || 'ignore' in result) return;
    expect(result.value.eventType).toBe('checkout.session.expired');
    expect(result.value.paymentStatus).toBe('unpaid');
    expect(result.value.amountTotalCents).toBeNull();
  });

  it('rejects a payload that is not an object at all', () => {
    expect(extractWebhookOrderRef(null).ok).toBe(false);
    expect(extractWebhookOrderRef('checkout.session.completed').ok).toBe(false);
    expect(extractWebhookOrderRef({ type: 'checkout.session.completed' }).ok).toBe(false);
  });
});