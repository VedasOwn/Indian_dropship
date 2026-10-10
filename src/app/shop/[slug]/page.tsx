import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { chf, FREE_SHIPPING_OVER } from '@/lib/format';
import { AddToCart } from '@/components/AddToCart';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await db.product.findUnique({ where: { slug } });
  if (!p || !p.active) notFound();
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-sm bg-mist">
        {p.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div>
        <span className="chip">{p.category}</span>
        <h1 className="mt-3 text-3xl font-semibold">{p.name}</h1>
        <p className="mt-2 text-2xl">{chf(p.priceRappen)}</p>
        <p className="mt-6 whitespace-pre-line text-ink/70">{p.description}</p>
        <div className="mt-8"><AddToCart id={p.id} /></div>
        <p className="mt-4 text-xs text-ink/50">
          Free shipping over {chf(FREE_SHIPPING_OVER())}. Shipped from India — allow roughly 2–4 weeks.
        </p>
      </div>
    </div>
  );
}
