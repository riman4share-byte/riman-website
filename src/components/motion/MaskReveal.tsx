import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

export default function MaskReveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <span className={`inline-block overflow-hidden ${className}`} aria-hidden="true">
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as any }}
      >
        {children}
      </motion.span>
    </span>
  );
}
