### Task 4: Prefilled viewing-request flow (PDP primary CTA)

Implementation note vs spec: instead of building a modal panel, the PDP primary CTA navigates to the proven `/appointment` wizard carrying the gown list in router state. Same UX outcome, zero duplicated form logic.

**Files:**
- Modify: `src/contexts/LanguageContext.tsx` (keys below)
- Modify: `src/pages/ProductDetail.tsx` (CTA block lines 368–389, imports, handler)
- Modify: `src/pages/AppointmentPage.tsx` (read `location.state`, chips, prefill)

**Interfaces:**
- Consumes: `GownRef` (Task 1), `addToWishlist` from WishlistContext.
- Produces: route contract `/appointment` accepts `location.state = { gowns?: GownRef[] }`; AppointmentPage auto-selects `service_type: 'rental'` when any gown has `intent: 'rent'`, else `'bridal'`, and pre-fills notes with gown names.
- Produces keys: `product.reserve_viewing`, `appointment.your_gowns`

- [ ] **Step 1: Translation keys**

English:

```ts
    'product.reserve_viewing': 'Reserve a Private Viewing',
    'appointment.your_gowns': 'Your Selected Pieces',
```

Arabic:

```ts
    'product.reserve_viewing': 'احجزي مشاهدة خاصة',
    'appointment.your_gowns': 'قطعك المختارة',
```

- [ ] **Step 2: PDP CTA block rewrite**

In `ProductDetail.tsx`, add import near top:

```ts
import { useNavigate } from 'react-router-dom';
import type { GownRef } from '../types';
```

Inside the component add `const navigate = useNavigate();` beside the other hooks, plus:

```ts
  const reserveViewing = () => {
    if (product) {
      if (!isInWishlist(product.id)) addToWishlist(product);
      const gowns: GownRef[] = [{
        id: product.id,
        name: product.name,
        size: selectedSize || undefined,
        intent: isRent ? 'rent' : 'sale',
      }];
      navigate('/appointment', { state: { gowns } });
    }
  };
```

Replace the primary button block (lines 370–379) so the flex-col contains TWO stacked buttons, heart button unchanged beside them:

```tsx
<div className="flex-1 flex flex-col gap-2">
  <button onClick={reserveViewing} className="w-full btn-luxury flex items-center justify-center gap-3">
    <Sparkles className="w-4 h-4" />
    {t('product.reserve_viewing')}
  </button>
  <button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full btn-luxury-outline !py-3 flex items-center justify-center gap-3">
    {isAddingToCart ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      <>
        <ShoppingBag className="w-3.5 h-3.5" />
        {isRent ? t('product.book_rental') : t('product.add_to_collection')}
      </>
    )}
  </button>
  {errorMsg && (
    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 uppercase tracking-widest text-center font-bold">
      {errorMsg}
    </motion.p>
  )}
</div>
```

Add `Sparkles` to the lucide-react import. If a second mobile CTA surface exists further down (~lines 700–738), apply the same reserve-primary/bag-secondary ordering there.

- [ ] **Step 3: AppointmentPage prefill**

Add imports:

```ts
import { useLocation } from 'react-router-dom';
import type { GownRef } from '../types';
```

In the component:

```ts
  const location = useLocation();
  const incomingGowns: GownRef[] = (location.state as { gowns?: GownRef[] } | null)?.gowns ?? [];
  const gownNames = incomingGowns.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`);
```

Change the `form` initial state to prefill:

```ts
  const [form, setForm] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service_type: incomingGowns.some(g => g.intent === 'rent') ? 'rental' : incomingGowns.length ? 'bridal' : '',
    notes: gownNames.length ? `Interested in: ${gownNames.join(', ')}` : '',
  }));
```

Above the form fields (inside step-1 render), when `incomingGowns.length > 0` show:

```tsx
<div className="mb-6 p-4 border border-gold/30 bg-gold/[0.04]">
  <p className="text-[10px] tracking-widest uppercase text-stone-800 font-bold mb-2">{t('appointment.your_gowns')}</p>
  <ul className="space-y-1">
    {incomingGowns.map((g, i) => (
      <li key={`${g.id}-${i}`} className="text-xs text-stone-600 italic">{g.name}{g.size ? ` · ${g.size}` : ''}</li>
    ))}
  </ul>
</div>
```

Pass gowns through submit: in `handleSubmit`, extend the `createAppointment({...})` argument with `interested_gowns: incomingGowns.length ? incomingGowns : null,`.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`. Open a PDP, click "Reserve a Private Viewing".
Expected: lands on /appointment with service preselected, notes prefilled, gold chips listing the gown; submitting creates an appointment row containing `interested_gowns` (check Supabase table editor or local storage fallback).

- [ ] **Step 5: Commit**

```bash
git add src/contexts/LanguageContext.tsx src/pages/ProductDetail.tsx src/pages/AppointmentPage.tsx
git commit -m "feat(booking): Reserve-a-Viewing primary CTA with prefilled appointment"
```

---


