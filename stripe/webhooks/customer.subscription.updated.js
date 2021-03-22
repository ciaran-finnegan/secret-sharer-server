// TODO - Partially complete - handle customer.subscription.updated webhook
// Update users table with items.plan.nickname: and items.plan.product:
import _ from "lodash";
// import stripe from "../index";
import updateItem from "../../libs/dynamodb/updateItem";

export default async (webhookData = null) => {
  try {
    console.log('DEBUG:: executing customer.subscription.updated.js');
    // const stripeCustomer = await stripe.customers.retrieve(
    //   webhookData.customer
    // );
    // e.g. "cus_J9dJndJqcPiOQJ"
    // console.log(`DEBUG: stripeCustomer: ${stripeCustomer}`);
    // const stripeSubscription = await stripe.subscriptions.retrieve(
    //   webhookData.subscription
    // );
    console.log(`DEBUG: customerId: ${webhookData.customer}`);
    console.log('DEBUG: items.data.0.plan.nickname');
    console.log(_.get(webhookData, "items.data.0.plan.nickname", null));
    console.log('DEBUG: items.data.0.plan.product');
    console.log(_.get(webhookData, "items.data.0.plan.product", null));

    const params = {
        customerId: webhookData.customer,
      subscription: {
        productId: _.get(webhookData, "items.data.0.plan.product", null),
        nickname: _.get(webhookData, "items.data.0.plan.nickname", null),
      },
    };

    console.log(`DEBUG: Update Item Params`);
    console.log(params);


// TODO, query users table by stripeCustomer, new Secondary Index required
    await updateItem(process.env.usersTableName, params);

    return Promise.resolve();
  } catch (exception) {
    console.log('DEBUG:: Exception running customer.subscription.updated');
    console.warn(exception);
  }
};
