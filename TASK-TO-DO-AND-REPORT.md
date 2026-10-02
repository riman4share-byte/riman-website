# Riman Fashion — Test Report & Task List

**Written:** 2 October 2026
**Live site:** https://riman-website.pages.dev
**Live status:** up to date with the latest commit (`9848096`)
**Purpose:** close-out summary of this session + everything still to do.

---

## PART 1 — THE REPORT (plain language)

### 🌸 Overall: 🟢 5 out of 6 automated tests passed

We built the website updates, put them live, then let an independent automated
tester click through the real website like a customer would — browsing,
switching language, booking, and trying to break things.

#### ✅ What passed

| Area | What the tester did | Result |
|---|---|---|
| **Languages** | Switched English → Arabic and back, checked the text direction flipped correctly | **Passed** |
| **Whole site** | Walked the homepage, shop, product pages and cart | **Passed** |
| **Shopping** | Browsed collections, opened products, checked prices and images | **Passed** |
| **Bookings & Rentals** | Appointment requests, rental options, alteration enquiries | **Passed** |
| **Security** | 40 checks — tried to reach the admin area without logging in, tried weak passwords, tried to break the sign-up form | **Passed** |

The security result is the important one: the tester tried **four separate
times** to get into the private admin area and was **turned away every time**.
It also tried to sign up with a 3-character password and was correctly rejected.

#### 🟡 The one that could not finish

**The button animation test.** The tester could not check it.

**Why:** the testing tool works inside a sandbox that cannot move a computer
mouse onto a button. Our buttons only change appearance *while the mouse is
hovering them*. No mouse, no hover, nothing to observe.

**This is a limitation of the tester, not a fault in the website.** The buttons
were checked separately in a real browser and confirmed working — the fill
wipes in from the edge, the label changes from dark to light, the button does
**not** resize or jitter, and it mirrors correctly in Arabic.

#### 🔧 Problems found and fixed during this work

- **Contact details were inconsistent.** The email address appeared differently
  on different pages (`boutique@riman.ae` in code vs `info@riman.ae` live). All
  surfaces now read one admin-editable setting, so they can never drift apart.
  The Arabic phone number was also reversed and unreadable — fixed.
- **The website opened in Arabic for every new visitor.** Most bridal clientele
  here is international, so it now opens in **English**, with Arabic one tap
  away. A returning visitor's saved language still wins.
- **The header showed two logos stacked on top of each other** (the image file
  had a wordmark baked in, plus a separate text caption). Now one clean monogram
  + wordmark.
- **The website never asked permission before tracking visitors.** GA, Plausible
  and Fathom loaded regardless of the cookie choice. Now analytics only loads
  after a visitor explicitly accepts.
- **The rate limiter could be bypassed** by varying a header a browser controls.
  Now reads the trusted end of the chain.
- **The newsletter form pretended to work.** It saved addresses to the visitor's
  own browser and showed "submitted", so the atelier received nothing. Now hands
  the address to WhatsApp and says so honestly.
- **Search and bag appeared twice on phones** (header *and* bottom nav). Header
  now shows logo + menu only on small screens.
- **The mobile menu trapped keyboard users.** It was marked as a modal dialog
  with no way to escape. Escape key and focus trapping added.
- **The hero text was hiding behind the header** on 1440×900 and 1280×720
  laptops — the two most common screen sizes.
- **A password was written into the test files** and is in the repository
  history. Removed from the current files. **Still in history — see Task 9.**
- **Two outdated brand references** ("Atelier Riman") were hiding in the Arabic
  legal text, and the live meta description still used the old name.

#### 🚨 What still needs you — the two blockers

**1. 💳 Card payments do not work.**
A customer who tries to pay by card sees *"Checkout is currently unavailable."*
They can still pay at the atelier, but **nobody can pay online.** This is not a
bug — the Stripe account was never connected. Verified against the live site.

**2. 📧 No emails are sent at all.**
When an order is placed, no confirmation reaches the customer and **no email
reaches you**. The messages are generated correctly and saved to a queue, but
nothing is scheduled to send them.

#### ⚠️ Three smaller things worth knowing

1. **The website is heavy on phones.** It ships large photos and a lot of code,
   with no responsive image sizing. On a slow phone or weak signal it will feel
   slow. This is the main quality issue remaining.
2. **Only one browser engine is tested.** Chrome-style browsers are covered;
   iPhone/Safari is not. Given how much Arabic and display typography the site
   uses, this gap is worth closing.
