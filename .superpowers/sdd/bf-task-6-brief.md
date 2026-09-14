### Task 6: Emails — appointment confirmation + admin alert

**Files:**
- Modify: `src/lib/email.ts`
- Modify: `src/pages/AppointmentPage.tsx` (handleSubmit)

**Interfaces:**
- Consumes: `getResendClient()` (existing), `GownRef`.
- Produces:
  - `sendAppointmentConfirmationEmail(data: { name: string; email: string; date: string; time: string; gowns: string[] }): Promise<{ success: boolean; error?: string }>`
  - `sendAppointmentAdminAlert(data: { name: string; email: string; phone: string; date: string; time: string; gowns: string[] }): Promise<{ success: boolean; error?: string }>`

- [ ] **Step 1: Implement both functions**

Append to `src/lib/email.ts` (match existing HTML style of `sendOrderConfirmationEmail`):

```ts
export async function sendAppointmentConfirmationEmail(data: {
  name: string;
  email: string;
  date: string;
  time: string;
  gowns: string[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    if (!resend) return { success: false, error: 'not-configured' };

    const html = `
      <!DOCTYPE html>
      <html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1f1f1f;max-width:600px;margin:0 auto;padding:24px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-family:'Playfair Display',Georgia,serif;color:#0a0a0a;margin:0 0 8px;font-size:28px;">Riman Fashion</h1>
          <p style="color:#666;font-size:14px;margin:0;">Atelier Riman — Sharjah</p>
        </div>
        <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:24px;">
          <h2 style="margin:0 0 16px;font-size:20px;">Your Private Viewing</h2>
          <p>Dear <strong>${data.name}</strong>,</p>
          <p>Your viewing request has been received for <strong>${new Date(data.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong> at <strong>${data.time}</strong>.</p>
          ${data.gowns.length ? `<p>Pieces prepared for you:<br/><em>${data.gowns.join('<br/>')}</em></p>` : ''}
          <p style="margin-bottom:0;">Al Zahra St, Sharjah, UAE. To reschedule, simply reply to this email.</p>
        </div>
        <p style="font-size:12px;color:#999;text-align:center;margin-top:32px;">Atelier Riman · hello@rimanfashion.com</p>
      </body></html>`;

    const { error } = await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL || 'Riman Fashion <orders@rimanfashion.com>',
      to: data.email,
      subject: `Private Viewing Request — ${data.date}`,
      html,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    console.error('sendAppointmentConfirmationEmail error:', err);
    return { success: false, error: String(err) };
  }
}

export async function sendAppointmentAdminAlert(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  gowns: string[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    if (!resend) return { success: false, error: 'not-configured' };

    const adminEmail = import.meta.env.RESEND_ADMIN_EMAIL || 'admin@rimanfashion.com';
    const html = `
      <h2>New Viewing Request</h2>
      <p><strong>${data.name}</strong> · ${data.phone} · ${data.email}</p>
      <p><strong>Requested:</strong> ${data.date} at ${data.time}</p>
      ${data.gowns.length ? `<p><strong>Gowns:</strong> ${data.gowns.join(', ')}</p>` : ''}
      <p><a href="https://riman-fashion-v2.netlify.app/admin/appointments">Open Admin Calendar</a></p>`;

    const { error } = await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL || 'Riman Fashion <orders@rimanfashion.com>',
      to: adminEmail,
      subject: `📅 Viewing Request — ${data.name}`,
      html,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    console.error('sendAppointmentAdminAlert error:', err);
    return { success: false, error: String(err) };
  }
}
```

- [ ] **Step 2: Wire into handleSubmit (fire-and-forget)**

In `AppointmentPage.tsx` after `await createAppointment({...})` succeeds and before `setIsSubmitted(true)`:

```ts
      const gownList = gownNames.length ? gownNames : [];
      sendAppointmentConfirmationEmail({ name: form.name, email: form.email, date: form.date, time: form.time, gowns: gownList }).catch(err => console.error('Confirmation email failed:', err));
      sendAppointmentAdminAlert({ name: form.name, email: form.email, phone: form.phone, date: form.date, time: form.time, gowns: gownList }).catch(err => console.error('Admin alert failed:', err));
```

Add the two imports from `'../lib/email'`.

- [ ] **Step 3: Typecheck + manual verify**

Run: `npm run lint`. Submit a booking in dev.
Expected: no errors in UI without RESEND_API_KEY; console shows `[Riman] Email not configured` info only.

- [ ] **Step 4: Commit**

```bash
git add src/lib/email.ts src/pages/AppointmentPage.tsx
git commit -m "feat(email): appointment confirmation + admin alert (fire-and-forget)"
```

---


