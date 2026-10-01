import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';
import EditorialPlate from './EditorialPlate';
import { Product } from '../../types';

const gown: Product = {
  id: 'p1',
  name: 'Ivory Mikado Gown',
  description: 'test',
  productType: 'sale',
  images: ['/assets/gown.jpg'],
  category: 'Bridal Gown',
  style: [],
  color: [],
  sizes: [],
  fabric: 'Mikado Silk',
  salePrice: 12000,
  rentalPrice: 1200,
};

describe('EditorialPlate', () => {
  beforeEach(() => {
    localStorage.setItem('riman_lang', 'en');
  });

  it('renders look number, name, fabric and reserve link', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <EditorialPlate product={gown} index={0} />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(screen.getByAltText('Ivory Mikado Gown')).toHaveAttribute('src', '/assets/gown.jpg');
    expect(screen.getByText('Look 01')).toBeInTheDocument();
    expect(screen.getByText('Mikado Silk')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view & reserve/i })).toHaveAttribute('href', '/product/p1');
  });

  it('shows both purchase and rental starting prices', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <EditorialPlate product={gown} index={0} />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/12,000/)).toBeInTheDocument();
    expect(screen.getByText(/1,200/)).toBeInTheDocument();
  });

  it('omits price lines when neither price is present', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <EditorialPlate
            product={{ ...gown, salePrice: undefined, rentalPrice: undefined }}
            index={0}
          />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Look 01')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view & reserve/i })).toBeInTheDocument();
  });

  it('omits fabric line when absent', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <EditorialPlate product={{ ...gown, fabric: undefined }} index={1} />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(screen.queryByText('Mikado Silk')).not.toBeInTheDocument();
    expect(screen.getByText('Look 02')).toBeInTheDocument();
  });
});
