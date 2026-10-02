import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, ShoppingBag, Menu, X, Globe, Search, Sparkles, ChevronRight, Calendar, Scissors, HelpCircle, Phone, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useScrollLock } from '../hooks/useScrollLock';
import Logo from './Logo';

interface NavItem {
  path: string;
  key: string;
  icon?: typeof BookOpen;
}

/**
 * One nav definition, used by both the desktop bar and the mobile drawer.
 * These were three separate inline arrays, so a new destination had to be
 * added in three places and routinely drifted between them.
 */
const PRIMARY_LINKS: NavItem[] = [
  { path: '/collection/bridal', key: 'nav.bridal' },
  { path: '/collection/couture', key: 'nav.couture' },
  { path: '/collections', key: 'nav.collections' },
  { path: '/about', key: 'nav.about' },
];

const DRAWER_GROUPS: { titleKey: string; links: NavItem[] }[] = [
  {
    titleKey: 'header.collections',
    links: [
      { path: '/', key: 'nav.home' },
      { path: '/collection/bridal', key: 'nav.bridal' },
      { path: '/collection/couture', key: 'nav.couture' },
      { path: '/collections', key: 'nav.collections' },
      { path: '/journal', key: 'nav.journal', icon: BookOpen },
    ],
  },
  {
    titleKey: 'header.atelier',
    links: [
      { path: '/gallery', key: 'nav.gallery' },
      { path: '/style-quiz', key: 'nav.style_quiz', icon: Sparkles },
    ],
  },
  {
    titleKey: 'header.services',
    links: [
      { path: '/appointment', key: 'nav.appointment', icon: Calendar },
      { path: '/alterations', key: 'nav.alterations', icon: Scissors },
      { path: '/faq', key: 'nav.faq', icon: HelpCircle },
      { path: '/contact', key: 'nav.contact', icon: Phone },
    ],
  },
];

const HEADER_H = 'h-20 md:h-24';

/**
 * Colour is resolved once into a tone object instead of an inline ternary
 * repeated on every element. Previously each of ~10 nodes re-tested
 * `overDark / isHome / else`, which is how the three states drifted apart and
 * left, for example, one icon on the wrong background after a tweak.
 */
interface Tone {
  bar: string;
  link: string;
  rule: string;
  icon: string;
  mark: string;
  wordmark: string;
}

const TONE_OVER_DARK: Tone = {
  bar: 'bg-gradient-to-b from-black/55 via-black/20 to-transparent border-b border-transparent',
  link: 'text-white/75 hover:text-white',
  rule: 'bg-bone/80',
  icon: 'text-white/85 hover:text-white',
  mark: 'brightness-0 invert',
  wordmark: 'text-white/70',
};

const TONE_ONYX: Tone = {
  bar: 'bg-onyx/95 border-b border-white/10',
  link: 'text-bone/70 hover:text-bone',
  rule: 'bg-bone/80',
  icon: 'text-bone/80 hover:text-bone',
  mark: 'brightness-0 invert opacity-90',
  wordmark: 'text-bone/60',
};

const TONE_IVORY: Tone = {
  bar: 'bg-ivory/95 backdrop-blur-sm border-b border-stone-200/70',
  link: 'text-stone-500 hover:text-stone-900',
  rule: 'bg-stone-900',
  icon: 'text-stone-600 hover:text-stone-900',
  mark: '',
  wordmark: 'text-stone-500',
};

/** Shared geometry so every bar child aligns to the same optical baseline. */
const ICON_BTN =
  'min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-300';
const ICON = 'w-5 h-5 shrink-0';

