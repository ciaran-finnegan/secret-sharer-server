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

  console.log({
    authProvider,
    parts,
    userPoolUsername,
    cognitoUser,
    cognitoUserEmail,
    documentClient,
    Items,
  });

  return Items && Items.find((item) => item.email === cognitoUserEmail);
};
