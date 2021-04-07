import AWS from "aws-sdk";
// import dynamodb from "../dynamodb";

export default async (tableName = null, teamId = {}) => {
  if (teamId.length === 0 || !tableName) {
    throw new Error("Must pass query to get and table to get.");
  }

  const documentClient = new AWS.DynamoDB.DocumentClient();

  // todo - consider abstracting this
  const indexName = "teamId-index";

  //  Scan is "scanning" through the whole table looking for elements matching criteria.
  //  Query is performing a direct lookup to a selected partition based on primary or secondary partition/hash key.

  const { Items } = await documentClient
    .query({
      TableName: tableName,
      IndexName: indexName,
      "KeyConditionExpression": "#DYNOBASE_teamId = :pkey",
      "ExpressionAttributeValues": {
        ":pkey": teamId
      },
      "ExpressionAttributeNames": {
        "#DYNOBASE_teamId": "teamId"
      },
      "ScanIndexForward": true,
      // TODO - Handle this limit via environment variable
      "Limit": 1000
    })
    .promise();

  console.log(`DEBUG:: Items: ${Items}`);
  return Items;
};
