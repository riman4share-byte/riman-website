### Task 3: "From" pricing copy

**Files:**
- Modify: `src/contexts/LanguageContext.tsx` (add keys to en + ar dicts)
- Modify: `src/pages/ProductDetail.tsx:311` (sale price), `:321` (rental price), `:643` (mobile bar)
- Modify: `src/components/ProductCard.tsx` (price line — locate `formatPrice(` usage)

**Interfaces:**
- Produces translation keys: `pricing.from`, `pricing.rental_period`, `pricing.consultation_note`

- [ ] **Step 1: Add translation keys**

English dict (near other `product.` keys):

```ts
    // From-pricing
    'pricing.from': 'From',
    'pricing.rental_period': '3-day rental',
    'pricing.consultation_note': 'Final quote confirmed at your consultation — fitting and alterations included.',
```

Arabic dict:

```ts
    // From-pricing
    'pricing.from': 'يبدأ من',
    'pricing.rental_period': 'تأجير ٣ أيام',
    'pricing.consultation_note': 'يتم تأكيد السعر النهائي في موعد الاستشارة — يشمل التفصيل والتعديلات.',
```

(Do not write the `// From-pricing` comments into the dicts if comment style there differs — match surrounding style; keys are what matter.)

- [ ] **Step 2: Desktop PDP sale price (line 311)**

Replace:

```tsx
<span className="font-heading text-3xl text-stone-800">{formatPrice(product.salePrice || 0)}</span>
```

with:

```tsx
<span className="font-heading text-3xl text-stone-800"><span className="text-sm font-body text-stone-500 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
```

- [ ] **Step 3: Desktop PDP rental price (line 321)**

Replace:

```tsx
<span className="font-heading text-3xl text-gold">{formatPrice(product.rentalPrice || 0)}</span>
```

with:

```tsx
<span className="font-heading text-3xl text-gold"><span className="text-sm font-body text-stone-500 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
```

Directly under whichever price block closes (same parent container), append the note:

```tsx
<p className="font-body text-[11px] text-stone-400 italic mt-2 leading-relaxed">{t('pricing.consultation_note')}</p>
```

- [ ] **Step 4: Mobile sticky bar (line 643)**

Wrap the existing price with the From prefix:

```tsx
<p className="font-heading text-sm text-gold"><span className="text-[10px] font-body text-stone-400 uppercase tracking-wider me-1">{t('pricing.from')}</span>{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
```

- [ ] **Step 5: ProductCard price line**

In `ProductCard.tsx`, find the rendered price (`formatPrice(...)`). Prefix it with `<span className="me-1 text-[9px] uppercase tracking-wider text-stone-400">{t('pricing.from')}</span>` inside the same element, keeping classes intact. `t` is already imported there.

- [ ] **Step 6: Typecheck + visual sanity**

Run: `npm run lint && npm run dev` then open `http://localhost:3001/product/<any-id>` in EN and AR.
Expected: "From"/"يبدأ من" prefixes render; note line visible under desktop price; no layout overflow at 1280px width.

- [ ] **Step 7: Commit**

```bash
git add src/contexts/LanguageContext.tsx src/pages/ProductDetail.tsx src/components/ProductCard.tsx
git commit -m "feat(pricing): From-AED pricing copy + consultation note"
```

---


