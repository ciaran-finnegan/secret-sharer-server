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

  console.log({ cognitoUser });
  console.log(`DEBUG: CognitoUsername: ${cognitoUser.Username}`);

  const date = new Date();
  const firstDayOfMonth= new Date(date.getFullYear(), date.getMonth(), 1);

  console.log(`DEBUG: firstDayOfMonth: ${firstDayOfMonth.getTime()} `);


  const documentClient = new AWS.DynamoDB.DocumentClient();

  const { Count } = await documentClient
  .query({
    "TableName": process.env.tableName,
    "IndexName": "createdBy-index",
    "KeyConditionExpression": "#DYNOBASE_createdBy = :pkey",
    "ExpressionAttributeValues": {
      ":pkey": cognitoUser.Username,
      ":createdAt": firstDayOfMonth.getTime()
    },
    "ExpressionAttributeNames": {
      "#DYNOBASE_createdBy": "createdBy",
      "#DYNOBASE_createdAt": "createdAt"
    },
    "ScanIndexForward": true,
    "Limit": 100,
    "FilterExpression": "#DYNOBASE_createdAt >= :createdAt"
  })
  .promise();

  console.log(`DEBUG: Count: ${Count} `);

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
    seretsCreatedThisMonth: Count,
  };
});
