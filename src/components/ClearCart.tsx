'use client';
import { useEffect } from 'react';
import { setCart } from './cart';

export function ClearCart() {
  useEffect(() => setCart([]), []);
  return null;
}
