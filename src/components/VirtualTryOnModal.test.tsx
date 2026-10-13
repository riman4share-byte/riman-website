import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VirtualTryOnModal } from './VirtualTryOnModal';
import { useAuth } from '../contexts/AuthContext';
import { getSession } from '../services/auth';

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

const renderModal = () =>
  render(<VirtualTryOnModal product={product} isOpen onClose={() => {}} />);

const consentBox = () => screen.getByRole('checkbox') as HTMLInputElement;
const continueButton = () => screen.getByRole('button', { name: 'Continue' });
const jpegFile = () => new File([new Uint8Array([1, 2, 3])], 'me.jpg', { type: 'image/jpeg' });

describe('VirtualTryOnModal consent gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: { id: 'u1' } });
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ access_token: 'tok' });
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
  });

  it('reveals one thumbnail per product image after consent', () => {
    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());
    expect(screen.getAllByRole('button', { name: /Which view of the gown/i }).length).toBe(2);
  });

  it('re-asks for consent every time the modal is reopened', () => {
    const { unmount } = render(<VirtualTryOnModal product={product} isOpen onClose={() => {}} />);
    fireEvent.click(consentBox());
    unmount();
    renderModal();
    expect(continueButton().hasAttribute('disabled')).toBe(true);
  });
});

describe('VirtualTryOnModal generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: { id: 'u1' } });
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ access_token: 'tok' });
  });

  it('shows a result only after requestTryOn resolves', async () => {
    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [jpegFile()] } });
    // fileToDataUrl is async, so the preview only exists once the encode
    // settles. Generate stays disabled until it does - that is the contract.
    await screen.findByAltText('Choose your photo');

    fireEvent.click(screen.getByRole('button', { name: 'Generate My Try-On' }));
    await waitFor(() => expect(screen.getByTestId('tryon-result')).toBeTruthy());
  });

  it('routes to sign-in instead of generating when signed out', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });
    (getSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    renderModal();
    fireEvent.click(consentBox());
    fireEvent.click(continueButton());

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [jpegFile()] } });
    await screen.findByAltText('Choose your photo');
    fireEvent.click(screen.getByRole('button', { name: 'Generate My Try-On' }));

    await waitFor(() => expect(screen.getByText('Please sign in to create your try-on.')).toBeTruthy());
  });
});