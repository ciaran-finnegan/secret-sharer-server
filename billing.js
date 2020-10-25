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

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        // Replace `price_...` with the actual price ID for your subscription
        // you created in step 2 of this guide.
        price: 'price_...',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.json({ id: session.id });
});