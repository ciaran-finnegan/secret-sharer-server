import stripePackage from "stripe";
import handler from "./libs/handler-lib";
// import { getPriceId } from "./libs/billing-lib";
// import getItem from "./libs/dynamodb/getItem";

import AWS from "aws-sdk";
import getCognitoUser from "./libs/getCongitoUser";

export const main = handler(async (event, context) => {
  try {
    const domainURL = process.env.domainURL;
    const stripe = stripePackage(process.env.stripeSecretKey);

    // NOTE: See notes file at root of project for details on how this works.
    const authProvider =
      event.requestContext.identity.cognitoAuthenticationProvider;
    const parts = authProvider.split(":");
    const userPoolUsername = parts[parts.length - 1];
    const cognitoUser = await getCognitoUser(userPoolUsername);
    const cognitoUserEmail = cognitoUser.UserAttributes[2].Value;
    const documentClient = new AWS.DynamoDB.DocumentClient();

    const { Items } = await documentClient
      .scan({
        TableName: "dev-users",
        ScanIndexForward: true,
        FilterExpression: "#DYNOBASE_email = :email",
        ExpressionAttributeNames: {
          "#DYNOBASE_email": "email",
        },
        ExpressionAttributeValues: {
          ":email": cognitoUserEmail,
        },
      })
      .promise();

    const user = Items && Items.find((item) => item.email === cognitoUserEmail);
    const session = await stripe.billingPortal.sessions.create({
      customer: user && user.customerId,
      return_url: `${domainURL}/settings`,
    });

    return {
      session,
    };
  } catch (e) {
    return {
      status: false,
      error: {
        message: e.message,
      },
    };
  }
});
