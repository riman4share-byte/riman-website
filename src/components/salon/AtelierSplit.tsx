import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import RevealWords from '../motion/RevealWords';

/**
 * Atelier sticky split (design brief 9.3).
 *
 * Left: a sticky stack of atelier stills that crossfade as the right column
 * scrolls past. Each image carries a 12px-offset 1px terracotta outline - an
 * editorial "second frame", no shadow.
 *
 * Right: the chapter statement, body and a pull quote. The column is tall
 * on purpose: the crossfade is driven by scroll progress across it, so a
 * short column would leave the stills with no room to change.
 *
 * Mobile collapses to a single column with the images inline, because a
 * sticky crossfade on a phone means the user can never see two images at once.
 */

const ATELIER_IMAGES = [
  {
    src: '/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg',
    altKey: 'atelier.image_1_alt',
  },
  {
    src: '/assets/rimanfashion_3638158883472325906_1739454936_1_2025-05-22.jpg',
    altKey: 'atelier.image_2_alt',
  },
  {
    src: '/assets/rimanfashion_3640433975103420052_227867687_1_2025-05-25.jpg',
    altKey: 'atelier.image_3_alt',
  },
];

interface AtelierSplitProps {
  heading: string;
  body: string;
}

export default function AtelierSplit({ heading, body }: AtelierSplitProps) {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const rightRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rightRef,
    offset: ['start end', 'end start'],
  });

  // Each still owns a third of the scroll range. The image index is derived
  // from scroll position rather than an IntersectionObserver, so the
  // crossfade is continuous rather than snapping.
  const opacities = ATELIER_IMAGES.map((_, i) => {
    const start = i / ATELIER_IMAGES.length;
    const end = (i + 1) / ATELIER_IMAGES.length;
    const fade = 0.18;
    return useTransform(
      scrollYProgress,
      [Math.max(0, start - fade), start, end, Math.min(1, end + fade)],
      [0, 1, 1, 0],
    );
  });

  return (
    <section id="atelier" className="bg-bone py-28 md:py-40 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* Sticky image stack */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <div className="relative aspect-[3/4] overflow-hidden">
              {ATELIER_IMAGES.map((image, i) => (
                <motion.img
                  key={image.src}
                  src={image.src}
                  alt={t(image.altKey)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
                  style={reduced ? { opacity: i === 0 ? 1 : 0 } : { opacity: opacities[i] }}
                />
              ))}
              {/* Editorial second frame - 12px offset, 1px terracotta, no shadow */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 border border-terracotta/30"
              />
              <span className="absolute bottom-5 start-5 font-label text-[11px] tracking-[0.3em] uppercase text-ivory/85">
                {t('chapter.atelier')}
              </span>
            </div>
          </div>
        </div>

        {/* Statement + body + pull quote */}
        <div ref={rightRef} className="md:col-span-7 flex flex-col gap-10 md:gap-14">
          <span className="font-label text-[11px] tracking-[0.35em] uppercase text-terracotta-dark">
            {t('chapter.atelier')}
          </span>
          <h3 className="font-heading text-4xl md:text-6xl text-stone-800 leading-[1.1]">
            {heading}
          </h3>
          <RevealWords
            text={body}
            className="font-body text-lg text-stone-600 leading-loose max-w-2xl"
          />

          <div className="flex items-start gap-6 border-t border-terracotta/20 pt-10">
            <span className="font-editorial text-5xl leading-none text-terracotta/30 select-none" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote className="font-editorial italic text-xl md:text-2xl leading-relaxed text-stone-800">
              {t('atelier.quote')}
            </blockquote>
          </div>

          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-terracotta/40" aria-hidden="true" />
            <span className="font-label text-[11px] tracking-[0.3em] uppercase text-stone-500">
              {t('hero.since')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
