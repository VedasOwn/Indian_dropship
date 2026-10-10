'use client';
import { useActionState } from 'react';
import type { FormState } from '@/app/actions/auth';

export function ActionForm({
  action,
  children,
  submit,
  className = 'space-y-4',
}: {
  action: (s: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submit: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className}>
      {children}
      {state?.error && (
        <p role="alert" className="border-l-2 border-swiss pl-3 text-sm text-swiss">{state.error}</p>
      )}
      <button className="btn" disabled={pending}>{pending ? 'Please wait…' : submit}</button>
    </form>
  );
}

export function Field({
  label, name, type = 'text', required = true, placeholder, defaultValue, hint, children,
}: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
  defaultValue?: string | number; hint?: string; children?: React.ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      {children ?? (
        <input id={name} name={name} type={type} required={required} placeholder={placeholder}
          defaultValue={defaultValue} className="input" step={type === 'number' ? 'any' : undefined} />
      )}
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}
