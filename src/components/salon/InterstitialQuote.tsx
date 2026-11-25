import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import RevealWords from '../motion/RevealWords';

/**
 * Interstitial quote (brief 8.2 #4).
 *
 * Full-bleed onyx band with a Ken Burns still, a scroll-linked scale on the
 * image and an oversized opening quote glyph in terracotta/15.
 *
 * The scroll-linked scale is desktop-only and disabled under reduced motion;
 * the Ken Burns loop stays as the ambient motion on smaller screens.
 */
export default function InterstitialQuote() {
  const { t } = useLanguage();
  const { content } = useData();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const glyphY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);

  return (
    <section ref={sectionRef} className="couture-interstitial relative isolate overflow-hidden bg-onyx">
      <motion.div
        className="ken-burns absolute inset-0"
        style={reduced ? undefined : { scale: imageScale }}
      >
        <img
          src={content.quoteImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[center_30%] opacity-45"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/10 to-onyx/80" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        <motion.span
          aria-hidden="true"
          style={reduced ? undefined : { y: glyphY }}
          className="font-editorial text-[clamp(6rem,14vw,12rem)] leading-[0.6] text-terracotta/15 select-none"
        >
          &ldquo;
        </motion.span>
        <RevealWords
          text={t('atelier.quote')}
          className="font-editorial text-2xl italic leading-relaxed text-bone md:text-[2rem] md:leading-[1.5]"
        />
        <span className="h-px w-16 bg-terracotta/50" aria-hidden="true" />
        <span className="font-label text-caption uppercase tracking-[0.45em] text-terracotta-light">
          {t('chapter.atelier')}
        </span>
      </div>
    </section>
  );
}
