// import AWS from "aws-sdk";
import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default (tableName = null, primaryKey = null, tableData = {}) => {
  if (Object.keys(tableData).length === 0 || !primaryKey || !tableName) {
    throw new Error("Must pass table name, primary key and data to insert.");
  }

  console.log(`DEBUG: Executing updateItem.js`);
  console.log(`DEBUG:: tableData.productId : ${tableData.productId}`);
  console.log(`DEBUG:: tableData.nickname : ${tableData.nickname}`);
  console.log(`DEBUG:: tableData : ${JSON.stringify.tableData}`);

  const params = {
    TableName:tableName,
    Key:{
        "customerId": primaryKey
    },
    UpdateExpression: "set productId = :p, nickname=:n",
    ExpressionAttributeValues:{
        ":p":tableData.productId,
        ":n":tableData.nickname
    },
    ReturnValues:"UPDATED_NEW"
};

  console.log(`DEBUG: update params: ${JSON.stringify.params}`);

  return dynamoDb.update(params).promise();
};
