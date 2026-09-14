## Commits
517a5ee feat(pricing): From-AED pricing copy + consultation note

## Stat
 src/components/ProductCard.tsx   |  4 ++--
 src/contexts/LanguageContext.tsx | 10 ++++++++++
 src/pages/ProductDetail.tsx      |  7 ++++---
 3 files changed, 16 insertions(+), 5 deletions(-)

## Diff
diff --git a/src/components/ProductCard.tsx b/src/components/ProductCard.tsx
index 20e39ee..28c0ad4 100644
--- a/src/components/ProductCard.tsx
+++ b/src/components/ProductCard.tsx
@@ -234,26 +234,26 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
         {product.fabric && (
           <p className="font-editorial italic text-sm text-stone-500">{product.fabric}</p>
         )}
 
         {/* Expanding gold frame ΓÇö couture hover detail */}
         <span className="absolute inset-3 border border-gold/0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:inset-4 group-hover:border-gold/40 pointer-events-none z-10" aria-hidden="true" />
         
           <div className="mt-2 flex flex-col gap-1">
             {isSale && (
               <p className="text-xs tracking-wider text-stone-600">
-                {t('product.purchase')}: <span className="font-semibold text-stone-800">{formatPrice(product.salePrice || 0)}</span>
+                {t('product.purchase')}: <span className="font-semibold text-stone-800"><span className="me-1 text-[9px] uppercase tracking-wider text-stone-400">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
               </p>
             )}
             {isRent && (
               <p className="text-xs tracking-wider text-stone-500">
-                {t('product.rent')}: <span className="text-stone-700">{formatPrice(product.rentalPrice || 0)}</span>
+                {t('product.rent')}: <span className="text-stone-700"><span className="me-1 text-[9px] uppercase tracking-wider text-stone-400">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
               </p>
             )}
           </div>
 
           <Link
             to={`/product/${product.id}`}
             className="inline-flex items-center gap-1.5 font-label text-[10px] tracking-[0.25em] uppercase text-stone-800 hover:text-gold transition-colors duration-500 mt-2"
           >
             {t('silhouettes.enquire')}
             <ArrowRight className="w-3 h-3" />
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index b6db128..621e3ea 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -270,20 +270,25 @@ const translations: Record<Language, Record<string, string>> = {
     'product.care_dry_clean_desc': 'Expert cleaning by specialists trained in luxury garment care.',
     'product.care_store': 'Breathable Garment Bag',
     'product.care_store_desc': 'Store in a cool, dry place using the provided breathable garment bag.',
     'product.care_handle': 'Handle with Care',
     'product.care_handle_desc': 'Avoid direct contact with perfumes, cosmetics, and sharp accessories.',
     'product.care_steam': 'Professional Steaming',
     'product.care_steam_desc': 'Use low-heat steaming to remove wrinkles. Never iron directly on embellishments.',
     'product.ask_stylist': 'Ask a Stylist',
     'product.ask_stylist_desc': 'Book a complimentary consultation with our styling experts.',
 
+    // Pricing
+    'pricing.from': 'From',
+    'pricing.rental_period': '3-day rental',
+    'pricing.consultation_note': 'Final quote confirmed at your consultation ΓÇö fitting and alterations included.',
+
     // Badges
     'badge.new': 'Majestic New',
     'badge.featured': 'Atelier Choice',
     'badge.gold': 'Pure Gold',
     'badge.3d': '3D View',
 
     // Collection page
     'collection.sort': 'Sort',
     'collection.sort_featured': 'featured',
     'collection.sort_newest': 'newest',
@@ -968,20 +973,25 @@ const translations: Record<Language, Record<string, string>> = {
     'product.care_dry_clean_desc': '╪¬┘å╪╕┘è┘ü ╪«╪¿╪▒╪º╪í ┘à╪¬╪«╪╡╪╡┘è┘å ┘ü┘è ╪º┘ä╪╣┘å╪º┘è╪⌐ ╪¿╪º┘ä┘à┘ä╪º╪¿╪│ ╪º┘ä┘ü╪º╪«╪▒╪⌐.',
     'product.care_store': '╪¡┘é┘è╪¿╪⌐ ╪¬╪«╪▓┘è┘å ┘é╪º╪¿┘ä╪⌐ ┘ä┘ä╪¬┘å┘ü╪│',
     'product.care_store_desc': '╪«╪▓┘æ┘å┘è ┘ü┘è ┘à┘â╪º┘å ╪¿╪º╪▒╪» ┘ê╪¼╪º┘ü ╪¿╪º╪│╪¬╪«╪»╪º┘à ╪¡┘é┘è╪¿╪⌐ ╪º┘ä╪¬╪«╪▓┘è┘å ╪º┘ä┘é╪º╪¿┘ä╪⌐ ┘ä┘ä╪¬┘å┘ü╪│ ╪º┘ä┘à╪▒┘ü┘é╪⌐.',
     'product.care_handle': '╪¬╪╣╪º┘à┘ä ╪¿╪¡╪░╪▒',
     'product.care_handle_desc': '╪¬╪¼┘å╪¿┘è┘ä╪º┘à╪│ ╪º┘ä┘à╪¿╪º╪┤╪▒ ┘ä┘ä╪╣╪╖┘ê╪▒ ┘ê┘à╪│╪¬╪¡╪╢╪▒╪º╪¬ ╪º┘ä╪¬╪¼┘à┘è┘ä ┘ê╪º┘ä╪Ñ┘â╪│╪│┘ê╪º╪▒╪º╪¬ ╪º┘ä╪¡╪º╪»╪⌐.',
     'product.care_steam': '╪¿╪«╪º╪▒ ╪º╪¡╪¬╪▒╪º┘ü┘è',
     'product.care_steam_desc': '╪º╪│╪¬╪«╪»┘à┘è ╪º┘ä╪¿╪«╪º╪▒ ┘à┘å╪«┘ü╪╢ ╪º┘ä╪¡╪▒╪º╪▒╪⌐ ┘ä╪Ñ╪▓╪º┘ä╪⌐ ╪º┘ä╪¬╪¼╪º╪╣┘è╪». ┘ä╪º ╪¬┘â┘ê┘è ┘à╪¿╪º╪┤╪▒╪⌐ ╪╣┘ä┘ë ╪º┘ä╪¬╪╖╪▒┘è╪▓.',
     'product.ask_stylist': '╪º╪│╪ú┘ä┘è ╪º┘ä╪«╪¿┘è╪▒╪⌐',
     'product.ask_stylist_desc': '╪º╪¡╪¼╪▓┘è ╪º╪│╪¬╪┤╪º╪▒╪⌐ ┘à╪¼╪º┘å┘è╪⌐ ┘à╪╣ ╪«╪¿╪▒╪º╪í ╪º┘ä╪¬╪╡┘à┘è┘à ┘ä╪»┘è┘å╪º.',
 
+    // Pricing
+    'pricing.from': '┘è╪¿╪»╪ú ┘à┘å',
+    'pricing.rental_period': '╪¬╪ú╪¼┘è╪▒ ┘ú ╪ú┘è╪º┘à',
+    'pricing.consultation_note': '┘è╪¬┘à ╪¬╪ú┘â┘è╪» ╪º┘ä╪│╪╣╪▒ ╪º┘ä┘å┘ç╪º╪ª┘è ┘ü┘è ┘à┘ê╪╣╪» ╪º┘ä╪º╪│╪¬╪┤╪º╪▒╪⌐ ΓÇö ┘è╪┤┘à┘ä ╪º┘ä╪¬┘ü╪╡┘è┘ä ┘ê╪º┘ä╪¬╪╣╪»┘è┘ä╪º╪¬.',
+
     // Badges
     'badge.new': '╪¼╪»┘è╪» ┘à┘ç┘è╪¿',
     'badge.featured': '╪º╪«╪¬┘è╪º╪▒ ╪º┘ä╪»╪º╪▒',
     'badge.gold': '╪░┘ç╪¿ ╪«╪º┘ä╪╡',
     'badge.3d': '╪╣╪▒╪╢ ╪½┘ä╪º╪½┘è ╪º┘ä╪ú╪¿╪╣╪º╪»',
 
     // Collection page
     'collection.sort': '╪¬╪▒╪¬┘è╪¿',
     'collection.sort_featured': '┘à┘à┘è╪▓',
     'collection.sort_newest': '╪º┘ä╪ú╪¡╪»╪½',
diff --git a/src/pages/ProductDetail.tsx b/src/pages/ProductDetail.tsx
index f356f5c..8c0a946 100644
--- a/src/pages/ProductDetail.tsx
+++ b/src/pages/ProductDetail.tsx
@@ -301,35 +301,36 @@ export default function ProductDetail() {
                 <p className="font-editorial italic text-sm text-stone-500 leading-relaxed">
                   "A study in refined elegance ΓÇö where artisanal precision meets contemporary silhouette, crafted for the woman who commands quiet luxury."
                 </p>
               </div>
 
               {/* Pricing */}
               <div className="mb-8 p-5 bg-gold/5 border border-gold/20 flex flex-col gap-4">
                 {isSale && (
                   <div className="flex justify-between items-baseline">
                     <span className="font-body text-[10px] tracking-widest uppercase text-stone-500 font-medium">{t('product.purchase_value')}</span>
-                    <span className="font-heading text-3xl text-stone-800">{formatPrice(product.salePrice || 0)}</span>
+                    <span className="font-heading text-3xl text-stone-800"><span className="text-sm font-body text-stone-500 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
                   </div>
                 )}
                 {isRent && (
                   <div className="flex justify-between items-baseline pt-4 border-t border-stone-200/60">
                     <div>
                       <span className="font-body text-[10px] tracking-widest uppercase text-stone-500 block font-medium">{t('product.rental_7day')}</span>
                       <span className="text-[10px] text-stone-400 uppercase tracking-wider italic">({t('product.rental_includes')})</span>
                     </div>
                     <div className="text-right">
-                      <span className="font-heading text-3xl text-gold">{formatPrice(product.rentalPrice || 0)}</span>
+                      <span className="font-heading text-3xl text-gold"><span className="text-sm font-body text-stone-500 uppercase tracking-widest me-2">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
                       <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{t('product.refundable_deposit')}</p>
                     </div>
                   </div>
                 )}
+                <p className="font-body text-[11px] text-stone-400 italic mt-2 leading-relaxed">{t('pricing.consultation_note')}</p>
               </div>
 
               <p className="font-body text-sm text-stone-600 leading-relaxed tracking-wide mb-8">
                 {product.description}
                 <br /><br />
                 {t('product.description_intro')} {product.fabric || 'silk blend'}, the {product.name} {t('product.description_mid')} {product.style.join(' and ')} {t('product.description_outro')}
               </p>
 
               {/* Selection */}
               <div className="space-y-6 mb-10">
@@ -633,21 +634,21 @@ export default function ProductDetail() {
                 {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
               </div>
             </section>
           )}
         </div>
 
         {/* Mobile Sticky Bottom Bar */}
         <div className="fixed bottom-0 left-0 right-0 z-50 bg-ivory border-t border-stone-200 p-4 flex items-center gap-4 lg:hidden">
           <div className="flex-1 min-w-0">
             <p className="font-heading text-[11px] tracking-wider uppercase text-stone-800 truncate">{product.name}</p>
-            <p className="font-heading text-sm text-gold">{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
+            <p className="font-heading text-sm text-gold"><span className="text-[10px] font-body text-stone-400 uppercase tracking-wider me-1">{t('pricing.from')}</span>{formatPrice(isSale ? (product.salePrice || 0) : (isRent ? (product.rentalPrice || 0) : 0))}</p>
           </div>
           <button onClick={handleAddToCart} disabled={isAddingToCart} className="btn-luxury !py-3 !px-5 text-[10px] flex items-center gap-2 whitespace-nowrap">
             {isAddingToCart ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <ShoppingBag className="w-3.5 h-3.5" />}
             {isRent ? t('product.book_rental') : t('product.add_to_collection')}
           </button>
           <button onClick={(e) => { e.preventDefault(); if (saved) { removeFromWishlist(product.id); } else { addToWishlist(product); } }} className={cn("w-10 h-10 flex items-center justify-center border transition-all shrink-0", saved ? "border-rose-200 text-rose-500 bg-rose-50" : "border-stone-200 text-stone-500")} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
             <Heart className={cn("w-4 h-4", saved && "fill-current")} />
           </button>
         </div>
 
