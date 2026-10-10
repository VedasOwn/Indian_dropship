import 'server-only';
import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
export const appUrl = () => process.env.APP_URL ?? 'http://localhost:3000';
