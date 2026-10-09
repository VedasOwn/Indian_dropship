import Link from 'next/link';
import { ActionForm, Field } from '@/components/ActionForm';
import { register } from '@/app/actions/auth';

export const metadata = { title: 'Create account' };

export default async function Register({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = '/' } = await searchParams;
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">Create account</h1>
      <ActionForm action={register} submit="Create account">
        <input type="hidden" name="next" value={next} />
        <Field label="Full name" name="name" />
        <Field label="Email" name="email" type="email" />
        <Field label="Phone / WhatsApp (optional)" name="phone" required={false} />
        <Field label="Password" name="password" type="password" hint="At least 8 characters" />
      </ActionForm>
      <p className="mt-6 text-sm text-ink/60">
        Already registered? <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-swiss">Log in</Link>
      </p>
    </div>
  );
}
