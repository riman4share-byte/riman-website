## Commits
85250dd a11y(components): 11px type floor + AA contrast on light surfaces

## Stat
 src/components/AvailabilityCalendar.tsx      | 10 ++++----
 src/components/Footer.tsx                    | 10 ++++----
 src/components/GalleryFilters.tsx            |  2 +-
 src/components/GalleryGrid.tsx               |  4 ++--
 src/components/GalleryLightbox.tsx           |  2 +-
 src/components/GlobalFeatures.tsx            |  8 +++----
 src/components/Header.tsx                    | 20 ++++++++--------
 src/components/ImmersiveUI.tsx               |  2 +-
 src/components/InstagramSection.tsx          |  6 ++---
 src/components/MobileBottomNav.tsx           |  4 ++--
 src/components/ProductCard.tsx               | 36 ++++++++++++++--------------
 src/components/SizeGuide.tsx                 | 18 +++++++-------
 src/components/ThreeDViewer.tsx              | 10 ++++----
 src/components/ToastContainer.tsx            |  4 ++--
 src/components/luxury/HorizontalLookbook.tsx | 10 ++++----
 src/components/luxury/Marquee.tsx            |  4 ++--
 src/components/luxury/StatCounter.tsx        |  2 +-
 17 files changed, 76 insertions(+), 76 deletions(-)

