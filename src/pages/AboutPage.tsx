import { useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import KineticHeading from '../components/motion/KineticHeading';
import RevealWords from '../components/motion/RevealWords';
import GoldThread from '../components/motion/GoldThread';

const TIMELINE = [
  {
    yearKey: 'about.timeline_2011',
    titleKey: 'about.timeline_2011_title',
    bodyKey: 'about.timeline_2011_body',
  },
  {
    yearKey: 'about.timeline_2015',
    titleKey: 'about.timeline_2015_title',
    bodyKey: 'about.timeline_2015_body',
  },
  {
    yearKey: 'about.timeline_2020',
    titleKey: 'about.timeline_2020_title',
    bodyKey: 'about.timeline_2020_body',
  },
  {
    yearKey: 'about.timeline_today',
    titleKey: 'about.timeline_today_title',
    bodyKey: 'about.timeline_today_body',
  },
] as const;

export default function AboutPage() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div className="min-h-screen bg-bone pt-24">
      <section className="relative flex min-h-[72vh] items-end overflow-hidden bg-onyx md:min-h-[80vh]">
        <div className="absolute inset-0">
          <video
            src="/output-1.mp4"
            autoPlay={!reducedMotion}
            muted
            loop={!reducedMotion}
            playsInline
            preload={reducedMotion ? 'none' : 'metadata'}
            className="h-full w-full object-cover object-center brightness-[0.72]"
            poster="/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-onyx/25" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 md:px-12 md:pb-24 lg:px-20">
          <div className="max-w-5xl">
            <p className="mb-6 font-label text-micro uppercase tracking-[0.4em] text-bone/70">
              {t('about.hero_subtitle')}
            </p>
            <KineticHeading
              as="h1"
              text={t('about.hero_title')}
              className="font-heading text-[clamp(3.5rem,9vw,8rem)] normal-case leading-[0.98] text-bone"
            />
            <div className="mt-10 flex items-center gap-5">
              <span className="h-px w-20 bg-terracotta" aria-hidden="true" />
              <span className="font-label text-micro uppercase tracking-[0.35em] text-bone/70">
                {t('about.hero_line')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-bone">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-40">
              <p className="mb-5 font-label text-micro uppercase tracking-[0.35em] text-terracotta-dark">
                {t('about.narrative_eyebrow')}
              </p>
              <KineticHeading
                as="h2"
                text={t('about.title')}
                className="max-w-xl font-heading text-4xl normal-case leading-tight text-stone-800 md:text-6xl"
              />
              <div className="mt-8 h-px w-20 bg-terracotta/50" aria-hidden="true" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="max-w-2xl space-y-8 font-body leading-loose text-stone-600">
              <RevealWords text={t('footer.about')} className="text-lg text-stone-700 md:text-xl" />
              <RevealWords text={t('about.narrative_1')} />
              <RevealWords text={t('about.narrative_2')} />
            </div>

            <ScrollReveal>
              <figure className="relative mt-14 ps-5 pt-5">
                <img
                  src="/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg"
                  alt={t('about.detail_image_alt')}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="absolute bottom-5 end-5 max-w-[15rem] bg-bone px-5 py-4 font-editorial text-sm italic leading-relaxed text-stone-700">
                  {t('about.detail_caption')}
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-champagne py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-40">
                <p className="mb-5 font-label text-micro uppercase tracking-[0.35em] text-terracotta-dark">
                  {t('about.timeline_eyebrow')}
                </p>
                <h2 className="font-heading text-4xl normal-case leading-tight text-stone-800 md:text-5xl">
                  {t('about.timeline_heading')}
                </h2>
                <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-stone-600">
                  {t('about.timeline_intro')}
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <ol className="relative border-s border-stone-300 ps-8 md:ps-12">
                {TIMELINE.map((moment) => (
                  <li key={moment.yearKey} className="relative pb-14 last:pb-0">
                    <ScrollReveal>
                      <span
                        className="absolute -start-[calc(2rem+3px)] top-1.5 h-[7px] w-[7px] bg-terracotta md:-start-[calc(3rem+3px)]"
                        aria-hidden="true"
                      />
                      <div className="mb-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                        <span className="font-label text-micro uppercase tracking-[0.3em] text-terracotta-dark">
                          {t(moment.yearKey)}
                        </span>
                        <span className="h-px w-8 bg-stone-300" aria-hidden="true" />
                      </div>
                      <h3 className="font-heading text-2xl normal-case text-stone-800 md:text-3xl">
                        {t(moment.titleKey)}
                      </h3>
                      <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-stone-600">
                        {t(moment.bodyKey)}
                      </p>
                    </ScrollReveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-onyx py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <p className="font-label text-micro uppercase tracking-[0.35em] text-brass-light">
                {t('about.quote_eyebrow')}
              </p>
            </div>
            <div className="lg:col-span-9">
              <blockquote className="relative">
                <span
                  className="pointer-events-none absolute -start-1 -top-10 font-editorial text-[7rem] leading-none text-terracotta-light/15 md:text-[10rem]"
                  aria-hidden="true"
                >
                  “
                </span>
                <p className="relative font-editorial text-3xl italic leading-[1.35] text-bone md:text-5xl md:leading-[1.3]">
                  {t('about.quote')}
                </p>
                <footer className="mt-7 font-label text-micro uppercase tracking-[0.3em] text-bone/60">
                  {t('about.quote_author')}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-900 py-24 text-bone md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <div className="mb-14 flex flex-col gap-6 border-b border-bone/15 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 font-label text-micro uppercase tracking-[0.35em] text-brass-light">
                {t('about.pillars_eyebrow')}
              </p>
              <h2 className="font-heading text-3xl normal-case text-bone md:text-5xl">
                {t('about.pillars')}
              </h2>
            </div>
            <p className="max-w-md font-body text-sm leading-relaxed text-bone/65">
              {t('about.pillars_intro')}
            </p>
          </div>

          <div className="grid md:grid-cols-3">
            <Value title={t('about.pillar_1_title')} desc={t('about.pillar_1_desc')} />
            <Value title={t('about.pillar_2_title')} desc={t('about.pillar_2_desc')} />
            <Value title={t('about.pillar_3_title')} desc={t('about.pillar_3_desc')} />
          </div>
        </div>
      </section>

      <section className="section-padding bg-bone">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col gap-6 border-b border-stone-300 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 font-label text-micro uppercase tracking-[0.35em] text-terracotta-dark">
                {t('about.visionaries')}
              </p>
              <KineticHeading
                as="h2"
                text={t('about.collective')}
                className="font-heading text-4xl normal-case text-stone-800 md:text-5xl"
              />
            </div>
            <p className="max-w-md font-body text-sm leading-relaxed text-stone-600">
              {t('about.collective_intro')}
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            <TeamMember
              name="Sarah Mansour"
              role={t('about.role_founder')}
              image="/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg"
            />
            <TeamMember
              name="Layla Al-Farsi"
              role={t('about.role_embroidery')}
              image="/assets/rimanfashion_3638158883472325906_1739454936_1_2025-05-22.jpg"
            />
            <TeamMember
              name="Mona Qureshi"
              role={t('about.role_jewelry')}
              image="/assets/rimanfashion_3717964372695289282_4048704816_2_2025-09-09.jpg"
            />
          </div>
        </div>
      </section>

      <section className="bg-pearl py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <div className="grid gap-8 md:grid-cols-12">
            <figure className="md:col-span-7">
              <img
                src="/assets/rimanfashion_3542687554351211237_227867687_2_2025-01-10.jpg"
                className="aspect-[4/5] w-full object-cover"
                alt={t('about.beadwork_image_alt')}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="flex flex-col justify-between bg-bone p-8 md:col-span-5 md:p-10">
              <div>
                <p className="font-label text-micro uppercase tracking-[0.35em] text-terracotta-dark">
                  {t('about.craft_eyebrow')}
                </p>
                <h2 className="mt-5 font-heading text-3xl normal-case leading-tight text-stone-800 md:text-4xl">
                  {t('about.craft_heading')}
                </h2>
              </div>
              <p className="mt-12 font-body text-sm leading-loose text-stone-600">
                {t('about.craft_body')}
              </p>
            </div>
          </div>

          <div className="mt-16">
            <GoldThread surface="bg-pearl" />
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="mb-3 font-label text-micro uppercase tracking-[0.35em] text-terracotta-dark">
                {t('about.closing_eyebrow')}
              </p>
              <h2 className="max-w-3xl font-heading text-3xl normal-case leading-tight text-stone-800 md:text-5xl">
                {t('about.closing_heading')}
              </h2>
            </div>
            <Link
              to="/appointment"
              className="btn-luxury inline-flex shrink-0 items-center gap-2"
            >
              {t('about.closing_cta')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamMember({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <article className="group">
      <div className="relative mb-7 aspect-[3/4] overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:scale-100"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-onyx/0 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-onyx/20" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-xl normal-case text-stone-800">{name}</h3>
      <p className="mt-2 font-label text-micro uppercase tracking-[0.25em] text-terracotta-dark">
        {role}
      </p>
    </article>
  );
}

function Value({ title, desc }: { title: string; desc: string }) {
  return (
    <article className="border-b border-bone/15 py-9 last:border-b-0 md:border-b-0 md:border-e md:px-8 md:py-0 md:first:ps-0 md:last:border-e-0 md:last:pe-0">
      <h3 className="font-heading text-2xl normal-case text-bone">{title}</h3>
      <p className="mt-5 max-w-sm font-body text-sm leading-relaxed text-bone/65">{desc}</p>
    </article>
  );
}
