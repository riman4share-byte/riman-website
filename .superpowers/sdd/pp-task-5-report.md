# Task 5 Report: Migrate admin pages + remove dead RTL overrides

**Status:** DONE
**Commit:** `f80b93e` — `a11y(admin): 11px type floor + AA contrast; drop dead RTL pixel overrides`
**Branch:** salon-rebrand
**Files changed:** 11 (10 admin pages + src/index.css), 152 insertions / 158 deletions

## Step 1: Size migration (admin)

Applied the migration table to every occurrence in all 10 admin files:
`text-[8px]`→`text-micro`, `text-[9px]`→`text-micro`, `text-[10px]`→`text-micro`, `text-[11px]`→`text-micro`, `text-[12px]`→`text-caption` (no 12px occurrences existed in admin).

Per-file occurrence counts migrated: AdminAppointments 11, AdminCalendar 13, AdminContent 7, AdminDashboard 14, AdminGallery 3, AdminLayout 4, AdminOrders 45, AdminPlaceholder 1, AdminProducts 30, AdminSettings 16 (minified single-line file — handled via exact string replacement).

Uppercase, tracking, casing, weight, and font-family classes left untouched throughout.

## Step 1 (cont.): Contrast lift

Admin UI is light-surface (bg-ivory/bg-pearl/bg-white/bg-stone-50) throughout. Applied:
- `text-stone-400` → `text-stone-600` on informative text (subtitles, table headers, field labels, modal labels, status/loading/empty messages, code IDs, filter buttons, day numbers, upload placeholder).
- `text-stone-500` → `text-stone-600` on informative text (category/type spans, tag chips, booking meta, delete-confirm copy, "total bookings" line).
- `text-stone-300` → `text-stone-500` on informative text (AdminPlaceholder title, AdminProducts "No tags").

**Deliberately left unchanged (dark surfaces / non-text / brand):**
- AdminLayout sidebar (`bg-onyx`): line 29 `text-stone-500` "Boutique Management", nav `text-stone-400`, Sign Out `text-stone-400`, mobile close button `text-stone-400` — all sit on dark onyx.
- AdminProducts modal footer Cancel button (`bg-onyx` strip) keeps `text-stone-400`.
- AdminCalendar "Capacity Insight" panel (`bg-stone-900 text-white`): gold heading and `text-stone-400` insight copy kept.
- All `text-gold`, `text-white`, `text-stone-800`, status colors (emerald/amber/rose/etc.) untouched.
- Icon-only affordances (search icons, edit/delete icon buttons, close X, grip handle, empty-state decorative icons) kept — not informative text.
- Borders (`border-stone-*`) untouched.

## Step 2: Extinction check

```powershell
Get-ChildItem src -Recurse -Include *.tsx,*.ts | Select-String -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
```
Result: **ZERO matches** across all of src/ (admin was the last holdout).

## Step 3: Dead RTL overrides deleted

Removed exactly the five `[dir="rtl"] .text-\[Npx\]` rules plus their `/* Pixel-based sizes: enlarge by ~25% */` comment from src/index.css (6 lines). The `[dir="rtl"] .text-micro { font-size: 14px; }` and `[dir="rtl"] .text-caption { font-size: 15px; }` rules from Task 1 are intact and now carry the RTL scaling.

## Step 4: Verification

`npm run lint && npm run build` — **clean**. tsc --noEmit passed; vite build succeeded (55s, 3703 modules). Only pre-existing warnings (dynamic-import chunk note, chunk-size advisory) — unrelated to this change.

## Step 5: Commit

Staged only `src/pages/admin` + `src/index.css`; scratch files under .superpowers/sdd left unstaged.
`f80b93e a11y(admin): 11px type floor + AA contrast; drop dead RTL pixel overrides`

## Self-review

- [x] No dark-sidebar/dark-panel stone-* lifted by mistake (AdminLayout sidebar, AdminProducts onyx footer, AdminCalendar stone-900 panel all verified in diff).
- [x] RTL pixel overrides deleted exactly (5 rules + 1 comment line); micro/caption RTL rules intact.
- [x] Gold and text-white/* unchanged.
- [x] Tracking/uppercase/casing/font-family untouched.
- [x] Extinction check zero across src/.

## Concerns

None.
