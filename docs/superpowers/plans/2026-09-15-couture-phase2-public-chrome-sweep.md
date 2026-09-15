# Couture Phase 2 — Public Chrome Sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the couture language on public pages: reusable `.card-couture` / `.field-couture` classes, borderless card/panel plates across ~15 files, hairline form controls everywhere, and an ink mobile bottom-nav.

**Architecture:** Two new component classes in `src/index.css` carry all new styling rules (mirroring the Phase 1 `.btn-luxury`/`.btn-couture-ghost` precedent). Call-site edits then delete hand-boxed utility chains (`border border-stone-100`, `bg-stone-50 … focus:border-gold`, hover frames) in favor of the classes or plain removal. No new components, no props/logic changes. Verification = computed-style probes appended to `tests/couture-design.spec.ts`.

**Tech Stack:** Tailwind v4 `@layer components`, React + TS, Playwright standalone specs in `tests/`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-15-couture-phase2-public-chrome-sweep-design.md` — values verbatim.
- NO new npm packages. NO WebGL. NO admin changes. NO `src/components/Header.tsx` edits (d63387d frozen). NO layout/spacing recomposition.
- Functional states KEEP their gold-border markers on purpose: product size chips (ProductCard + ProductDetail — `e2e/product-detail.spec.ts:93` sniffs `border-gold`), appointment time-slot chips, Profile tab active underline, dropdown/menu chrome (ProductDetail 317/321/334), SKU/tag chips, hairline DIVIDERS (`border-t`/`border-b` rules are couture, not plates).
- Dev server on `http://localhost:3001` (already running). Build needs `$env:SITE_URL="https://riman.ae"`.
- `npm run lint` = `tsc --noEmit`; unit suite `npm test` must stay 195; e2e probe file: `npx playwright test tests/couture-design.spec.ts --reporter=line`.
- Commit per task on `fix/security-seo-production`. Windows PowerShell — no nested-quote `&&` chains.

---

### Task 1: Couture card + field classes in `index.css`

