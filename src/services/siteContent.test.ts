import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.hoisted(() => vi.fn());

vi.mock('./supabase', () => ({
  supabase: { from: mockFrom },
}));

import { fetchSiteContent } from './siteContent';

function mockRows(data: Array<{ key: string; value: unknown }>) {
  mockFrom.mockReturnValue({
    select: vi.fn().mockResolvedValue({ data, error: null }),
  });
}

describe('fetchSiteContent', () => {
  beforeEach(() => vi.resetAllMocks());

  it('unwraps the { value } wrapper stored for the quote key', async () => {
    mockRows([{ key: 'quote', value: { value: 'In the heart of Sharjah…' } }]);
    const content = await fetchSiteContent();
    expect(content.quote).toBe('In the heart of Sharjah…');
  });

  it('passes through a plain string quote (legacy rows)', async () => {
    mockRows([{ key: 'quote', value: 'Plain text quote' }]);
    const content = await fetchSiteContent();
    expect(content.quote).toBe('Plain text quote');
  });

  it('leaves object-shaped keys (hero, about) untouched', async () => {
    const hero = { title: 'Reverie & Essence', subtitle: 'Sharjah' };
    mockRows([{ key: 'hero', value: hero }]);
    const content = await fetchSiteContent();
    expect(content.hero).toEqual(hero);
  });
});
