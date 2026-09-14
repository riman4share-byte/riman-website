# Task 1 Report: i18n keys + t() fallback chain

## Status: DONE

## What Changed

File touched (only): `src/contexts/LanguageContext.tsx`

1. **Step 1 — Fallback hardening** (line ~1522):
   - `return translations[language][key] || key;` → `return translations[language][key] || translations.en[key] || key;`
   - Missing-in-current-language keys now fall back to the EN block before returning the raw key.

2. **Step 2 — EN keys block** inserted directly after the EN `// Calendar` block (after `'calendar.retry': 'Retry',`, before the existing `// Checkout` block). 8 sub-groups with `// Section` comments preserved verbatim from brief.

3. **Step 3 — AR keys block** inserted directly after the AR `// Calendar` block (after `'calendar.retry': 'إعادة المحاولة',`, before the AR `// Checkout` block). Mirror structure, Arabic values byte-exact from brief.

Anchors matched the brief exactly (EN `// Calendar` at line 344, AR `// Calendar` at line 1090, t() return at line 1522 pre-edit).

## Verification

### Key-count / set-equality check (PowerShell)

```
EN count: 46  AR count: 46
EN dups: none
AR dups: none
Set diff: IDENTICAL
UTF8 roundtrip OK: True
```

Note: task prompt said "45 new keys"; the brief itself contains **46 key lines per block** (4 checkout + 4 payment + 14 checklist + 3 timeline + 5 newsletter + 4 cookies + 6 errors/common + 6 toasts/fallbacks = 46). Insertion is byte-exact vs the brief; both blocks identical key sets, so no mismatch.

### Lint

```
npm run lint  →  tsc --noEmit
exit 0, no errors
```

### Diff shape

```
src/contexts/LanguageContext.tsx | 125 insertions(+), 1 deletion(-)
```

(2 × 62 block lines + 1 modified fallback line.)

## Commit

- SHA: `927956f`
- Subject: `i18n: arabic-page residue keys + en-fallback chain`
- Branch: `salon-rebrand`
- Staged path: only `src/contexts/LanguageContext.tsx`. Not pushed.
- Note: working tree had many other pre-existing dirty files; none staged or touched.

## Concerns

None blocking. Two informational notes:
- The repo has extensive uncommitted changes from other tasks in flight; my commit contains only LanguageContext.tsx as required.
- Pre-existing duplicate-key check across whole file was not re-run beyond the new block ranges (new keys did not exist anywhere in file prior to insert — verified via Select-String count = 0 before editing).
