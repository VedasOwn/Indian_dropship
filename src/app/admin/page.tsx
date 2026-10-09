import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  const [paid, pending, quotes, listings] = await Promise.all([
    db.order.count({ where: { status: 'PAID' } }),
    db.order.count({ where: { status: 'PENDING' } }),
    db.quote.count({ where: { status: { in: ['NEW', 'ACCEPTED'] } } }),
    db.listing.count({ where: { status: 'OPEN' } }),
  ]);
  const tiles = [
    ['Paid, to ship', paid, '/admin/orders'], ['Awaiting payment', pending, '/admin/orders'],
    ['Quotes needing action', quotes, '/admin/quotes'], ['Open traveller listings', listings, '/travel'],
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {tiles.map(([l, n, h]) => (
        <Link key={l} href={h} className="card p-5 no-underline hover:border-ink">
          <p className="text-3xl font-semibold">{n}</p><p className="mt-1 text-sm text-ink/60">{l}</p>
        </Link>
      ))}
    </div>
  );
}
