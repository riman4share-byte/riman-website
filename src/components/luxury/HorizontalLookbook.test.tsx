import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import HorizontalLookbook from './HorizontalLookbook';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../hooks/useGallery', () => ({
  useGallery: vi.fn(),
}));

import { useGallery } from '../../hooks/useGallery';

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

const item = {
  id: '1', title: 'Look 01', description: '', category: 'Bridal',
  media_url: '/a.jpg', media_type: 'photo' as const, thumbnail_url: '',
  sort_order: 1, is_featured: true, created_at: '',
};

function renderWithProviders() {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <HorizontalLookbook />
      </BrowserRouter>
    </LanguageProvider>
  );
}

describe('HorizontalLookbook', () => {
  it('falls back to the house gallery when the live feed is empty', () => {
    vi.mocked(useGallery).mockReturnValue({
      items: [], isLoading: false, error: null, hasMore: false,
      totalCount: 0, loadMore: vi.fn(), refresh: vi.fn(),
    });
    const { container } = renderWithProviders();
    expect(container.querySelectorAll('section').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('img').length).toBeGreaterThan(0);
  });

  it('renders panel titles for gallery items', () => {
    vi.mocked(useGallery).mockReturnValue({
      items: [item], isLoading: false, error: null, hasMore: false,
      totalCount: 1, loadMore: vi.fn(), refresh: vi.fn(),
    });
    renderWithProviders();
    expect(screen.getAllByText('Look 01').length).toBeGreaterThan(0);
  });
});
