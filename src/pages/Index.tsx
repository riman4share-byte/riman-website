import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import ChapterLabel from '../components/salon/ChapterLabel';
import RevealWords from '../components/motion/RevealWords';
import InvitationRule from '../components/salon/InvitationRule';
import EditorialPlate from '../components/salon/EditorialPlate';
import HeroSection21st from '../components/ui-21st/HeroSection';
import ElegantCarousel21st from '../components/ui-21st/ElegantCarousel21st';
import Marquee21st from '../components/ui-21st/Marquee21st';
import TestimonialWall21st from '../components/ui-21st/TestimonialWall21st';
import BookingCTA21st from '../components/ui-21st/BookingCTA21st';
import GoldThread from '../components/motion/GoldThread';
import FrameSequence from '../components/motion/FrameSequence';

const DISCIPLINES = [
  { titleKey: 'cat.bridal', descKey: 'disciplines.bridal', media: '/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg', alt: 'Bridal', to: '/collection/bridal', isVideo: false },
  { titleKey: 'cat.evening', descKey: 'disciplines.evening', media: '/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg', alt: 'Evening', to: '/collection/evening', isVideo: false },
  { titleKey: 'cat.rentals', descKey: 'disciplines.rentals', media: '/assets/rimanfashion_3306305106777368667_227867687_2024-02-19.mp4', alt: 'Rentals', to: '/collection/rental', isVideo: true },
];

export default function Index() {
  const { products, content } = useData();
  const { t, language } = useLanguage();

  const featured = products.filter((p) => p.isFeatured).slice(0, 6);
  const plates = featured.length >= 2 ? featured : products.slice(0, 6);

  return (
    <div className="film-grain">
      <HeroSection21st />

      <GoldThread className="bg-bone" />
      <section id="atelier" className="bg-bone py-28 md:py-40 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-40">
              <ChapterLabel numeral="I" titleKey="chapter.atelier" />
            </div>
          </div>
          <div className="md:col-span-8 flex flex-col gap-10">
            <ScrollReveal>
              <h3 className="font-heading text-3xl md:text-5xl font-light text-stone-800 leading-tight">
                {t('atelier.heading')}
              </h3>
            </ScrollReveal>
            <RevealWords
              text={t('atelier.body')}
              className="font-body text-stone-600 leading-loose max-w-2xl"
            />
          </div>
        </div>
      </section>

      {/* Dark couture interstitial — full-bleed atelier imagery, slow Ken Burns */}
      <section className="couture-interstitial relative isolate overflow-hidden bg-onyx">
        <div className="ken-burns absolute inset-0">
          <img
            src={content.quoteImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover object-[center_30%] opacity-45"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/10 to-onyx/80" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
          <span className="h-px w-16 bg-terracotta/50" aria-hidden="true" />
          <RevealWords
            text={t('atelier.quote')}
            className="font-editorial text-2xl italic leading-relaxed text-bone md:text-[2rem] md:leading-[1.5]"
          />
          <span className="font-label text-caption uppercase tracking-[0.45em] text-terracotta-light">
            {t('chapter.atelier')}
          </span>
        </div>
      </section>

      <InvitationRule className="bg-bone border-t border-terracotta/15" />

      <section className="bg-champagne py-24 md:py-36 px-6 md:px-12 lg:px-20">
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

      <InvitationRule className="bg-champagne border-t border-terracotta/15" />

      {/* Pinned canvas frame sequence — 131 frames @8fps, DPR-aware; poster fallback on mobile/reduced-motion/save-data */}
      <FrameSequence
        captions={
          language === 'ar'
            ? [
                { text: 'نحن ننسج الأحلام في الحرير', at: 0.15 },
                { text: 'كل خيط حكاية', at: 0.5 },
                { text: 'من الشارقة — منذ ٢٠١١', at: 0.82 },
              ]
            : [
                { text: 'We weave dreams into silk', at: 0.15 },
                { text: 'Every thread, a story', at: 0.5 },
                { text: 'Sharjah — since 2011', at: 0.82 },
              ]
        }
      />

      <section className="bg-bone py-24 md:py-36 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <ChapterLabel numeral="III" titleKey="chapter.savoir_faire" />
          <div className="mt-12 grid md:grid-cols-2 gap-10 max-w-4xl">
            <p className="font-body text-stone-600 leading-loose">{t('savoir.p1')}</p>
            <p className="font-body text-stone-600 leading-loose">{t('savoir.p2')}</p>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {DISCIPLINES.map((d) => (
              <div key={d.titleKey}>
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
                        className="aspect-[3/4] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <img
                        src={d.media}
                        alt={d.alt}
                        loading="lazy"
                        className="aspect-[3/4] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <h3 className="font-heading text-2xl font-light text-stone-800 mt-5">{t(d.titleKey)}</h3>
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

      <InvitationRule className="bg-bone border-t border-terracotta/15" />

      <Marquee21st />

      <ElegantCarousel21st />

      <InvitationRule className="bg-champagne border-t border-terracotta/15" />

      <TestimonialWall21st />

      {/* Single contextual sticky CTA replaces 4 repeated strips */}
      <section className="sticky bottom-0 z-30 bg-onyx/95 border-t border-terracotta/20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4">
          <p className="font-label text-[11px] tracking-[0.2em] uppercase text-bone/80 text-center sm:text-start">
            {language === 'ar' ? 'معاينة خاصة في الأتيليه — الشارقة' : 'Private viewing at the atelier — Sharjah'}
          </p>
          <Link to="/appointment" className="btn-couture-ghost !text-bone whitespace-nowrap min-h-[44px]">
            {t('cta.viewing')}
          </Link>
        </div>
      </section>

      <BookingCTA21st />

    </div>
  );
}
