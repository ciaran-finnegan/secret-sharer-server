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
      FilterExpression: "#DYNOBASE_email = :email",
      ExpressionAttributeNames: {
        "#DYNOBASE_email": "email",
      },
      ExpressionAttributeValues: {
        ":email": cognitoUserEmail,
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
    "userId" : Items[0],
    "stripeUserEmail" : Items[1], // should match cognitoUserEmail, TODO set after Stripe customer creation
    "stripeCustomerId" : Items[2],
    "stripeSubscription" : Items[3]
  };

  console.log(`DEBUG: User Object: ${user}`);

  return user;
};