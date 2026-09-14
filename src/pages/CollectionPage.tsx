import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ProductGridSkeleton } from '../components/Skeleton';
import FilterBar, { type Filter, type FilterFieldDef } from '@/components/ui/filter-token-bar';

const YEARS = [2025, 2024];
const COLORS = ['Ivory', 'Emerald', 'Gold', 'Champagne', 'Silver', 'Soft White', 'White', 'Blush', 'Black', 'Rose Gold', 'Amber', 'Dual Tone', 'Pearl', 'Sage Green', 'Lavender'];
const SILHOUETTES = ['A-Line', 'Ballgown', 'Mermaid', 'Column', 'Kaftan', 'One Size'];
const CATEGORIES = ['Bridal Gown', 'Evening Dress', 'Rental', 'Accessory', 'Fine Jewelry'];

export default function CollectionPage() {
  const { products, isLoading } = useData();
  const { category } = useParams();
  const { t } = useLanguage();

  const filterFields: FilterFieldDef[] = [
    {
      id: 'category',
      label: t('cat.collection'),
      operators: [{ value: 'is', label: 'is' }, { value: 'is_any', label: 'is any of', multi: true }],
      options: CATEGORIES.map(c => ({ value: c.toLowerCase(), label: c })),
    },
    {
      id: 'color',
      label: t('collection.colors'),
      operators: [{ value: 'is_any', label: 'is any of', multi: true }],
      options: COLORS.map(c => ({ value: c.toLowerCase(), label: c })),
    },
    {
      id: 'silhouette',
      label: t('collection.silhouette'),
      operators: [{ value: 'is', label: 'is' }, { value: 'is_any', label: 'is any of', multi: true }],
      options: SILHOUETTES.map(s => ({ value: s.toLowerCase(), label: s })),
    },
    {
      id: 'year',
      label: t('collection.year'),
      operators: [{ value: 'is', label: 'is' }],
      options: YEARS.map(y => ({ value: String(y), label: String(y) })),
    },
  ];

  const [filters, setFilters] = useState<Filter[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category && category !== 'all') {
      if (category === 'bridal') result = result.filter(p => p.category === 'Bridal Gown');
      else if (category === 'evening') result = result.filter(p => p.category === 'Evening Dress');
      else if (category === 'rental') result = result.filter(p => p.productType === 'rent' || p.productType === 'both');
      else if (category === 'accessories') result = result.filter(p => p.category === 'Accessory');
      else if (category === 'jewelry') result = result.filter(p => p.category === 'Fine Jewelry');
    }

    filters.forEach(f => {
      if (f.values.length === 0) return;
      if (f.field === 'category') {
        result = result.filter(p =>
          f.values.some(v =>
            v === 'rental'
              ? p.productType === 'rent' || p.productType === 'both'
              : p.category.toLowerCase() === v
          )
        );
      } else if (f.field === 'color') {
        result = result.filter(p => p.color.some(c => f.values.includes(c.toLowerCase())));
      } else if (f.field === 'silhouette') {
        result = result.filter(p => p.silhouette && f.values.includes(p.silhouette.toLowerCase()));
      } else if (f.field === 'year') {
        result = result.filter(p => f.values.includes(String(p.collectionYear)));
      }
    });

    if (sortBy === 'price-low') result.sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0));
    if (sortBy === 'price-high') result.sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0));
    if (sortBy === 'newest') result.sort((a, b) => (b.collectionYear || 0) - (a.collectionYear || 0));

    return result;
  }, [category, filters, sortBy, products]);

  const hasActiveFilters = filters.length > 0 || sortBy !== 'featured';

  const clearFilters = () => {
    setFilters([]);
    setSortBy('featured');
  };

  const categoryTitle = category === 'bridal' ? t('cat.bridal_title')
    : category === 'evening' ? t('cat.evening_title')
    : category === 'rental' ? t('cat.rental_title')
    : t('cat.all');

  return (
    <div id="collection-page" className="pt-24 min-h-screen bg-ivory">
      <header className="section-padding !py-12 bg-ivory border-b border-stone-100">
        <div className="container mx-auto">
          <nav className="flex gap-2 text-xs tracking-widest uppercase text-stone-600 mb-4">
            <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">{t('cat.collection')}</span>
          </nav>
          <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider uppercase mb-4 leading-tight">{categoryTitle}</h1>
          <p className="text-stone-600 font-body text-base tracking-wide max-w-2xl italic leading-relaxed">
            {t('cat.subtitle')}
          </p>
        </div>
      </header>

      <div className="z-40 bg-ivory/80 backdrop-blur-md border-b border-stone-100">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <FilterBar
                fields={filterFields}
                value={filters}
                onChange={setFilters}
                aria-label={t('collection.filters')}
              />
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  onBlur={() => setTimeout(() => setShowSortMenu(false), 200)}
                  className="flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-stone-800 font-bold cursor-pointer"
                >
                  {t('collection.sort')} <ChevronDown className={cn("w-4 h-4 transition-transform", showSortMenu && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full pt-2 z-50"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="bg-ivory border border-stone-100 p-2 w-56 flex flex-col gap-1 backdrop-blur-md shadow-lg shadow-stone-200/50">
                        {[['featured', t('collection.sort_featured')], ['newest', t('collection.sort_newest')], ['price-low', t('collection.sort_price_low')], ['price-high', t('collection.sort_price_high')]].map(([option, label]) => (
                          <button
                            key={option}
                            onClick={() => { setSortBy(option); setShowSortMenu(false); }}
                            className={cn(
                              "text-left px-5 py-3 text-xs tracking-widest uppercase transition-colors font-medium cursor-pointer",
                              sortBy === option ? "bg-gold/10 text-gold" : "text-stone-600 hover:bg-stone-50 hover:text-stone-800"
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
              <span className="text-micro tracking-widest uppercase text-stone-600">{filteredProducts.length} {t('collection.results')}</span>
              <button onClick={clearFilters} className="text-micro tracking-[0.2em] uppercase text-gold hover:text-stone-800 transition-colors font-bold">{t('collection.clear_all')}</button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="max-w-md mx-auto mb-10">
                <div className="w-16 h-px bg-gold mx-auto mb-8" />
                <p className="heading-editorial text-stone-600 text-2xl italic mb-4">{t('collection.empty_heading')}</p>
                <p className="font-body text-xs text-stone-600 tracking-[0.2em] uppercase leading-relaxed">
                  {t('collection.empty_desc')}
                </p>
                <div className="w-16 h-px bg-gold mx-auto mt-8" />
              </div>
              <Link to="/collection/all" className="btn-luxury">{t('collection.view_all')}</Link>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}