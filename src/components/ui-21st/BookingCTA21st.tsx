import { Link } from 'react-router-dom';
import { CalendarCheck, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export default function BookingCTA21st() {
  const { isRtl } = useLanguage();
  const dressCode = 'RF-BR-2514';
  const wa = buildWhatsAppUrl(
    `Hello Riman, I'm interested in ${dressCode}. I'm interested in: Rental. Event date: … Dress link: …`,
  );

  return (
    <section className="bg-onyx py-20" aria-label="Booking">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-light text-ivory mb-12">
          Ready to begin?
        </h2>
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Link
            to="/appointment"
            className="w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center px-12 bg-gold text-onyx font-label text-xs tracking-[0.25em] uppercase font-bold hover:bg-gold-dark transition-colors focus-visible:ring-2 focus-visible:ring-ivory outline-none"
          >
            <CalendarCheck className="w-4 h-4 mr-2" /> Book a Fitting
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center px-10 font-label text-xs tracking-[0.25em] uppercase text-ivory border border-ivory/30 hover:border-gold hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold outline-none"
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Ask about {dressCode}
          </a>
        </div>
      </div>
    </section>
  );
}