import Link from 'next/link';
import { db } from '@/lib/db';
import { chf, fmtDate, DIRECTION_LABEL } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Travellers' };

export default async function Travel({ searchParams }: { searchParams: Promise<{ t?: string; d?: string }> }) {
  const { t = 'OFFER', d } = await searchParams;
  const type = t === 'REQUEST' ? 'REQUEST' : 'OFFER';
  const direction = d === 'INDIA_TO_CH' || d === 'CH_TO_INDIA' ? d : undefined;
  const listings = await db.listing.findMany({
    where: { type, status: 'OPEN', date: { gte: new Date(Date.now() - 86400000) }, ...(direction ? { direction } : {}) },
    orderBy: { date: 'asc' },
    include: { user: { select: { name: true } } },
    take: 100,
  });
  const tab = (label: string, v: 'OFFER' | 'REQUEST') => (
    <Link href={`/travel?t=${v}${d ? `&d=${d}` : ''}`}
      className={`border-b-2 px-1 pb-2 text-sm no-underline ${type === v ? 'border-swiss font-medium' : 'border-transparent text-ink/60'}`}>
      {label}
    </Link>
  );
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Travellers</h1>
          <p className="mt-2 max-w-xl text-ink/60">
            Travelling between India and Switzerland? Offer to carry small, low-value items for a fee. Need
            something carried? Post a request. Read the <Link href="/rules" className="text-swiss">item rules</Link> first.
          </p>
        </div>
        <Link href="/travel/new" className="btn no-underline">Post a listing</Link>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-4 border-b border-ink/10">
        <div className="flex gap-6 whitespace-nowrap">{tab('Travellers offering', 'OFFER')}{tab('Item requests', 'REQUEST')}</div>
        <div className="flex gap-2 pb-2 text-xs">
          {[['', 'Both'], ['INDIA_TO_CH', 'IN → CH'], ['CH_TO_INDIA', 'CH → IN']].map(([v, l]) => (
            <Link key={v} href={`/travel?t=${type}${v ? `&d=${v}` : ''}`}
              className={`chip no-underline ${(d ?? '') === v ? 'border-ink text-ink' : ''}`}>{l}</Link>
          ))}
        </div>
      </div>

      {listings.length === 0 ? (
        <p className="mt-10 text-ink/60">No open {type === 'OFFER' ? 'traveller offers' : 'requests'} right now. Be the first to post one.</p>
      ) : (
        <ul className="divide-y divide-ink/10">
          {listings.map((l) => (
            <li key={l.id}>
              <Link href={`/travel/${l.id}`} className="flex items-start justify-between gap-4 py-5 no-underline hover:bg-mist/60">
                <div>
                  <p className="font-medium">{l.title}</p>
                  <p className="mt-1 text-sm text-ink/60">
                    {DIRECTION_LABEL[l.direction]} · {type === 'OFFER' ? 'travelling' : 'needed by'} {fmtDate(l.date)} · {l.user.name.split(' ')[0]}
                  </p>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <p className="font-medium">{chf(l.feeRappen)}</p>
                  <p className="text-xs text-ink/50">{type === 'OFFER' ? 'fee asked' : 'fee offered'}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
