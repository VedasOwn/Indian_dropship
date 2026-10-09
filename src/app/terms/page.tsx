export const metadata = { title: 'Terms' };

export default function Terms() {
  return (
    <article className="max-w-2xl space-y-4 text-sm text-ink/80">
      <h1 className="text-3xl font-semibold text-ink">Terms of use</h1>
      <p className="rounded-sm border border-saffron bg-saffron/10 p-3 text-xs">
        Draft placeholder — have these terms reviewed by a Swiss lawyer before launch.
      </p>
      <h2 className="text-lg font-semibold text-ink">Shop orders</h2>
      <p>Prices are in CHF. Orders are shipped from India; delivery times are estimates. Import VAT, duties or customs fees charged on arrival may be payable by the buyer.</p>
      <h2 className="text-lg font-semibold text-ink">Traveller marketplace</h2>
      <p>Desi Bridge is a notice board that lets users contact each other. We are not a party to any agreement between travellers and requesters, do not hold funds, and are not responsible for items, delays, loss, customs seizures or disputes. Users must follow the traveller item rules and applicable law, and may not use the service to move prohibited or restricted goods.</p>
      <h2 className="text-lg font-semibold text-ink">Accounts</h2>
      <p>Keep your credentials safe. We may remove listings or accounts that break these terms.</p>
    </article>
  );
}
