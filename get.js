import AWS from "aws-sdk";
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
    console.log(`debug: error: ${error}`);
    console.log(`debug: data.Item: ${data.Item}`);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    if (error) {
      const response = {
        statusCode: 202,
        headers: headers,
        body: JSON.stringify({ status: false, message: "We are unable to retrieve this secret." })
      };
      console.error(`Error (if error) retrieving item from DB: \n`,error);
      callback(null, response);
      return;
    }
    // Return error if Item has expired
//    console.log(`debug: error: ${error}`);
//    console.log(`debug: data: ${error}`);
// If a nonexistent id is provided data and error are returned as null
// Needs further investigation
// Refactor using async/await/try/catch to handle errors properly
    else if (!data.Item.id) {
      const response = {
        statusCode: 202,
        headers: headers,
        body: JSON.stringify({ status: false, message: "We are unable to retrieve this secret." })
      };
      console.error(`Error retrieving item (id) from DB: \n`,id);
      callback(null, response);
      return;
    }
    else {
      const now = Date.now();
      const expiresAt = data.Item.expiresAt;
      if (now > expiresAt) {
        const response = {
            statusCode: 202,
            headers: headers,
            body: JSON.stringify({ status: false, message: "This secret has expired." })
          };
          console.error(`Error, secret has expired: `, id);
          callback(null, response);
        }
      }

    // Return error if Item has already been retrieved
    if (data.Item.retrieved) {
      const response = {
          statusCode: 202,
          headers: headers,
          body: JSON.stringify({ status: false, message: "This secret has already been retrieved." })
        };
        console.error(`Error, secret has expired: `, id);
        callback(null, response);
      }

    const cipher = data.Item.cipher;
    const createdAt = data.Item.createdAt;
    const attachment = data.Item.attachment;
    const hash = data.Item.hash;
    const hint = data.Item.hint;
    const failedRetrievals = data.Item.failedRetrievals;

    console.log(`failedRetrievals: ${failedRetrievals}`);
    console.log(`failedRetrievals type: ${typeof(failedRetrievals)}`);
    console.log(`storedHash: ${hash}`);
    console.log(`clientHash: ${clientHash}`);
    console.log(`id: ${id}`);
    // todo if retrieved is true return an error
    // message: Error, this secret has already been retrieved
    // todo if expired return an error
    // todo if failed retrieval attempts >2 and lastFailedRetrievalAt is less than 1 hour ago return an error
    // if passphrase hashes don't match return an error
    if (hash !== clientHash) {
        // Increment failedRetrievaals counter, update lastFailedRetrievalAt data and send error to client
        let incrementFailedRetrievals = 1;
        if (failedRetrievals) {
          incrementFailedRetrievals = failedRetrievals + 1;
        }
        const now = Date.now();
        console.log(typeof(incrementfailedRetrievals));
        console.log(typeof(now));
        console.log(typeof(id));
        const expiresAt = data.Item.expiresAt;
        const x = {
          TableName: process.env.tableName,
          // 'Key' defines the key of the item to be retrieved
          Key: {
            id: id
          },
          Item: {
            id: id,
            cipher:  cipher,
            hint: hint,
            hash: hash,
            attachment: attachment,
            createdAt: createdAt,
            expiresAt: expiresAt,
            retrievedAt: 0,
            retrieved: false,
            failedRetrievals: incrementFailedRetrievals,
            lastFailedRetrievalAt: now
            }
        };
        dynamoDb.put(x, function(err, data) {
          if (err)   {
            console.error(`Error, failed to update Item: `, err);
          }
          else {
        const response = {
            statusCode: 202,
            headers: headers,
            body: JSON.stringify({ status: false, message: "Passphrase not accepted" })
          };
          console.error(`Error, invalid passphrase hash submitted by client: `, clientHash);
          callback(null, response);
        }
      });
    }
    else {
        const retrievedAt = Date.now();
        const retrieved = true;
        const expiresAt = data.Item.expiresAt;
        // Delete cipher, hash and hint, set retrieved = true and retrievedAt
        const p = {
          TableName: process.env.tableName,
          // 'Key' defines the key of the item to be retrieved
          Key: {
            id: id
          },
          Item: {
            id: id,
            cipher: "DELETED",
            createdAt: createdAt,
            expiresAt: expiresAt,
            retrievedAt: retrievedAt,
            retrieved: retrieved,
            hash: "DELETED",
            attachment: attachment,
            hint: "DELETED"
            }
        };

        dynamoDb.put(p, function(err, data) {
          if (err) {
            const response = {
              statusCode: 202,
              headers: headers,
              body: JSON.stringify({ status: false, message: "An internal error occurred" })
            };
            console.error(`Error, failed to delete cipher and  hash: `, err);
            callback(null, response);

          }
          else {
            const response = {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({
                    status: true,
                    cipher: cipher,
                    message:  "Secret retrieved successfully, encrypted data have been permanently deleted from our servers"
                    })
                };
            callback(null, response);
              }
        });
    }
  });
}