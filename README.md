# Desi Bridge CH

Order from India, delivered in Switzerland — plus a traveller board where people can carry small items for a fee.

- **Shop** — curated catalogue in CHF, cart, Stripe Checkout (cards, Apple/Google Pay, TWINT).
- **Request a product** — paste any Indian store link, admin replies with an all-in CHF quote, user accepts/declines.
- **Travellers** — travellers *offer* to carry items; people *request* items be carried. In-site messaging. Match-only: no money is held.
- **Admin** (`/admin`) — products, orders (status), quotes. The user registering with `ADMIN_EMAIL` becomes admin.

Stack: Next.js 15 (App Router, server actions), TypeScript, Tailwind, Prisma + PostgreSQL, Stripe, jose/bcrypt sessions.

## Run locally

```bash
cp .env.example .env        # edit DATABASE_URL, SESSION_SECRET (32+ chars), ADMIN_EMAIL
npm install
npm run db:push             # create tables
npm run db:seed             # sample products
npm run dev
```

Without `STRIPE_SECRET_KEY`, checkout creates the order as `PENDING` ("we'll send payment details") so you can invoice manually.

## Stripe / TWINT

1. Set `STRIPE_SECRET_KEY`, and `APP_URL` to your public URL.
2. Dashboard → Settings → Payment methods: enable **TWINT**, Apple Pay, Google Pay (Checkout uses your dashboard methods; TWINT needs CHF).
3. Add a webhook endpoint `APP_URL/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`; put its signing secret in `STRIPE_WEBHOOK_SECRET`.

## Deploy

Any Node host + managed Postgres (Vercel + Neon/Supabase, Fly, Railway). Set the env vars above, run `prisma db push` (or add migrations), build with `npm run build`.

## Known gaps / before launch

- No email notifications (new messages, quotes, order updates) — add Resend/Postmark.
- No password reset or email verification.
- No rate limiting on login/register/messages (add at the edge or via Upstash).
- Terms and Privacy are **placeholders**; get them reviewed by a Swiss lawyer. Check customs/VAT treatment of your parcels.
- Product images are URLs only (no upload yet).
