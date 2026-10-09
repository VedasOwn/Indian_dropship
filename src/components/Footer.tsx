import Link from 'next/link';
import { Tricolor } from './Tricolor';

export function Footer() {
  return (
    <footer className="mt-24">
      <Tricolor />
      <div className="container-x flex flex-col gap-3 py-8 text-sm text-ink/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Desi Bridge CH · Made for the Indian community in Switzerland</p>
        <div className="flex gap-5">
          <Link href="/rules" className="no-underline hover:text-ink">Traveller rules</Link>
          <Link href="/terms" className="no-underline hover:text-ink">Terms</Link>
          <Link href="/privacy" className="no-underline hover:text-ink">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
