'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart, setCart, useCartRaw } from '@/components/cart';
import { ActionForm, Field } from '@/components/ActionForm';
import { checkout } from '@/app/actions/checkout';

type P = { id: string; name: string; slug: string; priceRappen: number; imageUrl: string | null };
const chf = (r: number) => new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(r / 100);

export function CartView({ user, shipFlat, freeOver }: {
  user: { name: string; email: string; phone: string } | null; shipFlat: number; freeOver: number;
}) {
  const lines = useCart();
  const raw = useCartRaw();
  const [products, setProducts] = useState<Record<string, P>>({});
  const [loaded, setLoaded] = useState(false);
  const idsKey = lines.map((l) => l.id).sort().join(',');

  useEffect(() => {
    if (!idsKey) { setLoaded(true); return; }
    fetch(`/api/products?ids=${idsKey}`).then((r) => r.json()).then((ps: P[]) => {
      setProducts(Object.fromEntries(ps.map((p) => [p.id, p])));
      // Drop items that no longer exist / are inactive.
      const valid = new Set(ps.map((p) => p.id));
      const cleaned = lines.filter((l) => valid.has(l.id));
      if (cleaned.length !== lines.length) setCart(cleaned);
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  if (!loaded) return <p className="text-ink/50">Loading…</p>;
  if (lines.length === 0)
    return <p className="text-ink/60">Your cart is empty. <Link href="/shop" className="text-swiss">Browse the shop</Link>.</p>;

  const subtotal = lines.reduce((s, l) => s + (products[l.id]?.priceRappen ?? 0) * l.qty, 0);
  const shipping = subtotal >= freeOver ? 0 : shipFlat;
  const update = (id: string, qty: number) =>
    setCart(qty <= 0 ? lines.filter((l) => l.id !== id) : lines.map((l) => (l.id === id ? { ...l, qty: Math.min(20, qty) } : l)));

  return (
    <div className="grid gap-10 md:grid-cols-5">
      <div className="md:col-span-3">
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {lines.map((l) => {
            const p = products[l.id];
            if (!p) return null;
            return (
              <li key={l.id} className="flex items-center gap-4 py-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-mist">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 text-sm">
                  <Link href={`/shop/${p.slug}`} className="font-medium no-underline hover:text-swiss">{p.name}</Link>
                  <p className="text-ink/60">{chf(p.priceRappen)}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <button aria-label="Decrease" className="btn-ghost !px-2.5 !py-1" onClick={() => update(l.id, l.qty - 1)}>−</button>
                  <span className="w-5 text-center">{l.qty}</span>
                  <button aria-label="Increase" className="btn-ghost !px-2.5 !py-1" onClick={() => update(l.id, l.qty + 1)}>+</button>
                </div>
              </li>
            );
          })}
        </ul>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd>{chf(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink/60">Shipping</dt><dd>{shipping === 0 ? 'Free' : chf(shipping)}</dd></div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-medium"><dt>Total</dt><dd>{chf(subtotal + shipping)}</dd></div>
        </dl>
      </div>

      <div className="md:col-span-2">
        <h2 className="mb-4 font-medium">Delivery address (Switzerland)</h2>
        <ActionForm action={checkout} submit="Continue to payment">
          <input type="hidden" name="cart" value={raw} />
          <Field label="Full name" name="name" defaultValue={user?.name} />
          <Field label="Email" name="email" type="email" defaultValue={user?.email} />
          <Field label="Phone (optional)" name="phone" required={false} defaultValue={user?.phone} />
          <Field label="Street & number" name="street" />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Postcode" name="zip" placeholder="8001" />
            <div className="col-span-2"><Field label="City" name="city" /></div>
          </div>
          <Field label="Canton (optional)" name="canton" required={false} />
          <p className="text-xs text-ink/50">Import VAT or customs charges, if any, may apply on arrival.</p>
        </ActionForm>
      </div>
    </div>
  );
}
