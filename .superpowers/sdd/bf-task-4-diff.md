## Commits
0d594de feat(booking): Reserve-a-Viewing primary CTA with prefilled appointment

## Stat
 src/contexts/LanguageContext.tsx |  4 ++++
 src/pages/AppointmentPage.tsx    | 25 +++++++++++++++++++-----
 src/pages/ProductDetail.tsx      | 42 +++++++++++++++++++++++++++++++---------
 3 files changed, 57 insertions(+), 14 deletions(-)

## Diff
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index 621e3ea..1cb5006 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -203,20 +203,21 @@ const translations: Record<Language, Record<string, string>> = {
     'product.back_to_collection': 'Back to Collection',
     'product.limited_edition': 'Limited Edition',
     'product.purchase_value': 'Purchase Value',
     'product.rental_7day': '7-Day Premium Rental',
     'product.rental_includes': 'Dry Clean & Insurance Included',
     'product.refundable_deposit': '+ Refundable Deposit Required',
     'product.select_size_label': 'Select Size',
     'product.size_guide': 'Size Guide',
     'product.book_rental': 'Book Rental',
     'product.add_to_collection': 'Add to Collection',
+    'product.reserve_viewing': 'Reserve a Private Viewing',
     'product.error_no_date': 'Please select a preferred rental date.',
     'product.error_no_size': 'Please select your size.',
     'product.rental_availability': 'Rental Availability',
     'product.fast_booking': 'Fast-Booking Recommended',
     'product.select_date_hint': 'Select a date to check 7-day premier hire availability.',
     'product.selected_date': 'Selected Date',
     'product.specifications': 'Specifications',
     'product.fabric': 'Fabric Composition',
     'product.designer': 'Designer',
     'product.style_elements': 'Style Elements',
@@ -415,20 +416,21 @@ const translations: Record<Language, Record<string, string>> = {
     'appointment.step_schedule': 'Schedule',
     'appointment.step_confirm': 'Confirm',
     'appointment.your_details': 'Your Details',
     'appointment.choose_datetime': 'Choose Date & Time',
     'appointment.review_confirm': 'Review & Confirm',
     'appointment.full_name': 'Full Name *',
     'appointment.email': 'Email Address *',
     'appointment.phone': 'Phone Number *',
     'appointment.service_type': 'Service Type *',
     'appointment.select_service': 'Select a service',
+    'appointment.your_gowns': 'Your Selected Pieces',
     'appointment.select_date': 'Select Date *',
     'appointment.select_time': 'Select Time *',
     'appointment.special_requests': 'Special Requests (Optional)',
     'appointment.notes_placeholder': 'Anything specific you\'d like us to prepare for your visit...',
     'appointment.continue_scheduling': 'Continue to Scheduling',
     'appointment.review_booking': 'Review Booking',
     'appointment.confirm_booking': 'Confirm Booking',
     'appointment.confirming': 'Confirming...',
     'appointment.back': 'Back',
     'appointment.name': 'Name',
@@ -906,20 +908,21 @@ const translations: Record<Language, Record<string, string>> = {
     'product.back_to_collection': '╪º┘ä╪╣┘ê╪»╪⌐ ┘ä┘ä┘à╪¼┘à┘ê╪╣╪⌐',
     'product.limited_edition': '╪Ñ╪╡╪»╪º╪▒ ┘à╪¡╪»┘ê╪»',
     'product.purchase_value': '┘é┘è┘à╪⌐ ╪º┘ä╪┤╪▒╪º╪í',
     'product.rental_7day': '╪Ñ┘è╪¼╪º╪▒ ┘º ╪ú┘è╪º┘à ┘à╪¬┘à┘è╪▓',
     'product.rental_includes': '┘è╪┤┘à┘ä ╪º┘ä╪¬┘å╪╕┘è┘ü ╪º┘ä╪¼╪º┘ü ┘ê╪º┘ä╪¬╪ú┘à┘è┘å',
     'product.refundable_deposit': '+ ┘ê╪»┘è╪╣╪⌐ ┘é╪º╪¿┘ä╪⌐ ┘ä┘ä╪º╪│╪¬╪▒╪»╪º╪»',
     'product.select_size_label': '╪º╪«╪¬╪▒ ╪º┘ä┘à┘é╪º╪│',
     'product.size_guide': '╪»┘ä┘è┘ä ╪º┘ä┘à┘é╪º╪│╪º╪¬',
     'product.book_rental': '╪º╪¡╪¼╪▓ ╪º┘ä╪Ñ┘è╪¼╪º╪▒',
     'product.add_to_collection': '╪ú╪╢┘ü ┘ä┘ä┘à╪¼┘à┘ê╪╣╪⌐',
+    'product.reserve_viewing': '╪º╪¡╪¼╪▓┘è ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐',
     'product.error_no_date': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪¬╪º╪▒┘è╪« ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ╪º┘ä┘à┘ü╪╢┘ä.',
     'product.error_no_size': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ┘à┘é╪º╪│┘â.',
     'product.rental_availability': '╪¬┘ê┘ü╪▒ ╪º┘ä╪Ñ┘è╪¼╪º╪▒',
     'product.fast_booking': '┘è┘Å┘ê╪╡┘ë ╪¿╪º┘ä╪¡╪¼╪▓ ╪º┘ä╪│╪▒┘è╪╣',
     'product.select_date_hint': '╪º╪«╪¬╪▒ ╪¬╪º╪▒┘è╪«╪º┘ï ┘ä┘ä╪¬╪¡┘é┘é ┘à┘å ╪¬┘ê┘ü╪▒ ╪º┘ä╪Ñ┘è╪¼╪º╪▒ ┘ä┘à╪»╪⌐ ┘º ╪ú┘è╪º┘à.',
     'product.selected_date': '╪º┘ä╪¬╪º╪▒┘è╪« ╪º┘ä┘à╪«╪¬╪º╪▒',
     'product.specifications': '╪º┘ä┘à┘ê╪º╪╡┘ü╪º╪¬',
     'product.fabric': '╪¬┘â┘ê┘è┘å ╪º┘ä┘å╪│┘è╪¼',
     'product.designer': '╪º┘ä┘à╪╡┘à┘à',
     'product.style_elements': '╪╣┘å╪º╪╡╪▒ ╪º┘ä╪ú╪│┘ä┘ê╪¿',
@@ -1118,20 +1121,21 @@ const translations: Record<Language, Record<string, string>> = {
     'appointment.step_schedule': '╪º┘ä┘à┘ê╪╣╪»',
     'appointment.step_confirm': '╪º┘ä╪¬╪ú┘â┘è╪»',
     'appointment.your_details': '╪¿┘è╪º┘å╪º╪¬┘â',
     'appointment.choose_datetime': '╪º╪«╪¬╪▒ ╪º┘ä╪¬╪º╪▒┘è╪« ┘ê╪º┘ä┘ê┘é╪¬',
     'appointment.review_confirm': '╪º┘ä┘à╪▒╪º╪¼╪╣╪⌐ ┘ê╪º┘ä╪¬╪ú┘â┘è╪»',
     'appointment.full_name': '╪º┘ä╪º╪│┘à ╪º┘ä┘â╪º┘à┘ä *',
     'appointment.email': '╪º┘ä╪¿╪▒┘è╪» ╪º┘ä╪Ñ┘ä┘â╪¬╪▒┘ê┘å┘è *',
     'appointment.phone': '╪▒┘é┘à ╪º┘ä┘ç╪º╪¬┘ü *',
     'appointment.service_type': '┘å┘ê╪╣ ╪º┘ä╪«╪»┘à╪⌐ *',
     'appointment.select_service': '╪º╪«╪¬╪▒ ╪«╪»┘à╪⌐',
+    'appointment.your_gowns': '┘é╪╖╪╣┘â ╪º┘ä┘à╪«╪¬╪º╪▒╪⌐',
     'appointment.select_date': '╪º╪«╪¬╪▒ ╪º┘ä╪¬╪º╪▒┘è╪« *',
     'appointment.select_time': '╪º╪«╪¬╪▒ ╪º┘ä┘ê┘é╪¬ *',
     'appointment.special_requests': '╪╖┘ä╪¿╪º╪¬ ╪«╪º╪╡╪⌐ (╪º╪«╪¬┘è╪º╪▒┘è)',
     'appointment.notes_placeholder': '╪ú┘è ╪┤┘è╪í ╪¬┘ê╪»┘æ ╪ú┘å ┘å╪¼┘ç╪▓┘ç ┘ä╪▓┘è╪º╪▒╪¬┘â...',
     'appointment.continue_scheduling': '┘à╪¬╪º╪¿╪╣╪⌐ ╪Ñ┘ä┘ë ╪¬╪¡╪»┘è╪» ╪º┘ä┘à┘ê╪╣╪»',
     'appointment.review_booking': '┘à╪▒╪º╪¼╪╣╪⌐ ╪º┘ä╪¡╪¼╪▓',
     'appointment.confirm_booking': '╪¬╪ú┘â┘è╪» ╪º┘ä╪¡╪¼╪▓',
     'appointment.confirming': '╪¼╪º╪▒┘è ╪º┘ä╪¬╪ú┘â┘è╪»...',
     'appointment.back': '╪▒╪¼┘ê╪╣',
     'appointment.name': '╪º┘ä╪º╪│┘à',
diff --git a/src/pages/AppointmentPage.tsx b/src/pages/AppointmentPage.tsx
index 51c1128..6af8c58 100644
--- a/src/pages/AppointmentPage.tsx
+++ b/src/pages/AppointmentPage.tsx
@@ -1,12 +1,13 @@
 import { useState } from 'react';
-import { Link } from 'react-router-dom';
+import { Link, useLocation } from 'react-router-dom';
+import type { GownRef } from '../types';
 import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { createAppointment } from '../services/appointments';
 import { useLanguage } from '../contexts/LanguageContext';
 
 const SERVICE_TYPES = [
   { value: 'bridal', label: 'Bridal Consultation', icon: '≡ƒæ░' },
   { value: 'evening', label: 'Evening Wear Styling', icon: '≡ƒæù' },
   { value: 'rental', label: 'Rental Fitting', icon: 'Γ£¿' },
   { value: 'alterations', label: 'Bespoke Alterations', icon: '≡ƒ¬í' },
@@ -28,32 +29,35 @@ const SLOT_PERIOD: Record<string, 'AM' | 'PM'> = {
   '4:00': 'PM', '4:30': 'PM', '5:00': 'PM', '5:30': 'PM',
   '6:00': 'PM', '6:30': 'PM', '7:00': 'PM', '7:30': 'PM',
   '8:00': 'PM',
 };
 
 const formatSlot = (slot: string) => `${slot} ${SLOT_PERIOD[slot]}`;
 
 export default function AppointmentPage() {
   const [step, setStep] = useState(1);
   const { t, isRtl } = useLanguage();
+  const location = useLocation();
+  const incomingGowns: GownRef[] = (location.state as { gowns?: GownRef[] } | null)?.gowns ?? [];
+  const gownNames = incomingGowns.map(g => `${g.name}${g.size ? ` (${g.size})` : ''}`);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [error, setError] = useState('');
-  const [form, setForm] = useState({
+  const [form, setForm] = useState(() => ({
     name: '',
     email: '',
     phone: '',
     date: '',
     time: '',
-    service_type: '',
-    notes: '',
-  });
+    service_type: incomingGowns.some(g => g.intent === 'rent') ? 'rental' : incomingGowns.length ? 'bridal' : '',
+    notes: gownNames.length ? `Interested in: ${gownNames.join(', ')}` : '',
+  }));
 
   const updateForm = (field: string, value: string) => {
     setForm(prev => ({ ...prev, [field]: value }));
     if (error) setError('');
   };
 
   const today = new Date().toISOString().split('T')[0];
 
   const validate = (): boolean => {
     if (!form.name.trim()) { setError(t('appointment.error_name')); return false; }
@@ -72,20 +76,21 @@ export default function AppointmentPage() {
 
     try {
       await createAppointment({
         name: form.name,
         email: form.email,
         phone: form.phone,
         date: form.date,
         time: form.time,
         service_type: form.service_type,
         notes: form.notes,
+        interested_gowns: incomingGowns.length ? incomingGowns : null,
       });
       setIsSubmitted(true);
     } catch (err) {
       console.error('[Riman] Appointment booking failed:', err);
       setError(t('appointment.something_wrong'));
     } finally {
       setIsSubmitting(false);
     }
   };
 
@@ -153,20 +158,30 @@ export default function AppointmentPage() {
             ))}
           </div>
 
           <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-ivory p-8 md:p-12 border border-stone-100">
                 <div className="mb-8">
                   <h2 className="font-heading text-2xl font-light text-stone-800">{t('appointment.your_details')}</h2>
                   <div className="w-8 h-px bg-gold mt-3" />
                 </div>
+                {incomingGowns.length > 0 && (
+                  <div className="mb-6 p-4 border border-gold/30 bg-gold/[0.04]">
+                    <p className="text-[10px] tracking-widest uppercase text-stone-800 font-bold mb-2">{t('appointment.your_gowns')}</p>
+                    <ul className="space-y-1">
+                      {incomingGowns.map((g, i) => (
+                        <li key={`${g.id}-${i}`} className="text-xs text-stone-600 italic">{g.name}{g.size ? ` ┬╖ ${g.size}` : ''}</li>
+                      ))}
+                    </ul>
+                  </div>
+                )}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.full_name')}</label>
                     <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                       <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your full name" className="w-full pl-11 bg-transparent border-0 border-b border-stone-300 focus:border-gold focus:ring-0 rounded-none py-3 outline-none transition-colors duration-500 text-stone-800 placeholder:text-stone-500" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-2">{t('appointment.email')}</label>
diff --git a/src/pages/ProductDetail.tsx b/src/pages/ProductDetail.tsx
index 8c0a946..1b2a001 100644
--- a/src/pages/ProductDetail.tsx
+++ b/src/pages/ProductDetail.tsx
@@ -1,17 +1,17 @@
-import { useParams, Link } from 'react-router-dom';
+import { useParams, Link, useNavigate } from 'react-router-dom';
 import { useState, useMemo, useRef, MouseEvent, Suspense, lazy, useEffect } from 'react';
 import { ShoppingBag, Heart, ChevronRight, ChevronLeft, ChevronDown, Share2, Ruler, ShieldCheck, Truck, Search, Star, CheckCircle2, X, Calendar, Info, Loader2, RotateCcw, Box, Sparkles, MessageCircle, Gem, Wind } from 'lucide-react';
 import { motion, AnimatePresence } from 'motion/react';
 import { products } from '../data/products';
 import { formatPrice, cn, categoryToSlug } from '../lib/utils';
-import { Product } from '../types';
+import { Product, type GownRef } from '../types';
 import { useData } from '../contexts/DataContext';
 import { useCart } from '../contexts/CartContext';
 import { useWishlist } from '../contexts/WishlistContext';
 import { useLanguage } from '../contexts/LanguageContext';
 import { useScrollLock } from '../hooks/useScrollLock';
 import { useFeature } from '../hooks/useFeature';
 import { useToast } from '../contexts/ToastContext';
 import ProductCard from '../components/ProductCard';
 import AvailabilityCalendar from '../components/AvailabilityCalendar';
 import SizeGuide from '../components/SizeGuide';
@@ -26,20 +26,21 @@ interface Review {
   comment: string;
   date: string;
 }
 
 export default function ProductDetail() {
   const { products: dynamicProducts, isLoading } = useData();
   const { id } = useParams();
   const { addItem } = useCart();
   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
   const { t } = useLanguage();
+  const navigate = useNavigate();
   const threeDViewerEnabled = useFeature('threeDViewer');
   const { addToast } = useToast();
   const [selectedSize, setSelectedSize] = useState('');
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
   const [isZoomed, setIsZoomed] = useState(false);
   const [bookingDate, setBookingDate] = useState<Date | null>(null);
   const [showConfirmation, setShowConfirmation] = useState(false);
   const [isAddingToCart, setIsAddingToCart] = useState(false);
   const [reviewSuccess, setReviewSuccess] = useState(false);
@@ -124,20 +125,33 @@ export default function ProductDetail() {
     setCurrentImageIndex((prev) => (prev + 1) % totalAssets);
   };
 
   const prevImage = () => {
     setCurrentImageIndex((prev) => (prev - 1 + totalAssets) % totalAssets);
   };
 
   const isRent = product.productType === 'rent' || product.productType === 'both';
   const isSale = product.productType === 'sale' || product.productType === 'both';
 
+  const reserveViewing = () => {
+    if (product) {
+      if (!isInWishlist(product.id)) addToWishlist(product);
+      const gowns: GownRef[] = [{
+        id: product.id,
+        name: product.name,
+        size: selectedSize || undefined,
+        intent: isRent ? 'rent' : 'sale',
+      }];
+      navigate('/appointment', { state: { gowns } });
+    }
+  };
+
   return (
     <>
       <div id="product-detail-page" className="pt-24 bg-ivory min-h-screen pb-24 lg:pb-12">
         <div className="container mx-auto px-5 py-10">
           {/* Breadcrumbs */}
           <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-400 mb-10">
             <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
             <ChevronRight className="w-3 h-3" />
             <Link to={`/collection/${categoryToSlug(product.category)}`} className="hover:text-gold transition-colors">{product.category}</Link>
             <ChevronRight className="w-3 h-3" />
@@ -361,26 +375,30 @@ export default function ProductDetail() {
                         <button key={size} disabled={!isAvailable} onClick={() => setSelectedSize(size)} className={cn("w-11 h-11 flex items-center justify-center border text-[10px] tracking-widest transition-all", !isAvailable ? "border-stone-100 text-stone-200 cursor-not-allowed" : selectedSize === size ? "border-gold bg-gold text-white" : "border-stone-200 text-stone-600 hover:border-gold")}>
                           {size}
                         </button>
                       );
                     })}
                   </div>
                 </div>
 
                 <div className="flex flex-col sm:flex-row gap-3">
                   <div className="flex-1 flex flex-col gap-2">
-                    <button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full btn-luxury flex items-center justify-center gap-3 relative overflow-hidden">
+                    <button onClick={reserveViewing} className="w-full btn-luxury flex items-center justify-center gap-3">
+                      <Sparkles className="w-4 h-4" />
+                      {t('product.reserve_viewing')}
+                    </button>
+                    <button onClick={handleAddToCart} disabled={isAddingToCart} className="w-full btn-luxury-outline !py-3 flex items-center justify-center gap-3">
                       {isAddingToCart ? (
-                        <Loader2 className="w-4 h-4 animate-spin text-white" />
+                        <Loader2 className="w-4 h-4 animate-spin" />
                       ) : (
                         <>
-                          <ShoppingBag className="w-4 h-4" />
+                          <ShoppingBag className="w-3.5 h-3.5" />
                           {isRent ? t('product.book_rental') : t('product.add_to_collection')}
                         </>
                       )}
                     </button>
                     {errorMsg && (
                       <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-rose-500 uppercase tracking-widest text-center font-bold">
                         {errorMsg}
                       </motion.p>
                     )}
                   </div>
@@ -636,24 +654,30 @@ export default function ProductDetail() {
             </section>
           )}
         </div>
 
         {/* Mobile Sticky Bottom Bar */}
         <div className="fixed bottom-0 left-0 right-0 z-50 bg-ivory border-t border-stone-200 p-4 flex items-center gap-4 lg:hidden">
           <div className="flex-1 min-w-0">
             <p className="font-heading text-[11px] tracking-wider uppercase text-stone-800 truncate">{product.name}</p>
             <p className="font-heading text-sm text-gold"><span className="text-[10px] font-body text-stone-400 uppercase tracking-wider me-1">{t('pricing.from')}</span>{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
           </div>
-          <button onClick={handleAddToCart} disabled={isAddingToCart} className="btn-luxury !py-3 !px-5 text-[10px] flex items-center gap-2 whitespace-nowrap">
-            {isAddingToCart ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <ShoppingBag className="w-3.5 h-3.5" />}
-            {isRent ? t('product.book_rental') : t('product.add_to_collection')}
-          </button>
+          <div className="flex flex-col gap-1.5 shrink-0">
+            <button onClick={reserveViewing} className="btn-luxury !py-2.5 !px-5 text-[10px] flex items-center justify-center gap-2 whitespace-nowrap">
+              <Sparkles className="w-3.5 h-3.5" />
+              {t('product.reserve_viewing')}
+            </button>
+            <button onClick={handleAddToCart} disabled={isAddingToCart} className="btn-luxury-outline !py-2.5 !px-5 text-[10px] flex items-center justify-center gap-2 whitespace-nowrap">
+              {isAddingToCart ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
+              {isRent ? t('product.book_rental') : t('product.add_to_collection')}
+            </button>
+          </div>
           <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-10 h-10 flex items-center justify-center border transition-all shrink-0", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-500")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
             <Heart className={cn("w-4 h-4", saved && "fill-current")} />
           </button>
         </div>
 
         {/* Reservation Confirmation Modal */}
         <AnimatePresence>
           {showConfirmation && bookingDate && (
             <BookingConfirmationModal product={product} date={bookingDate} onClose={() => setShowConfirmation(false)} />
           )}
