import Link from 'next/link';
import type { Product } from '@prisma/client';
import { chf } from '@/lib/format';

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/shop/${p.slug}`} className="group block no-underline">
      <div className="aspect-square overflow-hidden rounded-sm bg-mist">
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">{p.category}</div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium group-hover:text-swiss">{p.name}</h3>
      <p className="text-sm text-ink/60">{chf(p.priceRappen)}</p>
    </Link>
  );
}
