import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { chf, fmtDate, DIRECTION_LABEL } from '@/lib/format';
import { ActionForm, Field } from '@/components/ActionForm';
import { sendMessage } from '@/app/actions/listing';

export const dynamic = 'force-dynamic';

export default async function ListingPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ sent?: string; with?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const [l, user] = await Promise.all([
    db.listing.findUnique({ where: { id }, include: { user: { select: { id: true, name: true } } } }),
    getUser(),
  ]);
  if (!l) notFound();
  const isOwner = user?.id === l.userId;
  const isOffer = l.type === 'OFFER';

  // Thread: messages between the current user and the counterparty on this listing.
  const messages = user
    ? await db.message.findMany({
        where: { listingId: l.id, OR: isOwner ? [{ toUserId: user.id }, { fromUserId: user.id }] : [{ fromUserId: user.id }, { toUserId: user.id }] },
        orderBy: { createdAt: 'asc' },
        include: { from: { select: { id: true, name: true } } },
      })
    : [];
  // Owner replies to the most recent sender; others write to the owner.
  const replyTo = isOwner ? [...messages].reverse().find((m) => m.fromUserId !== user!.id)?.fromUserId : l.userId;

  return (
    <div className="max-w-2xl">
      <Link href={`/travel?t=${l.type}`} className="text-sm text-ink/50 no-underline hover:text-ink">← All listings</Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`chip ${isOffer ? 'border-india text-india' : 'border-saffron text-[#b36200]'}`}>
          {isOffer ? 'Traveller offer' : 'Item request'}
        </span>
        <span className="chip">{DIRECTION_LABEL[l.direction]}</span>
        {l.status !== 'OPEN' && <span className="chip">{l.status}</span>}
      </div>
      <h1 className="mt-3 text-3xl font-semibold">{l.title}</h1>
      <p className="mt-1 text-sm text-ink/60">
        {l.user.name.split(' ')[0]} · {isOffer ? 'travelling' : 'needed by'} {fmtDate(l.date)}
        {l.maxWeightG ? ` · up to ${l.maxWeightG / 1000} kg` : ''}
      </p>
      <p className="mt-6 whitespace-pre-line">{l.description}</p>
      <p className="mt-6 text-lg">{chf(l.feeRappen)} <span className="text-sm text-ink/50">{isOffer ? 'fee asked' : 'fee offered'}</span></p>

      <div className="mt-6 border-l-2 border-saffron pl-3 text-xs text-ink/60">
        Desi Bridge only connects people. Agree the details and settle payment directly. Never carry anything you
        haven't inspected, and follow the <Link href="/rules" className="text-swiss">item rules</Link>.
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-medium">Messages</h2>
        {!user ? (
          <Link href={`/login?next=/travel/${l.id}`} className="btn no-underline">Log in to contact {l.user.name.split(' ')[0]}</Link>
        ) : (
          <>
            {messages.length > 0 && (
              <ul className="mb-4 space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className={`max-w-[85%] rounded-sm border border-ink/10 px-3 py-2 text-sm ${m.fromUserId === user.id ? 'ml-auto bg-mist' : ''}`}>
                    <p className="text-xs text-ink/50">{m.fromUserId === user.id ? 'You' : m.from.name} · {fmtDate(m.createdAt)}</p>
                    <p className="mt-1 whitespace-pre-line">{m.body}</p>
                  </li>
                ))}
              </ul>
            )}
            {sp.sent && <p className="mb-3 text-sm text-india">Message sent.</p>}
            {l.status !== 'OPEN' ? (
              <p className="text-sm text-ink/60">This listing is {l.status.toLowerCase()}.</p>
            ) : replyTo ? (
              <ActionForm action={sendMessage} submit="Send message">
                <input type="hidden" name="listingId" value={l.id} />
                <input type="hidden" name="toUserId" value={replyTo} />
                <Field label={isOwner ? 'Reply' : `Message ${l.user.name.split(' ')[0]}`} name="body">
                  <textarea id="body" name="body" required rows={3} className="input" />
                </Field>
              </ActionForm>
            ) : (
              <p className="text-sm text-ink/60">No messages yet. They will appear here when someone contacts you.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
