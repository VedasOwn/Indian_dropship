export const metadata = { title: 'Privacy' };

export default function Privacy() {
  return (
    <article className="max-w-2xl space-y-4 text-sm text-ink/80">
      <h1 className="text-3xl font-semibold text-ink">Privacy</h1>
      <p className="rounded-sm border border-saffron bg-saffron/10 p-3 text-xs">
        Draft placeholder — complete and review against the Swiss FADP (and GDPR if you serve EU residents) before launch.
      </p>
      <p>We store your name, email, optional phone, delivery address and the messages you send, only to run orders and the traveller board. Passwords are stored hashed. Card and TWINT details are handled by Stripe and never touch our servers. We do not sell your data.</p>
      <p>To delete your account or data, contact us at the email shown on the site.</p>
    </article>
  );
}
