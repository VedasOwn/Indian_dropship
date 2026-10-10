import type { Product } from '@prisma/client';
import { ActionForm, Field } from './ActionForm';
import { saveProduct } from '@/app/actions/admin';
import { CATEGORIES } from '@/lib/categories';

export function ProductForm({ p }: { p?: Product }) {
  return (
    <ActionForm action={saveProduct} submit={p ? 'Save changes' : 'Create product'} className="max-w-xl space-y-4">
      {p && <input type="hidden" name="id" value={p.id} />}
      <Field label="Name" name="name" defaultValue={p?.name} />
      <Field label="Description" name="description">
        <textarea id="description" name="description" required rows={4} defaultValue={p?.description} className="input" />
      </Field>
      <Field label="Category" name="category">
        <select id="category" name="category" className="input" defaultValue={p?.category ?? CATEGORIES[0]}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (CHF)" name="price" type="number" defaultValue={p ? p.priceRappen / 100 : undefined} />
        <Field label="Weight (g)" name="weightG" type="number" required={false} defaultValue={p?.weightG ?? 0} />
      </div>
      <Field label="Image URL" name="imageUrl" type="url" required={false} defaultValue={p?.imageUrl ?? ''} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> Visible in shop</label>
    </ActionForm>
  );
}
