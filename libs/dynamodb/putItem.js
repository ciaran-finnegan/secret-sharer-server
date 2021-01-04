import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import dynamodb from "../dynamodb";

export default (table = null, data = {}) => {
  if (Object.keys(data).length === 0 || !table) {
    throw new Error("Must pass data to put and table to insert.");
  }

  return dynamodb
    .putItem({
      Item: AWS.DynamoDB.Converter.marshall({
        id: uuidv4(),
        ...data,
      }),
      TableName: table,
    })
    .promise();
};