**Files:**
- Modify: `src/index.css` (insert after the Ken Burns block, before `.divider-gold` — i.e. after line 232's `}`)
- Test: extend `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: Phase 1 tokens (`--color-stone-300`, `--color-gold`, easing).
- Produces: `.card-couture` (wrapper; borderless, no plate, img hover zoom 1.04/1.2s, reduced-motion off) and `.field-couture` (control; transparent, 1px stone-300 bottom rule, gold focus). Used verbatim by Tasks 3–5.

- [x] **Step 1: Write the failing probe**

Append to `tests/couture-design.spec.ts`:

```ts
test('phase 2: .card-couture and .field-couture classes are live in the bundle', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 45000 });
  const probe = await page.evaluate(() => {
    const card = document.createElement('div');
    card.className = 'card-couture';
    const img = document.createElement('img');
    card.appendChild(img);
    document.body.appendChild(card);
    const field = document.createElement('input');
    field.className = 'field-couture';
    document.body.appendChild(field);
    const c = getComputedStyle(card);
    const i = getComputedStyle(img);
    const f = getComputedStyle(field);
    const out = {
      cardBorder: c.borderTopWidth, cardShadow: c.boxShadow, cardRadius: c.borderTopLeftRadius,
      cardOverflow: c.overflow, imgTransition: i.transitionDuration,
      fieldTop: f.borderTopWidth, fieldBottom: f.borderBottomWidth,
      fieldRadius: f.borderTopLeftRadius, fieldBg: f.backgroundColor,
    };
    card.remove(); field.remove();
    return out;
  });
  expect(probe.cardBorder).toBe('0px');
  expect(probe.cardShadow).toBe('none');
  expect(probe.cardRadius).toBe('0px');
  expect(probe.cardOverflow).toBe('hidden');
  expect(probe.imgTransition).toContain('1.2s');
  expect(probe.fieldTop).toBe('0px');
  expect(probe.fieldBottom).toBe('1px');
  expect(probe.fieldRadius).toBe('0px');
  expect(probe.fieldBg).toBe('rgba(0, 0, 0, 0)');
});
```

- [x] **Step 2: Run, verify FAIL**

Run: `npx playwright test tests/couture-design.spec.ts --reporter=line`
Expected: new test FAILS (cardOverflow `visible`, fieldBottom `0px` or browser default — classes don't exist yet); all Phase 1 tests pass.

- [x] **Step 3: Add the classes**

In `src/index.css`, insert after the reduced-motion Ken Burns block (the `}` closing the `@media` at line ~232) and BEFORE `.divider-gold {`:

```css
  .card-couture {
    position: relative;
    overflow: hidden;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }
  .card-couture img {
    transition: transform 1200ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .card-couture:hover img,
  .card-couture:focus-within img {
    transform: scale(1.04);
  }
  @media (prefers-reduced-motion: reduce) {
    .card-couture:hover img,
    .card-couture:focus-within img { transform: none; }
  }

  .field-couture {
    width: 100%;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid var(--color-stone-300);
    border-radius: 0;
    padding: 0.85rem 0.25rem;
    color: var(--color-stone-800);
    outline: none;
    transition: border-color 400ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .field-couture:focus {
    outline: none;
    border-bottom-color: var(--color-gold);
  }
  .field-couture::placeholder {
    color: var(--color-stone-500);
  }
```

- [x] **Step 4: Run, verify PASS**

Run: `npx playwright test tests/couture-design.spec.ts --reporter=line` → all PASS.

- [x] **Step 5: Guards + commit**

Run: `npm run lint && npm test` → clean, 195.

```bash
git add src/index.css tests/couture-design.spec.ts
git commit -m "feat(design): phase-2 couture vocabulary — card-couture + field-couture classes"
```

---

### Task 2: Ink mobile bottom-nav

**Files:**
- Modify: `src/components/MobileBottomNav.tsx:21,29-40`
- Test: extend `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: tokens `bg-onyx`, `text-bone`, `gold-light`.
- Produces: bottom-nav ink band (no later task depends on it).

- [x] **Step 1: Write the failing probe**

Append to `tests/couture-design.spec.ts`:

```ts
test('phase 2: mobile bottom-nav is an ink band with gold active state', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const nav = page.locator('nav.fixed.bottom-0');
  await expect(nav).toBeVisible({ timeout: 45000 });
  const styles = await nav.evaluate((el) => {
    const cs = getComputedStyle(el);
    const active = el.querySelector('a.text-gold-light') as HTMLElement | null;
    const linkCs = active ? getComputedStyle(active) : null;
    return { bg: cs.backgroundColor, hasActive: !!active, activeColor: linkCs?.color ?? null };
  });
  expect(styles.bg).toBe('rgb(15, 13, 10)');
  expect(styles.hasActive).toBe(true);
  expect(styles.activeColor).toBe('rgb(201, 169, 111)');
});
```

- [x] **Step 2: Run, verify FAIL** (current bg is bone `rgb(239, 234, 226)`)

- [x] **Step 3: Restyle the nav** — replace lines 20–45 (`return ( ... );` body) with:

```tsx
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-onyx border-t border-gold/20 z-[100] grid grid-cols-5 md:hidden h-16 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 transition-colors duration-500",
              isActive ? "text-gold-light" : "text-bone/60 hover:text-bone"
            )}
          >
            {isActive && <span aria-hidden="true" className="absolute inset-x-5 top-0 h-px bg-gold-light" />}
            <Icon className="w-5 h-5" />
            <span className="text-micro uppercase tracking-tighter font-black">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-2 right-4 bg-gold-light text-stone-950 text-micro min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full leading-none font-bold">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
```

(Unchanged: navItems, imports, hook logic, grid/links/behavior. Badge is now the champagne dot: gold-light bg + stone-950 text.)

- [x] **Step 4: Run probe + smoke PASS**

Run: `npx playwright test tests/couture-design.spec.ts e2e/smoke.spec.ts --reporter=line` → all PASS.

- [x] **Step 5: Commit**

```bash
git add src/components/MobileBottomNav.tsx tests/couture-design.spec.ts
git commit -m "feat(ui): mobile bottom-nav couture ink band with gold-light active state + champagne badge"
```

---

### Task 3: Card sweep (ProductCard frames, journal/collections/wishlist plates → `.card-couture`)

**Files:**
- Modify: `src/components/ProductCard.tsx:123,248`
- Modify: `src/pages/JournalPage.tsx:152,184`
- Modify: `src/pages/CollectionsPage.tsx:116`
- Modify: `src/pages/WishlistPage.tsx:121,177`
- Test: extend `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: Task 1 `.card-couture`.
- Produces: cards render borderless site-wide (CollectionPage picks this up automatically via shared ProductCard).

- [x] **Step 1: Write the failing probe**

Append to `tests/couture-design.spec.ts`:

```ts
test('phase 2: collections page renders borderless couture cards', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/collections', { waitUntil: 'domcontentloaded' });
  const card = page.locator('.card-couture').first();
  await expect(card).toBeVisible({ timeout: 45000 });
  const styles = await card.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { border: cs.borderTopWidth, radius: cs.borderTopLeftRadius, overflow: cs.overflow };
  });
  expect(styles.border).toBe('0px');
  expect(styles.radius).toBe('0px');
  expect(styles.overflow).toBe('hidden');
});
```

- [x] **Step 2: Run, verify FAIL** (0 `.card-couture` elements)

- [x] **Step 3: ProductCard — drop the two decorative borders**

`src/components/ProductCard.tsx` line 123, on the 3D badge span remove `border border-onyx/10`:

```tsx
            <span className="bg-ivory/90 backdrop-blur-md text-onyx text-micro tracking-[0.3em] uppercase px-4 py-1.5 flex items-center gap-2 font-bold">
