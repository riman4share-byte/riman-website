/**
 * Shared transactional-email HTML builders (pure). Used by create-checkout
 * (verify path) and stripe-webhook (fulfillment path); everything they send
 * goes through the notification_outbox first.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; padding: 40px;">
    <h1 style="font-size: 20px; letter-spacing: 4px; text-transform: uppercase; color: #b8860b; margin-bottom: 30px; text-align: center;">Atelier Riman</h1>
    <h2 style="font-size: 15px; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a;">${escapeHtml(title)}</h2>
    ${bodyHtml}
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
    <p style="font-size: 12px; color: #666; text-align: center;">Al Zahra St, Sharjah, UAE | hello@riman.ae</p>
  </div>
</body>
</html>`;
}

export function confirmationEmailHtml(order: { customer_name?: string | null; subtotal?: number | null }, orderId: string): string {
  return shell(
    'Payment received',
    `<p>Dear ${escapeHtml(order.customer_name || 'Valued Client')},</p>
     <p>Thank you for your order. Your payment has been received and your pieces are being prepared at our Sharjah atelier.</p>
     <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
     <p><strong>Total Paid:</strong> AED ${Number(order.subtotal || 0).toLocaleString()}</p>`,
  );
}

export function adminAlertEmailHtml(rows: Array<[string, string]>): string {
  const tr = rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;">${escapeHtml(k)}</td><td style="padding:4px 0;">${escapeHtml(v)}</td></tr>`).join('');
  return shell('Order alert', `<table>${tr}</table>`);
}
