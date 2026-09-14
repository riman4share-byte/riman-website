### Task 3: Migrate components to tokens + contrast lift

**Files (17):**
- Modify: `src/components/AvailabilityCalendar.tsx`, `Footer.tsx`, `GalleryFilters.tsx`, `GalleryGrid.tsx`, `GalleryLightbox.tsx`, `GlobalFeatures.tsx`, `Header.tsx`, `ImmersiveUI.tsx`, `InstagramSection.tsx`, `MobileBottomNav.tsx`, `ProductCard.tsx`, `SizeGuide.tsx`, `ThreeDViewer.tsx`, `ToastContainer.tsx`, `luxury/HorizontalLookbook.tsx`, `luxury/Marquee.tsx`, `luxury/StatCounter.tsx`

**Interfaces:**
- Consumes: `text-micro` / `text-caption` utilities from Task 1.
- Produces: zero `text-[8..12px]` occurrences in src/components/**.

- [ ] **Step 1: Size migration**

In each of the 17 files, apply the Global Constraints migration table to every occurrence:
`text-[8px]`→`text-micro`, `text-[9px]`→`text-micro`, `text-[10px]`→`text-micro`, `text-[11px]`→`text-micro`, `text-[12px]`→`text-caption`.

Change ONLY the size class — leave tracking, casing, weight, and color classes untouched in this step.

- [ ] **Step 2: Badge container fixes**

Count badges must fit 11px digits. In `src/components/Header.tsx`, both badge spans (currently `absolute -top-1 -right-1 bg-gold text-white text-micro w-4 h-4 flex items-center justify-center font-bold shadow-sm` after Step 1) become:
```tsx
                <span className="absolute -top-1 -right-1 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center font-bold shadow-sm rounded-full leading-none">
```
(only the `w-4` → `min-w-4 px-0.5 rounded-full leading-none` portion changes; apply to BOTH the Selection and Bag badges).

In `src/components/MobileBottomNav.tsx`, the badge span becomes:
```tsx
              <span className="absolute top-2 right-4 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full leading-none font-bold">
```

`ProductCard.tsx` badges are pills (`px-4 py-1.5`), not circles — no container change needed there.

- [ ] **Step 3: Contrast lift (components)**

Apply the Global Constraints contrast rules in the same 17 files. Surface guide:
- LIGHT-surface components (render on ivory/bone): AvailabilityCalendar, GalleryFilters, GlobalFeatures, Header (its dropdown panels are bg-white), ProductCard (info block), SizeGuide, ThreeDViewer, ToastContainer.
- DARK-surface components (leave stone-* unchanged): Footer (bg-onyx), GalleryGrid/GalleryLightbox/ImmersiveUI/HorizontalLookbook/StatCounter/Marquee (text sits on images or dark overlays — judge per element: `text-white`, `text-ivory`, `text-gold/60` on imagery stay; any `text-stone-400/500` that renders on a LIGHT background still lifts).
- InstagramSection: mixed — lift only stone-* text that sits on light surfaces.

Also lift `placeholder:text-stone-500` → `placeholder:text-stone-600` wherever the input sits on a light surface (Footer's newsletter input is on bg-onyx → leave it).

- [ ] **Step 4: Verify**

Run (expect ZERO output lines):
```powershell
Get-ChildItem src/components -Recurse -Include *.tsx | Select-String -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
```
Run: `npm run lint`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "a11y(components): 11px type floor + AA contrast on light surfaces"
```

---


