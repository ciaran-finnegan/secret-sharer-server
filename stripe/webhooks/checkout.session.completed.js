import _ from "lodash";
import stripe from "../index";
import putItem from "../../libs/dynamodb/putItem";

export default async (webhookData = null) => {
  try {
    console.log('DEBUG:: executing checkout.session.completed.js');
    // Ask Ryan why we do this?
    // const customerId = await stripe.customers.retrieve(
    //   webhookData.customer
    // );

    const stripeCustomerId = webhookData.customer;
    console.log(typeof(stripeCustomerId));

    const stripeSubscription = await stripe.subscriptions.retrieve(
      webhookData.subscription
    );

    const tableName = process.env.usersTableName;
    console.log(`DEBUG:: tableName : ${tableName}`);
    // We use the Stripe customer ID as the primary key to make updates more efficient
    const primaryKey = stripeCustomerId;
    console.log(typeof(stripeCustomerId));
    console.log(`DEBUG:: primaryKey : ${primaryKey}`);
    const tableData = {
      "customerId" : stripeCustomerId,
      "customer_email" : webhookData.customer_email,
      "stripeSubscriptionId" : _.get(stripeSubscription, "id", null),
      "stripeSubscriptionStatus" : _.get(stripeSubscription, "status", null),
      "stripeSubscriptionCurrent_period_end" : _.get(stripeSubscription,"current_period_end", null),
      "stripeSubscriptionItem" : {
        id: _.get(stripeSubscription, "items.data.0.id", null),
      },
    };
    console.log(`DEBUG:: data : ${tableData}`);

    await putItem(tableName, primaryKey, tableData);

    return Promise.resolve();
  } catch (exception) {
    console.log('DEBUG:: Exception running checkout.session.completed');
    console.warn(exception);
  }
};
