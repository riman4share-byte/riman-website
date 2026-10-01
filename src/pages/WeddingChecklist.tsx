import { Link } from 'react-router-dom';
import { CalendarCheck, MessageCircle, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { useLanguage } from '../contexts/LanguageContext';

export default function WeddingChecklist() {
  const { t } = useLanguage();
  const steps = [
    { month: t('wedding.checklist.m12'), task: t('wedding.checklist.t12') },
    { month: t('wedding.checklist.m11'), task: t('wedding.checklist.t11') },
    { month: t('wedding.checklist.m9'), task: t('wedding.checklist.t9') },
    { month: t('wedding.checklist.m6'), task: t('wedding.checklist.t6') },
    { month: t('wedding.checklist.m3'), task: t('wedding.checklist.t3') },
    { month: t('wedding.checklist.m1'), task: t('wedding.checklist.t1') },
  ];

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-20">
        <h2 className="heading-editorial text-gold-ink text-micro mb-4">{t('wedding.checklist.eyebrow')}</h2>
        <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider mb-6">{t('wedding.checklist.title')}</h1>
        <div className="divider-gold" />
      </div>

      <div className="space-y-12">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-8 group">
            <div className="text-end w-1/4 shrink-0">
              <span className="font-heading text-2xl text-gold-ink/40 group-hover:text-gold-ink transition-colors">{s.month}</span>
            </div>
            <div className="w-px bg-stone-100 relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold" />
            </div>
            <div className="pb-12 border-b border-stone-50 w-full">
              <p className="font-body text-stone-700 tracking-wide leading-relaxed italic">{s.task}</p>
            </div>
          </div>
        ))}
      </div>

      {/* R6 — a planning page with no path to the next step. This is the CTA. */}
      <div className="mt-16 border border-gold/30 bg-gold/[0.04] p-8 md:p-10 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-light text-stone-800 mb-4">
          {t('wedding.checklist.cta_heading')}
        </h2>
        <p className="font-body text-sm text-stone-600 leading-relaxed mb-7 max-w-xl mx-auto">
          {t('wedding.checklist.cta_body')}
        </p>
        <ul className="max-w-xl mx-auto grid sm:grid-cols-2 gap-3 text-start mb-8">
          {[t('contact.promise_deposit'), t('contact.promise_consultation'), t('contact.promise_reschedule'), t('contact.promise_fit_included')].map((promise) => (
            <li key={promise} className="flex items-start gap-2 font-body text-sm text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-gold-ink shrink-0 mt-0.5" />
              <span>{promise}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/appointment" className="btn-luxury w-full sm:w-auto inline-flex items-center justify-center gap-2">
            <CalendarCheck className="w-4 h-4" /> {t('wedding.checklist.cta_primary')}
          </Link>
          <a
            href={buildWhatsAppUrl(t('contact.wa_default_message'))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury-outline w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> {t('wedding.checklist.cta_secondary')}
          </a>
        </div>
      </div>
    </div>
  );
}
