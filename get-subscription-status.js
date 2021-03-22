// import AWS from "aws-sdk";
import handler from "./libs/handler-lib";
import getCognitoUser from "./libs/getCongitoUser";
import AWS from "aws-sdk";

export const main = handler(async (event, context) => {
  // NOTE: See notes file at root of project for details on how this works.
  console.log(JSON.stringify(event, null, 2));
  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolUsername = parts[parts.length - 1];
  const cognitoUser = await getCognitoUser(userPoolUsername);

  console.log(`DEBUG: CognitoUsername: ${cognitoUser.Username}`);

  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  console.log(`DEBUG: firstDayOfMonth: ${firstDayOfMonth.getTime()} `);

  const documentClient = new AWS.DynamoDB.DocumentClient();

  const { Count } = await documentClient
    .query({
      TableName: process.env.tableName,
      IndexName: "createdBy-index",
      KeyConditionExpression: "#DYNOBASE_createdBy = :pkey",
      ExpressionAttributeValues: {
        ":pkey": cognitoUser.Username,
        ":createdAt": firstDayOfMonth.getTime(),
      },
      ExpressionAttributeNames: {
        "#DYNOBASE_createdBy": "createdBy",
        "#DYNOBASE_createdAt": "createdAt",
      },
      ScanIndexForward: true,
      Limit: 100,
      FilterExpression: "#DYNOBASE_createdAt >= :createdAt",
    })
    .promise();

  console.log(`DEBUG: Count: ${Count} `);

  const planSecrets = 2; // TODO:

  return {
    plans: [
      { order: 0, name: "free", maxSecrets: process.env.STRIPE_FREE_MAX_MONTHLY_SECRETS },
      { order: 1, name: "solo", maxSecrets: process.env.STRIPE_SOLO_MAX_MONTHLY_SECRETS },
      { order: 2, name: "pro", maxSecrets: process.env.STRIPE_PRO_MAX_MONTHLY_SECRETS },
    ],
    currentPlan: "pro", // TODO: Map price plan to string name of plan before responding. ['free', 'solo', 'pro']
    // handle customer.subscription.updated event from stripe
    // items.plan.nickname: "Solo Monthly",
    // items.plan.product: "prod_J1JpFshOXkwR3V",
    seretsCreatedThisMonth: Count,
    planSecrets,
    secretsAvailable: planSecrets - Count,
  };
});
