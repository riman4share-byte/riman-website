# Riman Fashion — Quality, Security & Resilience Program

* **Author:** Riman Dev
* **Date:** 2026-11-06

## Overview

A program to make the Riman Fashion e-commerce site (React + Vite + TypeScript, Supabase, Stripe, Gemini AI, Tailwind v4) bug-free, secure, performant under load, and polished in UX. Four phases in priority order: (1) eliminate bugs across all features, (2) harden security, (3) ensure performance and stability under concurrent load and poor networks, (4) upgrade design/UX where gaps exist. The Goldfish review found that the real launch blockers are operational (missing payment/email credentials), not code, and that most of the proposed "comprehensive program" is either already in progress or premature. Scope should be narrowed to the documented task list first.

## Analysis

### Launch blockers (must fix before anything else)

- **Payments and email are entirely non-functional in production.** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `RESEND_API_KEY` are unset, and the outbox worker has no cron schedule. Every checkout returns 503; no order confirmations are sent. Mitigation: provision secrets, schedule `process-outbox` every 1–2 minutes, and add a deploy-time smoke test that fails the pipeline if secrets are absent.
- **No end-to-end request correlation.** Browser and edge functions share no request id; `console.error` strings cannot be joined to server logs. A customer-reported failure is untraceable. Mitigation: generate and propagate `X-Request-Id` on every client fetch and include it in all edge-function log lines.
- **Sentry is initialized but only `GlobalErrorBoundary` calls `captureException`.** Service-layer catch blocks in `payment.ts`, `AuthContext.tsx`, `DataContext.tsx`, and Supabase services only `console.error`/toast. Payment, auth, and catalog failures are invisible. Mitigation: call `Sentry.captureException` in every service catch block with tags (`feature`, `operation`, `requestId`) and set `Sentry.setUser` on auth changes.

### Cost, quota, and infrastructure risks

- **Gemini virtual try-on depends on the free tier (~500 req/day, 10/min).** Each request holds an edge function open up to 60s and sends two base64 images with no caching (`Cache-Control: no-store`). Concurrent load exhausts the quota and returns 429/502. Mitigation: move to a paid tier or add a per-user daily cap below the ceiling; cache garment image base64 at the edge; add backpressure (queue) instead of 502.
- **Supabase egress and edge invocation caps are the hard ceiling.** `fetchProducts` uses `select('*')` (including image arrays); `DataContext` reloads the full catalogue on admin edits; `updateProductOrder` issues N sequential updates; no pagination on products/reviews/admin lists. Mitigation: project only needed columns, add cursor pagination, batch reorder via RPC, and enable the already-configured React Query for data.
- **Rate limiting fails open.** `withinRateLimit` returns `true` on any RPC error or exception, and `try_rate_limit` is service-role only. Behind Docker/nginx (no trusted proxy), `clientIp` uses the rightmost `X-Forwarded-For` entry, which the client controls — a curl loop rotates IPs and bypasses the limiter. Mitigation: fail closed (or to a stricter shared bucket) on RPC error; deploy behind a trusted proxy/Cloudflare and prefer `cf-connecting-ip`; add per-user caps for auth-gated endpoints.
- **Static asset weight: ~13.3MB photography, 4.8MB frame sequence (269 JPEGs), ~780KB main bundle, ~1MB model-viewer chunk.** No responsive `srcset`/`sizes`, no modern formats. Mobile LCP and egress suffer. Mitigation: convert frame sequence to AVIF/WebP, add `srcset`/`sizes`, lazy-load below-fold media, split `recharts` out of `AdminDashboard`.
- **Outbox drains 5 rows per invocation sequentially via Resend with no cron scheduled.** Burst or transient outage backs up the queue; exponential backoff (up to 32 min) delays confirmations; rows exhausting 6 attempts become permanently `failed`. Mitigation: schedule every 1–2 minutes, raise batch size / parallelize sends, alert on `failed` or stale `pending` rows.
- **Rental booking relies on a Postgres exclusion constraint detected after the fact.** Concurrent checkouts that race the constraint roll back to `needs_review` rather than retry; `promoteRentBookings` can throw on conflict, leaving a paid order with held dates and an admin alert; no automated compensation. Mitigation: serialize rental holds with `SELECT ... FOR UPDATE` or an advisory lock; add a reconciliation job for `needs_review` orders.
- **Single-region deployment** (Supabase Mumbai + static host, no read replicas or edge caching for REST). UAE-targeted traffic pays cross-region latency on every call; Supabase connection pool and free-tier invocation caps (500K/mo) are the hard ceiling. Mitigation: enable PgBouncer, cache immutable catalogue reads at the CDN, set invocation budgets/alerts, document a scale-up trigger.
- **Client-side auth rate limiting** (`loginAttempts` Map) is per-tab, in-memory, resets on reload — trivially bypassable. **Local fallback stores password hashes in `localStorage` and signs in without server verification** — credential disclosure and account-takeover vector if Supabase env is unset. Mitigation: remove or gate local-auth behind an explicit dev flag; enforce all auth through Supabase with server-side lockout.
- **Virtual try-on fetches the garment asset from `SITE_URL` (self-origin) synchronously** inside the 60s timeout, doubling latency and coupling try-on to the static host; a hung download consumes the full timeout and returns 504. Mitigation: serve garment images from a CDN with a short timeout and pre-validated allowlist; fail fast (~5s) with a distinct error code.

