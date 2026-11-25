import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import KineticHeading from '../components/motion/KineticHeading';
import type { Product } from '../types';

interface Article {
  id: string;
  date: string;
  readMins: number;
  category: { en: string; ar: string };
  title: { en: string; ar: string };
  body: { en: string[]; ar: string[] };
  image: (products: Product[]) => string;
}

const FALLBACK_IMAGE = '/assets/rimanfashion_3678245315913995332_6730733643_1_2025-07-16.jpg';
const imageFrom = (predicate: (p: Product) => boolean) => (products: Product[]) =>
  products.find(predicate)?.images?.[0] || FALLBACK_IMAGE;

const articles: Article[] = [
  {
    id: 'fleur-eternelle',
    date: '2025-07-16',
    readMins: 3,
    category: { en: 'Atelier', ar: 'الأتيليه' },
    title: {
      en: 'Behind the Veil: Crafting the Fleur Éternelle Gown',
      ar: 'وراء الطرحة: صناعة فستان فلور إيتيرنيل',
    },
    body: {
      en: [
        'A garden in full bloom, rendered in silk. The Fleur Éternelle began as a single sketch of off-shoulder tulle and ended as sixteen studio photographs — each blossom traced by hand, each petal wired into three-dimensional silk.',
        'Our Sharjah atelier spent weeks placing ivory flowers across the skirt so the arrangement reads differently from every angle. The signature veil finishes the story: scattered florals that move with the bride, photographed in golden afternoon light.',
      ],
      ar: [
        'حديقة في أوج ازدهارها، مرسومة بالحرير. بدأت قصة فلور إيتيرنيل برسم واحد لتول عارٍ عن الكتف، وانتهت بست عشرة صورة استوديو — كل زهرة مطرزة يدويًا، وكل بتلة سلكية من الحرير ثلاثي الأبعاد.',
        'أمضى أتيليه الشارقة أسابيع في ترتيب الزهور العاجية عبر التنورة لتبدو التشكيلة مختلفة من كل زاوية. الطرحة المميزة تُتمّ الحكاية: أزهار متناثرة تتحرك مع العروس، مصوّرة في ضوء العصر الذهبي.',
      ],
    },
    image: imageFrom((p) => p.category === 'Bridal Gown'),
  },
  {
    id: 'silhouette-venue',
    date: '2025-06-02',
    readMins: 4,
    category: { en: 'Styling', ar: 'تنسيق' },
    title: {
      en: 'Choosing Your Silhouette Around the Venue',
      ar: 'اختيار القصّة على قياس المكان',
    },
    body: {
      en: [
        'A ballgown’s cathedral train is breathtaking in a grand hall — and unwieldy on a beach. Before choosing the dress, choose the day: the aisle width, the dance floor, the hour the light turns gold.',
        'For outdoor and beach ceremonies we steer brides toward column and A-line silhouettes in lighter tulle; for palace receptions, structure and volume reward the room. Mermaid cuts remain our most requested for evening galas, where movement matters more than grandeur.',
      ],
      ar: [
        'ذيل الكاتدرائية في فستان الأميرة يخطف الأنفاس في القاعات الفسيحة — لكنه يصبح غير عملي على الشاطئ. قبل اختيار الفستان، اختاري اليوم: عرض الممر، ساحة الرقص، والساعة التي يتحول فيها الضوء إلى ذهبي.',
        'للاحتفالات الخارجية والشاطئية نوجّه العرائس نحو القصّات المستقيمة وA-Line بالتول الأخفّ؛ أما حفلات القصور فتكافئ البنية والحجم. وتبقى قصّات حورية البحر الأكثر طلبًا لحفلات السهرة، حيث الحركة أهمّ من الفخامة.',
      ],
    },
    image: imageFrom((p) => p.category === 'Bridal Gown' && p.silhouette === 'A-Line'),
  },
  {
    id: 'couture-return',
    date: '2025-04-18',
    readMins: 3,
    category: { en: 'Fashion', ar: 'موضة' },
    title: {
      en: 'The Return of Couture Evening Wear',
      ar: 'عودة أزياء السهرة الراقية',
    },
    body: {
      en: [
        'Evening dressing is shedding its minimalism. Galas across the Gulf are answering bridal opulence with equal force — duchess satin, crystal dusting and the confident colour stories of emerald, amber and sage.',
        'Our couture evening line answers that appetite: gowns built with bridal construction — boned bodices, hand-finished seams — so a dress worn once carries the same architecture as a dress worn for a lifetime.',
      ],
      ar: [
        'تتخلى أزياء السهرة عن البساطة. حفلات الخليج الكبيرة تردّ على فخامة الزفاف بقوة مماثلة — ساتان الدوتشيس، الغبار الكريستالي، وحكايات ألوان جريئة: الزمرّدي والكهرماني والمريمية.',
        'خط الكوتور للسهرة يستجيب لهذا الشغف: فساتين مبنية بتقنيات فساتين الأعراس — أجسام مشدودة، ودرازات مُنتهية يدويًا — لتحمل فستان يُلبس مرة واحدة نفس هندسة فستان يُلبس مدى الحياة.',
      ],
    },
    image: imageFrom((p) => p.category === 'Evening Dress'),
  },
  {
    id: 'rent-heirloom',
    date: '2025-03-05',
    readMins: 2,
    category: { en: 'Modern Brides', ar: 'عرائس معاصرات' },
    title: {
      en: 'Rent, Keep, Repeat: Modern Brides on Heirloom Dressing',
      ar: 'استأجري، احتفظي، كرّري: العرائس المعاصرات وأزياء الإرث',
    },
    body: {
      en: [
        'A new generation of brides is treating couture the way they treat travel: a season of the gown, not a vault for it. Rental lets a bride wear archive pieces she would never store — and lets us restore and re-house every gown between fittings.',
        'Purchase remains the choice for the true heirloom: the gown photographed with the bride in twenty years, passed down with its veil. Either way, the atelier finishes every piece to the same standard.',
      ],
      ar: [
        'جيل جديد من العرائس يتعامل مع الكوتور كما يتعامل مع السفر: موسم من الفستان، لا خزانة له. الإيجار يتيح للعروس ارتداء قطع أرشيف ما كانت لتخزّنها أبدًا — ويتيح لنا ترميم كل فستان وإعادة تجهيزه بين المعاينات.',
        'أما الشراء فيبقى خيار القطعة الإرث الخالدة: الفستان الذي يُصور مع العروس بعد عشرين عامًا، وتُوَرَّث طرحته. وفي الحالتين، يُنهِي الأتيليه كل قطعة وفق المعيار نفسه.',
      ],
    },
    image: imageFrom((p) => p.productType === 'rent' || p.productType === 'both'),
  },
];

