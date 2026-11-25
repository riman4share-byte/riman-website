import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronRight, RefreshCw, ArrowLeft, Eye, CheckCircle2, CalendarCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { products } from '../data/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import KineticHeading from '../components/motion/KineticHeading';

type Answers = Record<string, string>;

function getRecommendations(answers: Answers): Product[] {
  let list = [...products];

  // Filter by silhouette preference
  if (answers.silhouette) {
    const sil = answers.silhouette.toLowerCase();
    if (sil.includes('ballgown') || sil.includes('مهيب')) {
      list = list.filter(p => p.silhouette?.toLowerCase().includes('ballgown') || p.style.some(s => s.toLowerCase().includes('ball gown')));
    } else if (sil.includes('mermaid') || sil.includes('حورية')) {
      list = list.filter(p => p.silhouette?.toLowerCase().includes('mermaid') || p.style.some(s => s.toLowerCase().includes('mermaid')));
    } else if (sil.includes('a-line') || sil.includes('أثري')) {
      list = list.filter(p => p.silhouette?.toLowerCase().includes('a-line') || p.style.some(s => s.toLowerCase().includes('a-line')));
    } else if (sil.includes('slip') || sil.includes('عصري')) {
      list = list.filter(p => p.style.some(s => s.toLowerCase().includes('modern') || s.toLowerCase().includes('minimalist')));
    }
  }

  // Filter by fabric preference
  if (answers.fabric) {
    const fab = answers.fabric.toLowerCase();
    if (fab.includes('lace') || fab.includes('دانتيل')) {
      list = list.filter(p => p.fabric?.toLowerCase().includes('lace'));
    } else if (fab.includes('silk') || fab.includes('ميكادو')) {
      list = list.filter(p => p.fabric?.toLowerCase().includes('silk') || p.fabric?.toLowerCase().includes('mikado'));
    } else if (fab.includes('chiffon') || fab.includes('تويل')) {
      list = list.filter(p => p.fabric?.toLowerCase().includes('chiffon') || p.fabric?.toLowerCase().includes('tulle'));
    } else if (fab.includes('satin') || fab.includes('ساتان')) {
      list = list.filter(p => p.fabric?.toLowerCase().includes('satin'));
    }
  }

  // Filter by mood/style preference
  if (answers.mood) {
    const mood = answers.mood.toLowerCase();
    if (mood.includes('heritage') || mood.includes('تراث')) {
      list = list.filter(p => p.style.some(s => s.toLowerCase().includes('classic') || s.toLowerCase().includes('royal')));
    } else if (mood.includes('avant-garde') || mood.includes('طليع')) {
      list = list.filter(p => p.style.some(s => s.toLowerCase().includes('modern') || s.toLowerCase().includes('bold')));
    } else if (mood.includes('romantic') || mood.includes('رومانسية')) {
      list = list.filter(p => p.style.some(s => s.toLowerCase().includes('romantic') || s.toLowerCase().includes('ethereal')));
    } else if (mood.includes('minimalism') || mood.includes('بساطة')) {
      list = list.filter(p => p.style.some(s => s.toLowerCase().includes('minimalist') || s.toLowerCase().includes('simple')));
    }
  }

  // Filter by venue (bridal vs evening)
  if (answers.venue) {
    const venue = answers.venue.toLowerCase();
    if (venue.includes('ballroom') || venue.includes('قاعة') || venue.includes('villa') || venue.includes('فيلا')) {
      list = list.filter(p => p.category === 'Bridal Gown');
    } else if (venue.includes('desert') || venue.includes('صحراوية') || venue.includes('terrace') || venue.includes('تراس')) {
      list = list.filter(p => p.category === 'Evening Dress' || p.category === 'Bridal Gown');
    }
  }

  // Fallback: if no results, return featured items
  if (list.length === 0) {
    list = products.filter(p => p.isFeatured).slice(0, 4);
  }

  return list.slice(0, 4);
}

