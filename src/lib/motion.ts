/**
 * Riman motion system — single source of truth.
 * Easing: cubic-bezier(0.22, 1, 0.36, 1) ("expensive"), 0.8–1.4s, transform/opacity only.
 * Reduced-motion: caller must branch via useReducedMotion() — this file documents the tokens.
 */

export const EASE_COUTURE = [0.22, 1, 0.36, 1] as const;
export const DUR = { micro: 0.3, swift: 0.5, couture: 0.8, slow: 1.2 } as const;

export const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.couture, delay, ease: EASE_COUTURE as unknown as string } },
});

// Gold thread: SVG path draws via strokeDashoffset (framer motion pathLength).
// Usage: <motion.path d="..." style={{ pathLength }} /> with useScroll or whileInView.
export const goldThreadTransition = { duration: 1.4, ease: EASE_COUTURE };
