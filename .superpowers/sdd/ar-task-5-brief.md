### Task 5: Verification sweep

**Files:** none created except throwaway sweep script `.superpowers/sdd/ar-sweep.mjs` (not committed).

- [ ] **Step 1: Static + suites**

`npm run lint` exit 0; `npm test` all green; `npx playwright test tests/rental-calendar.spec.ts` 4/4 (regression guard).

- [ ] **Step 2: Arabic no-English browser sweep**

Write `.superpowers/sdd/ar-sweep.mjs` (playwright library, chromium): start dev server (spawn `npm run dev`, poll port 3001, kill after). For locale ar via `addInitScript(localStorage.setItem('riman_lang','ar'))` visit `/payment/cancel`, `/timeline`, `/wedding-checklist`, `/` ; collect `document.body.innerText`; assert every visible LINE matching `/^[A-Za-z][A-Za-z0-9 ,.&'’—-]{8,}$/` belongs to an ALLOWLIST of brand marks: Riman, Atelier Riman, Riman Atelier, Maison de Couture, Stripe. Print PASS/FAIL per page + offending lines. Then repeat `/checkout` reachability only IF a cart can be seeded via localStorage without backend (inspect CartContext persistence key; if seeding is non-trivial, SKIP checkout in sweep and cover the trust box via the existing Checkout component tests/manual note — record which path taken).

- [ ] **Step 3: Report + fix loop**

Full report to `.superpowers/sdd/ar-task-5-report.md`. Any failure → fix in owning file, re-run covering suite, single commit `fix(i18n): address sweep findings`.

---

