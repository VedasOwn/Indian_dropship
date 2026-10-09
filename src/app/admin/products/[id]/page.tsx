import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProductForm } from '@/components/ProductForm';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await db.product.findUnique({ where: { id } });
  if (!p) notFound();
  return <div><h1 className="mb-6 text-2xl font-semibold">Edit product</h1><ProductForm p={p} /></div>;
}
