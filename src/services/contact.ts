import { isSupabaseConfigured, supabase, supabaseAnonKey, supabaseUrl } from './supabase';

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
}) {
  if (!isSupabaseConfigured) throw new Error('Contact service unavailable.');
  // Anon-only, return=minimal: SELECT on contact_submissions is admin-only,
  // so requesting the row back (`.select()`) turns a permitted insert into
  // a 42501 RLS violation — same bug class as appointments. The UI needs
  // no row back.
  const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/contact_submissions`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      inquiry_type: data.inquiry_type,
      message: data.message,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && (body.message || body.hint)) || `Contact submit failed (HTTP ${res.status})`);
  }
}

export async function fetchContactSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateContactSubmissionStatus(id: string, status: string, adminNotes?: string) {
  const updates: any = { status };
  if (adminNotes) updates.admin_notes = adminNotes;

  const { data, error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}