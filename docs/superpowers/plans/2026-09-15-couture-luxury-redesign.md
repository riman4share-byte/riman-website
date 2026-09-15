# Couture Luxury Redesign (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site read as a dark-couture house (Galia Lahav / Elie Saab) via a global token surgery (warm neutrals + champagne gold + Prata Didone), borderless button/form chrome, and a couture-composed homepage with a dark Ken Burns interstitial.

**Architecture:** All color/type changes land as Tailwind v4 `@theme` token overrides in `src/index.css` (one file remaps the whole `stone` gray scale and `gold` metal site-wide — no per-component churn). New reusable classes (`.btn-couture-ghost`, Ken Burns keyframes) live beside the existing `.btn-luxury` system. Homepage edits touch only `src/pages/Index.tsx`, `src/components/salon/ChapterLabel.tsx`, `src/components/ui-21st/HeroSection.tsx`. Verification is a new Playwright spec asserting computed styles.

**Tech Stack:** Tailwind CSS v4 (`@theme`), Google Fonts (add Prata), React + TS, Playwright (standalone, `tests/**`), vitest (unchanged).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-15-couture-luxury-redesign-design.md` — all values below are verbatim from it.
- NO new npm packages. NO WebGL/Three (reverted once — do not re-add).
- CSP unchanged: fonts come from the already-allowed `fonts.googleapis.com` / `fonts.gstatic.com`.
- Arabic: existing `[dir="rtl"]` heading rules (Amiri) already override `font-heading` — Prata must never render Arabic; do not touch those rules.
- Every production build requires `SITE_URL` env (e.g. `$env:SITE_URL="https://riman.ae"`); dev/test commands run against `http://localhost:3001` (dev server already running).
- `npm run lint` = `tsc --noEmit`; unit suite = `npm test` (must stay 195 passing); e2e = `npx playwright test <file> --reporter=line`.
- Commit per task, small, on branch `fix/security-seo-production`.
- Windows PowerShell: no `&&` chains with nested quotes; avoid piping rg through complex expressions in one line.

---

### Task 1: Couture token surgery + Prata (the whole-site recolor)

**Files:**
- Modify: `src/index.css:1` (font import line), `src/index.css:4-41` (`@theme` block), `src/index.css:56-58` (base heading rule)
- Test: `tests/couture-design.spec.ts` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: remapped `--color-stone-*`, `--color-gold*`, `--color-onyx: #0F0D0A`, `--font-heading: "Prata"` — every later task and every existing component inherits these automatically.

- [x] **Step 1: Write the failing e2e spec**

Create `tests/couture-design.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

// Phase-1 couture token surgery must be observable in computed styles.
test('couture palette + Prata display face are active', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);

  const probe = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const h1 = document.querySelector('h1')!;
    const warm = document.querySelector('main p.text-stone-600') ?? document.querySelector('footer p');
    return {
      gold: cs.getPropertyValue('--color-gold').trim().toLowerCase(),
      onyx: cs.getPropertyValue('--color-onyx').trim().toLowerCase(),
      h1Font: getComputedStyle(h1).fontFamily,
      warmColor: warm ? getComputedStyle(warm).color : null,
    };
  });

  expect(probe.gold).toBe('#b08d57');
  expect(probe.onyx).toBe('#0f0d0a');
  expect(probe.h1Font).toMatch(/Prata/);
  // stone-600 must be the warm taupe #655C49, not the old cool #78716c
  expect(probe.warmColor).toBe('rgb(101, 92, 73)');
});
```

- [x] **Step 2: Run it, verify FAIL**

Run: `npx playwright test tests/couture-design.spec.ts --reporter=line`
Expected: FAIL — gold `#a2492b`, onyx `#161513`, h1 font Fraunces, color `rgb(120, 113, 108)`.

- [x] **Step 3: Apply the token surgery in `src/index.css`**

3a. Replace the font `@import` URL on line 1 with (Prata added; everything else identical):

```css
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Archivo:wght@300;400;500&family=Cairo:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Prata&display=swap');
```

3b. In `@theme`, change the heading token:

