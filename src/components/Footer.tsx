import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, ChevronUp, ArrowRight, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';
import { cn } from '../lib/utils';

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = React.useId();

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full flex items-center justify-between py-4 md:py-0 md:cursor-default"
      >
        <h4 className="font-label text-xs tracking-[0.3em] uppercase text-terracotta-dark font-bold text-center md:text-left flex-1">{title}</h4>
        <ChevronDown className={cn(
          "w-4 h-4 text-stone-500 transition-transform md:hidden",
          isOpen && "rotate-180"
        )} />
      </button>
      {/*
        The old AnimatePresence gate was `isOpen || typeof window !== 'undefined'`,
        which is always true on the client, so the panel never unmounted and the
        exit animation never ran — the mobile accordion snapped open/closed.
        grid-template-rows 0fr→1fr animates to the content's real height (no
        max-height magic number), while md: pins it open on desktop. The content
        stays in the DOM either way, so it remains crawlable.
      */}
      <div
        id={contentId}
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          "md:grid-rows-[1fr] md:opacity-100",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">{children}</div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  // Contact details are admin-editable in site_settings; rendering the
  // translation string here meant the footer's phone silently disagreed with
  // the contact page and the admin panel.
  const { settings } = useSettings();

  // Plain state, not react-hook-form + zod. This is a single email field in the
  // footer, so it sits in the entry bundle on every page; RHF + zodResolver +
  // zod cost ~75 kB minified for one regex check. ContactPage and Checkout still
  // use RHF, but they are lazy routes, so the dependency now loads only there.
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // The newsletter previously wrote to localStorage and reported success. That
  // is silent data loss: the visitor saw "subscribed" and the address existed
  // only in their own browser, so the atelier never received a single email.
  // There is no newsletter table and no mailing-list provider wired up, so
  // rather than pretend, the form hands the address to WhatsApp — the same
  // channel the rest of the site uses — and says so.
  const onNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    // Pragmatic address check — enough to catch typos, not an RFC 5322 parser.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError(t('footer.valid_email'));
      setSubmitted(false);
      return;
    }
    setEmailError(null);
    const number = (settings.social.whatsapp || '971553730792').replace(/[^\d]/g, '');
    const message = encodeURIComponent(
      `Please add ${value} to the Riman Fashion mailing list.`,
    );
    window.open(`https://wa.me/${number}?text=${message}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-onyx text-ivory pt-16 md:pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Shimmer */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Newsletter - Full Width */}
        <div className="border-b border-white/5 pb-12 mb-8 text-center md:text-left">
          <div className="max-w-xl mx-auto md:mx-0">
            <h4 className="font-heading text-xl md:text-2xl tracking-widest uppercase mb-3 text-white">{t('footer.newsletter_title')}</h4>
            <div className="w-10 h-px bg-terracotta mb-4 mx-auto md:mx-0" />
            <p className="font-body text-stone-500 text-xs md:text-sm tracking-wider mb-6 leading-relaxed uppercase">
              {t('footer.newsletter_text')}
            </p>
            <form onSubmit={onNewsletterSubmit} className="relative group" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                {t('footer.newsletter_placeholder')}
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                aria-required="true"
                aria-invalid={emailError ? true : undefined}
                placeholder={t('footer.newsletter_placeholder')}
                className="w-full bg-transparent border-b border-stone-800 focus:border-terracotta py-3 md:py-4 pr-12 text-sm font-body tracking-[0.15em] outline-none transition placeholder:text-stone-400"
              />
              <button type="submit" aria-label={t('footer.newsletter_submit')} className="absolute right-0 bottom-3 md:bottom-4 text-terracotta-dark hover:translate-x-1 transition-transform">
                {submitted ? <span className="text-micro tracking-widest">{t('footer.submitted')}</span> : <ArrowRight className="w-5 h-5" aria-hidden="true" />}
              </button>
              {emailError && <p role="alert" className="absolute top-full mt-2 text-red-600 text-micro uppercase tracking-widest">{emailError}</p>}
            </form>
          </div>
        </div>

        {/* Mobile: Collapsible Sections / Desktop: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-12 mb-12 text-center md:text-left">
          {/* Brand - Always visible */}
          <div className="md:col-span-4 pb-8 md:pb-0 border-b border-white/5 md:border-0">
            <Link to="/" className="block mb-6 md:mb-10">
              <Logo variant="gold" className="w-24 md:w-36 mx-auto md:mx-0 md:ml-2" showText={false} />
            </Link>
            <p className="font-body text-xs md:text-sm text-stone-400 max-w-sm mb-6 md:mb-10 leading-relaxed italic mx-auto md:mx-0">
              {t('footer.about')}
            </p>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <SocialLink href="https://instagram.com/rimanfashion" icon={<Instagram />} label="Instagram" />
              <SocialLink href="https://facebook.com/rimanfashion" icon={<Facebook />} label="Facebook" />
              <SocialLink href={`mailto:${settings.contact.email || 'info@riman.ae'}`} icon={<Mail />} label="Email" />
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-2">
            <CollapsibleSection title={t('footer.collections')} defaultOpen={false}>
              <ul className="space-y-3 pb-6 md:pb-0 md:mt-6 flex flex-col items-center md:items-start">
                <FooterLink to="/collection/bridal">{t('nav.bridal')}</FooterLink>
                <FooterLink to="/collection/evening">{t('nav.evening')}</FooterLink>
                <FooterLink to="/collection/rental">{t('nav.rentals')}</FooterLink>
                <FooterLink to="/gallery">{t('nav.gallery')}</FooterLink>
              </ul>
            </CollapsibleSection>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <CollapsibleSection title={t('footer.services')} defaultOpen={false}>
              <ul className="space-y-3 pb-6 md:pb-0 md:mt-6 flex flex-col items-center md:items-start">
                <FooterLink to="/alterations">{t('footer.bespoke_fitting')}</FooterLink>
                <FooterLink to="/style-quiz">{t('footer.aura_consultation')}</FooterLink>
                <FooterLink to="/wedding-checklist">{t('footer.bridal_concierge')}</FooterLink>
                <FooterLink to="/faq">{t('footer.assistance')}</FooterLink>
              </ul>
            </CollapsibleSection>
          </div>

          {/* Location */}
          <div className="md:col-span-4">
            <CollapsibleSection title={t('footer.atelier_location')} defaultOpen={false}>
              <div className="space-y-4 pb-6 md:pb-0 md:mt-6 flex flex-col items-center md:items-start">
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" />
                  <p className="font-body text-xs md:text-sm text-stone-400 leading-relaxed uppercase tracking-[0.05em]">
                    {t('footer.location')}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-4 h-4 text-terracotta-dark shrink-0" />
                  <p className="font-body text-xs md:text-sm text-stone-400 uppercase tracking-[0.05em]">
                    {settings.contact.phone || '+971 55 373 0792'}
                  </p>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>

        {/* Giant couture wordmark */}
        <div className="select-none pointer-events-none text-center overflow-hidden mb-8" aria-hidden="true">
          <p className="font-heading font-light text-[clamp(3.5rem,16vw,16rem)] leading-[0.8] tracking-[-0.02em] text-terracotta-dark/10 whitespace-nowrap">
            RIMAN<sup className="text-[1.6vw] align-super">®</sup>
          </p>
        </div>

        {/* Scroll to Top */}
        <div className="flex justify-center mb-8">
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/40 hover:text-terracotta-dark transition-colors font-bold"
          >
            <ChevronUp className="w-4 h-4" /> {t('footer.ascend')}
          </button>
        </div>

        {/* Trust blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/5 mb-8">
          <div className="text-center">
            <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-light">Since 2011</p>
            <p className="text-xs text-stone-500 mt-1">Sharjah atelier</p>
          </div>
          <div className="text-center">
            <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-light">Bespoke Tailoring</p>
            <p className="text-xs text-stone-500 mt-1">Made to measure</p>
          </div>
          <div className="text-center">
            <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-light">Free Fittings</p>
            <p className="text-xs text-stone-500 mt-1">& alterations</p>
          </div>
          <div className="text-center">
            <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-light">Salon Hours</p>
            <p className="text-xs text-stone-500 mt-1">{settings.contact.hours || '11am – 8:30pm'}</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-micro text-stone-600 uppercase tracking-[0.2em] text-center md:text-left">
            © {new Date().getFullYear()} RIMAN FASHION. {t('footer.rights')}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="font-body text-micro text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="font-body text-micro text-stone-600 hover:text-white uppercase tracking-[0.2em] transition-colors">{t('footer.legal')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="relative inline-flex items-center font-body text-xs md:text-sm text-stone-500 hover:text-terracotta-dark tracking-[0.1em] uppercase transition-colors duration-300 group">
        <span
          aria-hidden="true"
          className="absolute bottom-0 start-0 h-px w-full origin-left rtl:origin-right scale-x-0 bg-terracotta transition-transform duration-300 group-hover:scale-x-100"
        />
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactElement<{ className?: string }>; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-stone-800 flex items-center justify-center text-stone-400 hover:bg-terracotta hover:border-terracotta hover:text-white transition duration-500"
      aria-label={label}
    >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
    </a>
  );
}
