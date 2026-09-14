# Review package AR Task 3 (0e87210..851b9ab)
## Commits
851b9ab i18n: wire payment-cancel and wedding pages to translations
246cf89 test(calendar): date-robust day lookups (year-substring collision)

## Stat
 src/components/AvailabilityCalendar.test.tsx |  7 +++----
 src/pages/PaymentCancel.tsx                  | 10 ++++++----
 src/pages/WeddingChecklist.tsx               | 19 +++++++++++--------
 src/pages/WeddingTimeline.tsx                | 10 ++++++----
 4 files changed, 26 insertions(+), 20 deletions(-)

## Diff (-U10)
diff --git a/src/components/AvailabilityCalendar.test.tsx b/src/components/AvailabilityCalendar.test.tsx
index fc13d58..dd798c3 100644
--- a/src/components/AvailabilityCalendar.test.tsx
+++ b/src/components/AvailabilityCalendar.test.tsx
@@ -29,24 +29,23 @@ function dayButton(offsetDays: number) {
 
 beforeEach(() => {
   localStorage.setItem('riman_lang', 'en');
   mockedFetch.mockResolvedValue([format(TODAY, 'yyyy-MM-dd'), format(addDays(TODAY, 5), 'yyyy-MM-dd')]);
 });
 
 describe('AvailabilityCalendar', () => {
   it('renders an ARIA grid with labelled day buttons', async () => {
     renderCalendar();
     expect(screen.getByRole('grid')).toBeDefined();
-    await waitFor(() => {
-      expect(document.querySelector(`[data-date="${format(addDays(TODAY, 1), 'yyyy-MM-dd')}"]`)).toBeTruthy();
-    });
-    const future = screen.getByRole('button', { name: new RegExp(`${format(addDays(TODAY, 1), 'd')}`) });
+    const futureIso = format(addDays(TODAY, 1), 'yyyy-MM-dd');
+    const future = await waitFor(() => document.querySelector(`[data-date="${futureIso}"]`) as HTMLButtonElement);
+    expect(future).toBeTruthy();
     expect(future.getAttribute('aria-label')).toContain(', available');
   });
 
   it('marks booked days unavailable and ignores clicks on them', async () => {
     const onDateSelect = renderCalendar();
     const booked = await waitFor(() => dayButton(5));
     expect(booked.getAttribute('aria-disabled')).toBe('true');
     fireEvent.click(booked);
     expect(onDateSelect).not.toHaveBeenCalled();
   });
diff --git a/src/pages/PaymentCancel.tsx b/src/pages/PaymentCancel.tsx
index 9108023..0bbf8ef 100644
--- a/src/pages/PaymentCancel.tsx
+++ b/src/pages/PaymentCancel.tsx
@@ -1,21 +1,23 @@
 import { Link } from 'react-router-dom';
 import { motion } from 'motion/react';
 import { XCircle } from 'lucide-react';
+import { useLanguage } from '../contexts/LanguageContext';
 
 export default function PaymentCancel() {
+  const { t } = useLanguage();
   return (
     <div className="pt-40 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center bg-ivory">
       <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
         <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mb-8 mx-auto">
           <XCircle className="w-12 h-12" />
         </div>
-        <h1 className="font-heading text-4xl md:text-5xl text-stone-800 uppercase mb-4">Payment Cancelled</h1>
-        <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-8">No charges were made. Your order has not been placed.</p>
+        <h1 className="font-heading text-4xl md:text-5xl text-stone-800 uppercase mb-4">{t('payment.cancel.title')}</h1>
+        <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-8">{t('payment.cancel.body')}</p>
         <div className="flex gap-4 justify-center">
-          <Link to="/checkout" className="btn-luxury px-8">Return to Checkout</Link>
-          <Link to="/" className="btn-luxury-outline px-8">Continue Browsing</Link>
+          <Link to="/checkout" className="btn-luxury px-8">{t('payment.cancel.return_checkout')}</Link>
+          <Link to="/" className="btn-luxury-outline px-8">{t('payment.cancel.continue_browsing')}</Link>
         </div>
       </motion.div>
     </div>
   );
 }
diff --git a/src/pages/WeddingChecklist.tsx b/src/pages/WeddingChecklist.tsx
index 6e0a613..259e382 100644
--- a/src/pages/WeddingChecklist.tsx
+++ b/src/pages/WeddingChecklist.tsx
@@ -1,25 +1,28 @@
+import { useLanguage } from '../contexts/LanguageContext';
+
 export default function WeddingChecklist() {
+  const { t } = useLanguage();
   const steps = [
-    { month: "12 Months Before", task: "Set your wedding date and venue." },
-    { month: "11 Months Before", task: "Book your first Riman Atelier consultation." },
-    { month: "9 Months Before", task: "Finalize your silhouette and fabric selection." },
-    { month: "6 Months Before", task: "First fitting and embroidery details." },
-    { month: "3 Months Before", task: "Accessorize with veils and headpieces." },
-    { month: "1 Month Before", task: "Final fitting and secure collection." },
+    { month: t('wedding.checklist.m12'), task: t('wedding.checklist.t12') },
+    { month: t('wedding.checklist.m11'), task: t('wedding.checklist.t11') },
+    { month: t('wedding.checklist.m9'), task: t('wedding.checklist.t9') },
+    { month: t('wedding.checklist.m6'), task: t('wedding.checklist.t6') },
+    { month: t('wedding.checklist.m3'), task: t('wedding.checklist.t3') },
+    { month: t('wedding.checklist.m1'), task: t('wedding.checklist.t1') },
   ];
 
   return (
     <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
       <div className="text-center mb-20">
-        <h2 className="heading-editorial text-gold text-micro mb-4">The Road to I Do</h2>
-        <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider mb-6">Wedding Planning Checklist</h1>
+        <h2 className="heading-editorial text-gold text-micro mb-4">{t('wedding.checklist.eyebrow')}</h2>
+        <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider mb-6">{t('wedding.checklist.title')}</h1>
         <div className="divider-gold" />
       </div>
 
       <div className="space-y-12">
         {steps.map((s, i) => (
           <div key={i} className="flex gap-8 group">
             <div className="text-right w-1/4 shrink-0">
               <span className="font-heading text-2xl text-gold/40 group-hover:text-gold transition-colors">{s.month}</span>
             </div>
             <div className="w-px bg-stone-100 relative">
diff --git a/src/pages/WeddingTimeline.tsx b/src/pages/WeddingTimeline.tsx
index 18b7642..f98a8a3 100644
--- a/src/pages/WeddingTimeline.tsx
+++ b/src/pages/WeddingTimeline.tsx
@@ -1,12 +1,14 @@
 import { Link } from 'react-router-dom';
+import { useLanguage } from '../contexts/LanguageContext';
 
-export default function WeddingTimeline() { 
+export default function WeddingTimeline() {
+  const { t } = useLanguage();
   return (
     <div className="pt-40 pb-20 px-6 min-h-[60vh] flex flex-col items-center justify-center text-center bg-ivory">
-      <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider uppercase mb-4">Wedding Timeline</h1>
-      <p className="font-body text-stone-500 text-sm tracking-[0.2em] uppercase mb-12">Planning your journey to I DO</p>
+      <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider uppercase mb-4">{t('wedding.timeline.title')}</h1>
+      <p className="font-body text-stone-500 text-sm tracking-[0.2em] uppercase mb-12">{t('wedding.timeline.subtitle')}</p>
       <div className="divider-gold mb-12" />
-      <Link to="/" className="btn-luxury">Return Home</Link>
+      <Link to="/" className="btn-luxury">{t('wedding.timeline.return_home')}</Link>
     </div>
   );
 }
