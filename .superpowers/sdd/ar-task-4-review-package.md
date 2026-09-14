# Review package AR Task 4 (851b9ab..ab05480)
## Commits
ab05480 i18n: wire components, checkout, pdp, and toasts; localize product values

## Stat
 src/App.tsx                             | 60 +++++++++++++++++----------------
 src/components/GlobalErrorBoundary.tsx  | 35 ++++++++++---------
 src/components/GlobalFeatures.test.tsx  | 29 +++++++++++++---
 src/components/GlobalFeatures.tsx       | 22 ++++++------
 src/components/ProductCard.tsx          | 46 +++++++++++++++----------
 src/components/ThreeDViewer.tsx         |  6 ++--
 src/components/salon/EditorialPlate.tsx |  5 +--
 src/contexts/AuthContext.tsx            |  6 ++--
 src/pages/Checkout.tsx                  | 18 ++++++----
 src/pages/ProductDetail.tsx             | 13 +++----
 10 files changed, 145 insertions(+), 95 deletions(-)

## Diff (-U10)
diff --git a/src/App.tsx b/src/App.tsx
index eaeeef8..d569faa 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -5,98 +5,99 @@ import { motion, AnimatePresence } from 'motion/react';
 import { DataProvider } from './contexts/DataContext';
 import { SettingsProvider, useSettings } from './contexts/SettingsContext';
 
 function ScrollToTop() {
   const { pathname } = useLocation();
   useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
   return null;
 }
 import Layout from './components/Layout';
 
-// Pages - to be created
-import Home from './pages/Index';
-import CollectionPage from './pages/CollectionPage';
-import ProductDetail from './pages/ProductDetail';
-import AboutPage from './pages/AboutPage';
-import ContactPage from './pages/ContactPage';
-import SearchPage from './pages/SearchPage';
-import WishlistPage from './pages/WishlistPage';
-import ProfilePage from './pages/ProfilePage';
-import FaqPage from './pages/FaqPage';
-import AlterationsPage from './pages/AlterationsPage';
-import PrivacyPage from './pages/PrivacyPage';
-import TermsPage from './pages/TermsPage';
-import Auth from './pages/Auth';
-import Checkout from './pages/Checkout';
-import PaymentSuccess from './pages/PaymentSuccess';
-import PaymentCancel from './pages/PaymentCancel';
-import StyleQuiz from './pages/StyleQuiz';
-import AppointmentPage from './pages/AppointmentPage';
-import WeddingTimeline from './pages/WeddingTimeline';
-import WeddingChecklist from './pages/WeddingChecklist';
-import GalleryPage from './pages/GalleryPage';
-import NotFound from './pages/NotFound';
+// Pages - Lazy Loaded
+const Home = lazy(() => import('./pages/Index'));
+const CollectionPage = lazy(() => import('./pages/CollectionPage'));
+const ProductDetail = lazy(() => import('./pages/ProductDetail'));
+const AboutPage = lazy(() => import('./pages/AboutPage'));
+const ContactPage = lazy(() => import('./pages/ContactPage'));
+const SearchPage = lazy(() => import('./pages/SearchPage'));
+const WishlistPage = lazy(() => import('./pages/WishlistPage'));
+const ProfilePage = lazy(() => import('./pages/ProfilePage'));
+const FaqPage = lazy(() => import('./pages/FaqPage'));
+const AlterationsPage = lazy(() => import('./pages/AlterationsPage'));
+const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
+const TermsPage = lazy(() => import('./pages/TermsPage'));
+const Auth = lazy(() => import('./pages/Auth'));
+const Checkout = lazy(() => import('./pages/Checkout'));
+const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
+const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));
+const StyleQuiz = lazy(() => import('./pages/StyleQuiz'));
+const AppointmentPage = lazy(() => import('./pages/AppointmentPage'));
+const WeddingTimeline = lazy(() => import('./pages/WeddingTimeline'));
+const WeddingChecklist = lazy(() => import('./pages/WeddingChecklist'));
+const GalleryPage = lazy(() => import('./pages/GalleryPage'));
+const NotFound = lazy(() => import('./pages/NotFound'));
 
 // Contexts
 import { LanguageProvider } from './contexts/LanguageContext';
 import { CartProvider } from './contexts/CartContext';
 import { AuthProvider } from './contexts/AuthContext';
 import { WishlistProvider } from './contexts/WishlistContext';
 import ProtectedRoute from './components/ProtectedRoute';
 import GlobalErrorBoundary from './components/GlobalErrorBoundary';
 import { ToastProvider } from './contexts/ToastContext';
 
 // Admin Pages - Lazy Loaded
 const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
 const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
 const AdminCalendar = lazy(() => import('./pages/admin/AdminCalendar'));
 const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
 const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
 const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
