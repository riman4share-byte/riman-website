## Commits
fa04689 fix(i18n): route PaymentSuccess, quick-add, checkout label through translations

## Stat
 src/components/ProductCard.tsx   |  6 +++---
 src/contexts/LanguageContext.tsx | 34 ++++++++++++++++++++++++++++++++++
 src/pages/Checkout.tsx           |  2 +-
 src/pages/PaymentSuccess.tsx     | 24 +++++++++++++-----------
 4 files changed, 51 insertions(+), 15 deletions(-)

## Diff
diff --git a/src/components/ProductCard.tsx b/src/components/ProductCard.tsx
index 28c0ad4..bf9e481 100644
--- a/src/components/ProductCard.tsx
+++ b/src/components/ProductCard.tsx
@@ -127,41 +127,41 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
           }}
           className={cn(
             "md:hidden absolute bottom-0 left-0 right-0 z-20 py-3 text-[10px] tracking-[0.2em] uppercase font-body flex items-center justify-center gap-2 transition-all duration-300",
             showMobileActions 
               ? "bg-onyx text-white" 
               : "bg-gold/90 text-white backdrop-blur-sm"
           )}
           aria-label={showMobileActions ? 'Close quick shop' : 'Open quick shop'}
         >
           <ShoppingBag className="w-3 h-3" />
