# Task 11 Report — Playwright regression spec + suite repair

**Status:** DONE
**Commit:** `0e0ea58` — `test(e2e): selection-to-viewing conversion flow + RTL default`
**Branch:** salon-rebrand

## 1. Inventory (before)

Config: two configs exist (`playwright.config.ts` + `.js`); Playwright resolves `.ts` first. Effective settings: testDir `./tests`, baseURL http://localhost:3001, webServer `npm run dev` (`reuseExistingServer: true`), retries 1, chromium only.

| Spec file | Tests |
|---|---|
| tests/click-verification.spec.js | 58 |
| tests/admin-smoke.spec.ts | 10 |
| tests/admin-products.spec.ts | 1 |
| tests/header-logo-clearance.spec.ts | 1 |
| **Total baseline** | **70** |

No `tests/helpers.js`; `waitForApp` lives inline in click-verification (new spec carries its own copy per brief).

## 2. New spec

Created `tests/selection-to-viewing.spec.js` from the brief's verbatim draft. **3 deviations from the draft** (all selector-vs-reality adjustments; contract assertions preserved):

1. **PDP reserve test — step-2 navigation added.** The notes `<textarea>` mounts only on the appointment page's *scheduling* step (src/pages/AppointmentPage.tsx:271); at step 1 it doesn't exist in DOM, so the verbatim `toHaveValue(/interested in:/i)` could never observe it. The spec now fills name/email/phone via hardcoded-English placeholders and clicks "Continue to Scheduling" / "متابعة إلى تحديد الموعد", then asserts the prefilled value.
2. **Wishlist heart selector tightened.** Draft regex `/add to wishlist|أضف/i` would match the Arabic secondary CTA **"أضف للمجموعة"**, which precedes the heart button in DOM order → wrong click target under the Arabic default. Replaced with exact `button[aria-label="Add to wishlist"]` (aria-label is hardcoded English in src/pages/ProductDetail.tsx:405, language-agnostic).
3. **`.first()` on the request-viewing CTA.** WishlistPage renders two identical request buttons (top + bottom, src/pages/WishlistPage.tsx:40/102); strict mode rejects the ambiguous locator.

## 3. Repairs to existing suites (minimal, 2 spots)

First full-suite run surfaced exactly the two predicted feature-branch breakages (both failed on attempt + retry #1, evidence below), zero pre-existing/unrelated failures:

| Failing test | Root cause | Repair |
|---|---|---|
| Header Icon Links › icon "Wishlist" navigates to /wishlist | `a[aria-label="Wishlist"]` gone — header icon rebranded to aria-label `"Your Selection"` (commit cf638ab) | Match by href instead: set `ariaLabel: null` so the existing fallback uses `a[href="/wishlist"]` |
| Product Detail Page › Add to cart / Book rental button exists | English-only `has-text("Add to Collection"/"Book Rental")` never matches Arabic default ("احجز الإيجار"/"أضف للمجموعة") | Bilingual role-based regex `/book rental\|add to collection\|احجز الإيجار\|أضف للمجموعة/i` on the bag-secondary button, exactly as brief Step 3 specified |

Diff: `tests/click-verification.spec.js` — 4 insertions, 2 deletions (two locators + two comments). No suite rewrites.

## 4. Verification

- **New spec:** `npx playwright test tests/selection-to-viewing.spec.js` → **3 passed** (48.5s)
- **Full suite after repairs:** `npx playwright test` → **73 passed (6.6m)**, 0 failed (70 baseline + 3 new)
- No PRE-EXISTING failures to disclose — both failures seen mid-task were caused by this branch's UI changes and were repaired.

## 5. Environment notes

- Found this project's Vite already listening on :3001 (PID 12848, leftover from a prior session) — verified identity via CommandLine before reusing (config permits reuse). Killed after final run; port released.
- Suite depends on live Supabase data (products list, admin auth) — all available during runs.

## 6. Self-review

- No new hardcoded waits (only the suite-conventional `waitForApp` mount wait + auto-waiting locators).
- Selectors resilient: bilingual regexes, href/aria-label anchors that don't depend on active language.
- Repairs minimal and scoped to the two genuinely broken selectors.
- Only the two test files committed; all `.superpowers/*` scratch files left unstaged.