## Diff
diff --git a/src/components/AvailabilityCalendar.tsx b/src/components/AvailabilityCalendar.tsx
index 8f1b70d..d2e7740 100644
--- a/src/components/AvailabilityCalendar.tsx
+++ b/src/components/AvailabilityCalendar.tsx
@@ -53,21 +53,21 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
         </div>
       </div>
     );
   };
 
   const renderDays = () => {
     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
     return (
       <div className="grid grid-cols-7 mb-2">
         {days.map(day => (
-          <div key={day} className="text-[8px] font-bold text-stone-400 uppercase tracking-widest text-center py-2">
+          <div key={day} className="text-micro font-bold text-stone-600 uppercase tracking-widest text-center py-2">
             {day}
           </div>
         ))}
       </div>
     );
   };
 
   const renderCells = () => {
     const monthStart = startOfMonth(currentMonth);
     const monthEnd = endOfMonth(monthStart);
@@ -85,24 +85,24 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
           const isBooked = bookedDates.some(booked => isSameDay(booked, date));
           const isPast = isBefore(date, today);
           const isCurrentMonth = isSameMonth(date, monthStart);
           const isSelected = selectedDate && isSameDay(date, selectedDate);
 
           return (
             <div
               key={i}
               onClick={() => !isBooked && !isPast && isCurrentMonth && onDateSelect?.(date)}
               className={cn(
-                "relative aspect-square flex flex-col items-center justify-center text-[10px] transition-all bg-ivory",
+                "relative aspect-square flex flex-col items-center justify-center text-micro transition-all bg-ivory",
                 loading && "opacity-50",
                 !isCurrentMonth && "text-stone-200",
-                (isBooked || isPast) && isCurrentMonth && "bg-stone-50 text-stone-300 cursor-not-allowed",
+                (isBooked || isPast) && isCurrentMonth && "bg-stone-50 text-stone-500 cursor-not-allowed",
                 isCurrentMonth && !isBooked && !isPast && "hover:bg-ivory cursor-pointer text-stone-700",
                 isSelected && "bg-gold text-white hover:bg-gold-dark"
               )}
             >
               <span>{format(date, 'd')}</span>
               {isBooked && isCurrentMonth && (
                 <div className="absolute bottom-1 w-1 h-1 bg-stone-200 rounded-full" />
               )}
             </div>
           );
@@ -112,20 +112,20 @@ export default function AvailabilityCalendar({ productId, bookedDates: initialBo
   };
 
   return (
     <div className="bg-ivory p-4">
       {renderHeader()}
       {renderDays()}
       {renderCells()}
       <div className="mt-6 flex flex-wrap gap-4 justify-center">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-gold rounded-full" />
-          <span className="text-[8px] uppercase tracking-widest text-stone-400">Available</span>
+          <span className="text-micro uppercase tracking-widest text-stone-600">Available</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-stone-100 rounded-full" />
-          <span className="text-[8px] uppercase tracking-widest text-stone-400">Booked</span>
+          <span className="text-micro uppercase tracking-widest text-stone-600">Booked</span>
         </div>
       </div>
     </div>
   );
 }
\ No newline at end of file
diff --git a/src/components/Footer.tsx b/src/components/Footer.tsx
index 0896a56..d79f16b 100644
--- a/src/components/Footer.tsx
+++ b/src/components/Footer.tsx
@@ -86,23 +86,23 @@ export default function Footer() {
               {t('footer.newsletter_text')}
             </p>
             <form onSubmit={handleSubmit(onNewsletterSubmit)} className="relative group">
               <input 
                 {...register('email')}
                 type="email" 
                 placeholder={t('footer.newsletter_placeholder')}
                 className="w-full bg-transparent border-b border-stone-800 focus:border-gold py-3 md:py-4 pr-12 text-sm font-body tracking-[0.15em] outline-none transition-all placeholder:text-stone-700"
               />
               <button type="submit" className="absolute right-0 bottom-3 md:bottom-4 text-gold hover:translate-x-1 transition-transform">
-                {isSubmitSuccessful ? <span className="text-[10px] tracking-widest">{t('footer.submitted')}</span> : <ArrowRight className="w-5 h-5" />}
+                {isSubmitSuccessful ? <span className="text-micro tracking-widest">{t('footer.submitted')}</span> : <ArrowRight className="w-5 h-5" />}
               </button>
-              {errors.email && <p className="absolute top-full mt-2 text-red-500 text-[10px] uppercase tracking-widest">{errors.email.message}</p>}
+              {errors.email && <p className="absolute top-full mt-2 text-red-500 text-micro uppercase tracking-widest">{errors.email.message}</p>}
             </form>
           </div>
         </div>
 
         {/* Mobile: Collapsible Sections / Desktop: Grid */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-12 mb-12 text-center md:text-left">
           {/* Brand - Always visible */}
           <div className="md:col-span-4 pb-8 md:pb-0 border-b border-white/5 md:border-0">
             <Link to="/" className="block mb-6 md:mb-10">
               <Logo variant="gold" className="w-24 md:w-36 mx-auto md:mx-0 md:ml-2" showText={false} />
@@ -174,26 +174,26 @@ export default function Footer() {
           <button 
             onClick={scrollToTop}
             className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/40 hover:text-gold transition-colors font-bold"
           >
             <ChevronUp className="w-4 h-4" /> {t('footer.ascend')}
           </button>
         </div>
 
         {/* Bottom Bar */}
         <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
-          <p className="font-body text-[10px] text-stone-600 uppercase tracking-[0.2em] text-center md:text-left">
+          <p className="font-body text-micro text-stone-600 uppercase tracking-[0.2em] text-center md:text-left">
             ┬⌐ {new Date().getFullYear()} ATELIER RIMAN. {t('footer.rights')}
           </p>
           <div className="flex gap-6">
-            <Link to="/privacy" className="font-body text-[10px] text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.privacy')}</Link>
-            <Link to="/terms" className="font-body text-[10px] text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.legal')}</Link>
+            <Link to="/privacy" className="font-body text-micro text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.privacy')}</Link>
+            <Link to="/terms" className="font-body text-micro text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.legal')}</Link>
           </div>
         </div>
       </div>
     </footer>
   );
 }
 
 function FooterLink({ to, children }: { to: string, children: React.ReactNode }) {
   return (
     <li>
diff --git a/src/components/GalleryFilters.tsx b/src/components/GalleryFilters.tsx
index cc86718..3266fa1 100644
--- a/src/components/GalleryFilters.tsx
+++ b/src/components/GalleryFilters.tsx
@@ -19,21 +19,21 @@ interface GalleryFiltersProps {
 export default function GalleryFilters({ activeCategory, onCategoryChange, className }: GalleryFiltersProps) {
   const { t } = useLanguage();
 
   return (
     <div className={cn('flex flex-wrap gap-3 justify-center', className)}>
       {CATEGORIES.map((cat) => (
         <button
           key={cat.key}
           onClick={() => onCategoryChange(cat.key)}
           className={cn(
-            'relative px-5 py-2 text-[10px] tracking-[0.3em] uppercase font-bold transition-all duration-300 border overflow-hidden',
+            'relative px-5 py-2 text-micro tracking-[0.3em] uppercase font-bold transition-all duration-300 border overflow-hidden',
             activeCategory === cat.key
               ? 'bg-gold text-onyx border-gold'
               : 'border-stone-200 text-stone-600 hover:border-gold hover:text-gold'
           )}
         >
           {activeCategory === cat.key && (
             <motion.span
               layoutId="activeFilter"
               className="absolute inset-0 bg-gold"
               transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
diff --git a/src/components/GalleryGrid.tsx b/src/components/GalleryGrid.tsx
index 5077fc9..0592a2d 100644
--- a/src/components/GalleryGrid.tsx
+++ b/src/components/GalleryGrid.tsx
@@ -63,21 +63,21 @@ function GalleryVideoItem({ item, onClick, index }: { item: GalleryItem; onClick
         poster={item.thumbnail_url || undefined}
         muted
         loop
         playsInline
         preload="metadata"
         className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
       />
       <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-colors duration-300" />
       <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <Play className="w-4 h-4 text-white fill-white" />
-        <span className="text-white text-[10px] tracking-widest uppercase font-bold">{item.title}</span>
+        <span className="text-white text-micro tracking-widest uppercase font-bold">{item.title}</span>
       </div>
     </motion.div>
   );
 }
 
 function GalleryPhotoItem({ item, onClick, index }: { item: GalleryItem; onClick: () => void; index: number; key?: string }) {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
@@ -88,21 +88,21 @@ function GalleryPhotoItem({ item, onClick, index }: { item: GalleryItem; onClick
     >
       <img
         src={item.media_url}
         alt={item.title}
         loading="lazy"
         className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
       />
       <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-colors duration-300" />
       <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <ImageIcon className="w-4 h-4 text-white" />
-        <span className="text-white text-[10px] tracking-widest uppercase font-bold">{item.title}</span>
+        <span className="text-white text-micro tracking-widest uppercase font-bold">{item.title}</span>
       </div>
     </motion.div>
   );
 }
 
 export default function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
   return (
     <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
       {items.map((item, index) =>
         item.media_type === 'video' ? (
diff --git a/src/components/GalleryLightbox.tsx b/src/components/GalleryLightbox.tsx
index d60d794..27e5128 100644
--- a/src/components/GalleryLightbox.tsx
+++ b/src/components/GalleryLightbox.tsx
@@ -133,19 +133,19 @@ export default function GalleryLightbox({ items, currentIndex, isOpen, onClose,
                 className="max-w-full max-h-[85vh] object-contain"
               />
             )}
           </motion.div>
 
           {/* Caption */}
           <div className="absolute bottom-6 left-0 right-0 text-center z-[1001]">
             <h3 className="text-white font-heading text-lg tracking-widest uppercase mb-1">
               {currentItem.title}
             </h3>
-            <p className="text-gold text-[10px] tracking-[0.3em] uppercase">
+            <p className="text-gold text-micro tracking-[0.3em] uppercase">
               {currentItem.category.replace('_', ' ')}
             </p>
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 }
diff --git a/src/components/GlobalFeatures.tsx b/src/components/GlobalFeatures.tsx
index 6c117d8..241a37c 100644
--- a/src/components/GlobalFeatures.tsx
+++ b/src/components/GlobalFeatures.tsx
@@ -61,32 +61,32 @@ export default function GlobalFeatures() {
             initial={{ opacity: 0, scale: 0.9, y: 50 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 50 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm"
           >
             <div className="bg-ivory max-w-lg w-full p-10 relative overflow-hidden border border-stone-200"
                  role="dialog"
                  aria-modal="true">
               <button 
                 onClick={handleDismissNewsletter}
-                className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors"
+                className="absolute top-4 right-4 text-stone-600 hover:text-stone-800 transition-colors"
                 aria-label="Close"
               >
                 <X className="w-5 h-5" />
               </button>
               
               <div className="text-center">
                 <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                   <Mail className="w-8 h-8" />
                 </div>
                 <h3 className="font-heading text-3xl text-stone-800 mb-4 tracking-wider uppercase">The Atelier Circle</h3>
-                <p className="text-stone-500 text-sm mb-8 leading-relaxed italic">Join for exclusive previews of our new bridal collections and private viewings in Sharjah.</p>
+                <p className="text-stone-600 text-sm mb-8 leading-relaxed italic">Join for exclusive previews of our new bridal collections and private viewings in Sharjah.</p>
                 
                 <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleDismissNewsletter(); }}>
                   <input 
                     type="email" 
                     placeholder="E-mail Address" 
                     className="w-full px-6 py-4 bg-stone-50 border border-stone-200 text-xs tracking-widest uppercase outline-none focus:border-gold"
                     aria-label="Email address"
                   />
                   <button className="w-full btn-luxury">Join The Society</button>
                 </form>
@@ -100,27 +100,27 @@ export default function GlobalFeatures() {
       <AnimatePresence>
         {showCookies && (
           <motion.div 
             initial={{ y: 100 }}
             animate={{ y: 0 }}
             exit={{ y: 100 }}
             className="fixed bottom-0 left-0 w-full z-[150] bg-ivory border-t border-stone-200 p-6 md:p-8"
           >
             <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="text-center md:text-left">
-                <p className="text-[10px] tracking-widest uppercase text-stone-500 mb-1">Privacy & Elegance</p>
+                <p className="text-micro tracking-widest uppercase text-stone-600 mb-1">Privacy & Elegance</p>
                 <p className="text-xs text-stone-800 tracking-wide">We use cookies to curate a personalized atelier experience. <Link to="/privacy" className="underline hover:text-gold">Learn details</Link>.</p>
               </div>
               <div className="flex gap-4">
                 <button 
                   onClick={handleAcceptCookies}
-                  className="px-8 py-3 bg-stone-900 text-white text-[10px] tracking-[0.2em] uppercase hover:bg-stone-800 transition-all font-bold"
+                  className="px-8 py-3 bg-stone-900 text-white text-micro tracking-[0.2em] uppercase hover:bg-stone-800 transition-all font-bold"
                 >
                   Accept & Explore
                 </button>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </>
   );
diff --git a/src/components/Header.tsx b/src/components/Header.tsx
index c970020..99cd957 100644
--- a/src/components/Header.tsx
+++ b/src/components/Header.tsx
@@ -122,21 +122,21 @@ export default function Header() {
               id="logo"
               className="flex flex-col items-center group py-2"
             >
               <Logo 
                 variant="gold" 
                 className={cn("transition-all duration-700", !isHome ? "w-10" : "w-14")}
                 showText={false}
               />
               <span className={cn(
                 "text-xs tracking-[0.5em] uppercase mt-2 transition-all duration-700 font-heading font-bold",
-                (!isHome) ? "text-stone-500 opacity-100" : "text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
+                (!isHome) ? "text-stone-600 opacity-100" : "text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
               )}>
                 {isHome ? 'Atelier' : 'Riman'}
               </span>
             </Link>
           </motion.div>
         </div>
 
         {/* Right Layer: Secondary Nav + Actions */}
         <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
           <nav className="hidden xl:flex items-center gap-4 mr-4 border-r border-stone-200 pr-4">
@@ -156,32 +156,32 @@ export default function Header() {
             ))}
           </nav>
 
           <div className="flex items-center gap-3 md:gap-4">
             <Link to="/style-quiz" className="hover:text-gold transition-colors" aria-label="Style Quiz">
               <Sparkles className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
             </Link>
             <Link to="/wishlist" className="hidden lg:block relative group/wishlist hover:text-gold transition-colors" aria-label="Your Selection">
               <Heart className={cn("w-6 h-6 transition-transform group-hover/wishlist:scale-110", (!isHome) ? "text-stone-800" : "text-white")} />
               {wishlistCount > 0 && (
-                <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold shadow-sm">
+                <span className="absolute -top-1 -right-1 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center font-bold shadow-sm rounded-full leading-none">
                   {wishlistCount}
                 </span>
               )}
             </Link>
             <Link to="/profile" className="hidden md:block hover:text-gold transition-colors" aria-label="Account">
               <User className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
             </Link>
             <Link to="/checkout" className="hidden md:block relative group/cart">
               <ShoppingBag className={cn("w-6 h-6 transition-transform group-hover/cart:scale-110", (!isHome) ? "text-stone-800" : "text-white")} />
               {totalItems > 0 && (
-                <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold shadow-sm">
+                <span className="absolute -top-1 -right-1 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center font-bold shadow-sm rounded-full leading-none">
                   {totalItems}
                 </span>
               )}
             </Link>
           </div>
         </div>
       </div>
 
       {/* Mobile Sidebar Navigation */}
       <AnimatePresence>
@@ -215,49 +215,49 @@ export default function Header() {
                   aria-label="Close menu"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>
               <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
 
                <div className="flex-1 overflow-y-auto px-5 py-6">
                 {/* Primary Navigation */}
                 <div className="mb-5">
-                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.collections')}</p>
+                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.collections')}</p>
                   <nav className="flex flex-col gap-1">
                     {[
                       { label: 'Bridal', path: '/collection/bridal', key: 'nav.bridal' },
                       { label: 'Evening', path: '/collection/evening', key: 'nav.evening' },
                       { label: 'Rentals', path: '/collection/rental', key: 'nav.rentals' },
                     ].map((link, idx) => (
                       <motion.div
                         key={link.path}
                         initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.1 + idx * 0.03 }}
                       >
                         <Link
                           to={link.path}
                           onClick={() => setIsMenuOpen(false)}
                           className="group flex items-center justify-between font-heading text-xs tracking-wide text-stone-800 py-2.5 px-3 border border-stone-100 hover:border-gold hover:bg-gold/5 transition-all"
                         >
                           <span>{link.key ? t(link.key) : link.label}</span>
-                          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-gold transition-colors" />
+                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                         </Link>
                       </motion.div>
                     ))}
                   </nav>
                 </div>
 
                 {/* Atelier Links */}
                 <div className="mb-5">
-                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.atelier')}</p>
+                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.atelier')}</p>
                   <nav className="flex flex-col gap-1">
                     {[
                       { label: 'Our Story', path: '/about', key: 'nav.about' },
                       { label: 'Gallery', path: '/gallery', key: 'nav.gallery' },
                       { label: 'Style Quiz', path: '/style-quiz', key: 'nav.style_quiz', icon: Sparkles },
                     ].map((link, idx) => (
                       <motion.div
                         key={link.path}
                         initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                         animate={{ opacity: 1, x: 0 }}
@@ -265,30 +265,30 @@ export default function Header() {
                       >
                         <Link
                           to={link.path}
                           onClick={() => setIsMenuOpen(false)}
                           className="group flex items-center justify-between font-heading text-xs tracking-wide text-stone-700 py-2.5 px-3 border border-stone-100 hover:border-gold hover:bg-gold/5 transition-all"
                         >
                           <span className="flex items-center gap-2">
                             {link.icon && <link.icon className="w-3.5 h-3.5 text-gold" />}
                             {link.key ? t(link.key) : link.label}
                           </span>
-                          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-gold transition-colors" />
+                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                         </Link>
                       </motion.div>
                     ))}
                   </nav>
                 </div>
 
                 {/* Services */}
                 <div className="mb-5">
-                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.services')}</p>
+                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.services')}</p>
                   <nav className="flex flex-col gap-1">
                     {[
                       { label: 'Book Appointment', path: '/appointment', key: 'nav.appointment', icon: Calendar },
                       { label: 'Alterations', path: '/alterations', key: 'nav.alterations', icon: Scissors },
                       { label: 'FAQ', path: '/faq', key: 'nav.faq', icon: HelpCircle },
                       { label: 'Contact', path: '/contact', key: 'nav.contact', icon: Phone },
                     ].map((link, idx) => (
                       <motion.div
                         key={link.path}
                         initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
@@ -297,37 +297,37 @@ export default function Header() {
                       >
                         <Link
                           to={link.path}
                           onClick={() => setIsMenuOpen(false)}
                           className="group flex items-center justify-between font-heading text-xs tracking-wide text-stone-700 py-2.5 px-3 border border-stone-100 hover:border-gold hover:bg-gold/5 transition-all"
                         >
                           <span className="flex items-center gap-2">
                             {link.icon && <link.icon className="w-3.5 h-3.5 text-gold" />}
                             {link.key ? t(link.key) : link.label}
                           </span>
-                          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-gold transition-colors" />
+                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                         </Link>
                       </motion.div>
                     ))}
                   </nav>
                 </div>
 
                 {/* CTA Button */}
                 <Link 
                   to="/appointment" 
                   onClick={() => setIsMenuOpen(false)}
                   className="block w-full btn-luxury text-center py-3 text-xs"
                 >
                   {t('cta.appointment')}
                 </Link>
               </div>
 
               <div className="p-4 mt-auto bg-ivory border-t border-stone-100">
-                <span className="text-[9px] tracking-widest uppercase text-stone-400 block text-center">{t('header.tagline')}</span>
+                <span className="text-micro tracking-widest uppercase text-stone-600 block text-center">{t('header.tagline')}</span>
               </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>
     </header>
   );
 }
diff --git a/src/components/ImmersiveUI.tsx b/src/components/ImmersiveUI.tsx
index 4a0bb07..b3ea02a 100644
--- a/src/components/ImmersiveUI.tsx
+++ b/src/components/ImmersiveUI.tsx
@@ -127,21 +127,21 @@ export default function ImmersiveUI() {
                     initial={{ y: '110%' }}
                     animate={{ y: 0 }}
                     transition={{ duration: 0.9, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] }}
                     className="inline-block"
                   >
                     {letter}
                   </motion.span>
                 ))}
               </h1>
             </div>
-            <div className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.35em] text-gold/60">
+            <div className="absolute bottom-8 left-8 text-micro uppercase tracking-[0.35em] text-gold/60">
               Maison de Couture
             </div>
             <div className="absolute bottom-8 right-8 text-sm tabular-nums text-ivory">
               {String(count).padStart(2, '0')}<span className="text-ivory/40"> / 100</span>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
 
       {/* Custom Global Cursor ΓÇö only on desktop, when enabled, and not prefers-reduced-motion */}
diff --git a/src/components/InstagramSection.tsx b/src/components/InstagramSection.tsx
index eba891c..32ceef7 100644
--- a/src/components/InstagramSection.tsx
+++ b/src/components/InstagramSection.tsx
@@ -12,32 +12,32 @@ const instaPosts = [
 ];
 
 export default function InstagramSection() {
   const { t } = useLanguage();
 
   return (
     <section className="py-32 bg-ivory overflow-hidden">
       <div className="container mx-auto px-6 mb-16 text-center">
         <div className="flex items-center justify-center gap-3 text-gold mb-4">
            <Instagram className="w-5 h-5" />
-           <span className="text-[12px] tracking-[0.4em] uppercase font-bold">@rimanfashion</span>
+           <span className="text-caption tracking-[0.4em] uppercase font-bold">@rimanfashion</span>
         </div>
         <h2 className="heading-display text-4xl md:text-6xl text-stone-900 tracking-tight">{t('instagram.title')}</h2>
         <div className="flex justify-center mt-10">
           <a 
             href="https://www.instagram.com/rimanfashion/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="group flex items-center gap-3 px-10 py-4 bg-onyx text-white hover:text-gold transition-all duration-500"
           >
             <Instagram className="w-4 h-4" />
-            <span className="text-[10px] tracking-[0.3em] uppercase font-bold transition-colors">
+            <span className="text-micro tracking-[0.3em] uppercase font-bold transition-colors">
               {t('instagram.follow')}
             </span>
           </a>
         </div>
         <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent mx-auto mt-12" />
       </div>
 
       <div className="flex gap-4 md:gap-8 overflow-hidden">
         <motion.div 
           initial={{ x: 0 }}
@@ -54,21 +54,21 @@ export default function InstagramSection() {
               className="min-w-[280px] md:min-w-[350px] aspect-square relative group overflow-hidden block"
             >
                <img 
                 src={post.img} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 alt={`Riman Fashion gallery ${idx + 1}`} 
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Instagram className="text-white w-8 h-8" />
-                 <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">{t('instagram.view_aura')}</span>
+                 <span className="text-micro text-white uppercase tracking-[0.2em] font-bold">{t('instagram.view_aura')}</span>
               </div>
             </a>
           ))}
         </motion.div>
       </div>
 
       <div className="mt-16 text-center">
         <a 
           href="https://www.instagram.com/rimanfashion/" 
           target="_blank" 
diff --git a/src/components/MobileBottomNav.tsx b/src/components/MobileBottomNav.tsx
index 069f1f0..7939999 100644
--- a/src/components/MobileBottomNav.tsx
+++ b/src/components/MobileBottomNav.tsx
@@ -25,22 +25,22 @@ export default function MobileBottomNav() {
         return (
           <Link 
             key={item.path} 
             to={item.path}
             className={cn(
               "flex flex-col items-center justify-center gap-1 transition-colors relative",
               isActive ? "text-gold" : "text-stone-400"
             )}
           >
             <Icon className="w-5 h-5" />
-            <span className="text-[10px] uppercase tracking-tighter font-black">{item.label}</span>
+            <span className="text-micro uppercase tracking-tighter font-black">{item.label}</span>
             {item.badge !== undefined && item.badge > 0 && (
-              <span className="absolute top-2 right-4 bg-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none font-bold">
+              <span className="absolute top-2 right-4 bg-gold text-white text-micro min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full leading-none font-bold">
                 {item.badge}
               </span>
             )}
           </Link>
         );
       })}
     </nav>
   );
 }
diff --git a/src/components/ProductCard.tsx b/src/components/ProductCard.tsx
index bf9e481..e52c132 100644
--- a/src/components/ProductCard.tsx
+++ b/src/components/ProductCard.tsx
@@ -94,46 +94,46 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
             className={cn(
               "w-full h-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]",
               !imageLoaded && "opacity-0"
             )}
           />
         </Link>
         
         {/* Badges ΓÇö above link, pointer-events-none so clicks pass through */}
         <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
           {product.isNew && (
-            <span className="bg-gold text-white text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 font-bold">
+            <span className="bg-gold text-white text-micro tracking-[0.3em] uppercase px-4 py-1.5 font-bold">
               {t('badge.new')}
             </span>
           )}
           {product.isFeatured && (
-            <span className="bg-onyx text-white text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 font-bold">
+            <span className="bg-onyx text-white text-micro tracking-[0.3em] uppercase px-4 py-1.5 font-bold">
               {t('badge.featured')}
             </span>
           )}
           {product.glbUrl && (
-            <span className="bg-ivory/90 backdrop-blur-md text-onyx text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 flex items-center gap-2 font-bold border border-onyx/10">
+            <span className="bg-ivory/90 backdrop-blur-md text-onyx text-micro tracking-[0.3em] uppercase px-4 py-1.5 flex items-center gap-2 font-bold border border-onyx/10">
               <Box className="w-3 h-3 text-gold" />
               {t('badge.3d')}
             </span>
           )}
         </div>
 
         {/* Mobile Quick Actions Trigger */}
         <button 
           onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             setShowMobileActions(!showMobileActions);
           }}
           className={cn(
-            "md:hidden absolute bottom-0 left-0 right-0 z-20 py-3 text-[10px] tracking-[0.2em] uppercase font-body flex items-center justify-center gap-2 transition-all duration-300",
+            "md:hidden absolute bottom-0 left-0 right-0 z-20 py-3 text-micro tracking-[0.2em] uppercase font-body flex items-center justify-center gap-2 transition-all duration-300",
             showMobileActions 
               ? "bg-onyx text-white" 
               : "bg-gold/90 text-white backdrop-blur-sm"
           )}
           aria-label={showMobileActions ? 'Close quick shop' : 'Open quick shop'}
         >
           <ShoppingBag className="w-3 h-3" />
           {showMobileActions ? 'Close' : t('product.quick_shop')}
         </button>
 
@@ -145,32 +145,32 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
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
-                <span className="text-[9px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('product.select_size')}</span>
-                <button onClick={cancelSizeSelection} className="text-stone-400 hover:text-stone-800 transition-colors">
-                  <span className="text-[9px] tracking-widest uppercase">{t('product.cancel')}</span>
+                <span className="text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('product.select_size')}</span>
+                <button onClick={cancelSizeSelection} className="text-stone-600 hover:text-stone-800 transition-colors">
+                  <span className="text-micro tracking-widest uppercase">{t('product.cancel')}</span>
                 </button>
               </div>
               <div className="flex flex-wrap gap-1.5">
                 {product.sizes.map((size) => (
                   <button
                     key={size}
                     onClick={(e) => handleSizeSelect(size, e)}
                     className={cn(
-                      "min-w-[2.5rem] h-9 px-2 flex items-center justify-center border text-[10px] tracking-wider transition-all",
+                      "min-w-[2.5rem] h-9 px-2 flex items-center justify-center border text-micro tracking-wider transition-all",
                       selectedSize === size
                         ? "border-gold bg-gold text-white"
                         : "border-stone-300 text-stone-600 hover:border-gold hover:text-gold"
                     )}
                   >
                     {size}
                   </button>
                 ))}
               </div>
             </motion.div>
@@ -178,21 +178,21 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
 
           {/* Slim bar with two actions */}
           <div className={cn(
             "flex bg-onyx/95 backdrop-blur-sm border-t border-gold/20 transition-all duration-500",
             showMobileActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
             "md:group-hover:opacity-100 md:group-hover:translate-y-0"
           )}>
             <button
               onClick={handleQuickAdd}
               className={cn(
-                "flex-1 py-3 text-[10px] tracking-[0.2em] uppercase font-body transition-all duration-300 flex items-center justify-center gap-1.5",
+                "flex-1 py-3 text-micro tracking-[0.2em] uppercase font-body transition-all duration-300 flex items-center justify-center gap-1.5",
                 isAdded
                   ? "text-emerald-400"
                   : "text-white hover:text-gold"
               )}
             >
               {isAdded ? (
                 <>
                   <CheckCircle2 className="w-3.5 h-3.5" />
                   {t('product.added')}
                 </>
@@ -200,77 +200,77 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
                 <>
                   <ShoppingBag className="w-3.5 h-3.5" />
                   {t('product.quick_add')}
                 </>
               )}
             </button>
             <div className="w-px bg-white/10" />
             <button
               onClick={toggleWishlist}
               className={cn(
-                "flex-1 py-3 text-[10px] tracking-[0.2em] uppercase font-body transition-colors duration-300 flex items-center justify-center gap-1.5",
+                "flex-1 py-3 text-micro tracking-[0.2em] uppercase font-body transition-colors duration-300 flex items-center justify-center gap-1.5",
                 saved
                   ? "text-rose-400"
                   : "text-white/70 hover:text-rose-400"
               )}
             >
               <Heart className={cn("w-3.5 h-3.5", saved && "fill-current")} />
               {saved ? t('product.in_wishlist') : t('product.add_wishlist')}
             </button>
           </div>
         </div>
       </div>
 
       <div className="flex justify-between items-start">
         <div>
-          <p className="text-[10px] tracking-widest text-stone-500 uppercase mb-1">{product.category}</p>
+          <p className="text-micro tracking-widest text-stone-600 uppercase mb-1">{product.category}</p>
         {lookNumber && (
-          <span className="font-label text-[10px] tracking-[0.3em] uppercase text-gold">
+          <span className="font-label text-micro tracking-[0.3em] uppercase text-gold">
             {t('silhouettes.look')} {lookNumber}
           </span>
         )}
           <Link to={`/product/${product.id}`} className="block font-heading text-xl text-stone-900 tracking-tight hover:text-gold transition-colors leading-[1.1]">
             {product.name}
         </Link>
         {product.fabric && (
-          <p className="font-editorial italic text-sm text-stone-500">{product.fabric}</p>
+          <p className="font-editorial italic text-sm text-stone-600">{product.fabric}</p>
         )}
 
         {/* Expanding gold frame ΓÇö couture hover detail */}
         <span className="absolute inset-3 border border-gold/0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:inset-4 group-hover:border-gold/40 pointer-events-none z-10" aria-hidden="true" />
         
           <div className="mt-2 flex flex-col gap-1">
             {isSale && (
               <p className="text-xs tracking-wider text-stone-600">
-                {t('product.purchase')}: <span className="font-semibold text-stone-800"><span className="me-1 text-[9px] uppercase tracking-wider text-stone-400">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
+                {t('product.purchase')}: <span className="font-semibold text-stone-800"><span className="me-1 text-micro uppercase tracking-wider text-stone-600">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
               </p>
             )}
             {isRent && (
-              <p className="text-xs tracking-wider text-stone-500">
-                {t('product.rent')}: <span className="text-stone-700"><span className="me-1 text-[9px] uppercase tracking-wider text-stone-400">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
+              <p className="text-xs tracking-wider text-stone-600">
+                {t('product.rent')}: <span className="text-stone-700"><span className="me-1 text-micro uppercase tracking-wider text-stone-600">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
               </p>
             )}
           </div>
 
           <Link
             to={`/product/${product.id}`}
-            className="inline-flex items-center gap-1.5 font-label text-[10px] tracking-[0.25em] uppercase text-stone-800 hover:text-gold transition-colors duration-500 mt-2"
+            className="inline-flex items-center gap-1.5 font-label text-micro tracking-[0.25em] uppercase text-stone-800 hover:text-gold transition-colors duration-500 mt-2"
           >
             {t('silhouettes.enquire')}
             <ArrowRight className="w-3 h-3" />
           </Link>
         </div>
         
         <button 
           onClick={toggleWishlist}
           className={cn(
             "p-2 transition-colors",
-            saved ? "text-rose-400" : "text-stone-300 hover:text-rose-400"
+            saved ? "text-rose-400" : "text-stone-500 hover:text-rose-400"
           )}
           aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
         >
           <Heart className={cn("w-5 h-5", saved && "fill-current")} />
         </button>
       </div>
     </motion.div>
   );
 }
diff --git a/src/components/SizeGuide.tsx b/src/components/SizeGuide.tsx
index 2f43f5b..f88e70a 100644
--- a/src/components/SizeGuide.tsx
+++ b/src/components/SizeGuide.tsx
@@ -33,67 +33,67 @@ export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
           <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 20 }}
             className="relative w-full max-w-lg bg-ivory border border-stone-100 max-h-[90vh] overflow-y-auto"
             role="dialog"
             aria-modal="true"
           >
             <div className="sticky top-0 bg-ivory border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10">
               <h3 className="font-heading text-lg text-stone-800 tracking-widest uppercase">{t('size_guide.title')}</h3>
-              <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-800 transition-colors" aria-label="Close size guide">
+              <button onClick={onClose} className="p-2 text-stone-600 hover:text-stone-800 transition-colors" aria-label="Close size guide">
                 <X className="w-5 h-5" />
               </button>
             </div>
 
             <div className="p-6">
-              <p className="font-body text-stone-500 text-sm leading-relaxed mb-6">
+              <p className="font-body text-stone-600 text-sm leading-relaxed mb-6">
                 {t('size_guide.desc')}
               </p>
 
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b border-stone-200">
-                      <th className="text-left py-3 px-2 font-heading text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('size_guide.size')}</th>
-                      <th className="text-left py-3 px-2 font-heading text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('size_guide.bust')}</th>
-                      <th className="text-left py-3 px-2 font-heading text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('size_guide.waist')}</th>
-                      <th className="text-left py-3 px-2 font-heading text-[10px] tracking-[0.2em] uppercase text-stone-500 font-bold">{t('size_guide.hips')}</th>
+                      <th className="text-left py-3 px-2 font-heading text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('size_guide.size')}</th>
+                      <th className="text-left py-3 px-2 font-heading text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('size_guide.bust')}</th>
+                      <th className="text-left py-3 px-2 font-heading text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('size_guide.waist')}</th>
+                      <th className="text-left py-3 px-2 font-heading text-micro tracking-[0.2em] uppercase text-stone-600 font-bold">{t('size_guide.hips')}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {sizes.map(s => (
                       <tr key={s.label} className="border-b border-stone-100 hover:bg-ivory/50 transition-colors">
                         <td className="py-3 px-2 font-heading font-bold text-stone-800 text-xs tracking-wider">{s.label}</td>
                         <td className="py-3 px-2 font-body text-stone-600">{s.bust} {t('size_guide.cm')}</td>
                         <td className="py-3 px-2 font-body text-stone-600">{s.waist} {t('size_guide.cm')}</td>
                         <td className="py-3 px-2 font-body text-stone-600">{s.hips} {t('size_guide.cm')}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
 
               <div className="mt-6 pt-6 border-t border-stone-100">
                 <h4 className="font-heading text-xs tracking-widest uppercase text-stone-800 font-bold mb-3">{t('size_guide.how_to_measure')}</h4>
                 <div className="space-y-3">
                   <div className="flex gap-3">
                     <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
-                    <p className="font-body text-stone-500 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_bust')}</span> {t('size_guide.measure_bust_desc')}</p>
+                    <p className="font-body text-stone-600 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_bust')}</span> {t('size_guide.measure_bust_desc')}</p>
                   </div>
                   <div className="flex gap-3">
                     <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
-                    <p className="font-body text-stone-500 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_waist')}</span> {t('size_guide.measure_waist_desc')}</p>
+                    <p className="font-body text-stone-600 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_waist')}</span> {t('size_guide.measure_waist_desc')}</p>
                   </div>
                   <div className="flex gap-3">
                     <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
-                    <p className="font-body text-stone-500 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_hips')}</span> {t('size_guide.measure_hips_desc')}</p>
+                    <p className="font-body text-stone-600 text-sm"><span className="text-stone-800 font-semibold">{t('size_guide.measure_hips')}</span> {t('size_guide.measure_hips_desc')}</p>
                   </div>
                 </div>
               </div>
 
               <div className="mt-6 p-4 bg-gold/5 border border-gold/20">
                 <p className="font-body text-stone-600 text-sm leading-relaxed">
                   <span className="font-bold text-gold">{t('size_guide.alterations_title')}</span> {t('size_guide.alterations_desc')}
                 </p>
               </div>
             </div>
diff --git a/src/components/ThreeDViewer.tsx b/src/components/ThreeDViewer.tsx
index 3171eab..73ecedd 100644
--- a/src/components/ThreeDViewer.tsx
+++ b/src/components/ThreeDViewer.tsx
@@ -113,61 +113,61 @@ const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ src, poster, alt, className
                 >
                   <div className="relative flex flex-col items-center">
                     <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
                     <div className="w-48 h-[2px] bg-stone-200 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${loadingProgress}%` }}
                         className="h-full bg-gold"
                       />
                     </div>
-                    <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
+                    <span className="mt-2 text-micro uppercase tracking-[0.2em] text-stone-600 font-bold">
                       Loading detail {Math.round(loadingProgress)}%
                     </span>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
 
             <AnimatePresence>
               {hasError && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-50 p-8"
                 >
                   <div className="relative flex flex-col items-center text-center max-w-xs">
                     <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                       <AlertTriangle className="w-6 h-6 text-rose-400" />
                     </div>
                     <p className="text-sm font-semibold text-stone-700 mb-2">3D viewer unavailable</p>
-                    <p className="text-[11px] text-stone-400 leading-relaxed mb-4">
+                    <p className="text-micro text-stone-600 leading-relaxed mb-4">
                       {errorMessage}
                     </p>
                     <button
                       onClick={handleRetry}
-                      className="btn-luxury !py-2 !px-6 text-[10px]"
+                      className="btn-luxury !py-2 !px-6 text-micro"
                     >
                       Retry
                     </button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
 
             <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-stone-100">
             {poster ? (
               <img src={poster} alt={alt || '3D model poster'} className="w-full h-full object-cover opacity-50" />
             ) : (
               <div className="flex flex-col items-center gap-3">
                 <Box className="w-8 h-8 text-gold/30 animate-pulse" />
-                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Initializing 3D Detail</span>
+                <span className="text-micro uppercase tracking-[0.2em] text-stone-600">Initializing 3D Detail</span>
               </div>
             )}
           </div>
 
           <div className="absolute bottom-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={handleReset}
               className="p-3 bg-ivory/80 backdrop-blur border border-stone-100 hover:bg-gold hover:text-white transition-all rounded-full"
               title="Reset View"
               aria-label="Reset view"
@@ -180,21 +180,21 @@ const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ src, poster, alt, className
               aria-label="View in augmented reality"
               onClick={() => modelRef.current?.activateAR()}
             >
               <Maximize2 className="w-4 h-4" />
             </button>
           </div>
 
           <div className="absolute top-6 left-6 pointer-events-none">
             <div className="flex items-center gap-2 px-3 py-1 bg-gold/10 backdrop-blur-sm border border-gold/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
-              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">3D Perspective</span>
+              <span className="text-micro font-bold uppercase tracking-[0.2em] text-gold">3D Perspective</span>
             </div>
           </div>
         </model-viewer>
         </div>
       </motion.div>
     </div>
   );
 };
 
 export default ThreeDViewer;
diff --git a/src/components/ToastContainer.tsx b/src/components/ToastContainer.tsx
index ad1bec8..5340c5a 100644
--- a/src/components/ToastContainer.tsx
+++ b/src/components/ToastContainer.tsx
@@ -37,22 +37,22 @@ export default function ToastContainer() {
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, x: 100, scale: 0.95 }}
               transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
               className={cn(
                 "pointer-events-auto border p-4 shadow-xl flex items-start gap-3",
                 COLORS[toast.type]
               )}
             >
               <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", ICON_COLORS[toast.type])} />
               <div className="flex-1 min-w-0">
-                <p className="text-[11px] font-bold uppercase tracking-widest">{toast.title}</p>
-                {toast.message && <p className="text-[10px] mt-0.5 opacity-70">{toast.message}</p>}
+                <p className="text-micro font-bold uppercase tracking-widest">{toast.title}</p>
+                {toast.message && <p className="text-micro mt-0.5 opacity-70">{toast.message}</p>}
               </div>
               <button
                 onClick={() => removeToast(toast.id)}
                 className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
                 aria-label="Dismiss"
               >
                 <X className="w-4 h-4" />
               </button>
             </motion.div>
           );
diff --git a/src/components/luxury/HorizontalLookbook.tsx b/src/components/luxury/HorizontalLookbook.tsx
index 44031b0..02fc987 100644
--- a/src/components/luxury/HorizontalLookbook.tsx
+++ b/src/components/luxury/HorizontalLookbook.tsx
@@ -8,21 +8,21 @@ function Panel({ item, offset }: { item: GalleryItem; offset?: boolean }) {
   return (
     <figure className={offset ? 'md:mt-24' : ''}>
       <div className="overflow-hidden group">
         <img
           src={item.thumbnail_url || item.media_url}
           alt={item.title}
           loading="lazy"
           className="h-[52vh] md:h-[62vh] w-full md:w-[32vw] object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
         />
       </div>
-      <figcaption className="flex justify-between mt-4 text-[10px] uppercase tracking-[0.3em] text-ivory">
+      <figcaption className="flex justify-between mt-4 text-micro uppercase tracking-[0.3em] text-ivory">
         <span>{item.title}</span>
         <span className="text-ivory/40">{item.category}</span>
       </figcaption>
     </figure>
   );
 }
 
 export default function HorizontalLookbook() {
   const { items } = useGallery({ featured: true, limit: 6 });
 
@@ -38,27 +38,27 @@ function LookbookContent({ items }: { items: GalleryItem[] }) {
   const x = useTransform(scrollYProgress, [0, 1], ['2%', '-72%']);
   const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
 
   return (
     <>
       {/* Desktop: pinned horizontal scroll */}
       <section ref={targetRef} className="relative hidden md:block h-[320vh] bg-onyx">
         <div className="sticky top-0 h-screen flex items-center overflow-hidden">
           <motion.div style={{ x }} className="flex items-center gap-[6vw] px-[8vw] will-change-transform">
             <div className="shrink-0 w-[34vw]">
-              <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40 mb-6">
+              <p className="text-micro uppercase tracking-[0.35em] text-ivory/40 mb-6">
                 ( 02 ) ΓÇö {t('lookbook.eyebrow')}
               </p>
               <h2 className="font-heading font-medium text-6xl md:text-[5.5vw] leading-[0.9] text-white mb-8">
                 {t('lookbook.heading')}
               </h2>
-              <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">
+              <span className="text-micro uppercase tracking-[0.3em] text-ivory/40">
                 {t('hero.discover')} ΓåÆ
               </span>
             </div>
 
             {items.map((item, i) => (
               <div key={item.id} className="shrink-0">
                 <Panel item={item} offset={i % 2 === 1} />
               </div>
             ))}
 
@@ -73,26 +73,26 @@ function LookbookContent({ items }: { items: GalleryItem[] }) {
           </motion.div>
 
           <div className="absolute bottom-8 left-[8vw] right-[8vw] h-px bg-white/15">
             <motion.div className="h-full bg-gold origin-left" style={{ scaleX: progressScale }} />
           </div>
         </div>
       </section>
 
       {/* Mobile: vertical stack */}
       <section className="md:hidden bg-onyx px-6 py-24">
-        <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40 mb-4">( 02 ) ΓÇö {t('lookbook.eyebrow')}</p>
+        <p className="text-micro uppercase tracking-[0.35em] text-ivory/40 mb-4">( 02 ) ΓÇö {t('lookbook.eyebrow')}</p>
         <h2 className="font-heading font-medium text-5xl leading-[0.9] text-white mb-10">{t('lookbook.heading')}</h2>
         <div className="flex flex-col gap-14">
           {items.map((item) => (
             <div key={item.id}>
               <Panel item={item} />
             </div>
           ))}
         </div>
-        <Link to="/collection/all" className="inline-block mt-12 text-gold text-[11px] uppercase tracking-[0.3em] border-b border-gold/40 pb-1">
+        <Link to="/collection/all" className="inline-block mt-12 text-gold text-micro uppercase tracking-[0.3em] border-b border-gold/40 pb-1">
           {t('lookbook.cta')} ΓåÆ
         </Link>
       </section>
     </>
   );
 }
diff --git a/src/components/luxury/Marquee.tsx b/src/components/luxury/Marquee.tsx
index 4189e5e..320d936 100644
--- a/src/components/luxury/Marquee.tsx
+++ b/src/components/luxury/Marquee.tsx
@@ -19,20 +19,20 @@ export default function Marquee({ items, className }: MarqueeProps) {
 
   return (
     <div
       className={cn(
         'overflow-hidden select-none border-y border-gold/20 bg-onyx py-4',
         className
       )}
       aria-hidden="true"
     >
       <div className="marquee-track flex w-max">
-        <div className="flex items-center text-[11px] uppercase tracking-[0.35em] whitespace-nowrap text-ivory/80">
+        <div className="flex items-center text-micro uppercase tracking-[0.35em] whitespace-nowrap text-ivory/80">
           {half}
         </div>
-        <div className="flex items-center text-[11px] uppercase tracking-[0.35em] whitespace-nowrap text-ivory/80">
+        <div className="flex items-center text-micro uppercase tracking-[0.35em] whitespace-nowrap text-ivory/80">
           {half}
         </div>
       </div>
     </div>
   );
 }
diff --git a/src/components/luxury/StatCounter.tsx b/src/components/luxury/StatCounter.tsx
index 77f9576..02c2193 100644
--- a/src/components/luxury/StatCounter.tsx
+++ b/src/components/luxury/StatCounter.tsx
@@ -22,14 +22,14 @@ export default function StatCounter({ value, suffix, label, duration = 1.6 }: St
     });
     return () => controls.stop();
   }, [inView, value, duration]);
 
   return (
     <div>
       <p className="font-heading text-5xl md:text-7xl text-white font-medium">
         <span ref={ref} data-testid="stat-value">{display}</span>
         {suffix && <span className="text-gold text-3xl md:text-5xl align-top">{suffix}</span>}
       </p>
-      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-3">{label}</p>
+      <p className="text-micro uppercase tracking-[0.3em] text-white/40 mt-3">{label}</p>
     </div>
   );
 }
