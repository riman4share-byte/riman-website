## Commits
cf638ab feat(selection): Your Selection page with request-viewing CTA

## Stat
 src/contexts/LanguageContext.tsx | 22 ++++++++++++++++++++
 src/pages/WishlistPage.tsx       | 44 ++++++++++++++++++++++++++++++++--------
 2 files changed, 58 insertions(+), 8 deletions(-)

## Diff
diff --git a/src/contexts/LanguageContext.tsx b/src/contexts/LanguageContext.tsx
index 1cb5006..6c760ca 100644
--- a/src/contexts/LanguageContext.tsx
+++ b/src/contexts/LanguageContext.tsx
@@ -315,20 +315,31 @@ const translations: Record<Language, Record<string, string>> = {
 
     // Wishlist
     'wishlist.title': 'Admiration List',
     'wishlist.subtitle': 'Designs that have captured your heart',
     'wishlist.empty': 'Your board is empty',
     'wishlist.empty_desc': 'Begin your journey by curating your favorite silhouettes.',
     'wishlist.explore': 'Explore Atelier',
     'wishlist.view': 'View',
     'wishlist.add_to_bag': 'Add to Bag',
 
+    // Selection
+    'selection.title': 'Your Selection',
+    'selection.subtitle': 'Pieces kept aside for your private viewing',
+    'selection.empty': 'Your selection is empty',
+    'selection.empty_desc': 'Save the silhouettes that catch your eye ΓÇö we will have them ready for your visit.',
+    'selection.explore': 'Explore Atelier',
+    'selection.view': 'View',
+    'selection.add_to_bag': 'Add to Bag',
+    'selection.request_viewing': 'Request Private Viewing',
+    'selection.count': 'pieces selected',
+
     // Checkout
     'checkout.empty': 'Your Bag is Empty',
     'checkout.empty_desc': 'Please select pieces from our collection first.',
     'checkout.explore': 'Explore Collection',
     'checkout.step_identity': 'Identity',
     'checkout.step_logistics': 'Logistics',
     'checkout.step_confirm': 'Confirm',
     'checkout.personal_details': 'Personal Details',
     'checkout.delivery_info': 'Delivery Information',
     'checkout.review': 'Review & Confirm',
@@ -1020,20 +1031,31 @@ const translations: Record<Language, Record<string, string>> = {
 
     // Wishlist
     'wishlist.title': '┘é╪º╪ª┘à╪⌐ ╪º┘ä╪Ñ╪╣╪¼╪º╪¿',
     'wishlist.subtitle': '╪¬╪╡╪º┘à┘è┘à ╪ú╪│╪▒╪¬ ┘é┘ä╪¿┘â',
     'wishlist.empty': '┘é╪º╪ª┘à╪¬┘â ┘ü╪º╪▒╪║╪⌐',
     'wishlist.empty_desc': '╪º╪¿╪»╪ú ╪▒╪¡┘ä╪¬┘â ╪¿╪º╪«╪¬┘è╪º╪▒ ╪¬╪╡╪º┘à┘è┘à┘â ╪º┘ä┘à┘ü╪╢┘ä╪⌐.',
     'wishlist.explore': '╪º╪│╪¬┘â╪┤┘ü ╪º┘ä╪»╪º╪▒',
     'wishlist.view': '╪╣╪▒╪╢',
     'wishlist.add_to_bag': '╪ú╪╢┘ü ┘ä┘ä╪¡┘é┘è╪¿╪⌐',
 
+    // Selection
+    'selection.title': '┘à╪«╪¬╪º╪▒╪º╪¬┘â',
+    'selection.subtitle': '┘é╪╖╪╣ ╪º┘å╪¬╪╕╪▒┘å╪º┘ç╪º ┘ä┘à╪┤╪º┘ç╪»╪¬┘â ╪º┘ä╪«╪º╪╡╪⌐',
+    'selection.empty': '┘à╪«╪¬╪º╪▒╪º╪¬┘â ┘ü╪º╪▒╪║╪⌐',
+    'selection.empty_desc': '╪º╪¡┘ü╪╕┘è ╪º┘ä╪¬╪╡╪º┘à┘è┘à ╪º┘ä╪¬┘è ╪ú╪│╪▒╪¬ ┘é┘ä╪¿┘â ΓÇö ┘ê╪│╪¬┘â┘ê┘å ╪¼╪º┘ç╪▓╪⌐ ╪╣┘å╪» ╪▓┘è╪º╪▒╪¬┘â.',
+    'selection.explore': '╪º╪│╪¬┘â╪┤┘ü┘è ╪º┘ä╪»╪º╪▒',
+    'selection.view': '╪╣╪▒╪╢',
+    'selection.add_to_bag': '╪ú╪╢┘ü ┘ä┘ä╪¡┘é┘è╪¿╪⌐',
+    'selection.request_viewing': '╪╖┘ä╪¿ ┘à╪┤╪º┘ç╪»╪⌐ ╪«╪º╪╡╪⌐',
+    'selection.count': '┘é╪╖╪╣╪⌐ ┘à╪«╪¬╪º╪▒╪⌐',
+
     // Checkout
     'checkout.empty': '╪¡┘é┘è╪¿╪¬┘â ┘ü╪º╪▒╪║╪⌐',
     'checkout.empty_desc': '┘è╪▒╪¼┘ë ╪º╪«╪¬┘è╪º╪▒ ╪º┘ä┘é╪╖╪╣ ┘à┘å ┘à╪¼┘à┘ê╪╣╪¬┘å╪º ╪ú┘ê┘ä╪º┘ï.',
     'checkout.explore': '╪º╪│╪¬┘â╪┤┘ü ╪º┘ä┘à╪¼┘à┘ê╪╣╪⌐',
     'checkout.step_identity': '╪º┘ä┘ç┘ê┘è╪⌐',
     'checkout.step_logistics': '╪º┘ä╪¬┘ê╪╡┘è┘ä',
     'checkout.step_confirm': '╪º┘ä╪¬╪ú┘â┘è╪»',
     'checkout.personal_details': '╪º┘ä╪¿┘è╪º┘å╪º╪¬ ╪º┘ä╪┤╪«╪╡┘è╪⌐',
     'checkout.delivery_info': '┘à╪╣┘ä┘ê┘à╪º╪¬ ╪º┘ä╪¬┘ê╪╡┘è┘ä',
     'checkout.review': '╪º┘ä┘à╪▒╪º╪¼╪╣╪⌐ ┘ê╪º┘ä╪¬╪ú┘â┘è╪»',
diff --git a/src/pages/WishlistPage.tsx b/src/pages/WishlistPage.tsx
index 5425788..2444cbb 100644
--- a/src/pages/WishlistPage.tsx
+++ b/src/pages/WishlistPage.tsx
@@ -1,45 +1,60 @@
 import { useWishlist } from '../contexts/WishlistContext';
 import { useCart } from '../contexts/CartContext';
 import { useLanguage } from '../contexts/LanguageContext';
 import { ShoppingBag, X, Heart, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
 import { formatPrice } from '../lib/utils';
-import { Link } from 'react-router-dom';
+import { Link, useNavigate } from 'react-router-dom';
 import { motion, AnimatePresence } from 'motion/react';
 import { useState } from 'react';
 
 export default function WishlistPage() {
   const { wishlist, removeFromWishlist, isLoading } = useWishlist();
   const { addItem } = useCart();
   const { t } = useLanguage();
+  const navigate = useNavigate();
   const [addedId, setAddedId] = useState<string | null>(null);
 
   const handleMoveToBag = (product: any) => {
     const defaultSize = product.sizes?.[0] || undefined;
     addItem(product, 'sale', defaultSize);
     setAddedId(product.id);
     setTimeout(() => setAddedId(null), 2000);
   };
 
   return (
     <div className="pt-32 pb-20 bg-ivory min-h-screen">
       <div className="container mx-auto px-6">
         <header className="text-center mb-20">
-           <h1 className="font-heading text-4xl md:text-6xl text-stone-800 tracking-wider uppercase mb-4">{t('wishlist.title')}</h1>
-           <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic">{t('wishlist.subtitle')}</p>
+           <h1 className="font-heading text-4xl md:text-6xl text-stone-800 tracking-wider uppercase mb-4">{t('selection.title')}</h1>
+           <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic">{t('selection.subtitle')}</p>
+           <p className="font-body text-stone-400 text-[10px] tracking-[0.2em] uppercase italic">{wishlist.length} {t('selection.count')}</p>
         </header>
 
         {isLoading ? (
           <div className="flex items-center justify-center py-32">
             <Loader2 className="w-8 h-8 text-gold animate-spin" />
           </div>
         ) : wishlist.length > 0 ? (
+          <>
+          <div className="flex justify-center mb-12">
+            <button
+              onClick={() => navigate('/appointment', {
+                state: {
+                  gowns: wishlist.map(p => ({ id: p.id, name: p.name, intent: (p.productType === 'rent' ? 'rent' : 'sale') as 'rent' | 'sale' })),
+                },
+              })}
+              className="btn-luxury px-12 w-full sm:w-auto"
+            >
+              {t('selection.request_viewing')}
+            </button>
+          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             <AnimatePresence mode="popLayout">
               {wishlist.map((product) => (
                 <motion.div 
                   key={product.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="bg-ivory border border-stone-100 group relative"
@@ -59,41 +74,54 @@ export default function WishlistPage() {
                       loading="lazy"
                     />
                   </Link>
 
                   <div className="p-8 text-center border-t border-stone-50">
                     <span className="text-[10px] text-stone-300 uppercase tracking-widest mb-2 block">{product.category}</span>
                     <h3 className="font-heading text-lg text-stone-800 mb-4 tracking-wide group-hover:text-gold transition-colors">{product.name}</h3>
 <p className="font-body text-sm text-gold mb-8">{formatPrice(product.salePrice || product.rentalPrice || 0)}</p>
 
                      <div className="flex gap-2">
-                        <Link to={`/product/${product.id}`} className="flex-1 btn-luxury !py-3 !px-4 text-[10px]">{t('wishlist.view')}</Link>
+                        <Link to={`/product/${product.id}`} className="flex-1 btn-luxury !py-3 !px-4 text-[10px]">{t('selection.view')}</Link>
                         <button
                           onClick={() => handleMoveToBag(product)}
                           className="flex-1 btn-luxury-outline !py-3 !px-4 text-[10px] flex items-center justify-center gap-2"
                         >
                           {addedId === product.id ? (
                             <><CheckCircle2 className="w-3.5 h-3.5" /> {t('product.added')}</>
                           ) : (
-                            <><ShoppingBag className="w-3.5 h-3.5" /> {t('wishlist.add_to_bag')}</>
+                            <><ShoppingBag className="w-3.5 h-3.5" /> {t('selection.add_to_bag')}</>
                           )}
                         </button>
                      </div>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
+          <div className="flex justify-center mt-12">
+            <button
+              onClick={() => navigate('/appointment', {
+                state: {
+                  gowns: wishlist.map(p => ({ id: p.id, name: p.name, intent: (p.productType === 'rent' ? 'rent' : 'sale') as 'rent' | 'sale' })),
+                },
+              })}
+              className="btn-luxury px-12 w-full sm:w-auto"
+            >
+              {t('selection.request_viewing')}
+            </button>
+          </div>
+          </>
         ) : (
           <div className="text-center py-32 bg-ivory border border-stone-100">
 <Heart className="w-16 h-16 text-stone-100 mx-auto mb-8" />
-              <h3 className="font-heading text-2xl text-stone-800 mb-4 tracking-widest uppercase">{t('wishlist.empty')}</h3>
-              <p className="font-body text-stone-400 text-xs uppercase tracking-widest mb-10 italic">{t('wishlist.empty_desc')}</p>
+              <h3 className="font-heading text-2xl text-stone-800 mb-4 tracking-widest uppercase">{t('selection.empty')}</h3>
+              <p className="font-body text-stone-400 text-xs uppercase tracking-widest mb-10 italic">{t('selection.empty_desc')}</p>
               <Link to="/search" className="btn-luxury px-12 group flex items-center gap-3 mx-auto w-fit">
-                {t('wishlist.explore')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
+                {t('selection.explore')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
           </div>
         )}
       </div>
     </div>
   );
 }
