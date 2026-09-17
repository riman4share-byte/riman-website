import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, ShoppingBag, Menu, X, Globe, Search, Sparkles, ChevronRight, Calendar, Scissors, HelpCircle, Phone, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useScrollLock } from '../hooks/useScrollLock';
import Logo from './Logo';

const leftNavLinks = [
  { label: "About", path: "/about", key: 'nav.about' },
  { label: "Bridal", path: "/collection/bridal", key: 'nav.bridal' },
  { label: "Couture", path: "/collection/couture", key: 'nav.couture' },
  { label: "Collections", path: "/collections", key: 'nav.collections' },
  { label: "Journal", path: "/journal", key: 'nav.journal' },
];

const rightNavLinks = [
  { label: "Contact", path: "/contact", key: 'nav.contact' },
];

export default function Header() {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === '/';
  // Light content (white text/icons) whenever the header sits over the dark
  // hero — home at top (transparent + scrim) or home scrolled (translucent
  // onyx). Inner pages keep the solid ivory bar with dark content.
  const onDark = isHome;
  const scrolledHome = isHome && isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogoMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setLogoPos({ x: x * 0.3, y: y * 0.3 });
  };

  const resetLogo = () => setLogoPos({ x: 0, y: 0 });

  useScrollLock(isMenuOpen);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      id="header"
      dir={isRtl ? 'rtl' : 'ltr'}
      className={cn(
        "top-0 left-0 w-full z-[100] transition-all duration-500 ease-[0.16,1,0.3,1]",
        isHome ? "fixed" : "absolute",
        scrolledHome
          ? "bg-onyx/95 py-3 border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          : !isHome
            ? "bg-ivory py-3 border-b border-stone-200/70"
            : "bg-gradient-to-b from-black/60 via-black/25 to-transparent py-5 md:py-8"
      )}
    >
      {((!isHome) || scrolledHome) && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      )}
      <div className="w-full px-5 sm:px-8 lg:px-10 2xl:px-16 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left: mobile menu trigger + primary navigation */}
        <div className="flex min-w-0 items-center justify-self-start">
          <button
            onClick={() => setIsMenuOpen(true)}
            className={cn(
              "lg:hidden -ms-2 p-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
              onDark ? "text-white/90 hover:text-white" : "text-stone-700 hover:text-stone-900"
            )}
            aria-label={t('header.menu_open')}
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 2xl:gap-10" aria-label="Primary">
            {leftNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "group relative font-label text-[10px] xl:text-[11px] uppercase tracking-[0.12em] xl:tracking-[0.15em] whitespace-nowrap transition-colors duration-300",
                  onDark ? "text-white/70 hover:text-white" : "text-stone-500 hover:text-stone-900"
                )}
              >
                {link.key ? t(link.key) : link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full",
                    onDark ? "bg-white/80" : "bg-stone-900"
                  )}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: logo, optically centered */}
        <div className="flex items-center justify-center">
          <motion.div
            onMouseMove={handleLogoMove}
            onMouseLeave={resetLogo}
            animate={{ x: logoPos.x, y: logoPos.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className="relative z-10 flex flex-col items-center"
          >
            <Link
              to="/"
              id="logo"
              className="flex flex-col items-center py-1"
              aria-label="Riman Fashion home"
            >
              <Logo
                variant="gold"
                className={cn("transition-all duration-700", onDark ? "w-12" : "w-10")}
                showText={false}
              />
              <span
                className={cn(
                  "mt-1.5 -me-[0.4em] font-heading text-[9px] uppercase tracking-[0.4em] whitespace-nowrap transition-colors duration-700",
                  onDark ? "text-white/60" : "text-stone-500"
                )}
              >
                Riman
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Right: contact + language + minimal line icons */}
        <div className="flex min-w-0 items-center justify-self-end gap-5 xl:gap-6">
          <nav className="hidden xl:flex items-center" aria-label="Atelier">
            {rightNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "group relative font-label text-[10px] xl:text-[11px] uppercase tracking-[0.12em] xl:tracking-[0.15em] whitespace-nowrap transition-colors duration-300",
                  onDark ? "text-white/70 hover:text-white" : "text-stone-500 hover:text-stone-900"
                )}
              >
                {link.key ? t(link.key) : link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full",
                    onDark ? "bg-white/80" : "bg-stone-900"
                  )}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={cn(
              "hidden sm:flex items-center gap-1.5 font-label text-[11px] uppercase tracking-[0.1em] transition-colors duration-300",
              onDark ? "text-white/70 hover:text-white" : "text-stone-500 hover:text-stone-900"
            )}
            aria-label={language === 'en' ? t('header.switch_to_ar') : t('header.switch_to_en')}
          >
            <Globe className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden xl:inline">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          <Link
            to="/search"
            className={cn("transition-colors duration-300", onDark ? "text-white/80 hover:text-white" : "text-stone-600 hover:text-stone-900")}
            aria-label={t('header.search')}
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </Link>

          <Link
            to="/wishlist"
            className={cn("hidden lg:block relative group/wishlist transition-colors duration-300", onDark ? "text-white/80 hover:text-white" : "text-stone-600 hover:text-stone-900")}
            aria-label={t('header.your_selection')}
          >
            <Heart className="w-5 h-5 transition-transform duration-300 group-hover/wishlist:scale-110" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-dark text-white text-[9px] font-medium min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full leading-none">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            className={cn("hidden md:block transition-colors duration-300", onDark ? "text-white/80 hover:text-white" : "text-stone-600 hover:text-stone-900")}
            aria-label={t('header.account')}
          >
            <User className="w-5 h-5" strokeWidth={1.5} />
          </Link>

          <Link
            to="/checkout"
            className={cn("relative group/cart transition-colors duration-300", onDark ? "text-white/80 hover:text-white" : "text-stone-600 hover:text-stone-900")}
            aria-label={t('header.bag')}
          >
            <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover/cart:scale-110" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-dark text-white text-[9px] font-medium min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full leading-none">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-stone-900/60 z-50 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              role="dialog"
              aria-modal="true"
              className={cn(
                "fixed top-0 h-full w-[75%] bg-stone-50 z-[60] flex flex-col border-r border-stone-200/50",
                isRtl ? "right-0" : "left-0"
              )}
            >
              {/* Close Button Header */}
              <div className="flex justify-between items-center p-4 border-b border-stone-200/50 bg-ivory">
                <Logo variant="gold" className="w-10" showText={false} />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-800 hover:bg-gold hover:text-white transition-all duration-300"
                  aria-label={t('header.menu_close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

               <div className="flex-1 overflow-y-auto px-5 py-6">
                {/* Utility row: language + search, always reachable on mobile */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex flex-1 border border-stone-200" role="group" aria-label="Language">
                    {(['en', 'ar'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        aria-pressed={language === lang}
                        className={cn(
                          "flex-1 min-h-[44px] font-label text-micro tracking-[0.2em] uppercase transition-colors",
                          language === lang ? "bg-stone-800 text-white" : "text-stone-600 hover:bg-stone-100"
                        )}
                      >
                        {lang === 'en' ? 'EN' : 'AR'}
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/search"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 min-h-[44px] px-4 border border-stone-200 font-label text-micro tracking-[0.2em] uppercase text-stone-700 hover:border-gold"
                    aria-label={t('header.search')}
                  >
                    <Search className="w-4 h-4" />
                  </Link>
                </div>
                {/* Primary Navigation */}
                <div className="mb-5">
                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.collections')}</p>
                  <nav className="flex flex-col gap-1">
                    {[
                      { label: 'Home', path: '/', key: 'nav.home' },
                      { label: 'About', path: '/about', key: 'nav.about' },
                      { label: 'Bridal', path: '/collection/bridal', key: 'nav.bridal' },
                      { label: 'Couture', path: '/collection/couture', key: 'nav.couture' },
                      { label: 'Collections', path: '/collections', key: 'nav.collections' },
                      { label: 'Journal', path: '/journal', key: 'nav.journal', icon: BookOpen },
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
                          <span className="flex items-center gap-2">
                            {link.icon && <link.icon className="w-3.5 h-3.5 text-gold" />}
                            {link.key ? t(link.key) : link.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Atelier Links */}
                <div className="mb-5">
                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.atelier')}</p>
                  <nav className="flex flex-col gap-1">
                    {[
                      { label: 'Gallery', path: '/gallery', key: 'nav.gallery' },
                      { label: 'Style Quiz', path: '/style-quiz', key: 'nav.style_quiz', icon: Sparkles },
                    ].map((link, idx) => (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.03 }}
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
                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Services */}
                <div className="mb-5">
                  <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-3">{t('header.services')}</p>
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
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.03 }}
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
                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-gold transition-colors" />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Dual CTA: booking (primary) + shop (secondary) */}
                <div className="flex flex-col gap-2">
                  <Link
                    to="/appointment"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full min-h-[52px] items-center justify-center btn-luxury text-center py-3 text-xs"
                  >
                    {t('cta.appointment')}
                  </Link>
                  <Link
                    to="/search"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full min-h-[52px] items-center justify-center text-center py-3 font-label text-xs tracking-[0.25em] uppercase border border-stone-800 text-stone-800 hover:border-gold hover:text-gold-dark transition-colors"
                  >
                    {t('cta.explore')}
                  </Link>
                </div>
              </div>

              <div className="p-4 mt-auto bg-ivory border-t border-stone-100">
                <span className="text-micro tracking-widest uppercase text-stone-600 block text-center">{t('header.tagline')}</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