```css
  --font-heading: "Prata", serif;
```

3c. Immediately after the `--font-*` block inside `@theme`, insert the warm stone remap (Tailwind v4 lets you override palette namespaces in `@theme`):

```css
  /* Couture warm-neutral remap of Tailwind's stone scale (see spec §1) */
  --color-stone-50: #faf8f3;
  --color-stone-100: #f4efe7;
  --color-stone-200: #e6dfd1;
  --color-stone-300: #d2c8b6;
  --color-stone-400: #ad9f86;
  --color-stone-500: #807662;
  --color-stone-600: #655c49;
  --color-stone-700: #4b4335;
  --color-stone-800: #2e2820;
  --color-stone-900: #1b1712;
  --color-stone-950: #0f0d0a;
```

3d. Replace the accent metal + ink tokens (lines 16–24):

```css
  --color-gold: #b08d57;
  --color-gold-light: #c9a96f;
  --color-gold-dark: #8a6a3c;
  --color-onyx: #0f0d0a;
  --color-bone: #efeae2;
  --color-ivory: var(--color-bone);
  --color-champagne: #f6f0e6;
  --color-pearl: #e8e3d9;
  --color-jewelry: linear-gradient(45deg, #8a6a3c 0%, #b08d57 45%, #c9a96f 50%, #b08d57 55%, #8a6a3c 100%);
```

3e. Base headings rule (line 56–58) — Prata needs normal tracking; components already set their own:

```css
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
```

- [x] **Step 4: Run the spec, verify PASS**

Run: `npx playwright test tests/couture-design.spec.ts --reporter=line`
Expected: PASS.

- [x] **Step 5: Guard the suites**

Run: `npm run lint && npm test` then `npx playwright test e2e/smoke.spec.ts e2e/navigation.spec.ts --reporter=line`
Expected: tsc clean; 195 unit pass; e2e pass (color/class names unchanged so specs are insulated).

- [x] **Step 6: Commit**

```bash
git add src/index.css tests/couture-design.spec.ts
git commit -m "feat(design): couture token surgery — warm stone remap, champagne gold, Prata display serif"
```

---

### Task 2: Borderless button system + hero CTA pair

**Files:**
- Modify: `src/index.css:133-149` (`.btn-luxury`, `.btn-luxury-outline`)
- Modify: `src/components/ui-21st/HeroSection.tsx` (CTA block, lines ~75–89)
- Test: extend `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: Task 1 tokens (`bg-onyx` = ink, `text-gold-light`).
- Produces: `.btn-couture-ghost` class (reused by homepage CTA sections later); hero primary button has zero border/shadow/ring.

- [x] **Step 1: Write the failing assertions**

Append to `tests/couture-design.spec.ts`:

```ts
test('hero CTAs are borderless ink + ghost-underline, no boxes', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const primary = page.locator('#hero a[href="/appointment"]');
  await primary.waitFor({ timeout: 45000 });
  const styles = await primary.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { borderWidth: cs.borderTopWidth, boxShadow: cs.boxShadow, bg: cs.backgroundColor };
  });
  expect(styles.borderWidth).toBe('0px');
  expect(styles.boxShadow).toBe('none');
  expect(styles.bg).toBe('rgb(15, 13, 10)'); // couture ink
  await expect(page.locator('#hero .btn-couture-ghost')).toHaveCount(1);
});
```

- [x] **Step 2: Run, verify FAIL** (current primary has ring/shadow/bone bg)

Run: `npx playwright test tests/couture-design.spec.ts --reporter=line` → new test FAILS, Task 1 test passes.

- [x] **Step 3: Redefine the button classes in `src/index.css`**

Replace lines 133–149 (`.btn-luxury`, `.btn-luxury-outline` and both `:focus-visible` rules) with:

```css
  .btn-luxury {
    @apply inline-flex items-center justify-center px-10 py-4 font-label text-xs tracking-[0.25em] uppercase transition-colors duration-500 bg-onyx text-bone hover:bg-stone-900 hover:text-gold-light border-0;
  }

  .btn-luxury-outline {
    @apply inline-flex items-center justify-center px-8 py-3 font-label text-xs tracking-[0.25em] uppercase transition-colors duration-500 bg-transparent text-stone-700 border border-stone-400/60 hover:border-gold hover:text-gold-dark;
  }

  .btn-couture-ghost {
    @apply relative inline-flex items-center justify-center min-h-[52px] px-2 font-label text-xs uppercase tracking-[0.25em] text-bone transition-colors duration-500;
  }
  .btn-couture-ghost::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    height: 1px;
    background: var(--color-gold-light);
    transform: scaleX(0.35);
    transform-origin: left;
    transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .btn-couture-ghost:hover {
    color: var(--color-gold-light);
  }
  .btn-couture-ghost:hover::after {
    transform: scaleX(1);
  }

  .btn-luxury:focus-visible,
  .btn-luxury-outline:focus-visible,
  .btn-couture-ghost:focus-visible {
    outline: 2px solid var(--color-gold);
    outline-offset: 4px;
  }
