import { db } from '@/lib/db';
import { chf, fmtDate } from '@/lib/format';
import { setOrderStatus } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';
const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default async function Orders() {
  const orders = await db.order.findMany({ orderBy: { createdAt: 'desc' }, include: { items: true }, take: 100 });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Orders</h1>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="card p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <p><b>{o.name}</b> · {o.email}{o.phone ? ` · ${o.phone}` : ''}</p>
              <p>{fmtDate(o.createdAt)} · <b>{chf(o.totalRappen)}</b></p>
            </div>
            <p className="text-ink/60">{o.street}, {o.zip} {o.city}{o.canton ? ` (${o.canton})` : ''}</p>
            <p className="mt-1">{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</p>
            <form action={setOrderStatus} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="input !w-auto">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              <button className="btn-ghost !py-1.5">Update</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