### Observability gaps

- **No performance instrumentation.** `tracesSampleRate: 0.1`, no custom transactions/spans around checkout/auth/product fetch/try-on, no Web Vitals reporting. Latency regressions on slow networks are undetectable. Mitigation: add Sentry performance spans for critical flows, report Core Web Vitals, tune sampling.
- **Edge-function logging is unstructured** (`console.error('create-checkout error:', err)`). Mitigation: replace with structured JSON logs (request id, function, route, status, duration, error class/code) in `supabase/functions/_shared`.
- **Client analytics is localStorage-only** (`src/services/analytics.ts`); funnel stats never leave the browser; admin GA/Plausible/Fathom IDs injected only after consent with no event bridge. Product funnel is blind in production. Mitigation: persist/forward analytics to a backend table and reconcile with server-side order data.
- **No global capture of unhandled promise rejections or failed fetches** beyond Sentry defaults; no breadcrumbs for route changes or network calls. Mitigation: register `unhandledrejection`/`error` handlers, add Sentry breadcrumbs for navigation and fetch start/end, tag by route.
- **React Query has no global error/retry observability** (`QueryCache`/`MutationCache` onError not configured); query failures surface only as component toasts. Mitigation: add cache-level error handlers reporting to Sentry with query keys and retry counts.
- **Rate limiter fails open silently**; outbox processing and refund handling rely on logs. Abuse or dependency outage is invisible until customers complain. Mitigation: emit structured counters on rate-limit RPC failure and open-fallback, plus alert thresholds for outbox backlog/refund mismatches.
- **No health/synthetic-check surface** for Supabase, Stripe, Gemini, or email delivery. Mitigation: add a lightweight health edge function and a documented synthetic monitoring playbook (checkout, webhook, try-on) for on-call triage.

### YAGNI / scope critique

