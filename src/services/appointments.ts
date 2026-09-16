import { supabase, isSupabaseConfigured, supabaseUrl, supabaseAnonKey } from './supabase';
import { Appointment } from '../types';

const LOCAL_APPOINTMENTS_KEY = 'riman_appointments';

function getLocalAppointments(): Appointment[] {
  try {
    const data = localStorage.getItem(LOCAL_APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalAppointments(appointments: Appointment[]): void {
  localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify(appointments));
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'created_at'>): Promise<Appointment> {
  if (!isSupabaseConfigured) {
    throw new Error('Booking service unavailable. Please try again or contact us on WhatsApp.');
  }

  // Public booking must succeed even when the browser holds a stale/expired
  // user session (invalid refresh token). supabase-js would attach that bad
  // JWT as Authorization and PostgREST answers 401. So POST with the pure
  // anon key — no user token — which matches the "Anyone can create" policy.
  const payload: Record<string, unknown> = {
    name: appointment.name,
    email: appointment.email,
    phone: appointment.phone,
    date: appointment.date,
    time: appointment.time,
    service_type: appointment.service_type,
    notes: appointment.notes,
    status: 'pending',
  };
  if (appointment.interested_gowns && appointment.interested_gowns.length) {
    payload.interested_gowns = appointment.interested_gowns;
  }

  // NOTE: no `?select=*` / `return=representation` here on purpose. Postgres
  // applies SELECT RLS to INSERT...RETURNING, and anon has no SELECT grant
  // (admin-only, to protect customer PII) — requesting the row back turns a
  // permitted insert into a 42501 RLS violation. The form needs no row back.
  try {
    const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/appointments`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const msg = (body && (body.message || body.hint)) || `Booking failed (HTTP ${res.status})`;
      const err = new Error(msg) as Error & { code?: string; status?: number; details?: unknown };
      err.code = body?.code;
      err.status = res.status;
      err.details = body;
      throw err;
    }
    return { ...appointment, status: 'pending' } as Appointment;
  } catch (err: any) {
    // Production: never fake success. Surface failure so UI shows
    // retry + WhatsApp fallback instead of a false confirmation.
    if (err instanceof TypeError || (err.message && err.message.includes('Failed to fetch'))) {
      throw new Error('Booking service unavailable. Please try again or contact us on WhatsApp.');
    }
    throw err;
  }
}

export async function fetchAppointments(): Promise<Appointment[]> {
  if (!isSupabaseConfigured) return getLocalAppointments();

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return (data || []) as Appointment[];
  } catch (err: any) {
    // Fall back to local storage if Supabase is unreachable
    if (err instanceof TypeError || (err.message && err.message.includes('Failed to fetch'))) {
      return getLocalAppointments();
    }
    throw err;
  }
}

export async function updateAppointmentStatus(id: string, status: string): Promise<void> {
  if (!isSupabaseConfigured) {
    updateLocalAppointmentStatus(id, status);
    return;
  }

  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  } catch (err: any) {
    // Fall back to local storage if Supabase is unreachable
    if (err instanceof TypeError || (err.message && err.message.includes('Failed to fetch'))) {
      updateLocalAppointmentStatus(id, status);
      return;
    }
    throw err;
  }
}

function updateLocalAppointmentStatus(id: string, status: string): void {
  const appointments = getLocalAppointments();
  const appt = appointments.find(a => a.id === id);
  if (appt) {
    appt.status = status as any;
    saveLocalAppointments(appointments);
  }
}