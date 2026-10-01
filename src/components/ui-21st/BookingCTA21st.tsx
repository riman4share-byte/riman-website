import { Link } from 'react-router-dom';
import { CalendarCheck, MessageCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export default function BookingCTA21st() {
  const { t, isRtl } = useLanguage();
  const dressCode = 'RF-BR-2514';
  const wa = buildWhatsAppUrl(
    `Hello Riman, I'm interested in ${dressCode}. I'm interested in: Rental. Event date: … Dress link: …`,
  );

  return (
    <section className="bg-onyx py-20" aria-label="Booking">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-3xl md:text-5xl font-light text-ivory mb-6">
            {t('cta.band_heading')}
          </h2>
          <p className="font-body text-stone-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('cta.band_body')}
          </p>

          <ul className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-3 text-start mb-10">
            {[t('contact.promise_deposit'), t('contact.promise_consultation'), t('contact.promise_reschedule'), t('contact.promise_fit_included')].map((promise) => (
              <li key={promise} className="flex items-start gap-2 font-body text-sm text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" />
                <span>{promise}</span>
              </li>
            ))}
          </ul>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Link
              to="/appointment"
              className="w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center px-12 bg-terracotta text-onyx font-label text-xs tracking-[0.25em] uppercase font-bold hover:bg-terracotta-dark transition-colors focus-visible:ring-2 focus-visible:ring-ivory outline-none"
            >
              <CalendarCheck className="w-4 h-4 mr-2" /> {t('cta.book_fitting')}
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center px-10 font-label text-xs tracking-[0.25em] uppercase text-ivory border border-ivory/30 hover:border-terracotta hover:text-terracotta-dark transition-colors focus-visible:ring-2 focus-visible:ring-gold outline-none"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> {t('cta.ask_about')} {dressCode}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}