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
    const cipher = data.Item.cipher;
    const createdAt = data.Item.createdAt;
    const expiresAt = data.Item.expiresAt;
    const attachment = data.Item.attachment;
    const hash = data.Item.hash;
    const hint = data.Item.hint;
    const failedRetrievals = data.Item.failedRetrievals;
    let incrementFailedRetrievals = 1;
    if (failedRetrievals) {
      incrementFailedRetrievals = failedRetrievals + 1;
    }

    console.log(`failedRetrievals: ${failedRetrievals}`);
    console.log(`failedRetrievals type: ${typeof(failedRetrievals)}`);
    console.log(`incrementFailedRetrievals: ${incrementFailedRetrievals}`);
    console.log(`incrementFailedRetrievals type: ${typeof(incrementFailedRetrievals)}`);

    console.log(`storedHash: ${hash}`);
    console.log(`clientHash: ${clientHash}`);
    console.log(`id: ${id}`);
    const now = Date.now();
    // todo if retrieved is true return an error
    // todo if expired return an error
    if (now > expiresAt) {
      const response = {
          statusCode: 500,
          headers: headers,
          body: JSON.stringify({ status: false, message: "Error, secret has expired" })
        };
        console.error(`Error, secret has expired: `, id);
        callback(null, response);
      }
    // todo if failed retrieval attempts >2 and lastFailedRetrievalAt is less than 1 hour ago return an error
    // if passphrase hashes don't match return an error
    if (hash !== clientHash) {
        // Increment failedRetrievaals counter, update lastFailedRetrievalAt data and send error to client
        console.log(typeof(incrementfailedRetrievals));
        console.log(typeof(now));
        console.log(typeof(id));

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
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: false, message: "Error, passphrase hash not accepted" })
          };
          console.error(`Error, invalid passphrase hash submitted by client: `, clientHash);
          callback(null, response);
        }
      });
    }
    else {
        const retrievedAt = Date.now();
        const retrieved = true;
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
              statusCode: 500,
              headers: headers,
              body: JSON.stringify({ status: false, message: "Error, and error occurred when deleting cipher and hash" })
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
                    message:  "Cipher retrieved successfully, cipher and hash have been deleted"
                    })
                };
            callback(null, response);
              }
        });
    }
  });
}