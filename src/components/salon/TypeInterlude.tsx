import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Type interlude (design brief 9.5).
 *
 * Replaces the old small-label marquee. The words are now display-scale and
 * outlined - transparent fill with a 1px bone stroke at ~30% - so the strip
 * reads as a typographic pause between chapters rather than a ticker.
 *
 * Arabic is deliberately different: filled Amiri, no stroke, and the track
 * runs the other way. An outlined Arabic word is unreadable at this size.
 */
export default function TypeInterlude() {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion();
  const isAr = language === 'ar';

  const words = [
    t('cat.bridal'),
    t('cat.evening'),
    t('cat.rentals'),
    t('cat.bespoke'),
  ];

  const renderWord = (word: string) => (
    <span
      className={
        isAr
          ? 'font-arabic-heading text-[clamp(3rem,10vw,9rem)] leading-none text-bone/90'
          : 'font-heading text-[clamp(3rem,10vw,9rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(239,234,226,0.32)]'
      }
    >
      {word}
    </span>
  );

  // Reduced motion: static, centred. The track is w-max so it cannot simply
  // be centred with justify - it is a separate, wrapping layout instead.
  if (reduced) {
    return (
      <section
        className="bg-stone-900 py-16 md:py-24 border-y border-bone/5"
        aria-label={t('lookbook.intro')}
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="inline-flex items-center gap-10">
              {renderWord(word)}
              <span className="w-1.5 h-1.5 rotate-45 bg-terracotta" aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>
    );
  }

  // Two copies, because .marquee-track translates by -50%: the seam has to
  // land exactly one copy along for the loop to be invisible.
  const items = [...words, ...words];

  return (
    <section
      className="bg-stone-900 py-16 md:py-24 overflow-hidden border-y border-bone/5"
      aria-label={t('lookbook.intro')}
    >
      <div dir={isAr ? 'rtl' : 'ltr'}>
        <div className="marquee-track flex gap-10 md:gap-16 whitespace-nowrap w-max items-center">
          {items.map((word, i) => (
            <span key={`${word}-${i}`} className="inline-flex items-center gap-10 md:gap-16">
              {renderWord(word)}
              <span className="w-1.5 h-1.5 rotate-45 bg-terracotta" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
