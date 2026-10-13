import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VirtualTryOnModal } from './VirtualTryOnModal';
import { useAuth } from '../contexts/AuthContext';
import { getSession } from '../services/auth';
import { fileToDataUrl, requestTryOn } from '../services/tryOnClient';
import { trackEvent } from '../services/analytics';

vi.mock('../services/tryOnClient', () => ({
  validatePhotoFile: vi.fn(() => null),
  fileToDataUrl: vi.fn(async () => 'data:image/jpeg;base64,AAAA'),
  requestTryOn: vi.fn(async () => ({ base64: 'AAAA', mime: 'image/png' })),
  assertSendableDataUrl: vi.fn(),
  TryOnError: class extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
}));

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));

// The bearer token is not on the auth context; it is read from the auth
// service at generate time.
vi.mock('../services/auth', () => ({ getSession: vi.fn() }));

vi.mock('../services/analytics', () => ({ trackEvent: vi.fn() }));

const product = {
  id: '17',
  name: 'Fleur Eternelle Bridal Gown',
  description: 'A garden in full bloom.',
  productType: 'both' as const,
  images: ['/assets/a.jpg', '/assets/b.jpg'],
  category: 'Bridal Gown' as const,
  style: ['Floral'],
  color: ['Ivory'],
  sizes: ['S'],
};

const asMock = (v: unknown) => v as ReturnType<typeof vi.fn>;

const renderModal = () => render(<VirtualTryOnModal product={product} isOpen onClose={() => {}} />);

const consentBox = () => screen.getByRole('checkbox') as HTMLInputElement;
const continueButton = () => screen.getByRole('button', { name: 'Continue' });
const generateButton = () => screen.getByRole('button', { name: 'Generate My Try-On' });
const jpegFile = () => new File([new Uint8Array([1, 2, 3])], 'me.jpg', { type: 'image/jpeg' });
const PREVIEW_ALT = 'Your uploaded photo, ready for the try-on';

const choosePhoto = async () => {
  const input = screen.getByTestId('tryon-file') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [jpegFile()] } });
  // fileToDataUrl is async, so the preview only exists once the encode
  // settles. Generate stays disabled until it does - that is the contract.
  await screen.findByAltText(PREVIEW_ALT);
};

const signIn = () => asMock(useAuth).mockReturnValue({ user: { id: 'u1' } });

describe('VirtualTryOnModal consent gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signIn();
    asMock(getSession).mockResolvedValue({ access_token: 'tok' });
  });

  it('shows consent first and keeps Continue disabled until the box is ticked', () => {
    renderModal();
    expect(screen.getByText('See Yourself in This Dress')).toBeTruthy();
    expect(continueButton().hasAttribute('disabled')).toBe(true);

    fireEvent.click(consentBox());
    expect(continueButton().hasAttribute('disabled')).toBe(false);
  });

  it('does not render the upload screen before consent', () => {
    renderModal();
    expect(screen.queryByRole('button', { name: 'Generate My Try-On' })).toBeNull();
    expect(screen.queryByTestId('tryon-file')).toBeNull();
  });

  it('reveals one thumbnail per product image after consent', () => {
    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());
    expect(screen.getAllByRole('button', { name: /Which view of the gown/i }).length).toBe(2);
  });

  it('re-asks for consent on reopen without unmounting the component', () => {
    // A fresh useState starts false on its own, so asserting on a remount
    // proves nothing. Here the component stays mounted through the close and
    // reopen: only the [isOpen] reset can clear a box ticked on a prior visit.
    const { rerender } = render(<VirtualTryOnModal product={product} isOpen onClose={() => {}} />);
    fireEvent.click(consentBox());
    expect(continueButton().hasAttribute('disabled')).toBe(false);

    rerender(<VirtualTryOnModal product={product} isOpen={false} onClose={() => {}} />);
    rerender(<VirtualTryOnModal product={product} isOpen onClose={() => {}} />);

    expect(consentBox().checked).toBe(false);
    expect(continueButton().hasAttribute('disabled')).toBe(true);
  });

  it('never releases the file picker to a signed-out visitor', () => {
    // Owner decision: the upload screen is gated on sign-in, so a signed-out
    // visitor's photo is never decoded into page memory.
    asMock(useAuth).mockReturnValue({ user: null });
    asMock(getSession).mockResolvedValue(null);
    renderModal();

    expect(screen.queryByTestId('tryon-file')).toBeNull();
    fireEvent.click(consentBox());
    expect(continueButton().hasAttribute('disabled')).toBe(true);

    // Clicking the disabled Continue cannot advance, and the picker stays
    // unreachable however the visitor tries.
    fireEvent.click(continueButton());
    expect(screen.queryByTestId('tryon-file')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Generate My Try-On' })).toBeNull();
    expect(fileToDataUrl).not.toHaveBeenCalled();

    // The consent disclosure is still shown, plus the way to sign in.
    expect(screen.getByText('Please sign in first — we only create try-ons for signed-in customers.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeTruthy();
  });
});

describe('VirtualTryOnModal dialog semantics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signIn();
    asMock(getSession).mockResolvedValue({ access_token: 'tok' });
  });

  // A focusable control standing in for the rest of the page, so "focus never
  // escapes the dialog" is observable rather than vacuous.
  const harness = (isOpen: boolean) => (
    <>
      <button data-testid="behind">Behind the overlay</button>
      <VirtualTryOnModal product={product} isOpen={isOpen} onClose={() => {}} />
    </>
  );

  it('takes focus on open and keeps Tab inside the dialog', () => {
    render(harness(true));
    const dialog = screen.getByRole('dialog');
    const close = screen.getByRole('button', { name: 'Close' });
    const decline = screen.getByRole('button', { name: 'Not now' });
    const behind = screen.getByTestId('behind');

    // aria-modal="true" is only honest if focus actually starts inside.
    expect(document.activeElement).toBe(close);
    expect(dialog.contains(document.activeElement)).toBe(true);

    // Wrap-around in both directions keeps the cycle inside the dialog.
    decline.focus();
    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toBe(close);

    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(decline);

    for (let i = 0; i < 12; i++) {
      fireEvent.keyDown(dialog, { key: 'Tab' });
      expect(dialog.contains(document.activeElement)).toBe(true);
      expect(document.activeElement).not.toBe(behind);
    }
    for (let i = 0; i < 12; i++) {
      fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
      expect(dialog.contains(document.activeElement)).toBe(true);
      expect(document.activeElement).not.toBe(behind);
    }
  });

  it('gives focus back to the trigger when it closes', async () => {
    const { rerender } = render(harness(false));
    const behind = screen.getByTestId('behind');
    behind.focus();
    expect(document.activeElement).toBe(behind);

    rerender(harness(true));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }));

    rerender(harness(false));
    await waitFor(() => expect(document.activeElement).toBe(behind));
  });
});

