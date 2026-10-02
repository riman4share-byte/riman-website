import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollLock } from '../hooks/useScrollLock';
import { useFeature } from '../hooks/useFeature';
import { useLanguage } from '../contexts/LanguageContext';
import { hasCookieDecision, setCookieConsent } from '../lib/consent';

export default function GlobalFeatures() {
  const { t } = useLanguage();
  const whatsappEnabled = useFeature('whatsappBtn');
  const newsletterEnabled = useFeature('newsletter');
  const cookieEnabled = useFeature('cookieBanner');

  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  useScrollLock(showNewsletter);

  useEffect(() => {
    if (!showNewsletter) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleDismissNewsletter(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showNewsletter]);

  useEffect(() => {
    if (!newsletterEnabled) return;
    const newsletterTimer = setTimeout(() => {
      const dismissed = localStorage.getItem('riman_newsletter_dismissed');
      if (!dismissed) setShowNewsletter(true);
    }, 8000);
    return () => clearTimeout(newsletterTimer);
  }, [newsletterEnabled]);

  useEffect(() => {
    if (!cookieEnabled) return;
    if (!hasCookieDecision()) setShowCookies(true);
  }, [cookieEnabled]);

  const handleDismissNewsletter = () => {
    localStorage.setItem('riman_newsletter_dismissed', 'true');
    setShowNewsletter(false);
  };

  const handleAcceptCookies = () => {
    setCookieConsent('accepted');
    setShowCookies(false);
  };

  const handleRejectCookies = () => {
    setCookieConsent('rejected');
    setShowCookies(false);
  };

  return (
    <>
      {/* WhatsApp — ink + gold restyle */}
      {whatsappEnabled && (
        <a
          href="https://wa.me/971553730792"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed end-4 md:end-8 bottom-20 md:bottom-6 z-[100] w-12 h-12 md:w-13 md:h-13 bg-onyx text-ivory border border-terracotta/30 flex items-center justify-center hover:border-terracotta hover:scale-[1.04] transition-all"
          aria-label={t('common.whatsapp_label')}
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        </a>
      )}

      {/* Newsletter Popup */}
      <AnimatePresence>
        {showNewsletter && (
          <motion.div 
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
                className="absolute top-4 right-4 text-stone-600 hover:text-stone-800 transition-colors"
                aria-label={t('common.close')}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center mx-auto mb-6 text-terracotta-dark">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-3xl text-stone-800 mb-4 tracking-wider uppercase">{t('newsletter.title')}</h3>
                <p className="text-stone-600 text-sm mb-8 leading-relaxed italic">{t('newsletter.body')}</p>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleDismissNewsletter(); }}>
                  <input 
                    type="email" 
                    placeholder={t('newsletter.email_placeholder')} 
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-200 text-xs tracking-widest uppercase outline-none focus:border-terracotta"
                    aria-label={t('newsletter.email_aria')}
                  />
                  <button className="w-full btn-luxury">{t('newsletter.cta')}</button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie notice — small bottom-corner card, never covering content */}
      <AnimatePresence>
        {showCookies && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="fixed bottom-4 end-4 z-[150] max-w-sm bg-ivory border border-stone-200 p-5 shadow-lg"
            role="dialog"
            aria-label={t('cookies.heading')}
          >
            <p className="text-micro tracking-widest uppercase text-stone-600 mb-1">{t('cookies.heading')}</p>
            <p className="text-xs text-stone-700 leading-relaxed mb-4">{t('cookies.body')} <Link to="/privacy" className="underline hover:text-terracotta-dark">{t('cookies.learn')}</Link>.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleRejectCookies}
                className="px-5 py-2 border border-stone-300 text-stone-700 text-micro tracking-[0.2em] uppercase hover:border-stone-500 transition-colors font-bold"
              >
                {t('cookies.reject')}
              </button>
              <button
                onClick={handleAcceptCookies}
                className="px-5 py-2 bg-onyx text-white text-micro tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors font-bold"
              >
                {t('cookies.accept')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
