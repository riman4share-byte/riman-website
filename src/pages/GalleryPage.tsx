import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Image as ImageIcon, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useGallery, type GalleryItem } from '../hooks/useGallery';
import GalleryLightbox from '../components/GalleryLightbox';
import KineticHeading from '../components/motion/KineticHeading';
import GoldThread from '../components/motion/GoldThread';

const FILTERS = [
  { key: 'all', labelKey: 'gallery.filter_all' },
  { key: 'bridal', labelKey: 'gallery.filter_bridal' },
  { key: 'evening', labelKey: 'gallery.filter_evening' },
  { key: 'behind_scenes', labelKey: 'gallery.filter_bts' },
  { key: 'client_stories', labelKey: 'gallery.filter_clients' },
] as const;

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  bridal: 'gallery.filter_bridal',
  evening: 'gallery.filter_evening',
  jewelry: 'gallery.filter_jewelry',
  behind_scenes: 'gallery.filter_bts',
  client_stories: 'gallery.filter_clients',
};

const CATEGORY_ORDER = ['bridal', 'evening', 'jewelry', 'behind_scenes', 'client_stories'];

const TILE_RATIOS = [
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-square',
  'aspect-[5/4]',
  'aspect-[3/4]',
  'aspect-[2/3]',
  'aspect-[4/5]',
] as const;

