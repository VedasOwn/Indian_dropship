import Link from 'next/link';
import { ActionForm, Field } from '@/components/ActionForm';
import { requestReset } from '@/app/actions/reset';

export const metadata = { title: 'Forgot password' };

export default async function Forgot({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">Forgot password</h1>
      {sent ? (
        <p className="border-l-2 border-india pl-3 text-sm">
          If an account exists for that email, we've sent a reset link. It's valid for 1 hour. Check your spam folder too.
        </p>
      ) : (
        <ActionForm action={requestReset} submit="Send reset link">
          <Field label="Email" name="email" type="email" />
        </ActionForm>
      )}
      <p className="mt-6 text-sm"><Link href="/login" className="text-swiss">Back to log in</Link></p>
    </div>
  );
}
