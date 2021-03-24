// TODO - Partially complete - handle customer.subscription.updated webhook
// Update users table with items.plan.nickname: and items.plan.product:
import _ from "lodash";
// import stripe from "../index";
import updateItem from "../../libs/dynamodb/updateItem";
// import AWS from "aws-sdk";
// import dynamodb from "../dynamodb";

export default async (webhookData = null) => {
  try {
    console.log("DEBUG:: executing customer.subscription.updated.js");
    // const stripeCustomer = await stripe.customers.retrieve(
    //   webhookData.customer
    // );
    // e.g. "cus_J9dJndJqcPiOQJ"
    // console.log(`DEBUG: stripeCustomer: ${stripeCustomer}`);
    // const stripeSubscription = await stripe.subscriptions.retrieve(
    //   webhookData.subscription
    // );

    const customerId = webhookData.customer;
    const productId = _.get(webhookData, "items.data.0.plan.product", null);
    const nickname = _.get(webhookData, "items.data.0.plan.nickname", null);
    const priceId = _.get(webhookData, "items.data.0.price.id", null); // NOTE: Same data is available at items.data.0.plan.id

    console.log(`DEBUG: customerId: ${customerId}`);
    console.log(`DEBUG: productId: ${productId}`);
    console.log(`DEBUG: nickname: ${nickname}`);
    console.log(`DEBUG: priceId: ${priceId}`);

    const tableName = process.env.usersTableName;
    console.log(`DEBUG:: tableName : ${tableName}`);

    const primaryKey = customerId;
    console.log(`DEBUG:: primaryKey : ${primaryKey}`);

    const tableData = {
      productId: productId,
      nickname: nickname,
      priceId: priceId,
    };

    console.log(`DEBUG:: tableData.productId : ${tableData.productId}`);
    console.log(`DEBUG:: tableData.nickname : ${tableData.nickname}`);
    console.log(`DEBUG:: tableData.priceId : ${tableData.priceId}`);
    console.log(`DEBUG:: tableData : ${JSON.stringify(tableData)}`);

    await updateItem(tableName, primaryKey, tableData);

    return Promise.resolve();
  } catch (exception) {
    console.log("DEBUG:: Exception running customer.subscription.updated");
    console.warn(exception);
  }
};
