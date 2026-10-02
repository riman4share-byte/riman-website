import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GlobalFeatures from './GlobalFeatures';
import MobileBottomNav from './MobileBottomNav';
import ImmersiveUI from './ImmersiveUI';
import SEOHead from './SEOHead';
import ToastContainer from './ToastContainer';
import CurtainTransition from './CurtainTransition';
import { useLanguage } from '../contexts/LanguageContext';

const CHECKOUT_ROUTES = ['/checkout', '/payment/success', '/payment/cancel'];

export default function Layout() {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const isCheckout = CHECKOUT_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div id="layout-root" className="min-h-screen flex flex-col font-body pb-16 md:pb-0">
      <SEOHead />
      <ImmersiveUI />
      <CurtainTransition />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[300] focus:px-5 focus:py-3 focus:bg-onyx focus:text-ivory focus:font-label focus:text-xs focus:tracking-widest focus:uppercase focus:outline focus:outline-2 focus:outline-gold"
      >
        {t('a11y.skip_to_content')}
      </a>
      {!isCheckout && <Header />}
      {/* Pages render their own <section>/<div>; this is the single <main> landmark. */}
      <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
        <Outlet />
      </main>
      {!isCheckout && <Footer />}
      
      <GlobalFeatures />
      {!isCheckout && <MobileBottomNav />}
      <ToastContainer />
    </div>
  );
}
