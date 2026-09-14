# Task 5 Report — Final Verification Sweep (rental-calendar a11y)

Date: 2026-08-24 · Executor: Task-5 subagent (verification only; no fixes to app code, no commits)

## Command results

| Step | Command | Result | Exit code |
|---|---|---|---|
| 1 | `npm run lint` (tsc --noEmit) | Clean, no errors | 0 |
| 2 | `npm test` (vitest run) | **25 files / 118 tests passed** | 0 |
| 3 | Port-3001 stale-listener kill + `npx playwright test tests/rental-calendar.spec.ts` | **4/4 passed** (39.3s) | 0 |
| 4 | `node .superpowers/sdd/rc-task-5-browser-check.mjs` (self-managed dev server on :3001) | **11/11 assertions PASS** (final run) | 0 |
| — | Post-run port check | `PORT_3001_FREE` (dev server tree killed by script `finally`) | — |

## Step 4 browser check — full PASS/FAIL table

Dev server: spawned via `npm run dev`, polled until ready at http://localhost:3001. Locales seeded with
`page.addInitScript(l => localStorage.setItem('riman_lang', l), locale)` before `goto('/product/17')`.

| # | Assertion | Locale | Verdict | Evidence |
|---|---|---|---|---|
| 1 | exactly one `[role=grid] button[tabindex=0]` | en | PASS | count=1 |
| 2 | focused day cell has visible outline after keyboard focus | en | PASS | outlineStyle=solid (global `button:focus-visible` ring, src/index.css:52) |
| 3 | ArrowRight moves focus (data-date changes) | en | PASS | 2026-08-24 → 2026-08-25 |
| 4 | Enter selects → rental-summary visible w/ "Selected:" | en | PASS | "SELECTED: TUE 25 AUGUST 2026 · 7-DAY PREMIUM RENTAL" |
| 5 | shortcut button click keeps rental-summary visible | en | PASS | role/name /next available date/i |
| 6 | exactly one `[role=grid] button[tabindex=0]` | ar | PASS | count=1 |
| 7 | focused day cell has visible outline after keyboard focus | ar | PASS | outlineStyle=solid |
| 8 | ArrowRight moves focus (data-date changes) | ar | PASS | 2026-08-24 → 2026-08-23 (RTL inversion, per spec test 4) |
| 9 | Enter selects → rental-summary visible w/ "المحدد:" | ar | PASS | "المحدد: ثلاثاء 25 أغسطس 2026 · إيجار ٧ أيام متميز" |
| 10 | shortcut button click keeps rental-summary visible | ar | PASS | role/name /أقرب تاريخ متاح/ |
| 11 | zero console/page errors across both locales | both | PASS | clean (`console` type=error + `pageerror`) |

## Deviations / notes

1. **First script run was 9/10.** The [ar] "Enter selects" assertion failed because the script pressed
   ArrowRight then Enter; in RTL the arrows invert (documented spec behaviour), so focus landed on
   yesterday (past → `aria-disabled`) and Enter correctly declined to select. That is correct app
   behaviour, not an app defect. The throwaway script was amended to walk *forward* (ArrowLeft in ar)
   to the next selectable day before Enter, and to actually honour the summary-prefix match result
   case-insensitively (first version computed it but recorded unconditionally). Second run: 11/11.
2. **Focus-outline method:** ring is applied via global `button:focus-visible` CSS, so the outline is
   asserted on the keyboard-focused cell after real key input (`outlineStyle !== 'none'` → `solid`).
3. **Controller adaptations honoured:** legacy Playwright suite NOT run in full — bar met via
   rental-calendar spec 4/4 (step 3); no other specs executed, consistent with the documented 7
   pre-existing failures being out of scope.
4. **Residual human step (skipped per controller):** manual screen-reader spot check (NVDA/VoiceOver:
   cell focus announces date + availability; month paging announces month/year; shortcut announces
   jumped date). Cannot be automated here.
5. Nothing committed; `.superpowers/sdd/rc-task-5-browser-check.mjs` remains uncommitted as intended.

## Overall verdict

**DONE — all verification steps green.** Lint clean · vitest 118/118 · Playwright rental-calendar 4/4 ·
browser a11y sweep 11/11 (en+ar) · zero console/page errors.

## Final-review fixes

Commit: `46540b1` — fix(rental): announce fetch failure, ARIA columnheaders, cover selection-clearing
(2 files: src/components/AvailabilityCalendar.tsx, src/components/AvailabilityCalendar.test.tsx)

### What changed

1. **Finding 1 (announce fetch failure)** — `load()`'s `.catch` now also calls `setAnnouncement(t('calendar.fallbackNotice'))` alongside `setStale(true)`, so availability-load failures are announced via the polite live region.
2. **Finding 2 (ARIA columnheaders)** — deleted the separate weekday `div.grid.grid-cols-7.mb-2`; the weekday row is now the FIRST child of the `role="grid"` container as `<div role="row" className="contents">` with per-day `role="columnheader"` cells (kept all classes, added `bg-ivory`).
3. **Finding 3 (test)** — added `clears the selection and announces when a refetch reveals it booked`: mock override placed BEFORE `renderCalendar({ productId: 'p1', selectedDate: d })` (file's existing per-test convention) so the mount fetch itself resolves WITH day+10 booked; asserts `onDateSelect(null)` and live region containing "booked".

Note: spec predicted "now 11" tests but baseline file had 9 tests; after adding 1 the file has 10, all passing.

### Verification results

| Step | Command | Result | Exit |
|---|---|---|---|
| 1 | `npm run lint` | Clean (tsc --noEmit) | 0 |
| 2 | `npm test -- src/components/AvailabilityCalendar.test.tsx` | 1 file / **10 passed** | 0 |
| 3 | `npm test` | **25 files / 119 tests passed** (56s) | 0 |
| 4a | Kill stale :3001 listener | `PORT_3001_FREE` | — |
| 4b | `npx playwright test tests/rental-calendar.spec.ts` | **4/4 passed** (35.6s), header move broke no selectors | 0 |
