import { motion, useReducedMotion } from 'motion/react';

export default function GoldThread({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={`h-px bg-terracotta/20 ${className}`} aria-hidden="true" />;
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-terracotta/60 to-transparent origin-center"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