- **The real launch blockers are operational credentials, not code.** A 4-phase code program will not unblock payments or email. Execute credential provisioning and outbox scheduling first; treat everything else as post-launch quality work.
- **Phase 1 "eliminate bugs across all features" has no bug inventory** — boiling the ocean. The codebase already has 261 Vitest + 266 Playwright tests and TestSprite surfacing failures. Triage from existing failing tests and the documented task list (e.g., `orders.customer_name` edge-function bug already caught by Deno typecheck). Fix specific, reproducible bugs; do not run a generic sweep.
- **Phase 2 "harden security" duplicates work already in CI and code:** CodeQL, dependency review, npm audit, 33 RLS migrations, `httpGuards` (spoof-resistant IP, constant-time compare), Turnstile, consent gating, `safeHead`. Target only unverified gaps: rotate the leaked `My-Drop-Site` credential from git history, verify admin MFA/CRUD manually, confirm storage buckets. No new security framework.
- **Phase 3 "concurrent load / slow networks / DB bottlenecks" is premature optimization** — no measured bottlenecks beyond images/bundle. Load-testing infra (k6/Artillery) and DB pooling would be net-new complexity for a low-traffic bridal boutique. Reuse existing resilience (react-query, `lazyWithRetry`, `GlobalErrorBoundary`, Sentry, AbortController in try-on). Do Lighthouse/WebPageTest on mobile, image conversion, responsive `srcset`, `manualChunks` for recharts. Add perf tooling only after a baseline measurement.
- **Phase 4 "design/UX upgrade" risks a wholesale redesign** despite DESIGN.md/impeccable audits already done; could regress polished interactions (couture buttons, RTL, motion). Targeted fixes only (mobile menu a11y, hero). Reuse Tailwind v4 tokens + motion; do not introduce a new component library.
- **CI already covers lint, Vitest, Playwright, CodeQL, audit, edge-function typecheck, build smoke, Docker.** Extend existing CI (add WebKit project, prune duplicate TestSprite tests) rather than build new pipelines.

### UX and ergonomics gaps

- **Phase 1 has no feature inventory, bug severity taxonomy, or exit criteria** — "done" is undefined and scope is unbounded. Publish a per-feature checklist with P0/P1/P2 triage rules and a regression test gate before implementation.
- **Phase order mixes external credential blockers with code work** but no dependency map shows which tasks are blocked by ops vs engineering. Split into "unblock credentials" and "code quality" tracks with explicit prerequisites.
- **"Harden security" names no threats, assets, or verification steps.** Add a threat-model checklist mapped to existing CI (CodeQL, audit, RLS/edge-function tests) with concrete pass/fail criteria.
- **Performance/stability work assumes load testing but the repo has no load-test harness or performance budgets.** Define measurable budgets (bundle, LCP, TTI, error rate) and add a repeatable load/smoke procedure to CI or docs.
- **"Upgrade design/UX where gaps exist" is conditional and undefined**, inviting scope creep. Convert to an explicit UX gap list with prioritized, measurable acceptance criteria, or mark it out of scope.
- **The program spans Vitest, Playwright, and TestSprite** with different environments (local vs deployed-only) and admin-credential dependencies, creating high cognitive overhead and no single entry point. Provide one documented command/checklist that runs the full verification matrix and states required secrets.

### Migration and compatibility risks

- **Cart/wishlist localStorage schema break.** `CartItem extends Product` is fully serialized in `riman_cart`/`riman_wishlist`. Any Product-field or price-type change breaks old carts (NaN/undefined totals). Mitigation: versioned storage key + tolerant parse/migration; on schema mismatch, discard stale cart with toast, never crash.
- **Local auth fallback data orphaning.** `riman_users` stores client-hashed passwords and `riman_session` stores user objects. Hardening (removing local auth or changing hash) orphans existing local accounts. Mitigation: one-time migration that invalidates legacy sessions, forces Supabase re-auth, clears `riman_users`/`riman_session` with a notice; never read unversioned local users silently.
- **DataContext cached overrides** (`riman_dynamic_products`/`riman_dynamic_site_content`) can override DB-derived data; bug/perf changes may leave stale overrides. Mitigation: add cache version; invalidate on app version bump; prefer DB when cache version mismatches.
- **DB↔edge-function rollout ordering.** Edge functions assume columns (`amount_total_cents`, `currency`, `payment_method`, `payment_status`, `checkout_token`, `stripe_payment_intent_id`). Deploying functions before migrations fails. Mitigation: always run `supabase db push` first; keep new columns nullable with defaults; never drop columns in same release; rollback functions only, leave schema.
- **RLS policy tightening** can break anonymous flows (appointments insert, reviews, contact submissions, product reads). Mitigation: policy changes in additive migrations; run anon-role integration tests before deploy; keep rollback SQL for each policy.
- **Rental status enum and overlap constraint** — bug fixes touching status transitions risk double-booking or orphaned holds. Mitigation: backfill/transition script for in-flight `pending_payment` bookings; webhook replay idempotency must guard status flips.
- **Image format + service worker cache** — converting JPEGs to AVIF/WebP and re-chunking bundles changes asset URLs; cached SW/clients may reference stale assets. Mitigation: bump SW cache version, provide `<picture>` fallbacks, ship cache-bust hashes; canary rollout.
- **i18n hardcoded bilingual strings** (~15 files use inline `language === 'ar'`). Refactoring to `t()` keys risks missing translations. Mitigation: keep English fallback; migrate incrementally with key parity checks; not a launch blocker.

