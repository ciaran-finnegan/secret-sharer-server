import * as uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const id = uuid.v4();

export function main(event, context, callback) {
  // URL for web form to retrieve secret
  const getSecretURL = process.env.GETSECRET_URL;
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const cipher = data.cipher;
  const hint = data.hint;
  const hash = data.hash;
  const createdAt = Date.now();
  // Validate expiry in hours and force maximum permitted expiry to 72hrs
  // A scheduled lambda function will delete expired ciphers
  function validateExpiresAt(hours) {
    if (hours <= 72 && hours.isInteger) {
        let  expiresAt = Date.now() + (hours *  60 * 60 * 1000);
        return expiresAt;
      }
      else {
        let  expiresAt = Date.now() + (72 *  60 * 60 * 1000);
        return expiresAt;
      }
  }
  const expiresAt = validateExpiresAt(data.expiresAt);

  // Create a DynamoDB item
  // - 'id': a unique uuid
  // - 'cipher' contains the cipher of the secret encrypted with a passphrase
  // - 'hash' hash of passphrase
  // - 'hint' optional hint for the passphrase
  // - 'expiresAt' date/time to delete the item
  // - 'content': parsed from request body, not yet implemented
  // - 'attachment': parsed from request body, not yet implemented
  // - 'createdAt': current Unix timestamp
  const dynamoDBparams = {
    TableName: process.env.tableName,
    Item: {
      id: id,
      cipher:  cipher,
      hint: hint,
      hash: hash,
      attachment: data.attachment,
      createdAt: createdAt,
      expiresAt: expiresAt
    }
  };
// debugging
console.log(`id:  ${id}`);
console.log(`cipher:  ${cipher}`);
console.log(`hint:  ${hint}`);
console.log(`hash:  ${hash}`);
console.log(`createdAt:  ${createdAt}`);
console.log(`expiresAt:  ${expiresAt}`);
  dynamoDb.put(dynamoDBparams, (error, data) => {
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
        body: JSON.stringify({ status: false, message: "Sorry that didn't work, please try again." })
      };
      console.error(`Error creating DynamoDB Item: \n`,error);
      callback(null, response);
      return;
    }

    // Return status code 200 and the URL and token for the newly created secret
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
          status: true,
          url: getSecretURL + id,
          message:  "Secret encrypted and stored successfully."
        })
    };
    callback(null, response);
  });
}