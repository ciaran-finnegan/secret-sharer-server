// import AWS from "aws-sdk";
import handler from "./libs/handler-lib";
import getCognitoUser from "./libs/getCongitoUser";
import getRequestUser from "./libs/getRequestUser";
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

  const user = await getRequestUser(event.requestContext);
    console.log({ user });

  const stripeCurrentPlanNickName = user.stripeCurrentPlanNickName;
  const stripeSubscriptionStatus = user.stripeSubscriptionStatus;
  const stripeSubscriptionCurrent_period_end = user.stripeSubscriptionCurrent_period_end; // TODO:
  const maxSecrets = 3; // TODO:

  return {
    plans: [
      { order: 0, name: "Free", maxSecrets: process.env.STRIPE_FREE_MAX_MONTHLY_SECRETS },
      { order: 1, name: "Solo Monthly", maxSecrets: process.env.STRIPE_SOLO_MAX_MONTHLY_SECRETS },
      { order: 2, name: "Pro Monthly", maxSecrets: process.env.STRIPE_PRO_MAX_MONTHLY_SECRETS },
    ],
    stripeCurrentPlanNickName: stripeCurrentPlanNickName, // TODO: Update Plan names on client to match Stripe ['Free', 'Solo Monthly', 'Pro Monthly']
    stripeSubscriptionStatus: stripeSubscriptionStatus,
    stripeSubscriptionCurrent_period_end: stripeSubscriptionCurrent_period_end,
    seretsCreatedThisMonth: Count,
    maxSecrets, // TODO: Map plans array to match plan name and use maxSecrets
    secretsAvailable: maxSecrets - Count,
  };
});