### Tech debt and maintainability risks

- **Dual Supabase/local fallback modes** duplicated across AuthContext, DataContext, SettingsContext, WishlistContext, and services, creating divergent state and inconsistent persistence. Mitigation: collapse to a single data-access layer with one source of truth and explicit offline mode, removing per-context branching.
- **Context providers are cross-coupled** via direct `useToast`/`useLanguage`/`useAuth` calls; provider ordering is implicit and reordering breaks runtime; no shared query layer despite React Query being installed. Mitigation: remove context-to-context dependencies by injecting toast/language through props or a single app-level service; migrate server state to React Query with centralized query keys.
- **SettingsContext `updateSetting` reads stale `settings` from closure** (not functional update); DataContext mutates via mixed async/local paths; concurrent edits can be lost or divergent. Mitigation: all state updates must be functional/reducer-based with optimistic locking/versioning and single mutation entry points.
- **AuthContext stores client-side user sessions and password hashes in localStorage** and keeps a module-level `loginAttempts` Map; security-critical logic runs in the browser. Mitigation: remove client-side auth fallback for production; gate local mode behind an explicit dev flag and move rate limiting/session validation server-side.
- **UI split across `ui`, `ui-21st`, `salon`, `luxury`, `motion` component families** with overlapping patterns, increasing styling drift and duplication. Mitigation: consolidate into one design-system layer with shared tokens/components before the design upgrade phase.
- **Route-level `AnimatePresence` wraps every page** in a motion.div, and contexts each run independent Supabase fetches with timeouts, risking performance under load. Mitigation: centralize bootstrap data fetching and make route transitions opt-in/per-page to avoid global render blocking.

### Inventive contradictions

