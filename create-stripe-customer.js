import stripePackage from "stripe";
import handler from "./libs/handler-lib";
import getRequestUser from "./libs/getRequestUser";

export const main = handler(async (event, context) => {
  try {
    // const domainURL = process.env.domainURL;
    const stripe = stripePackage(process.env.stripeSecretKey);

    // NOTE: See notes file at root of project for details on how this works.
    const user = await getRequestUser(event.requestContext);

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
