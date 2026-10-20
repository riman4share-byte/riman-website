import { motion } from 'motion/react';
import { Sparkles, Heart, Anchor } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  // Emphasis is marked per language rather than by word index: `.split(' ')[2]`
  // silently dropped the italic in Arabic (a two-word title) and would
  // italicise an arbitrary word wherever word order differs.
  const heroTitle = t('about.hero_title');
  const heroEmphasis = t('about.hero_title_italic');
  const emphasisAt = heroEmphasis ? heroTitle.indexOf(heroEmphasis) : -1;
  
  return (
    <div className="pt-24 bg-ivory min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-onyx">
        <div className="absolute inset-0 z-0">
          <video
            src="/output-1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover brightness-[0.75]"
            poster="/assets/rimanfashion_3542687554351211237_227867687_1_2025-01-10.jpg"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-micro text-white/70 uppercase tracking-[0.5em] mb-6 block"
          >
            {t('about.hero_subtitle')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-6xl md:text-8xl text-white tracking-tighter mb-8"
          >
            {emphasisAt === -1 ? heroTitle : (
              <>
                {heroTitle.slice(0, emphasisAt)}
                <span className="italic font-serif">{heroEmphasis}</span>
                {heroTitle.slice(emphasisAt + heroEmphasis.length)}
              </>
            )}
          </motion.h1>
          <div className="w-px h-24 bg-terracotta/50 mx-auto" />
        </div>
      </section>

      {/* Narrative Section */}
      <section className="section-padding container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-10"
          >
            <h2 className="font-heading text-4xl text-stone-800 leading-tight">
              {t('about.title')}
            </h2>
            <div className="space-y-6 font-body text-stone-600 leading-relaxed text-sm lg:text-base">
              <p>
                {t('footer.about')}
              </p>
              <p>
                {t('about.narrative_1')}
              </p>
              <p>
                {t('about.narrative_2')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <img
              src="/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg"
              alt="Couture Details"
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section className="bg-stone-900 py-32 text-ivory overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 border border-ivory/20 rounded-full" />
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] border border-ivory/20 rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-heading text-4xl tracking-widest uppercase mb-4 text-white">{t('about.pillars')}</h2>
            <div className="w-20 h-px bg-terracotta mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <Pillar 
              icon={Sparkles} 
              title={t('about.pillar_1_title')}
              desc={t('about.pillar_1_desc')}
            />
            <Pillar 
              icon={Anchor} 
              title={t('about.pillar_2_title')}
              desc={t('about.pillar_2_desc')}
            />
            <Pillar 
              icon={Heart} 
              title={t('about.pillar_3_title')}
              desc={t('about.pillar_3_desc')}
            />
          </div>
        </div>
      </section>

      {/* Aesthetic Mosaic */}
      <section className="py-32 bg-ivory">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <img src="/assets/rimanfashion_3542687554351211237_227867687_2_2025-01-10.jpg" className="w-full aspect-square object-cover" alt="Riman atelier beadwork detail" loading="lazy" />
            <div className="bg-ivory flex flex-col justify-center p-8 text-center border border-stone-50">
               <h4 className="font-heading text-3xl text-terracotta-dark mb-2">{t('about.stat_beads_label')}</h4>
                <p className="text-micro text-stone-600 uppercase tracking-widest">{t('about.stat_beads')}</p>
            </div>
            <img src="/assets/rimanfashion_3638158883472325906_1739454936_2_2025-05-22.jpg" className="w-full aspect-square object-cover" alt="Riman couture runway collection" loading="lazy" />
            <div className="bg-stone-900 text-ivory flex flex-col justify-center p-8 text-center">
               <h4 className="font-heading text-3xl text-terracotta-dark mb-2">{t('about.stat_runways_label')}</h4>
                <p className="text-micro text-ivory/40 uppercase tracking-widest">{t('about.stat_runways')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Pillar({ icon: Icon, title, desc }: any) {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 rounded-full border border-stone-700 flex items-center justify-center mx-auto mb-8 group-hover:border-terracotta group-hover:bg-terracotta/5 transition duration-500">
        <Icon className="w-6 h-6 text-terracotta-dark" />
      </div>
      <h3 className="font-heading text-xl mb-4 tracking-widest uppercase">{title}</h3>
      <p className="font-body text-xs text-ivory leading-relaxed uppercase tracking-wider">{desc}</p>
    </div>
  );
}
