import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { fetchAllReviews, type Review } from '../../services/reviews';
import { cn } from '../../lib/utils';

const PILLARS = [
  { titleKey: 'home.pillar_fitting_title', bodyKey: 'home.pillar_fitting_body' },
  { titleKey: 'home.pillar_hire_title', bodyKey: 'home.pillar_hire_body' },
  { titleKey: 'home.pillar_care_title', bodyKey: 'home.pillar_care_body' },
];

export default function TestimonialWall21st() {
  const { t } = useLanguage();
  const { content } = useData();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let active = true;
    fetchAllReviews()
      .then((all) => {
        if (active) setReviews(all.filter((r) => r.status === 'approved' && r.comment?.trim()));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const average = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const featured = reviews.slice(0, 3);
  const countLabel = reviews.length === 1 ? t('product.review_count_singular') : t('product.review_count');

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

        {featured.length > 0 && (
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="flex flex-col items-center gap-3 mb-10">
              <p className="font-label text-caption tracking-[0.35em] uppercase text-terracotta-dark">
                {t('home.reviews_heading')}
              </p>
              <div
                className="flex items-center gap-2"
                role="img"
                aria-label={`${average.toFixed(1)} / 5 — ${reviews.length} ${countLabel}`}
              >
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn('w-4 h-4', star <= Math.round(average) ? 'text-terracotta-dark fill-terracotta' : 'text-stone-200')}
                    />
                  ))}
                </span>
                <span className="font-label text-caption tracking-[0.25em] uppercase text-stone-600">
                  {average.toFixed(1)} · {reviews.length} {countLabel}
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((review, i) => (
                <motion.figure
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-pearl pt-6"
                >
                  <span className="flex items-center gap-0.5 mb-3" role="img" aria-label={`${review.rating} / 5`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn('w-3.5 h-3.5', star <= review.rating ? 'text-terracotta-dark fill-terracotta' : 'text-stone-200')}
                      />
                    ))}
                  </span>
                  <blockquote className="font-editorial italic text-stone-700 leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 font-label text-caption tracking-[0.2em] uppercase text-stone-600">
                    {review.name}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}