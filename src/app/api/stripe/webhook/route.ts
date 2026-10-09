import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { mail } from '@/lib/email';
import { chf } from '@/lib/format';

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const s = event.data.object;
    const orderId = s.metadata?.orderId;
    if (orderId && s.payment_status === 'paid') {
      const { count } = await db.order.updateMany({ where: { id: orderId, status: 'PENDING' }, data: { status: 'PAID' } });
      // count is 0 on Stripe retries / duplicate events, so emails go out once.
      if (count === 1) {
        const o = await db.order.findUnique({ where: { id: orderId } });
        if (o) await Promise.all([
          mail.orderPlaced(o.email, o.id, chf(o.totalRappen), false),
          mail.orderAdmin(o.id, `${o.name} <${o.email}>`, chf(o.totalRappen), 'PAID'),
        ]);
      }
    }
  }
  return NextResponse.json({ received: true });
}
