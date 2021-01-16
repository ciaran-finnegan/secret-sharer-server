import AWS from "aws-sdk";
import dynamodb from "../dynamodb";

export default (table = null, query = {}) => {
  if (Object.keys(query).length === 0 || !table) {
    throw new Error("Must pass query to get and table to get.");
  }

  return dynamodb
    .getItem({
      Key: AWS.DynamoDB.Converter.marshall({
        ...query,
      }),
      TableName: table,
    })
    .promise();
};
