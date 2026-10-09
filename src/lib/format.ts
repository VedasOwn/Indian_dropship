export const chf = (rappen: number) =>
  new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(rappen / 100);

export const toRappen = (v: string | number) => Math.round(Number(v) * 100);

export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('en-CH', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').slice(0, 60);

export const DIRECTION_LABEL = {
  INDIA_TO_CH: 'India → Switzerland',
  CH_TO_INDIA: 'Switzerland → India',
} as const;

export const SHIPPING_FLAT = () => Math.round(Number(process.env.SHIPPING_FLAT_CHF ?? '9.90') * 100);
export const FREE_SHIPPING_OVER = () => Math.round(Number(process.env.FREE_SHIPPING_OVER_CHF ?? '120') * 100);
export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_OVER() ? 0 : SHIPPING_FLAT();
