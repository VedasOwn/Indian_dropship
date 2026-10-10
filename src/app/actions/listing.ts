'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { toRappen } from '@/lib/format';
import { mail } from '@/lib/email';
import type { FormState } from './auth';

const schema = z.object({
  type: z.enum(['REQUEST', 'OFFER']),
  direction: z.enum(['INDIA_TO_CH', 'CH_TO_INDIA']),
  title: z.string().trim().min(4, 'Add a short title').max(100),
  description: z.string().trim().min(10, 'Please add a few details').max(1500),
  date: z.coerce.date().refine((d) => d.getTime() > Date.now() - 86400000, 'Date must be today or later'),
  fee: z.coerce.number().min(0, 'Fee cannot be negative').max(500, 'Fee looks too high for a small item'),
  maxWeightKg: z.coerce.number().min(0).max(5, 'Keep it to 5 kg or less').optional(),
  agree: z.literal('on', { message: 'Please confirm you will follow the item rules' }),
});

export async function createListing(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser('/travel/new');
  const raw = Object.fromEntries(fd);
  if (raw.maxWeightKg === '') delete raw.maxWeightKg;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { fee, maxWeightKg, agree: _a, ...rest } = parsed.data;
  const l = await db.listing.create({
    data: { ...rest, userId: user.id, feeRappen: toRappen(fee), maxWeightG: maxWeightKg ? Math.round(maxWeightKg * 1000) : null },
  });
  redirect(`/travel/${l.id}`);
}

export async function closeListing(fd: FormData) {
  const user = await requireUser('/account');
  const id = String(fd.get('id'));
  const status = fd.get('status') === 'MATCHED' ? 'MATCHED' : 'CLOSED';
  await db.listing.updateMany({ where: { id, userId: user.id }, data: { status } });
  redirect('/account');
}

const msgSchema = z.object({
  listingId: z.string(),
  toUserId: z.string(),
  body: z.string().trim().min(2, 'Write a message').max(1000),
});

export async function sendMessage(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = msgSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { listingId, toUserId, body } = parsed.data;
  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status !== 'OPEN') return { error: 'This listing is no longer open' };
  // Only the listing owner and the other party may talk; messages go to/from the owner.
  const validPair = (user.id === listing.userId && toUserId !== user.id) || toUserId === listing.userId;
  if (!validPair || user.id === toUserId) return { error: 'You cannot message this user' };
  const recipient = await db.user.findUnique({ where: { id: toUserId }, select: { email: true } });
  await db.message.create({ data: { listingId, fromUserId: user.id, toUserId, body } });
  // Notification contains no message body or contact details, just a pointer back to the site.
  if (recipient) await mail.newMessage(recipient.email, user.name.split(' ')[0], listing.title, listingId);
  redirect(`/travel/${listingId}?sent=1`);
}
