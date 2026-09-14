import { motion } from 'motion/react';
import { useData } from '../../contexts/DataContext';

export default function TestimonialWall21st() {
  const { content } = useData();

  if (!content.quote) return null;

  return (
    <section className="bg-bone py-20" aria-label="Testimonials">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-label text-xs tracking-[0.35em] uppercase text-gold mb-2">
            Client Stories
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-light text-stone-800 mb-12">
            Testimonials
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-champagne p-8 border border-pearl"
            >
              <p className="font-editorial italic text-xl text-stone-600 leading-relaxed">
                "{content.quote}"
              </p>
              <footer className="mt-6 font-label text-micro tracking-[0.25em] uppercase text-gold">
                — Atelier Riman
              </footer>
            </motion.blockquote>
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-champagne p-8 border border-pearl"
            >
              <p className="font-editorial italic text-xl text-stone-600 leading-relaxed">
                "The attention to detail and craftsmanship is unparalleled. Every garment tells a story of heritage and elegance."
              </p>
              <footer className="mt-6 font-label text-micro tracking-[0.25em] uppercase text-gold">
                — Khalid Al Meir
              </footer>
            </motion.blockquote>
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-champagne p-8 border border-pearl"
            >
              <p className="font-editorial italic text-xl text-stone-600 leading-relaxed">
                "Booking a private viewing was seamless. The team guided us through every step with grace and professionalism."
              </p>
              <footer className="mt-6 font-label text-micro tracking-[0.25em] uppercase text-gold">
                — Fatima Al Rashed
              </footer>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}