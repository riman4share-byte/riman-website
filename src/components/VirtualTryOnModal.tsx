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

// Same selector set as the house dialog: anything a keyboard can land on.
// Every alternative excludes tabindex="-1", so the sr-only file input - which
// the visible Upload button drives programmatically - stays out of the cycle.
const FOCUSABLE = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// Everything a keyboard can land on inside the dialog, in document order.
// visibility/display are checked so a hidden control is not a tab stop; jsdom
// returns no layout, so offsetParent/getClientRects are deliberately not used
// (they would silently empty the list).
function getFocusable(dialog: HTMLElement): HTMLElement[] {
  return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none';
  });
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
  const [missingToken, setMissingToken] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);
  // Monotonic generation id. An abandoned run's cleanup must never null out the
  // refs belonging to a newer run, so every continuation re-checks its own id.
  const runIdRef = useRef(0);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const hasGarments = product.images.length > 0;

  // Every visit re-asks. Consent is deliberately never persisted: a stored
  // "yes" is not consent, it only hides the question.
  useEffect(() => {
    if (!isOpen) return;
    setScreen('consent');
    setConsented(false);
    setErrorMessage('');
    setInputError('');
    setMissingToken(false);
    setGarmentIndex(0);
    setPhotoDataUrl('');
    setResultUrl('');
    setBusy(false);
  }, [isOpen]);

  // aria-modal="true" is only honest if modality is actually enforced: focus
  // moves in on open, cannot walk out while open, and returns to the trigger on
  // close. House pattern from SizeGuide (focus the close button).
  useEffect(() => {
    if (!isOpen) return;
    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    closeRef.current?.focus();
    return () => {
      const target = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (target && document.contains(target)) target.focus();
    };
  }, [isOpen]);

  // A screen transition unmounts the control the customer was using (Continue,
  // Generate, ...), so the browser drops the focused area back to <body>. Reclaim
  // it into the dialog on every transition, so the keyboard is never stranded
  // behind the overlay. Guarded with contains(): on the initial open the effect
  // above has already focused Close, so this is a no-op there.
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog || dialog.contains(document.activeElement)) return;
    const focusable = getFocusable(dialog);
    (focusable[0] ?? dialog).focus();
  }, [isOpen, screen]);

  // The chosen photo and the result exist only as component state. Nothing is
  // written to storage, and there is no object URL to revoke here - the service
  // owns (and releases) the one it uses to probe dimensions.
  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  const handleClose = useCallback(() => {
    runIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    inFlightRef.current = false;
    setBusy(false);
    setPhotoDataUrl('');
    setInputError('');
    setErrorMessage('');
    setMissingToken(false);
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

  // Tab cycles inside the dialog instead of escaping to the page behind the
  // overlay. Bound at the document level, like the Escape listener above, so a
  // Tab that arrives while focus has fallen outside the dialog is reclaimed
  // rather than walking the page. Only the wrap-around boundaries and the
  // out-of-dialog case are intercepted, so ordinary Tab order inside the dialog
  // is left alone.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = getFocusable(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!active || !dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

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
    const runId = ++runIdRef.current;
    // Busy is raised before the first await so the button is already disabled
    // in this commit - otherwise the token read leaves a window where the
    // button looks live and the tap is silently swallowed.
    setBusy(true);
    setErrorMessage('');
    setMissingToken(false);

    const session = await getSession().catch(() => null);
    // A newer run (or a close) owns the state now; this run must not touch it.
    if (runIdRef.current !== runId) return;
    if (!session?.access_token) {
      inFlightRef.current = false;
      setBusy(false);
      // A user who IS signed in but has no bearer token is a configuration gap,
      // not a missing sign-in. Telling them to sign in again would loop forever.
      setMissingToken(true);
      setErrorMessage(user ? t('tryon.not_configured') : t('tryon.sign_in_required'));
      setScreen('error');
      return;
    }

    setScreen('generating');
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
      if (runIdRef.current !== runId) return;
      setResultUrl(`data:${result.mime};base64,${result.base64}`);
      setScreen('result');
      trackEvent({ event: 'tryon_generated', productId: product.id, productName: product.name, category: product.category });
    } catch (error) {
      if (runIdRef.current !== runId) return;
      // No placeholder result: a failed generation shows the error and nothing
      // else, so a customer never mistakes a spinner for a finished try-on.
      const message = error instanceof TryOnError ? error.message : t('tryon.error_heading');
      setErrorMessage(message);
      setScreen('error');
      // A cancelled run never reaches here: closing or unmounting bumps runIdRef,
      // so the run-id check above returns first. Recording the error is therefore
      // safe from the customer-cancelled path.
      trackEvent({ event: 'tryon_error', productId: product.id, productName: product.name, category: product.category });
    } finally {
      if (runIdRef.current !== runId) return;
      abortRef.current = null;
      inFlightRef.current = false;
      setBusy(false);
    }
  }, [garmentIndex, photoDataUrl, product.category, product.id, product.name, t, user]);

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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('tryon.heading')}
            tabIndex={-1}
            className="relative w-full max-w-lg bg-ivory max-h-[90vh] overflow-y-auto p-6 md:p-10 outline-none"
          >
            <button
              ref={closeRef}
              onClick={handleClose}
              aria-label={t('tryon.close')}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-stone-200 text-stone-500 hover:text-terracotta-dark transition-colors focus-visible:ring-2 focus-visible:ring-gold outline-none"
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

                {!user && (
                  <p className="text-micro leading-relaxed text-stone-600">
                    {t('tryon.sign_in_gate_hint')}{' '}
                    <a href="/auth" className="underline underline-offset-2">{t('tryon.sign_in_action')}</a>
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setScreen('upload')}
                    disabled={!consented || !user}
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

                {photoDataUrl ? (
                  <div className="space-y-3">
                    <img src={photoDataUrl} alt={t('tryon.preview_alt')} className="w-full max-h-64 object-contain bg-stone-50" />
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

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  // Kept out of the tab order: it is sr-only, so a keyboard user
                  // would otherwise hit an invisible focus stop before the
                  // visible Upload button. The button drives it via .click().
                  tabIndex={-1}
                  className="sr-only"
                  data-testid="tryon-file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(file);
                  }}
                />

                {inputError && <p className="text-micro text-rose-600">{inputError}</p>}

                <div>
                  <p className="text-micro uppercase tracking-widest text-stone-500 mb-2">{t('tryon.garment_heading')}</p>
                  {hasGarments ? (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {product.images.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          onClick={() => setGarmentIndex(index)}
                          aria-label={`${t('tryon.garment_heading')} ${index + 1}`}
                          aria-pressed={garmentIndex === index}
                          className={`w-16 h-20 shrink-0 border transition-colors ${garmentIndex === index ? 'border-terracotta' : 'border-stone-200'}`}
                        >
                          <img src={resolveMediaUrl(image)} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-micro text-stone-500">{t('tryon.no_images')}</p>
                  )}
                </div>

                <button
                  onClick={() => void handleGenerate()}
                  disabled={!photoDataUrl || !hasGarments || busy}
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
                {/* A missing token is not retryable: Retry would loop forever for
                    a locally-authenticated user and be a lie for a signed-out one. */}
                {!missingToken ? (
                  <button onClick={() => setScreen('upload')} className="btn-luxury w-full !py-3">
                    {t('tryon.error_retry')}
                  </button>
                ) : !user ? (
                  <a href="/auth" className="btn-luxury w-full !py-3 block text-center">
                    {t('tryon.sign_in_action')}
                  </a>
                ) : null}
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
