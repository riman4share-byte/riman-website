import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
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
  const [cursorHovered, setCursorHovered] = useState(false);
  const mouseTrackingRef = useRef<number>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!loading) return;
    // Video is exactly 8.0 seconds long (from ffprobe duration)
    // We want the curtain to start lifting right at the end
    const timer = setTimeout(() => {
      sessionStorage.setItem('riman_preloader_shown', '1');
      isFirstVisit.current = false;
      setLoading(false);
    }, 8000);
    return () => { clearTimeout(timer); };
  }, [loading]);

  useEffect(() => {
    if (preloaderEnabled && !prefersReducedMotion && isFirstVisit.current && location.pathname === '/') {
      setLoading(true);
    }
  }, [location.pathname, preloaderEnabled, prefersReducedMotion]);

  // Throttled mouse tracking for custom cursor
  useEffect(() => {
    if (!customCursorEnabled || prefersReducedMotion) return;

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
      setCursorHovered(!!target.closest('a, button, [data-hover]'));
    };
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (mouseTrackingRef.current) cancelAnimationFrame(mouseTrackingRef.current);
    };
  }, [customCursorEnabled, prefersReducedMotion]);

  // Toggle custom cursor class on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (customCursorEnabled && !prefersReducedMotion) {
      html.classList.add('custom-cursor-active');
      return () => html.classList.remove('custom-cursor-active');
    }
    html.classList.remove('custom-cursor-active');
  }, [customCursorEnabled, prefersReducedMotion]);

  return (
    <>
      {/* Scroll Progress Bar — disabled with prefers-reduced-motion */}
      {!prefersReducedMotion && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[1001] origin-left"
          style={{ scaleX }}
        />
      )}

      {/* Luxury Preloader — video intro followed by normal app */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            data-preloader
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[2000] bg-onyx text-ivory flex items-center justify-center p-4 md:p-12 overflow-hidden"
          >
            {/* Dark curtain that rises at the end */}
            <motion.div
              className="absolute inset-0 bg-onyx z-0 pointer-events-none"
              exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
            />
            <div className="relative w-[512px] max-w-full aspect-video z-10">
              <video
                src="/output-1.mp4"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
                onEnded={() => {
                  // Fallback in case the timer is out of sync or misses
                  if (loading) {
                    sessionStorage.setItem('riman_preloader_shown', '1');
                    isFirstVisit.current = false;
                    setLoading(false);
                  }
                }}
              />
            </div>
            {/* Remove the manual skip text — keeping it clean like an ident */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Global Cursor — only on desktop, when enabled, and not prefers-reduced-motion */}
      {customCursorEnabled && !prefersReducedMotion && (
        <>
          <motion.div
            className="hidden lg:block fixed top-0 left-0 w-8 h-8 border border-gold/60 rounded-full pointer-events-none z-[9999] mix-blend-difference"
            animate={{
              x: mousePos.x - 16,
              y: mousePos.y - 16,
              scale: cursorHovered ? 1.8 : 1,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 150, mass: 0.5 }}
          />
          <motion.div
            className="hidden lg:block fixed top-0 left-0 w-1.5 h-1.5 bg-gold rounded-full pointer-events-none z-[9999]"
            animate={{
              x: mousePos.x - 3,
              y: mousePos.y - 3,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 250, mass: 0.1 }}
          />
        </>
      )}
    </>
  );
}
