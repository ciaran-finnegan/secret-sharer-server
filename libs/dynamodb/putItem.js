import AWS from "aws-sdk";
import dynamodb from "../dynamodb";

export default (table = null, primaryKey = null, tableData = {}) => {
  if (Object.keys(tableData).length === 0 || !table || !primaryKey) {
    throw new Error("Must pass table, primary key and data to insert.");
  }

  return dynamodb
    .putItem({
      Item: AWS.DynamoDB.Converter.marshall({
        id: primaryKey,
        ...tableData,
      }),
      TableName: table,
    })
    .promise();
};
