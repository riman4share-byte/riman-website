# Couture Micro-Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Character-rise headlines, champagne button sheen, word-reveal editorial text, and growing gold underlines — via `motion/react` (installed) + pure CSS. No new packages, no WebGL.

**Architecture:** Two small components (`KineticHeading`, `RevealWords`) split text into inline spans and stagger transform/opacity only; two CSS primitives (`.btn-luxury::before` sheen, `.link-couture` underline) inherit site-wide through existing classes. Language and reduced-motion guards render plain static markup instead.

**Tech Stack:** React 18 + TS, `motion/react` (existing), Tailwind v4 `@layer components`, vitest + RTL (existing setup stubs IntersectionObserver), Playwright probes in `tests/couture-design.spec.ts`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-16-couture-micro-motion-design.md` — verbatim values.
- NO new npm packages. NO WebGL/ThreeUI (vitrine reverted `e20746f`). Entry bundle untouched; CSS delta ≤ +1.5 kB.
- Easing everywhere: `cubic-bezier(0.22, 1, 0.36, 1)` = `[0.22, 1, 0.36, 1]`.
- Arabic: NEVER letter-split. Reduced-motion: static markup (JS guard) + existing global CSS neutralizer.
- `Header.tsx` frozen — no edits. Prerender/SEO: `textContent` of every changed element must be identical to before.
- Dev server `http://localhost:3001`. `npm run lint` = tsc; unit = `npm test`; probes = `npx playwright test tests/couture-design.spec.ts --reporter=line`. Build: `$env:SITE_URL="https://riman.ae"; npm run build`.
- Commit per task on `main`. Windows PowerShell quoting rules apply.

---

### Task 1: `KineticHeading` + `RevealWords` components (vitest)

**Files:**
- Create: `src/components/motion/KineticHeading.tsx`
- Create: `src/components/motion/RevealWords.tsx`
- Test: `src/test/kineticMotion.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from `src/contexts/LanguageContext` (returns `{ language, t }`); `motion/react`.
- Produces: `<KineticHeading text as className emphasisChars emphasisClassName delay />` and `<RevealWords text as className stagger />` used by Task 2. CSS class names emitted: `.kin-letter`, `.kin-word` (probes rely on them).

- [ ] **Step 1: Write the failing unit tests**

Create `src/test/kineticMotion.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import KineticHeading from '../components/motion/KineticHeading';
import RevealWords from '../components/motion/RevealWords';

const wrap = (ui: React.ReactNode) => <LanguageProvider>{ui}</LanguageProvider>;

describe('KineticHeading', () => {
  beforeEach(() => localStorage.setItem('riman_lang', 'en'));

  it('EN: splits into per-character spans and preserves textContent', () => {
    const { container } = render(wrap(<KineticHeading as="h2" text="Atelier & Grace" emphasisChars={['&']} />));
    const h2 = container.querySelector('h2')!;
    expect(h2.querySelectorAll('.kin-letter').length).toBe(14);
    expect(h2.textContent).toBe('Atelier & Grace');
    const em = [...h2.querySelectorAll('span')].find((s) => s.textContent === '&');
    expect(em?.className).toContain('font-editorial');
  });

  it('AR: renders zero letter spans, plain text', () => {
    localStorage.setItem('riman_lang', 'ar');
    const { container } = render(wrap(<KineticHeading as="h2" text="القصات" />));
    expect(container.querySelector('h2')!.querySelectorAll('.kin-letter').length).toBe(0);
    expect(container.querySelector('h2')!.textContent).toBe('القصات');
  });

  it('long text (>90 chars) is not letter-split', () => {
    const long = 'x'.repeat(91);
    const { container } = render(wrap(<KineticHeading as="h3" text={long} />));
    expect(container.querySelector('.kin-letter')).toBeNull();
  });
});

describe('RevealWords', () => {
  it('splits into word spans preserving words, never breaks Arabic', () => {
    const { container } = render(wrap(<RevealWords as="p" text="Grace held in tension" />));
    expect(container.querySelectorAll('.kin-word').length).toBe(4);
    expect(container.querySelector('p')!.textContent).toContain('Grace');
    expect(container.querySelector('p')!.textContent).toContain('tension');
  });
});
```

- [ ] **Step 2: Run, verify FAIL**

Run: `npx vitest run src/test/kineticMotion.test.tsx`
Expected: FAIL — cannot resolve `../components/motion/KineticHeading`.

- [ ] **Step 3: Create `src/components/motion/KineticHeading.tsx`**

```tsx
import { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface KineticHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  emphasisChars?: string[];
  emphasisClassName?: string;
  delay?: number;
}

