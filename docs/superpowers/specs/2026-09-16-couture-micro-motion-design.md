# Couture Micro-Motion Design Spec

Date: 2026-09-16 · Branch: `main` · Status: APPROVED by owner
Context: Owner wanted ThreeUI "animations in text and special buttons"; recommended and approved CSS + existing `motion/react` instead of WebGL (vitrine spec reverted `e20746f`). Reopens the "no animation beyond signed-off" spirit of Phase 1 §5 by EXTENDING it — same easing token, same reduced-motion policy.

## Goal

Four surfaces get couture-grade micro-motion, zero new packages, zero layout-affecting animation (transform/opacity only):

A. **Headlines** — character rise on hero H1 + chapter titles (EN; whole-line rise for AR to protect Arabic ligatures).
B. **Primary buttons** — champagne sheen sweep on `.btn-luxury` hover (inherits site-wide).
C. **Editorial text** — word-reveal on interstitial quote + atelier body.
D. **Micro-links** — `.link-couture` gold underline grow on homepage discipline labels + footer nav/legal links.

## Decisions (owner-approved)

| Decision | Choice |
|---|---|
| Engine | `motion/react` (installed) for JS reveals; pure CSS for sheen/underline. NO WebGL/ThreeUI |
| Reduced motion | JS: `useReducedMotion()` → components render plain static markup. CSS: transitions neutralized by existing global media block |
| Arabic | No letter-splitting ever (RTL ligatures); `KineticHeading` detects `language === 'ar'` OR non-Latin text and renders whole-heading rise; word-split (RevealWords) is RTL-safe |
| Header | Untouched (frozen d63387d) — link-couture is homepage + footer only |
| SEO/prerender | Letters/words are inline spans; `textContent` identical; prerender unchanged |

## Component contracts

`src/components/motion/KineticHeading.tsx`
- Props: `{ text: string; as?: 'h1'|'h2'|'h3'; className?: string; emphasisChars?: string[]; emphasisClassName?: string; delay?: number }`
- EN + motion allowed: renders `<motion.hX>` with per-character `<span class="kin-letter">` (Array.from), container stagger `staggerChildren 0.028`, child `hidden {opacity:0,y:24} → show {opacity:1,y:0, duration 0.7, ease [0.22,1,0.36,1]}`, `viewport={{ once: true, amount: 0.35 }}`; chars in `emphasisChars` get `emphasisClassName` (hero `&` gold italic Newsreader).
- AR or reduced-motion or `text.length > 90`: plain static tag, same className/textContent.

`src/components/motion/RevealWords.tsx`
- Props: `{ text: string; as?: 'p'|'span'|'blockquote'; className?: string; stagger?: number (default 0.04) }`
- Words = `text.split(/\s+/)` in inline-block motion spans, 8px rise, once, same ease. Reduced-motion → plain text.

## CSS (all in `src/index.css`)

- `.btn-luxury` gains `relative overflow-hidden`; new `.btn-luxury::before` 60%-wide skewed 3-stop champagne gradient (`rgba(201,169,111,.28)`/`rgba(246,240,230,.35)` cores), `translateX(-160%) → 260%` on `:hover/:focus-visible`, 900ms couture ease, `pointer-events:none`.
- `.link-couture`: 1px gold underline `::after` at resting `scaleX(0.25)` (mobile affordance — same idiom as `.btn-couture-ghost`), grows to `scaleX(1)` origin left on hover/focus-visible, 500ms; `[dir="rtl"]` flips origin to right.

## Wiring

| File | Change |
|---|---|
| `HeroSection.tsx` | h1 (61–68) → `KineticHeading text={t('hero.title')} as="h1" emphasisChars={['&']}` |
| `ChapterLabel.tsx` | h2 → `KineticHeading as="h2"` (title via `t`); test updated to `textContent` assertion |
| `CallToAction21st.tsx` | "Ready to begin?" h2 → KineticHeading |
| `Index.tsx` | quote (67–69) + atelier body (47) → `RevealWords`; discipline "discover" label border-b → `.link-couture` |
| `FooterSection.tsx` | collection nav links + Privacy/Terms get `.link-couture` |

## Verification

- New vitest `src/test/kineticMotion.test.tsx`: EN letter-spans count correct + textContent preserved, AR renders zero `.kin-letter` spans, `&` emphasis span carries class, `RevealWords` word count. (Reduced-motion static path verified via e2e probe with `reducedMotion:'reduce'` context, not mocked units.)
- `tests/couture-design.spec.ts` probes: `.btn-luxury` `overflow:hidden` + `::before` transition `0.9s`; hero h1 `.kin-letter` count > 10 with `riman_lang=en`, `=== 0` with `ar` and h1 textContent unchanged; `.link-couture` present ≥ 4 on `/` (EN).
- Suites: lint · vitest (199+new) · full Playwright · build parity (CSS ≤ +1.5 kB, entry ±2 kB, 57 pages) · reduced-motion probes · owner visual sign-off.

## Out of scope

Header/nav links, admin, WebGL of any kind, Arabic letter-level animation, any page other than `Index` sections listed.
