'use client';
import Link from 'next/link';
import { useCart } from './cart';

export function CartLink() {
  const n = useCart().reduce((s, l) => s + l.qty, 0);
  return (
    <Link href="/cart" className="relative text-ink/70 no-underline hover:text-ink">
      Cart{n > 0 && <span className="ml-1 rounded-full bg-swiss px-1.5 py-0.5 text-[10px] text-white">{n}</span>}
    </Link>
  );
}
