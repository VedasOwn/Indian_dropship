import Link from 'next/link';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { chf, fmtDate, DIRECTION_LABEL } from '@/lib/format';
import { respondToQuote } from '@/app/actions/quote';
import { closeListing } from '@/app/actions/listing';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'My account' };

export default async function Account({ searchParams }: { searchParams: Promise<{ quote?: string }> }) {
  const user = await requireUser('/account');
  const sp = await searchParams;
  const [orders, quotes, listings, inbox] = await Promise.all([
    db.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    db.quote.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    db.listing.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    db.message.groupBy({ by: ['listingId'], where: { toUserId: user.id }, _count: true }),
  ]);
  const unread = new Map(inbox.map((i) => [i.listingId, i._count]));
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="mb-3 mt-12 text-lg font-semibold">{children}</h2>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold">Hello, {user.name.split(' ')[0]}</h1>
      <p className="text-sm text-ink/60">{user.email}</p>
      {user.role === 'ADMIN' && <p className="mt-3"><Link href="/admin" className="btn-ghost no-underline">Admin panel</Link></p>}
      {sp.quote && <p className="mt-4 border-l-2 border-india pl-3 text-sm">Quote request received. We'll reply with a price soon.</p>}

      <H>Orders</H>
      {orders.length === 0 ? <p className="text-sm text-ink/60">No orders yet.</p> : (
        <ul className="divide-y divide-ink/10 border-y border-ink/10 text-sm">
          {orders.map((o) => (
            <li key={o.id}><Link href={`/orders/${o.id}`} className="flex justify-between py-3 no-underline hover:bg-mist/60">
              <span>{fmtDate(o.createdAt)} · {o.status}</span><span>{chf(o.totalRappen)}</span></Link></li>
          ))}
        </ul>
      )}

      <H>Product requests</H>
      {quotes.length === 0 ? <p className="text-sm text-ink/60">None. <Link href="/quote" className="text-swiss">Request a product</Link></p> : (
        <ul className="space-y-3">
          {quotes.map((q) => (
            <li key={q.id} className="card p-4 text-sm">
              <p className="break-all font-medium">{q.url}</p>
              <p className="text-ink/60">{q.description} · qty {q.qty} · <b>{q.status}</b></p>
              {q.status === 'QUOTED' && q.quotedRappen && (
                <div className="mt-3">
                  <p>Our price: <b>{chf(q.quotedRappen)}</b> all-in{q.adminNote ? ` — ${q.adminNote}` : ''}</p>
                  <form action={respondToQuote} className="mt-2 flex gap-2">
                    <input type="hidden" name="id" value={q.id} />
                    <button name="accept" value="1" className="btn !py-1.5">Accept</button>
                    <button name="accept" value="0" className="btn-ghost !py-1.5">Decline</button>
                  </form>
                </div>
              )}
              {q.status === 'ACCEPTED' && <p className="mt-2 text-india">Accepted — we will contact you with payment details.</p>}
            </li>
          ))}
        </ul>
      )}

      <H>My traveller listings</H>
      {listings.length === 0 ? <p className="text-sm text-ink/60">None. <Link href="/travel/new" className="text-swiss">Post one</Link></p> : (
        <ul className="divide-y divide-ink/10 border-y border-ink/10 text-sm">
          {listings.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 py-3">
              <Link href={`/travel/${l.id}`} className="no-underline hover:text-swiss">
                {l.title} <span className="text-ink/50">· {DIRECTION_LABEL[l.direction]} · {l.status}</span>
                {unread.get(l.id) ? <span className="ml-2 rounded-full bg-swiss px-1.5 py-0.5 text-[10px] text-white">{unread.get(l.id)} msg</span> : null}
              </Link>
              {l.status === 'OPEN' && (
                <form action={closeListing} className="flex gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <button name="status" value="MATCHED" className="btn-ghost !px-3 !py-1 text-xs">Matched</button>
                  <button name="status" value="CLOSED" className="btn-ghost !px-3 !py-1 text-xs">Close</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
