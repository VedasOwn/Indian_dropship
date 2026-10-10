import { ActionForm, Field } from '@/components/ActionForm';
import { resetPassword } from '@/app/actions/reset';

export const metadata = { title: 'Set new password', robots: { index: false } };

export default async function Reset({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">Set a new password</h1>
      <ActionForm action={resetPassword} submit="Update password">
        <input type="hidden" name="token" value={token} />
        <Field label="New password" name="password" type="password" hint="At least 8 characters" />
      </ActionForm>
    </div>
  );
}
