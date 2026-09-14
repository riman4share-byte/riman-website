### Task 8: Nav promotion — Selection over Bag

**Files:**
- Modify: `src/components/MobileBottomNav.tsx`
- Modify: `src/components/Header.tsx:155-175` (icon cluster)

**Interfaces:**
- Consumes: `useWishlist().wishlist.length`, `useCart().totalItems`.

- [ ] **Step 1: MobileBottomNav reorder + badges**

Rewrite `navItems` (keep Home/Search/You entries unchanged otherwise):

```ts
  const { totalItems } = useCart();
  const { wishlist } = useWishlist(); // add import from '../contexts/WishlistContext'
  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Selection', path: '/wishlist', icon: Heart, badge: wishlist.length },
    { label: 'Bag', path: '/checkout', icon: ShoppingBag, badge: totalItems },
    { label: 'You', path: '/profile', icon: User },
  ];
```

Badge rendering already handles any item with a numeric `badge`; the current code types items loosely enough — if TypeScript complains about `badge` missing on some entries, give the array an explicit type: `{ label: string; path: string; icon: typeof Home; badge?: number }[]`.

- [ ] **Step 2: Desktop header**

In `Header.tsx` around line 161 the wishlist link exists. Give it a count badge and place it BEFORE the bag link in DOM order (both inside the icon cluster):

```tsx
<Link to="/wishlist" className="hidden lg:block relative hover:text-gold transition-colors" aria-label="Your Selection">
  <Heart className="w-[18px] h-[18px]" />
  {wishlistCount > 0 && (
    <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none font-bold">{wishlistCount}</span>
  </h2>
  </Link>
```

(Copy the badge span markup exactly from the existing cart-icon badge in the same cluster; remove the stray `</h2>` typo if introduced — the closing tag must be `</Link>`.) Wire `const { wishlist } = useWishlist();` and `const wishlistCount = wishlist.length;`. Match whatever icon component the current link uses.

- [ ] **Step 3: Typecheck + manual verify**

Run: `npm run lint`, save a gown, resize to mobile width.
Expected: Selection tab shows count badge; header shows heart-with-badge left of bag.

- [ ] **Step 4: Commit**

```bash
git add src/components/MobileBottomNav.tsx src/components/Header.tsx
git commit -m "feat(nav): promote Your Selection, demote bag"
```

---