```

Delete the expanding gold-frame span at lines 247–248 entirely (the comment line plus):

```tsx
        {/* Expanding gold frame — couture hover detail */}
        <span className="absolute inset-3 border border-gold/0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:inset-4 group-hover:border-gold/40 pointer-events-none z-10" aria-hidden="true" />
```

KEEP (functional/contract): image wrapper's existing hover zoom utilities (104), size-chip `border-gold` selected state (175–178), quick-bar `border-t border-gold/20` (190).

- [x] **Step 4: Page grids → `.card-couture`**

`src/pages/JournalPage.tsx:152`:

```tsx
              <div className="card-couture">
```

`src/pages/JournalPage.tsx:184`:

```tsx
                <div className={`card-couture ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
```

`src/pages/CollectionsPage.tsx:116`:

```tsx
                      className="card-couture group relative block bg-stone-100"
```

`src/pages/WishlistPage.tsx:121`:

```tsx
                  className="card-couture group relative"
```

`src/pages/WishlistPage.tsx:177` (empty-state plate — borderless, keep padding):

```tsx
          <div className="text-center py-32">
```

- [x] **Step 5: Run probes + affected e2e**

Run: `npx playwright test tests/couture-design.spec.ts e2e/collection.spec.ts e2e/homepage.spec.ts --reporter=line` → all PASS.

- [x] **Step 6: Guards + commit**

Run: `npm run lint && npm test`

```bash
git add src/components/ProductCard.tsx src/pages/JournalPage.tsx src/pages/CollectionsPage.tsx src/pages/WishlistPage.tsx tests/couture-design.spec.ts
git commit -m "feat(ui): borderless couture cards — card-couture on journal/collections/wishlist, drop ProductCard plate frames"
```

---

### Task 4: Form-field + panel sweep (Contact, Auth, Checkout, Faq, Search, Profile, Appointment, SizeGuide)

**Files:**
- Modify: `src/pages/ContactPage.tsx`, `src/pages/Auth.tsx`, `src/pages/Checkout.tsx`, `src/pages/FaqPage.tsx`, `src/pages/SearchPage.tsx`, `src/pages/ProfilePage.tsx`, `src/pages/AppointmentPage.tsx`, `src/components/SizeGuide.tsx`
- Test: extend `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: Task 1 `.field-couture`.
- Produces: hairline controls on all public forms; boxed `bg-stone-50 border border-stone-100` panel plates removed.

- [x] **Step 1: Write the failing probe**

Append to `tests/couture-design.spec.ts`:

```ts
test('phase 2: contact form controls are hairline .field-couture', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  const field = page.locator('main .field-couture').first();
  await expect(field).toBeVisible({ timeout: 45000 });
  const styles = await field.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { top: cs.borderTopWidth, bottom: cs.borderBottomWidth, radius: cs.borderTopLeftRadius, bg: cs.backgroundColor };
  });
  expect(styles.top).toBe('0px');
  expect(styles.bottom).toBe('1px');
  expect(styles.radius).toBe('0px');
  expect(styles.bg).toBe('rgba(0, 0, 0, 0)');
});
```

- [x] **Step 2: Run, verify FAIL**

- [x] **Step 3: Replace control class chains** (exact old → new, per occurrence)

`ContactPage.tsx:123` (+139 name/email inputs, 156 phone — same string):

```tsx
"field-couture p-4 text-sm",
```

`ContactPage.tsx:172` (select):

```tsx
"field-couture appearance-none cursor-pointer p-4 text-sm",
```

`ContactPage.tsx:192` (textarea):

```tsx
"field-couture p-4 text-sm resize-none",
```

`Auth.tsx:128,143,158` (three controls, same string):

```tsx
className="field-couture p-4 text-xs tracking-widest"
```

`Checkout.tsx:530` (gift-note textarea):

```tsx
className="field-couture p-4 text-xs tracking-widest resize-none"
```

`FaqPage.tsx:50` (search input — keep `ps-14` for the icon):

```tsx
className="field-couture ps-14 text-xs tracking-widest"
```

`SearchPage.tsx:47` (keep `p-8 ps-16` sizing):

```tsx
className="field-couture p-8 ps-16 text-sm tracking-[0.2em] uppercase"
```

(`p-4`/`p-8` utilities win over the class padding — same layering as Phase 1.)

- [x] **Step 4: De-box panels, plates, ghost buttons**

| File:line | Now | Becomes |
|---|---|---|
| `ContactPage.tsx:98` | `"bg-stone-50 p-6 border border-stone-100 flex flex-col justify-center"` | `"bg-stone-50 p-6 flex flex-col justify-center"` |
| `ContactPage.tsx:275` | `"w-12 h-12 bg-ivory border border-stone-100 flex … rounded-sm shrink-0"` | drop `border border-stone-100 ` and `rounded-sm` (keep rest) |
| `Auth.tsx:79` | `"max-w-md w-full bg-ivory p-10 md:p-12 border border-stone-100 relative overflow-hidden"` | drop `border border-stone-100 ` |
| `AppointmentPage.tsx:184,237,286` | `"bg-ivory p-8 md:p-12 border border-stone-100"` | `"bg-ivory p-8 md:p-12"` (all three) |
| `AppointmentPage.tsx:291` | `"bg-ivory p-8 border border-stone-100 mb-8"` | `"bg-ivory p-8 mb-8"` |
| `Checkout.tsx:345` | `"bg-ivory p-6 md:p-10 border border-stone-100"` | `"bg-ivory p-6 md:p-10"` |
| `Checkout.tsx:490` | `"flex gap-4 items-center p-3 border border-stone-100"` | `"flex gap-4 items-center p-3 border-b border-stone-200"` (divider, not plate) |
| `Checkout.tsx:594` | `"flex items-center justify-center gap-2 py-3 border border-stone-200 text-micro tracking-[0.2em] uppercase text-stone-600 font-bold hover:border-gold/30 hover:text-gold transition-all"` | `"btn-couture-ghost !text-stone-800 w-full justify-center"` (ghost-underline system) |
| `Checkout.tsx:767` | `"bg-onyx text-white p-6 border border-stone-800"` | drop `border border-stone-800 ` |
| `ProfilePage.tsx:50` | `"bg-ivory p-8 border border-stone-100 relative overflow-hidden"` | drop `border border-stone-100 ` |
| `ProfilePage.tsx:102` | `"bg-stone-50 p-6 border border-stone-100 animate-pulse"` | `"bg-stone-50 p-6 animate-pulse"` |
| `ProfilePage.tsx:109,114` | `"bg-ivory p-12 text-center border border-stone-100"` | `"bg-ivory p-12 text-center"` (both) |
| `ProfilePage.tsx:122` | `"bg-ivory p-6 border border-stone-50 flex … hover:border-gold/20 transition-colors"` | drop `border border-stone-50 ` and `hover:border-gold/20 ` |
| `ProfilePage.tsx:174` | `"bg-ivory p-8 border border-stone-100"` | `"bg-ivory p-8"` |
| `SearchPage.tsx:114` | `"w-20 h-20 bg-stone-50 flex items-center justify-center mx-auto mb-8 border border-stone-100"` | drop `border border-stone-100` |
| `SizeGuide.tsx:47` (modal) | `"relative w-full max-w-lg bg-ivory border border-stone-100 max-h-[90vh] overflow-y-auto"` | drop `border border-stone-100 ` (sticky header `border-b` hairline at 51 stays) |
| `SizeGuide.tsx:104` | `"mt-6 p-4 bg-gold/5 border border-gold/20"` | `"mt-6 p-4 bg-gold/5"` |
| `FaqPage.tsx:71` (accordion item) | `"border border-stone-50 bg-ivory hover:border-gold/20 transition-all"` | `"bg-ivory border-b border-stone-200 transition-all"` |

KEEP (functional): `FaqPage.tsx:50` icon `ps-14`, `:62/:87` hairlines; Appointment `171` step circles + `190` gown callout + `262` time-slot chips incl. `border-gold` active; Profile `164` tab active `border-gold`; all `border-rose-*` wishlist-heart states.

- [x] **Step 5: Run probe + affected specs**

Run: `npx playwright test tests/couture-design.spec.ts e2e/smoke.spec.ts --reporter=line` → all PASS.

- [x] **Step 6: Guards + commit**

Run: `npm run lint && npm test`

```bash
git add src/pages/ContactPage.tsx src/pages/Auth.tsx src/pages/Checkout.tsx src/pages/FaqPage.tsx src/pages/SearchPage.tsx src/pages/ProfilePage.tsx src/pages/AppointmentPage.tsx src/components/SizeGuide.tsx tests/couture-design.spec.ts
git commit -m "feat(ui): hairline .field-couture on all public forms + de-box panel plates (phase 2)"
```

---

### Task 5: ProductDetail audit sweep (31 bordered usages)

**Files:**
- Modify: `src/pages/ProductDetail.tsx` (lines below are pre-edit; work BOTTOM-UP so numbers stay valid, or match strings)
- Test: extend `tests/couture-design.spec.ts`

**Interfaces:**
- Consumes: Task 1 `.field-couture`.
- Produces: product page free of plate borders; review controls hairline.

- [x] **Step 1: Write the failing probe**

Append to `tests/couture-design.spec.ts`:

```ts
test('phase 2: product detail has no plate borders and hairline review fields', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('riman_lang', 'en'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const href = await page.locator('a[href^="/product/"]').first().getAttribute('href');
  expect(href).toBeTruthy();
  await page.goto('http://localhost:3001' + href!, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main', { timeout: 45000 });
  const probe = await page.evaluate(() => {
    const plates = [...document.querySelectorAll('main *')].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.borderTopWidth !== '0px' && cs.borderLeftWidth === cs.borderTopWidth && cs.borderTopWidth === cs.borderBottomWidth && cs.borderTopWidth === cs.borderRightWidth && parseFloat(cs.borderTopLeftRadius) > 0;
    }).length;
    const boxedInputs = [...document.querySelectorAll('main input, main textarea')].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.borderTopWidth !== '0px';
    }).length;
    const reviewFields = document.querySelectorAll('main .field-couture').length;
    return { plates, boxedInputs, reviewFields };
  });
  expect(probe.reviewFields).toBeGreaterThanOrEqual(2);
  expect(probe.boxedInputs).toBe(0);
  expect(probe.plates).toBe(0);
});
```

- [x] **Step 2: Run, verify FAIL**

- [x] **Step 3: Apply the line-by-line audit** (replace by string match, top-to-bottom list)

| Line | Element | Action |
|---|---|---|
| 317, 321 | 3D/classic toggle buttons | KEEP (functional toggle states) |
| 334 | thumbnail dropdown panel | KEEP (menu chrome) |
| 367, 373, 415, 498, 504, 525, 642, 789, 802, 866, 870 | `border-t`/`border-x`/`border-b` dividers | KEEP — these are couture hairlines; only recolor if stone-100 on ivory reads broken: change `border-stone-100` → `border-stone-200` when adjacent to `bg-ivory`/`bg-bone` so the rule stays visible post-remap |
| 393, 538, 676, 788 | SKU/tag/size mini-chips | KEEP (functional meta tags) |
| 436 | spec info box `"p-5 bg-stone-50 border border-stone-200"` | → `"p-5 bg-stone-50"` |
| 461, 491, 817 | size chips + wishlist heart | KEEP (functional states incl. `border-gold` selected — e2e contract) |
| 517 | details accordion `"border border-stone-100 mb-4"` | → `"mb-4 border-t border-stone-200"` |
| 552 | rental info accordion `"border border-stone-100 mb-4"` | → `"mb-4 border-t border-stone-200"` |
| 610 | alteration/FAQ box `"border border-stone-100"` | → `"border-t border-stone-200"` |
| 688 | review photo `"… object-cover border border-stone-200"` | drop `border border-stone-200` |
| 697 | review feature panel `"bg-pearl p-8 border border-stone-100 min-h-[400px] flex flex-col"` | → `"bg-pearl p-8 min-h-[400px] flex flex-col"` |
| 736 | review name input `"w-full px-5 py-4 bg-ivory border border-stone-100 text-xs tracking-widest outline-none focus:border-gold transition-colors"` | → `"field-couture text-xs tracking-widest"` |
| 740 | review textarea (same + `resize-none`) | → `"field-couture text-xs tracking-widest resize-none"` |
| 746 | review photo thumb `"w-14 h-14 object-cover border border-stone-200"` | drop `border border-stone-200` |
| 750 | upload button `"flex items-center gap-2 px-4 py-3 border border-stone-200 text-micro tracking-widest uppercase text-stone-600 hover:border-gold hover:text-gold transition-colors"` | → `"btn-couture-ghost !text-stone-800"` |
| 848 | rental modal `"bg-ivory max-w-lg w-full p-8 md:p-12 relative border border-stone-200 max-h-[90vh] overflow-y-auto"` | drop `border border-stone-200 ` |

- [x] **Step 4: Run probe + product e2e (critical)**

Run: `npx playwright test tests/couture-design.spec.ts e2e/product-detail.spec.ts --reporter=line`
Expected: all PASS — size-chip `border-gold` contract preserved at 461; if the spec's add-to-cart flow touches a moved class, fix the SPEC selector, not the UI.

- [x] **Step 5: Guards + commit**

Run: `npm run lint && npm test`

```bash
git add src/pages/ProductDetail.tsx tests/couture-design.spec.ts
git commit -m "feat(ui): product detail plate sweep — borderless panels, hairline dividers, .field-couture review form"
```

---

### Task 6: Full verification + build parity + sign-off

**Files:** none new.

- [x] **Step 1:** `npm run lint && npm test` → clean, 195.
- [x] **Step 2:** `npx playwright test tests/ e2e/ --reporter=line` → FULL suite PASS.
- [x] **Step 3:** `$env:SITE_URL="https://riman.ae"; npm run build` → success; entry JS 757 kB ±2; CSS vs 130.33 kB baseline delta ≤ +3 kB; 57 prerendered pages.
- [x] **Step 4:** viewport probe (node script, then delete): 375/768/1024/1440 EN — no `overflowX`; bottom-nav ink only `<md`; `.field-couture` computed hairline on /contact at each width; reduced-motion → card hover transform `none`.
- [x] **Step 5:** Update this plan's checkboxes, commit plan.
- [ ] **Step 6:** Owner visual sign-off on `http://localhost:3001` (hard refresh) before anything ships.

## Self-Review (at write time)

- Spec coverage: §1 Task 1 · §2 card rows Tasks 3–5, forms Task 4, bottom-nav Task 2 · untouched list enforced by Global Constraints · §4 probes Tasks 1–5 + Task 6.
- Placeholder scan: every replacement shows exact before/after strings; ProductDetail 367–870 keeps are an explicit KEEP table, not "audit later".
- Type/name consistency: `.card-couture`, `.field-couture`, `btn-couture-ghost` spelled identically in Tasks 1–5; probe class names match call-site classes.
