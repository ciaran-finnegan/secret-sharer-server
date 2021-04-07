import AWS from "aws-sdk";

export default (tableName = null, primaryKey = null, tableData = {}) => {
  if (Object.keys(tableData).length === 0 || !tableName || !primaryKey) {
    throw new Error("Must pass table, primary key and data to insert.");
  }

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const invitedAt = Date.now();

return dynamoDB
  .put({
    Item: {
      id: primaryKey,
      invitedAt: invitedAt,
      ...tableData
    },
    TableName: tableName,
  })
  .promise()
  .then(data => console.log(`DEBUG:: data.Attributes ${data.Attributes}`))
  .catch(console.error);
};
