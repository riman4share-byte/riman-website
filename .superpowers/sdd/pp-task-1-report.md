# Task 1 Report: Typography tokens

**Status:** DONE
**Commit:** `39a7927` — feat(theme): add text-micro/text-caption type tokens with RTL scaling
**Branch:** salon-rebrand

## Changes (src/index.css only)

1. **@theme tokens** — added immediately after `--font-jewelry` (line 11):
   ```css
   --text-micro: 11px;
   --text-caption: 12px;
   ```
2. **RTL scale-up rules** — added immediately after the existing pixel-override block (after `[dir="rtl"] .text-\[12px\]`):
   ```css
   [dir="rtl"] .text-micro { font-size: 14px; }
   [dir="rtl"] .text-caption { font-size: 15px; }
   ```

Old `[dir="rtl"] .text-\[8px\]`-style overrides left intact per brief (Tasks 3-5 still reference them; Task 5 removes).

## Verification

- `npm run lint` (tsc --noEmit): clean, no errors.
- `npm run build` (vite build): succeeded in ~1m 2s; CSS bundle emitted (111.12 kB). Pre-existing warnings only (chunk size, dynamic/static import mix in products.ts) — unrelated to this change.

## Self-review

- Tokens inside `@theme` block: yes.
- RTL rules placed after existing pixel-override block, before tracking overrides: yes.
- Nothing else touched: diff is exactly 5 added lines in src/index.css.
- Only src/index.css staged; .superpowers/* scratch files left unstaged.

## Concerns

None.
