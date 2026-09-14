### Task 5: Migrate admin pages + remove dead RTL overrides

**Files (11):**
- Modify: `src/pages/admin/AdminAppointments.tsx`, `AdminCalendar.tsx`, `AdminContent.tsx`, `AdminDashboard.tsx`, `AdminGallery.tsx`, `AdminLayout.tsx`, `AdminOrders.tsx`, `AdminPlaceholder.tsx`, `AdminProducts.tsx`, `AdminSettings.tsx`
- Modify: `src/index.css` (dead RTL overrides, lines 99-104)

**Interfaces:**
- Consumes: `text-micro` / `text-caption` from Task 1; requires Tasks 3-4 complete (so no `text-[8..12px]` classes remain anywhere).
- Produces: zero `text-[8..12px]` occurrences in the entire src/ tree.

- [ ] **Step 1: Size migration (admin)**

Apply the Global Constraints migration table to every occurrence in the 10 admin files. Admin UI is light-surface throughout — apply the contrast rules in the same pass (`text-stone-400/500` → `text-stone-600` on informative text; leave any sidebar/dark-header stone-* that sits on dark backgrounds, e.g. AdminLayout sidebar if dark — judge per element).

- [ ] **Step 2: Confirm the old pixel classes are extinct**

Run (expect ZERO output lines):
```powershell
Get-ChildItem src -Recurse -Include *.tsx,*.ts | Select-String -Pattern 'text-\[(8|9|10|11|12)px\]' | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
```
If ANY match remains, migrate it now before proceeding.

- [ ] **Step 3: Delete the dead RTL pixel overrides**

In `src/index.css` delete these five rules (lines 99-104, now unreachable):
```css
  /* Pixel-based sizes: enlarge by ~25% */
  [dir="rtl"] .text-\[8px\] { font-size: 11px; }
  [dir="rtl"] .text-\[9px\] { font-size: 12px; }
  [dir="rtl"] .text-\[10px\] { font-size: 13px; }
  [dir="rtl"] .text-\[11px\] { font-size: 14px; }
  [dir="rtl"] .text-\[12px\] { font-size: 15px; }
```
Keep the `[dir="rtl"] .text-micro` / `.text-caption` rules added in Task 1.

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/pages/admin src/index.css
git commit -m "a11y(admin): 11px type floor + AA contrast; drop dead RTL pixel overrides"
```

---


