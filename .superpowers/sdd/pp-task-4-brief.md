### Task 4: Migrate customer pages to tokens + contrast lift

**Files (16):**
- Modify: `src/App.tsx`, `src/pages/AboutPage.tsx`, `AlterationsPage.tsx`, `AppointmentPage.tsx`, `Auth.tsx`, `Checkout.tsx`, `CollectionPage.tsx`, `ContactPage.tsx`, `GalleryPage.tsx`, `Index.tsx`, `ProductDetail.tsx`, `ProfilePage.tsx`, `SearchPage.tsx`, `StyleQuiz.tsx`, `WeddingChecklist.tsx`, `WishlistPage.tsx`

**Interfaces:**
- Consumes: `text-micro` / `text-caption` from Task 1.
- Produces: zero `text-[8..12px]` occurrences in src/pages/*.tsx (non-admin) and src/App.tsx.

- [ ] **Step 1: Size migration**

Apply the Global Constraints migration table to every occurrence in all 16 files. Size class only — no color changes in this step.

- [ ] **Step 2: Contrast lift (pages)**

Apply the Global Constraints contrast rules. All 15 page files render on light ivory/bone sections except:
- Dark sections to leave unchanged: any block inside `bg-onyx` / `bg-stone-900` / `bg-stone-800` wrappers, and text over dark hero imagery (e.g. Index.tsx hero overlays, WishlistPage empty-state if dark). Judge per element by its nearest background.
- `App.tsx` line ~129 (`text-ivory/30` on dark footer-adjacent surface) — leave.
- Lift `placeholder:text-stone-500` → `placeholder:text-stone-600` on all light-surface inputs (AppointmentPage, ContactPage, Auth, Checkout, StyleQuiz, WeddingChecklist).

- [ ] **Step 3: Verify**

Run (expect ZERO output lines):
```powershell
Get-ChildItem src/pages -File -Filter *.tsx | Select-String -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
Select-String -Path src/App.tsx -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
```
Run: `npm run lint`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/pages/AboutPage.tsx src/pages/AlterationsPage.tsx src/pages/AppointmentPage.tsx src/pages/Auth.tsx src/pages/Checkout.tsx src/pages/CollectionPage.tsx src/pages/ContactPage.tsx src/pages/GalleryPage.tsx src/pages/Index.tsx src/pages/ProductDetail.tsx src/pages/ProfilePage.tsx src/pages/SearchPage.tsx src/pages/StyleQuiz.tsx src/pages/WeddingChecklist.tsx src/pages/WishlistPage.tsx
git commit -m "a11y(pages): 11px type floor + AA contrast on light surfaces"
```

---


