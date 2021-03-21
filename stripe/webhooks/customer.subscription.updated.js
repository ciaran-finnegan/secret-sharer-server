// TODO - Partially complete - handle customer.subscription.updated webhook
// Update users table with items.plan.nickname: and items.plan.product:
import _ from "lodash";
import stripe from "../index";
import putItem from "../../libs/dynamodb/putItem";

export default async (webhookData = null) => {
  try {
    console.log('DEBUG:: executing customer.subscription.updated.js');
    const stripeCustomer = await stripe.customers.retrieve(
      webhookData.customer
    );
    // e.g. "cus_J9dJndJqcPiOQJ"
    console.log(`DEBUG: stripeCustomer: ${stripeCustomer}`);
    const stripeSubscription = await stripe.subscriptions.retrieve(
      webhookData.subscription
    );
    console.log(`DEBUG: stripeSubscription: ${stripeCustomer}`);

// TODO, query users table by stripeCustomer, new Secondary Index required
    await putItem(process.env.usersTableName, {
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
    console.log('DEBUG:: Exception running checkout.session.completed');
    console.warn(exception);
  }
};
