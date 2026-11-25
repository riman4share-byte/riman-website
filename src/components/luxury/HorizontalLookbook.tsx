import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useGallery, GalleryItem } from '../../hooks/useGallery';
import { products as catalogue } from '../../data/products';
import { useLanguage } from '../../contexts/LanguageContext';
import { localizedContent } from '../../lib/productVocab';

/**
 * Pinned horizontal lookbook (design brief 9.6).
 *
 * The brief flags one required fix before this component is used on the home
 * page: it had no RTL handling. In Arabic the track has to scroll in the
 * MIRRORED direction - the x range is flipped and the progress bar grows
 * from the right instead of the left. Without this, the Arabic track scrolls
 * left while the reading direction is right.
 *
 * Mobile stays a vertical stack.
 *
 * Data comes from `useGallery({ featured: true, limit: 6 })` as the brief
 * specifies. When the gallery table is empty the section would vanish and
 * leave a hole in the home-page sequence, so it falls back to the product
 * catalogue - the same source the carousel it replaced used.
 */

interface LookbookEntry {
  id: string;
  title: string;
  category: string;
  src: string;
}

function Panel({ item, offset }: { item: LookbookEntry; offset?: boolean }) {
  return (
    <figure className={offset ? 'md:mt-24' : ''}>
      <div className="overflow-hidden group">
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-[52vh] md:h-[62vh] w-full md:w-[32vw] object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <figcaption className="flex justify-between mt-4 text-micro uppercase tracking-[0.3em] text-bone">
        <span>{item.title}</span>
        <span className="text-bone/40">{item.category}</span>
      </figcaption>
    </figure>
  );
}

function toEntry(item: GalleryItem): LookbookEntry {
  return {
    id: String(item.id),
    title: item.title,
    category: item.category,
    src: item.thumbnail_url || item.media_url,
  };
}

export default function HorizontalLookbook() {
  const { items, isLoading } = useGallery({ featured: true, limit: 6 });
  const { language } = useLanguage();

  const fallback: LookbookEntry[] = catalogue.slice(0, 6).map((p) => ({
    id: String(p.id),
    title: localizedContent(p, language).name,
    category: p.category,
    src: p.images[0],
  }));

  // While the gallery query is in flight we render the product fallback so
  // the section never collapses and the layout does not jump.
  const entries = items.length > 0 ? items.map(toEntry) : fallback;

  if (!isLoading && entries.length === 0) return null;

  return <LookbookContent items={entries} />;
}

function LookbookContent({ items }: { items: LookbookEntry[] }) {
  const { t, isRtl } = useLanguage();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Mirrored in RTL: the track starts off the right edge and travels right.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    isRtl ? ['-2%', '72%'] : ['2%', '-72%'],
  );
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      {/* Desktop: pinned horizontal scroll */}
      <section id="lookbook" ref={targetRef} className="relative hidden md:block h-[320vh] bg-onyx">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex items-center gap-[6vw] px-[8vw] will-change-transform">
            <div className="shrink-0 w-[34vw]">
              <p className="text-micro uppercase tracking-[0.35em] text-bone/40 mb-6">
                ( 02 ) — {t('lookbook.eyebrow')}
              </p>
              <h2 className="font-heading font-medium text-6xl md:text-[5.5vw] leading-[0.9] text-bone mb-8">
                {t('lookbook.heading')}
              </h2>
              <span className="text-micro uppercase tracking-[0.3em] text-bone/40">
                {t('hero.discover')} {isRtl ? '←' : '→'}
              </span>
            </div>

            {items.map((item, i) => (
              <div key={item.id} className="shrink-0">
                <Panel item={item} offset={i % 2 === 1} />
              </div>
            ))}

            <div className="shrink-0 w-[30vw] flex items-center">
              <Link to="/collection/all" className="group">
                <span className="font-heading italic font-medium text-5xl md:text-[4vw] leading-tight block text-bone group-hover:text-terracotta-light transition-colors duration-500">
                  {t('lookbook.cta')}
                </span>
                <span className="inline-block mt-6 text-2xl text-terracotta-light group-hover:translate-x-3 transition-transform duration-500 rtl:rotate-180">
                  {isRtl ? '←' : '→'}
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Progress bar grows from the inline-start edge, so it flips with
              the reading direction rather than always from the left. */}
          <div className="absolute bottom-8 start-[8vw] end-[8vw] h-px bg-bone/15">
            <motion.div
              className="h-full bg-terracotta origin-start rtl:origin-right"
              style={{ scaleX: progressScale }}
            />
          </div>
        </div>
      </section>

      {/* Mobile: vertical stack */}
      <section id="lookbook" className="md:hidden bg-onyx px-6 py-24">
        <p className="text-micro uppercase tracking-[0.35em] text-bone/40 mb-4">( 02 ) — {t('lookbook.eyebrow')}</p>
        <h2 className="font-heading font-medium text-5xl leading-[0.9] text-bone mb-10">{t('lookbook.heading')}</h2>
        <div className="flex flex-col gap-14">
          {items.map((item) => (
            <div key={item.id}>
              <Panel item={item} />
            </div>
          ))}
        </div>
        <Link
          to="/collection/all"
          className="inline-block mt-12 text-terracotta-light text-micro uppercase tracking-[0.3em] border-b border-terracotta/40 pb-1"
        >
          {t('lookbook.cta')} {isRtl ? '←' : '→'}
        </Link>
      </section>
    </>
  );
}
