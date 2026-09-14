import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { lazyWithRetry } from './lib/lazyWithRetry';
import { DataProvider } from './contexts/DataContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import Layout from './components/Layout';

// Pages - Lazy Loaded
const Home = lazyWithRetry(() => import('./pages/Index'));
const CollectionPage = lazyWithRetry(() => import('./pages/CollectionPage'));
const CollectionsPage = lazyWithRetry(() => import('./pages/CollectionsPage'));
const JournalPage = lazyWithRetry(() => import('./pages/JournalPage'));
const ProductDetail = lazyWithRetry(() => import('./pages/ProductDetail'));
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const SearchPage = lazyWithRetry(() => import('./pages/SearchPage'));
const WishlistPage = lazyWithRetry(() => import('./pages/WishlistPage'));
const ProfilePage = lazyWithRetry(() => import('./pages/ProfilePage'));
const FaqPage = lazyWithRetry(() => import('./pages/FaqPage'));
const AlterationsPage = lazyWithRetry(() => import('./pages/AlterationsPage'));
const PrivacyPage = lazyWithRetry(() => import('./pages/PrivacyPage'));
const TermsPage = lazyWithRetry(() => import('./pages/TermsPage'));
const Auth = lazyWithRetry(() => import('./pages/Auth'));
const Checkout = lazyWithRetry(() => import('./pages/Checkout'));
const PaymentSuccess = lazyWithRetry(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazyWithRetry(() => import('./pages/PaymentCancel'));
const StyleQuiz = lazyWithRetry(() => import('./pages/StyleQuiz'));
const AppointmentPage = lazyWithRetry(() => import('./pages/AppointmentPage'));
const WeddingTimeline = lazyWithRetry(() => import('./pages/WeddingTimeline'));
const WeddingChecklist = lazyWithRetry(() => import('./pages/WeddingChecklist'));
const GalleryPage = lazyWithRetry(() => import('./pages/GalleryPage'));
const Demo21st = lazyWithRetry(() => import('./pages/Demo21st'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));

// Contexts
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { applySafeCustomHead, clearSafeCustomHead } from './lib/safeHead';

// Admin Pages - Lazy Loaded
const AdminLayout = lazyWithRetry(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazyWithRetry(() => import('./pages/admin/AdminDashboard'));
const AdminCalendar = lazyWithRetry(() => import('./pages/admin/AdminCalendar'));
const AdminSettings = lazyWithRetry(() => import('./pages/admin/AdminSettings'));
const AdminProducts = lazyWithRetry(() => import('./pages/admin/AdminProducts'));
const AdminContent = lazyWithRetry(() => import('./pages/admin/AdminContent'));
const AdminReviews = lazyWithRetry(() => import('./pages/admin/AdminReviews'));

const AdminOrders = lazyWithRetry(() => import('./pages/admin/AdminOrders'));
const AdminAppointments = lazyWithRetry(() => import('./pages/admin/AdminAppointments'));
const AdminGallery = lazyWithRetry(() => import('./pages/admin/AdminGallery'));

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
      <MotionConfig reducedMotion="user">
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <LanguageProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <BrowserRouter>
                      <Suspense fallback={
                        <div className="min-h-screen bg-ivory flex items-center justify-center" role="status" aria-live="polite">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" aria-hidden="true" />
                            <p className="sr-only">Loading page…</p>
                          </div>
                        </div>
                      }>
                        <MaintenanceGate>
                          <AnimatedRoutes />
                        </MaintenanceGate>
                      </Suspense>
                    </BrowserRouter>
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </LanguageProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </ToastProvider>
      </MotionConfig>
    </GlobalErrorBoundary>
  );
}

function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { settings, isLoading } = useSettings();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (settings.advanced.maintenanceMode && !isAdmin) {
      document.title = 'Maintenance | Atelier Riman';
    }
  }, [settings.advanced.maintenanceMode, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (settings.advanced.maintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen bg-onyx flex items-center justify-center text-center px-6">
        <div className="max-w-md">
          <h1 className="font-heading text-4xl md:text-5xl text-gold uppercase tracking-widest mb-4">Atelier Riman</h1>
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          <p className="font-body text-ivory/60 text-sm tracking-widest uppercase mb-2">
            {settings.advanced.maintenanceMessage || 'We are currently updating our atelier.'}
          </p>
          <p className="font-body text-ivory/30 text-micro tracking-widest uppercase mt-6">
            Please check back soon.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function SEOInjector() {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.advanced.metaDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', settings.advanced.metaDescription);
    }

    if (settings.advanced.keywords) {
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'keywords');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', settings.advanced.keywords);
    }

    if (settings.advanced.ogImageUrl) {
      let og = document.querySelector('meta[property="og:image"]');
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', 'og:image');
        document.head.appendChild(og);
      }
      og.setAttribute('content', settings.advanced.ogImageUrl);
    }

    if (settings.advanced.customHeadCode) {
      // Allowlisted, inert parsing only — see src/lib/safeHead.ts
      applySafeCustomHead(settings.advanced.customHeadCode);
    } else {
      clearSafeCustomHead();
    }
    return () => {
      clearSafeCustomHead();
    };
  }, [settings.advanced]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <DataProvider>
      <SEOInjector />
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="collection/:category" element={<PageWrapper><CollectionPage /></PageWrapper>} />
          <Route path="collections" element={<PageWrapper><CollectionsPage /></PageWrapper>} />
          <Route path="journal" element={<PageWrapper><JournalPage /></PageWrapper>} />
          <Route path="product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
          <Route path="about" element={<PageWrapper><AboutPage /></PageWrapper>} />
          <Route path="contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          <Route path="search" element={<PageWrapper><SearchPage /></PageWrapper>} />
          <Route path="wishlist" element={<PageWrapper><WishlistPage /></PageWrapper>} />
          <Route path="profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
          <Route path="faq" element={<PageWrapper><FaqPage /></PageWrapper>} />
          <Route path="alterations" element={<PageWrapper><AlterationsPage /></PageWrapper>} />
          <Route path="privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
          <Route path="terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
          <Route path="auth" element={<PageWrapper><Auth /></PageWrapper>} />
          <Route path="checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
          <Route path="payment/success" element={<PageWrapper><PaymentSuccess /></PageWrapper>} />
          <Route path="payment/cancel" element={<PageWrapper><PaymentCancel /></PageWrapper>} />
          <Route path="style-quiz" element={<PageWrapper><StyleQuiz /></PageWrapper>} />
          <Route path="appointment" element={<PageWrapper><AppointmentPage /></PageWrapper>} />
          <Route path="timeline" element={<PageWrapper><WeddingTimeline /></PageWrapper>} />
          <Route path="wedding-checklist" element={<PageWrapper><WeddingChecklist /></PageWrapper>} />
          <Route path="gallery" element={<PageWrapper><GalleryPage /></PageWrapper>} />
          <Route path="demo-21st" element={<PageWrapper><Demo21st /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Route>

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
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
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="orders/:id" element={<AdminOrders />} />
          <Route path="*" element={<AdminDashboard />} />
        </Route>
      </Routes>
      </motion.div>
      </AnimatePresence>
    </DataProvider>
  );
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -10, filter: 'blur(4px)' }
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }}
    >
      {children}
    </motion.div>
  );
}

