// import stripePackage from "stripe";
import handler from "./libs/handler-lib";
// import { getPriceId } from "./libs/billing-lib";
// import getItem from "./libs/dynamodb/getItem";

import AWS from "aws-sdk";
import getCognitoUser from "./libs/getCongitoUser";

export const main = handler(async (event, context) => {
  //console.log(process.env);
  const { email } = JSON.parse(event.body);
  console.log(`email sent from client: ${email}`);
  // const domainURL = redirectURL || process.env.domainURL;
  // const priceId = getPriceId(subscriptionName);
  // const stripe = stripePackage(process.env.stripeSecretKey);

  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  // Cognito authentication provider looks like:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_aaaaaaaaa:CognitoSignIn:qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr
  // Where us-east-1_aaaaaaaaa is the User Pool id
  // And qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr is the User Pool User Id
  const parts = authProvider.split(":");
  const userPoolIdParts = parts[parts.length - 3].split("/");

  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUsername = parts[parts.length - 1];

  console.log(`userPoolId, ${userPoolId}`);
  console.log(
    `Cognito userPoolUsername for logged in user on client: ${userPoolUsername}`
  );

  console.log('DEBUG:: Calling getCognitoUser(userPoolUsername)');
  let cognitoUser = await getCognitoUser(userPoolUsername);
  //
  //
  //
  // Ask Ryan how to make this fucking thing wait!!!
  //
  //
  //
  console.log('DEBUG:: getCognitoUser(userPoolUsername) returned');
  console.log(cognitoUser);


  const documentClient = new AWS.DynamoDB.DocumentClient();
  const user = await documentClient
    .scan({
      TableName: "dev-users",
      ScanIndexForward: true,
      FilterExpression: "#DYNOBASE_email = :email",
      ExpressionAttributeNames: {
        "#DYNOBASE_email": "email",
      },
      ExpressionAttributeValues: {
        ":email": "gloverful+43@gmail.com",
      },
    })
    .promise();

  console.log(`user: ${JSON.stringify(user, null, 2)}`);

  console.log(JSON.stringify(user, null, 2));

  try {
    // TODO: On the client, get the current user from Cognito and their email (consider putting on state w/ redux).
    // TODO: In here, based on email (or userId) pull the customer record from dynamo and get stripe customer ID.
    // NOTE: https://stripe.com/docs/billing/subscriptions/integrating-customer-portal#redirect
    // const session = await stripe.billingPortal.sessions.create({
    //   customer_email: email,
    //   return_url: `${domainURL}/settings`,
    // });
    // return {
    //   turkey: true,
    //   session: { id: 123 },
    //   // status: true,
    //   // sessionId: session.id,
    // };
  } catch (e) {
    return {
      status: false,
      error: {
        message: e.message,
      },
    };
  }
});
