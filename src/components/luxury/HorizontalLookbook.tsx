import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useGallery, type GalleryItem } from '../../hooks/useGallery';
import { useLanguage } from '../../contexts/LanguageContext';
import { FALLBACK_GALLERY } from '../../data/galleryFallback';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

function Panel({ item, title, offset }: { item: GalleryItem; title: string; offset?: boolean }) {
  return (
    <figure className={offset ? 'md:mt-24' : ''}>
      <div className="overflow-hidden group">
        <img
          src={item.thumbnail_url || item.media_url}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-[52vh] md:h-[62vh] w-full md:w-[32vw] object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <figcaption className="flex justify-between gap-4 mt-4 text-micro uppercase tracking-[0.3em] text-ivory">
        <span className="truncate">{title}</span>
        <span className="text-ivory/40 shrink-0">{item.category.replace(/_/g, ' ')}</span>
      </figcaption>
    </figure>
  );
}

export default function HorizontalLookbook() {
  const { items } = useGallery({ featured: true, limit: 6 });
  const resolved =
    items.length > 0
      ? items
      : FALLBACK_GALLERY.filter((i) => i.is_featured).slice(0, 6);

  if (resolved.length === 0) return null;

  return <LookbookContent items={resolved} />;
}

function LookbookContent({ items }: { items: GalleryItem[] }) {
  const { t, isRtl } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        if (getDistance() === 0) return;

        const tween = gsap.to(track, {
          x: () => (isRtl ? getDistance() : -getDistance()),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress });
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [isRtl, items.length], revertOnUpdate: true },
  );

  if (reducedMotion) {
    return <Stack items={items} />;
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative hidden md:block h-screen overflow-hidden bg-onyx"
        aria-label={t('lookbook.heading')}
      >
        <div className="h-full flex items-center">
          <div
            ref={trackRef}
            className="flex items-center gap-[6vw] px-[8vw] will-change-transform"
          >
            <div className="shrink-0 w-[34vw]">
              <p className="text-micro uppercase tracking-[0.35em] text-ivory/40 mb-6">
                ( 02 ) — {t('lookbook.eyebrow')}
              </p>
              <h2 className="font-heading font-medium text-6xl md:text-[5.5vw] leading-[0.9] text-white mb-8">
                {t('lookbook.heading')}
              </h2>
              <span className="text-micro uppercase tracking-[0.3em] text-ivory/40">
                {t('hero.discover')} →
              </span>
            </div>

            {items.map((item, i) => (
              <div key={item.id} className="shrink-0">
                <Panel
                  item={item}
                  title={item.title || `Look ${String(i + 1).padStart(2, '0')}`}
                  offset={i % 2 === 1}
                />
              </div>
            ))}

            <div className="shrink-0 w-[30vw] flex items-center">
              <Link to="/collection/all" className="group">
                <span className="font-heading italic font-medium text-5xl md:text-[4vw] leading-tight block text-white group-hover:text-terracotta-dark transition-colors duration-500">
                  {t('lookbook.cta')}
                </span>
                <span className="inline-block mt-6 text-2xl text-terracotta-dark group-hover:translate-x-3 transition-transform duration-500">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 start-[8vw] end-[8vw] h-px bg-white/15">
          <div
            ref={progressRef}
            className="h-full bg-terracotta origin-left rtl:origin-right"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </section>

      <Stack items={items} className="md:hidden" />
    </>
  );
}

function Stack({ items, className = '' }: { items: GalleryItem[]; className?: string }) {
  const { t } = useLanguage();
  return (
    <section className={`bg-onyx px-6 py-24 ${className}`}>
      <p className="text-micro uppercase tracking-[0.35em] text-ivory/40 mb-4">
        ( 02 ) — {t('lookbook.eyebrow')}
      </p>
      <h2 className="font-heading font-medium text-5xl leading-[0.9] text-white mb-10">
        {t('lookbook.heading')}
      </h2>
      <div className="flex flex-col gap-14">
        {items.map((item, i) => (
          <div key={item.id}>
            <Panel item={item} title={item.title || `Look ${String(i + 1).padStart(2, '0')}`} />
          </div>
        ))}
      </div>
      <Link
        to="/collection/all"
        className="inline-block mt-12 text-terracotta-dark text-micro uppercase tracking-[0.3em] border-b border-terracotta/40 pb-1"
      >
        {t('lookbook.cta')} →
      </Link>
    </section>
  );
}