```

Note: `.btn-couture-ghost` uses `text-bone` — on light backgrounds pair with `!text-stone-800` override only where needed (none in this phase; hero is dark).

- [x] **Step 4: Hero CTA block** — in `src/components/ui-21st/HeroSection.tsx` replace:

```tsx
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/appointment"
            className="btn-luxury w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center bg-bone text-onyx hover:text-gold-dark ring-1 ring-white/30 shadow-2xl text-sm"
            aria-label={t('cta.viewing')}
          >
            {t('cta.viewing')}
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center px-10 font-label text-xs tracking-[0.25em] uppercase text-white bg-white/10 backdrop-blur-sm border border-white/70 hover:border-gold hover:text-gold hover:bg-black/40 transition-colors duration-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]"
            aria-label={t('cta.explore')}
          >
            {t('cta.explore')} 
          </Link>
        </div>
```

with:

```tsx
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <Link
            to="/appointment"
            className="btn-luxury min-h-[52px]"
            aria-label={t('cta.viewing')}
          >
            {t('cta.viewing')}
          </Link>
          <Link
            to="/search"
            className="btn-couture-ghost"
            aria-label={t('cta.explore')}
          >
            {t('cta.explore')}
          </Link>
        </div>
```

- [x] **Step 5: Run e2e (PASS) + homepage/nav specs**

Run: `npx playwright test tests/couture-design.spec.ts e2e/homepage.spec.ts --reporter=line`
Expected: all PASS (homepage spec has no assertions on the removed secondary-box classes — if it fails, fix the spec to the new ghost, do not restore boxes).

- [x] **Step 6: Commit**

```bash
git add src/index.css src/components/ui-21st/HeroSection.tsx tests/couture-design.spec.ts
git commit -m "feat(ui): couture button system — ink solid + ghost underline, hero CTA pair de-boxed"
```

---

### Task 3: Hairline couture forms (global base rule)

**Files:**
- Modify: `src/index.css` (append to `@layer base`)
- Test: manual computed probe inside `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: stone-300 warm hairline (Task 1), gold tokens.
- Produces: bottom-border inputs for all unstyled form controls; utility-classed inputs elsewhere keep their box but render warm (already fixed by Task 1) — full per-page input cleanup is Phase 2 by design.

- [x] **Step 1: Write the failing probe**

Append to `tests/couture-design.spec.ts`:

```ts
test('form inputs are hairline, not boxed', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/journal', { waitUntil: 'domcontentloaded' });
  const found = await page.evaluate(() => {
    const input = document.querySelector('main input:not([type="checkbox"]):not([type="radio"]):not([type="submit"])') as HTMLInputElement | null;
    if (!input) return null;
    const cs = getComputedStyle(input);
    return { top: cs.borderTopWidth, bottom: cs.borderBottomWidth, radius: cs.borderTopLeftRadius };
  });
  test.skip(found === null, 'no text input on /journal — placeholder route probe');
  expect(found!.top).toBe('0px');
  expect(found!.bottom).toBe('1px');
  expect(found!.radius).toBe('0px');
});
```

