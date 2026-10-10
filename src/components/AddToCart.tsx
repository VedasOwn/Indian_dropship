'use client';
import { useState } from 'react';
import { addToCart } from './cart';

export function AddToCart({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  return (
    <button className="btn" onClick={() => { addToCart(id); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? 'Added ✓' : 'Add to cart'}
    </button>
  );
}
