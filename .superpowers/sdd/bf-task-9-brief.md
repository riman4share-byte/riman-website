### Task 9: Admin — show requested gowns on booking cards

**Files:**
- Modify: `src/pages/admin/AdminAppointments.tsx:93-125` (card body)

**Interfaces:**
- Consumes: `Appointment.interested_gowns?: GownRef[] | null` (Task 1). Verify the admin fetch selects `*` (or add the column to its select list).

- [ ] **Step 1: Render gown list**

After the phone row (line 114) inside the card metadata block add:

```tsx
{(appt.interested_gowns?.length ?? 0) > 0 && (
  <span className="flex items-start gap-1 col-span-full">
    <Heart className="w-3 h-3 mt-0.5 shrink-0" />
    <span className="italic">{appt.interested_gowns!.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`).join(' · ')}</span>
  </span>
)}
```

Add `Heart` to the lucide-react import. If the grid parent constrains columns, `col-span-full` keeps it on its own row.

- [ ] **Step 2: Typecheck + manual verify**

Run: `npm run lint`. Open `/admin` → Appointments with a booking made in Task 4's manual test.
Expected: gown names listed on the card.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/AdminAppointments.tsx
git commit -m "feat(admin): display requested gowns on appointment cards"
```

---


