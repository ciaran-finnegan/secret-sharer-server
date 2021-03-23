// TODO - Partially complete - handle customer.subscription.updated webhook
// Update users table with items.plan.nickname: and items.plan.product:
import _ from "lodash";
// import stripe from "../index";
// import updateItem from "../../libs/dynamodb/updateItem";
import AWS from "aws-sdk";
// import dynamodb from "../dynamodb";

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

    const customerId = webhookData.customer;
    const productId = _.get(webhookData, "items.data.0.plan.product", null);
    const nickname =  _.get(webhookData, "items.data.0.plan.nickname", null);

    console.log(`DEBUG: customerId: ${customerId}`);
    console.log(`DEBUG: productId: ${productId}`);
    console.log(`DEBUG: nickname: ${nickname}`);

    const documentClient = new AWS.DynamoDB.DocumentClient();

    const queryParams = {
      "TableName": process.env.usersTableName,
      "IndexName": "customerId-index",
      "KeyConditionExpression": "#DYNOBASE_customerId = :pkey",
      "ExpressionAttributeValues": {
        ":pkey": customerId
      },
      "ExpressionAttributeNames": {
        "#DYNOBASE_customerId": "customerId"
      },
      "ScanIndexForward": true,
      "Limit": 100
    };

    const { Items } = await documentClient.query(queryParams).promise();

    console.log(`DEBUG: query returned: ${Items}`);

    const id = Items[0];

    console.log(`DEBUG: id: ${id}`);

    const updateParams = {
      TableName: process.env.usersTableName,
      Key: {
        id : id
        },
        UpdateExpression: "set productId = :productId",
        ExpressionAttributeValues:{
            ":productId":productId
        },
        ReturnValues:"UPDATED_NEW"
    };

    await documentClient.update(updateParams).promise();
    return Promise.resolve();

  } catch (exception) {
    console.log('DEBUG:: Exception running customer.subscription.updated');
    console.warn(exception);
  }
};
