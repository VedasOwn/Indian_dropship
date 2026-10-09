'use server';
import { createHash, randomBytes } from 'crypto';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createSession, hashPassword } from '@/lib/auth';
import { mail } from '@/lib/email';
import type { FormState } from './auth';

const sha = (t: string) => createHash('sha256').update(t).digest('hex');
const TTL_MS = 60 * 60 * 1000;
const COOLDOWN_MS = 60 * 1000;

export async function requestReset(_: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get('email') ?? '').trim().toLowerCase();
  if (!z.string().email().safeParse(email).success) return { error: 'Enter a valid email' };

  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    // Cooldown stops someone from using us to spam a victim's inbox.
    const recent = await db.passwordReset.findFirst({ where: { userId: user.id, createdAt: { gt: new Date(Date.now() - COOLDOWN_MS) } } });
    if (!recent) {
      const token = randomBytes(32).toString('base64url');
      await db.passwordReset.create({ data: { userId: user.id, tokenHash: sha(token), expiresAt: new Date(Date.now() + TTL_MS) } });
      await mail.passwordReset(user.email, token);
    }
  }
  // Same response whether or not the account exists (no account enumeration).
  redirect('/forgot?sent=1');
}

const schema = z.object({ token: z.string().min(20), password: z.string().min(8, 'Password must be at least 8 characters').max(100) });

export async function resetPassword(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { token, password } = parsed.data;

  const passwordHash = await hashPassword(password);
  // Atomically claim the token so it can only be used once, even with concurrent requests.
  const claimed = await db.passwordReset.updateMany({
    where: { tokenHash: sha(token), usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() },
  });
  if (claimed.count !== 1) return { error: 'This reset link is invalid or has expired. Request a new one.' };

  const reset = await db.passwordReset.findUniqueOrThrow({ where: { tokenHash: sha(token) } });
  const user = await db.user.update({ where: { id: reset.userId }, data: { passwordHash, passwordChangedAt: new Date() } });
  await db.passwordReset.deleteMany({ where: { userId: user.id, id: { not: reset.id } } });
  await mail.passwordChanged(user.email);
  await createSession(user.id);
  redirect('/account');
}
