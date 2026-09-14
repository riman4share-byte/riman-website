# Task 5 Report: Your Selection page (wishlist rename + request CTA)

**Status:** DONE
**Commit:** cf638ab `feat(selection): Your Selection page with request-viewing CTA`
**Branch:** salon-rebrand

## Changes

### src/contexts/LanguageContext.tsx (+22 lines)
- Added all 9 `selection.*` keys in the English block (after `wishlist.add_to_bag`) with exact verbatim values from the brief: title, subtitle, empty, empty_desc, explore, view, add_to_bag, request_viewing, count.
- Added the same 9 keys in the Arabic block with exact verbatim values.
- Old `wishlist.*` keys kept in both languages (per brief), so `ProfilePage.tsx`'s existing `t('wishlist.title')` usage still compiles.

### src/pages/WishlistPage.tsx (+44/-8)
- Import: extended `react-router-dom` import to `{ Link, useNavigate }`; added `const navigate = useNavigate();`.
- Swapped every translation key: `wishlist.title/subtitle/empty/empty_desc/explore/view/add_to_bag` → matching `selection.*`. No `t('wishlist.…')` usages remain in the page.
- Count line added under the header subtitle: `{wishlist.length} {t('selection.count')}` styled identically to the subtitle (`font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic`).
- "Request Private Viewing" button rendered twice when `wishlist.length > 0`: above the grid (wrapped in `flex justify-center mb-12`) and below it (`flex justify-center mt-12`). Each navigates to `/appointment` with router state `{ gowns: wishlist.map(...) }`, mapping `id`, `name`, and `intent` per the brief's exact snippet.
- Empty state untouched structurally; copy now uses `selection.empty/empty_desc/explore`.

## Key verification

- **Product type field:** Confirmed camelCase `productType: ProductType` on the `Product` interface (src/types.ts:8); values are `'sale' | 'rent' | 'both'`. The brief's mapping `p.productType === 'rent' ? 'rent' : 'sale'` compiles and classifies correctly ('both' → 'sale', per brief).
- **Route contract:** Payload shape matches Task 4's GownRef (`{ id, name, intent }`) consumed by `/appointment` from `location.state.gowns`.

## Verification

- `npm run lint` (tsc --noEmit): PASS.
- Manual browser check of `/wishlist` deferred per task instructions (later tasks own browser verification).

## Self-review checklist

- [x] All wishlist.* usages swapped in WishlistPage.tsx
- [x] Count line styled like subtitle
- [x] Both buttons render when list non-empty (above + below grid)
- [x] Empty state intact
- [x] Only the two task files staged; `.superpowers/sdd/progress.md` left unstaged

## Notes / deviations

None material. The only additions beyond literal brief JSX are centering wrappers (`flex justify-center mb-12` / `mt-12`) around each CTA button for layout consistency with the centered page header.
