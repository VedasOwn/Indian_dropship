import Link from 'next/link';
import { ActionForm, Field } from '@/components/ActionForm';
import { login } from '@/app/actions/auth';

export const metadata = { title: 'Log in' };

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = '/' } = await searchParams;
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <ActionForm action={login} submit="Log in">
        <input type="hidden" name="next" value={next} />
        <Field label="Email" name="email" type="email" />
        <Field label="Password" name="password" type="password" />
      </ActionForm>
      <p className="mt-4 text-sm"><Link href="/forgot" className="text-ink/60 hover:text-ink">Forgot password?</Link></p>
      <p className="mt-6 text-sm text-ink/60">
        New here? <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-swiss">Create an account</Link>
      </p>
    </div>
  );
}