- **Correctness vs. throughput.** Exhaustive server-side validation, DB re-derivation, rental-overlap checks, and idempotency tokens increase p95 latency and DB contention. Resolution: Segmentation (split validation into cheap syntactic parse at the edge + expensive DB-derived pricing/availability in a second pass) with Preliminary Action (cache product rows); Dynamics (adaptive validation depth, skip redundant DB reads when a warm cache is fresh). Trade-offs: cache invalidation complexity, stale price window, two-stage error responses. IFR: a checkout path that validates once at the edge from a warmed, versioned product snapshot and only hits the DB for the atomic rental hold, with zero redundant queries per request.
- **Security hardening vs. conversion/UX.** MFA, CAPTCHA, rate limits, strict origin checks, consent-gated analytics add friction that reduces signups and checkout completion. Resolution: Inversion (risk-based step-up auth — invisible device/behavior signals first, MFA only on anomaly) plus an Intermediary API gateway enforcing adaptive rate limits; Beforehand Cushioning (pre-issued, short-lived checkout tokens so retries don't re-trigger CAPTCHA). Trade-offs: heuristic false positives blocking legitimate users, harder audit trail, gateway as single point of failure without redundancy. IFR: auth and abuse control invisible to low-risk sessions, escalating only on detected anomalies, with no added steps for the median shopper.
- **Performance vs. durability.** Caching, async queues, optimistic UI risk double-booking dates, duplicate charges, or lost orders. Resolution: Beforehand Cushioning (stale-while-revalidate product cache with reconciliation loop); Blessing in Disguise (convert backpressure/lock contention into queue-and-retry signal rather than hard failure); Intermediary (durable outbox + idempotency keys for payment/fulfilment). Trade-offs: eventual consistency window for availability, increased queue management, harder debugging of re-ordered events. IFR: checkout returns instantly from cached catalogue data while guaranteeing exactly-once order creation and atomic rental holds via idempotent, reconciled backend writes.
- **Design/UX richness vs. bundle size and mobile performance.** 3D viewer, frame-sequence hero, rich motion, bilingual inline copy ship more JS and media, hurting slow networks. Resolution: Extraction (split `model-viewer`, `recharts`, animation code into lazy chunks loaded on demand); Cheap Dispensables (ephemeral, low-res placeholder frames that upgrade in place); Dynamics (adaptive media quality based on `navigator.connection`/viewport). Trade-offs: cold-start latency on first interaction, more chunk boundaries, visual pop-in during upgrades. IFR: a site that ships a minimal core bundle and progressively enhances (3D, animation, hi-res media) only when bandwidth and device capability permit, with no regression on low-end phones.
- **Offline/local fallback vs. server authority.** Two sources of truth can diverge; client-stored credentials are a breach vector. Resolution: Intermediary (sync coordinator reconciling local deltas against server on reconnect); Self-Service (reconciliation loops detecting and repairing drift); Extraction (move auth entirely server-side, eliminating local password store). Trade-offs: conflict-resolution UX, offline writes may be rejected later, added sync state machine complexity. IFR: single server-authoritative state with the client as a thin, ephemeral cache that reconciles silently and never stores credentials.
- **In-memory rate limiting vs. distributed resilience.** Per-process `Map` state is not shared across instances; limits are bypassed or inconsistent. Resolution: Extraction (move rate-limit state to the database via token-bucket RPC); Preliminary Action (pre-allocated bucket rows); Dynamics (per-endpoint limits tuned by observed load). Trade-offs: DB write amplification on every request, added latency, bucket-row contention under burst. IFR: a rate limiter whose state lives in the shared data plane, consistent across all function instances with no per-process blind spots.

## Goals vs. Non-Goals

* **In-Scope Goals:**
  - Provision Stripe/Resend secrets and schedule the outbox worker (unblock payments and email).
  - Add end-to-end request correlation and Sentry coverage across service layers.
  - Triage and fix specific, reproducible bugs from existing failing tests (Vitest/Playwright/TestSprite) rather than a generic sweep.
  - Verify and close only unverified security gaps (credential rotation, admin MFA/CRUD, storage buckets).
  - Measure baseline performance (Lighthouse/WebPageTest on mobile) before any perf work; then convert images (AVIF/WebP), add `srcset`/`sizes`, lazy-load below-fold media, split `recharts`.
  - Define measurable perf budgets (bundle, LCP, TTI, error rate) and add WebKit to Playwright.
  - Version localStorage schemas (cart, wishlist, dynamic products, auth) with migration/invalidation.
  - Collapse dual Supabase/local fallback to a single data-access layer; remove client-side auth fallback for production.
  - Consolidate UI component families into one design-system layer before design upgrades.
  - Add structured logging, health edge function, and synthetic monitoring playbook.

* **Out-of-Scope Non-Goals:**
  - A 4-phase "comprehensive program" as a monolithic initiative; scope is narrowed to the documented task list.
  - New security framework or duplicating existing CI (CodeQL, audit, RLS, httpGuards).
  - Load-testing infrastructure (k6/Artillery) and DB pooling before a measured baseline.
  - Wholesale design/UX redesign; only targeted fixes.
  - New component library or design system rewrite (reuse Tailwind v4 tokens + motion).
  - New CI pipelines (extend existing ones).
  - Offline-first architecture with full sync (thin ephemeral cache only).

## Alternatives Weighed

- **Broad "bug-free everything" sweep** — rejected: no bug inventory exists; the codebase already has extensive test coverage and TestSprite surfacing failures. Fix specific, reproducible bugs instead.
- **New security framework** — rejected: CodeQL, dependency review, npm audit, 33 RLS migrations, `httpGuards`, Turnstile, consent gating, `safeHead` already exist. Only unverified gaps remain.
- **Load-testing infra + DB pooling upfront** — rejected: premature optimization for a low-traffic bridal boutique; no measured bottlenecks beyond images/bundle. Measure first.
- **Wholesale design redesign** — rejected: DESIGN.md and impeccable audits already done; risks regressing polished interactions (couture buttons, RTL, motion). Targeted fixes only.
- **New CI pipelines** — rejected: existing CI covers lint, Vitest, Playwright, CodeQL, audit, edge-function typecheck, build smoke, Docker. Extend, don't rebuild.
- **Client-side auth fallback retained** — rejected: stores password hashes in `localStorage` and signs in without server verification; account-takeover vector. Remove for production or gate behind explicit dev flag.
- **In-memory rate limiting retained** — rejected: per-process `Map` bypassed under horizontal scaling. Move state to the shared data plane.

## Key Decisions & Staging for Next Steps (Updated after iteration)

### Resolved: Objection #2 — Bug triage from existing tests
- Vitest: 331/331 tests pass; tsc --noEmit passes. No unit-test failures to triage.
- Playwright: 267 E2E tests exist across `tests/` and `e2e/`. Need to run against dev server to identify failures; triage from those results, not a generic sweep.
- TestSprite: deployed-only tests exist; run against preview URL per TestSprite config.
- Action: Run Playwright suite, collect failures, assign P0/P1/P2, fix with regression tests.

### Resolved: Objection #3 — Measure performance before optimizing
- Baseline: run Lighthouse (mobile) and WebPageTest against key pages (home, collection, product detail, checkout) before any perf work.
- Confirmed asset weights: ~13.3MB photography, 4.8MB frame sequence (269 JPEGs), ~780KB main bundle, ~1MB model-viewer chunk.
- Action sequence: (1) Lighthouse baseline, (2) convert frame sequence to AVIF/WebP, (3) add srcset/sizes, (4) lazy-load below-fold media, (5) split recharts from AdminDashboard, (6) re-measure.
- No k6/Artillery or DB pooling until a bottleneck is proven.

### Remaining blocker: Objection #1 — Operational credentials
- Stripe/Resend secrets unset; outbox worker unscheduled. This is the real launch blocker. Must be resolved before any code work ships.
- Split into two tracks: (a) "unblock credentials" (ops) and (b) "code quality" (engineering).

1. **Credentials first.** Provision Stripe/Resend secrets and schedule the outbox worker before any code work. Add a deploy-time smoke test gating on secret presence.
2. **Split into two tracks:** (a) "unblock credentials" (ops) and (b) "code quality" (engineering), with explicit prerequisites and dependency map.
3. **Triage from existing tests.** Use Vitest/Playwright/TestSprite failures and the documented task list as the bug inventory; assign P0/P1/P2 severity with a regression test gate. (Vitest and tsc already pass; Playwright needs a run.)
4. **Measure before optimizing.** Run Lighthouse/WebPageTest on mobile for a baseline; only then convert images, add responsive `srcset`, split chunks. No k6/Artillery until a bottleneck is proven.
5. **Version all localStorage schemas** (cart, wishlist, dynamic products, auth) with migration/invalidation; never crash on stale data.
6. **Collapse dual data-access layers** to a single source of truth; remove client-side auth fallback for production (gate behind dev flag).
7. **Consolidate UI component families** into one design-system layer with shared tokens before any design upgrade phase.
8. **Add observability foundation:** `X-Request-Id` propagation, Sentry in all service catch blocks, structured edge-function logs, health edge function, synthetic monitoring playbook.
9. **Convert "design/UX upgrade" to an explicit, prioritized UX gap list** with measurable acceptance criteria, or mark it out of scope.
10. **Handoff:** Proceed to `egm-draft` to initialize a formal design document from this brief, or continue refining in ideation mode.