# Task 8 Report: Nav promotion — Selection over Bag

**Status:** DONE
**Commit:** c2549ee — `feat(nav): promote Your Selection, demote bag`
**Branch:** salon-rebrand

## Changes

### src/components/MobileBottomNav.tsx
- Added `import { useWishlist } from '../contexts/WishlistContext';` (named export — see Adaptations).
- Wired `const { wishlist } = useWishlist();`.
- Rewrote `navItems` per brief: `Wishlist` → `Selection` with `badge: wishlist.length`, positioned BEFORE `Bag` (renamed from `Cart`, keeps `badge: totalItems`). Home/Search/You unchanged.
- Badge rendering already gates on `item.badge !== undefined && item.badge > 0` — badges hide correctly at 0. TS inferred the optional `badge` via array-literal normalization; explicit type annotation not needed.

### src/components/Header.tsx (~icon cluster, lines 161-171)
- Added `useWishlist` import + `const { wishlist } = useWishlist(); const wishlistCount = wishlist.length;`.
- Wishlist `<Link>`: added `relative`, renamed `aria-label` → `"Your Selection"` (per brief snippet), added count badge.
- Badge span copied **verbatim** from the existing cart badge in the same cluster: `absolute -top-1 -right-1 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold shadow-sm`. RTL positioning therefore matches the bag badge exactly (same physical `-right-1` convention).
- DOM order in cluster: Style Quiz → **Selection (Heart)** → Account → Bag. Selection already preceded Bag; order preserved and verified.

## Verification

- `npm run lint` (tsc --noEmit): **PASS**, no errors.
- Self-review:
  - Badges show/hide at 0: ✅ (both sites use `> 0` guards)
  - DOM order Selection-before-Bag: ✅ desktop cluster + mobile nav array
  - No stray tags: ✅ (brief's `</h2>` typo NOT carried over; closes with `</Link>`)
  - Icon consistency: ✅ Heart kept at `w-6 h-6` with same `cn` home/not-home color logic
- No dev server/browser verification (per task instructions).

## Adaptations / Disclosures

1. **Named import:** Brief/context said `import useWishlist from '../contexts/WishlistContext'`, but `useWishlist` is exported as a named function (`export function useWishlist()`). Used `import { useWishlist }` — required for compilation.
2. **Badge markup source:** Brief Step 2 snippet used `-top-1.5 -right-1.5 rounded-full leading-none`; per context instruction, copied the EXISTING cart badge classes instead for guaranteed visual consistency.
3. **Hover polish:** Added `group/wishlist` + `group-hover/wishlist:scale-110` to mirror the bag link's existing hover-scale convention (bag uses `group/cart:scale-110`). Cosmetic only; easy to strip if unwanted.
