import handler from "./libs/handler-lib";
import checkoutSessionCompleted from "./stripe/webhooks/checkout.session.completed";

const webhooks = {
  "checkout.session.completed": checkoutSessionCompleted,
  "customer.subscription.updated": customerSubscriptionUpdated
};

// TODO
// Validate Stripe Webhook Signature
// https://stripe.com/docs/webhooks/signatures#verify-official-libraries

export const main = handler(async (event, context) => {
  const stripeWebhook = event.body ? JSON.parse(event.body) : null;
  const parsedStripeWebhook =
    stripeWebhook && stripeWebhook.data && stripeWebhook.data.object;

  if (!stripeWebhook || !parsedStripeWebhook) {
    return null;
  }

  if (!webhooks[stripeWebhook.type]) {
    return null;
  }

  console.log(stripeWebhook.type);

  await webhooks[stripeWebhook.type](parsedStripeWebhook);

  return {
    status: 200,
    message: "Webhook received.",
  };
  // // const body = JSON.parse(event.body);

  // console.log(body);

  // // Handle Stripe Account Lifecycle and Billing Events

  // // Load our secret key from the  environment variables
  // const stripe = stripePackage(process.env.stripeSecretKey);
  // console.log(stripe); // prevent linting errors

  // try {
  //   console.log(body);
  //   return {
  //     status: 200,
  //     message: "Webhook received.",
  //     // return value (200)
  //   };
  // } catch (e) {
  //   return {
  //     status: false,
  //     error: {
  //       message: e.message,
  //     },
  //   };
  // }
});
