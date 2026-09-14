### Task 5: Your Selection page (wishlist rename + request CTA)

**Files:**
- Modify: `src/pages/WishlistPage.tsx`
- Modify: `src/contexts/LanguageContext.tsx`

**Interfaces:**
- Consumes: route contract from Task 4 (`location.state.gowns`).
- Produces keys: `selection.title`, `selection.subtitle`, `selection.empty`, `selection.empty_desc`, `selection.explore`, `selection.view`, `selection.add_to_bag`, `selection.request_viewing`, `selection.count`

- [ ] **Step 1: Translation keys**

English (replace the old `wishlist.*` values' usage — keep old keys, add new):

```ts
    // Selection
    'selection.title': 'Your Selection',
    'selection.subtitle': 'Pieces kept aside for your private viewing',
    'selection.empty': 'Your selection is empty',
    'selection.empty_desc': 'Save the silhouettes that catch your eye — we will have them ready for your visit.',
    'selection.explore': 'Explore Atelier',
    'selection.view': 'View',
    'selection.add_to_bag': 'Add to Bag',
    'selection.request_viewing': 'Request Private Viewing',
    'selection.count': 'pieces selected',
```

Arabic:

```ts
    // Selection
    'selection.title': 'مختاراتك',
    'selection.subtitle': 'قطع انتظرناها لمشاهدتك الخاصة',
    'selection.empty': 'مختاراتك فارغة',
    'selection.empty_desc': 'احفظي التصاميم التي أسرت قلبك — وستكون جاهزة عند زيارتك.',
    'selection.explore': 'استكشفي الدار',
    'selection.view': 'عرض',
    'selection.add_to_bag': 'أضف للحقيبة',
    'selection.request_viewing': 'طلب مشاهدة خاصة',
    'selection.count': 'قطعة مختارة',
```

- [ ] **Step 2: Page copy swap + request CTA**

In `WishlistPage.tsx`: replace every `t('wishlist.…')` with the matching `t('selection.…')` (title/subtitle/empty/empty_desc/explore/view/add_to_bag). Under the header subtitle add the count line: `{wishlist.length} {t('selection.count')}` styled like the subtitle. Above the grid (and again below it), when `wishlist.length > 0` render:

```tsx
<button
  onClick={() => navigate('/appointment', {
    state: {
      gowns: wishlist.map(p => ({ id: p.id, name: p.name, intent: (p.productType === 'rent' ? 'rent' : 'sale') as 'rent' | 'sale' })),
    },
  })}
  className="btn-luxury px-12 w-full sm:w-auto"
>
  {t('selection.request_viewing')}
</button>
```

Add `import { useNavigate } from 'react-router-dom';` and `const navigate = useNavigate();`. Check the actual field name for product type on the `Product` interface in `src/types.ts` (`product_type` vs `productType`) and map accordingly — the mapping must compile.

- [ ] **Step 3: Typecheck + manual verify**

Run: `npm run lint`, then save two gowns and open `/wishlist`.
Expected: new title/copy, count line, button navigates to prefilled appointment listing both gowns.

- [ ] **Step 4: Commit**

```bash
git add src/pages/WishlistPage.tsx src/contexts/LanguageContext.tsx
git commit -m "feat(selection): Your Selection page with request-viewing CTA"
```

---


