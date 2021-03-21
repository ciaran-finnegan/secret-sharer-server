import stripePackage from "stripe";
import handler from "./libs/handler-lib";
import getRequestUser from "./libs/getRequestUser";
// import { set } from "lodash";

export const main = handler(async (event, context) => {
  try {
    // const domainURL = process.env.domainURL;
    const stripe = stripePackage(process.env.stripeSecretKey);

    // NOTE: See notes file at root of project for details on how this works.
    const user = await getRequestUser(event.requestContext);

    // User Object returns
    // "cognitoUser" : cognitoUser,
    // "cognitoUserEmail" : cognitoUserEmail,
    // "userId" : not set until stripe customer created, id for users table
    // "stripeUserEmail" : not set until stripe customer created, should match cognitoUserEmail
    // "stripeCustomerId" : not set until stripe customer created, e.g. cus_J1I8jUj1s42aOs
    // "stripeSubscription" : not set until stripe customer created, subscription object
    // {"id":"sub_IoN8Ak5pZ8yX6Z",
    // "current_period_end":1614080095,
    // "subscriptionItem":{"id":"si_IoN8wZNNr0N9K2"},
    // "status":"active"}

    const customer = await stripe.customers.create({
      email: (user && user.cognitoUserEmail) || "noemail@error.com",
    });

    console.log({ customer });

    return {
      customerId: customer && customer.id,
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
