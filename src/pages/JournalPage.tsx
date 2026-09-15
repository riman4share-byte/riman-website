import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
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
  const lang = language === 'ar' ? 'ar' : 'en';

  const [featured, ...rest] = articles;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-GB', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  return (
    <div id="journal-page" className="pt-24 min-h-screen bg-ivory">
      <header className="section-padding !py-12 bg-ivory border-b border-stone-100">
        <div className="container mx-auto">
          <nav className="flex gap-2 text-xs tracking-widest uppercase text-stone-600 mb-4">
            <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">{t('nav.journal')}</span>
          </nav>
          <h1 className="font-heading text-4xl md:text-5xl text-stone-800 tracking-wider uppercase mb-4 leading-tight">
            {t('journal.title')}
          </h1>
          <p className="text-stone-600 font-body text-base tracking-wide max-w-2xl italic leading-relaxed">
            {t('journal.subtitle')}
          </p>
        </div>
      </header>

      <main className="section-padding !py-16">
        <div className="container mx-auto max-w-5xl">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <p className="text-micro tracking-[0.25em] uppercase text-gold font-bold mb-4">
              {t('journal.featured')} · {featured.category[lang]} · {formatDate(featured.date)}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-stone-800 tracking-wide uppercase mb-8 leading-snug">
              {featured.title[lang]}
            </h2>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="card-couture">
                <img
                  src={featured.image(products)}
                  alt={featured.title[lang]}
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              <div>
                {featured.body[lang].map((para, i) => (
                  <p key={i} className={`font-body text-stone-700 leading-relaxed mb-5 ${i === 0 ? 'text-lg first-letter:font-heading first-letter:text-4xl first-letter:text-gold-dark first-letter:me-1' : ''}`}>
                    {para}
                  </p>
                ))}
                <p className="text-micro tracking-[0.2em] uppercase text-stone-500 mt-6">{featured.readMins} {t('journal.read_time')}</p>
              </div>
            </div>
          </motion.article>

          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-14" />

          <p className="text-micro tracking-[0.2em] uppercase text-gold font-bold mb-8">{t('journal.latest')}</p>
          <div className="flex flex-col gap-14">
            {rest.map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid md:grid-cols-2 gap-10 items-center"
              >
                <div className={`card-couture ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img
                    src={article.image(products)}
                    alt={article.title[lang]}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                <div>
                  <p className="text-micro tracking-[0.25em] uppercase text-gold font-bold mb-3">
                    {article.category[lang]} · {formatDate(article.date)}
                  </p>
                  <h2 className="font-heading text-2xl md:text-3xl text-stone-800 tracking-wide uppercase mb-5 leading-snug">
                    {article.title[lang]}
                  </h2>
                  {article.body[lang].map((para, i) => (
                    <p key={i} className="font-body text-stone-700 leading-relaxed mb-4">{para}</p>
                  ))}
                  <p className="text-micro tracking-[0.2em] uppercase text-stone-500 mt-4">{article.readMins} {t('journal.read_time')}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
