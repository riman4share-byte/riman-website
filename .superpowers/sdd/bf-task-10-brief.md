### Task 10: Bilingual leak fixes (audit P1s within scope)

**Files:**
- Modify: `src/pages/PaymentSuccess.tsx` (full `t()` routing)
- Modify: `src/components/ProductCard.tsx:137,155` (quick-add strings)
- Modify: `src/pages/Checkout.tsx:466` (summary "Name")

**Interfaces:**
- Produces keys: `payment.verifying`, `payment.success_title`, `payment.success_sub`, `payment.sent_to`, `payment.success_body`, `payment.dashboard`, `payment.error_title`, `payment.error_body`, `payment.contact`, `payment.home`, `product.select_size`, `product.cancel`, `checkout.name_label` (all EN + AR)

- [ ] **Step 1: Keys**

English:

```ts
    'payment.verifying': 'Verifying Payment',
    'payment.please_wait': 'Please wait a moment...',
    'payment.success_title': 'Payment Successful',
    'payment.success_sub': 'Your investment has been received.',
    'payment.sent_to': 'Confirmation sent to',
    'payment.success_body': 'Our team will contact you within 24 hours to arrange fitting and delivery details.',
    'payment.dashboard': 'View My Dashboard',
    'payment.error_title': 'Payment Not Verified',
    'payment.error_body': 'Please contact our atelier to confirm your order.',
    'payment.contact': 'Contact Us',
    'payment.home': 'Return Home',
    'product.select_size': 'Select Size',
    'product.cancel': 'Cancel',
    'product.quick_shop': 'Quick Shop',
    'checkout.name_label': 'Name',
```

Arabic:

```ts
    'payment.verifying': 'جارٍ تأكيد الدفع',
    'payment.please_wait': 'الرجاء الانتظار قليلاً...',
    'payment.success_title': 'تم الدفع بنجاح',
    'payment.success_sub': 'لقد استلمنا طلبك.',
    'payment.sent_to': 'تم إرسال التأكيد إلى',
    'payment.success_body': 'سيتواصل معك فريقنا خلال ٢٤ ساعة لترتيب التفصيل والتوصيل.',
    'payment.dashboard': 'لوحة حسابي',
    'payment.error_title': 'لم يتم تأكيد الدفع',
    'payment.error_body': 'الرجاء التواصل مع الدار لتأكيد طلبك.',
    'payment.contact': 'تواصلي معنا',
    'payment.home': 'العودة للرئيسية',
    'product.select_size': 'اختاري المقاس',
    'product.cancel': 'إلغاء',
    'product.quick_shop': 'تسوق سريع',
    'checkout.name_label': 'الاسم',
```

- [ ] **Step 2: PaymentSuccess routing**

Add `import { useLanguage } from '../contexts/LanguageContext';` and `const { t } = useLanguage();` inside the component. Replace every literal string: `"Verifying Payment"`→`{t('payment.verifying')}`, `"Please wait a moment..."`→`{t('payment.please_wait')}`, `"Payment Successful"`→`{t('payment.success_title')}`, `"Your investment has been received."`→`{t('payment.success_sub')}`, prefix `Confirmation sent to {email}`→`{t('payment.sent_to')} {email}`, the 24-hours paragraph→`{t('payment.success_body')}`, `"View My Dashboard"`→`{t('payment.dashboard')}`, `"Payment Not Verified"`→`{t('payment.error_title')}`, contact-atelier paragraph→`{t('payment.error_body')}`, `"Contact Us"`→`{t('payment.contact')}`, `"Return Home"`→`{t('payment.home')}`.

- [ ] **Step 3: ProductCard quick-add + Checkout label**

In `ProductCard.tsx` replace the literals `'Select Size'`/`'Cancel'`/`Quick Shop` (lines ~137,155) with `t('product.select_size')`, `t('product.cancel')`, `t('product.quick_shop')`. In `Checkout.tsx` line ~466 replace the summary label `"Name"` with `{t('checkout.name_label')}` (`t` already available via `useLanguage` there).

- [ ] **Step 4: Typecheck + manual verify**

Run: `npm run lint`, switch site to Arabic, open checkout summary and trigger the quick-add overlay on a product card.
Expected: no English remnants in those surfaces.

- [ ] **Step 5: Commit**

```bash
git add src/pages/PaymentSuccess.tsx src/components/ProductCard.tsx src/pages/Checkout.tsx src/contexts/LanguageContext.tsx
git commit -m "fix(i18n): route PaymentSuccess, quick-add, checkout label through translations"
```

---