const container: Variants = {
  hidden: {},
  show: (delay: number) => ({ transition: { staggerChildren: 0.028, delayChildren: delay } }),
};

const letter: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const MOTION_TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3 } as const;
const HTML_TAGS = { h1: 'h1', h2: 'h2', h3: 'h3' } as const;

export default function KineticHeading({
  text,
  as = 'h2',
  className = '',
  emphasisChars = [],
  emphasisClassName = 'font-editorial italic text-gold',
  delay = 0,
}: KineticHeadingProps) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const chars = useMemo(() => Array.from(text), [text]);

  if (reduced || language === 'ar' || chars.length > 90) {
    const Tag = HTML_TAGS[as];
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag
      className={className}
      custom={delay}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          variants={letter}
          className={
            emphasisChars.includes(char)
              ? `${emphasisClassName} inline-block whitespace-pre`
              : 'kin-letter inline-block whitespace-pre'
          }
        >
          {char}
        </span>
      ))}
    </MotionTag>
  );
}
```

- [ ] **Step 4: Create `src/components/motion/RevealWords.tsx`**

```tsx
import { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

interface RevealWordsProps {
  text: string;
  as?: 'p' | 'span' | 'blockquote';
  className?: string;
  stagger?: number;
}

const container: Variants = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};

const word: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const MOTION_TAGS = { p: motion.p, span: motion.span, blockquote: motion.blockquote } as const;
const HTML_TAGS = { p: 'p', span: 'span', blockquote: 'blockquote' } as const;

export default function RevealWords({ text, as = 'p', className = '', stagger = 0.04 }: RevealWordsProps) {
  const reduced = useReducedMotion();
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  if (reduced) {
    const Tag = HTML_TAGS[as];
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag
      className={className}
      custom={stagger}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} variants={word} className="kin-word inline-block whitespace-pre me-[0.25em]">
          {w}
        </span>
      ))}
    </MotionTag>
  );
}
```

- [ ] **Step 5: Run tests, verify PASS + lint**

Run: `npx vitest run src/test/kineticMotion.test.tsx && npm run lint`
Expected: 4 passed; tsc clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/motion src/test/kineticMotion.test.tsx
git commit -m "feat(motion): KineticHeading + RevealWords — letter/word rise primitives (EN-safe, AR/reduced static)"
```

---

### Task 2: CSS sheen + underline, wire all surfaces, probes

**Files:**
- Modify: `src/index.css` (`.btn-luxury` line ~173; add rules after the focus-visible block ~208)
- Modify: `src/components/ui-21st/HeroSection.tsx:61-68` + import
- Modify: `src/components/salon/ChapterLabel.tsx` (h2) + `src/components/salon/ChapterLabel.test.tsx`
- Modify: `src/components/ui-21st/CallToAction21st.tsx:13` + import
- Modify: `src/pages/Index.tsx` (46–48 body, 67–69 quote, 131–133 label) + imports
- Modify: `src/components/ui-21st/FooterSection.tsx:32,59-60`
- Test: extend `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: Task 1 components; class hooks `.kin-letter`.
- Produces: `.link-couture`, `.btn-luxury::before` (probed), fully wired homepage.

- [ ] **Step 1: Write the failing probes**

Append to `tests/couture-design.spec.ts`:

```ts
test('phase 3: btn-luxury has champagne sheen pseudo-element', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const btn = page.locator('#hero a.btn-luxury').first();
  await btn.waitFor({ timeout: 45000 });
  const styles = await btn.evaluate((el) => {
    const cs = getComputedStyle(el);
    const pre = getComputedStyle(el, '::before');
    return { overflow: cs.overflow, pos: cs.position, preTransition: pre.transitionDuration, preW: parseFloat(pre.width) > 0, preBg: pre.backgroundImage.includes('gradient') };
  });
  expect(styles.overflow).toBe('hidden');
  expect(styles.pos).toBe('relative');
  expect(styles.preTransition).toContain('0.9s');
  expect(styles.preW).toBe(true);
  expect(styles.preBg).toBe(true);
});

