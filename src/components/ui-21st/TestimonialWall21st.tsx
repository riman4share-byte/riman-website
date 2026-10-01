import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';

const PILLARS = [
  { titleKey: 'home.pillar_fitting_title', bodyKey: 'home.pillar_fitting_body' },
  { titleKey: 'home.pillar_hire_title', bodyKey: 'home.pillar_hire_body' },
  { titleKey: 'home.pillar_care_title', bodyKey: 'home.pillar_care_body' },
];

export default function TestimonialWall21st() {
  const { t } = useLanguage();
  const { content } = useData();

  return (
    <section className="bg-bone py-20" aria-label={t('home.pillars_label')}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-label text-caption tracking-[0.35em] uppercase text-terracotta-dark mb-4">
            {t('home.pillars_eyebrow')}
          </p>
          <blockquote className="font-editorial italic text-xl md:text-3xl text-stone-800 leading-relaxed">
            {content.quote}
          </blockquote>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-pearl pt-6"
            >
              <p className="font-label text-caption tracking-[0.2em] uppercase text-stone-800 font-bold">
                {t(pillar.titleKey)}
              </p>
              <p className="font-body text-caption text-stone-600 mt-3 leading-relaxed">
                {t(pillar.bodyKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}