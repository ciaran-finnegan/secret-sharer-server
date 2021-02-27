import stripePackage from "stripe";
import handler from "./libs/handler-lib";
import { getPriceId } from "./libs/billing-lib";

export const main = handler(async (event, context) => {
  const { subscriptionName, email, redirectURL } = JSON.parse(event.body);
  const domainURL = redirectURL || process.env.domainURL;
  const priceId = getPriceId(subscriptionName);
  console.log(`subscriptionName: ${subscriptionName}`);
  console.log(`priceId: ${priceId}`);
  console.log(`domainURL: ${domainURL}`);
  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the form
  // For full details see https://stripe.com/docs/api/checkout/sessions/create

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
          currency: "",
        },
      ],
      // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
      success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled`,
    });

    return {
      status: true,
      sessionId: session.id,
    };
  } catch (e) {
    return {
      status: false,
      error: {
        message: e.message,
      },
    };
  }
});
