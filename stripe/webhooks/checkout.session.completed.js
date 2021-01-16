import _ from "lodash";
import stripe from "../index";
import putItem from "../../libs/dynamodb/putItem";

export default async (webhookData = null) => {
  try {
    const stripeCustomer = await stripe.customers.retrieve(
      webhookData.customer
    );
    const stripeSubscription = await stripe.subscriptions.retrieve(
      webhookData.subscription
    );

    await putItem("dev-users", {
      email: _.get(stripeCustomer, "email", null),
      customerId: _.get(stripeCustomer, "id", null),
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
    });

    return Promise.resolve();
  } catch (exception) {
    console.warn(exception);
  }
};
