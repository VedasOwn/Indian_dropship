'use client';
import { useSyncExternalStore } from 'react';

export type CartLine = { id: string; qty: number };
const KEY = 'cart.v1';
const listeners = new Set<() => void>();
let cache = '[]';

function read(): string {
  try { return localStorage.getItem(KEY) ?? '[]'; } catch { return '[]'; }
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = read(); cb(); } };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(cb); window.removeEventListener('storage', onStorage); };
}
export function setCart(lines: CartLine[]) {
  cache = JSON.stringify(lines);
  try { localStorage.setItem(KEY, cache); } catch { /* storage blocked */ }
  listeners.forEach((l) => l());
}
export function useCartRaw(): string {
  return useSyncExternalStore(subscribe, () => (cache = read()), () => '[]');
}
export function useCart(): CartLine[] {
  const raw = useCartRaw();
  try { return JSON.parse(raw) as CartLine[]; } catch { return []; }
}
export function addToCart(id: string, qty = 1) {
  const lines = JSON.parse(read()) as CartLine[];
  const l = lines.find((x) => x.id === id);
  if (l) l.qty = Math.min(20, l.qty + qty); else lines.push({ id, qty });
  setCart(lines);
}
