import stripePackage from "stripe";
import handler from "./libs/handler-lib";
import getRequestUser from "./libs/getRequestUser";

export const main = handler(async (event, context) => {
  try {
    const domainURL = process.env.domainURL;
    const stripe = stripePackage(process.env.stripeSecretKey);

    // NOTE: See notes file at root of project for details on how this works.
    const user = await getRequestUser(event.requestContext);
    console.log({ user });
    const session = await stripe.billingPortal.sessions.create({
      customer: user && user.stripeCustomerId,
      return_url: `${domainURL}/settings`,
    });

    return {
      session,
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
