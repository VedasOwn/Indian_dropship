import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const ids = (new URL(req.url).searchParams.get('ids') ?? '').split(',').filter(Boolean).slice(0, 40);
  const products = await db.product.findMany({
    where: { id: { in: ids }, active: true },
    select: { id: true, name: true, slug: true, priceRappen: true, imageUrl: true },
  });
  return NextResponse.json(products);
}
