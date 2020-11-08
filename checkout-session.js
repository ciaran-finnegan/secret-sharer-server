import stripePackage from "stripe";
import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
  const { sessionId } = JSON.parse(event.body);
  
  // Retrieve the Session Details
  // Includes the customerId which can be added to the Cognigo User ID as an attribute stripeCustomerId


  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return({
      status: true,
      session: session,
      customerId: session.customerId
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

