# Task 2 Report: Arabic default language + locale-aware dates

**Status:** DONE
**Branch:** salon-rebrand
**Commit:** `74955a9` — feat(i18n): Arabic as default language, locale-aware appointment dates

## Implementation Summary

1. **Fallback flip** (`src/contexts/LanguageContext.tsx:1415`): first-visit fallback changed from `'en'` to `'ar'`. The localStorage read (`riman_lang`) is untouched, so returning visitors keep their stored preference. The language-toggle behavior itself was not modified.
2. **Locale-aware dates** (`src/pages/AppointmentPage.tsx`):
   - Line 37: destructured `{ t, isRtl }` from `useLanguage()` (verified `isRtl` is exposed by the hook at LanguageContext.tsx:1423; Checkout.tsx already uses this exact pattern).
   - Line 109 (success screen): `toLocaleDateString('en-US', ...)` → `toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', ...)` per the brief's verbatim pattern.
   - Line 275 (review step): grep found one additional `'en-US'` occurrence; applied the identical replacement as instructed by Step 2.

## Files Changed

| File | Change |
|---|---|
| `src/contexts/LanguageContext.tsx` | 1 line: fallback `'en'` → `'ar'` |
| `src/pages/AppointmentPage.tsx` | 3 lines: destructure `isRtl`; two `'en-US'` → locale-aware ternary |

Total: 4 insertions, 4 deletions.

## Verification Output

```
> riman-fashion@0.0.0 lint
> tsc --noEmit
```
Exit code 0, no errors. Grep confirms zero remaining `'en-US'` in AppointmentPage.tsx.

## Commit

Staged exactly the two files from the brief's Step 4 command. Unrelated dirty files (`.superpowers/sdd/progress.md`, task-1 artifacts) were left out of the commit.

## Self-Review Findings

- **Completeness:** All 4 brief steps executed exactly as written.
- **No overbuild:** No toggle logic changes, no test-file edits, no refactors.
- **Scope note (not a defect):** `'en-US'` also exists in `src/pages/admin/AdminDashboard.tsx:255` and `src/pages/ProductDetail.tsx:706`. The brief scopes this task to AppointmentPage.tsx only, so these were intentionally left untouched.

## Concerns

None blocking. Two informational notes:
1. The AdminDashboard/ProductDetail `'en-US'` dates remain English-only; flagging in case a later task wants the same locale pattern there.
2. Playwright tests assuming English defaults will now see Arabic on fresh contexts — expected per plan; repair deferred to the designated later task.
