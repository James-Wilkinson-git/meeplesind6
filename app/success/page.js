import Link from "next/link";

export const metadata = { title: "Thanks | Meeples in D6" };

export default function SuccessPage() {
  return (
    <main className="success-page">
      <section>
        <p className="success-eyebrow">Meeples in D6</p>
        <h1>Thanks for joining us.</h1>
        <p>
          Stripe has returned you from checkout. Your payment status is
          confirmed by Stripe.
        </p>
        <Link href="/">Back to event details</Link>
      </section>
    </main>
  );
}
