import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { ActionForm, Field } from '@/components/ActionForm';
import { createQuote } from '@/app/actions/quote';

export const metadata = { title: 'Request a product' };

export default async function QuotePage() {
  const user = await getUser();
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold">Request any product</h1>
      <p className="mt-2 text-ink/60">
        Found something on an Indian store that isn't in our shop? Paste the link. We'll reply with a
        final CHF price including purchase, handling and shipping — no obligation.
      </p>
      {user ? (
        <div className="mt-8">
          <ActionForm action={createQuote} submit="Request a quote">
            <Field label="Product link" name="url" type="url" placeholder="https://…" />
            <Field label="Details" name="description" hint="Size, colour, variant, anything we should know">
              <textarea id="description" name="description" required rows={3} className="input" />
            </Field>
            <Field label="Quantity" name="qty" type="number" defaultValue={1} />
          </ActionForm>
        </div>
      ) : (
        <p className="mt-8"><Link href="/login?next=/quote" className="btn no-underline">Log in to request a quote</Link></p>
      )}
    </div>
  );
}
