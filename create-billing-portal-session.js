// import stripePackage from "stripe";
import handler from "./libs/handler-lib";
// import { getPriceId } from "./libs/billing-lib";
import getItem from "./libs/dynamodb/getItem";

export const main = handler(async (event, context) => {
  const { email } = JSON.parse(event.body);
  // const domainURL = redirectURL || process.env.domainURL;
  // const priceId = getPriceId(subscriptionName);
  // const stripe = stripePackage(process.env.stripeSecretKey);

  const user = await getItem("dev-users", {
    email,
  });

  console.log(JSON.stringify(user, null, 2));

  // try {
  //   // TODO: On the client, get the current user from Cognito and their email (consider putting on state w/ redux).
  //   // TODO: In here, based on email (or userId) pull the customer record from dynamo and get stripe customer ID.
  //   // NOTE: https://stripe.com/docs/billing/subscriptions/integrating-customer-portal#redirect
  //   const session = await stripe.billingPortal.sessions.create({
  //     customer_email: email,
  //     return_url: `${domainURL}/settings`,
  //   });

  return {
    turkey: true,
    session: { id: 123 },
    // status: true,
    // sessionId: session.id,
  };
  // } catch (e) {
  //   return {
  //     status: false,
  //     error: {
  //       message: e.message,
  //     },
  //   };
  // }
});
