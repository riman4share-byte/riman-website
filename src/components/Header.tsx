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
  const headerSolid = !isHome || isScrolled;

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
        "top-0 left-0 w-full z-[100] transition-all duration-700 ease-[0.16,1,0.3,1]",
        isHome ? "fixed" : "absolute",
        !isHome
          ? "bg-ivory/98 backdrop-blur-md py-3 border-b border-stone-200"
          : isScrolled
            ? "bg-onyx/90 backdrop-blur-md py-3 border-b border-white/10 shadow-2xl"
            : "bg-transparent py-5 md:py-8"
      )}
    >
      {(headerSolid || isScrolled) && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      )}
      <div className="container mx-auto px-6 relative grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left Layer: Menu / Primary Nav / Language / Search */}
        <div className="flex min-w-0 items-center justify-self-start gap-4">
          <div className="xl:hidden">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ms-2 hover:bg-stone-100 transition-colors focus-visible:ring-2 focus-visible:ring-gold outline-none"
              aria-label={t('header.menu_open')}
            >
              <Menu className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
            </button>
          </div>
          
          {/* Desktop Nav On Left */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5" aria-label="Collections">
            {leftNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-label text-xs uppercase whitespace-nowrap tracking-[0.18em] 2xl:tracking-[0.25em] transition-all duration-300",
                  (!isHome) 
                    ? "text-stone-600 hover:text-gold-dark" 
                    : "text-white/80 hover:text-gold border-b border-transparent hover:border-gold/40"
                )}
              >
                {link.key ? t(link.key) : link.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={cn(
              "hidden xl:flex items-center gap-1.5 font-body text-xs tracking-widest uppercase transition-colors ml-2",
              (!isHome) ? "text-stone-800 hover:text-gold-dark" : "text-white hover:text-gold"
            )}
            aria-label={language === 'en' ? t('header.switch_to_ar') : t('header.switch_to_en')}
          >
            <Globe className="w-5 h-5" aria-hidden="true" />
            <span className="hidden lg:inline">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Search Icon */}
          <Link
            to="/search"
            className={cn("hidden xl:block hover:text-gold transition-colors", (!isHome) ? "text-stone-800" : "text-white")}
            aria-label={t('header.search')}
          >
            <Search className="w-6 h-6" />
          </Link>
        </div>

        {/* Center Layer: Logo with Magnetic Effect (grid-centered, never collides) */}
        <div className="relative flex items-center justify-self-center px-2 2xl:px-10">
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
              className="flex flex-col items-center group py-2"
            >
              <Logo 
                variant="gold" 
                className={cn("transition-all duration-700", !isHome ? "w-10" : "w-14")}
                showText={false}
              />
              <span className={cn(
                "text-xs uppercase whitespace-nowrap tracking-[0.5em] mt-2 transition-all duration-700 font-heading font-bold",
                (!isHome) 
                  ? "text-stone-600 opacity-100" 
                  : "text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
              )}>
                {isHome ? 'Atelier' : 'Riman'}
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Right Layer: Secondary Nav + Actions */}
        <div className="flex min-w-0 items-center justify-self-end gap-4 md:gap-6">
          <nav className="hidden xl:flex items-center gap-3 mr-3 border-r border-stone-200 pr-3" aria-label="Atelier">
            {rightNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-label text-xs uppercase whitespace-nowrap tracking-[0.25em] transition-all duration-300",
                  (!isHome) 
                    ? "text-stone-600 hover:text-gold-dark" 
                    : "text-white/80 hover:text-gold border-b border-transparent hover:border-gold/40"
                )}
              >
                {link.key ? t(link.key) : link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/style-quiz" className="hover:text-gold transition-colors" aria-label={t('header.style_quiz')}>
              <Sparkles className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
            </Link>
            <Link to="/wishlist" className="hidden lg:block relative group/wishlist hover:text-gold transition-colors" aria-label={t('header.your_selection')}>
              <Heart className={cn("w-6 h-6 transition-transform group-hover/wishlist:scale-110", (!isHome) ? "text-stone-800" : "text-white")} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-dark text-white text-[11px] font-bold min-w-4 h-4 px-0.5 flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="hidden md:block hover:text-gold transition-colors" aria-label={t('header.account')}>
              <User className={cn("w-6 h-6", (!isHome) ? "text-stone-800" : "text-white")} />
            </Link>
            <Link to="/checkout" className="hidden md:block relative group/cart" aria-label={t('header.bag')}>
              <ShoppingBag className={cn("w-6 h-6 transition-transform group-hover/cart:scale-110", (!isHome) ? "text-stone-800" : "text-white")} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-dark text-white text-[11px] font-bold min-w-4 h-4 px-0.5 flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </Link>
            {/* Book Appointment CTA - highly visible */}
            <Link
              to="/appointment"
              className={cn(
                "hidden xl:inline-flex items-center justify-center gap-2 px-6 py-3 font-label text-xs tracking-[0.2em] uppercase transition-all duration-300 min-h-[48px]",
                (!isHome)
                  ? "bg-stone-800 text-white hover:bg-gold hover:text-stone-900 border border-stone-800"
                  : "bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-gold hover:text-stone-900"
              )}
              aria-label={t('nav.appointment')}
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>{t('nav.appointment')}</span>
            </Link>
          </div>
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
