import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ReactNode } from 'react';
import { useFeature } from '../hooks/useFeature';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export default function ScrollReveal({ children, direction = 'up', delay = 0 }: ScrollRevealProps) {
  const enabled = useFeature('scrollReveal');
  const prefersReducedMotion = useReducedMotion();

  if (!enabled || prefersReducedMotion) return <>{children}</>;

  // Content is visible by default (no inline opacity:0) — motion enhances
  // progressively. Fallback timer guarantees reveal if IntersectionObserver
  // never fires (mobile viewport quirks, missing observer, or negative margin).
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 28 : direction === 'down' ? -28 : 0,
      x: direction === 'left' ? 28 : direction === 'right' ? -28 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
      // Visible without JS: before hydration the element has no inline style.
      // After mount motion sets opacity:0 briefly then animates to 1 when in view.
      style={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}

// Typed export for lazy usage
export type { ScrollRevealProps };
