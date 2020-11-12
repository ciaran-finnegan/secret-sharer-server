import stripePackage from "stripe";
import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
  const {body} = JSON.parse(event.body);

  // Handle Stripe Account Lifecycle and Billing Events

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);
  console.log(stripe); // prevent linting errors


  try {
    console.log(body);
    return({
      // return value (200)
    });
  } catch (e) {
    return({
        status: false,
        error: {
        message: e.message,
      }
    });
  }
});

