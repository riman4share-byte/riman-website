### Task 2: Arabic default language + locale-aware dates

**Files:**
- Modify: `src/contexts/LanguageContext.tsx:1414-1416`
- Modify: `src/pages/AppointmentPage.tsx:109` (success date line)

**Interfaces:**
- Consumes: nothing new.
- Produces: first-visit language = `'ar'`; pattern `lang === 'ar' ? 'ar-AE' : 'en-AE'` used in AppointmentPage.

- [ ] **Step 1: Flip the fallback**

Replace in `LanguageContext.tsx`:

```ts
    return (localStorage.getItem('riman_lang') as Language) || 'en';
```

with:

```ts
    return (localStorage.getItem('riman_lang') as Language) || 'ar';
```

(Returning visitors with a stored preference are unaffected.)

- [ ] **Step 2: Locale-aware success date**

In `AppointmentPage.tsx` the component already calls `useLanguage()` for `t`. Destructure also `isRtl`:

```ts
  const { t, isRtl } = useLanguage();
```

Replace line 109's `new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })` with:

```tsx
{new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
```

Apply the same replacement to any other `'en-US'` occurrences inside `AppointmentPage.tsx` (grep the file).

- [ ] **Step 3: Typecheck**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/contexts/LanguageContext.tsx src/pages/AppointmentPage.tsx
git commit -m "feat(i18n): Arabic as default language, locale-aware appointment dates"
```

---