+const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
 
 const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
 const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
 const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
 
 const queryClient = new QueryClient({
   defaultOptions: {
     queries: {
       staleTime: 1000 * 60 * 5, // 5 minutes
     },
   },
 });
 
 export default function App() {
   return (
     <GlobalErrorBoundary>
       <ToastProvider>
         <QueryClientProvider client={queryClient}>
           <SettingsProvider>
-            <AuthProvider>
-              <WishlistProvider>
-                <LanguageProvider>
+            <LanguageProvider>
+              <AuthProvider>
+                <WishlistProvider>
                   <CartProvider>
                     <BrowserRouter>
                       <Suspense fallback={
                         <div className="min-h-screen bg-ivory flex items-center justify-center">
                           <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                         </div>
                       }>
                         <MaintenanceGate>
                           <AnimatedRoutes />
                         </MaintenanceGate>
                       </Suspense>
                     </BrowserRouter>
                   </CartProvider>
-                </LanguageProvider>
-              </WishlistProvider>
-            </AuthProvider>
+                </WishlistProvider>
+              </AuthProvider>
+            </LanguageProvider>
           </SettingsProvider>
         </QueryClientProvider>
       </ToastProvider>
     </GlobalErrorBoundary>
   );
 }
 
 function MaintenanceGate({ children }: { children: React.ReactNode }) {
   const { settings, isLoading } = useSettings();
   const { pathname } = useLocation();
@@ -226,20 +227,21 @@ function AnimatedRoutes() {
             </ProtectedRoute>
           }
         >
           <Route index element={<AdminDashboard />} />
           <Route path="products" element={<AdminProducts />} />
           <Route path="orders" element={<AdminOrders />} />
           <Route path="bookings" element={<AdminCalendar />} />
           <Route path="appointments" element={<AdminAppointments />} />
           <Route path="content" element={<AdminContent />} />
           <Route path="gallery" element={<AdminGallery />} />
+          <Route path="reviews" element={<AdminReviews />} />
           <Route path="settings" element={<AdminSettings />} />
         </Route>
       </Routes>
       </motion.div>
       </AnimatePresence>
     </DataProvider>
   );
 }
 
 function PageWrapper({ children }: { children: React.ReactNode }) {
diff --git a/src/components/GlobalErrorBoundary.tsx b/src/components/GlobalErrorBoundary.tsx
index 222bed9..12b3eab 100644
--- a/src/components/GlobalErrorBoundary.tsx
+++ b/src/components/GlobalErrorBoundary.tsx
@@ -1,11 +1,29 @@
 import { Component, ErrorInfo, ReactNode } from 'react';
+import { useLanguage } from '../contexts/LanguageContext';
+
+function ErrorFallback() {
+  const { t } = useLanguage();
+  return (
+    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
+      <div className="max-w-md">
+        <h1 className="font-heading text-4xl text-stone-800 mb-4">{t('errors.tech_title')}</h1>
+        <p className="font-body text-stone-500 text-sm mb-8 italic">
+          {t('errors.tech_body')}
+        </p>
+        <button onClick={() => window.location.href = '/'} className="btn-luxury">
+          {t('errors.return_atelier')}
+        </button>
+      </div>
+    </div>
+  );
+}
 
 interface Props {
   children: ReactNode;
 }
 
 interface State {
   hasError: boolean;
 }
 
 export default class GlobalErrorBoundary extends Component<Props, State> {
@@ -16,31 +34,16 @@ export default class GlobalErrorBoundary extends Component<Props, State> {
   public static getDerivedStateFromError(): State {
     return { hasError: true };
   }
 
   public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
     // Error caught by boundary
   }
 
   public render() {
     if (this.state.hasError) {
-      return (
-        <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
-          <div className="max-w-md">
-            <h1 className="font-heading text-4xl text-stone-800 mb-4">A Technical Moment</h1>
-            <p className="font-body text-stone-500 text-sm mb-8 italic">
-              Our digital atelier is experiencing a brief pause. Please refresh the page or return to our home collection.
-            </p>
-            <button 
-              onClick={() => window.location.href = '/'}
-              className="btn-luxury"
-            >
-              Return to Atelier
-            </button>
-          </div>
-        </div>
-      );
+      return <ErrorFallback />;
     }
 
     return this.props.children;
   }
 }
\ No newline at end of file
diff --git a/src/components/GlobalFeatures.test.tsx b/src/components/GlobalFeatures.test.tsx
index 46be247..4662bed 100644
--- a/src/components/GlobalFeatures.test.tsx
+++ b/src/components/GlobalFeatures.test.tsx
@@ -1,45 +1,66 @@
 import { type ReactElement, useEffect } from 'react';
-import { describe, it, expect } from 'vitest';
+import { describe, it, expect, beforeEach } from 'vitest';
 import { render, screen, waitFor } from '@testing-library/react';
 import GlobalFeatures from './GlobalFeatures';
 import { BrowserRouter } from 'react-router-dom';
 import { SettingsProvider, useSettings } from '../contexts/SettingsContext';
 import { ToastProvider } from '../contexts/ToastContext';
+import { LanguageProvider } from '../contexts/LanguageContext';
 
 function FeatureController({ feature, value }: { feature: string; value: boolean }) {
   const { updateSetting } = useSettings();
   useEffect(() => {
     updateSetting('features', feature, value);
   }, [feature, value]);
   return null;
 }
 
 function renderWithProviders(ui: ReactElement, feature: string, value: boolean) {
   return render(
     <BrowserRouter>
       <ToastProvider>
         <SettingsProvider>
-          <FeatureController feature={feature} value={value} />
-          {ui}
+          <LanguageProvider>
+            <FeatureController feature={feature} value={value} />
+            {ui}
+          </LanguageProvider>
         </SettingsProvider>
       </ToastProvider>
     </BrowserRouter>,
   );
 }
 
 describe('GlobalFeatures', () => {
+  beforeEach(() => {
+    localStorage.setItem('riman_lang', 'en');
+    localStorage.removeItem('riman_cookie_consent');
+  });
+
   it('renders WhatsApp button when enabled', () => {
     renderWithProviders(<GlobalFeatures />, 'whatsappBtn', true);
     expect(screen.getByLabelText('Contact us on WhatsApp')).toBeDefined();
   });
 
   it('hides WhatsApp button when disabled', async () => {
     renderWithProviders(<GlobalFeatures />, 'whatsappBtn', false);
     await waitFor(() => expect(screen.queryByLabelText('Contact us on WhatsApp')).toBeNull());
   });
 
   it('does not show newsletter popup on initial render', () => {
     renderWithProviders(<GlobalFeatures />, 'newsletter', true);
-    expect(screen.queryByText('The Atelier Circle')).toBeNull();
+    expect(screen.queryByText(/Atelier Circle|دائرة الأتيليه/)).toBeNull();
+  });
+
+  it('renders Arabic cookie banner copy under ar locale when consent not yet given', () => {
+    localStorage.setItem('riman_lang', 'ar');
+    localStorage.removeItem('riman_cookie_consent');
+    renderWithProviders(<GlobalFeatures />, 'cookieBanner', true);
+    expect(screen.getByText('الخصوصية والأناقة')).toBeInTheDocument();
+  });
+
+  it('hides cookie banner once consent is stored', () => {
+    localStorage.setItem('riman_cookie_consent', 'true');
+    renderWithProviders(<GlobalFeatures />, 'cookieBanner', true);
+    expect(screen.queryByText(/Privacy|خصوصية/)).toBeNull();
   });
 });
diff --git a/src/components/GlobalFeatures.tsx b/src/components/GlobalFeatures.tsx
index 241a37c..dd4871f 100644
--- a/src/components/GlobalFeatures.tsx
+++ b/src/components/GlobalFeatures.tsx
@@ -1,18 +1,20 @@
 import { useEffect, useState } from 'react';
 import { motion, AnimatePresence } from 'motion/react';
 import { MessageCircle, X, Mail } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { useScrollLock } from '../hooks/useScrollLock';
 import { useFeature } from '../hooks/useFeature';
+import { useLanguage } from '../contexts/LanguageContext';
 
 export default function GlobalFeatures() {
+  const { t } = useLanguage();
   const whatsappEnabled = useFeature('whatsappBtn');
   const newsletterEnabled = useFeature('newsletter');
   const cookieEnabled = useFeature('cookieBanner');
 
   const [showNewsletter, setShowNewsletter] = useState(false);
   const [showCookies, setShowCookies] = useState(false);
   useScrollLock(showNewsletter);
 
   useEffect(() => {
     if (!newsletterEnabled) return;
@@ -40,21 +42,21 @@ export default function GlobalFeatures() {
   };
 
   return (
     <>
       {/* WhatsApp Float */}
       {whatsappEnabled && (
         <a 
           href="https://wa.me/971553730792" 
           target="_blank" 
           rel="noreferrer"
-          className="fixed bottom-20 right-4 md:bottom-10 md:right-10 z-[100] w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-bounce"
+          className="fixed bottom-20 right-4 md:bottom-10 md:right-10 z-[100] w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
           aria-label="Contact us on WhatsApp"
         >
           <MessageCircle className="w-8 h-8 fill-current" />
         </a>
       )}
 
       {/* Newsletter Popup */}
       <AnimatePresence>
         {showNewsletter && (
           <motion.div 
@@ -62,66 +64,66 @@ export default function GlobalFeatures() {
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 50 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm"
           >
             <div className="bg-ivory max-w-lg w-full p-10 relative overflow-hidden border border-stone-200"
                  role="dialog"
                  aria-modal="true">
               <button 
                 onClick={handleDismissNewsletter}
                 className="absolute top-4 right-4 text-stone-600 hover:text-stone-800 transition-colors"
-                aria-label="Close"
+                aria-label={t('common.close')}
               >
                 <X className="w-5 h-5" />
               </button>
               
               <div className="text-center">
                 <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                   <Mail className="w-8 h-8" />
                 </div>
-                <h3 className="font-heading text-3xl text-stone-800 mb-4 tracking-wider uppercase">The Atelier Circle</h3>
-                <p className="text-stone-600 text-sm mb-8 leading-relaxed italic">Join for exclusive previews of our new bridal collections and private viewings in Sharjah.</p>
+                <h3 className="font-heading text-3xl text-stone-800 mb-4 tracking-wider uppercase">{t('newsletter.title')}</h3>
+                <p className="text-stone-600 text-sm mb-8 leading-relaxed italic">{t('newsletter.body')}</p>
                 
                 <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleDismissNewsletter(); }}>
                   <input 
                     type="email" 
-                    placeholder="E-mail Address" 
+                    placeholder={t('newsletter.email_placeholder')} 
                     className="w-full px-6 py-4 bg-stone-50 border border-stone-200 text-xs tracking-widest uppercase outline-none focus:border-gold"
-                    aria-label="Email address"
+                    aria-label={t('newsletter.email_aria')}
                   />
-                  <button className="w-full btn-luxury">Join The Society</button>
+                  <button className="w-full btn-luxury">{t('newsletter.cta')}</button>
                 </form>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
 
       {/* Cookie Banner */}
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
-                <p className="text-micro tracking-widest uppercase text-stone-600 mb-1">Privacy & Elegance</p>
-                <p className="text-xs text-stone-800 tracking-wide">We use cookies to curate a personalized atelier experience. <Link to="/privacy" className="underline hover:text-gold">Learn details</Link>.</p>
+                <p className="text-micro tracking-widest uppercase text-stone-600 mb-1">{t('cookies.heading')}</p>
+                <p className="text-xs text-stone-800 tracking-wide">{t('cookies.body')} <Link to="/privacy" className="underline hover:text-gold">{t('cookies.learn')}</Link>.</p>
               </div>
               <div className="flex gap-4">
                 <button 
                   onClick={handleAcceptCookies}
                   className="px-8 py-3 bg-stone-900 text-white text-micro tracking-[0.2em] uppercase hover:bg-stone-800 transition-all font-bold"
                 >
-                  Accept & Explore
+                  {t('cookies.accept')}
                 </button>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </>
   );
 }
diff --git a/src/components/ProductCard.tsx b/src/components/ProductCard.tsx
index e52c132..f46722e 100644
--- a/src/components/ProductCard.tsx
+++ b/src/components/ProductCard.tsx
@@ -1,45 +1,50 @@
 import { Link } from 'react-router-dom';
-import { Heart, ShoppingBag, Box, CheckCircle2, ArrowRight } from 'lucide-react';
+import { Heart, ShoppingBag, Box, CheckCircle2, ArrowRight, Calendar, X } from 'lucide-react';
 import { motion } from 'motion/react';
 import { useState } from 'react';
 import React from 'react';
 import { Product } from '../types';
 import { cn, formatPrice } from '../lib/utils';
 import { useWishlist } from '../contexts/WishlistContext';
 import { useCart } from '../contexts/CartContext';
 import { useLanguage } from '../contexts/LanguageContext';
+import { translateProductValue } from '../lib/productVocab';
 import { useFeature } from '../hooks/useFeature';
 import { Skeleton } from './Skeleton';
+import { useProductAvailability } from '../hooks/useProductAvailability';
+import { format } from 'date-fns';
 
 interface ProductCardProps {
   product: Product;
   key?: string | number;
   lookNumber?: string;
 }
 
 export default function ProductCard({ product, lookNumber }: ProductCardProps) {
   const [isAdded, setIsAdded] = useState(false);
   const [imageLoaded, setImageLoaded] = useState(false);
   const [showMobileActions, setShowMobileActions] = useState(false);
   const [showSizes, setShowSizes] = useState(false);
   const [selectedSize, setSelectedSize] = useState('');
   const scrollRevealEnabled = useFeature('scrollReveal');
   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
   const { addItem } = useCart();
-  const { t } = useLanguage();
+  const { t, language } = useLanguage();
 
   const isSale = product.productType === 'sale' || product.productType === 'both';
   const isRent = product.productType === 'rent' || product.productType === 'both';
   const saved = isInWishlist(product.id);
   const hasSizes = product.sizes && product.sizes.length > 0;
 
+  const { start, end, isAvailable } = useProductAvailability(isRent ? product.id : undefined);
+
   const toggleWishlist = (e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();
     if (saved) {
       removeFromWishlist(product.id);
     } else {
       addToWishlist(product);
     }
   };
 
@@ -225,52 +230,57 @@ export default function ProductCard({ product, lookNumber }: ProductCardProps) {
           <p className="text-micro tracking-widest text-stone-600 uppercase mb-1">{product.category}</p>
         {lookNumber && (
           <span className="font-label text-micro tracking-[0.3em] uppercase text-gold">
             {t('silhouettes.look')} {lookNumber}
           </span>
         )}
           <Link to={`/product/${product.id}`} className="block font-heading text-xl text-stone-900 tracking-tight hover:text-gold transition-colors leading-[1.1]">
             {product.name}
         </Link>
         {product.fabric && (
-          <p className="font-editorial italic text-sm text-stone-600">{product.fabric}</p>
+          <p className="font-editorial italic text-sm text-stone-600">{translateProductValue('fabric', product.fabric, language)}</p>
         )}
 
         {/* Expanding gold frame — couture hover detail */}
         <span className="absolute inset-3 border border-gold/0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:inset-4 group-hover:border-gold/40 pointer-events-none z-10" aria-hidden="true" />
         
           <div className="mt-2 flex flex-col gap-1">
             {isSale && (
               <p className="text-xs tracking-wider text-stone-600">
-                {t('product.purchase')}: <span className="font-semibold text-stone-800"><span className="me-1 text-micro uppercase tracking-wider text-stone-600">{t('pricing.from')}</span>{formatPrice(product.salePrice || 0)}</span>
+                {t('product.purchase')}: <span className="font-semibold text-stone-800"><span className="me-1 text-micro uppercase tracking-wider text-stone-600">{t('pricing.from')}</span>{' '}{formatPrice(product.salePrice || 0)}</span>
               </p>
             )}
             {isRent && (
-              <p className="text-xs tracking-wider text-stone-600">
-                {t('product.rent')}: <span className="text-stone-700"><span className="me-1 text-micro uppercase tracking-wider text-stone-600">{t('pricing.from')}</span>{formatPrice(product.rentalPrice || 0)}</span>
-              </p>
+              <>
+                <p className="text-xs tracking-wider text-stone-600">
+                  {t('product.rent')}: <span className="text-stone-700"><span className="me-1 text-micro uppercase tracking-wider text-stone-600">{t('pricing.from')}</span>{' '}{formatPrice(product.rentalPrice || 0)}</span>
+                </p>
+                {isAvailable && start && end && (
+                  <p className="flex items-center gap-1 text-micro text-gold/80 tracking-wider">
+                    <Calendar className="w-3 h-3" />
+                    <span className="tracking-widest uppercase font-medium">
+                      {format(start, 'MMM d')}–{format(end, 'd')} {t('product.available')}
+                    </span>
+                  </p>
+                )}
+                {!isAvailable && (
+                  <p className="flex items-center gap-1 text-micro text-rose-500/80 tracking-wider">
+                    <X className="w-3 h-3" />
+                    <span className="tracking-widest uppercase font-medium">{t('product.fully_booked')}</span>
+                  </p>
+                )}
+              </>
             )}
           </div>
 
           <Link
             to={`/product/${product.id}`}
             className="inline-flex items-center gap-1.5 font-label text-micro tracking-[0.25em] uppercase text-stone-800 hover:text-gold transition-colors duration-500 mt-2"
           >
             {t('silhouettes.enquire')}
             <ArrowRight className="w-3 h-3" />
           </Link>
         </div>
-        
-        <button 
-          onClick={toggleWishlist}
-          className={cn(
-            "p-2 transition-colors",
-            saved ? "text-rose-400" : "text-stone-500 hover:text-rose-400"
-          )}
-          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
-        >
-          <Heart className={cn("w-5 h-5", saved && "fill-current")} />
-        </button>
       </div>
     </motion.div>
   );
 }
diff --git a/src/components/ThreeDViewer.tsx b/src/components/ThreeDViewer.tsx
index 73ecedd..469a34f 100644
--- a/src/components/ThreeDViewer.tsx
+++ b/src/components/ThreeDViewer.tsx
@@ -1,28 +1,30 @@
 import React, { useEffect, useRef, useState } from 'react';
 import '@google/model-viewer';
 import { motion, AnimatePresence } from 'motion/react';
 import { Maximize2, RotateCcw, Box, Loader2, AlertTriangle } from 'lucide-react';
+import { useLanguage } from '../contexts/LanguageContext';
 
 interface ThreeDViewerProps {
   src: string;
   poster?: string;
   alt?: string;
   className?: string;
 }
 
 const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ src, poster, alt, className }) => {
   const modelRef = useRef<any>(null);
   const [loadingProgress, setLoadingProgress] = useState(0);
   const [isLoaded, setIsLoaded] = useState(false);
   const [hasError, setHasError] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
+  const { t } = useLanguage();
 
   useEffect(() => {
     const model = modelRef.current;
     if (!model) return;
 
     const onProgress = (event: any) => {
       setLoadingProgress(event.detail.totalProgress * 100);
     };
 
     const onLoad = () => {
@@ -140,34 +142,34 @@ const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ src, poster, alt, className
                       <AlertTriangle className="w-6 h-6 text-rose-400" />
                     </div>
                     <p className="text-sm font-semibold text-stone-700 mb-2">3D viewer unavailable</p>
                     <p className="text-micro text-stone-600 leading-relaxed mb-4">
                       {errorMessage}
                     </p>
                     <button
                       onClick={handleRetry}
                       className="btn-luxury !py-2 !px-6 text-micro"
                     >
-                      Retry
+                      {t('common.retry')}
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
-                <span className="text-micro uppercase tracking-[0.2em] text-stone-600">Initializing 3D Detail</span>
+                <span className="text-micro uppercase tracking-[0.2em] text-stone-600">{t('threed.initializing')}</span>
               </div>
             )}
           </div>
 
           <div className="absolute bottom-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={handleReset}
               className="p-3 bg-ivory/80 backdrop-blur border border-stone-100 hover:bg-gold hover:text-white transition-all rounded-full"
               title="Reset View"
               aria-label="Reset view"
diff --git a/src/components/salon/EditorialPlate.tsx b/src/components/salon/EditorialPlate.tsx
index 5ad96ea..5f7eb6d 100644
--- a/src/components/salon/EditorialPlate.tsx
+++ b/src/components/salon/EditorialPlate.tsx
@@ -1,24 +1,25 @@
 import { Link } from 'react-router-dom';
 import { ArrowRight } from 'lucide-react';
 import { cn } from '../../lib/utils';
 import { useLanguage } from '../../contexts/LanguageContext';
+import { translateProductValue } from '../../lib/productVocab';
 import { Product } from '../../types';
 
 interface EditorialPlateProps {
   product: Product;
   index: number;
   reverse?: boolean;
 }
 
 export default function EditorialPlate({ product, index, reverse }: EditorialPlateProps) {
-  const { t } = useLanguage();
+  const { t, language } = useLanguage();
   const lookNumber = String(index + 1).padStart(2, '0');
 
   return (
     <figure className="group grid gap-6 md:grid-cols-12 md:gap-10 items-end">
       <div className={cn('relative overflow-hidden md:col-span-7', reverse && 'md:order-2')}>
         <img
           src={product.images[0]}
           alt={product.name}
           loading="lazy"
           className="aspect-[3/4] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
@@ -26,21 +27,21 @@ export default function EditorialPlate({ product, index, reverse }: EditorialPla
         <span className="absolute top-4 left-4 font-heading text-6xl font-light text-white/90 drop-shadow-md">
           {lookNumber}
         </span>
       </div>
       <figcaption className={cn('flex flex-col gap-3 md:col-span-5', reverse && 'md:order-1')}>
         <span className="font-label text-xs tracking-[0.3em] uppercase text-gold">
           {t('silhouettes.look')} {lookNumber}
         </span>
         <h3 className="font-heading text-2xl md:text-3xl font-light text-stone-800">{product.name}</h3>
         {product.fabric && (
-          <p className="font-editorial italic text-stone-600">{product.fabric}</p>
+          <p className="font-editorial italic text-stone-600">{translateProductValue('fabric', product.fabric, language)}</p>
         )}
         <Link
           to={`/product/${product.id}`}
           className="group/link inline-flex items-center gap-2 font-label text-xs tracking-[0.25em] uppercase text-stone-800 transition-colors duration-700 hover:text-gold mt-2"
         >
           {t('silhouettes.enquire')}
           <ArrowRight className="w-4 h-4 transition-transform duration-700 group-hover/link:translate-x-1 rtl:rotate-180" />
         </Link>
       </figcaption>
     </figure>
diff --git a/src/contexts/AuthContext.tsx b/src/contexts/AuthContext.tsx
index 4e3fbdc..516ceaf 100644
--- a/src/contexts/AuthContext.tsx
+++ b/src/contexts/AuthContext.tsx
@@ -1,15 +1,16 @@
 import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
 import { supabase, isSupabaseConfigured } from '../services/supabase';
 import { getProfile } from '../services/auth';
 import { hashPassword } from '../lib/crypto';
 import { useToast } from './ToastContext';
+import { useLanguage } from './LanguageContext';
 
 interface User {
   id: string;
   name: string;
   email: string;
   role: 'client' | 'admin';
 }
 
 interface AuthContextType {
   user: User | null;
@@ -66,20 +67,21 @@ function saveLocalUsers(users: Record<string, { name: string; passwordHash: stri
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const signingOutRef = useRef(false);
   const { addToast } = useToast();
+  const { t } = useLanguage();
 
   useEffect(() => {
     if (isSupabaseConfigured) {
       initSupabaseAuth();
     } else {
       initLocalAuth();
     }
   }, []);
 
   // --- Supabase Auth ---
@@ -117,26 +119,26 @@ export function AuthProvider({ children }: { children: ReactNode }) {
       let profile = await getProfile(userId);
       if (!profile) {
         // Retry once after a delay in case the profile trigger is still running
         await new Promise(r => setTimeout(r, 1500));
         profile = await getProfile(userId);
       }
       
       if (profile) {
         setUser({ id: profile.id, name: profile.name, email: profile.email, role: profile.role });
       } else {
-        addToast({ type: 'info', title: 'Profile not found', message: 'Some features may be limited.' });
+        addToast({ type: 'info', title: t('auth.profile_missing_title'), message: t('auth.limited_msg') });
         setUser({ id: userId, name: email.split('@')[0], email, role: 'client' });
       }
     } catch (err) {
       console.error('[Riman] Failed to load profile:', err);
-      addToast({ type: 'info', title: 'Could not load account', message: 'Some features may be limited.' });
+      addToast({ type: 'info', title: t('auth.load_fail_title'), message: t('auth.limited_msg') });
       setUser({ id: userId, name: email.split('@')[0], email, role: 'client' });
     }
   };
 
   // --- Local Auth Fallback (client-only, no admin) ---
   const initLocalAuth = async () => {
     try {
       const saved = localStorage.getItem(LOCAL_SESSION_KEY);
       if (saved) {
         const parsed = JSON.parse(saved);
diff --git a/src/pages/Checkout.tsx b/src/pages/Checkout.tsx
index 621e04f..144ce18 100644
--- a/src/pages/Checkout.tsx
+++ b/src/pages/Checkout.tsx
@@ -7,37 +7,38 @@ import { motion, AnimatePresence } from 'motion/react';
 import { ShieldCheck, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, X, Truck, Calendar, MessageSquare, CreditCard, Building2, Lock, RotateCcw, MessageCircle } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { cn } from '../lib/utils';
 import { deriveOrderType, validateCheckoutStep } from '../lib/checkout';
 import { getItemUnitPrice } from '../lib/pricing';
 import { createOrder, createOrderViaEdge } from '../services/orders';
 import { isSupabaseConfigured } from '../services/supabase';
 import { createCheckoutSession, isStripeConfigured } from '../services/payment';
 import { sendOrderConfirmationEmail, sendAdminOrderAlert } from '../lib/email';
 import { z } from 'zod';
+import { analytics } from '../services/analytics';
 
 const checkoutSchema = z.object({
   firstName: z.string().trim().min(1),
   lastName: z.string().trim().min(1),
   email: z.string().trim().email(),
   phone: z.string().trim().min(7),
   address: z.string().trim().min(1),
   city: z.string().trim().min(1),
   country: z.string().min(1),
 });
 
 const WHATSAPP_NUMBER = '971553730792';
 
 export default function Checkout() {
   const { items, subtotal, clearCart, removeItem } = useCart();
   const { user } = useAuth();
-  const { t, isRtl } = useLanguage();
+  const { t, isRtl, language } = useLanguage();
   const [step, setStep] = useState(1);
   const [isProcessing, setIsProcessing] = useState(false);
   const [orderComplete, setOrderComplete] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [touched, setTouched] = useState<Record<string, boolean>>({});
   const [orderNotes, setOrderNotes] = useState('');
   const [paymentMethod, setPaymentMethod] = useState<'atelier' | 'card'>('atelier');
   const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
   let orderId: string | null = null;
 
@@ -91,23 +92,27 @@ export default function Checkout() {
     setErrors(prev => {
       const next = { ...prev };
       if (error) next[name] = error;
       else delete next[name];
       return next;
     });
   };
 
   const nextStep = () => {
     if (validateStep(step)) {
-      setStep(prev => prev + 1);
+      const nextStepNum = step + 1;
+      setStep(nextStepNum);
       setMobileSummaryOpen(false);
       window.scrollTo({ top: 0, behavior: 'smooth' });
+      if (nextStepNum === 3) {
+        analytics.beginCheckout(subtotal, 'AED', items.length);
+      }
     }
   };
   const prevStep = () => {
     setStep(prev => prev - 1);
     setMobileSummaryOpen(false);
     window.scrollTo({ top: 0, behavior: 'smooth' });
   };
 
   const [submitError, setSubmitError] = useState<string | null>(null);
 
@@ -242,23 +247,24 @@ export default function Checkout() {
           paymentMethod: paymentMethod === 'card' ? 'Card (Stripe)' : 'Atelier (Pay on Delivery)',
           createdAt: new Date().toISOString(),
         };
 
         // Send emails (fire-and-forget, don't block UI)
         sendOrderConfirmationEmail(orderData).catch(err => console.error('Order confirmation email failed:', err));
         sendAdminOrderAlert(orderData).catch(err => console.error('Admin order alert failed:', err));
       }
 
       setOrderComplete(true);
+      analytics.orderComplete(orderId || 'unknown', subtotal, 'AED', items.length);
       clearCart();
     } catch (err: any) {
-      setSubmitError(err.message || 'Failed to place order. Please try again.');
+      setSubmitError(err.message || t('checkout.order_failed'));
     } finally {
       setIsProcessing(false);
     }
   };
 
   if (items.length === 0 && !orderComplete) {
     return (
       <div className="pt-8 pb-20 px-6 min-h-[60vh] flex flex-col items-center justify-center text-center bg-ivory">
         <h1 className="font-heading text-4xl text-stone-800 uppercase mb-4">{t('checkout.empty')}</h1>
         <div className="w-12 h-px bg-gold mx-auto mb-6" />
@@ -418,21 +424,21 @@ export default function Checkout() {
                         <Input
                           label={t('checkout.city')}
                           value={formData.city}
                           onChange={(v: string) => setFormData({...formData, city: v})}
                           onBlur={() => handleBlur('city')}
                           error={touched.city ? errors.city : undefined}
                           autoComplete="address-level2"
                         />
                         <Input
                           label={t('checkout.country')}
-                          value={formData.country}
+                          value={formData.country === 'United Arab Emirates' && language === 'ar' ? t('checkout.country_default') : formData.country}
                           onChange={(v: string) => setFormData({...formData, country: v})}
                           disabled
                           autoComplete="country-name"
                         />
                       </div>
                     </div>
                     <div className="flex gap-4 mt-4">
                       <button onClick={prevStep} className="flex-1 btn-luxury-outline py-5 flex items-center justify-center gap-3">
                         <ArrowLeft className={cn("w-4 h-4", isRtl && "rotate-180")} /> {t('checkout.previous')}
                       </button>
@@ -469,21 +475,21 @@ export default function Checkout() {
                         <div>
                           <span className="text-stone-600 block mb-0.5">{t('checkout.email')}</span>
                           <span className="text-stone-800 font-medium">{formData.email}</span>
                         </div>
                         <div>
                           <span className="text-stone-600 block mb-0.5">{t('checkout.address')}</span>
                           <span className="text-stone-800 font-medium">{formData.address}</span>
                         </div>
                         <div>
                           <span className="text-stone-600 block mb-0.5">{t('checkout.city')}</span>
-                          <span className="text-stone-800 font-medium">{formData.city}, {formData.country}</span>
+                          <span className="text-stone-800 font-medium">{formData.city}, {formData.country === 'United Arab Emirates' && language === 'ar' ? t('checkout.country_default') : formData.country}</span>
                         </div>
                       </div>
                     </div>
 
                     {/* Items */}
                     <div className="space-y-3">
                       <h3 className="font-heading text-xs tracking-[0.2em] uppercase text-stone-600">{t('checkout.your_selections')}</h3>
                       {items.map((item) => (
                         <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 items-center p-3 border border-stone-100">
                           <div className="w-14 h-18 bg-stone-100 flex-shrink-0 overflow-hidden">
@@ -815,21 +821,21 @@ function OrderSidebar({ items, subtotal, paymentMethod, removeItem, t }: {
         </div>
         <div className="flex justify-between font-heading text-lg pt-4 border-t border-stone-800 mt-3">
           <span className="uppercase text-xs tracking-widest">{t('checkout.total')}</span>
           <span className="text-gold">{formatPrice(subtotal)}</span>
         </div>
       </div>
 
       <div className="mt-8 flex items-center gap-3 p-3 border border-white/5 bg-white/5">
         <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
         <p className="text-micro tracking-widest leading-relaxed text-stone-400 uppercase">
-          {paymentMethod === 'card' ? 'Secured by Stripe' : 'Secure Order — Payment at Atelier'}
+          {paymentMethod === 'card' ? t('checkout.secured_stripe') : t('checkout.secure_order_atelier')}
         </p>
       </div>
     </div>
   );
 }
 
 function Input({ label, value, onChange, onBlur, placeholder, className, disabled, type = "text", error, autoComplete }: {
   label: string;
   value: string;
   onChange: (v: string) => void;
diff --git a/src/pages/ProductDetail.tsx b/src/pages/ProductDetail.tsx
index 1b3af89..ee46753 100644
--- a/src/pages/ProductDetail.tsx
+++ b/src/pages/ProductDetail.tsx
@@ -7,20 +7,21 @@ import { formatPrice, cn, categoryToSlug } from '../lib/utils';
 import { Product, type GownRef } from '../types';
 import { useData } from '../contexts/DataContext';
 import { useCart } from '../contexts/CartContext';
 import { useWishlist } from '../contexts/WishlistContext';
 import { useLanguage } from '../contexts/LanguageContext';
 import { useScrollLock } from '../hooks/useScrollLock';
 import { useFeature } from '../hooks/useFeature';
 import { useToast } from '../contexts/ToastContext';
 import { fetchApprovedReviews, submitReview, type Review } from '../services/reviews';
 import { uploadImage } from '../services/upload';
+import { translateProductValue } from '../lib/productVocab';
 import ProductCard from '../components/ProductCard';
 import AvailabilityCalendar from '../components/AvailabilityCalendar';
 import SizeGuide from '../components/SizeGuide';
 import { ProductDetailSkeleton } from '../components/Skeleton';
 import { analytics } from '../services/analytics';
 
 const ThreeDViewer = lazy(() => import('../components/ThreeDViewer'));
 
 export default function ProductDetail() {
   const { products: dynamicProducts, isLoading } = useData();
@@ -158,21 +159,21 @@ export default function ProductDetail() {
     }
     setIsAddingToCart(true);
     setTimeout(() => {
       if (!product) return;
       const intent = isRent && bookingDate ? 'rent' : 'sale';
       addItem(product, intent, selectedSize, bookingDate || undefined);
       setIsAddingToCart(false);
       addToast({
         type: 'success',
         title: intent === 'rent' ? t('product.toast_rental') : t('product.toast_added'),
-        message: `${product.name} — ${intent === 'rent' ? 'rental booked' : 'added to your collection'}`
+        message: `${product.name} — ${intent === 'rent' ? t('product.toast_suffix_rental') : t('product.toast_suffix_added')}`
       });
       if (intent === 'rent') setShowConfirmation(true);
     }, 600);
   };
 
   if (!product) {
     if (isLoading) return <ProductDetailSkeleton />;
     return (
       <div className="pt-40 pb-20 text-center">
         <h1 className="font-heading text-4xl mb-4">{t('product.not_found')}</h1>
@@ -208,21 +209,21 @@ export default function ProductDetail() {
   };
 
   return (
     <>
       <div id="product-detail-page" className="pt-24 bg-ivory min-h-screen pb-24 lg:pb-12">
         <div className="container mx-auto px-5 py-10">
           {/* Breadcrumbs */}
           <nav className="flex gap-2 text-xs tracking-[0.2em] uppercase text-stone-600 mb-10">
             <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
             <ChevronRight className="w-3 h-3" />
-            <Link to={`/collection/${categoryToSlug(product.category)}`} className="hover:text-gold transition-colors">{product.category}</Link>
+            <Link to={`/collection/${categoryToSlug(product.category)}`} className="hover:text-gold transition-colors">{translateProductValue('category', product.category, language)}</Link>
             <ChevronRight className="w-3 h-3" />
             <span className="text-stone-800 font-medium">{product.name}</span>
           </nav>
 
           <div className="grid grid-cols-1 lg:grid-cols-[48fr_52fr] gap-10 lg:gap-14 mb-20">
             {/* Gallery */}
             <div className="space-y-3">
               <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                 <AnimatePresence mode="wait">
                   {is3DMode && product.glbUrl ? (
@@ -339,26 +340,26 @@ export default function ProductDetail() {
                     </button>
                   );
                 })}
               </div>
 
               {/* Quick Specs Bar */}
               <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-100">
                 <div className="flex flex-col items-center gap-1.5 py-3">
                   <Gem className="w-4 h-4 text-gold" />
                   <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.fabric')}</span>
-                  <span className="text-micro text-stone-700 font-medium tracking-wide">{product.fabric || 'Luxury Blend'}</span>
+                  <span className="text-micro text-stone-700 font-medium tracking-wide">{translateProductValue('fabric', product.fabric, language) || t('product.fabric_default')}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1.5 py-3 border-x border-stone-100">
                   <Sparkles className="w-4 h-4 text-gold" />
                   <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.silhouette')}</span>
-                  <span className="text-micro text-stone-700 font-medium tracking-wide">{product.silhouette || product.category}</span>
+                  <span className="text-micro text-stone-700 font-medium tracking-wide">{translateProductValue('silhouette', product.silhouette, language) || translateProductValue('category', product.category, language)}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1.5 py-3">
                   <Wind className="w-4 h-4 text-gold" />
                   <span className="text-micro text-stone-600 uppercase tracking-widest font-bold">{t('product.color')}</span>
                   <span className="text-micro text-stone-700 font-medium tracking-wide">{product.color?.[0] || product.style[0] || 'Signature'}</span>
                 </div>
               </div>
             </div>
 
             {/* Info — Sticky on Desktop */}
@@ -496,34 +497,34 @@ export default function ProductDetail() {
                 <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between p-5 bg-ivory hover:bg-ivory transition-colors">
                   <span className="font-body text-micro font-bold tracking-widest uppercase text-stone-800">{t('product.specifications')}</span>
                   <ChevronDown className={cn("w-4 h-4 text-stone-600 transition-transform duration-300", showDetails && "rotate-180")} />
                 </button>
                 <AnimatePresence>
                   {showDetails && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                       <div className="border-t border-stone-100">
                         <div className="flex justify-between py-3.5 px-5 bg-ivory">
                           <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.fabric')}</span>
-                          <span className="text-xs text-stone-800 font-medium tracking-wide">{product.fabric || 'Luxury Blend'}</span>
+                          <span className="text-xs text-stone-800 font-medium tracking-wide">{translateProductValue('fabric', product.fabric, language) || t('product.fabric_default')}</span>
                         </div>
                         <div className="flex justify-between py-3.5 px-5 bg-stone-50/50">
                           <span className="text-micro text-gold uppercase tracking-widest font-bold">{t('product.designer')}</span>
                           <span className="text-xs text-stone-800 font-medium tracking-wide">{product.designer || 'Riman Atelier'}</span>
                         </div>
                         <div className="py-3.5 px-5 bg-ivory">
                           <span className="text-micro text-gold uppercase tracking-widest font-bold block mb-2">{t('product.style_elements')}</span>
                           <div className="flex flex-wrap gap-2">
                             {product.style.map((tag, i) => (
                               <span key={i} className="text-micro px-3 py-1 bg-stone-50 border border-stone-100 text-stone-600 uppercase tracking-[0.15em] font-medium">{tag}</span>
                             ))}
                             {product.category && (
-                              <span className="text-micro px-3 py-1 bg-gold/5 border border-gold/10 text-gold uppercase tracking-[0.15em] font-bold">{product.category}</span>
+                              <span className="text-micro px-3 py-1 bg-gold/5 border border-gold/10 text-gold uppercase tracking-[0.15em] font-bold">{translateProductValue('category', product.category, language)}</span>
                             )}
                           </div>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
 
               {/* Care Instructions Accordion */}