export default function StyleQuiz() {
  const { t, isRtl } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);

  const questions = [
    {
      id: 'venue',
      question: t('quiz.q1'),
      options: [t('quiz.q1_opt1'), t('quiz.q1_opt2'), t('quiz.q1_opt3'), t('quiz.q1_opt4')]
    },
    {
      id: 'silhouette',
      question: t('quiz.q2'),
      options: [t('quiz.q2_opt1'), t('quiz.q2_opt2'), t('quiz.q2_opt3'), t('quiz.q2_opt4')]
    },
    {
      id: 'fabric',
      question: t('quiz.q3'),
      options: [t('quiz.q3_opt1'), t('quiz.q3_opt2'), t('quiz.q3_opt3'), t('quiz.q3_opt4')]
    },
    {
      id: 'mood',
      question: t('quiz.q4'),
      options: [t('quiz.q4_opt1'), t('quiz.q4_opt2'), t('quiz.q4_opt3'), t('quiz.q4_opt4')]
    }
  ];

  const progress = ((step) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[step];
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setFinished(false);
  };

  const recommendations = finished ? getRecommendations(answers) : [];

  const questionPanel = (
    <div className="w-full">
      <div className="mb-10 flex items-center justify-between">
        <p className="font-label text-micro tracking-[0.25em] uppercase text-terracotta-dark">
          {t('quiz.progress')} {step + 1} / {questions.length}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            aria-label={t('quiz.back')}
            className="inline-flex h-11 w-11 items-center justify-center border-b border-stone-300 text-stone-600 transition-colors duration-300 hover:border-terracotta hover:text-terracotta-dark"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
        )}
      </div>

      <h2 className="font-heading text-4xl md:text-6xl normal-case leading-[1.1] text-stone-800 mb-12 max-w-3xl">
        {questions[step].question}
      </h2>

      <div className="grid sm:grid-cols-2 gap-x-12">
        {questions[step].options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleAnswer(option)}
            className="group flex min-h-[76px] items-center justify-between gap-6 border-b border-stone-300 py-5 text-start transition-colors duration-300 hover:border-terracotta focus-visible:border-terracotta"
          >
            <span className="font-body text-lg text-stone-700 transition-colors duration-300 group-hover:text-terracotta-dark">
              {option}
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 text-stone-500 transition-colors duration-300 group-hover:text-terracotta-dark rtl:rotate-180" />
          </button>
        ))}
      </div>
    </div>
  );

  const resultsPanel = (
    <div className="w-full">
      <div className="text-start md:text-center mb-12">
        <span className="font-label text-micro tracking-[0.35em] uppercase text-terracotta-dark">
          {t('quiz.your_aesthetic')}
        </span>
        <h2 className="font-heading text-4xl md:text-5xl normal-case text-stone-800 mt-4 mb-5">
          {recommendations.length > 0 ? t('quiz.your_matches') : t('quiz.no_matches')}
        </h2>
        <div className="w-16 h-px bg-terracotta md:mx-auto mb-6" />
        <p className="font-body text-base text-stone-600 max-w-2xl md:mx-auto">
          {recommendations.length > 0
            ? t('quiz.based_on_answers')
            : t('quiz.browse_collection')
          }
        </p>
      </div>

      {recommendations.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="border border-stone-300 bg-ivory p-7 md:p-10 text-center mb-12">
            <h3 className="font-heading text-2xl md:text-3xl text-stone-800 mb-4">
              {t('quiz.next_step_heading')}
            </h3>
            <p className="font-body text-base text-stone-600 leading-loose mb-7 max-w-xl mx-auto">
              {t('quiz.next_step_body')}
            </p>
            <ul className="max-w-xl mx-auto grid sm:grid-cols-2 gap-3 text-start mb-8">
              {[t('contact.promise_deposit'), t('contact.promise_consultation'), t('contact.promise_reschedule'), t('contact.promise_fit_included')].map((promise) => (
                <li key={promise} className="flex items-start gap-2 font-body text-sm text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" />
                  <span>{promise}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/appointment"
              state={{ gowns: recommendations.map((p) => ({ id: p.id, name: p.name })) }}
              className="btn-luxury inline-flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              {t('quiz.request_these')}
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="font-body text-stone-600 italic">{t('quiz.try_different')}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/collection/all" className="btn-luxury flex items-center gap-2 justify-center">
          <Eye className="w-4 h-4" />
          {t('quiz.view_all')}
        </Link>
        <button
          type="button"
          onClick={resetQuiz}
          className="btn-luxury-outline flex items-center gap-2 justify-center"
        >
          <RefreshCw className="w-4 h-4" />
          {t('quiz.retry')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 min-h-screen bg-ivory pb-20">
      <header className="section-padding !py-20 md:!py-28 bg-ivory border-b border-stone-200">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-12 gap-y-8 items-end">
          <div className="lg:col-span-8">
            <KineticHeading
              as="h1"
              text={t('quiz.title')}
              className="font-heading text-[clamp(3.25rem,7vw,6.75rem)] normal-case leading-[1.02] text-stone-800 pointer-events-none"
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-body text-lg text-stone-600 leading-loose max-w-md">
              {t('quiz.subtitle')}
            </p>
          </div>
        </div>
      </header>

      <section className="section-padding !py-16 md:!py-20 bg-champagne">
        <div className="container mx-auto max-w-5xl">
          {!finished && (
            <div
              className="h-px bg-stone-300 mb-12"
              role="progressbar"
              aria-label={t('quiz.progress')}
              aria-valuemin={1}
              aria-valuemax={questions.length}
              aria-valuenow={step + 1}
            >
              {prefersReducedMotion ? (
                <div
                  className="h-full w-full bg-terracotta"
                  style={{
                    transform: `scaleX(${progress / 100})`,
                    transformOrigin: isRtl ? 'right' : 'left',
                  }}
                />
              ) : (
                <motion.div
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full bg-terracotta"
                  style={{ transformOrigin: isRtl ? 'right' : 'left' }}
                />
              )}
            </div>
          )}

          <div className="border-y border-stone-300 px-0 md:px-12 py-12 md:py-16 min-h-[440px] flex flex-col justify-center">
            {prefersReducedMotion ? (
              <div className="w-full">
                {finished ? resultsPanel : questionPanel}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {!finished ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    {questionPanel}
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    {resultsPanel}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          <div className="mt-10 flex justify-center gap-2" aria-hidden="true">
            {questions.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-px w-10 transition-colors duration-300',
                  i <= step ? 'bg-terracotta' : 'bg-stone-300'
                )}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}