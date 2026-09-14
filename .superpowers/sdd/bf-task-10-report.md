# Task 10 Report: Bilingual leak fixes

**Status:** DONE
**Commit:** `fa04689` — fix(i18n): route PaymentSuccess, quick-add, checkout label through translations

## What was done

### Step 1: Keys (LanguageContext.tsx)
All 15 keys from the brief added to BOTH dictionaries:
- `payment.*` (11 keys) — new `// Payment` namespace created after the Checkout section in each dict (EN ~line 402, AR ~line 1119). No `payment.*` namespace existed before.
- `product.select_size`, `product.cancel`, `product.quick_shop` — appended at end of the Product namespace in both dicts.
- `checkout.name_label` — appended at end of Checkout namespace in both dicts.

Verified programmatically: all 15 keys appear exactly twice (EN + AR).

### Step 2: PaymentSuccess.tsx
Added `import { useLanguage }` and `const { t } = useLanguage();`. All 11 literal strings routed through `t()` exactly as the brief specifies (`payment.verifying`, `payment.please_wait`, `payment.success_title`, `payment.success_sub`, `payment.sent_to {email}` prefix pattern, `payment.success_body`, `payment.dashboard`, `payment.error_title`, `payment.error_body`, `payment.contact`, `payment.home`). All leaks existed as described; none skipped.

### Step 3: ProductCard.tsx + Checkout.tsx
- ProductCard line 137: `'Quick Shop'` → `t('product.quick_shop')`
- ProductCard lines 155/157: `'Select Size'` → `t('product.select_size')`, `'Cancel'` → `t('product.cancel')`
- Checkout.tsx line 466: summary label `"Name"` → `{t('checkout.name_label')}` (t already in scope)

## Verification
- `npm run lint` (tsc --noEmit): **PASS**, no errors.
- Residual-leak grep across all three files for the targeted English strings: **0 matches**.
- Key-parity check: 15/15 keys × 2 dicts confirmed.

## Concerns (pre-existing, out of scope — not introduced by this task)
1. `ProductCard.tsx:137` still has a literal `'Close'` (mobile quick-actions toggle state). The brief's interface list defines no key for it, so per instructions I did not invent one. Recommend a follow-up key (e.g. `product.close`) if desired.
2. Untranslated aria-labels remain in ProductCard (`'Close quick shop' / 'Open quick shop'` line 134, `'Remove from wishlist' / 'Add to wishlist'` line 269). Screen-reader-only, outside brief scope.
