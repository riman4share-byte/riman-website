# Couture Luxury Redesign — Design Spec

Date: 2026-09-15 · Branch: `fix/security-seo-production` · Status: APPROVED by owner

## Problem

The site reads "industrial / boring" rather than a $10k couture house. Diagnosis (verified in code):

1. Accent "gold" is terracotta `#A2492B` (clay, not precious metal).
2. Tailwind `stone-*` cool grays used for text/borders/buttons site-wide → concrete cast.
3. Boxy UI chrome: bordered cards, boxed inputs, outlined button rectangles.
4. Display face Fraunces is quirky-soft; couture expects a high-contrast Didone.

## Decisions (owner-approved)

| Decision | Choice |
|---|---|
| North Star mood | Dark couture house (Galia Lahav / Elie Saab), alternating ivory ⇄ ink sections |
| Display typeface | Add Didone: **Prata** wired into `--font-heading` (Fraunces kept only for `--font-jewelry`); Arabic headings stay Amiri |
| Rollout | Approach A "Token surgery": remap `stone`/`gold` in `@theme` (fixes all pages at once), then homepage composition. Phase 2 polishes the rest of the site later |
| No gimmicks | No WebGL/shaders (ThreeUI pilot reverted `604193d`). Pure CSS/typography/layout only |

## §1 Palette (@theme, src/index.css)

Remap the Tailwind stone scale to warm couture neutrals (same class names, global effect):

| token | value | role |
|---|---|---|
| stone-50 | #FAF8F3 | paper |
| stone-100 | #F4EFE7 | surface |
| stone-200 | #E6DFD1 | hairline |
| stone-300 | #D2C8B6 | input underline |
| stone-400 | #AD9F86 | disabled/placeholder |
| stone-500 | #807662 | secondary text |
| stone-600 | #655C49 | body text |
| stone-700 | #4B4335 | strong body |
| stone-800 | #2E2820 | deep warm |
| stone-900 | #1B1712 | near-ink |
| stone-950 | #0F0D0A | couture ink |

Accent metal: `--color-gold #A2492B→#B08D57`, `gold-light→#C9A96F`, `gold-dark→#8A6A3C`. Gold is accent-only (hairlines, small-caps, hover tints), never a large fill; solid buttons use ink with champagne text on hover. bone/champagne/ivory/pearl/onyx unchanged.

## §2 Typography

- `--font-heading`: "Prata", serif (Google, latin only — Arabic already overrides via `[dir=rtl]` rules; Prata never renders Arabic).
- Hero/chapter titles: Prata, sentence case, h1 `clamp(3rem,7vw,6.5rem)`, leading ~1.05, tracking 0.01em.
- Labels/nav/buttons: Archivo caps, tracking 0.18–0.25em, 10–11px (existing tokens, standardized).
- Body/editorial: Newsreader (unchanged).

## §3 UI chrome rules

- Primary button: bg stone-950, text stone-50, 11px caps .25em, h-12, no border; hover bg stone-900 + text gold-light.
- Secondary/ghost: no border — text + 1px gold underline (8px offset), underline animates via scaleX on hover. Remove the hero's boxed secondary button.
- Cards (product/collection/journal/plates): no borders/shadows/plates; edge-to-edge image; name Prata 18–20px; meta Archivo caps stone-500; hover image scale 1.04/1.2s.
- Badges (cart/wishlist counts): champagne-ink dots (gold-light bg + stone-950 text), rounded-full, no change in placement.
- Inputs: transparent, bottom 1px stone-300 only; focus → gold bottom border + label turns gold; error text keeps rose. Implemented once as a shared `.field` class set applied to the reusable input components (components/ui/*), with the four heaviest form pages (appointment, contact, auth, checkout) updated to use them.
- Section dividers: existing gold/15 hairlines remain.

## §4 Homepage composition (Index.tsx / ui-21st)

1. Hero: Prata title, single ghost CTA, scroll cue.
2. Ch. I Atelier: ivory, py-40; numeral "I" Prata ~88px stone-200 watermark beside sticky label.
3. Dark interstitial (new): full-bleed featured product photo, bg stone-950, CSS Ken Burns (scale 1→1.08, 24s alternate, infinite; disabled under prefers-reduced-motion), centered `atelier.quote` rendered as real DOM text in Newsreader italic, ivory, 24–34px. Background photo is decorative (alt="").
4. Ch. II Silhouettes: plates per §3.
5. Marquee: ink bg, Prata/italic alternation, gold hairline ends.
6. Ch. III Savoir-Faire + disciplines: borderless.
7. Testimonials: ink section, large italic quote, no stars (champagne dots).
8. Booking CTA: ivory, giant Prata line, single ghost CTA.
9. Footer: stone-950 ink, champagne hairline top.

## §5 Motion & quality bar

- Easing unified `cubic-bezier(0.22,1,0.36,1)`; reveals fade+24px/800ms; no springs on couture moments.
- prefers-reduced-motion: existing global CSS + MotionConfig(user) covers reveals/buttons; Ken Burns gated by media query.
- CSP: no new sources; Google Fonts already permitted (`style-src fonts.googleapis.com`, `font-src fonts.gstatic.com`) — Prata added to the existing fonts URL, no policy change.
- SEO/prerender untouched; header redesign (d63387d) untouched.

## Verification

tsc lint · vitest 195 · production build (chunk parity; CSS delta) · Playwright matrix 375/768/1024/1440 EN+AR (geometry, overflow, computed color probes confirming warm palette + Prata applied) · homepage/smoke/navigation specs · owner visual sign-off on dev server before commit.

## Out of scope (phase 2)

Inner-page section compositions (collections/product/journal layout pass), photography re-shoot/replacement, mobile bottom-nav restyle, admin UI.
