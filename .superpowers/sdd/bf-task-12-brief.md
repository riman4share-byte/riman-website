### Task 12: Ship — verify, deploy, publish

**Files:** none created; git + Netlify only.

- [ ] **Step 1: Lint + production build**

Run: `npm run lint && npm run build`
Expected: clean; note the emitted `index-*.js` hash.

- [ ] **Step 2: Deploy**

Run: `& "C:\Users\KAIS\AppData\Local\Temp\opencode\netlify-rest-deploy.ps1"`
Expected: `DEPLOY READY: … -> https://riman-fashion-v2.netlify.app`

- [ ] **Step 3: Verify live bundle**

```powershell
$html = Invoke-WebRequest -Uri "https://riman-fashion-v2.netlify.app/?cb=$(Get-Random)" -UseBasicParsing
if ($html.Content -match 'index-<HASH>\.js') { 'LIVE OK' } else { 'STALE' }
```

Expected: `LIVE OK` (replace `<HASH>` with the hash from Step 1).

- [ ] **Step 4: Apply DB migration**

Follow `supabase/DEPLOY_RUNBOOK.md` to run `20260823100000_appointments_interested_gowns.sql` against project `vbuavhnpemnfsuguglqn` (SQL editor or CLI). Verify column exists in Table Editor → appointments.

- [ ] **Step 5: Push**

```bash
git push origin salon-rebrand:main
```

Expected: push accepted.

---

## Self-Review Notes

- Spec coverage: booking-first CTAs (T4), Selection bridge (T5), intake→calendar+email+WhatsApp (T1, T6, T7, T9), From-pricing (T3), Arabic default + leak fixes (T2, T10), nav promotion (T8), tests/rollout (T11, T12). Journal rebuild and typography ramp remain out of scope per spec.
- Deviation documented: RequestViewingPanel implemented as prefilled `/appointment` navigation (Task 4 note) instead of a new modal component — avoids duplicating the validated wizard form.
- Type consistency: `GownRef` defined once (Task 1), consumed identically in Tasks 4/5/6/9; route-state contract `{ gowns: GownRef[] }` shared by Tasks 4/5/11.