test('phase 3: hero headline letter-splits EN, stays plain AR + reduced-motion', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#hero h1', { timeout: 45000 });
  await page.waitForTimeout(1500);
  const en = await page.evaluate(() => ({
    letters: document.querySelectorAll('#hero h1 .kin-letter').length,
    text: document.querySelector('#hero h1')!.textContent,
  }));
  expect(en.letters).toBeGreaterThan(10);
  expect((en.text || '').trim().length).toBeGreaterThan(5);

  const arPage = await page.context().newPage();
  await arPage.addInitScript(() => localStorage.setItem('riman_lang', 'ar'));
  await arPage.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
  await arPage.waitForSelector('#hero h1', { timeout: 45000 });
  expect(await arPage.locator('#hero h1 .kin-letter').count()).toBe(0);

  const rctx = await page.context().browser()!.newContext({ reducedMotion: 'reduce' });
  const rpage = await rctx.newPage();
  await rpage.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await rpage.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
  await rpage.waitForSelector('#hero h1', { timeout: 45000 });
  expect(await rpage.locator('#hero h1 .kin-letter').count()).toBe(0);
  await rctx.close();
});

test('phase 3: link-couture underlines present on homepage', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main', { timeout: 45000 });
  expect(await page.locator('.link-couture').count()).toBeGreaterThanOrEqual(3);
});
```

Run: `npx playwright test tests/couture-design.spec.ts -g "phase 3" --reporter=line` → 3 FAIL.

- [ ] **Step 2: CSS — sheen + underline in `src/index.css`**

2a. Extend the existing `.btn-luxury` rule (add `relative overflow-hidden`):

```css
  .btn-luxury {
    @apply relative overflow-hidden inline-flex items-center justify-center px-10 py-4 font-label text-xs tracking-[0.25em] uppercase transition-colors duration-500 bg-onyx text-bone hover:bg-stone-900 hover:text-gold-light border-0;
  }
```

2b. Immediately after the `.btn-luxury:focus-visible, …` block (after its closing brace), add:

```css
  .btn-luxury::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 60%;
    background: linear-gradient(105deg, transparent 0%, rgba(201, 169, 111, 0.28) 45%, rgba(246, 240, 230, 0.35) 50%, rgba(201, 169, 111, 0.28) 55%, transparent 100%);
    transform: translateX(-160%) skewX(-14deg);
    transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }
  .btn-luxury:hover::before,
  .btn-luxury:focus-visible::before {
    transform: translateX(260%) skewX(-14deg);
  }

  .link-couture {
    position: relative;
  }
  .link-couture::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 1px;
    background: var(--color-gold);
    transform: scaleX(0.25);
    transform-origin: left;
    transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .link-couture:hover::after,
  .link-couture:focus-visible::after {
    transform: scaleX(1);
  }
  [dir="rtl"] .link-couture::after {
    transform-origin: right;
  }
```

- [ ] **Step 3: Hero H1 → KineticHeading**

`src/components/ui-21st/HeroSection.tsx` — add import:

```tsx
import KineticHeading from '../motion/KineticHeading';
```

Replace the h1 block (lines 61–68) with:

```tsx
        <KineticHeading
          as="h1"
          text={t('hero.title')}
          emphasisChars={['&']}
          className="font-heading text-white font-light leading-[1.02] text-[clamp(2.5rem,8vw,7rem)] mb-6 [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]"
        />
```

- [ ] **Step 4: ChapterLabel h2 → KineticHeading (numeral stays)**

`src/components/salon/ChapterLabel.tsx` — add `import KineticHeading from '../motion/KineticHeading';` and replace the h2 with:

```tsx
      <KineticHeading
        as="h2"
        text={t(titleKey)}
        delay={0.15}
        className="font-heading text-3xl md:text-5xl font-light normal-case text-stone-800"
      />
```

Update `src/components/salon/ChapterLabel.test.tsx` (letter-spans break `getByText`):

```tsx
  it('renders numeral and translated chapter title', () => {
    const { container } = render(
      <LanguageProvider>
        <ChapterLabel numeral="I" titleKey="chapter.atelier" />
      </LanguageProvider>
    );
    expect(screen.getByText('I')).toBeInTheDocument();
    expect(container.textContent).toContain("L'Atelier");
  });
