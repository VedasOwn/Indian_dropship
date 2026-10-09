'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { stripe, appUrl } from '@/lib/stripe';
import { shippingFor } from '@/lib/format';
import { mail } from '@/lib/email';
import { chf } from '@/lib/format';
import type { FormState } from './auth';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().max(30).optional(),
  street: z.string().trim().min(3, 'Enter your street address').max(120),
  zip: z.string().trim().regex(/^\d{4}$/, 'Swiss postcodes have 4 digits'),
  city: z.string().trim().min(2, 'Enter your city').max(60),
  canton: z.string().trim().max(30).optional(),
  cart: z.string(),
});

const cartSchema = z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(20) })).min(1).max(40);

export async function checkout(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { cart, ...addr } = parsed.data;

  let lines;
  try {
    lines = cartSchema.parse(JSON.parse(cart));
  } catch {
    return { error: 'Your cart is empty or invalid' };
  }

  // Never trust client prices: re-read everything from the DB.
  const products = await db.product.findMany({ where: { id: { in: lines.map((l) => l.id) }, active: true } });
  const byId = new Map(products.map((p) => [p.id, p]));
  if (lines.some((l) => !byId.has(l.id))) return { error: 'Some items are no longer available. Please review your cart.' };

  const subtotal = lines.reduce((s, l) => s + byId.get(l.id)!.priceRappen * l.qty, 0);
  const shipping = shippingFor(subtotal);
  const user = await getUser();

  const order = await db.order.create({
    data: {
      userId: user?.id,
      ...addr,
      phone: addr.phone || null,
      canton: addr.canton || null,
      subtotalRappen: subtotal,
      shippingRappen: shipping,
      totalRappen: subtotal + shipping,
      items: {
        create: lines.map((l) => {
          const p = byId.get(l.id)!;
          return { productId: p.id, name: p.name, qty: l.qty, unitRappen: p.priceRappen };
        }),
      },
    },
  });

  // Without Stripe configured the order stays PENDING and is settled by invoice.
  if (!stripe) {
    await Promise.all([
      mail.orderPlaced(addr.email, order.id, chf(order.totalRappen), true),
      mail.orderAdmin(order.id, `${addr.name} <${addr.email}>`, chf(order.totalRappen), 'awaiting payment'),
    ]);
    redirect(`/orders/${order.id}?placed=1`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'chf',
    customer_email: addr.email,
    client_reference_id: order.id,
    metadata: { orderId: order.id },
    line_items: [
      ...lines.map((l) => {
        const p = byId.get(l.id)!;
        return {
          quantity: l.qty,
          price_data: { currency: 'chf', unit_amount: p.priceRappen, product_data: { name: p.name } },
        };
      }),
      ...(shipping > 0
        ? [{ quantity: 1, price_data: { currency: 'chf', unit_amount: shipping, product_data: { name: 'Shipping to Switzerland' } } }]
        : []),
    ],
    success_url: `${appUrl()}/orders/${order.id}?paid=1`,
    cancel_url: `${appUrl()}/cart`,
  });
  await db.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
  redirect(session.url!);
}
