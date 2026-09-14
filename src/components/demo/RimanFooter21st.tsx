import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

/**
 * 21st-inspired simplified footer, Riman-adapted:
 * single Business Profile source, no newsletter (OFF per audit),
 * WhatsApp + Instagram first, RTL-safe text-start.
 */
export default function RimanFooter21st() {
  const { settings } = useSettings();

  return (
    <footer className="bg-onyx text-ivory pt-16 pb-10" aria-label="Riman footer">
      <div className="container mx-auto px-6 grid gap-12 md:grid-cols-3 text-start">
        <div>
          <p className="font-heading text-2xl tracking-[0.2em] mb-2">RIMAN</p>
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-6">Bridal · Engagement · Evening — Sharjah</p>
          <p className="text-sm text-white/60 flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-gold" />
            {settings.contact.address} · {settings.contact.hours}
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm" aria-label="Collections">
          {[
            ['Bridal', '/collection/bridal'],
            ['Evening', '/collection/evening'],
            ['Rental', '/collection/rental'],
            ['Alterations', '/alterations'],
            ['Gallery', '/gallery'],
            ['Book a Fitting', '/appointment'],
          ].map(([label, to]) => (
            <Link key={to + label} to={to} className="text-white/70 hover:text-gold min-h-[44px] inline-flex items-center">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-4">
          <a
            href={`https://wa.me/${settings.social.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 text-xs tracking-[0.25em] uppercase font-bold min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Riman
          </a>
          <a
            href="https://instagram.com/rimanfashion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-ivory/20 px-6 py-4 text-xs tracking-[0.25em] uppercase hover:border-gold hover:text-gold min-h-[44px]"
          >
            <Instagram className="w-4 h-4" /> Instagram
          </a>
          <p className="text-xs text-white/40">{settings.contact.email} · {settings.contact.phone}</p>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/40">
        <span>© 2026 Riman Fashion · Sharjah, UAE</span>
        <span className="flex gap-6">
          <Link to="/privacy" className="hover:text-gold">Privacy</Link>
          <Link to="/terms" className="hover:text-gold">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
