import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { ActionForm, Field } from '@/components/ActionForm';
import { createListing } from '@/app/actions/listing';

export const metadata = { title: 'Post a listing' };

export default async function NewListing() {
  const user = await getUser();
  if (!user) return <p><Link href="/login?next=/travel/new" className="btn no-underline">Log in to post</Link></p>;
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-3xl font-semibold">Post a listing</h1>
      <ActionForm action={createListing} submit="Publish listing">
        <Field label="I am…" name="type">
          <select id="type" name="type" className="input" defaultValue="OFFER">
            <option value="OFFER">A traveller offering to carry items</option>
            <option value="REQUEST">Someone needing an item carried</option>
          </select>
        </Field>
        <Field label="Direction" name="direction">
          <select id="direction" name="direction" className="input">
            <option value="INDIA_TO_CH">India → Switzerland</option>
            <option value="CH_TO_INDIA">Switzerland → India</option>
          </select>
        </Field>
        <Field label="Title" name="title" placeholder="e.g. Zurich ← Mumbai, space for 2 kg" />
        <Field label="Details" name="description" hint="Cities, what you can carry or need, pickup/drop-off. Do not share phone numbers here — use messages.">
          <textarea id="description" name="description" required rows={4} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Travel date / needed by" name="date" type="date" />
          <Field label="Fee (CHF)" name="fee" type="number" hint="Fee asked / offered" />
        </div>
        <Field label="Max weight (kg, optional)" name="maxWeightKg" type="number" required={false} />
        <label className="flex items-start gap-2 text-sm text-ink/70">
          <input type="checkbox" name="agree" className="mt-1" required />
          <span>I will follow the <Link href="/rules" className="text-swiss">item rules</Link>: small, low-value, legal items only, packed openly and inspectable.</span>
        </label>
      </ActionForm>
    </div>
  );
}
