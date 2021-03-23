import AWS from "aws-sdk";
import dynamodb from "../dynamodb";

export default (table = null, data = {}) => {
  if (Object.keys(data).length === 0 || !table) {
    throw new Error("Must pass data to put and table to insert.");
  }

  
  return dynamodb
    .updateItem({
      Item: AWS.DynamoDB.Converter.marshall({
        ...data,
      }),
      TableName: table,
      Key: {
        "customerId": data.customerId,
      },
    })
    .promise();
};
