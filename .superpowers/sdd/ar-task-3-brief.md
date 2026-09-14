### Task 3: Whole-page wiring (PaymentCancel, WeddingChecklist, WeddingTimeline)

**Files:**
- Modify: `src/pages/PaymentCancel.tsx`
- Modify: `src/pages/WeddingChecklist.tsx`
- Modify: `src/pages/WeddingTimeline.tsx`

**Interfaces:**
- Consumes: Task 1 keys; `useLanguage()` from `../contexts/LanguageContext`.

- [ ] **Step 1: PaymentCancel.tsx**

Add `import { useLanguage } from '../contexts/LanguageContext';` and inside the component `const { t } = useLanguage();`. Replace:
- `<h1 ...>Payment Cancelled</h1>` → `{t('payment.cancel.title')}`
- `<p ...>No charges were made. Your order has not been placed.</p>` → `{t('payment.cancel.body')}`
- `Return to Checkout` link text → `{t('payment.cancel.return_checkout')}`
- `Continue Browsing` link text → `{t('payment.cancel.continue_browsing')}`

Keep all classNames exactly as-is.

- [ ] **Step 2: WeddingChecklist.tsx**

Add the useLanguage import + hook call. Replace the `steps` array literal with keyed steps:

```tsx
const steps = [
  { month: t('wedding.checklist.m12'), task: t('wedding.checklist.t12') },
  { month: t('wedding.checklist.m11'), task: t('wedding.checklist.t11') },
  { month: t('wedding.checklist.m9'), task: t('wedding.checklist.t9') },
  { month: t('wedding.checklist.m6'), task: t('wedding.checklist.t6') },
  { month: t('wedding.checklist.m3'), task: t('wedding.checklist.t3') },
  { month: t('wedding.checklist.m1'), task: t('wedding.checklist.t1') },
];
```

Replace `The Road to I Do` → `{t('wedding.checklist.eyebrow')}` and `Wedding Planning Checklist` → `{t('wedding.checklist.title')}`.

- [ ] **Step 3: WeddingTimeline.tsx**

Same import/hook pattern. Replace `Wedding Timeline` → `{t('wedding.timeline.title')}`, `Planning your journey to I DO` → `{t('wedding.timeline.subtitle')}`, `Return Home` → `{t('wedding.timeline.return_home')}`.

- [ ] **Step 4: Verify + commit**

Run: `npm run lint` (exit 0). Grep the three files for remaining ASCII-only JSX text nodes — none expected.

```bash
git add src/pages/PaymentCancel.tsx src/pages/WeddingChecklist.tsx src/pages/WeddingTimeline.tsx
git commit -m "i18n: wire payment-cancel and wedding pages to translations"
```

---

