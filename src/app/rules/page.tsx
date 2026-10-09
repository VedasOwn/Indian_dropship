export const metadata = { title: 'Traveller item rules' };

export default function Rules() {
  return (
    <article className="prose-sm max-w-2xl space-y-5 text-ink/80">
      <h1 className="text-3xl font-semibold text-ink">Traveller item rules</h1>
      <p>
        Carrying items for another person makes <b>you</b> responsible for them at customs and security. These
        rules protect travellers and senders. Desi Bridge only connects people; it does not inspect, insure or
        guarantee any item or hand-over.
      </p>
      <h2 className="text-lg font-semibold text-ink">Allowed</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Small, low-value, legal personal items: clothing, books, sealed packaged snacks and spices for personal use, cosmetics, small gifts.</li>
        <li>Items the traveller has seen, handled and is happy to open for any inspection.</li>
      </ul>
      <h2 className="text-lg font-semibold text-ink">Never</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Medicines, prescription drugs, supplements, or anything containing controlled substances.</li>
        <li>Meat, dairy, honey and other animal products; plants, seeds, soil.</li>
        <li>Cash, gold, jewellery, valuables or high-value electronics.</li>
        <li>Alcohol, tobacco, e-cigarettes; weapons; counterfeit or branded-fake goods.</li>
        <li>Sealed or closed packages you cannot inspect. Never carry a package you have not opened and checked.</li>
        <li>Anything you are unsure about. If in doubt, say no.</li>
      </ul>
      <h2 className="text-lg font-semibold text-ink">Good practice</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Agree item, fee, date and hand-over place in writing before travelling.</li>
        <li>Meet in public places. Keep communication in the site's messages until you trust each other.</li>
        <li>Declare goods at customs when required. Import duty or VAT is the responsibility of the parties involved.</li>
      </ul>
      <p className="text-xs text-ink/50">This page is general guidance, not legal advice. Check current Swiss (BAZG/FOCBS) and Indian customs rules before you travel.</p>
    </article>
  );
}
