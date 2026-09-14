### Task 5: Final verification sweep

**Files:** none created; fixes (if any) land in the files touched by Tasks 1–4.

**Interfaces:**
- Consumes: everything shipped in Tasks 1–4.
- Produces: evidence the spec's Success criteria hold.

- [ ] **Step 1: Static checks**

Run: `npm run lint`
Expected: exit 0.

- [ ] **Step 2: Unit/component suite**

Run: `npm test`
Expected: all green.

- [ ] **Step 3: Live manual pass (browser)**

With `npm run dev` running:
1. Open `http://localhost:3001/product/17`, tab from "Add to Bag"-adjacent controls into the calendar — exactly ONE day cell receives the terracotta focus ring.
2. Keyboard-only: arrows/Home/End/PageUp/PageDown navigate; Enter books; Escape-path not required (spec has no dialog).
3. Click "Next available date" — lands on the earliest white cell, summary line reads `Selected: … · 7-day rental`.
4. Switch language to Arabic (header toggle) — repeat step 1; confirm ←/→ feel correct against the mirrored grid and no layout breaks.
5. DevTools console: zero errors on both locales.
6. Screen-reader spot check (NVDA/VoiceOver): cell focus announces date + availability word; month paging announces month/year; shortcut announces the jumped date.

- [ ] **Step 4: Fix-and-commit loop (only if needed)**

Any failure above → fix in the owning task's files, re-run that task's tests, then:

```bash
git add -A src tests
git commit -m "fix(rental): address verification findings from final sweep"
```

Skip this step entirely when Steps 1–3 are clean.

---

## Plan Self-Review Notes

- **Spec coverage:** Goals 1–5 map to Tasks 3 (keyboard/SR/shortcut), 3 (retry disclosure), 2+3 (polish/i18n), 1 (helpers), 4+5 (verification). Non-goals respected (no cart/checkout/admin changes; `ProductDetail.tsx` touched only to de-duplicate the selected-date echo, permitted as light polish).
- **Type consistency:** `isoKey`/`buildMonthMatrix`/`isUnavailable`/`nextAvailableDate`/`clampToMonth` signatures identical between Task 1 definition and Task 3 usage; `onDateSelect` nullable widening stated once (Global Constraints) and used consistently.
- **Known fragility flagged in-plan:** RTL test ordering (localStorage set before render), Playwright port collision, Supabase-dependent booked-day counts avoided in e2e (uses past-day instead of booked-day assertions where availability data isn't seeded).
