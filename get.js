import AWS from "aws-sdk";

// Development region only
AWS.config = {
    region:"us-east-1"
};
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  // secretID submitted as path query id=
  const id = data.id;
  // hash submitted by  client
  const clientHash = data.hash;
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the key of the item to be retrieved
    Key: {
      id: id
    }
  };

  dynamoDb.get(params, (error, data) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    // Return status code 500 on error
    if (error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ status: false, message: "Error retrieving cipher, your secret may have expired." })
      };
      console.error(`Error retrieving item from DB: \n`,error);
      callback(null, response);
      return;
    }

    const storedHash = data.Item.hash;
    console.log(`storedHash: ${storedHash}`);
    console.log(`clientHash: ${clientHash}`);
    console.log(`id: ${id}`);
    // if passphrase hashes don't match return and error
    if (storedHash !== clientHash) {
        // Increment invalidHashRequest counter and send error to client
        const response = {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: false, message: "Error, passphrase hash not accepted" })
          };
          console.error(`Error, invalid passphrase hash submitted by client: `, clientHash);
          callback(null, response);
        }
    else {
        const cipher = data.Item.cipher;
          const response = {
              statusCode: 200,
              headers: headers,
              body: JSON.stringify({
                  status: true,
                  cipher: cipher,
                  message:  "Cipher has been retrieved"
                  })
              };
          // We must delete the secret before returning the response to the client
          callback(null, response);
    }
  });
}