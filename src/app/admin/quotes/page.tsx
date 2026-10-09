import { db } from '@/lib/db';
import { chf } from '@/lib/format';
import { answerQuote } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';

export default async function Quotes() {
  const quotes = await db.quote.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true }, take: 100 });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Quote requests</h1>
      <ul className="space-y-3">
        {quotes.map((q) => (
          <li key={q.id} className="card p-4 text-sm">
            <a href={q.url} target="_blank" rel="noopener noreferrer nofollow" className="break-all font-medium text-swiss">{q.url}</a>
            <p className="text-ink/60">{q.description} · qty {q.qty} · {q.user.name} ({q.user.email}) · <b>{q.status}</b>{q.quotedRappen ? ` · quoted ${chf(q.quotedRappen)}` : ''}</p>
            {(q.status === 'NEW' || q.status === 'QUOTED') && (
              <form action={answerQuote} className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="id" value={q.id} />
                <input name="price" type="number" step="0.05" min="0.05" required placeholder="All-in CHF" className="input !w-32" />
                <input name="note" placeholder="Note (optional)" className="input !w-64" />
                <button className="btn !py-1.5">Send quote</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
