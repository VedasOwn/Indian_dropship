import Link from 'next/link';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await db.product.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' }, take: 4 });
  return (
    <div className="space-y-20">
      <section className="max-w-2xl pt-6">
        <p className="mb-3 text-sm font-medium text-india">India → Switzerland</p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Taste of home,<br />delivered to your door.
        </h1>
        <p className="mt-5 text-lg text-ink/70">
          Order spices, sweets, clothing and more from India. Can't find it? Request any product, or ask a
          traveller to carry a small item for you.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn no-underline">Browse the shop</Link>
          <Link href="/travel" className="btn-ghost no-underline">Find a traveller</Link>
        </div>
      </section>

      <section className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-3">
        {[
          ['Shop', 'Curated Indian products, priced in CHF, shipped to Switzerland.', '/shop'],
          ['Request a product', 'Paste a link from any Indian store. We send you a quote.', '/quote'],
          ['Travellers', 'Going to India or Switzerland? Carry small items for a fee, or ask someone to.', '/travel'],
        ].map(([t, d, h]) => (
          <Link key={t} href={h} className="group bg-white p-6 no-underline">
            <h2 className="font-medium group-hover:text-swiss">{t} →</h2>
            <p className="mt-2 text-sm text-ink/60">{d}</p>
          </Link>
        ))}
      </section>

      {products.length > 0 && (
        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-semibold">New in the shop</h2>
            <Link href="/shop" className="text-sm text-ink/60 hover:text-ink">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
