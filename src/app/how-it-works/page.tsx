export const metadata = { title: 'How it works' };

const steps: [string, string[]][] = [
  ['Shop', ['Add products from our catalogue to your cart.', 'Pay in CHF by card, Apple/Google Pay or TWINT.', 'We ship from India to your door in Switzerland (about 2–4 weeks).']],
  ['Request a product', ['Paste a link from any Indian store.', 'We reply with an all-in CHF quote.', 'Accept the quote and we buy and ship it.']],
  ['Travellers', ['Travellers post trips and the fee they ask. People post items they need carried and the fee they offer.', 'Message each other on the site and agree the details.', 'Settle payment directly with each other. Please read the item rules.']],
];

export default function How() {
  return (
    <div className="max-w-2xl space-y-10">
      <h1 className="text-3xl font-semibold">How it works</h1>
      {steps.map(([t, items]) => (
        <section key={t}>
          <h2 className="mb-3 text-xl font-semibold">{t}</h2>
          <ol className="list-decimal space-y-2 pl-5 text-ink/70">{items.map((i) => <li key={i}>{i}</li>)}</ol>
        </section>
      ))}
    </div>
  );
}
