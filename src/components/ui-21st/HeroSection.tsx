import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import CalligraphicAccent from '../salon/CalligraphicAccent';
import KineticHeading from '../motion/KineticHeading';

const HERO_VIDEO = '/assets/rimanfashion_3panel_split.mp4';
const HERO_POSTER = '/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg';

function prefersReducedData() {
  if (typeof navigator === 'undefined') return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
}

export default function HeroSection21st() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const [videoError, setVideoError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (videoError || prefersReducedData()) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      if (!cancelled) setShowVideo(true);
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(start, { timeout: 4000 });
    } else {
      timeoutId = setTimeout(start, 2500);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [videoError]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const enableMotion = desktop && !reduced;
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[96svh] flex items-stretch bg-onyx overflow-hidden"
    >
      <motion.img
        className="absolute inset-0 w-full h-full object-cover object-[center_28%] ken-burns-slow"
        src={HERO_POSTER}
        alt={t('hero.alt')}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        style={enableMotion ? { scale: videoScale } : undefined}
      />
      {showVideo && !videoError && (
        <motion.video
          className="absolute inset-0 w-full h-full object-cover animate-fade-in"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onError={(e) => {
            const code = (e.currentTarget as HTMLVideoElement).error?.code;
            if (code === MediaError.MEDIA_ERR_ABORTED) return;
            setVideoError(true);
          }}
          ref={(el) => {
            if (!el) return;
            el.playbackRate = 0.8;
            if (el.paused) el.play().catch(() => {});
          }}
          style={enableMotion ? { scale: videoScale } : undefined}
        />
      )}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-onyx/20 to-onyx/30"
        aria-hidden="true"
        style={enableMotion ? { opacity: scrimOpacity } : undefined}
      />
      <CalligraphicAccent
        word="أناقة"
        className="top-[14%] end-[5%] text-[clamp(6rem,14vw,13rem)] opacity-15 pointer-events-none"
      />

      {/* Corner eyebrow + vertical tag */}
      <div className="absolute top-28 md:top-36 start-6 md:start-12 z-20 flex items-center gap-4">
        <span className="font-label text-[11px] tracking-[0.45em] uppercase text-bone/75">
          {t('hero.subtitle')}
        </span>
      </div>
      <div className="absolute top-28 md:top-36 end-6 md:end-12 z-20 hidden md:flex flex-col items-end gap-1">
        <span className="font-label text-[11px] tracking-[0.3em] uppercase text-terracotta-light">{t('hero.buy')}</span>
        <span className="font-label text-[11px] tracking-[0.3em] uppercase text-bone/60">{t('hero.rent')}</span>
        <span className="font-label text-[11px] tracking-[0.3em] uppercase text-bone/60">{t('hero.bespoke')}</span>
      </div>

      {/* Start-aligned headline block */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-28 md:pb-32">
        <motion.div
          style={enableMotion ? { y: headlineY, opacity: headlineOpacity } : undefined}
        >
          <KineticHeading
            as="h1"
            text={t('hero.headline')}
            emphasisChars={['&']}
            emphasisClassName="font-editorial italic text-terracotta-light text-[1.25em] leading-none"
            delay={0.3}
            className="font-heading text-bone leading-[0.95] text-[clamp(3rem,9vw,9rem)] max-w-5xl"
          />
          <div className="mt-10 md:mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/appointment"
              className="btn-couture-ghost !text-bone min-h-[52px]"
              aria-label={t('cta.viewing')}
            >
              {t('cta.viewing')}
            </Link>
            <span className="hidden sm:block h-px w-16 bg-bone/30" aria-hidden="true" />
          </div>
        </motion.div>
      </div>

      {/* Bottom edge: Since 2011 with rule */}
      <div className="absolute bottom-8 start-6 md:start-12 z-20 flex items-center gap-4">
        <span className="h-px w-12 bg-bone/40" aria-hidden="true" />
        <span className="font-label text-[11px] tracking-[0.25em] uppercase text-bone/60">
          {t('hero.since')}
        </span>
      </div>
      <span aria-hidden="true" className="hidden md:block absolute bottom-8 end-6 md:end-12 font-label text-[11px] tracking-[0.35em] uppercase text-bone/50">
        {t('hero.discover')}
      </span>
    </section>
  );
}