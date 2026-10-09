import Link from 'next/link';
import { db } from '@/lib/db';
import { CATEGORIES } from '@/lib/categories';
import { ProductCard } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop' };

export default async function Shop({ searchParams }: { searchParams: Promise<{ c?: string; q?: string }> }) {
  const { c, q } = await searchParams;
  const products = await db.product.findMany({
    where: {
      active: true,
      ...(c ? { category: c } : {}),
      ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div>
      <h1 className="text-3xl font-semibold">Shop</h1>
      <form className="mt-5 flex gap-2" action="/shop">
        <input name="q" defaultValue={q} placeholder="Search products" className="input max-w-xs" />
        {c && <input type="hidden" name="c" value={c} />}
        <button className="btn-ghost">Search</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/shop" className={`chip no-underline ${!c ? 'border-ink text-ink' : ''}`}>All</Link>
        {CATEGORIES.map((x) => (
          <Link key={x} href={`/shop?c=${encodeURIComponent(x)}`} className={`chip no-underline ${c === x ? 'border-ink text-ink' : ''}`}>{x}</Link>
        ))}
      </div>
      {products.length === 0 ? (
        <p className="mt-12 text-ink/60">
          Nothing here yet. Can't find what you want? <Link href="/quote" className="text-swiss">Request a product</Link>.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
