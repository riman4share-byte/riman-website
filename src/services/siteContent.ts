import { supabase } from './supabase';

// `quote` is stored as { value: string } by the admin save path
// (DataContext.updateContent) but consumed as a plain string everywhere else.
function normalizeSiteContentValue(key: string, value: unknown): unknown {
  if (key === 'quote' && value !== null && typeof value === 'object' && 'value' in value) {
    return (value as { value: unknown }).value;
  }
  return value;
}

export async function fetchSiteContent(): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from('site_content')
    .select('key, value');

  if (error) throw error;
  const result: Record<string, any> = {};
  (data || []).forEach(row => {
    result[row.key] = normalizeSiteContentValue(row.key, row.value);
  });
  return result;
}

export async function updateSiteContentKey(key: string, value: any): Promise<void> {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw error;
}

// --- Site Settings ---

export async function fetchSiteSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) throw error;
  const result: Record<string, any> = {};
  (data || []).forEach(row => {
    result[row.key] = row.value;
  });
  return result;
}

export async function updateSiteSetting(key: string, value: any): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw error;
}
