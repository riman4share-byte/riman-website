import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import ChapterLabel from '../components/salon/ChapterLabel';
import InvitationRule from '../components/salon/InvitationRule';
import EditorialPlate from '../components/salon/EditorialPlate';
import Hero21st from '../components/ui-21st/Hero21st';
import LookbookCarousel21st from '../components/ui-21st/LookbookCarousel21st';
import TestimonialWall21st from '../components/ui-21st/TestimonialWall21st';
import BookingCTA21st from '../components/ui-21st/BookingCTA21st';
import Footer21st from '../components/ui-21st/Footer21st';

const DISCIPLINES = [
  { titleKey: 'cat.bridal', descKey: 'disciplines.bridal', media: '/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg', alt: 'Bridal', to: '/collection/bridal', isVideo: false },
  { titleKey: 'cat.evening', descKey: 'disciplines.evening', media: '/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg', alt: 'Evening', to: '/collection/evening', isVideo: false },
  { titleKey: 'cat.rentals', descKey: 'disciplines.rentals', media: '/assets/rimanfashion_3306305106777368667_227867687_2024-02-19.mp4', alt: 'Rentals', to: '/collection/rental', isVideo: true },
];

export default function Index() {
  const { products } = useData();
  const { t } = useLanguage();

  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const plates = featured.length >= 2 ? featured : products.slice(0, 4);

  return (
    <main className="film-grain">
      <Hero21st />

      <section id="atelier" className="bg-bone py-24 md:py-36 px-6 md:px-12 lg:px-20">
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
            <ScrollReveal delay={0.1}>
              <p className="font-editorial italic text-xl md:text-2xl text-gold-dark leading-relaxed max-w-2xl">
                {t('atelier.quote')}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="font-body text-stone-600 leading-loose max-w-2xl">{t('atelier.body')}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <InvitationRule className="bg-bone border-t border-gold/15" />

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

      <InvitationRule className="bg-champagne border-t border-gold/15" />

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
                  <span className="inline-block mt-3 font-label text-xs tracking-[0.25em] uppercase text-gold border-b border-gold/40 pb-1">
                    {t('disciplines.discover')}
                  </span>
                </Link>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InvitationRule className="bg-bone border-t border-gold/15" />

      <LookbookCarousel21st />

      <InvitationRule className="bg-champagne border-t border-gold/15" />

      <TestimonialWall21st />

      <BookingCTA21st />

      <Footer21st />
    </main>
  );
}