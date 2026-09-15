# ThreeUI Vitrine — Couture 3D Gallery Chapter Design Spec

Date: 2026-09-15 · Branch: `main` · Status: PENDING owner review
Supersedes: the "NO WebGL/Three (reverted once — do not re-add)" constraint in `2026-09-15-couture-luxury-redesign-design.md` for ONE guarded component only (owner decision 2026-09-15). All other Phase 1/2 constraints (no layout recomposition elsewhere, Header untouched, etc.) remain in force.

## Problem

Owner wants ThreeUI texture on the site but "the safest thing without messing my website". Audit of the Community catalog (MIT, `MengTo/threeui`): every component is a GLSL/three.js shader — there is no CSS-only tier. The best couture fit is `Gallery`: an auto-rotating curved cylinder of images (a vitrine/showcase), self-contained React + three (~180 lines), pauses off-screen, no pointer-interaction complexity. `BrandOrbs` rejected (tech-logo badges, HTML-doc runtime).

## Decisions (owner-approved 2026-09-15)

| Decision | Choice |
|---|---|
| Scope | Showcase-only micro-dose: ONE new homepage chapter ("The Vitrine"). Hero untouched, no other ThreeUI components |
| Approach | Fork the MIT `Gallery` component into the repo; install `three` only — NO `@designcodeio/threeui` package (avoids asset-URL plumbing + catalog shell) |
| Kill switch | `coutureGallery` feature flag (existing `useFeature` + admin SettingsContext), default ON after sign-off |
| Placement | New chapter between Silhouettes and Savoir-Faire; existing chapter numerals bumped accordingly |
| Fallback | Server-prerendered static grid (existing `ProductCard`, 4 featured products) = the DOM base; canvas only replaces it client-side when all guards pass |

## §1 Component — `src/components/threeui/CoutureGallery.tsx`

- Forked verbatim from ThreeUI Community `src/shaders/gallery/Gallery.tsx` (MIT © MengTo — credit header preserved) with these deltas:
  1. `GALLERY_IMAGE_URLS` hardcoded webps → `images: Array<{ src: string; alt: string }>` prop (required, 6–10 entries).
  2. `renderer.outputEncoding = THREE.sRGBEncoding` → `renderer.outputColorSpace = THREE.SRGBColorSpace` (API of the pinned `three` version).
  3. Keep: `speed/scale/opacity/hue/saturation/brightness` props, `visibilitychange` pause, full `dispose()` cleanup on unmount, `crossOrigin` texture loading (same-origin `/assets` — no CORS risk).
- Props used by the chapter: `speed 0.35`, `opacity 0.9`, all other props at ThreeUI defaults (`scale 1`, `hue 0`, `saturation 1`, `brightness 1`); any warm-re-tint deviation decided at implementation under owner sign-off.
- No links inside the canvas (it is purely visual); product navigation stays available via the static CTA button beneath (`btn-couture-ghost` → `/appointment`).

## §2 Chapter composition — `src/pages/Index.tsx`

- New `<section>` after the Silhouettes chapter, before Savoir-Faire: salon shell (`ChapterLabel` numeral bumped to "III", Savoir-Faire → "IV"), `InvitationRule` hairlines as on existing chapters, ink (`bg-onyx`) band — the vitrine floats on couture ink.
- Structure: always-rendered fallback `<div className="grid ...4×ProductCard">` (visible in prerendered HTML; aria-label per existing pattern); `<div ref={mount}>` beside it. When guards pass, the mount div gets the lazy canvas and the fallback grid receives `hidden`.
- i18n: new keys `chapter.vitrine` + `vitrine.heading` + `vitrine.sub` (EN + AR; Arabic renders via existing Amiri `[dir=rtl]` rules — Prata never renders Arabic, unchanged).

## §3 Guards + loading (the safety layer)

All must pass to mount the canvas; otherwise the static grid stands:

1. `useFeature('coutureGallery')` — default `true` in `useFeature.ts` DEFAULT_FEATURES (admin can flip off without deploy).
2. `window.matchMedia('(min-width: 1024px)')` — desktop only.
3. `!window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
4. WebGL probe: one-shot `canvas.getContext('webgl2') || canvas.getContext('webgl')` test, disposed immediately.
5. Viewport entry: `IntersectionObserver` on the section — the `React.lazy(() => import('./threeui/CoutureGallery'))` chunk request only fires when the chapter first nears the viewport.

Guard predicate extracted as exported pure fn `shouldMountVitrine({flag, viewport, reducedMotion, webgl})` → unit-testable (jsdom).

## §4 Build / perf / security

- `npm i three@0.165.0` (exact pin — matches the Community repo's `three165` alias, so the fork's API usage is the published one). NO other new packages.
- Vite: `three` joins the manual-chunks strategy as its own async chunk via the lazy import — entry JS must remain 757 kB ±2 kB; new lazy chunks total ≤ 250 kB gz (three ≈ 170 kB gz is the known floor; measured at verification).
- CSS delta ≤ +1 kB (only vitrine section classes).
- CSP: no change (bundled JS, same-origin images). Prerender: unchanged page count 57; canvas never renders into static HTML.
- Memory: on unmount/flag-off the effect must `dispose()` geometry/material/renderer (fork already does — regression-tested via guard unit test only).

## §5 Testing & verification

- New vitest `src/test/vitrineGuard.test.tsx`: `shouldMountVitrine` truth table (5 cases: flag off / mobile / reduced-motion / no-webgl / all-green).
- Extend `tests/couture-design.spec.ts`: (1) desktop EN → after scroll to section, `canvas` exists inside the vitrine mount; (2) flag-off localStorage/settings → static grid `hidden` absent; (3) mobile 375px → no canvas ever mounts; (4) fallback grid present in prerendered `dist` HTML (read `dist/index.html`).
- Suites: `npm run lint`; `npm test` (195 + new); full Playwright `tests/ e2e/`; build parity incl. lazy-chunk budget; 375/768/1024/1440 overflow probes (reuse Phase 1 script).
- Owner visual sign-off on dev server (desktop, hard refresh) before merge/tag.

## Out of scope

Hero backdrop shaders, other ThreeUI components, mobile 3D, the `@designcodeio/threeui` npm package itself, WebGL product pages (existing model-viewer pipeline untouched).
