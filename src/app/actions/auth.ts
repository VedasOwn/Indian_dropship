'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createSession, destroySession, hashPassword, verifyPassword } from '@/lib/auth';

export type FormState = { error?: string } | undefined;

const safeNext = (n: FormDataEntryValue | null) => {
  const s = typeof n === 'string' ? n : '/';
  return s.startsWith('/') && !s.startsWith('//') ? s : '/';
};

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  phone: z.string().trim().max(30).optional(),
});

export async function register(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password, phone } = parsed.data;
  if (await db.user.findUnique({ where: { email } })) return { error: 'An account with this email already exists' };
  const isAdmin = !!process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.toLowerCase();
  const user = await db.user.create({
    data: { name, email, phone: phone || null, passwordHash: await hashPassword(password), role: isAdmin ? 'ADMIN' : 'USER' },
  });
  await createSession(user.id);
  redirect(safeNext(fd.get('next')));
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get('email') ?? '').trim().toLowerCase();
  const password = String(fd.get('password') ?? '');
  const user = await db.user.findUnique({ where: { email } });
  // Constant-ish work either way to avoid trivially leaking which emails exist.
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) return { error: 'Incorrect email or password' };
  await createSession(user.id);
  redirect(safeNext(fd.get('next')));
}

export async function logout() {
  await destroySession();
  redirect('/');
}
