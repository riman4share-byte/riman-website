import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function CallToAction21st() {
  return (
    <section className="bg-champagne py-20" aria-label="Call to action">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-3xl md:text-5xl font-light text-stone-800 mb-4">Ready to begin?</h2>
          <p className="font-body text-stone-600 max-w-xl mx-auto mb-8">Schedule a private viewing at our Sharjah atelier.</p>
          <Link to="/appointment" className="btn-luxury">Book a Fitting</Link>
        </motion.div>
      </div>
    </section>
  );
}