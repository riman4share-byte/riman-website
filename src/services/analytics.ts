export type AnalyticsEvent =
  | 'product_view'
  | 'add_to_selection'
  | 'remove_from_selection'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'request_viewing'
  | 'begin_checkout'
  | 'order_complete';

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  productId?: string;
  productName?: string;
  category?: string;
  value?: number;
  currency?: string;
  selectionSize?: number;
  intent?: 'sale' | 'rent';
  orderId?: string;
  timestamp: number;
}

const MAX_EVENTS = 500;

function readEvents(): AnalyticsPayload[] {
  try {
    const saved = localStorage.getItem('riman_analytics');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    localStorage.removeItem('riman_analytics');
  }
  return [];
}

function writeEvents(events: AnalyticsPayload[]) {
  localStorage.setItem('riman_analytics', JSON.stringify(events));
}

export function trackEvent(payload: Omit<AnalyticsPayload, 'timestamp'>): void {
  const events = readEvents();
  events.unshift({ ...payload, timestamp: Date.now() });
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;
  writeEvents(events);
}

export function getEvents(): AnalyticsPayload[] {
  return readEvents();
}

export function getFunnelStats(): {
  productViews: number;
  selections: number;
  viewingsRequested: number;
  cartAdditions: number;
  checkoutsStarted: number;
} {
  const events = readEvents();
  return {
    productViews: events.filter(e => e.event === 'product_view').length,
    selections: events.filter(e => e.event === 'add_to_selection').length,
    viewingsRequested: events.filter(e => e.event === 'request_viewing').length,
    cartAdditions: events.filter(e => e.event === 'add_to_cart').length,
    checkoutsStarted: events.filter(e => e.event === 'begin_checkout').length,
  };
}

export function clearEvents(): void {
  localStorage.removeItem('riman_analytics');
}

export const analytics = {
  productView: (product: { id: string; name: string; category?: string }) =>
    trackEvent({ event: 'product_view', productId: product.id, productName: product.name, category: product.category }),
  addToSelection: (product: { id: string; name: string; category?: string }, selectionSize: number) =>
    trackEvent({ event: 'add_to_selection', productId: product.id, productName: product.name, selectionSize }),
  removeFromSelection: (productId: string) =>
    trackEvent({ event: 'remove_from_selection', productId }),
  addToCart: (product: { id: string; name: string; price?: number; intent: 'sale' | 'rent' }) =>
    trackEvent({ event: 'add_to_cart', productId: product.id, productName: product.name, value: product.price, intent: product.intent }),
  removeFromCart: (productId: string) =>
    trackEvent({ event: 'remove_from_cart', productId }),
  requestViewing: (items: { id: string; name: string; intent: 'sale' | 'rent' }[]) =>
    trackEvent({ event: 'request_viewing', selectionSize: items.length, intent: items[0]?.intent }),
  beginCheckout: (value: number, currency = 'AED', itemCount: number) =>
    trackEvent({ event: 'begin_checkout', value, currency, selectionSize: itemCount }),
  orderComplete: (orderId: string, value: number, currency = 'AED', itemCount: number) =>
    trackEvent({ event: 'order_complete', orderId, value, currency, selectionSize: itemCount }),
};