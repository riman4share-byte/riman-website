import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import CalligraphicAccent from '../salon/CalligraphicAccent';
import KineticHeading from '../motion/KineticHeading';

const HERO_VIDEO = '/assets/rimanfashion_3panel_split.mp4';
const HERO_POSTER = '/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg';

export default function HeroSection21st() {
  const { t, language } = useLanguage();
  const [videoError, setVideoError] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-onyx overflow-hidden pt-[clamp(7rem,22vh,14rem)]">
      {!videoError ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
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
      ) : (
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={HERO_POSTER}
          alt=""
          aria-hidden="true"
          loading="eager"
        />
      )}
      <div className="absolute inset-0 bg-onyx/60" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" aria-hidden="true" />
      <CalligraphicAccent
        word="أناقة"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(6rem,16vw,14rem)] opacity-25 pointer-events-none"
      />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
        <p className="font-label text-xs md:text-sm tracking-[0.35em] uppercase text-white mb-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
          {t('hero.subtitle')}
        </p>
        <p className="font-label text-xs tracking-[0.25em] uppercase text-bone/90 mb-6 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
          {t('cat.bridal')} · {t('cat.evening')} · {t('cat.rentals')}
        </p>
        <KineticHeading
          as="h1"
          text={t('hero.title')}
          emphasisChars={['&']}
          className="font-heading text-white font-light leading-[1.02] text-[clamp(2.5rem,8vw,7rem)] mb-6 [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]"
        />
        <p className="font-body text-base md:text-lg text-white leading-relaxed mb-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
          {language === 'ar' ? 'شراء · إيجار · تفصيل حسب الطلب — تجربة خاصة في الشارقة' : 'Buy · Rent · Bespoke — private fittings in Sharjah'}
        </p>
        <p className="font-label text-xs tracking-[0.2em] uppercase text-white/90 mb-10 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
          {t('invitation.contact_line')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <Link
            to="/appointment"
            className="btn-couture-ghost"
            aria-label={t('cta.viewing')}
          >
            {t('cta.viewing')}
          </Link>
          <Link
            to="/search"
            className="btn-couture-ghost"
            aria-label={t('cta.explore')}
          >
            {t('cta.explore')}
          </Link>
        </div>
        <p className="mt-8 font-label text-xs tracking-[0.2em] uppercase text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
          {language === 'ar' ? '★★★★★ أكثر من 200 عروس · fittings خاصة يومياً' : '★★★★★ 200+ brides · Private fittings daily'}
        </p>
      </div>
      <span aria-hidden="true" className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 font-label text-xs tracking-[0.3em] uppercase text-white/80">
        {t('hero.discover')}
      </span>
    </section>
  );
}