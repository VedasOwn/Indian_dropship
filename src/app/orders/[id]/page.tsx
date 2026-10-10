import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { chf, fmtDate } from '@/lib/format';
import { ClearCart } from '@/components/ClearCart';

export const dynamic = 'force-dynamic';

export default async function OrderPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ paid?: string; placed?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const [order, user] = await Promise.all([db.order.findUnique({ where: { id }, include: { items: true } }), getUser()]);
  if (!order) notFound();
  // Orders placed by a logged-in user are private to them (and admins). Guest orders rely on the unguessable id.
  if (order.userId && order.userId !== user?.id && user?.role !== 'ADMIN') notFound();

  return (
    <div className="max-w-xl">
      {(sp.paid || sp.placed) && <ClearCart />}
      <h1 className="text-3xl font-semibold">
        {order.status === 'PAID' || sp.paid ? 'Thank you!' : 'Order received'}
      </h1>
      <p className="mt-2 text-ink/60">
        Order <span className="font-mono text-xs">{order.id}</span> · {fmtDate(order.createdAt)} · Status: <b>{order.status}</b>
      </p>
      {order.status === 'PENDING' && !order.stripeSessionId && (
        <p className="mt-4 border-l-2 border-saffron pl-3 text-sm">
          We have your order. We will email {order.email} with payment details (QR-bill / TWINT) shortly.
        </p>
      )}
      {sp.paid && order.status === 'PENDING' && (
        <p className="mt-4 text-sm text-ink/60">Payment is being confirmed — this page will show PAID within a minute.</p>
      )}
      <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10 text-sm">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between py-3"><span>{i.qty} × {i.name}</span><span>{chf(i.unitRappen * i.qty)}</span></li>
        ))}
        <li className="flex justify-between py-3 text-ink/60"><span>Shipping</span><span>{chf(order.shippingRappen)}</span></li>
        <li className="flex justify-between py-3 font-medium"><span>Total</span><span>{chf(order.totalRappen)}</span></li>
      </ul>
      <p className="mt-6 text-sm text-ink/60">
        Ships to: {order.name}, {order.street}, {order.zip} {order.city}
      </p>
    </div>
  );
}