-          {showMobileActions ? 'Close' : 'Quick Shop'}
+          {showMobileActions ? 'Close' : t('product.quick_shop')}
         </button>
 
         {/* Quick Actions ΓÇö slim slide-up bar on hover */}
         <div className={cn(
           "absolute bottom-0 left-0 right-0 z-10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
           showMobileActions
             ? "translate-y-0 opacity-100"
             : "translate-y-full md:translate-y-full md:group-hover:translate-y-0 md:opacity-0 md:group-hover:opacity-100"
         )}>
           {/* Inline size selector */}
           {showSizes && hasSizes && (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full bg-ivory/95 backdrop-blur-sm p-3 flex flex-col gap-2"
             >
               <div className="flex items-center justify-between mb-1">
-                <span className="text-[9px] tracking-[0.2em] uppercase text-stone-500 font-bold">Select Size</span>
+                <span className="text-[9px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('product.select_size')}</span>
                 <button onClick={cancelSizeSelection} className="text-stone-400 hover:text-stone-800 transition-colors">
-                  <span className="text-[9px] tracking-widest uppercase">Cancel</span>
+                  <span className="text-[9px] tracking-widest uppercase">{t('product.cancel')}</span>
                 </button>
               </div>
               <div className="flex flex-wrap gap-1.5">
                 {product.sizes.map((size) => (
                   <button
                     key={size}
                     onClick={(e) => handleSizeSelect(size, e)}
                     className={cn(
                       "min-w-[2.5rem] h-9 px-2 flex items-center justify-center border text-[10px] tracking-wider transition-all",
                       selectedSize === size
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index 5c0621d..8e7c120 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -270,20 +270,23 @@ const translations: Record<Language, Record<string, string>> = {
     'product.care_dry_clean': 'Professional Dry Clean',
     'product.care_dry_clean_desc': 'Expert cleaning by specialists trained in luxury garment care.',
     'product.care_store': 'Breathable Garment Bag',
     'product.care_store_desc': 'Store in a cool, dry place using the provided breathable garment bag.',
     'product.care_handle': 'Handle with Care',
     'product.care_handle_desc': 'Avoid direct contact with perfumes, cosmetics, and sharp accessories.',
     'product.care_steam': 'Professional Steaming',
     'product.care_steam_desc': 'Use low-heat steaming to remove wrinkles. Never iron directly on embellishments.',
     'product.ask_stylist': 'Ask a Stylist',
     'product.ask_stylist_desc': 'Book a complimentary consultation with our styling experts.',
+    'product.select_size': 'Select Size',
+    'product.cancel': 'Cancel',
+    'product.quick_shop': 'Quick Shop',
 
     // Pricing
     'pricing.from': 'From',
     'pricing.rental_period': '3-day rental',
     'pricing.consultation_note': 'Final quote confirmed at your consultation ΓÇö fitting and alterations included.',
 
     // Badges
     'badge.new': 'Majestic New',
     'badge.featured': 'Atelier Choice',
     'badge.gold': 'Pure Gold',
@@ -390,20 +393,34 @@ const translations: Record<Language, Record<string, string>> = {
     'checkout.show_summary': 'Show Order Summary',
     'checkout.hide_summary': 'Hide Order Summary',
     'checkout.items_count': '{count} items',
     'checkout.back_to_shop': 'Back to Shop',
     'checkout.val_email': 'Please enter a valid email address',
     'checkout.val_phone': 'Please enter a valid phone number',
     'checkout.val_name': 'Please enter your name',
     'checkout.val_address': 'Please enter your street address',
     'checkout.val_city': 'Please enter your city',
     'checkout.val_country': 'Please select your country',
+    'checkout.name_label': 'Name',
+
+    // Payment
+    'payment.verifying': 'Verifying Payment',
+    'payment.please_wait': 'Please wait a moment...',
+    'payment.success_title': 'Payment Successful',
+    'payment.success_sub': 'Your investment has been received.',
+    'payment.sent_to': 'Confirmation sent to',
+    'payment.success_body': 'Our team will contact you within 24 hours to arrange fitting and delivery details.',
+    'payment.dashboard': 'View My Dashboard',
+    'payment.error_title': 'Payment Not Verified',
+    'payment.error_body': 'Please contact our atelier to confirm your order.',
+    'payment.contact': 'Contact Us',
+    'payment.home': 'Return Home',
 
     // Auth
     'auth.signin': 'Sign In',
     'auth.signup': 'Create Account',
     'auth.welcome_back': 'Welcome back to the Atelier',
     'auth.join': 'Join the Riman Society',
     'auth.enter_atelier': 'Enter Atelier',
     'auth.create_profile': 'Create Profile',
     'auth.authenticated': 'Authenticated',
     'auth.redirecting': 'Redirecting to your profile...',
@@ -987,20 +1004,23 @@ const translations: Record<Language, Record<string, string>> = {
     'product.care_dry_clean': '╪¬┘å╪╕┘è┘ü ╪¼╪º┘ü ┘à╪¬╪«╪╡╪╡',
     'product.care_dry_clean_desc': '╪¬┘å╪╕┘è┘ü ╪«╪¿╪▒╪º╪í ┘à╪¬╪«╪╡╪╡┘è┘å ┘ü┘è ╪º┘ä╪╣┘å╪º┘è╪⌐ ╪¿╪º┘ä┘à┘ä╪º╪¿╪│ ╪º┘ä┘ü╪º╪«╪▒╪⌐.',
     'product.care_store': '╪¡┘é┘è╪¿╪⌐ ╪¬╪«╪▓┘è┘å ┘é╪º╪¿┘ä╪⌐ ┘ä┘ä╪¬┘å┘ü╪│',
     'product.care_store_desc': '╪«╪▓┘æ┘å┘è ┘ü┘è ┘à┘â╪º┘å ╪¿╪º╪▒╪» ┘ê╪¼╪º┘ü ╪¿╪º╪│╪¬╪«╪»╪º┘à ╪¡┘é┘è╪¿╪⌐ ╪º┘ä╪¬╪«╪▓┘è┘å ╪º┘ä┘é╪º╪¿┘ä╪⌐ ┘ä┘ä╪¬┘å┘ü╪│ ╪º┘ä┘à╪▒┘ü┘é╪⌐.',
     'product.care_handle': '╪¬╪╣╪º┘à┘ä ╪¿╪¡╪░╪▒',
     'product.care_handle_desc': '╪¬╪¼┘å╪¿┘è┘ä╪º┘à╪│ ╪º┘ä┘à╪¿╪º╪┤╪▒ ┘ä┘ä╪╣╪╖┘ê╪▒ ┘ê┘à╪│╪¬╪¡╪╢╪▒╪º╪¬ ╪º┘ä╪¬╪¼┘à┘è┘ä ┘ê╪º┘ä╪Ñ┘â╪│╪│┘ê╪º╪▒╪º╪¬ ╪º┘ä╪¡╪º╪»╪⌐.',
     'product.care_steam': '╪¿╪«╪º╪▒ ╪º╪¡╪¬╪▒╪º┘ü┘è',
     'product.care_steam_desc': '╪º╪│╪¬╪«╪»┘à┘è ╪º┘ä╪¿╪«╪º╪▒ ┘à┘å╪«┘ü╪╢ ╪º┘ä╪¡╪▒╪º╪▒╪⌐ ┘ä╪Ñ╪▓╪º┘ä╪⌐ ╪º┘ä╪¬╪¼╪º╪╣┘è╪». ┘ä╪º ╪¬┘â┘ê┘è ┘à╪¿╪º╪┤╪▒╪⌐ ╪╣┘ä┘ë ╪º┘ä╪¬╪╖╪▒┘è╪▓.',
     'product.ask_stylist': '╪º╪│╪ú┘ä┘è ╪º┘ä╪«╪¿┘è╪▒╪⌐',
     'product.ask_stylist_desc': '╪º╪¡╪¼╪▓┘è ╪º╪│╪¬╪┤╪º╪▒╪⌐ ┘à╪¼╪º┘å┘è╪⌐ ┘à╪╣ ╪«╪¿╪▒╪º╪í ╪º┘ä╪¬╪╡┘à┘è┘à ┘ä╪»┘è┘å╪º.',
+    'product.select_size': '╪º╪«╪¬╪º╪▒┘è ╪º┘ä┘à┘é╪º╪│',
+    'product.cancel': '╪Ñ┘ä╪║╪º╪í',
+    'product.quick_shop': '╪¬╪│┘ê┘é ╪│╪▒┘è╪╣',
 
     // Pricing
     'pricing.from': '┘è╪¿╪»╪ú ┘à┘å',
     'pricing.rental_period': '╪¬╪ú╪¼┘è╪▒ ┘ú ╪ú┘è╪º┘à',
     'pricing.consultation_note': '┘è╪¬┘à ╪¬╪ú┘â┘è╪» ╪º┘ä╪│╪╣╪▒ ╪º┘ä┘å┘ç╪º╪ª┘è ┘ü┘è ┘à┘ê╪╣╪» ╪º┘ä╪º╪│╪¬╪┤╪º╪▒╪⌐ ΓÇö ┘è╪┤┘à┘ä ╪º┘ä╪¬┘ü╪╡┘è┘ä ┘ê╪º┘ä╪¬╪╣╪»┘è┘ä╪º╪¬.',
 
     // Badges
     'badge.new': '╪¼╪»┘è╪» ┘à┘ç┘è╪¿',
     'badge.featured': '╪º╪«╪¬┘è╪º╪▒ ╪º┘ä╪»╪º╪▒',
     'badge.gold': '╪░┘ç╪¿ ╪«╪º┘ä╪╡',
@@ -1107,20 +1127,34 @@ const translations: Record<Language, Record<string, string>> = {
     'checkout.show_summary': '╪╣╪▒╪╢ ┘à┘ä╪«╪╡ ╪º┘ä╪╖┘ä╪¿',
     'checkout.hide_summary': '╪Ñ╪«┘ü╪º╪í ┘à┘ä╪«╪╡ ╪º┘ä╪╖┘ä╪¿',
     'checkout.items_count': '{count} ┘é╪╖╪╣',
     'checkout.back_to_shop': '╪º┘ä╪╣┘ê╪»╪⌐ ┘ä┘ä┘à╪¬╪¼╪▒',
     'checkout.val_email': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪¿╪▒┘è╪» ╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è ╪╡╪¡┘è╪¡',
     'checkout.val_phone': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪▒┘é┘à ┘ç╪º╪¬┘ü ╪╡╪¡┘è╪¡',
     'checkout.val_name': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪º╪│┘à┘â',
     'checkout.val_address': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ╪╣┘å┘ê╪º┘å┘â',
     'checkout.val_city': '┘è╪▒╪¼┘ë ╪Ñ╪»╪«╪º┘ä ┘à╪»┘è┘å╪¬┘â',
     'checkout.val_country': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪¿┘ä╪»┘â',
+    'checkout.name_label': '╪º┘ä╪º╪│┘à',
+
+    // Payment
+    'payment.verifying': '╪¼╪º╪▒┘ì ╪¬╪ú┘â┘è╪» ╪º┘ä╪»┘ü╪╣',
+    'payment.please_wait': '╪º┘ä╪▒╪¼╪º╪í ╪º┘ä╪º┘å╪¬╪╕╪º╪▒ ┘é┘ä┘è┘ä╪º┘ï...',
+    'payment.success_title': '╪¬┘à ╪º┘ä╪»┘ü╪╣ ╪¿┘å╪¼╪º╪¡',
+    'payment.success_sub': '┘ä┘é╪» ╪º╪│╪¬┘ä┘à┘å╪º ╪╖┘ä╪¿┘â.',
+    'payment.sent_to': '╪¬┘à ╪Ñ╪▒╪│╪º┘ä ╪º┘ä╪¬╪ú┘â┘è╪» ╪Ñ┘ä┘ë',
+    'payment.success_body': '╪│┘è╪¬┘ê╪º╪╡┘ä ┘à╪╣┘â ┘ü╪▒┘è┘é┘å╪º ╪«┘ä╪º┘ä ┘ó┘ñ ╪│╪º╪╣╪⌐ ┘ä╪¬╪▒╪¬┘è╪¿ ╪º┘ä╪¬┘ü╪╡┘è┘ä ┘ê╪º┘ä╪¬┘ê╪╡┘è┘ä.',
+    'payment.dashboard': '┘ä┘ê╪¡╪⌐ ╪¡╪│╪º╪¿┘è',
+    'payment.error_title': '┘ä┘à ┘è╪¬┘à ╪¬╪ú┘â┘è╪» ╪º┘ä╪»┘ü╪╣',
+    'payment.error_body': '╪º┘ä╪▒╪¼╪º╪í ╪º┘ä╪¬┘ê╪º╪╡┘ä ┘à╪╣ ╪º┘ä╪»╪º╪▒ ┘ä╪¬╪ú┘â┘è╪» ╪╖┘ä╪¿┘â.',
+    'payment.contact': '╪¬┘ê╪º╪╡┘ä┘è ┘à╪╣┘å╪º',
+    'payment.home': '╪º┘ä╪╣┘ê╪»╪⌐ ┘ä┘ä╪▒╪ª┘è╪│┘è╪⌐',
 
     // Auth
     'auth.signin': '╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä',
     'auth.signup': '╪Ñ┘å╪┤╪º╪í ╪¡╪│╪º╪¿',
     'auth.welcome_back': '┘à╪▒╪¡╪¿╪º┘ï ╪¿╪╣┘ê╪»╪¬┘â ╪Ñ┘ä┘ë ╪º┘ä╪»╪º╪▒',
     'auth.join': '╪º┘å╪╢┘à┘è ╪Ñ┘ä┘ë ┘à╪¼╪¬┘à╪╣ ╪▒┘è┘à╪º┘å',
     'auth.enter_atelier': '╪»╪«┘ê┘ä ╪º┘ä╪»╪º╪▒',
     'auth.create_profile': '╪Ñ┘å╪┤╪º╪í ╪º┘ä┘à┘ä┘ü',
     'auth.authenticated': '╪¬┘à ╪º┘ä┘à╪╡╪º╪»┘é╪⌐',
     'auth.redirecting': '╪¼╪º╪▒┘è ╪º┘ä╪¬╪¡┘ê┘è┘ä ╪Ñ┘ä┘ë ┘à┘ä┘ü┘â...',
diff --git a/src/pages/Checkout.tsx b/src/pages/Checkout.tsx
index 4dcf3e7..6dfc984 100644
--- a/src/pages/Checkout.tsx
+++ b/src/pages/Checkout.tsx
@@ -456,21 +456,21 @@ export default function Checkout() {
                     {/* Details summary */}
                     <div className="bg-ivory/50 p-5 border border-gold/10 space-y-4">
                       <div className="flex items-center justify-between">
                         <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-stone-600">{t('checkout.your_details')}</h3>
                         <button onClick={() => setStep(1)} className="text-[10px] tracking-widest uppercase text-gold font-bold hover:text-gold-dark transition-colors">
                           {t('checkout.previous')}
                         </button>
                       </div>
                       <div className="grid grid-cols-2 gap-4 text-[11px] tracking-wider uppercase">
                         <div>
-                          <span className="text-stone-400 block mb-0.5">Name</span>
+                          <span className="text-stone-400 block mb-0.5">{t('checkout.name_label')}</span>
                           <span className="text-stone-800 font-medium">{formData.firstName} {formData.lastName}</span>
                         </div>
                         <div>
                           <span className="text-stone-400 block mb-0.5">{t('checkout.email')}</span>
                           <span className="text-stone-800 font-medium">{formData.email}</span>
                         </div>
                         <div>
                           <span className="text-stone-400 block mb-0.5">{t('checkout.address')}</span>
                           <span className="text-stone-800 font-medium">{formData.address}</span>
                         </div>
diff --git a/src/pages/PaymentSuccess.tsx b/src/pages/PaymentSuccess.tsx
index d71047c..15975eb 100644
--- a/src/pages/PaymentSuccess.tsx
+++ b/src/pages/PaymentSuccess.tsx
@@ -1,24 +1,26 @@
 import { useEffect, useState } from 'react';
 import { useSearchParams, Link } from 'react-router-dom';
 import { motion } from 'motion/react';
 import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
 import { verifyCheckoutSession } from '../services/payment';
 import { sendOrderConfirmationEmail } from '../lib/email';
 import { useCart } from '../contexts/CartContext';
+import { useLanguage } from '../contexts/LanguageContext';
 
 export default function PaymentSuccess() {
   const [searchParams] = useSearchParams();
   const sessionId = searchParams.get('session_id');
   const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
   const [email, setEmail] = useState('');
   const { clearCart } = useCart();
+  const { t } = useLanguage();
 
   useEffect(() => {
     if (!sessionId) {
       setStatus('error');
       return;
     }
     verifyCheckoutSession(sessionId).then(result => {
       if (result?.paid) {
         setStatus('success');
         setEmail(result.customerEmail || '');
@@ -49,44 +51,44 @@ export default function PaymentSuccess() {
     if (status === 'success') {
       clearCart();
     }
   }, [status, clearCart]);
 
   return (
     <div className="pt-40 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center bg-ivory">
       {status === 'verifying' && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
           <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-8" />
-          <h1 className="font-heading text-3xl text-stone-800 uppercase mb-4">Verifying Payment</h1>
-          <p className="font-body text-stone-400 text-xs tracking-widest uppercase">Please wait a moment...</p>
+          <h1 className="font-heading text-3xl text-stone-800 uppercase mb-4">{t('payment.verifying')}</h1>
+          <p className="font-body text-stone-400 text-xs tracking-widest uppercase">{t('payment.please_wait')}</p>
         </motion.div>
       )}
 
       {status === 'success' && (
         <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
           <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-8 mx-auto">
             <CheckCircle2 className="w-12 h-12" />
           </div>
-          <h1 className="font-heading text-4xl md:text-6xl text-stone-800 uppercase mb-4">Payment Successful</h1>
-          <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-4">Your investment has been received.</p>
-          {email && <p className="font-body text-stone-400 text-xs mb-4 uppercase italic">Confirmation sent to {email}</p>}
-          <p className="font-body text-stone-400 text-xs mb-12 uppercase tracking-widest max-w-md mx-auto">Our team will contact you within 24 hours to arrange fitting and delivery details.</p>
-          <Link to="/profile" className="btn-luxury px-12 italic">View My Dashboard</Link>
+          <h1 className="font-heading text-4xl md:text-6xl text-stone-800 uppercase mb-4">{t('payment.success_title')}</h1>
+          <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-4">{t('payment.success_sub')}</p>
+          {email && <p className="font-body text-stone-400 text-xs mb-4 uppercase italic">{t('payment.sent_to')} {email}</p>}
+          <p className="font-body text-stone-400 text-xs mb-12 uppercase tracking-widest max-w-md mx-auto">{t('payment.success_body')}</p>
+          <Link to="/profile" className="btn-luxury px-12 italic">{t('payment.dashboard')}</Link>
         </motion.div>
       )}
 
       {status === 'error' && (
         <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
           <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-8 mx-auto">
             <XCircle className="w-12 h-12" />
           </div>
-          <h1 className="font-heading text-3xl text-stone-800 uppercase mb-4">Payment Not Verified</h1>
-          <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-8">Please contact our atelier to confirm your order.</p>
+          <h1 className="font-heading text-3xl text-stone-800 uppercase mb-4">{t('payment.error_title')}</h1>
+          <p className="font-body text-stone-500 text-sm tracking-widest uppercase mb-8">{t('payment.error_body')}</p>
           <div className="flex gap-4 justify-center">
-            <Link to="/contact" className="btn-luxury-outline px-8">Contact Us</Link>
-            <Link to="/" className="btn-luxury px-8">Return Home</Link>
+            <Link to="/contact" className="btn-luxury-outline px-8">{t('payment.contact')}</Link>
+            <Link to="/" className="btn-luxury px-8">{t('payment.home')}</Link>
           </div>
         </motion.div>
       )}
     </div>
   );
 }
\ No newline at end of file
