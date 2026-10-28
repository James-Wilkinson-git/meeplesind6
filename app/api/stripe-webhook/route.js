import { getStripe } from "../../../lib/stripe";

export async function POST(request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return Response.json(
      { error: "Webhook signature configuration is missing." },
      { status: 400 },
    );
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message,
    );
    return Response.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  if (
    (event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded") &&
    event.data.object.payment_status === "paid"
  ) {
    const session = event.data.object;
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    if (customerId && session.consent?.promotions) {
      try {
        await getStripe().customers.update(customerId, {
          metadata: {
            marketing_consent: session.consent.promotions,
            marketing_consent_session_id: session.id,
            marketing_consent_recorded_at: new Date(
              session.created * 1000,
            ).toISOString(),
          },
        });
      } catch (error) {
        console.error(
          "Unable to save checkout consent to Stripe customer:",
          error,
        );
        return Response.json(
          { error: "Unable to process checkout consent." },
          { status: 500 },
        );
      }
    }
  }

  return Response.json({ received: true });
}
