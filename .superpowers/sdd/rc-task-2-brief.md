### Task 2: Translation keys (en + ar)

**Files:**
- Modify: `src/contexts/LanguageContext.tsx` (en block after `'calendar.next': 'Next month',` ~line 350; ar block after `'calendar.next': 'الشهر التالي',` ~line 1088)

**Interfaces:**
- Produces (consumed by Tasks 3–4): `calendar.nextAvailable`, `calendar.statusAvailable`, `calendar.statusBooked`, `calendar.statusPast`, `calendar.selectedPrefix`, `calendar.noAvailability`, `calendar.fallbackNotice`, `calendar.retry`. Pre-existing keys reused: `calendar.prev`, `calendar.next`, `calendar.months`, `calendar.days`, `product.rental_7day`.

- [ ] **Step 1: Add English keys**

In the `// Calendar` block of the English translations, directly after `'calendar.next': 'Next month',` add:

```ts
    'calendar.nextAvailable': 'Next available date',
    'calendar.statusAvailable': 'available',
    'calendar.statusBooked': 'booked',
    'calendar.statusPast': 'past',
    'calendar.selectedPrefix': 'Selected:',
    'calendar.noAvailability': 'No availability in the next 6 months.',
    'calendar.fallbackNotice': "Availability couldn't be loaded — showing approximate data.",
    'calendar.retry': 'Retry',
```

- [ ] **Step 2: Add Arabic keys**

In the `// Calendar` block of the Arabic translations, directly after `'calendar.next': 'الشهر التالي',` add:

```ts
    'calendar.nextAvailable': 'أقرب تاريخ متاح',
    'calendar.statusAvailable': 'متاح',
    'calendar.statusBooked': 'محجوز',
    'calendar.statusPast': 'ماضٍ',
    'calendar.selectedPrefix': 'المحدد:',
    'calendar.noAvailability': 'لا توجد مواعيد متاحة خلال الأشهر الستة القادمة.',
    'calendar.fallbackNotice': 'تعذّر تحميل التوفر — تُعرض بيانات تقريبية.',
    'calendar.retry': 'إعادة المحاولة',
```

- [ ] **Step 3: Verify types compile**

Run: `npm run lint`
Expected: exit 0, no output.

- [ ] **Step 4: Commit**

```bash
git add src/contexts/LanguageContext.tsx
git commit -m "i18n(calendar): keyboard a11y + next-available strings (en/ar)"
```

---

