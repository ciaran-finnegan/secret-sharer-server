// import AWS from "aws-sdk";
import handler from "./libs/handler-lib";
import getCognitoUser from "./libs/getCongitoUser";

export const main = handler(async (event, context) => {
  // NOTE: See notes file at root of project for details on how this works.
  console.log(JSON.stringify(event, null, 2));
  const authProvider =
    event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolUsername = parts[parts.length - 1];
  const cognitoUser = await getCognitoUser(userPoolUsername);

  console.log({ cognitoUser });

  // const cognitoUserEmail = cognitoUser.UserAttributes[2].Value;
  // const documentClient = new AWS.DynamoDB.DocumentClient();

  // const { Items } = await documentClient
  //   .scan(
  //     {
  //       TableName: "dev-ciphers",
  //       ScanIndexForward: true,
  //       FilterExpression:
  //         "#DYNOBASE_userId = :userId AND #DYNOBASE_createdAt >= :createdAt AND #DYNOBASE_createdAt <= :createdAt",
  //       ExpressionAttributeNames: {
  //         "#DYNOBASE_userId": "userId",
  //         "#DYNOBASE_createdAt": "createdAt",
  //       },
  //       ExpressionAttributeValues: {
  //         ":userId": "1234",
  //         ":createdAt": "End of Month",
  //       },
  //     }
  //   )
  //   .promise();

  // const user = Items && Items.find((item) => item.email === cognitoUserEmail);

  return {
    test: "123",
  };
});
