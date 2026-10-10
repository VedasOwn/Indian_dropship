import { CartView } from './CartView';
import { getUser } from '@/lib/auth';

export const metadata = { title: 'Cart' };

export default async function CartPage() {
  const user = await getUser();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Your cart</h1>
      <CartView user={user ? { name: user.name, email: user.email, phone: user.phone ?? '' } : null}
        shipFlat={Math.round(Number(process.env.SHIPPING_FLAT_CHF ?? '9.90') * 100)}
        freeOver={Math.round(Number(process.env.FREE_SHIPPING_OVER_CHF ?? '120') * 100)} />
    </div>
  );
}
