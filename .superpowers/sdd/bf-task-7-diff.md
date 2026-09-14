## Commits
820b234 feat(booking): WhatsApp continue-handoff after viewing request

## Stat
 src/contexts/LanguageContext.tsx |  2 ++
 src/lib/whatsapp.ts              |  5 +++++
 src/pages/AppointmentPage.tsx    | 13 +++++++++++++
 3 files changed, 20 insertions(+)

## Diff
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index 6c760ca..5c0621d 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -450,20 +450,21 @@ const translations: Record<Language, Record<string, string>> = {
     'appointment.service_label': 'Service',
     'appointment.date_label': 'Date',
     'appointment.time_label': 'Time',
     'appointment.booked': 'Booking Confirmed',
     'appointment.thank_you': 'Thank you',
     'appointment.appointment_booked_for': 'appointment is booked for',
     'appointment.at': 'at',
     'appointment.confirmation_sent': 'A confirmation will be sent to',
     'appointment.our_team_reach': 'Our team will reach out to confirm details.',
     'appointment.explore_collection': 'Explore Collection',
+    'appointment.whatsapp_continue': 'Continue on WhatsApp',
     'appointment.error_name': 'Please enter your name',
     'appointment.error_email': 'Please enter a valid email',
     'appointment.error_phone': 'Please enter your phone number',
     'appointment.error_service': 'Please select a service type',
     'appointment.error_date': 'Please select a date',
     'appointment.error_time': 'Please select a time',
     'appointment.fill_all': 'Please fill in all required fields',
     'appointment.select_date_time': 'Please select a date and time',
     'appointment.something_wrong': 'Something went wrong. Please try again or contact us directly via WhatsApp.',
     'appointment.atelier_hours': 'Sunday ΓÇô Thursday: 10AM ΓÇô 9PM  |  Friday: 2PM ΓÇô 9PM  |  Saturday: 10AM ΓÇô 9PM',
@@ -1166,20 +1167,21 @@ const translations: Record<Language, Record<string, string>> = {
     'appointment.service_label': '╪º┘ä╪«╪»┘à╪⌐',
     'appointment.date_label': '╪º┘ä╪¬╪º╪▒┘è╪«',
     'appointment.time_label': '╪º┘ä┘ê┘é╪¬',
     'appointment.booked': '╪¬┘à ╪¬╪ú┘â┘è╪» ╪º┘ä╪¡╪¼╪▓',
     'appointment.thank_you': '╪┤┘â╪▒╪º┘ï ┘ä┘â',
     'appointment.appointment_booked_for': '┘à╪¡╪¼┘ê╪▓ ┘ü┘è',
     'appointment.at': '┘ü┘è',
     'appointment.confirmation_sent': '╪│┘è╪¬┘à ╪Ñ╪▒╪│╪º┘ä ╪º┘ä╪¬╪ú┘â┘è╪» ╪Ñ┘ä┘ë',
     'appointment.our_team_reach': '╪│┘è╪¬┘ê╪º╪╡┘ä ┘ü╪▒┘è┘é┘å╪º ┘ä╪¬╪ú┘â┘è╪» ╪º┘ä╪¬┘ü╪º╪╡┘è┘ä.',
     'appointment.explore_collection': '╪º╪│╪¬┘â╪┤┘ü ╪º┘ä┘à╪¼┘à┘ê╪╣╪⌐',
+    'appointment.whatsapp_continue': '╪¬╪º╪¿╪╣┘è┘å╪º ╪╣┘ä┘ë ┘ê╪º╪¬╪│╪º╪¿',
     'appointment.error_name': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪º╪│┘à┘â',
     'appointment.error_email': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪¿╪▒┘è╪» ╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è ╪╡╪¡┘è╪¡',
     'appointment.error_phone': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪▒┘é┘à ┘ç╪º╪¬┘ü┘â',
     'appointment.error_service': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ┘å┘ê╪╣ ╪º┘ä╪«╪»┘à╪⌐',
     'appointment.error_date': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪¬╪º╪▒┘è╪«',
     'appointment.error_time': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ┘ê┘é╪¬',
     'appointment.fill_all': '┘è╪▒╪¼┘ë ┘à┘ä╪í ╪¼┘à┘è╪╣ ╪º┘ä╪¡┘é┘ê┘ä ╪º┘ä┘à╪╖┘ä┘ê╪¿╪⌐',
     'appointment.select_date_time': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪º┘ä╪¬╪º╪▒┘è╪« ┘ê╪º┘ä┘ê┘é╪¬',
     'appointment.something_wrong': '╪¡╪»╪½ ╪«╪╖╪ú. ┘è╪▒╪¼┘ë ╪º┘ä┘à╪¡╪º┘ê┘ä╪⌐ ┘à╪▒╪⌐ ╪ú╪«╪▒┘ë ╪ú┘ê ╪º┘ä╪¬┘ê╪º╪╡┘ä ┘à╪╣┘å╪º ┘à╪¿╪º╪┤╪▒╪⌐ ╪╣╪¿╪▒ ┘ê╪º╪¬╪│╪º╪¿.',
     'appointment.atelier_hours': '╪º┘ä╪ú╪¡╪» ΓÇô ╪º┘ä╪«┘à┘è╪│: ┘í┘á╪╡ ΓÇô ┘⌐┘à  |  ╪º┘ä╪¼┘à╪╣╪⌐: ┘ó┘à ΓÇô ┘⌐┘à  |  ╪º┘ä╪│╪¿╪¬: ┘í┘á╪╡ ΓÇô ┘⌐┘à',
diff --git a/src/lib/whatsapp.ts b/src/lib/whatsapp.ts
new file mode 100644
index 0000000..acedfef
--- /dev/null
+++ b/src/lib/whatsapp.ts
@@ -0,0 +1,5 @@
+const WHATSAPP_NUMBER = '971553730792';
+
+export function buildWhatsAppUrl(message: string): string {
+  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
+}
diff --git a/src/pages/AppointmentPage.tsx b/src/pages/AppointmentPage.tsx
index ee5c494..04a7502 100644
--- a/src/pages/AppointmentPage.tsx
+++ b/src/pages/AppointmentPage.tsx
@@ -1,17 +1,18 @@
 import { useState } from 'react';
 import { Link, useLocation } from 'react-router-dom';
 import type { GownRef } from '../types';
 import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { createAppointment } from '../services/appointments';
 import { sendAppointmentConfirmationEmail, sendAppointmentAdminAlert } from '../lib/email';
+import { buildWhatsAppUrl } from '../lib/whatsapp';
 import { useLanguage } from '../contexts/LanguageContext';
 
 const SERVICE_TYPES = [
   { value: 'bridal', label: 'Bridal Consultation', icon: '≡ƒæ░' },
   { value: 'evening', label: 'Evening Wear Styling', icon: '≡ƒæù' },
   { value: 'rental', label: 'Rental Fitting', icon: 'Γ£¿' },
   { value: 'alterations', label: 'Bespoke Alterations', icon: '≡ƒ¬í' },
 ];
 
 const TIME_SLOTS = [
@@ -112,20 +113,32 @@ export default function AppointmentPage() {
           <h1 className="font-heading text-4xl font-light text-stone-800 mb-4">{t('appointment.booked')}</h1>
           <div className="w-12 h-px bg-gold mx-auto mb-6" />
           <p className="font-body text-stone-500 leading-relaxed mb-2">
             {t('appointment.thank_you')}, <span className="text-stone-800 font-semibold">{form.name}</span>.
           </p>
           <p className="font-body text-stone-500 leading-relaxed mb-8">
             {t('appointment.appointment_booked_for')} <span className="text-stone-800 font-semibold">{new Date(form.date).toLocaleDateString(isRtl ? 'ar-AE' : 'en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> {t('appointment.at')} <span className="text-stone-800 font-semibold">{form.time}</span>.
           </p>
           <div className="w-12 h-px bg-gold mx-auto mb-6" />
           <p className="font-body text-sm text-stone-400 mb-10">{t('appointment.confirmation_sent')} {form.email}. {t('appointment.our_team_reach')}</p>
+          <a
+            href={buildWhatsAppUrl(
+              incomingGowns.length
+                ? `${t('appointment.booked')} ΓÇö ${form.name}, ${form.date} ${form.time}. ${t('appointment.your_gowns')}: ${gownNames.join(', ')}`
+                : `${t('appointment.booked')} ΓÇö ${form.name}, ${form.date} ${form.time}`
+            )}
+            target="_blank"
+            rel="noopener noreferrer"
+            className="btn-luxury-outline inline-block mt-4 px-10"
+          >
+            {t('appointment.whatsapp_continue')}
+          </a>
           <Link to="/collection/all" className="btn-luxury">{t('appointment.explore_collection')}</Link>
         </motion.div>
       </div>
     );
   }
 
   return (
     <div className="pt-24 min-h-screen bg-champagne">
       <div className="container mx-auto px-6 py-16 max-w-4xl">
         <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-400 mb-8">
