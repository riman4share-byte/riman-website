import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
 * GSAP ScrollTrigger owns the pin and scrub; the frame/image logic is unchanged.
 * Static poster fallback: mobile, reduced-motion, save-data, 2G.
 */
export default function FrameSequence({ captions = [] }: { captions?: Caption[] }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const activeRef = useRef(-1);
  const captionsRef = useRef(captions);
  const renderRef = useRef<(progress: number) => void>(() => {});
  const [fallback, setFallback] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dir =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
      ? MOBILE_DIR
      : DESKTOP_DIR;

  useEffect(() => {
    captionsRef.current = captions;
  }, [captions]);

  useEffect(() => {
    if (reduced || dataSaver()) {
      setFallback(true);
    }
  }, [reduced]);

  useEffect(() => {
    if (fallback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setFallback(true);
      return;
    }

    // DPR-aware sizing
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const draw = (img?: HTMLImageElement) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw(framesRef.current[frameIndexRef.current]);
    };

    // First frame instantly
    const first = new Image();
    first.src = frameUrl(dir, 0);
    first.onload = () => draw(first);
    framesRef.current[0] = first;

    // Rest preloaded in idle time, progressively
    let idle = 0;
    const preload = (i: number) => {
      if (i >= FRAME_COUNT) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(dir, i);
      framesRef.current[i] = img;
      if (i === frameIndexRef.current) draw(img);
      const step = () => preload(i + 1);
      const w = window as any;
      if (w.requestIdleCallback) idle = w.requestIdleCallback(step, { timeout: 1000 });
      else setTimeout(step, 16);
    };
    preload(1);

    // ScrollTrigger calls this with the eased 0..1 progress.
    renderRef.current = (progress: number) => {
      const next = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))));
      if (next !== frameIndexRef.current) {
        frameIndexRef.current = next;
        const img = framesRef.current[next];
        if (img?.complete) draw(img);
      }

      const caps = captionsRef.current;
      let active = -1;
      for (let i = 0; i < caps.length; i += 1) {
        if (Math.abs(progress - caps[i].at) < 0.14) {
          active = i;
          break;
        }
      }
      if (active !== activeRef.current) {
        activeRef.current = active;
        setActiveIndex(active);
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      renderRef.current = () => {};
      window.removeEventListener('resize', resize);
      const w = window as any;
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle);
    };
  }, [fallback, dir]);

  useGSAP(
    () => {
      if (fallback) return;
      const section = sectionRef.current;
      if (!section) return;

      const state = { progress: 0 };
      const tween = gsap.to(state, {
        progress: 1,
        ease: 'none',
        onUpdate: () => renderRef.current(state.progress),
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=200%',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [fallback] },
  );

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
    <section
      ref={sectionRef}
      className="relative h-screen bg-onyx overflow-hidden"
      aria-label="Cinematic gown sequence"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-onyx/30" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center pointer-events-none">
        {captions.map((c, i) => {
          const visible = i === activeIndex;
          return (
            <p
              key={i}
              className={
                i === 1
                  ? 'absolute font-heading text-bone text-3xl md:text-5xl font-light leading-tight max-w-3xl transition-[opacity,transform] duration-700 [text-shadow:0_2px_18px_rgba(22,21,19,0.6)]'
                  : 'absolute font-editorial italic text-bone/90 text-2xl md:text-[2rem] leading-relaxed max-w-3xl transition-[opacity,transform] duration-700 [text-shadow:0_2px_14px_rgba(22,21,19,0.6)]'
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
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta origin-left rtl:origin-right scale-x-0"
        aria-hidden="true"
      />
    </section>
  );
}