interface GalleryEntry {
  item: GalleryItem;
  index: number;
}

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

  const groups = useMemo(() => {
    const grouped = new Map<string, GalleryEntry[]>();

    items.forEach((item, index) => {
      const category = item.category || 'all';
      const entries = grouped.get(category) ?? [];
      entries.push({ item, index });
      grouped.set(category, entries);
    });

    return Array.from(grouped.entries()).sort(([a], [b]) => {
      const aIndex = CATEGORY_ORDER.indexOf(a);
      const bIndex = CATEGORY_ORDER.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [items]);

  return (
    <div className="min-h-screen bg-bone pt-24">
      <header className="border-b border-stone-300/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-20">
          <div className="lg:col-span-8">
            <p className="mb-6 font-label text-micro uppercase tracking-[0.4em] text-terracotta-dark">
              {t('gallery.title')}
            </p>
            <KineticHeading
              as="h1"
              text={t('gallery.subtitle')}
              className="max-w-4xl font-heading text-[clamp(3.2rem,8vw,7rem)] normal-case leading-[0.98] text-stone-800"
            />
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="max-w-md font-body text-base leading-loose text-stone-600">
              {t('gallery.description')}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-14 md:px-12 md:py-20 lg:px-20">
        <nav
          aria-label={t('gallery.filter_all')}
          className="mb-20 flex flex-wrap items-center gap-x-2 gap-y-3 border-y border-stone-300 py-4"
        >
          {FILTERS.map((filter) => {
            const isActive = activeCategory === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => handleCategoryChange(filter.key)}
                aria-pressed={isActive}
                className={
                  isActive
                    ? 'min-h-11 bg-terracotta px-5 py-3 font-label text-micro uppercase tracking-[0.25em] text-bone'
                    : 'min-h-11 border border-transparent px-5 py-3 font-label text-micro uppercase tracking-[0.25em] text-stone-600 hover:border-terracotta/30 hover:text-terracotta-dark'
                }
              >
                {t(filter.labelKey)}
              </button>
            );
          })}
        </nav>

        {isLoading && items.length === 0 ? (
          <div className="columns-1 gap-x-6 md:columns-2 lg:columns-3" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className={`mb-8 break-inside-avoid animate-pulse bg-stone-100 ${TILE_RATIOS[index % TILE_RATIOS.length]}`}
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="font-body text-sm text-stone-600">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-body text-sm text-stone-600">{t('gallery.no_items')}</p>
          </div>
        ) : (
          <>
            <div className="space-y-24 md:space-y-32">
              {groups.map(([category, entries], groupIndex) => {
                const labelKey = CATEGORY_LABEL_KEYS[category] ?? 'gallery.filter_all';
                return (
                  <section key={category} aria-labelledby={`gallery-group-${category}`}>
                    <div className="mb-10 flex items-end justify-between gap-6 border-b border-stone-300 pb-5">
                      <KineticHeading
                        as="h2"
                        text={t(labelKey)}
                        className="font-heading text-4xl normal-case leading-tight text-stone-800 md:text-6xl"
                      />
                      <span className="hidden h-px flex-1 bg-stone-300 sm:block" aria-hidden="true" />
                    </div>

                    <div className="columns-1 gap-x-6 md:columns-2 lg:columns-3">
                      {entries.map(({ item, index }) => (
                        <GalleryTile
                          key={item.id}
                          item={item}
                          index={index}
                          onItemClick={handleItemClick}
                        />
                      ))}
                    </div>

                    {groupIndex < groups.length - 1 && (
                      <div className="mt-20 md:mt-28">
                        <GoldThread surface="bg-bone" />
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-20 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  className="btn-luxury-outline"
                  disabled={isLoading}
                >
                  {isLoading ? t('gallery.loading') : t('gallery.load_more')}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <section className="bg-onyx py-20 text-bone md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:px-12 lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-20">
          <div className="lg:col-span-8">
            <p className="mb-5 font-label text-micro uppercase tracking-[0.35em] text-brass-light">
              {t('gallery.title')}
            </p>
            <h2 className="max-w-3xl font-heading text-3xl normal-case leading-tight text-bone md:text-5xl">
              {t('gallery.cta_heading')}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="mb-8 font-body text-sm leading-relaxed text-bone/70">
              {t('gallery.cta_body')}
            </p>
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Link to="/appointment" className="btn-couture-ghost !text-bone">
                {t('gallery.cta_primary')}
              </Link>
              <Link to="/wishlist" className="link-couture font-label text-xs uppercase tracking-[0.25em] text-bone">
                {t('gallery.cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 text-center md:px-12 lg:px-20">
        <Link
          to="/"
          className="link-couture inline-flex items-center gap-2 font-label text-xs uppercase tracking-[0.25em] text-terracotta-dark"
        >
          {t('gallery.back_home')}
          <ArrowRight className="h-3 w-3 rtl:rotate-180" aria-hidden="true" />
        </Link>
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

function GalleryTile({
  item,
  index,
  onItemClick,
}: {
  item: GalleryItem;
  index: number;
  onItemClick: (item: GalleryItem, index: number) => void;
}) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion() ?? false;
  const ratio = TILE_RATIOS[index % TILE_RATIOS.length];
  const frameClass =
    'group relative mb-8 w-full break-inside-avoid cursor-pointer overflow-hidden bg-stone-100 text-start';
  const mediaClass =
    'h-full w-full object-cover group-hover:scale-105 motion-reduce:scale-100 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]';
  const label = item.title || t('gallery.untitled');

  const open = () => onItemClick(item, index);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };

  const media =
    item.media_type === 'video' ? (
      <GalleryVideo item={item} className={mediaClass} reducedMotion={reducedMotion} />
    ) : (
      <img
        src={item.media_url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={mediaClass}
      />
    );

  const overlay = (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-onyx/0 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-onyx/30"
        aria-hidden="true"
      />
      <div className="absolute bottom-3 start-3 flex items-center gap-2 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100">
        {item.media_type === 'video' ? (
          <Play className="h-4 w-4 fill-bone text-bone" aria-hidden="true" />
        ) : (
          <ImageIcon className="h-4 w-4 text-bone" aria-hidden="true" />
        )}
        <span className="font-label text-micro uppercase tracking-[0.25em] text-bone">{label}</span>
      </div>
    </>
  );

  if (reducedMotion) {
    return (
      <div
        className={frameClass}
        onClick={open}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${t('gallery.open_item')}: ${label}`}
      >
        <div className={ratio}>{media}</div>
        {overlay}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.8,
        delay: Math.min(index * 0.03, 0.18),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={frameClass}
      onClick={open}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${t('gallery.open_item')}: ${label}`}
    >
      <div className={ratio}>{media}</div>
      {overlay}
    </motion.div>
  );
}

function GalleryVideo({
  item,
  className,
  reducedMotion,
}: {
  item: GalleryItem;
  className: string;
  reducedMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { threshold: [0.3] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={videoRef}
      src={item.media_url}
      poster={item.thumbnail_url || undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    />
  );
}
