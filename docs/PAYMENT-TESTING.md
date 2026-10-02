# Payment testing

Two layers are automated. A third requires Stripe test keys and is documented
here but not run in CI.

## What is covered today (no Stripe account needed)

| Layer | Where | What it proves |
|---|---|---|
| Client contract | `src/services/payment.test.ts` | The browser sends only ids, quantities, intents and dates — never names or prices. Malformed origins are dropped, errors are surfaced rather than swallowed. |
| Server derivation | `src/services/edgeCheckout.test.ts` | Prices come from the database, tampering is rejected, money is integer cents, rental overlaps are refused. |
| Webhook security | `src/services/edgeCheckout.test.ts` | Forged signatures, tampered bodies, replayed timestamps and duplicate deliveries are all refused; failures retry instead of vanishing. |
| Webhook fidelity | `src/services/stripeWebhookPayloads.test.ts` | Full, realistically shaped Stripe events parse correctly: nullable `amount_total`, the `paid`/`unpaid`/`no_payment_required` enum, absent metadata, `checkout.session.expired`, and the `async_payment_*` events we deliberately ignore. |
| Browser journey | `tests/payment-journey.spec.ts` | Form → gateway → hosted checkout → confirmation, the money contract as actually sent, an unpaid session never claims success, and a gateway failure keeps the client on checkout with the atelier handoff. Runs on Chromium **and** WebKit. |

The browser journey runs against a local stub gateway
(`scripts/stub-stripe-server.mjs`), started automatically by Playwright. It
branches on identifiers the client actually sends — the customer email on
create, the session id on verify — so scenarios stay independent:

| Input | Stub behaviour |
|---|---|
| `amira@example.com` | paid: true |
| session id containing `unpaid` | paid: false |
| `fail@example.com` | HTTP 500 |

## What is NOT covered, and how to cover it

Nothing today proves that **Stripe itself** accepts our parameters or delivers
our webhook. That needs Stripe test mode.

### One-time setup

1. Create a free Stripe account and stay in **test mode**.
2. Copy the test keys: Stripe dashboard → Developers → API keys. Use
   `sk_test_…` only.
3. Install the Stripe CLI (free): <https://stripe.com/docs/stripe-cli>
4. Start the local Supabase stack so the edge functions run on your machine:

   ```bash
   supabase start
   supabase functions serve --env-file supabase/.env.local
   ```

5. Forward webhooks to the local function:

   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
   ```

   `stripe listen` prints a `whsec_…` signing secret. That is what the edge
   function must use locally, otherwise every delivery fails signature
   verification.

6. Put the values in `supabase/.env.local` (gitignored):

   ```
   STRIPE_SECRET_KEY=sk_test_…
   STRIPE_WEBHOOK_SECRET=whsec_…
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=<printed by supabase start>
   VITE_STRIPE_CHECKOUT_ENDPOINT=http://127.0.0.1:54321/functions/v1/create-checkout
   ```

### The round trip

1. Put a gown in the bag and choose card payment at checkout.
2. On the Stripe page use the test card **`4242 4242 4242 4242`**, any future
   expiry, any CVC, any postcode.
3. You should land back on `/payment/success`, and the order in Supabase should
   move to fulfilled with the correct `stripe_session_id`.
4. `stripe listen` should show one `checkout.session.completed` delivery.

Use these cards for the failure paths:

| Card | Outcome |
|---|---|
| `4000 0000 0000 9995` | card declined |
| `4000 0000 0000 0259` | authentication required |

### Worth testing by hand once

- **Amount mismatch.** Change a gown's price in Supabase between creating the
  session and paying. The webhook should refuse to fulfil and set the order to
  `needs_review` with an admin alert, rather than quietly accepting the
  difference.
- **Double delivery.** Replay a webhook payload with `stripe trigger`. The
  claim gate should make it a no-op.
- **Refund.** Refund the payment intent. There is no automated refund handling;
  confirm that is acceptable for a deposit-based bridal business.

## Known limitation

Only card payments are enabled, so Stripe's delayed payment methods
(`checkout.session.async_payment_succeeded`) never fire and are ignored by the
handler. If bank transfer or similar is ever enabled, the webhook must handle
those events too, otherwise those orders will never be marked paid.