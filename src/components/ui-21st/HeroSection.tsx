import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import CalligraphicAccent from '../salon/CalligraphicAccent';
import KineticHeading from '../motion/KineticHeading';
import MaskReveal from '../motion/MaskReveal';

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
  const { t, language } = useLanguage();
  const [videoError, setVideoError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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

  return (
    <section id="hero" className="relative min-h-[92svh] flex items-center justify-center bg-onyx overflow-hidden">
      {/* Near-full-bleed gown: light scrim only, the dress is the hero */}
      <img
        className="absolute inset-0 w-full h-full object-cover object-[center_28%] ken-burns-slow"
        src={HERO_POSTER}
        alt={language === 'ar' ? 'فستان سهرة لامع من ريمان للأزياء في الشارقة' : 'Lamé evening gown from the Riman atelier in Sharjah'}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      {showVideo && !videoError && (
        <video
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
        />
      )}
      {/* Minimal overlay — bottom gradient for legibility only */}
      <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/15 to-onyx/20" aria-hidden="true" />
      <CalligraphicAccent
        word="أناقة"
        className="top-[18%] end-[6%] text-[clamp(5rem,12vw,11rem)] opacity-20 pointer-events-none"
      />

      {/*
        Centred editorial composition.

        Was bottom-left aligned. The copy is now optically centred both ways so
        the headline sits on the gown's centre line rather than fighting the
        left gutter.

        Vertical management is explicit, because two things collide with a
        centred block: the fixed header above, and the "discover" scroll cue
        below.
          - pt-* reserves the header (h-20 / md:h-24). The old bottom-anchored
            layout had no top clearance, so on a short viewport with a tall
            headline the eyebrow and first line rode up underneath the bar —
            measured overlapping at 1440x900 and 1280x720.
          - pb-* reserves the scroll cue at bottom-8, so the CTA can never sit
            on top of it.
        min-h is only a floor, so the section grows rather than clipping.
      */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-24 md:pb-28 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="font-label text-[11px] md:text-xs tracking-[0.4em] uppercase text-bone/85 mb-6 [text-shadow:0_1px_10px_rgba(22,21,19,0.7)]">
            <MaskReveal delay={0.05}>{t('hero.subtitle')}</MaskReveal>
          </p>
          <KineticHeading
            as="h1"
            text={t('hero.headline')}
            emphasisChars={['&']}
            delay={0.3}
            className="font-heading text-bone font-light leading-[1.04] text-[clamp(2.4rem,6vw,5.5rem)] mb-8 [text-shadow:0_2px_28px_rgba(22,21,19,0.55)]"
          />
          <p className="font-label text-[11px] tracking-[0.3em] uppercase text-terracotta-light mb-10 [text-shadow:0_1px_10px_rgba(22,21,19,0.7)]">
            <MaskReveal delay={0.5}>{language === 'ar' ? 'شراء · إيجار · تفصيل حسب الطلب' : 'Buy · Rent · Bespoke'}</MaskReveal>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              to="/appointment"
              className="btn-couture-ghost !text-bone min-h-[52px]"
              aria-label={t('cta.viewing')}
            >
              {t('cta.viewing')}
            </Link>
            <span className="hidden sm:block h-px w-16 bg-bone/30" aria-hidden="true" />
            <span className="hidden sm:block font-label text-[11px] tracking-[0.25em] uppercase text-bone/60">
              {language === 'ar' ? 'منذ ٢٠١١ · الشارقة' : 'Since 2011 · Sharjah'}
            </span>
          </div>
        </div>
      </div>
      <span aria-hidden="true" className="hidden md:block absolute bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 font-label text-[11px] tracking-[0.35em] uppercase text-bone/60">
        {t('hero.discover')}
      </span>
    </section>
  );
}
