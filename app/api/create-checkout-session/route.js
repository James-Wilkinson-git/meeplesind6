import { getStripe } from "../../../lib/stripe";

const MAX_AMOUNT_CENTS = 99_999_999;

function parseAmountInCents(amount) {
  if (
    typeof amount !== "string" ||
    !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(amount)
  ) {
    return null;
  }

  const [whole, fraction = ""] = amount.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents <= MAX_AMOUNT_CENTS
    ? cents
    : null;
}

export async function POST(request) {
  let attendee;
  let amountCents;
  try {
    attendee = await request.json();
    amountCents = parseAmountInCents(attendee.amount);
  } catch {
    amountCents = null;
  }

  if (amountCents === null) {
    return Response.json(
      { error: "Enter a valid contribution amount." },
      { status: 400 },
    );
  }

  const name = typeof attendee.name === "string" ? attendee.name.trim() : "";
  const email = typeof attendee.email === "string" ? attendee.email.trim() : "";
  if (
    name.length === 0 ||
    name.length > 150 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return Response.json(
      { error: "Enter a valid name and email address." },
      { status: 400 },
    );
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId || !/^price_[A-Za-z0-9]+$/.test(priceId)) {
    return Response.json(
      { error: "Ticket pricing is not configured yet." },
      { status: 503 },
    );
  }

  const zeroPriceId =
    amountCents === 0 ? process.env.STRIPE_ZERO_PRICE_ID : null;
  if (
    amountCents === 0 &&
    (!zeroPriceId || !/^price_[A-Za-z0-9]+$/.test(zeroPriceId))
  ) {
    return Response.json(
      { error: "Free registration pricing is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const stripe = getStripe();
    const basePrice = await stripe.prices.retrieve(priceId);
    const zeroPrice = zeroPriceId
      ? await stripe.prices.retrieve(zeroPriceId)
      : null;

    if (
      !basePrice.active ||
      basePrice.type !== "one_time" ||
      !basePrice.product ||
      (zeroPrice &&
        (!zeroPrice.active ||
          zeroPrice.type !== "one_time" ||
          zeroPrice.unit_amount !== 0 ||
          zeroPrice.currency !== basePrice.currency))
    ) {
      throw new Error("Stripe price configuration is invalid.");
    }

    const customer = await stripe.customers.create({ name, email });
    const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(
      /\/$/,
      "",
    );
    const amountLineItem =
      amountCents === 0
        ? { price: zeroPrice.id, quantity: 1 }
        : {
            price_data: {
              currency: basePrice.currency,
              product: basePrice.product,
              unit_amount: amountCents,
            },
            quantity: 1,
          };
    const integrationSuffix = Array.from(
      crypto.getRandomValues(new Uint8Array(8)),
      (byte) => String.fromCharCode(97 + (byte % 26)),
    ).join("");
    const session = await stripe.checkout.sessions.create({
      ui_mode: "hosted_page",
      mode: "payment",
      customer: customer.id,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      allow_promotion_codes: false,
      submit_type: "pay",
      locale: "en",
      integration_identifier: `hosted_web_${integrationSuffix}`,
      origin_context: "web",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#registration`,
      line_items: [amountLineItem],
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