```

- [ ] **Step 5: CTA h2 → KineticHeading**

`src/components/ui-21st/CallToAction21st.tsx` — add `import KineticHeading from '../motion/KineticHeading';` and replace line 13 with:

```tsx
          <KineticHeading as="h2" text="Ready to begin?" className="font-heading text-3xl md:text-5xl font-light text-stone-800 mb-4" />
```

- [ ] **Step 6: Index — word reveals + discipline underline**

`src/pages/Index.tsx` — add imports:

```tsx
import RevealWords from '../components/motion/RevealWords';
```

Replace the atelier body block (lines 46–48):

```tsx
            <RevealWords
              text={t('atelier.body')}
              className="font-body text-stone-600 leading-loose max-w-2xl"
            />
```

(removes that body copy's `<ScrollReveal delay={0.1}>` wrapper — RevealWords owns the entrance)

Replace the interstitial quote element (lines 67–69):

```tsx
          <RevealWords
            text={t('atelier.quote')}
            className="font-editorial text-2xl italic leading-relaxed text-bone md:text-[2rem] md:leading-[1.5]"
          />
```

Replace the discipline label span (lines 131–133):

```tsx
                  <span className="link-couture inline-block mt-3 font-label text-xs tracking-[0.25em] uppercase text-gold">
                    {t('disciplines.discover')}
                  </span>
```

- [ ] **Step 7: Footer links → link-couture**

`src/components/ui-21st/FooterSection.tsx` line 32:

```tsx
            <Link key={to} to={to} className="link-couture text-white/70 hover:text-gold min-h-[44px] inline-flex items-center">
```

Lines 59–60:

```tsx
          <Link to="/privacy" className="link-couture hover:text-gold">Privacy</Link>
          <Link to="/terms" className="link-couture hover:text-gold">Terms</Link>
```

- [ ] **Step 8: Run probes + affected suites**

Run: `npx playwright test tests/couture-design.spec.ts e2e/homepage.spec.ts --reporter=line` → all PASS.
Run: `npm run lint && npm test -- --run` → clean; all green (199+).

- [ ] **Step 9: Commit**

```bash
git add src/index.css src/components/ui-21st/HeroSection.tsx src/components/salon/ChapterLabel.tsx src/components/salon/ChapterLabel.test.tsx src/components/ui-21st/CallToAction21st.tsx src/pages/Index.tsx src/components/ui-21st/FooterSection.tsx tests/couture-design.spec.ts
git commit -m "feat(motion): couture micro-motion wired — hero/chapter letter-rise, btn sheen, word reveals, gold link underlines"
```

---

### Task 3: Full verification + build parity + sign-off

**Files:** none new.

- [ ] **Step 1:** `npm run lint && npm test -- --run` → tsc clean, all unit PASS.
- [ ] **Step 2:** `npx playwright test tests/ e2e/ --reporter=line` → FULL suite PASS.
- [ ] **Step 3:** `$env:SITE_URL="https://riman.ae"; npm run build` → success; entry JS 757 kB ±2; CSS ≤ 132.0 kB (Phase 2 end-state 131.48 + ≤0.5 budget for this pass is included in the ≤ +1.5 kB total since Phase 1's 130.33 — check absolute); 57 prerendered pages; `dist/index.html` contains full hero text (textContent parity across splits).
- [ ] **Step 4:** node probe (write, run, delete): 375/768/1024/1440 EN — no overflowX; `reducedMotion:'reduce'` → `.kin-letter` count 0 and sheen `::before` transitionDuration collapses (global 0.01ms rule) on `/`.
- [ ] **Step 5:** Check this plan's boxes; commit plan.
- [ ] **Step 6:** Owner visual sign-off at `http://localhost:3001` (hard refresh) — hover a primary button, scroll the hero + chapters.

## Self-Review (at write time)

- Spec coverage: A=Task 2 Steps 3–5, B=Step 2a/2b, C=Step 6, D=Steps 2b/6/7; probes Task 2 Step 1 + Task 3.
- No placeholders: every component/CSS/wiring edit shows complete before/after code.
- Consistency: `.kin-letter`/`.kin-word`/`.link-couture`/`emphasisClassName` defaults identical in components, tests, probes; ChapterLabel test updated where `getByText` breaks.
