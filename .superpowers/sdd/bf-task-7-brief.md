### Task 7: WhatsApp handoff on success

**Files:**
- Create: `src/lib/whatsapp.ts`
- Modify: `src/pages/AppointmentPage.tsx` (success branch, ~lines 92–130)
- Modify: `src/contexts/LanguageContext.tsx` (key `appointment.whatsapp_continue`)

**Interfaces:**
- Produces: `buildWhatsAppUrl(message: string): string` in `src/lib/whatsapp.ts`
- Produces key: `appointment.whatsapp_continue`

- [ ] **Step 1: Helper**

```ts
const WHATSAPP_NUMBER = '971553730792';

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 2: Key**

English: `'appointment.whatsapp_continue': 'Continue on WhatsApp'`
Arabic: `'appointment.whatsapp_continue': 'تابعينا على واتساب'`

- [ ] **Step 3: Success view button**

In the `if (isSubmitted)` success JSX, after the existing confirmation paragraph add:

```tsx
<a
  href={buildWhatsAppUrl(
    incomingGowns.length
      ? `${t('appointment.booked')} — ${form.name}, ${form.date} ${form.time}. ${t('appointment.your_gowns')}: ${gownNames.join(', ')}`
      : `${t('appointment.booked')} — ${form.name}, ${form.date} ${form.time}`
  )}
  target="_blank"
  rel="noopener noreferrer"
  className="btn-luxury-outline inline-block mt-4 px-10"
>
  {t('appointment.whatsapp_continue')}
</a>
```

Import `buildWhatsAppUrl` from `'../lib/whatsapp'`.

- [ ] **Step 4: Typecheck + manual verify**

Run: `npm run lint`, submit a booking.
Expected: success screen shows the button; link opens wa.me with encoded message including gown names.

- [ ] **Step 5: Commit**

```bash
git add src/lib/whatsapp.ts src/pages/AppointmentPage.tsx src/contexts/LanguageContext.tsx
git commit -m "feat(booking): WhatsApp continue-handoff after viewing request"
```

---


