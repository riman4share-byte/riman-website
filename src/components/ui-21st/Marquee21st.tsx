import { useLanguage } from '../../contexts/LanguageContext';

export default function Marquee21st() {
  const { language } = useLanguage();
  const itemsEn = ['Bridal', 'Evening', 'Rental', 'Alterations', 'Private Viewings'];
  const itemsAr = ['فستان زفاف', 'سهرة', 'إيجار', 'تفصيل', 'معاينة خاصة'];
  const items = language === 'ar' ? itemsAr : itemsEn;

  return (
    <section className="bg-onyx py-7 overflow-hidden border-y border-white/5" aria-hidden="true">
      {/* dir is fixed per language so the track always moves with reading direction */}
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="marquee-track flex gap-14 whitespace-nowrap w-max">
          {[...items, ...items, ...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-14">
              <span className="font-label text-[11px] tracking-[0.35em] uppercase text-bone/50">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rotate-45 bg-terracotta/60" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
