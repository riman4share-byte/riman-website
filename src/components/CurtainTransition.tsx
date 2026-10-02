import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Logo from './Logo';

/**
 * Ivory curtain wipe on route change (~600ms) with the logo mark.
 * Reduced motion: no curtain at all.
 */
export default function CurtainTransition() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const [curtain, setCurtain] = useState(false);

  useEffect(() => {
    if (reduced) return;
    setCurtain(true);
    const t = setTimeout(() => setCurtain(false), 650);
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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'top' }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Logo variant="gold" className="w-16" showText={false} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
