import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { logout } from '@/app/actions/auth';
import { Tricolor, SwissCross } from './Tricolor';
import { CartLink } from './CartLink';

const nav = [
  { href: '/shop', label: 'Shop' },
  { href: '/quote', label: 'Request a product' },
  { href: '/travel', label: 'Travellers' },
  { href: '/how-it-works', label: 'How it works' },
];

export async function Header() {
  const user = await getUser();
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur">
      <Tricolor />
      <div className="container-x flex h-14 items-center justify-between gap-4 border-b border-ink/10">
        <Link href="/" className="flex items-center gap-2 font-semibold no-underline">
          <SwissCross />
          <span>Desi Bridge <span className="text-ink/50">CH</span></span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink/70 no-underline hover:text-ink">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <CartLink />
          {user ? (
            <>
              <Link href="/account" className="text-ink/70 no-underline hover:text-ink">{user.name.split(' ')[0]}</Link>
              <form action={logout}><button className="text-ink/50 hover:text-ink">Log out</button></form>
            </>
          ) : (
            <Link href="/login" className="btn-ghost !py-1.5 no-underline">Log in</Link>
          )}
        </div>
      </div>
      <nav className="container-x flex gap-5 overflow-x-auto border-b border-ink/10 py-2 text-sm md:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap text-ink/70 no-underline">{n.label}</Link>
        ))}
      </nav>
    </header>
  );
}
