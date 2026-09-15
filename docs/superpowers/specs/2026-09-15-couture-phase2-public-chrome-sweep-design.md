# Couture Phase 2 — Public Chrome Sweep Design Spec

Date: 2026-09-15 · Branch: `fix/security-seo-production` · Status: PENDING owner review
Parent spec: `2026-09-15-couture-luxury-redesign-design.md` (Phase 1, approved & shipped; this spec executes its "Out of scope (phase 2)" list at chrome-only depth)

## Problem

Phase 1's token surgery made every page warm, but inner-page chrome still contradicts §3 of the parent spec: cards keep bordered "plates", form controls are hand-boxed with utility chains, and the mobile bottom-nav is a light bar that fights the ink interstitial language. ~31 public files carry stone borders; ~40 form controls declare their own boxes.

## Decisions (owner-approved 2026-09-15)

| Decision | Choice |
|---|---|
| Scope | Public polish only — no admin UI, no photography replacement, no inner-page layout recomposition |
| Depth | Chrome-only: apply §3 card/input rules, keep existing structure, sections, spacing |
| Bottom nav | Dark ink band (stone-950) with gold active state |
| Approach | Reusable classes (`.card-couture`, `.field-couture`) + targeted call-site edits — no new React primitives |

## §1 New CSS vocabulary (`src/index.css`, `@layer components`)

`.card-couture` (applied on the card wrapper):

- `border: 0; box-shadow: none; border-radius: 0; background: transparent` — content sits on the page field, no plate.
- Descendant media: `.card-couture img { transition: transform 1200ms cubic-bezier(0.22,1,0.36,1); }` and `.card-couture:hover img, .card-couture:focus-within img { transform: scale(1.04); }` with `overflow: hidden` on the wrapper.
- Reduced motion: hover zoom disabled (media query).
- Text roles (utility classes at call sites, documented here as the contract): name = `font-heading text-lg md:text-xl` (Prata 18–20px), meta = `font-label text-[10px] uppercase tracking-[0.2em] text-stone-500`.

`.field-couture` (applied directly on input/textarea/select):

- `background: transparent; border: 0; border-bottom: 1px solid var(--color-stone-300); border-radius: 0; padding: 0.85rem 0.25rem; color: var(--color-stone-800)`, transition 400ms couture easing.
- `:focus { outline: none; border-bottom-color: var(--color-gold); }`
- Label contract: the control's associated `label` (or `aria-label` where today's design has none) picks up existing base-rule label behavior; where a boxed label chip exists, labels stay markup-styled — only control classes are replaced.

Why explicit classes: the Phase 1 base rule uses `:not([class*="border"])` guards; Phase 2 removes those utility classes at call sites and opts into `.field-couture` so intent is visible and greppable. The Phase 1 base rule stays for stragglers/admin.

## §2 Sweep surface

| Area | Files | Change |
|---|---|---|
| Shared product card | `src/components/ProductCard.tsx` | Wrapper → `.card-couture` (drops `border border-onyx/10`, hover border-gold frame). Size chips keep gold-border **selected-state marker** (functional state, relied on by `e2e/product-detail.spec.ts`). `border-t border-gold/20` meta rule → stone-200 hairline. |
| Inline card grids | `src/pages/JournalPage.tsx`, `src/pages/CollectionsPage.tsx` | Replace `overflow-hidden border border-stone-200/60`-style wrappers with `.card-couture` + §1 text roles. |
| Product detail | `src/pages/ProductDetail.tsx` | 31 bordered usages audited one-by-one: informational boxes (specs, delivery, care panels) → borderless with `border-b border-stone-200` dividers; tab selected state → gold underline (`border-b`), not box; quantity stepper keeps hairline; functional borders (dividers, focus rings) stay. |
| Form controls | `AppointmentPage.tsx`, `ContactPage.tsx`, `Auth.tsx`, `Checkout.tsx`, `FaqPage.tsx`, `SearchPage.tsx`, `Footer.tsx` (newsletter), `SizeGuide.tsx`, `WishlistPage.tsx`, `ProfilePage.tsx` | Hand-boxed chains (`bg-stone-50 border border-stone-100 rounded …`) replaced with `.field-couture`; `rounded-*`/`shadow` removed from the control. ~40 controls. |
| Mobile bottom nav | `src/components/MobileBottomNav.tsx` | Root: `bg-onyx border-t border-gold/20`. Inactive icon+label: `text-bone/60` → hover `text-bone`. Active route: `text-gold-light` + 1px `bg-gold-light` indicator bar above the icon. Badge: `bg-gold-light text-stone-950 rounded-full` champagne dot (placement unchanged). Grid/links/behavior untouched. |

**Explicitly untouched:** `Header.tsx` (d63387d, parent spec §5), `src/pages/admin/**` + `AdminMfaGate`, `filter-token-bar.tsx` (functional filter chips), layouts/section spacing, photography, i18n/RTL rules, CSP, prerender/SEO.

## §3 Data flow / error handling

Styling-only change; no component props, state, or logic change except bottom-nav active-state class computation (already exists — new classes replace old). Existing form validation/error copy stays; error text keeps rose per parent spec.

## §4 Testing & verification

- Extend `tests/couture-design.spec.ts` with three probes:
  1. Card probe: on `/collections` (or route where ProductCard renders), computed `borderTopWidth === '0px'`, `boxShadow === 'none'` on `.card-couture`; hover → `img` transform contains `matrix` (scale ≠ 1).
  2. Field probe: `/contact` + `/appointment` — first `.field-couture`: `borderTopWidth '0px'`, `borderBottomWidth '1px'`, `borderTopLeftRadius '0px'`, `backgroundColor 'rgba(0, 0, 0, 0)'`.
  3. Bottom-nav probe at 375×812: `nav`/root of MobileBottomNav computed `backgroundColor rgb(15, 13, 10)`; active item color = `rgb(201, 169, 111)`.
- Suite guards: `npm run lint`, `npm test` (195), full Playwright set incl. `e2e/product-detail.spec.ts` (size-chip selected marker retained — spec must stay green; if its sniff needs a token tweak, update the spec, not the UI).
- Build parity: `$env:SITE_URL="https://riman.ae"; npm run build` — entry JS ±2 kB, CSS delta ≤ +3 kB vs Phase 1 end state (130.33 kB), 57 prerendered pages.
- Owner visual sign-off on `http://localhost:3001` before final commit.
- Commit per sweep area (small, reviewable) on `fix/security-seo-production`.

## Out of scope (phase 3)

Admin UI couture pass, inner-page full composition (chapter numerals, ivory⇔ink alternation), photography replacement, header re-touch.
