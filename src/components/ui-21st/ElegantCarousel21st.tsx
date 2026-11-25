import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import ScrollReveal from '../ScrollReveal';

export default function ElegantCarousel21st() {
  const { products } = useData();
  const { isRtl, t } = useLanguage();
  const items = products.slice(0, 6);

  return (
    <section className="bg-ivory py-20" aria-label="Riman lookbook">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-label text-xs tracking-[0.35em] uppercase text-terracotta-dark mb-2">{t('lookbook.real_riman')}</p>
            <h2 className="font-heading text-3xl md:text-5xl text-stone-800">{t('lookbook.title')}</h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-stone-600 hover:text-terracotta-dark min-h-[44px]"
          >
            {t('lookbook.view_gallery')} <ArrowRight className={cn('w-4 h-4', isRtl && 'rotate-180')} />
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x" dir="ltr">
          {items.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.06}>
            <Link
              to={`/product/${p.id}`}
              className="snap-start shrink-0 w-64 group block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={p.images?.[0] || '/images/hero-default.jpg'}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <p className="mt-3 text-xs tracking-[0.2em] uppercase text-stone-500">{p.category}</p>
              <p className="font-heading text-stone-800 truncate">{p.name}</p>
            </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}