3. **About 15 pages now have bilingual text typed directly into the code**
   instead of kept in one translation list. It works, but changing a word later
   means hunting for it across files.

#### ✅ Bottom line

The design, the security and the shopping experience all tested well. Nothing is
fundamentally broken. **The site is one step from being able to open for
business — the two services that were never switched on.**

---

## PART 2 — TASKS STILL TO DO

Ordered by priority. Tasks 1 and 2 are the launch blockers.

### 🔴 BLOCKER 1 — Switch on card payments

**Status:** code is complete and deployed; only credentials are missing.

Card payments currently fail. Verified live: a valid cart returns
`HTTP 503 {"error":"Checkout is currently unavailable"}` after passing all
validation, because no Stripe secret is configured.

**Steps**

1. Get the keys from [dashboard.stripe.com](https://dashboard.stripe.com) →
   **Developers → API keys**. Use **test** keys first.
2. Set them on Supabase:
   ```bash
   supabase secrets set --project-ref vbuavhnpemnfsuguglqn \
     STRIPE_SECRET_KEY=sk_test_xxx \
     STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```
   `STRIPE_WEBHOOK_SECRET` comes from creating a webhook endpoint (step 3),
   not from the API keys page.
3. Create a webhook endpoint pointing at:
   ```
   https://vbuavhnpemnfsuguglqn.supabase.co/functions/v1/stripe-webhook
   ```
   Subscribe to these events — **all five are required**:
   - `checkout.session.completed` — marks the order paid
   - `checkout.session.expired` — releases the held rental dates
   - `charge.refunded` — marks refunded and frees the dates
   - `refund.created` — same, for refunds issued directly
   - `charge.dispute.created` — flags for manual review
4. Smoke test with the Stripe CLI before going live:
   ```bash
   stripe listen --forward-to localhost:<port>/functions/v1/stripe-webhook
   stripe trigger checkout.session.completed
   ```
   Full manual test script: `docs/PAYMENT-TESTING.md`
5. Swap `sk_test_` → `sk_live_` only after a full test-mode purchase, refund and
   dispute cycle succeeds.

**Also note:** only card is enabled. If bank transfer / delayed payment methods
are ever turned on, the webhook must additionally handle
`checkout.session.async_payment_succeeded` or those orders will never be marked
paid.

---

### 🔴 BLOCKER 2 — Switch on transactional email

**Status:** the queue, templates and worker all exist. Nothing sends.

Order confirmations are written to `notification_outbox` and stay there. The
worker needs an API key and a schedule.

**Steps**

1. Create an account at [resend.com](https://resend.com) and verify the sending
   domain `riman.ae`.
2. Set the key:
   ```bash
   supabase secrets set --project-ref vbuavhnpemnfsuguglqn RESEND_API_KEY=re_xxx
   ```
3. **Schedule the worker.** This is the missing piece — no cron or `pg_cron`
   job calls it, so nothing drains the queue. Options, cheapest first:
   - Supabase scheduled function / dashboard cron → POST
     `https://vbuavhnpemnfsuguglqn.supabase.co/functions/v1/process-outbox`
     with header `x-outbox-secret: <OUTBOX_WORKER_SECRET>` every 1–5 minutes.
   - An external cron service (cron-job.org, GitHub Actions schedule).
4. Confirm an order triggers a real email to the customer **and** the admin
   alert, then check `notification_outbox` empties.

**Note:** the from-address is currently hardcoded as
`Riman Fashion <orders@riman.ae>` in
`supabase/functions/process-outbox/index.ts:24`. If you send from a different
domain, change it there.

---

### 🟡 IMPORTANT 3 — Performance: images and bundle size

The only genuine structural weakness left. Nothing is broken; it is just heavy.

Current measurements:

| Item | Size |
|---|---|
| `index` main bundle | ~780 kB (230 kB gzipped) |
| `model-viewer` chunk (3D) | ~1.0 MB (293 kB gzipped) |
| `AdminDashboard` chunk | ~393 kB (111 kB gzipped) |
| Frame-sequence images | 269 files, **4.8 MB** |
| All photography in `public/` | **13.3 MB** |

**Tasks**

- [ ] Convert the 269 frame-sequence JPEGs to **AVIF or WebP** — biggest single
      win on the homepage.
- [ ] Add responsive `srcset` / `sizes` to photography so phones stop
      downloading desktop-sized files.
- [ ] Resize the largest images; the top 15 files account for most of the 13.3 MB.
- [ ] Consider `manualChunks` to split `recharts` out of `AdminDashboard` — it is
      only ever needed by admins, not shoppers.
- [ ] Re-measure with Lighthouse or WebPageTest on mobile throttling after.

---

### 🟡 IMPORTANT 4 — Test iPhone / Safari (WebKit)

`playwright.config.ts` currently defines **Chromium only**. Every e2e run since
that change has had zero iOS/Safari coverage.

This matters more than usual here because the site is heavily RTL and uses
display typography with wide letter-spacing — exactly where WebKit differs.

**Steps**
- [ ] Re-add the WebKit project to `playwright.config.ts` (a previous version
      had one; `git log -p playwright.config.ts` will show it).
- [ ] Run the suite on WebKit and fix whatever surfaces — expect text wrapping
      and letter-spacing differences to be the first casualties.

---

### 🟡 IMPORTANT 5 — Fix the test configuration and duplicate tests

- [ ] The TestSprite plan files were corrected to drop a stale
      "the site is password-protected" step that no longer matches reality, but
      the **existing tests still have the old plan saved**. Re-create or
      `test update` them so they use the fixed plans.
- [ ] There are **duplicate tests** in the project — three copies of "Admin
      Dashboard", three of "Appointments, Rentals & Alterations". Prune them.
- [ ] The three "Admin Dashboard" tests are **blocked** because no admin
      credential is configured on the TestSprite project. Either configure one
      (`testsprite project credential <id> --type "Bearer token" --credential …`)
      or archive those tests.

---

### 🟢 MINOR 6 — Remaining dependency advisory

`npm audit` reports **1 low** advisory: `esbuild`, arbitrary file read when
running the dev server on Windows. It is a **build-only** transitive dependency
of `vite` and `tsx` and never ships to production, so it was deliberately left
rather than force-overriding vite's pinned range.

Both moderate `react-router` CVEs from the audit were resolved by upgrading to
`7.18.4`.

---

### 🟢 MINOR 7 — Untangle hardcoded bilingual strings

About 15 files use `language === 'ar' ? '…' : '…'` inline instead of the
translation table in `LanguageContext.tsx`. This is a deliberate stylistic
choice that was made during the design work, not an oversight.

Consequences to be aware of:
- Those strings cannot be edited in one place.
- Two e2e tests had to be updated to match new copy (`WishlistPage`,
  `EditorialPlate`).

**Task:** decide whether to keep it or migrate back to `t('key')`. No action
needed for launch either way.

---

### 🟢 MINOR 8 — Confirm business facts that were aligned by assumption

These were inconsistent across three sources and were aligned to whatever
**production was already serving**. Please confirm they are correct:

- **Opening hours** — now stated as *Saturday–Thursday, 10:00–22:00, closed
  Friday* in the settings default, the translation strings, the JSON-LD
  structured data and the prerendered homepage copy. Previously three different
  answers.
- **Contact email** — `info@riman.ae` everywhere. If the real mailbox is
  different, change it in **Admin → Settings → Contact** (now the single source).
- **Address** — "Al Zahra St, Sharjah, UAE" in code, but the live settings row
  says only "Sharjah, UAE".

---

### 🟢 MINOR 9 — Credential disclosed in git history

The site-gate password `My-Drop-Site` was committed in the seven
`testsprite-plan-*.json` files and remains in git history. It has been removed
from the current files, and the live site has no password gate at all — so it is
almost certainly dead. Treat it as disclosed: if it was ever used anywhere real,
rotate it.

---

### ⚪ 10 — Not verified (needs a human)

These could not be checked from code and were never exercised:

- Real devices — no physical iPhone or Android, no real Safari, no tablet.
- Real card payments end-to-end.
- Real email delivery.
- Colour contrast — palette read, but no automated contrast check on rendered
  pages.
- Arabic typography at small sizes, and mixed Arabic/English text.
- The admin dashboard, MFA gate, and all admin CRUD.
- Supabase Storage uploads (the bucket list is currently empty).
- The service worker offline behaviour.
- Dashboard login (needs credentials).

---

## PART 3 — TECHNICAL REFERENCE

### Current deployment state (verified 2 Oct 2026)

```
Git            main, clean working tree, fully pushed to origin
Live URL       https://riman-website.pages.dev
Database       vbuavhnpemnfsuguglqn (Mumbai) — 33 migrations, all applied
Edge functions create-checkout    v6  ACTIVE
               create-order        v6  ACTIVE
               stripe-webhook      v6  ACTIVE
               send-notification   v3  (2026-09-16, stale)
               process-outbox      v3  (2026-09-16, stale)
Secrets set    SITE_URL, APP_URL, ALLOWED_SITE_ORIGINS, OUTBOX_WORKER_SECRET,
               Supabase keys
Secrets MISSING STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
```

### Recent commits

```
9848090  fix(testsprite): drop the stale site-gate password step from all plans
4cb0680  feat: couture button interaction, reworked home header, English-first default
0ea3c54  fix: patch react-router CVEs, gate analytics on consent, unspoof the rate limiter
a3172d0  fix: pre-launch audit — contact details, newsletter data loss, PWA icon, a11y
81ca0af  fix(payments): handle refunds so a refunded rental stops blocking dates
ad63f01  fix(seo): drop the old brand name from the live meta description
```

### Key files

| Path | What it is |
|---|---|
| `supabase/functions/create-checkout/` | Card checkout, order creation, idempotency |
| `supabase/functions/stripe-webhook/` | Payment fulfilment, refunds, disputes |
| `supabase/functions/create-order/` | "Pay at the atelier" path |
| `supabase/functions/process-outbox/` | Email worker — **needs scheduling** |
| `supabase/functions/_shared/checkoutValidation.ts` | Request + rental-date validation |
| `supabase/functions/_shared/httpGuards.ts` | Rate-limit IP, secret comparison |
| `src/components/Header.tsx` | Header (rebuilt this session) |
| `src/index.css` | Button system + design tokens |
| `src/components/ui-21st/HeroSection.tsx` | Homepage hero |
| `src/lib/consent.ts` | Cookie consent source of truth |
| `src/lib/crypto.ts` | Client-side password hashing (local fallback only) |
| `docs/PAYMENT-TESTING.md` | Manual Stripe test script |
| `vite/static.ts` | Prerender, sitemap and robots generation |

### Useful commands

```bash
npm run dev            # dev server (port 3001; 3002 if 3001 is taken)
npm run build          # production build
npm run lint           # tsc --noEmit
npm test               # vitest — 261 tests
npx playwright test    # e2e — Chromium only right now
npx --yes deno@2 check supabase/functions/*/index.ts   # edge function types

supabase db push --linked --include-all
supabase functions deploy <name> --project-ref vbuavhnpemnfsuguglqn
supabase secrets set --project-ref vbuavhnpemnfsuguglqn KEY=value
```

### Verification commands that were used this session

```bash
npm run lint                                  # clean
npm test                                      # 261 passed
npx playwright test                           # 266 tests collected, 20 files
npm run build                                 # passes (3 chunks >500kB warning)
npm audit --registry=https://registry.npmjs.org   # 1 low (esbuild, build-only)
npx --yes deno@2 check supabase/functions/*/index.ts  # clean
```

**Note on the npm registry:** the machine is configured to
`registry.npmmirror.com`, which does not implement the audit endpoint. Pass
`--registry=https://registry.npmjs.org` to `npm audit` or it errors out.

### TestSprite

- Project: `4c876be5-b96a-41f2-9ddf-65d2fdf9dfc2` ("Riman Fashion v2")
- Dashboard: https://www.testsprite.com/dashboard/tests/4c876be5-b96a-41f2-9ddf-65d2fdf9dfc2
- The CLI **only tests a deployed URL** and rejects `localhost`. There is no
  TestSprite MCP configured, so changes must be deployed before they can be
  verified.
- It **cannot emulate pointer hover**, so `:hover`-only visual states are not
  verifiable through it. Check those in a real browser.

---

## PART 4 — FIRST THREE THINGS TO DO NEXT TIME

1. **Set the Stripe test keys** → run a full test-mode purchase, refund and
   dispute cycle → then swap to live keys. *(Unblocks online payment.)*
2. **Set the Resend key and schedule the outbox worker** → confirm a real order
   email arrives. *(Unblocks customer confirmations.)*
3. **Re-add WebKit to the Playwright config** and run the suite on it.

Once 1 and 2 are done, the site can take real money and confirm orders by email.
Everything else on this list is quality work that can follow.
