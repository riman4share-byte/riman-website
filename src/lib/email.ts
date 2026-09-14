import { createClient } from '@supabase/supabase-js';

export interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Client-side email is DELEGATED to the `send-notification` Supabase edge
 * function — there is no browser-side email SDK here. Transactional email
 * templates and API keys are server-only concerns; anything shipped in the
 * client bundle is public and forgeable, so this module only composes a
 * notification request and reports back the edge function's outcome.
 *
 * Callers (Checkout, AppointmentPage, PaymentSuccess) fail softly: a guest
 * without a session receives `{ success: false, error: 'unauthorized' }`
 * while the Stripe webhook (server-side) paths still send the real emails.
 */

interface NotificationPayload {
  type: 'order_confirmed' | 'appointment_booked' | 'contact_submitted';
  to: string;
  subject: string;
  data: Record<string, unknown>;
}

async function notify(payload: NotificationPayload): Promise<EmailResult> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return { success: false, error: 'not-configured' };
  }
  try {
    const supabase = createClient(url, anon);
    const { error } = await supabase.functions.invoke('send-notification', { body: payload });
    if (error) {
      const message = error.message || String(error);
      console.info('[Riman] send-notification unavailable:', message);
      return { success: false, error: /401|Unauthorized/i.test(message) ? 'unauthorized' : message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    intent?: 'sale' | 'rent';
    rentalStartDate?: string;
    rentalEndDate?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<EmailResult> {
  return notify({
    type: 'order_confirmed',
    to: data.customerEmail,
    subject: `Order Confirmation — ${data.orderId}`,
    data: { ...data },
  });
}

export async function sendAdminOrderAlert(data: OrderEmailData): Promise<EmailResult> {
  return notify({
    type: 'order_confirmed',
    to: import.meta.env.VITE_ADMIN_NOTIFY_EMAIL || 'admin@riman.ae',
    subject: `New Order — ${data.orderId}`,
    data: { orderId: data.orderId, customerName: data.customerName, customerEmail: data.customerEmail, total: data.total, itemCount: data.items.length, paymentMethod: data.paymentMethod, admin: true },
  });
}

export async function sendRentalReminderEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  returnDate: string,
  items: string[],
): Promise<EmailResult> {
  return notify({
    type: 'order_confirmed',
    to: customerEmail,
    subject: `Rental Return Reminder — ${orderId}`,
    data: { customerName, orderId, returnDate, items, reminder: true },
  });
}

export async function sendAppointmentConfirmationEmail(data: {
  name: string;
  email: string;
  date: string;
  time: string;
  gowns: string[];
}): Promise<EmailResult> {
  return notify({
    type: 'appointment_booked',
    to: data.email,
    subject: `Private Viewing Request — ${data.date}`,
    data: { ...data },
  });
}

export async function sendAppointmentAdminAlert(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  gowns: string[];
}): Promise<EmailResult> {
  return notify({
    type: 'appointment_booked',
    to: import.meta.env.VITE_ADMIN_NOTIFY_EMAIL || 'admin@riman.ae',
    subject: `Viewing Request — ${data.name}`,
    data: { ...data, admin: true },
  });
}
