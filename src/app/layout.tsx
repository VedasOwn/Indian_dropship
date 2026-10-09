import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: { default: 'Desi Bridge CH — India to Switzerland', template: '%s · Desi Bridge CH' },
  description: 'Order from India, delivered in Switzerland. Or connect with travellers to carry small items.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Header />
        <main className="container-x py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
