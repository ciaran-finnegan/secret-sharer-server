import AWS from "aws-sdk";
import getCognitoUser from "./getCongitoUser";

export default async (requestContext = {}) => {
  const authProvider = requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolUsername = parts[parts.length - 1];
  const cognitoUser = await getCognitoUser(userPoolUsername);
  const cognitoUserEmail = cognitoUser.UserAttributes[2].Value;
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const { Items } = await documentClient
    .scan({
      TableName: process.env.usersTableName,
      ScanIndexForward: true,
      "FilterExpression": "#DYNOBASE_customer_email = :customer_email",
      ExpressionAttributeNames: {
        "#DYNOBASE_customer_email": "customer_email"
      },
      ExpressionAttributeValues: {
        ":customer_email": cognitoUserEmail,
      },
    })
    .promise();

  // Ciaran - not sure what we are trying to achieve here?
  // Ask Ryan to explain what this is doing
  // Commenting out for now and returning user object below
  // won't contain a Stripe e-mail or Customer ID until a checkoutsession has completed

  // return Items && Items.find((item) => item.email === cognitoUserEmail);

  const user = {
    "cognitoUser" : cognitoUser,
    "cognitoUserEmail" : cognitoUserEmail,
    "stripeCurrentPlanNickName" : Items[0].nickname,
    "stripeSubscriptionId" : Items[0].stripeSubscriptionId,
    "stripeSubscriptionStatus" : Items[0].stripeSubscriptionStatus,
    "stripeCustomerEmail" : Items[0].customer_email, // should match cognitoUserEmail, TODO set after Stripe customer creation
    "stripeSubscriptionCurrent_period_end" : Items[0].stripeSubscriptionCurrent_period_end,
    "stripeProductId" : Items[0].productId,
    "stripeSubscriptionItem" : Items[0].stripeSubscriptionItem,
    "stripeCustomerId" : Items[0].customerId
  };

  console.log(`DEBUG: User Object: ${user}`);

  return user;
};