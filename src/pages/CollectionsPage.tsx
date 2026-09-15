import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ProductGridSkeleton } from '../components/Skeleton';
import type { Product } from '../types';

interface CollectionDef {
  slug: string;
  nameKey: string;
  blurb: { en: string; ar: string };
  match: (p: Product) => boolean;
}

const FALLBACK_IMAGE = '/assets/rimanfashion_3678245315913995332_6730733643_1_2025-07-16.jpg';

const collectionDefs: CollectionDef[] = [
  {
    slug: 'bridal',
    nameKey: 'nav.bridal',
    blurb: {
      en: 'Cathedral trains, hand-beaded bodices and signature veils for the modern bride.',
      ar: 'أذيال كاتدرائية، أجسام مطرزة يدويًا وطحرات مميزة للعروس العصرية.',
    },
    match: (p) => p.category === 'Bridal Gown',
  },
  {
    slug: 'couture',
    nameKey: 'nav.couture',
    blurb: {
      en: 'Evening silhouettes cut from silk and crystal for the grandest entrances.',
      ar: 'قصّات سهرة من الحرير والكريستال لإطلالات لا تُنسى.',
    },
    match: (p) => p.category === 'Evening Dress',
  },
  {
    slug: 'rental',
    nameKey: 'nav.rentals',
    blurb: {
      en: 'Own the moment without owning the gown — premium rental pieces, atelier-finished.',
      ar: 'اعيشي اللحظة دون شراء الفستان — قطع إيجار فاخرة بلمسة الأتيليه.',
    },
    match: (p) => p.productType === 'rent' || p.productType === 'both',
  },
  {
    slug: 'accessories',
    nameKey: 'nav.accessories',
    blurb: {
      en: 'Veils, straps and finishing details, hand-made alongside every gown.',
      ar: 'طحرات وأحزمة وتفاصيل نهائية، تُصنع يدويًا مع كل فستان.',
    },
    match: (p) => p.category === 'Accessory',
  },
  {
    slug: 'jewelry',
    nameKey: 'cat.jewelry',
    blurb: {
      en: 'Fine jewelry to crown the look — pearls, crystals and gold work.',
      ar: 'مجوهرات راقية لتتويج الإطلالة — لؤلؤ وكريستال وأعمال ذهبية.',
    },
    match: (p) => p.category === 'Fine Jewelry',
  },
  {
    slug: 'all',
    nameKey: 'cat.all',
    blurb: {
      en: 'The complete Riman archive — every design, in one place.',
      ar: 'أرشيف ريمان الكامل — كل التصاميم في مكان واحد.',
    },
    match: () => true,
  },
];

export default function CollectionsPage() {
  const { products, isLoading } = useData();
  const { language, t } = useLanguage();

  return (
    <div id="collections-page" className="pt-24 min-h-screen bg-ivory">
      <header className="section-padding !py-12 bg-ivory border-b border-stone-100">
        <div className="container mx-auto">
          <nav className="flex gap-2 text-xs tracking-widest uppercase text-stone-600 mb-4">
            <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">{t('nav.collections')}</span>
          </nav>
          <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider uppercase mb-4 leading-tight">
            {t('collections.title')}
          </h1>
          <p className="text-stone-600 font-body text-base tracking-wide max-w-2xl italic leading-relaxed">
            {t('collections.subtitle')}
          </p>
        </div>
      </header>

      <main className="section-padding !pt-12 !pb-24">
        <div className="container mx-auto">
          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {collectionDefs.map((def, idx) => {
                const matching = products.filter(def.match);
                const cover = matching[0]?.images?.[0] || FALLBACK_IMAGE;
                return (
                  <motion.div
                    key={def.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={`/collection/${def.slug}`}
                      className="card-couture group relative block bg-stone-100"
                      aria-label={t(def.nameKey)}
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={cover}
                          alt={t(def.nameKey)}
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                          className="w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent" />
                      <div className="absolute bottom-0 start-0 w-full p-6">
                        <p className="text-micro tracking-[0.25em] uppercase text-gold mb-2">
                          {matching.length} {t('collections.count')}
                        </p>
                        <h2 className="font-heading text-2xl text-white tracking-wider uppercase mb-2">
                          {t(def.nameKey)}
                        </h2>
                        <p className="text-white/75 font-body text-sm leading-relaxed mb-4 max-w-sm">
                          {language === 'ar' ? def.blurb.ar : def.blurb.en}
                        </p>
                        <span className="inline-flex items-center gap-2 text-white font-label text-xs tracking-[0.2em] uppercase border-b border-white/30 group-hover:border-gold group-hover:text-gold transition-colors pb-1">
                          {t('collections.browse')}
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