Pick a route that definitely has an input: run `npx playwright test` once; if `/journal` has none, switch the URL in this test to `/contact` and keep assertions identical.

- [x] **Step 2: Run, verify FAIL** (current inputs are fully boxed)

- [x] **Step 3: Add the base rule** — append inside `@layer base { ... }` in `src/index.css` (before its closing brace):

```css
  /* Couture hairline fields: bottom rule only, gold focus. Utility-classed
     inputs (explicit border/bg classes) intentionally override this. */
  input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([class*="border"]),
  textarea:not([class*="border"]),
  select:not([class*="border"]) {
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid var(--color-stone-300);
    border-radius: 0;
    padding: 0.85rem 0.25rem;
    color: var(--color-stone-800);
    transition: border-color 400ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  input:not([type="checkbox"]):not([type="radio"]):focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-bottom-color: var(--color-gold);
  }
  label {
    transition: color 400ms;
  }
  input:focus + label,
  input:focus-visible + label {
    color: var(--color-gold-dark);
  }
```

The `:not([class*="border"])` guard prevents fighting the 200+ inputs that already declare Tailwind border utilities (those inherit warmth from Task 1 only).

- [x] **Step 4: Run spec + auth smoke**

Run: `npx playwright test tests/couture-design.spec.ts --reporter=line && npx playwright test e2e/smoke.spec.ts --reporter=line`
Expected: PASS both.

- [x] **Step 5: Commit**

```bash
git add src/index.css tests/couture-design.spec.ts
git commit -m "feat(ui): couture hairline form fields (bottom-rule inputs, gold focus)"
```

---

### Task 4: Homepage couture composition (interstitial + chapter watermark + spacing)

**Files:**
- Modify: `src/index.css` (append Ken Burns to components/utilities area)
- Modify: `src/pages/Index.tsx` (interstitial insert + chapter padding)
- Modify: `src/components/salon/ChapterLabel.tsx` (Prata watermark numerals)
- Test: extend `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: `.ken-burns` CSS class, token system, `t('atelier.quote')` + `t('chapter.atelier')` (existing keys — no new copy).
- Produces: homepage dark interstitial `<section class="couture-interstitial">`.

- [x] **Step 1: Failing structural test**

Append to `tests/couture-design.spec.ts`:

```ts
test('homepage has dark Ken Burns interstitial with the atelier quote', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const band = page.locator('section.couture-interstitial');
  await expect(band).toHaveCount(1);
  await expect(band.locator('img')).toHaveCount(1);
  await expect(band.locator('p')).toContainText('tension');
  const anim = await band.locator('.ken-burns img').evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe('ken-burns');
});
```

- [x] **Step 2: Run, verify FAIL** (`section.couture-interstitial` not found)

- [x] **Step 3: Ken Burns CSS** — append to `src/index.css` (after the `.section-padding` component block):

```css
  @keyframes ken-burns {
    from { transform: scale(1.02) translateY(0); }
    to   { transform: scale(1.11) translateY(-1.8%); }
  }
  .ken-burns > img {
    animation: ken-burns 24s cubic-bezier(0.22, 1, 0.36, 1) infinite alternate;
    will-change: transform;
  }
  @media (prefers-reduced-motion: reduce) {
    .ken-burns > img { animation: none; transform: scale(1.04); }
  }
```

- [x] **Step 4: Insert interstitial in `src/pages/Index.tsx`** — directly AFTER the atelier `</section>` and BEFORE the first `<InvitationRule …>`:

```tsx
      {/* Dark couture interstitial — full-bleed atelier imagery, slow Ken Burns */}
      <section className="couture-interstitial relative isolate overflow-hidden bg-onyx">
        <div className="ken-burns absolute inset-0">
          <img
            src="/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover object-[center_30%] opacity-45"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/10 to-onyx/80" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
          <span className="h-px w-16 bg-gold/50" aria-hidden="true" />
          <p className="font-editorial text-2xl italic leading-relaxed text-bone md:text-[2rem] md:leading-[1.5]">
            {t('atelier.quote')}
          </p>
          <span className="font-label text-[10px] uppercase tracking-[0.45em] text-gold-light">
            {t('chapter.atelier')}
          </span>
        </div>
      </section>
