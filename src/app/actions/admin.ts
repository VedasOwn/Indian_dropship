'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { slugify, toRappen } from '@/lib/format';
import type { FormState } from './auth';

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(2000),
  category: z.string().trim().min(2).max(40),
  price: z.coerce.number().positive('Price must be above 0').max(5000),
  weightG: z.coerce.number().int().min(0).max(30000).default(0),
  imageUrl: z.string().trim().url().optional().or(z.literal('')),
  active: z.string().optional(),
});

export async function saveProduct(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, price, active, imageUrl, ...rest } = parsed.data;
  const data = { ...rest, priceRappen: toRappen(price), imageUrl: imageUrl || null, active: active === 'on' };
  if (id) {
    await db.product.update({ where: { id }, data });
  } else {
    let slug = slugify(rest.name) || 'item';
    if (await db.product.findUnique({ where: { slug } })) slug += '-' + Math.random().toString(36).slice(2, 6);
    await db.product.create({ data: { ...data, slug } });
  }
  revalidatePath('/shop');
  redirect('/admin/products');
}

export async function setOrderStatus(fd: FormData) {
  await requireAdmin();
  const status = z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']).parse(fd.get('status'));
  await db.order.update({ where: { id: String(fd.get('id')) }, data: { status } });
  revalidatePath('/admin/orders');
}

export async function answerQuote(fd: FormData) {
  await requireAdmin();
  const price = Number(fd.get('price'));
  if (!(price > 0)) return;
  await db.quote.update({
    where: { id: String(fd.get('id')) },
    data: { quotedRappen: toRappen(price), adminNote: String(fd.get('note') ?? '').slice(0, 500) || null, status: 'QUOTED' },
  });
  revalidatePath('/admin/quotes');
}
