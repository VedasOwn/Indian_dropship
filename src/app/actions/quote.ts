'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import type { FormState } from './auth';

const schema = z.object({
  url: z.string().trim().url('Enter a valid product link (https://…)').max(500).refine((u) => /^https?:\/\//i.test(u), 'Link must start with http(s)://'),
  description: z.string().trim().min(5, 'Tell us size, colour or variant').max(1000),
  qty: z.coerce.number().int().min(1).max(50),
});

export async function createQuote(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser('/quote');
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.quote.create({ data: { ...parsed.data, userId: user.id } });
  redirect('/account?quote=1');
}

export async function respondToQuote(fd: FormData) {
  const user = await requireUser('/account');
  const id = String(fd.get('id'));
  const accept = fd.get('accept') === '1';
  const q = await db.quote.findUnique({ where: { id } });
  if (!q || q.userId !== user.id || q.status !== 'QUOTED') return;
  await db.quote.update({ where: { id }, data: { status: accept ? 'ACCEPTED' : 'DECLINED' } });
  redirect('/account');
}
