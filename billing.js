import stripePackage from "stripe";
import handler from "./libs/handler-lib";
import { calculateCost } from "./libs/billing-lib";

export const main = handler(async (event, context) => {
  const { subscriptionId, source } = JSON.parse(event.body);
  // console.log(`subscriptionId: ${subscriptionId}`);
  const sub = calculateCost(subscriptionId);
  // console.log(`amount: ${sub.amount}`);
  // console.log(`description: ${sub.description}`);

  let amount = sub.amount;
  let description = sub.description;

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd"
  });
  return { status: true };
});