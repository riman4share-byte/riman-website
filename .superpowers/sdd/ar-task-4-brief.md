### Task 4: Components, checkout, PDP, toasts

**Files:**
- Modify: `src/App.tsx` (provider reorder ONLY)
- Modify: `src/pages/Checkout.tsx`
- Modify: `src/components/GlobalFeatures.tsx`
- Modify: `src/components/GlobalErrorBoundary.tsx`
- Modify: `src/components/ThreeDViewer.tsx`
- Modify: `src/pages/ProductDetail.tsx`
- Modify: `src/components/ProductCard.tsx`
- Modify: `src/components/salon/EditorialPlate.tsx`
- Modify: `src/contexts/AuthContext.tsx`

**Interfaces:**
- Consumes: Task 1 keys; Task 2 `translateProductValue`; `useLanguage()` → also exposes `language`.

- [ ] **Step 1: Provider swap (App.tsx)**

Reorder so LanguageProvider wraps AuthProvider (Language depends on nothing here; Auth needs it for translated toasts):

```tsx
<SettingsProvider>
<LanguageProvider>
<AuthProvider>
<WishlistProvider>
<CartProvider>
...
</CartProvider>
</WishlistProvider>
</AuthProvider>
</LanguageProvider>
</SettingsProvider>
```

(Close tags in mirrored order; move the closing `</LanguageProvider>` accordingly.)

- [ ] **Step 2: Checkout.tsx**

1. Trust box (:831): replace the ternary literals with:
   `{paymentMethod === 'card' ? t('checkout.secured_stripe') : t('checkout.secure_order_atelier')}`
2. Error fallback (:260): `setSubmitError(err.message || t('checkout.order_failed'));` — verify `t` is in scope there; if not, hoist via the component's existing `useLanguage()` call.
3. Country default (:51): `country: ''` stays as-is in state BUT the form field must display localized default — simplest correct approach: initialize `country: 'United Arab Emirates'` → leave state empty-string and set placeholder/default via render? NO — orders persist country into metadata; keep data behavior identical by translating only DISPLAY: change initial value to `''` is a behavior change (forbidden). Instead: keep stored value English but localize what the user SEES: in the country Input and review step render, wrap display with `value === 'United Arab Emirates' && language === 'ar' ? t('checkout.country_default') : value`. Apply at both render sites (form field ~:485 area and review step). State/payload unchanged.

- [ ] **Step 3: GlobalFeatures.tsx**

Newsletter modal: `The Atelier Circle`→`{t('newsletter.title')}`, body paragraph→`{t('newsletter.body')}`, `placeholder=`{t('newsletter.email_placeholder')}``, `aria-label=`{t('newsletter.email_aria')}``, button text→`{t('newsletter.cta')}`, `aria-label="Close"`(:72)→`aria-label={t('common.close')}`.
Cookie banner: heading→`{t('cookies.heading')}`, sentence→`{t('cookies.body')} <Link...>{t('cookies.learn')}</Link>.`, button→`{t('cookies.accept')}`.

- [ ] **Step 4: GlobalErrorBoundary.tsx (class component pattern)**

Extract the error UI into a function child so hooks work:

```tsx
function ErrorFallback() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="font-heading text-4xl text-stone-800 mb-4">{t('errors.tech_title')}</h1>
        <p className="font-body text-stone-500 text-sm mb-8 italic">
          {t('errors.tech_body')}
        </p>
        <button onClick={() => window.location.href = '/'} className="btn-luxury">
          {t('errors.return_atelier')}
        </button>
      </div>
    </div>
  );
}
```

Class render becomes `if (this.state.hasError) return <ErrorFallback />;` (rest of class unchanged).

- [ ] **Step 5: ThreeDViewer.tsx**

Replace `Initializing 3D Detail` → `{t('threed.initializing')}` and the `Retry` label → `{t('common.retry')}` (hook up `useLanguage` if not already imported).

- [ ] **Step 6: AuthContext.tsx**

Now inside LanguageProvider (Step 1): `const { t } = useLanguage();` where accessible (it's a provider itself — call useLanguage() INSIDE its own component body; nesting now guarantees availability):
- `'Profile not found'`→`t('auth.profile_missing_title')`, `'Could not load account'`→`t('auth.load_fail_title')`, message `'Some features may be limited.'`→`t('auth.limited_msg')` (both toast calls).

- [ ] **Step 7: ProductDetail.tsx**

1. Toast (:168): `message: `${product.name} — ${intent === 'rent' ? t('product.toast_suffix_rental') : t('product.toast_suffix_added')}``
2. Fabric fallbacks (~:349 and ~:505): replace hardcoded `'Luxury Blend'` with `t('product.fabric_default')`, and wrap the fabric VALUE with `translateProductValue('fabric', product.fabric, language)` (grab `language` from the existing `useLanguage()` destructure).
3. Wherever category/silhouette render raw (details table region ~:340-360 and any other site — grep `\bproduct\.(category|silhouette|fabric)\b` within the file): wrap with `translateProductValue(field, expr, language)`.

- [ ] **Step 8: ProductCard.tsx + EditorialPlate.tsx**

ProductCard :239: `{product.fabric}` → `{translateProductValue('fabric', product.fabric, language)}` (destructure `language` from useLanguage).
EditorialPlate :35-36: same treatment for its fabric expression.

- [ ] **Step 9: Component test for cookie banner (ar)**

Add `src/components/GlobalFeatures.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlobalFeatures from './GlobalFeatures';
import { LanguageProvider } from '../contexts/LanguageContext';

describe('GlobalFeatures cookie banner', () => {
  it('renders Arabic copy under ar locale when not yet accepted', () => {
    localStorage.setItem('riman_lang', 'ar');
    localStorage.removeItem('cookies_accepted');
    render(
      <LanguageProvider>
        <GlobalFeatures />
      </LanguageProvider>
    );
    expect(screen.getByText('الخصوصية والأناقة')).toBeDefined();
  });
});
```

Adapt the localStorage flag name to whatever GlobalFeatures actually checks (read its top section first; e.g. `cookieConsent`) — the banner must be force-visible in the test. If the banner is delay-gated, advance timers per existing patterns or export nothing new — mock-free approach preferred; document adaptation in report.

- [ ] **Step 10: Verify + commit**

Run: `npm run lint` → 0; `npm test -- src/components/GlobalFeatures.test.tsx` → green; `npm test` full → green.

```bash
git add src/App.tsx src/pages/Checkout.tsx src/components/GlobalFeatures.tsx src/components/GlobalErrorBoundary.tsx src/components/ThreeDViewer.tsx src/pages/ProductDetail.tsx src/components/ProductCard.tsx src/components/salon/EditorialPlate.tsx src/contexts/AuthContext.tsx src/components/GlobalFeatures.test.tsx
git commit -m "i18n: wire components, checkout, pdp, and toasts; localize product values"
```

---

