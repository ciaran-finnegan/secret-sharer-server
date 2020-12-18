import _ from "lodash";
import stripe from "../index";

export default async (webhookData = null) => {
  if (webhookData.payment_status && webhookData.payment_status === "paid") {
    const stripeCustomer = await stripe.customers.retrieve(
      webhookData.customer
    );

    const stripeSubscription = await stripe.subscriptions.retrieve(
      webhookData.subscription
    );

    console.log(
      JSON.stringify({ stripeCustomer, stripeSubscription }, null, 2)
    );

    const data = {
      customer: {
        id: _.get(stripeCustomer, "id", null),
        email: _.get(stripeCustomer, "email", null),
      },
      subscription: {
        id: _.get(stripeSubscription, "id", null),
        status: _.get(stripeSubscription, "status", null),
        current_period_end: _.get(
          stripeSubscription,
          "current_period_end",
          null
        ),
        subscriptionItem: {
          id: _.get(stripeSubscription, "items.data.0.id", null),
        },
      },
    };

    console.log(data);
  }

  return Promise.resolve();
};