export default function JournalPage() {
  const { products } = useData();
  const { language, t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const lang = language === 'ar' ? 'ar' : 'en';

  const [featured, ...rest] = articles;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-GB', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  const featuredContent = (
    <>
      <div className="lg:col-span-7">
        <ScrollReveal>
          <div className="card-couture">
            <img
              src={featured.image(products)}
              loading="lazy"
              decoding="async"
              alt={featured.title[lang]}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
              className="w-full aspect-[4/5] object-cover object-[center_25%]"
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="lg:col-span-5 lg:ps-10 lg:pt-8">
        <ScrollReveal delay={0.12}>
          <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-dark mb-6">
            {t('journal.featured')} · {featured.category[lang]} · {formatDate(featured.date)}
          </p>
          <h2 className="font-heading text-4xl md:text-6xl normal-case leading-[1.12] text-stone-800 mb-8">
            {featured.title[lang]}
          </h2>
          <div className="max-w-xl">
            {featured.body[lang].map((para, i) => (
              <p key={i} className={`font-body text-stone-700 leading-loose mb-5 ${i === 0 ? 'text-lg' : ''}`}>
                {para}
              </p>
            ))}
          </div>
          <p className="font-label text-micro tracking-[0.2em] uppercase text-stone-500 mt-7">
            {featured.readMins} {t('journal.read_time')}
          </p>
        </ScrollReveal>
      </div>
    </>
  );

  return (
    <div id="journal-page" className="pt-24 min-h-screen bg-ivory">
      <header className="section-padding !py-20 md:!py-28 bg-ivory border-b border-stone-200">
        <div className="container mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 font-label text-micro tracking-[0.25em] uppercase text-stone-600 mb-10">
            <Link to="/" className="hover:text-terracotta-dark transition-colors duration-300">
              {t('nav.home')}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-stone-800 font-medium">{t('nav.journal')}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-y-8 items-end">
            <div className="lg:col-span-8">
              <KineticHeading
                as="h1"
                text={t('journal.title')}
                className="font-heading text-[clamp(3.25rem,7vw,6.75rem)] normal-case leading-[1.02] text-stone-800 pointer-events-none"
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="font-body text-lg text-stone-600 leading-loose max-w-md">
                {t('journal.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="section-padding !py-20 md:!py-28 bg-champagne border-b border-stone-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-5 mb-10">
            <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-dark shrink-0">
              {t('journal.featured')}
            </p>
            <span className="h-px flex-1 bg-stone-300" aria-hidden="true" />
          </div>

          <article className="grid lg:grid-cols-12 gap-y-12 gap-x-8 items-start">
            {featuredContent}
          </article>
        </div>
      </section>

      <section className="section-padding !py-20 md:!py-28 bg-pearl">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-5 mb-12">
            <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-dark shrink-0">
              {t('journal.latest')}
            </p>
            <span className="h-px flex-1 bg-stone-300" aria-hidden="true" />
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-20 lg:gap-x-16">
            {rest.map((article, idx) => {
              const isWideFeature = idx === rest.length - 1;
              const articleClass = isWideFeature
                ? 'md:col-span-2 md:grid md:grid-cols-2 md:gap-12 md:items-center'
                : '';
              const articleContent = (
                <>
                  <div className={isWideFeature ? '' : 'mb-7'}>
                    <div className="card-couture">
                      <img
                        src={article.image(products)}
                        alt={article.title[lang]}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                        className={`w-full object-cover ${isWideFeature ? 'aspect-[4/3]' : 'aspect-[4/5]'} object-[center_25%]`}
                      />
                    </div>
                  </div>

                  <div className={isWideFeature ? 'md:ps-4' : ''}>
                    <div className="flex items-baseline justify-between border-b border-stone-300 pb-4 mb-6">
                      <span
                        aria-hidden="true"
                        className="font-heading text-5xl md:text-6xl leading-none text-stone-300 select-none"
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-dark text-end">
                        {article.category[lang]} · {formatDate(article.date)}
                      </p>
                    </div>

                    <h2 className={`font-heading text-stone-800 normal-case leading-[1.16] mb-6 ${isWideFeature ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}`}>
                      {article.title[lang]}
                    </h2>

                    <div className="max-w-xl">
                      {article.body[lang].map((para, i) => (
                        <p key={i} className="font-body text-stone-700 leading-loose mb-4">
                          {para}
                        </p>
                      ))}
                    </div>

                    <p className="font-label text-micro tracking-[0.2em] uppercase text-stone-500 mt-6">
                      {article.readMins} {t('journal.read_time')}
                    </p>
                  </div>
                </>
              );

              if (prefersReducedMotion) {
                return (
                  <article key={article.id} className={articleClass}>
                    {articleContent}
                  </article>
                );
              }

              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={articleClass}
                >
                  {articleContent}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding !py-20 md:!py-24 bg-onyx text-bone">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-12 gap-y-10 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-heading text-4xl md:text-6xl normal-case leading-[1.1] text-bone mb-6">
              {t('journal.cta_heading')}
            </h2>
            <p className="font-body text-lg text-bone/70 leading-loose max-w-2xl">
              {t('journal.cta_body')}
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 flex flex-col sm:flex-row lg:justify-end items-start sm:items-center gap-5">
            <Link to="/appointment" className="btn-couture-ghost !text-bone">
              {t('journal.cta_primary')}
            </Link>
            <Link
              to="/style-quiz"
              className="inline-flex min-h-[52px] items-center justify-center border-b border-bone/30 px-2 font-label text-xs uppercase tracking-[0.25em] text-bone/80 transition-colors duration-300 hover:border-bone hover:text-bone"
            >
              {t('journal.cta_secondary')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
