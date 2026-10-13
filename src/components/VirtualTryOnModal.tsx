import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Sparkles, X, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getSession } from '../services/auth';
import { trackEvent } from '../services/analytics';
import { resolveMediaUrl } from '../lib/seo';
import type { Product } from '../types';
import {
  TryOnError,
  assertSendableDataUrl,
  fileToDataUrl,
  requestTryOn,
  validatePhotoFile,
} from '../services/tryOnClient';

type Screen = 'consent' | 'upload' | 'generating' | 'result' | 'error';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function VirtualTryOnModal({ product, isOpen, onClose }: Props) {
  useScrollLock(isOpen);
  const { t } = useLanguage();
  // useAuth owns "is somebody signed in"; the bearer token for the edge
  // function is not on that context, so it is read from the auth service at
  // generate time rather than cached in component state.
  const { user } = useAuth();

  const [screen, setScreen] = useState<Screen>('consent');
  const [consented, setConsented] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [garmentIndex, setGarmentIndex] = useState(0);
  const [resultUrl, setResultUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);

  // Every visit re-asks. Consent is deliberately never persisted: a stored
  // "yes" is not consent, it only hides the question.
  useEffect(() => {
    if (!isOpen) return;
    setScreen('consent');
    setConsented(false);
    setErrorMessage('');
    setInputError('');
    setGarmentIndex(0);
    setPhotoDataUrl('');
  }, [isOpen]);

  // The chosen photo and the result exist only as component state. Nothing is
  // written to storage, and there is no object URL to revoke here - the service
  // owns (and releases) the one it uses to probe dimensions.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    inFlightRef.current = false;
    setBusy(false);
    setPhotoDataUrl('');
    setInputError('');
    setErrorMessage('');
    setResultUrl('');
    setGarmentIndex(0);
    setConsented(false);
    setScreen('consent');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  const handleFile = useCallback(async (file: File) => {
    const invalid = validatePhotoFile(file);
    if (invalid) {
      setInputError(invalid.message);
      return;
    }
    setInputError('');
    try {
      const encoded = await fileToDataUrl(file);
      assertSendableDataUrl(encoded);
      setPhotoDataUrl(encoded);
    } catch {
      setPhotoDataUrl('');
      setInputError(t('tryon.upload_hint'));
    }
  }, [t]);

  const handleGenerate = useCallback(async () => {
    // A double click, or an impatient second tap while the first request is
    // still open, must not become a second paid generation.
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const session = await getSession().catch(() => null);
    if (!session?.access_token) {
      inFlightRef.current = false;
      setErrorMessage(t('tryon.sign_in_required'));
      setScreen('error');
      return;
    }

    setScreen('generating');
    setBusy(true);
    setErrorMessage('');
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await requestTryOn({
        productId: product.id,
        imageIndex: garmentIndex,
        image: photoDataUrl,
        accessToken: session.access_token,
        signal: controller.signal,
      });
      setResultUrl(`data:${result.mime};base64,${result.base64}`);
      setScreen('result');
      trackEvent({ event: 'tryon_generated', productId: product.id, productName: product.name, category: product.category });
    } catch (error) {
      // No placeholder result: a failed generation shows the error and nothing
      // else, so a customer never mistakes a spinner for a finished try-on.
      const message = error instanceof TryOnError ? error.message : t('tryon.error_heading');
      setErrorMessage(message);
      setScreen('error');
      trackEvent({ event: 'tryon_error', productId: product.id, productName: product.name, category: product.category });
    } finally {
      abortRef.current = null;
      inFlightRef.current = false;
      setBusy(false);
    }
  }, [garmentIndex, photoDataUrl, product.category, product.id, product.name, t]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('tryon.heading')}
            className="relative w-full max-w-lg bg-ivory max-h-[90vh] overflow-y-auto p-6 md:p-10"
          >
            <button
              onClick={handleClose}
              aria-label={t('tryon.close')}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-stone-200 text-stone-500 hover:text-terracotta-dark transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-heading text-xl md:text-2xl tracking-wide text-stone-800 pr-10">
              {t('tryon.heading')}
            </h2>

            {screen === 'consent' && (
              <div className="mt-6 space-y-4">
                <p className="text-micro leading-relaxed text-stone-600">{t('tryon.consent_body')}</p>
                <p className="text-micro leading-relaxed text-stone-600">{t('tryon.consent_processor')}</p>
                <ul className="space-y-2 text-micro leading-relaxed text-stone-600">
                  <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-terracotta-dark" />{t('tryon.consent_not_saved')}</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-terracotta-dark" />{t('tryon.consent_not_shared')}</li>
                </ul>
                <p className="text-micro leading-relaxed text-stone-500 italic">{t('tryon.fit_disclaimer')}</p>

                <label className="flex items-start gap-3 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={consented}
                    onChange={(e) => setConsented(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-terracotta"
                  />
                  <span className="text-micro leading-relaxed text-stone-700">{t('tryon.consent_checkbox')}</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setScreen('upload')}
                    disabled={!consented}
                    className="btn-luxury flex-1 !py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('tryon.consent_continue')}
                  </button>
                  <button onClick={handleClose} className="btn-luxury-outline flex-1 !py-3">
                    {t('tryon.consent_decline')}
                  </button>
                </div>
              </div>
            )}

            {screen === 'upload' && (
              <div className="mt-6 space-y-5">
                <p className="text-micro text-stone-600">{t('tryon.upload_hint')}</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  data-testid="tryon-file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(file);
                  }}
                />

                {photoDataUrl ? (
                  <div className="space-y-3">
                    <img src={photoDataUrl} alt={t('tryon.upload_heading')} className="w-full max-h-64 object-contain bg-stone-50" />
                    <div className="flex gap-3">
                      <button onClick={() => fileInputRef.current?.click()} className="btn-luxury-outline flex-1 !py-2.5 text-micro">
                        {t('tryon.replace_photo')}
                      </button>
                      <button
                        onClick={() => { setPhotoDataUrl(''); setInputError(''); }}
                        className="btn-luxury-outline flex-1 !py-2.5 text-micro"
                      >
                        {t('tryon.clear_photo')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-stone-300 py-10 text-micro uppercase tracking-widest text-stone-500 hover:border-terracotta/50 transition-colors"
                  >
                    {t('tryon.upload_cta')}
                  </button>
                )}

                {inputError && <p className="text-micro text-rose-600">{inputError}</p>}

                <div>
                  <p className="text-micro uppercase tracking-widest text-stone-500 mb-2">{t('tryon.garment_heading')}</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((image, index) => (
                      <button
                        key={image}
                        onClick={() => setGarmentIndex(index)}
                        aria-label={`${t('tryon.garment_heading')} ${index + 1}`}
                        aria-pressed={garmentIndex === index}
                        className={`w-16 h-20 shrink-0 border transition-colors ${garmentIndex === index ? 'border-terracotta' : 'border-stone-200'}`}
                      >
                        <img src={resolveMediaUrl(image)} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => void handleGenerate()}
                  disabled={!photoDataUrl || busy}
                  className="btn-luxury w-full !py-3 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  {t('tryon.generate')}
                </button>
              </div>
            )}

            {screen === 'generating' && (
              <div className="mt-8 flex flex-col items-center gap-4 text-center py-6">
                <Loader2 className="w-7 h-7 animate-spin text-terracotta-dark" />
                <p className="text-micro uppercase tracking-widest text-stone-700">{t('tryon.generating')}</p>
                <p className="text-micro text-stone-500 max-w-xs">{t('tryon.generating_hint')}</p>
              </div>
            )}

            {screen === 'result' && (
              <div className="mt-6 space-y-4">
                <p className="text-micro uppercase tracking-widest text-stone-500">{t('tryon.result_heading')}</p>
                <img
                  data-testid="tryon-result"
                  src={resultUrl}
                  alt={`${product.name} ${t('tryon.result_heading')}`}
                  className="w-full max-h-[60vh] object-contain bg-stone-50"
                />
                <p className="text-micro leading-relaxed text-stone-500 italic">{t('tryon.fit_disclaimer')}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { setResultUrl(''); setScreen('upload'); }}
                    className="btn-luxury-outline flex-1 !py-2.5 text-micro"
                  >
                    {t('tryon.try_another')}
                  </button>
                  <a href={`/appointment?product=${encodeURIComponent(product.id)}`} className="btn-luxury-outline flex-1 !py-2.5 text-micro text-center">
                    {t('tryon.book_viewing')}
                  </a>
                  <button onClick={handleClose} className="btn-luxury flex-1 !py-2.5 text-micro flex items-center justify-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {t('tryon.continue_shopping')}
                  </button>
                </div>
              </div>
            )}

            {screen === 'error' && (
              <div className="mt-6 space-y-4">
                <p className="text-micro uppercase tracking-widest text-stone-500">{t('tryon.error_heading')}</p>
                <p className="text-micro leading-relaxed text-stone-700">{errorMessage}</p>
                {user ? (
                  <button onClick={() => setScreen('upload')} className="btn-luxury w-full !py-3">
                    {t('tryon.error_retry')}
                  </button>
                ) : (
                  <a href="/auth" className="btn-luxury w-full !py-3 block text-center">
                    {t('tryon.sign_in_action')}
                  </a>
                )}
                <button onClick={handleClose} className="btn-luxury-outline w-full !py-3 text-micro">
                  {t('tryon.close')}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}