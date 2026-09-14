# Atelier Riman — E‑commerce Frontend

React 19 + Vite 6 + TypeScript fashion e-commerce app with a Supabase backend
(Postgres + RLS, Edge Functions), Stripe Checkout (hosted, server-priced),
Tailwind CSS v4, motion animations, and an admin dashboard. Ships as a static
SPA with **build-time prerendered, SEO-complete routes** behind Nginx (Docker).

> Note: the AI Studio banner below is a project-origin artifact. This codebase
> does **not** call the Gemini API; no `GEMINI_API_KEY` is needed or used.

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Local development

```bash
npm ci
cp .env.example .env.local   # fill in your Supabase project values
npm run dev                  # http://localhost:3001
```

Required client env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
(anon key is public by design — RLS enforces authorization server-side).
Without them the app still runs on local seed data; Supabase-backed flows
(cart persistence, auth, admin) will log 401s.

## Quality gates

| Command | What it does |
| --- | --- |
| `npm run lint` | `tsc --noEmit` (strict, `noUnusedLocals`) |
| `npm test` | Vitest unit/component suite (jsdom) |
| `npx playwright test` | E2E suites in `tests/` + `e2e/` (dev server on :3001) |

## Production build — `SITE_URL` is mandatory

```bash
SITE_URL=https://riman.ae npm run build
```

The build **fails fast** unless `SITE_URL` is an absolute `https://` origin:
canonicals, Open Graph URLs, hreflang, `sitemap.xml` and `robots.txt` are
generated from it (see `vite/static.ts`). The build also prerenders every
public route (static pages + seeded product pages) to
`dist/<route>/index.html` with real metadata and JSON-LD.

```bash
npm run preview
```

## Docker

```bash
docker build \
  --build-arg SITE_URL=https://riman.ae \
  --build-arg VITE_SUPABASE_URL=https://<project>.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=<anon-key> \
  -t riman .
docker run -p 8080:80 riman
```

Nginx serves the prerendered route copies and all security headers, including
the CSP — `security-headers.conf` is the single source of truth
(no meta CSP in `index.html`); rationale and change process: [`docs/CSP.md`](docs/CSP.md).

## Supabase backend

Migrations in `supabase/migrations/` (apply in filename order via
`supabase db push` / SQL editor). Recent integrity migration:
`20260915020000_checkout_integrity.sql`.

Deploy Edge Functions (from repo root):

```bash
supabase functions deploy create-checkout --no-verify-jwt
supabase functions deploy create-order    --no-verify-jwt
supabase functions deploy stripe-webhook  --no-verify-jwt
supabase functions deploy send-notification            # requires JWT
```

Set function secrets (server-only — never `VITE_` prefixed, never bundled):

```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_live_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  SITE_URL=https://riman.ae \
  ALLOWED_SITE_ORIGINS=https://riman.ae,https://www.riman.ae \
  RESEND_API_KEY=re_... 
```

All checkout pricing, order totals and product names are **derived
server-side** from the database (`create-checkout`, `create-order`); the
browser only sends `{product_id, quantity, intent}` lines.
`ALLOWED_SITE_ORIGINS` must list every production origin or success/cancel
redirects are rejected.

**Stripe webhook**: point the destination at
`https://<project>.supabase.co/functions/v1/stripe-webhook` and subscribe to
`checkout.session.completed`, `checkout.session.expired`,
`payment_intent.succeeded`, `charge.refunded`. The endpoint verifies the raw
`Stripe-Signature` and is idempotent via the `stripe_processed_events` table.

## Admin panel

`/admin` (requires a Supabase account with admin metadata). Content,
policies, analytics IDs (GA/Plausible/Fathom), maintenance mode and an
allowlisted `<head>` snippet field (meta/link tags only — scripts are
stripped client-side **and** by CSP).

## Environment variables

See [`.env.example`](.env.example) — it documents which vars are public
(`VITE_*`, baked into the bundle) versus server-only secrets.
