import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div>
      <nav className="mb-8 flex gap-5 border-b border-ink/10 pb-3 text-sm">
        {[['/admin', 'Overview'], ['/admin/products', 'Products'], ['/admin/orders', 'Orders'], ['/admin/quotes', 'Quotes']].map(([h, l]) => (
          <Link key={h} href={h} className="no-underline text-ink/70 hover:text-ink">{l}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
