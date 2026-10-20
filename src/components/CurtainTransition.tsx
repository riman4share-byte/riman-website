import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Logo from './Logo';

/**
 * Ivory curtain wipe with the logo mark.
 *
 * Navigation is the most frequent action on the site, so the wipe is capped at
 * 280ms (under the 300ms UI budget) and runs in a layout effect: the curtain is
 * committed in the same frame as the route change, before the browser can paint
 * the destination page underneath it. The old useEffect version mounted after
 * paint, so the new page could flash, get covered, then reveal.
 *
 * Reduced motion: no curtain at all.
 */
export default function CurtainTransition() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const [curtain, setCurtain] = useState(false);

  useLayoutEffect(() => {
    if (reduced) return;
    setCurtain(true);
    const t = setTimeout(() => setCurtain(false), 320);
    return () => clearTimeout(t);
  }, [location.pathname, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {curtain && (
        <motion.div
          key={location.pathname}
          className="fixed inset-0 z-[400] bg-ivory flex items-center justify-center pointer-events-none"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'top' }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Logo variant="gold" className="w-16" showText={false} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
