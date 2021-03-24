// import AWS from "aws-sdk";
import AWS from "aws-sdk";
import handler from "./libs/handler-lib";
import getCognitoUser from "./libs/getCongitoUser";
import getRequestUser from "./libs/getRequestUser";
import plans from "./libs/plans";

export const main = handler(async (event, context) => {
  try {
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
    const stripeSubscriptionCurrent_period_end =
      user.stripeSubscriptionCurrent_period_end; // TODO:
    const stripePriceId = user.stripePriceId;
    const currentPlan =
      plans && plans.find((plan) => plan && plan.priceId === stripePriceId);
    const maxSecrets = currentPlan && currentPlan.maxSecrets; // TODO:

    console.log({
      currentPlan,
      stripePriceId,
      plans,
      maxSecrets,
    });

    return {
      plans,
      stripeCurrentPlanNickName: stripeCurrentPlanNickName, // TODO: Update Plan names on client to match Stripe ['Free', 'Solo Monthly', 'Pro Monthly']
      stripeSubscriptionStatus: stripeSubscriptionStatus,
      stripeSubscriptionCurrent_period_end: stripeSubscriptionCurrent_period_end,
      seretsCreatedThisMonth: Count,
      maxSecrets,
      secretsAvailable: maxSecrets - Count,
    };
  } catch (exception) {
    console.warn(exception);
  }
});