export default function Header() {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === '/';
  // Transparent only at the very top of the home page, where the hero is dark.
  // Everywhere else — including home once scrolled — the bar is solid, so it
  // never has to guess whether what is behind it is light or dark.
  const overDark = isHome && !isScrolled;
  const tone: Tone = overDark ? TONE_OVER_DARK : isHome ? TONE_ONYX : TONE_IVORY;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useScrollLock(isMenuOpen);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // The drawer is a modal dialog, so Escape must close it and focus must not
  // be able to wander into the page behind it.
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;

      const focusables = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isMenuOpen]);

  const actions: { to: string; label: string; badge?: number; children: ReactNode }[] = [
    { to: '/search', label: t('header.search'), children: <Search className={ICON} strokeWidth={1.5} /> },
    {
      to: '/wishlist',
      label: t('header.your_selection'),
      badge: wishlistCount,
      children: <Heart className={ICON} strokeWidth={1.5} />,
    },
    { to: '/profile', label: t('header.account'), children: <User className={ICON} strokeWidth={1.5} /> },
    {
      to: '/checkout',
      label: t('header.bag'),
      badge: totalItems,
      children: <ShoppingBag className={ICON} strokeWidth={1.5} />,
    },
  ];

  return (
    <header
      id="header"
      dir={isRtl ? 'rtl' : 'ltr'}
      className={cn(
        'fixed top-0 inset-x-0 z-[100] transition-colors duration-500',
        tone.bar,
      )}
    >
      {!overDark && (
        <div
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent"
          aria-hidden="true"
        />
      )}

      {/*
        Three equal columns: nav, logo, actions. A 1fr/auto/1fr grid keeps the
        logo optically centred and pulls both clusters inward to a consistent
        inner edge, instead of letting them float against the viewport border.
        Under dir="rtl" the columns mirror automatically.
      */}
      <div
        className={cn(
          'relative w-full grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6 px-6 sm:px-10 lg:px-14',
          HEADER_H,
        )}
      >
        {/* ── Start: primary nav (desktop) ── */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9 justify-self-start" aria-label="Primary">
          {PRIMARY_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative whitespace-nowrap font-label text-[11px] uppercase tracking-[0.18em]',
                  'transition-colors duration-300 min-h-[44px] flex items-center',
                  tone.link,
                )}
              >
                {t(link.key)}
                <span
                  className={cn(
                    'absolute bottom-2 start-0 h-px transition-all duration-300',
                    active ? 'w-full' : 'w-0 group-hover:w-full',
                    tone.rule,
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* ── Start: menu trigger (below lg) ── */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={cn(
            'lg:hidden justify-self-start -ms-2 p-2 flex items-center justify-center transition-colors',
            tone.icon,
          )}
          aria-label={t('header.menu_open')}
          aria-expanded={isMenuOpen}
        >
          <Menu className={ICON} strokeWidth={1.5} />
        </button>

        {/* ── Centre: mark + wordmark ── */}
        <Link
          to="/"
          id="logo"
          className="justify-self-center flex flex-col items-center gap-1.5"
          aria-label="Riman Fashion home"
        >
          {/*
            The monogram is cropped from riman-logo.png. Rendering that file
            directly showed its baked-in "RIMAN FASHION" wordmark *and* a
            separate "RIMAN" caption underneath, so the bar carried two
            wordmarks stacked. The mark alone plus real text gives one lockup,
            and the text then follows the bar's colour instead of being fixed
            gold baked into a bitmap.
          */}
          <img
            src="/riman-mark.png"
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            className={cn('w-9 md:w-10 h-9 md:h-10 object-contain transition-colors duration-500', tone.mark)}
          />
          <span
            className={cn(
              'font-heading text-[11px] uppercase leading-none',
              // Optical centring: wide tracking adds a trailing gap on the last
              // letter, so nudge back by half of it.
              'tracking-[0.42em] translate-x-[0.21em] whitespace-nowrap transition-colors duration-500',
              tone.wordmark,
            )}
          >
            Riman
          </span>
        </Link>

        {/* ── End: language + actions ── */}
        {/*
          Everything here is hidden below md on purpose: MobileBottomNav takes
          over at that breakpoint and already carries search, wishlist, bag and
          account. Showing them in both places meant two search entries and two
          bag badges on every phone. The breakpoint is deliberately `md`, not
          `lg`, because the bottom nav disappears at md — anything hidden in the
          header past md would otherwise be unreachable on a tablet.
        */}
        <div className="hidden md:flex items-center justify-self-end gap-1 md:gap-2 lg:gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={cn(
              'flex items-center gap-1.5 font-label text-[11px] uppercase tracking-[0.1em]',
              'transition-colors duration-300 min-h-[44px] px-2',
              tone.link,
            )}
            aria-label={language === 'en' ? t('header.switch_to_ar') : t('header.switch_to_en')}
          >
            <Globe className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden xl:inline">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          <span className="w-px h-4 bg-current opacity-20 mx-1" aria-hidden="true" />

          {actions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={cn(ICON_BTN, 'relative', tone.icon)}
              aria-label={action.label}
            >
              {action.children}
              {!!action.badge && action.badge > 0 && (
                <span
                  className="absolute top-1 end-0 bg-terracotta text-white text-[10px] font-bold min-w-[16px] h-[16px] px-1 flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  {action.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* ─────────────────── Mobile drawer ─────────────────── */}
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
              ref={drawerRef}
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              role="dialog"
              aria-modal="true"
              aria-label={t('header.menu_open')}
              className={cn(
                'fixed top-0 h-full w-[85%] max-w-sm bg-stone-50 z-[60] flex flex-col border-e border-stone-200/50',
                isRtl ? 'right-0' : 'left-0',
              )}
            >
              <div className="flex justify-between items-center p-4 border-b border-stone-200/50 bg-ivory">
                <Logo variant="gold" className="w-10" showText={false} />
                <button
                  ref={closeButtonRef}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-800 hover:bg-terracotta hover:text-white transition-all duration-300"
                  aria-label={t('header.menu_close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-terracotta/30 to-transparent" />

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className="flex flex-1 border border-stone-200"
                    role="group"
                    aria-label="Language"
                  >
                    {(['en', 'ar'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        aria-pressed={language === lang}
                        className={cn(
                          'flex-1 min-h-[44px] font-label text-[11px] tracking-[0.2em] uppercase transition-colors',
                          language === lang
                            ? 'bg-stone-800 text-white'
                            : 'text-stone-600 hover:bg-stone-100',
                        )}
                      >
                        {lang === 'en' ? 'EN' : 'عربي'}
                      </button>
                    ))}
                  </div>
                </div>

                {DRAWER_GROUPS.map((group) => (
                  <div key={group.titleKey} className="mb-5">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta-dark font-bold mb-3">
                      {t(group.titleKey)}
                    </p>
                    <nav className="flex flex-col gap-1">
                      {group.links.map((link, idx) => (
                        <motion.div
                          key={link.path}
                          initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + idx * 0.03 }}
                        >
                          <Link
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="group flex items-center justify-between font-heading text-xs tracking-wide text-stone-800 py-2.5 px-3 border border-stone-100 hover:border-terracotta hover:bg-terracotta/5 transition-all"
                          >
                            <span className="flex items-center gap-2">
                              {link.icon && <link.icon className="w-3.5 h-3.5 text-terracotta-dark" />}
                              {t(link.key)}
                            </span>
                            <ChevronRight
                              className="w-3.5 h-3.5 text-stone-500 group-hover:text-terracotta-dark transition-colors rtl:rotate-180"
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  </div>
                ))}

                <div className="flex flex-col gap-2 mt-8">
                  <Link
                    to="/appointment"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full min-h-[52px] items-center justify-center btn-luxury text-center py-3 text-xs"
                  >
                    {t('cta.appointment')}
                  </Link>
                  <Link
                    to="/collection/bridal"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full min-h-[52px] items-center justify-center text-center py-3 font-label text-xs tracking-[0.25em] uppercase border border-stone-800 text-stone-800 hover:border-terracotta hover:text-terracotta-dark transition-colors"
                  >
                    {t('cta.explore')}
                  </Link>
                </div>
              </div>

              <div className="p-4 mt-auto bg-ivory border-t border-stone-100">
                <span className="text-[11px] tracking-widest uppercase text-stone-600 block text-center">
                  {t('header.tagline')}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}