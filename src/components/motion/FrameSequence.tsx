import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

type Caption = { text: string; at: number };

const FRAME_COUNT = 131;
const DESKTOP_DIR = '/media/frames/frame_%04d.jpg';
const MOBILE_DIR = '/media/frames-mobile/frame_%04d.jpg';
const POSTER = '/assets/rimanfashion_3669200303742063641_227867687_1_2025-07-04.jpg';

function frameUrl(dir: string, i: number) {
  return dir.replace('%04d', String(i + 1).padStart(4, '0'));
}

function dataSaver() {
  const conn = (navigator as any)?.connection;
  return Boolean(conn?.saveData) || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g';
}

/**
 * Pinned canvas scroll-scrub. 131 frames @8fps, 720px desktop / 360px mobile.
 * First frame paints instantly; the rest preload in idle time. DPR-aware.
 * Static poster fallback: mobile, reduced-motion, save-data, 2G.
 */
export default function FrameSequence({ captions = [] }: { captions?: Caption[] }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [fallback, setFallback] = useState(false);
  const [progress, setProgress] = useState(0);
  const dir = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches ? MOBILE_DIR : DESKTOP_DIR;

  useEffect(() => {
    if (reduced || dataSaver()) { setFallback(true); }
  }, [reduced]);

  useEffect(() => {
    if (fallback) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setFallback(true); return; }

    // DPR-aware sizing
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw(framesRef.current[currentRef.current]);
    };
    let currentRef = { current: 0 };
    const dirRef = { current: dir };
    dirRef.current = dir;

    const draw = (img?: HTMLImageElement) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    // First frame instantly
    const first = new Image();
    first.src = frameUrl(dirRef.current, 0);
    first.onload = () => draw(first);
    framesRef.current[0] = first;

    // Rest preloaded in idle time, progressively
    let idle = 0;
    const preload = (i: number) => {
      if (i >= FRAME_COUNT) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(dirRef.current, i);
      framesRef.current[i] = img;
      if (i === currentRef.current) draw(img);
      const step = () => preload(i + 1);
      const w = window as any;
      if (w.requestIdleCallback) idle = w.requestIdleCallback(step, { timeout: 1000 });
      else setTimeout(step, 16);
    };
    preload(1);

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / (total || 1)));
      setProgress(p);
      const idx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
      if (idx !== currentRef.current) {
        currentRef.current = idx;
        const img = framesRef.current[idx];
        if (img?.complete) draw(img);
      }
    };
    let raf = 0;
    const onScrollRaf = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; onScroll(); }); };

    resize();
    window.addEventListener('scroll', onScrollRaf, { passive: true });
    window.addEventListener('resize', resize);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScrollRaf);
      window.removeEventListener('resize', resize);
      const w = window as any;
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle);
    };
  }, [fallback]);

  if (fallback) {
    return (
      <section className="relative bg-onyx overflow-hidden">
        <img src={POSTER} alt="" aria-hidden="true" className="w-full h-[72vh] md:h-[82vh] object-cover object-center opacity-90" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-onyx/40" aria-hidden="true" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
          {captions.map((c, i) => (
            <p
              key={i}
              className={
                i === 1
                  ? 'font-heading text-bone text-3xl md:text-5xl font-light leading-tight max-w-3xl [text-shadow:0_2px_18px_rgba(22,21,19,0.6)]'
                  : 'font-editorial italic text-bone/90 text-xl md:text-2xl leading-relaxed max-w-2xl [text-shadow:0_2px_14px_rgba(22,21,19,0.6)]'
              }
            >
              {c.text}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-onyx" style={{ height: '260vh' }} aria-label="Cinematic gown sequence">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-onyx/30" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center pointer-events-none">
          {captions.map((c, i) => {
            const visible = Math.abs(progress - c.at) < 0.14;
            return (
              <p
                key={i}
                className={
                  i === 1
                    ? 'absolute font-heading text-bone text-3xl md:text-5xl font-light leading-tight max-w-3xl transition-all duration-700 [text-shadow:0_2px_18px_rgba(22,21,19,0.6)]'
                    : 'absolute font-editorial italic text-bone/90 text-2xl md:text-[2rem] leading-relaxed max-w-3xl transition-all duration-700 [text-shadow:0_2px_14px_rgba(22,21,19,0.6)]'
                }
                style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)' }}
              >
                {c.text}
              </p>
            );
          })}
        </div>
        <div className="absolute bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center gap-3">
          <span className="h-px w-10 bg-bone/40" aria-hidden="true" />
          <span className="font-label text-[10px] tracking-[0.4em] uppercase text-bone/70">Scroll</span>
          <span className="h-px w-10 bg-bone/40" aria-hidden="true" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-bone/10" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 h-[2px] bg-terracotta" style={{ width: `${progress * 100}%` }} aria-hidden="true" />
      </div>
    </section>
  );
}
