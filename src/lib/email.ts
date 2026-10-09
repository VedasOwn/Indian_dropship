import 'server-only';
import { appUrl } from './stripe';

type Mail = { to: string; subject: string; text: string };

/**
 * Sends via Resend when RESEND_API_KEY + EMAIL_FROM are set; otherwise logs to the server console (dev).
 * Never throws: a mail failure must not break the user's action.
 */
export async function sendEmail({ to, subject, text }: Mail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const body = `${text}\n\n—\nDesi Bridge CH · ${appUrl()}`;
  if (!key || !from) {
    console.log(`[email:dev] to=${to} subject="${subject}"\n${body}\n`);
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, text: body }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error('[email] send failed', res.status, await res.text());
  } catch (e) {
    console.error('[email] send error', e);
  }
}

export const adminEmail = () => process.env.ADMIN_EMAIL || null;
const link = (path: string) => `${appUrl()}${path}`;

export const mail = {
  passwordReset: (to: string, token: string) =>
    sendEmail({
      to,
      subject: 'Reset your password',
      text: `Use this link to set a new password (valid for 1 hour):\n${link(`/reset/${token}`)}\n\nIf you didn't ask for this, you can ignore this email.`,
    }),
  passwordChanged: (to: string) =>
    sendEmail({
      to,
      subject: 'Your password was changed',
      text: `Your password was just changed. If this wasn't you, reset it immediately: ${link('/forgot')}`,
    }),
  newMessage: (to: string, fromName: string, listingTitle: string, listingId: string) =>
    sendEmail({
      to,
      subject: `New message from ${fromName}`,
      text: `${fromName} wrote to you about "${listingTitle}".\nRead and reply: ${link(`/travel/${listingId}`)}`,
    }),
  quoteReady: (to: string, priceChf: string) =>
    sendEmail({
      to,
      subject: 'Your product quote is ready',
      text: `We've priced your request at ${priceChf} all-in.\nReview and accept or decline: ${link('/account')}`,
    }),
  quoteRequested: (url: string, who: string) => {
    const a = adminEmail();
    return a ? sendEmail({ to: a, subject: 'New quote request', text: `${who} requested a quote for ${url}\n${link('/admin/quotes')}` }) : undefined;
  },
  quoteResponded: (accepted: boolean, who: string) => {
    const a = adminEmail();
    return a ? sendEmail({ to: a, subject: `Quote ${accepted ? 'accepted' : 'declined'}`, text: `${who} ${accepted ? 'accepted' : 'declined'} your quote.\n${link('/admin/quotes')}` }) : undefined;
  },
  orderPlaced: (to: string, orderId: string, total: string, awaitingPayment: boolean) =>
    sendEmail({
      to,
      subject: 'We received your order',
      text: `Thank you! Order total: ${total}.\n${awaitingPayment ? 'We will send payment details shortly.\n' : ''}View your order: ${link(`/orders/${orderId}`)}`,
    }),
  orderAdmin: (orderId: string, who: string, total: string, status: string) => {
    const a = adminEmail();
    return a ? sendEmail({ to: a, subject: `Order ${status}: ${total}`, text: `${who} — ${total} (${status})\n${link('/admin/orders')}\nOrder ${orderId}` }) : undefined;
  },
  orderStatus: (to: string, orderId: string, status: string) =>
    sendEmail({
      to,
      subject: `Your order is ${status.toLowerCase()}`,
      text: `Your order status is now: ${status}.\n${link(`/orders/${orderId}`)}`,
    }),
};
