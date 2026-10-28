import { getStripe } from "../../../lib/stripe";

export async function POST() {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId || !/^price_[A-Za-z0-9]+$/.test(priceId)) {
    return Response.json(
      { error: "Ticket pricing is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(
      /\/$/,
      "",
    );
    const session = await getStripe().checkout.sessions.create({
      ui_mode: "hosted_page",
      mode: "payment",
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      allow_promotion_codes: false,
      submit_type: "pay",
      consent_collection: { promotions: "auto" },
      name_collection: { individual: { enabled: true } },
      locale: "en",
      integration_identifier: "hosted_web_0001",
      origin_context: "web",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#registration`,
      line_items: [{ price: priceId, quantity: 1 }],
    });

    if (!session.url) {
      throw new Error("Stripe did not return a hosted Checkout URL.");
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Unable to create hosted Checkout session:", error);
    return Response.json(
      { error: "We couldn't load checkout. Please try again in a moment." },
      { status: 500 },
    );
  }
}