describe('VirtualTryOnModal generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signIn();
    asMock(getSession).mockResolvedValue({ access_token: 'tok' });
    asMock(requestTryOn).mockResolvedValue({ base64: 'AAAA', mime: 'image/png' });
  });

  it('shows a result only after requestTryOn resolves', async () => {
    // A resolved-immediately mock proves nothing: an unconditional or
    // optimistic render would pass the same way. The promise is held pending
    // until the test says otherwise, so the in-flight window is observable.
    let resolveTryOn!: (v: { base64: string; mime: string }) => void;
    const pending = new Promise<{ base64: string; mime: string }>((r) => {
      resolveTryOn = r;
    });
    asMock(requestTryOn).mockReturnValue(pending);

    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());
    await choosePhoto();

    fireEvent.click(generateButton());
    await screen.findByText('Creating your try-on…');

    // In flight: no result, and the customer's own photo is off the screen.
    expect(screen.queryByTestId('tryon-result')).toBeNull();
    expect(screen.queryByAltText(PREVIEW_ALT)).toBeNull();
    expect(trackEvent).not.toHaveBeenCalledWith(expect.objectContaining({ event: 'tryon_generated' }));

    resolveTryOn({ base64: 'BBBB', mime: 'image/png' });
    await waitFor(() => expect(screen.getByTestId('tryon-result')).toBeTruthy());
    expect(screen.getByTestId('tryon-result').getAttribute('src')).toBe('data:image/png;base64,BBBB');
  });

  it('reports the setup copy, not a sign-in prompt, for a signed-in user with no token', async () => {
    // The localStorage fallback session has a user but no Supabase bearer
    // token. Telling that customer to sign in again is a dead end.
    asMock(useAuth).mockReturnValue({ user: { id: 'local@riman.test', email: 'local@riman.test' } });
    asMock(getSession).mockResolvedValue(null);

    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());
    await choosePhoto();
    fireEvent.click(generateButton());

    await screen.findByText('Virtual try-on is being set up. Please try again shortly.');
    expect(screen.queryByText('Please sign in to create your try-on.')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Sign in' })).toBeNull();
    // Retry would loop forever, because the token is never going to appear.
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
  });

  it('does not record a generation the customer cancelled as an error', async () => {
    let rejectTryOn!: (e: unknown) => void;
    asMock(requestTryOn).mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectTryOn = reject;
      }),
    );

    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());
    await choosePhoto();
    fireEvent.click(generateButton());
    await screen.findByText('Creating your try-on…');

    // Closing mid-flight is the customer cancelling, not a failure.
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    rejectTryOn(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    await waitFor(() => expect(screen.queryByText('Creating your try-on…')).toBeNull());

    expect(trackEvent).not.toHaveBeenCalledWith(expect.objectContaining({ event: 'tryon_error' }));
  });

  it('blocks generation when the product has no images', () => {
    render(<VirtualTryOnModal product={{ ...product, images: [] }} isOpen onClose={() => {}} />);
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());

    expect(screen.getByText('No photos of this piece are available yet, so a try-on cannot be generated.')).toBeTruthy();
    expect(screen.queryAllByRole('button', { name: /Which view of the gown/i }).length).toBe(0);
    expect(generateButton().hasAttribute('disabled')).toBe(true);
  });
});
