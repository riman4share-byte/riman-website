import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, animate } from 'motion/react';
import { useFeature } from '../hooks/useFeature';

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

export default function ImmersiveUI() {
  const preloaderEnabled = useFeature('preloader');
  const customCursorEnabled = useFeature('customCursor');
  const prefersReducedMotion = usePrefersReducedMotion();
  const location = useLocation();
  const isFirstVisit = useRef(!sessionStorage.getItem('riman_preloader_shown'));
  const [loading, setLoading] = useState(() => {
    if (preloaderEnabled && !prefersReducedMotion && isFirstVisit.current && location.pathname === '/') return true;
    return false;
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorMode, setCursorMode] = useState<'default' | 'action' | 'heading'>('default');
  const [count, setCount] = useState(0);
  const mouseTrackingRef = useRef<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!loading) return;
    const controls = animate(0, 100, {
      duration: 1.7,
      ease: 'easeInOut',
      onUpdate: (v) => setCount(Math.round(v)),
    });
    const timer = setTimeout(() => {
      sessionStorage.setItem('riman_preloader_shown', '1');
      isFirstVisit.current = false;
      setLoading(false);
    }, 2100);
    return () => { controls.stop(); clearTimeout(timer); };
  }, [loading]);

  useEffect(() => {
    if (preloaderEnabled && !prefersReducedMotion && isFirstVisit.current && location.pathname === '/') {
      setLoading(true);
    }
  }, [location.pathname, preloaderEnabled, prefersReducedMotion]);

  // Throttled mouse tracking for custom cursor
  useEffect(() => {
    if (!customCursorEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseTrackingRef.current) {
        cancelAnimationFrame(mouseTrackingRef.current);
      }
      mouseTrackingRef.current = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('h1, h2, h3, .font-heading, [data-heading]')) {
        setCursorMode('heading');
      } else if (target.closest('a, button, [data-hover], input, select, textarea')) {
        setCursorMode('action');
      } else {
        setCursorMode('default');
      }
    };
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (mouseTrackingRef.current) cancelAnimationFrame(mouseTrackingRef.current);
    };
  }, [customCursorEnabled]);

  // Toggle custom cursor class on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (customCursorEnabled) {
      html.classList.add('custom-cursor-active');
      return () => html.classList.remove('custom-cursor-active');
    }
    html.classList.remove('custom-cursor-active');
  }, [customCursorEnabled]);

  return (
    <>
      {/* Scroll Progress Bar — disabled with prefers-reduced-motion */}
      {!prefersReducedMotion && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[1001] origin-left"
          style={{ scaleX }}
        />
      )}

      {/* Luxury Preloader — couture letter rise + counter + curtain exit */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            data-preloader
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[2000] bg-onyx text-ivory flex items-center justify-center"
          >
            <div className="overflow-hidden px-4">
              <h1 className="font-heading font-medium text-[19vw] md:text-[11vw] leading-none flex" aria-label="RIMAN">
                {['R', 'I', 'M', 'A', 'N'].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </div>
            <div className="absolute bottom-8 left-8 text-micro uppercase tracking-[0.35em] text-gold/60">
              Maison de Couture
            </div>
            <div className="absolute bottom-8 right-8 text-sm tabular-nums text-ivory">
              {String(count).padStart(2, '0')}<span className="text-ivory/40"> / 100</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Global Cursor */}
      {customCursorEnabled && (
        <>
          {/* Trail ring — follows with lag (skipped if reduced motion) */}
          {!prefersReducedMotion && (
            <motion.div
              className="fixed top-0 left-0 w-12 h-12 border border-gold/40 rounded-full pointer-events-none z-[9998]"
              animate={{
                x: mousePos.x - 24,
                y: mousePos.y - 24,
                scale: cursorMode === 'action' ? 1.4 : cursorMode === 'heading' ? 1.2 : 1,
                opacity: cursorMode === 'heading' ? 0.8 : 0.4,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 120, mass: 0.8 }}
            />
          )}

          {/* Main cursor image */}
          {prefersReducedMotion ? (
            /* No-animation fallback: plain CSS follow */
            <div
              className="fixed pointer-events-none z-[9999]"
              style={{ left: mousePos.x - 20, top: mousePos.y - 20 }}
            >
              <img
                src="/custom-cursor.png"
                alt=""
                draggable={false}
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] select-none"
              />
            </div>
          ) : (
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[9999]"
              animate={{
                x: mousePos.x - 20,
                y: mousePos.y - 20,
                scale: cursorMode === 'action' ? 1.35 : cursorMode === 'heading' ? 1.15 : 1,
                rotate: cursorMode === 'heading' ? [0, 8, -8, 0] : 0,
              }}
              transition={{
                x: { type: 'spring', damping: 30, stiffness: 200, mass: 0.3 },
                y: { type: 'spring', damping: 30, stiffness: 200, mass: 0.3 },
                scale: { type: 'spring', damping: 20, stiffness: 180, mass: 0.4 },
                rotate: { duration: 0.6, ease: 'easeInOut' },
              }}
            >
              <img
                src="/custom-cursor.png"
                alt=""
                draggable={false}
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] select-none"
                style={{ imageRendering: 'auto' }}
              />
            </motion.div>
          )}

          {/* Floating sparkle particles on heading hover (skipped if reduced motion) */}
          {!prefersReducedMotion && cursorMode === 'heading' && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="fixed pointer-events-none z-[9997]"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    x: mousePos.x - 2 + (i - 1) * 18,
                    y: mousePos.y - 2 - 20 - i * 10,
                    opacity: [0, 0.9, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: 'easeOut',
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-gold/80" />
                </motion.div>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}