```

Also in the same edit: remove the `ScrollReveal delay={0.1}` quote block from the atelier ivory section so the quote exists ONLY in the dark band (spec §4: heading + body stay in ivory):

```tsx
            <ScrollReveal>
              <h3 className="font-heading text-3xl md:text-5xl font-light text-stone-800 leading-tight">
                {t('atelier.heading')}
              </h3>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="font-body text-stone-600 leading-loose max-w-2xl">{t('atelier.body')}</p>
            </ScrollReveal>
```

(the old quote `<ScrollReveal delay={0.1}>…{t('atelier.quote')}…</ScrollReveal>` is deleted; body moves to `delay={0.1}`).

- [x] **Step 5: ChapterLabel watermark** — replace file contents:

```tsx
import { useLanguage } from '../../contexts/LanguageContext';

interface ChapterLabelProps {
  numeral: string;
  titleKey: string;
}

export default function ChapterLabel({ numeral, titleKey }: ChapterLabelProps) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-5 md:gap-7">
      <span
        aria-hidden="true"
        className="font-heading text-5xl md:text-7xl leading-none font-light text-stone-300 select-none"
      >
        {numeral}
      </span>
      <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
      <h2 className="font-heading text-3xl md:text-5xl font-light normal-case text-stone-800">
        {t(titleKey)}
      </h2>
    </div>
  );
}
```

- [x] **Step 6: Atelier section breathing** — in `src/pages/Index.tsx` change the atelier section classes `"bg-bone py-24 md:py-36 …"` → `"bg-bone py-28 md:py-40 …"` (leave other sections for the polish pass; do not restyle more than this in Task 4 to keep reviewable).

- [x] **Step 7: Run tests**

Run: `npx playwright test tests/couture-design.spec.ts e2e/homepage.spec.ts --reporter=line`
Expected: PASS. Then full safety: `npm run lint && npm test`.

- [x] **Step 8: Commit**

```bash
git add src/index.css src/pages/Index.tsx src/components/salon/ChapterLabel.tsx tests/couture-design.spec.ts
git commit -m "feat(home): couture interstitial with Ken Burns, Prata chapter numerals, deeper whitespace"
```

---

### Task 5: Full verification, build parity, owner sign-off

**Files:** none new.

- [x] **Step 1:** `npm run lint && npm test` → tsc clean, 195 unit PASS.
- [x] **Step 2:** `npx playwright test tests/couture-design.spec.ts tests/header-logo-clearance.spec.ts e2e/smoke.spec.ts e2e/homepage.spec.ts e2e/navigation.spec.ts e2e/collection.spec.ts e2e/product-detail.spec.ts --reporter=line` → all PASS (1024 clearance still enforced).
- [x] **Step 3:** Build: `$env:SITE_URL="https://riman.ae"; npm run build` → success; entry JS within ±2KB of 757KB; CSS delta < +3KB; prerendered page count 57.
- [x] **Step 4:** Geometry/contrast probes (node + Playwright, model can't see images): viewport matrix 375/768/1024/1440 EN — assert no `overflowX`, h1 font Prata everywhere present, `--color-gold` computed on 3 sampled elements = `#b08d57`, ken-burns off under `reducedMotion:'reduce'`.
- [x] **Step 5:** Ask owner to visually inspect `http://localhost:3001` (hard refresh) and confirm before anything else ships.

## Self-Review (completed at write time)

- Spec coverage: §1 Task 1 · §2 Tasks 1+4 (Prata headings, labels untouched) · §3 Tasks 2–3 (buttons/forms; badges/cards inherit warmth via tokens; card border sweep in 39 pages = declared Phase 2) · §4 Task 4 · §5 global easing + reduced-motion in Tasks 1/4 CSS, validation Task 5.
- Known deviation: quote de-dup handled inside Task 4 Step 4 (removed from ivory section).
- Type/name consistency: `.btn-couture-ghost`, `.ken-burns`, `couture-interstitial`, `tests/couture-design.spec.ts` used identically across tasks.
