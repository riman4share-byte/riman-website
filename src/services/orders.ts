import { supabase, edgeFunctionsBase, supabaseAnonKey } from './supabase';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  product_type: string;
  intent?: 'sale' | 'rent';
  size?: string;
  quantity: number;
  unit_price: number;
  rental_start_date?: string;
  rental_end_date?: string;
  security_deposit?: number;
  deposit_status?: string;
  deposit_deductions?: number;
  deposit_notes?: string;
}

export interface Order {
  id?: string;
  customer_id?: string;
  user_id?: string;
  status: string;
  type: string;
  subtotal: number;
  notes?: string;
  admin_notes?: string;
  payment_method?: string;
  payment_status?: string;
  stripe_session_id?: string;
  items?: OrderItem[];
  created_at?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  customer_city?: string;
  customer_country?: string;
}

// Server-trusted order creation ONLY. Direct client-side order inserts were
// removed (2026-09-16 hardening): RLS now denies user INSERT on `orders`, so
// every atelier-payment order must go through the create-order edge function,
// which derives prices/order type from the database. Failures THROW — they
// must never silently downgrade to a client-computed order.
export async function createOrderViaEdge(payload: {
  lines: Array<{
    product_id: string;
    intent: 'sale' | 'rent';
    quantity: number;
    rental_start_date?: string;
    rental_end_date?: string;
  }>;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  notes?: string;
  captchaToken?: string;
}): Promise<string> {
  const endpoint = import.meta.env.VITE_CREATE_ORDER_ENDPOINT ||
    (edgeFunctionsBase ? `${edgeFunctionsBase}/create-order` : '');
  if (!endpoint) {
    throw new Error('The order service is not configured. Please contact the atelier to book payment.');
  }

  const body = { ...payload, customerEmail: payload.customerEmail.trim().toLowerCase() };
  const gatewayHeaders: Record<string, string> = supabaseAnonKey
    ? { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` }
    : {};

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...gatewayHeaders },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const raw = await response.text().catch(() => '');
      let message = '';
      try { message = JSON.parse(raw)?.error || ''; } catch { /* non-json body */ }
      console.error('[Riman] create-order rejected:', response.status, raw);
      throw new Error(message || 'The order service is temporarily unavailable. Please try again.');
    }

    const { orderId } = await response.json();
    if (!orderId) throw new Error('The order service returned no order id.');
    return orderId;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error('Could not reach the order service. Check your connection and try again.');
    }
    throw err;
  }
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (name, email, phone),
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapDbOrder);
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (name, email, phone),
      order_items (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data ? mapDbOrder(data) : null;
}

export async function updateOrderStatus(id: string, status: string, adminNotes?: string): Promise<Order> {
  const updates: any = { status, updated_at: new Date().toISOString() };
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapDbOrder(data);
}

function mapDbOrder(row: any): Order {
  return {
    id: row.id,
    customer_id: row.customer_id,
    user_id: row.user_id,
    status: row.status,
    payment_method: row.payment_method,
    payment_status: row.payment_status,
    stripe_session_id: row.stripe_session_id,
    type: row.type,
    subtotal: row.subtotal,
    notes: row.notes,
    admin_notes: row.admin_notes,
    items: row.order_items?.map((item: any) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_type: item.product_type,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.unit_price,
      rental_start_date: item.rental_start_date,
      rental_end_date: item.rental_end_date,
      security_deposit: item.security_deposit,
      deposit_status: item.deposit_status,
      deposit_deductions: item.deposit_deductions,
      deposit_notes: item.deposit_notes,
    })) || [],
    created_at: row.created_at,
    customer_name: row.customers?.name,
    customer_email: row.customers?.email,
    customer_phone: row.customers?.phone,
  };
}