import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import ChapterLabel from '../components/salon/ChapterLabel';
import InvitationRule from '../components/salon/InvitationRule';
import EditorialPlate from '../components/salon/EditorialPlate';
import AtelierSplit from '../components/salon/AtelierSplit';
import InterstitialQuote from '../components/salon/InterstitialQuote';
import HeroSection21st from '../components/ui-21st/HeroSection';
import ChapterRail from '../components/motion/ChapterRail';
import HorizontalLookbook from '../components/luxury/HorizontalLookbook';
import TypeInterlude from '../components/salon/TypeInterlude';
import TestimonialWall21st from '../components/ui-21st/TestimonialWall21st';
import BookingCTA21st from '../components/ui-21st/BookingCTA21st';
import GoldThread from '../components/motion/GoldThread';
import FrameSequence from '../components/motion/FrameSequence';

/**
 * Disciplines (brief 9.8): a staggered, uneven trio - the middle tile sits
 * lower and the ratios differ - so the row never reads as a flat 3-up grid.
 */
const DISCIPLINES = [
  {
    titleKey: 'cat.bridal',
    descKey: 'disciplines.bridal',
    media: '/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg',
    altKey: 'atelier.image_1_alt',
    to: '/collection/bridal',
    isVideo: false,
    ratio: 'aspect-[3/4]',
    offset: 'md:mt-0',
  },
  {
    titleKey: 'cat.evening',
    descKey: 'disciplines.evening',
    media: '/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg',
    altKey: 'atelier.image_2_alt',
    to: '/collection/evening',
    isVideo: false,
    ratio: 'aspect-[4/5]',
    offset: 'md:mt-16',
  },
  {
    titleKey: 'cat.rentals',
    descKey: 'disciplines.rentals',
    media: '/assets/rimanfashion_3306305106777368667_227867687_2024-02-19.mp4',
    altKey: 'atelier.image_3_alt',
    to: '/collection/rental',
    isVideo: true,
    ratio: 'aspect-[3/4]',
    offset: 'md:mt-8',
  },
];

export default function Index() {
  const { products } = useData();
  const { t } = useLanguage();

  const featured = products.filter((p) => p.isFeatured).slice(0, 6);
  const plates = featured.length >= 2 ? featured : products.slice(0, 6);

  return (
    <div className="film-grain">
      {/* 1. Hero 2.0 — onyx */}
      <HeroSection21st />
      <ChapterRail />

      <GoldThread surface="bg-bone" />

      {/* 2. I. Atelier — bone, sticky split with crossfading stills */}
      <AtelierSplit heading={t('atelier.heading')} body={t('atelier.body')} />

      {/* 3. Interstitial — onyx, full-bleed, oversized quote glyph */}
      <InterstitialQuote />

      <InvitationRule className="bg-champagne border-t border-terracotta/15" />

      {/* 4. II. Silhouettes — champagne, alternating plates */}
      <section id="silhouettes" className="bg-champagne py-24 md:py-36 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <ChapterLabel numeral="II" titleKey="chapter.silhouettes" />
          <div className="mt-16 md:mt-24 flex flex-col gap-24 md:gap-36">
            {plates.map((product, i) => (
              <div key={product.id}>
                <ScrollReveal>
                  <EditorialPlate product={product} index={i} reverse={i % 2 === 1} />
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldThread surface="bg-champagne" />

      {/* 5. Frame sequence — onyx, pinned canvas */}
      <FrameSequence
        captions={[
          { text: t('frames.caption_1'), at: 0.15 },
          { text: t('frames.caption_2'), at: 0.5 },
          { text: t('frames.caption_3'), at: 0.82 },
        ]}
      />

      {/* 6. III. Savoir-faire — bone, staggered discipline trio */}
      <section id="savoir-faire" className="bg-bone py-24 md:py-36 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <ChapterLabel numeral="III" titleKey="chapter.savoir_faire" />
          <div className="mt-12 grid md:grid-cols-2 gap-10 max-w-4xl">
            <p className="font-body text-stone-600 leading-loose">{t('savoir.p1')}</p>
            <p className="font-body text-stone-600 leading-loose">{t('savoir.p2')}</p>
          </div>
          <div className="mt-16 md:mt-24 grid md:grid-cols-3 gap-6 md:gap-8 items-start">
            {DISCIPLINES.map((d) => (
              <div key={d.titleKey} className={d.offset}>
                <ScrollReveal>
                  <Link to={d.to} className="group block">
                    <div className="overflow-hidden">
                      {d.isVideo ? (
                        <video
                          src={d.media}
                          autoPlay muted loop playsInline preload="none"
                          aria-hidden="true"
                          tabIndex={-1}
                          ref={(el) => {
                            if (!el) return;
                            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.pause();
                          }}
                          className={`${d.ratio} w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]`}
                        />
                      ) : (
                        <img
                          src={d.media}
                          alt={t(d.altKey)}
                          loading="lazy"
                          className={`${d.ratio} w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]`}
                        />
                      )}
                    </div>
                    <h3 className="font-heading text-2xl text-stone-800 mt-5">{t(d.titleKey)}</h3>
                    <p className="font-editorial italic text-stone-600 mt-2">{t(d.descKey)}</p>
                    <span className="link-couture inline-block mt-3 font-label text-xs tracking-[0.25em] uppercase text-terracotta-dark">
                      {t('disciplines.discover')}
                    </span>
                  </Link>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldThread surface="bg-stone-900" />

      {/* 7. Type interlude — stone-900, giant outlined marquee */}
      <TypeInterlude />

      {/* 8. Pinned horizontal lookbook — onyx */}
      <HorizontalLookbook />

      <InvitationRule className="bg-champagne border-t border-terracotta/15" />

      {/* 9. Testimonials — champagne */}
      <TestimonialWall21st />

      {/* 10. Closing CTA band — onyx, in-flow (the brief forbids a sticky CTA band) */}
      <BookingCTA21st />
    </div>
  );
}
