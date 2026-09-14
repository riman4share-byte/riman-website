import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageCircle, CalendarCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export default function HeroSection21st({ dressCode = 'RF-BR-2514' }: { dressCode?: string }) {
  const { t, isRtl } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const wa = buildWhatsAppUrl(
    `Hello Riman, I'm interested in ${dressCode}. I'm interested in: Rental. Event date: … Dress link: …`,
  );

  return (
    <section className="relative overflow-hidden bg-onyx text-ivory" aria-label="Riman hero">
      <div className="absolute inset-0 bg-gradient-to-b from-onyx via-onyx/80 to-onyx" aria-hidden="true" />
      <div className="relative container mx-auto px-6 py-24 md:py-36 grid gap-12 md:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-label text-xs tracking-[0.35em] uppercase text-gold mb-4">
            Riman Fashion — Bridal · Engagement · Evening
          </p>
          <h1 className="font-heading font-light leading-[1.02] text-[clamp(2.5rem,6vw,5rem)] mb-6">
            Sharjah Couture, <em className="font-editorial italic text-gold">Made to Measure</em>
          </h1>
          <p className="font-body text-white/70 max-w-md mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className={`flex flex-wrap gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 bg-gold text-onyx px-8 py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-gold-dark transition-colors focus-visible:ring-2 focus-visible:ring-ivory outline-none min-h-[44px]"
            >
              <CalendarCheck className="w-4 h-4" /> Book a Fitting
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-ivory/30 px-8 py-4 text-xs tracking-[0.25em] uppercase hover:border-gold hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold outline-none min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" /> Ask about {dressCode}
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[3/4] bg-white/5 border border-ivory/10 overflow-hidden"
        >
          {!imgError ? (
            <img
              src="/images/hero-default.jpg"
              alt="Riman bridal gown editorial"
              className="w-full h-full object-cover"
              loading="eager"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-stone-800" />
          )}
          <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between bg-onyx/70 backdrop-blur px-4 py-3 text-xs tracking-[0.2em] uppercase">
            <span>{dressCode} · Bridal</span>
            <span className="text-gold">Rental / Sale</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}