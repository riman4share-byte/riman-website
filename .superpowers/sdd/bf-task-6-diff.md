## Commits
1fe6a2d feat(email): appointment confirmation + admin alert (fire-and-forget)

## Stat
 src/lib/email.ts              | 76 +++++++++++++++++++++++++++++++++++++++++++
 src/pages/AppointmentPage.tsx |  4 +++
 2 files changed, 80 insertions(+)

## Diff
diff --git a/src/lib/email.ts b/src/lib/email.ts
index 729798f..433159c 100644
--- a/src/lib/email.ts
+++ b/src/lib/email.ts
@@ -201,11 +201,87 @@ export async function sendRentalReminderEmail(
       to: customerEmail,
       subject: `Rental Return Reminder ΓÇö ${orderId}`,
       html,
     });
 
     if (error) return { success: false, error: error.message };
     return { success: true };
   } catch (err) {
     return { success: false, error: String(err) };
   }
+}
+
+export async function sendAppointmentConfirmationEmail(data: {
+  name: string;
+  email: string;
+  date: string;
+  time: string;
+  gowns: string[];
+}): Promise<{ success: boolean; error?: string }> {
+  try {
+    const resend = getResendClient();
+    if (!resend) return { success: false, error: 'not-configured' };
+
+    const html = `
+      <!DOCTYPE html>
+      <html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1f1f1f;max-width:600px;margin:0 auto;padding:24px;">
+        <div style="text-align:center;margin-bottom:32px;">
+          <h1 style="font-family:'Playfair Display',Georgia,serif;color:#0a0a0a;margin:0 0 8px;font-size:28px;">Riman Fashion</h1>
+          <p style="color:#666;font-size:14px;margin:0;">Atelier Riman ΓÇö Sharjah</p>
+        </div>
+        <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:24px;">
+          <h2 style="margin:0 0 16px;font-size:20px;">Your Private Viewing</h2>
+          <p>Dear <strong>${data.name}</strong>,</p>
+          <p>Your viewing request has been received for <strong>${new Date(data.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong> at <strong>${data.time}</strong>.</p>
+          ${data.gowns.length ? `<p>Pieces prepared for you:<br/><em>${data.gowns.join('<br/>')}</em></p>` : ''}
+          <p style="margin-bottom:0;">Al Zahra St, Sharjah, UAE. To reschedule, simply reply to this email.</p>
+        </div>
+        <p style="font-size:12px;color:#999;text-align:center;margin-top:32px;">Atelier Riman ┬╖ hello@rimanfashion.com</p>
+      </body></html>`;
+
+    const { error } = await resend.emails.send({
+      from: import.meta.env.RESEND_FROM_EMAIL || 'Riman Fashion <orders@rimanfashion.com>',
+      to: data.email,
+      subject: `Private Viewing Request ΓÇö ${data.date}`,
+      html,
+    });
+    if (error) return { success: false, error: error.message };
+    return { success: true };
+  } catch (err) {
+    console.error('sendAppointmentConfirmationEmail error:', err);
+    return { success: false, error: String(err) };
+  }
+}
+
+export async function sendAppointmentAdminAlert(data: {
+  name: string;
+  email: string;
+  phone: string;
+  date: string;
+  time: string;
+  gowns: string[];
+}): Promise<{ success: boolean; error?: string }> {
+  try {
+    const resend = getResendClient();
+    if (!resend) return { success: false, error: 'not-configured' };
+
+    const adminEmail = import.meta.env.RESEND_ADMIN_EMAIL || 'admin@rimanfashion.com';
+    const html = `
+      <h2>New Viewing Request</h2>
+      <p><strong>${data.name}</strong> ┬╖ ${data.phone} ┬╖ ${data.email}</p>
+      <p><strong>Requested:</strong> ${data.date} at ${data.time}</p>
+      ${data.gowns.length ? `<p><strong>Gowns:</strong> ${data.gowns.join(', ')}</p>` : ''}
+      <p><a href="https://riman-fashion-v2.netlify.app/admin/appointments">Open Admin Calendar</a></p>`;
+
+    const { error } = await resend.emails.send({
+      from: import.meta.env.RESEND_FROM_EMAIL || 'Riman Fashion <orders@rimanfashion.com>',
+      to: adminEmail,
+      subject: `≡ƒôà Viewing Request ΓÇö ${data.name}`,
+      html,
+    });
+    if (error) return { success: false, error: error.message };
+    return { success: true };
+  } catch (err) {
+    console.error('sendAppointmentAdminAlert error:', err);
+    return { success: false, error: String(err) };
+  }
 }
\ No newline at end of file
diff --git a/src/pages/AppointmentPage.tsx b/src/pages/AppointmentPage.tsx
index 6af8c58..ee5c494 100644
--- a/src/pages/AppointmentPage.tsx
+++ b/src/pages/AppointmentPage.tsx
@@ -1,16 +1,17 @@
 import { useState } from 'react';
 import { Link, useLocation } from 'react-router-dom';
 import type { GownRef } from '../types';
 import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { createAppointment } from '../services/appointments';
+import { sendAppointmentConfirmationEmail, sendAppointmentAdminAlert } from '../lib/email';
 import { useLanguage } from '../contexts/LanguageContext';
 
 const SERVICE_TYPES = [
   { value: 'bridal', label: 'Bridal Consultation', icon: '≡ƒæ░' },
   { value: 'evening', label: 'Evening Wear Styling', icon: '≡ƒæù' },
   { value: 'rental', label: 'Rental Fitting', icon: 'Γ£¿' },
   { value: 'alterations', label: 'Bespoke Alterations', icon: '≡ƒ¬í' },
 ];
 
 const TIME_SLOTS = [
@@ -78,20 +79,23 @@ export default function AppointmentPage() {
       await createAppointment({
         name: form.name,
         email: form.email,
         phone: form.phone,
         date: form.date,
         time: form.time,
         service_type: form.service_type,
         notes: form.notes,
         interested_gowns: incomingGowns.length ? incomingGowns : null,
       });
+      const gownList = gownNames.length ? gownNames : [];
+      sendAppointmentConfirmationEmail({ name: form.name, email: form.email, date: form.date, time: form.time, gowns: gownList }).catch(err => console.error('Confirmation email failed:', err));
+      sendAppointmentAdminAlert({ name: form.name, email: form.email, phone: form.phone, date: form.date, time: form.time, gowns: gownList }).catch(err => console.error('Admin alert failed:', err));
       setIsSubmitted(true);
     } catch (err) {
       console.error('[Riman] Appointment booking failed:', err);
       setError(t('appointment.something_wrong'));
     } finally {
       setIsSubmitting(false);
     }
   };
 
   if (isSubmitted) {
