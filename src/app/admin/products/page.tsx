import Link from 'next/link';
import { db } from '@/lib/db';
import { chf } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const products = await db.product.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="btn no-underline">Add product</Link></div>
      <ul className="divide-y divide-ink/10 border-y border-ink/10 text-sm">
        {products.map((p) => (
          <li key={p.id}><Link href={`/admin/products/${p.id}`} className="flex justify-between py-3 no-underline hover:bg-mist/60">
            <span>{p.name} <span className="text-ink/50">· {p.category}{!p.active && ' · hidden'}</span></span><span>{chf(p.priceRappen)}</span></Link></li>
        ))}
      </ul>
    </div>
  );
}
