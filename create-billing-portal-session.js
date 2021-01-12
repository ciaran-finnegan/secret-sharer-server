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
    // TODO: On the client, get the current user from Cognito and their email (consider putting on state w/ redux).
    // TODO: In here, based on email (or userId) pull the customer record from dynamo and get stripe customer ID.
    // NOTE: https://stripe.com/docs/billing/subscriptions/integrating-customer-portal#redirect
    const session = await stripe.billingPortal.sessions.create({
      customer_email: email,
      return_url: `${domainURL}/settings`,
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
