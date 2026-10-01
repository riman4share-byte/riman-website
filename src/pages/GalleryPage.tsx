import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useGallery, GalleryItem } from '../hooks/useGallery';
import GalleryFilters from '../components/GalleryFilters';
import GalleryGrid from '../components/GalleryGrid';
import GalleryLightbox from '../components/GalleryLightbox';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { items, isLoading, error, hasMore, loadMore } = useGallery({
    category: activeCategory === 'all' ? undefined : activeCategory,
  });

  const handleItemClick = useCallback((_item: GalleryItem, index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  return (
    <div className="pt-32 pb-20 bg-ivory min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-editorial text-gold-ink text-micro mb-4 uppercase tracking-[0.4em]"
          >
            {t('gallery.title')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl text-stone-800 tracking-wider mb-6"
          >
            {t('gallery.subtitle')}
          </motion.h1>
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          <p className="text-stone-600 text-sm tracking-wide max-w-xl mx-auto">
            {t('gallery.description')}
          </p>
        </div>

        <GalleryFilters
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          className="mb-16"
        />

        {isLoading && items.length === 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4 bg-stone-100 animate-pulse" style={{ height: `${200 + (i % 3) * 100}px` }} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-stone-600 text-sm">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-600 text-sm">{t('gallery.no_items')}</p>
          </div>
        ) : (
          <>
            <GalleryGrid items={items} onItemClick={handleItemClick} />

            {hasMore && (
              <div className="text-center mt-16">
                <button
                  onClick={loadMore}
                  className="btn-luxury-outline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : t('gallery.load_more')}
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-16">
          {/* R16 — turn a passive gallery into a lead-capture step */}
          <div className="max-w-3xl mx-auto text-center border border-gold/30 bg-gold/[0.04] p-8 md:p-10">
            <h2 className="font-heading text-2xl md:text-3xl font-light text-stone-800 mb-4">
              {t('gallery.cta_heading')}
            </h2>
            <p className="font-body text-sm text-stone-600 leading-relaxed mb-7 max-w-xl mx-auto">
              {t('gallery.cta_body')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/appointment"
                className="btn-luxury w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                {t('gallery.cta_primary')}
              </Link>
              <Link to="/wishlist" className="btn-luxury-outline w-full sm:w-auto inline-flex items-center justify-center gap-2">
                {t('gallery.cta_secondary')}
              </Link>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/" className="inline-flex items-center gap-2 text-gold-ink text-xs tracking-widest uppercase hover:gap-4 transition-all pb-1 border-b border-gold/30 font-medium">
              {t('gallery.back_home')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <GalleryLightbox
        items={items}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
