### Task 2: Product vocabulary module

**Files:**
- Create: `src/lib/productVocab.ts`
- Create: `src/lib/productVocab.test.ts`

**Interfaces:**
- Consumes: `src/data/products.ts` (default export array) for exhaustiveness test only.
- Produces: `translateProductValue(field: VocabField, value: string | undefined | null, language: 'en' | 'ar'): string`; `type VocabField = 'fabric' | 'category' | 'silhouette'`.

- [ ] **Step 1: Write failing tests**

Create `src/lib/productVocab.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import products from '../data/products';
import { AR_VOCAB, translateProductValue } from './productVocab';

describe('translateProductValue', () => {
  it('returns the original value for en', () => {
    expect(translateProductValue('fabric', 'Duchess Satin', 'en')).toBe('Duchess Satin');
  });
  it('translates known fabric/category/silhouette values for ar', () => {
    expect(translateProductValue('fabric', 'Duchess Satin', 'ar')).toBe('ساتان دوتشيس');
    expect(translateProductValue('category', 'Bridal Gown', 'ar')).toBe('فستان زفاف');
    expect(translateProductValue('silhouette', 'Mermaid', 'ar')).toBe('حورية البحر');
  });
  it('returns original for unknown values and nullish input', () => {
    expect(translateProductValue('fabric', 'Unobtainium Weave', 'ar')).toBe('Unobtainium Weave');
    expect(translateProductValue('fabric', undefined, 'ar')).toBe('');
    expect(translateProductValue('fabric', null, 'ar')).toBe('');
  });
});

describe('vocab exhaustiveness', () => {
  it('covers every fabric/category/silhouette value in products.ts', () => {
    const missing: string[] = [];
    for (const p of products) {
      if (p.fabric && !AR_VOCAB.fabric[p.fabric]) missing.push(`fabric:${p.fabric}`);
      if (p.category && !AR_VOCAB.category[p.category]) missing.push(`category:${p.category}`);
      if (p.silhouette && !AR_VOCAB.silhouette[p.silhouette]) missing.push(`silhouette:${p.silhouette}`);
    }
    expect(missing).toEqual([]);
  });
});
```

Note: check `products.ts` export style first — if it uses a named export instead of default, adapt the import line accordingly (keep everything else identical).

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/lib/productVocab.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

Create `src/lib/productVocab.ts`:

```ts
export type VocabField = 'fabric' | 'category' | 'silhouette';

export const AR_VOCAB: Record<VocabField, Record<string, string>> = {
  fabric: {
    '14k Gold, Citrine': 'ذهب 14 قيراط مع حجر السيترين',
    'Beaded Lace with Cathedral Train': 'دانتيل مطرز بالخرز مع ذيل كاتدرائي',
    'Beaded Tulle with 3D Silk Florals': 'تول مطرز بالخرز مع زهور حريرية ثلاثية الأبعاد',
    'Cathedral Tulle with 3D Silk Blossoms': 'تول كاتدرائي مع أزهار حريرية ثلاثية الأبعاد',
    'Chiffon Layers': 'طبقات شيفون',
    'Crepe with Beaded Detail': 'كريب بتفاصيل مطرزة بالخرز',
    'Crystal-embellished Illusion Tulle': 'تول شفاف مزين بالكريستال',
    'Crystal-Embellished Tulle': 'تول مزين بالكريستال',
    'Duchess Satin': 'ساتان دوتشيس',
    'Duchess Satin with 3D Floral Veil': 'ساتان دوتشيس مع طرحة بزهور ثلاثية الأبعاد',
    'Duchess Satin with Beaded Cape': 'ساتان دوتشيس مع كيب مطرز بالخرز',
    'Duchess Satin with Crystal Beadwork': 'ساتان دوتشيس مع تطريز الكريستال',
    'Duchess Satin with Crystal-beaded Sleeves': 'ساتان دوتشيس بأكمام مزينة بالكريستال والخرز',
    'Embroidered Crepe': 'كريب مطرز',
    'Embroidered Lace with 3D Botanical Appliqués': 'دانتيل مطرز بتطريقات نباتية ثلاثية الأبعاد',
    'Embroidered Lace with 3D Petal Appliqués': 'دانتيل مطرز بتطريقات بتلات ثلاثية الأبعاد',
    'Embroidered Lace with Cathedral Veil': 'دانتيل مطرز مع طرحة كاتدرائية',
    'Embroidered Lace with Pearl Corsetry': 'دانتيل مطرز مع مشد اللؤلؤ',
    'Embroidered Silk Organza': 'أورغانزا حرير مطرزة',
    'Floral Appliqué Tulle': 'تول بتطريقات الزهور',
    'Flowing Chiffon with Hand Beading': 'شيفون منسدل بخرز يدوي',
    'French Lace with Pearl-scattered Tulle': 'دانتيل فرنسي مع تول مرصع باللؤلؤ',
    'Hand-beaded Crystal Tulle': 'تول كريستالي مرصع يدويًا بالخرز',
    'Hand-crystalled Rose Clutch': 'حقيبة كلاتش وردية مرصعة يدويًا بالكريستال',
    'Layered Tulle with Crystal Work': 'طبقات تول بأعمال الكريستال',
    'Liquid Lamé with 3D Crystal Florals': 'لاميه لامع بزهور كريستالية ثلاثية الأبعاد',
    'Pearl-Beaded Lace': 'دانتيل مطرز باللؤلؤ',
    'Pearl-scattered Cathedral Tulle': 'تول كاتدرائي مرصع باللؤلؤ',
    'Shimmer Jersey': 'جيرسي لامع',
    'Silk Mikado': 'ميكادو حريري',
    'Silk Satin with Hand-set Crystal Embroidery': 'ساتان حرير بتطريز كريستالي مرصوع يدويًا',
    'Silk Satin with Lace Train': 'ساتان حرير مع ذيل دانتيل',
    'Soft Tulle': 'تول ناعم',
    'Tulle with 3D Florals, Illusion Corset': 'تول بزهور ثلاثية الأبعاد ومشد شفاف',
    'Velvet and Silk Blend': 'مزيج المخمل والحرير',
  },
  category: {
    Accessory: 'إكسسوار',
    'Bridal Gown': 'فستان زفاف',
    'Evening Dress': 'فستان سهرة',
    'Fine Jewelry': 'مجوهرات ثمينة',
  },
  silhouette: {
    'A-Line': 'قطعة A',
    Ballgown: 'فستان أميرة',
    Column: 'قصة مستقيمة',
    Kaftan: 'قفطان',
    Mermaid: 'حورية البحر',
    'One Size': 'مقاس واحد',
  },
};

export function translateProductValue(field: VocabField, value: string | undefined | null, language: 'en' | 'ar'): string {
  if (!value) return '';
  if (language !== 'ar') return value;
  return AR_VOCAB[field][value] ?? value;
}
```

CRITICAL: dictionary KEYS must byte-match the products.ts source values exactly (including case like `Crystal-embellished` vs `Crystal-Embellished`, accented `Appliqués`/`Lamé`). The exhaustiveness test enforces this — if it fails, fix the DICTIONARY KEY to match the source, never the reverse.

- [ ] **Step 4: Verify GREEN + full suite**

Run: `npm test -- src/lib/productVocab.test.ts` then `npm run lint`.
Expected: PASS, lint clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/productVocab.ts src/lib/productVocab.test.ts
git commit -m "feat(i18n): product value vocabulary (fabric/category/silhouette ar)"
```

---

