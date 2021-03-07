// import handler from "./libs/handler-lib";
import * as uuid from "uuid";
import AWS from "aws-sdk";
import getCognitoUser from "./libs/getCongitoUser";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main (event, context) {
  const id = uuid.v4();
  // URL for web form to retrieve secret
  // const getSecretURL = process.env.GETSECRET_URL;
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

  // Get the callers Cognito User Name
  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(":");
  const userPoolUsername = parts[parts.length - 1];
  const cognitoUser = await getCognitoUser(userPoolUsername);

  console.log(`DEBUG: CognitoUsername: ${cognitoUser.Username}`);

  // Create a DynamoDB item
  // - 'id': a unique uuid
  // - 'createdBy': the cognitoUser.Username from the users table
  // - 'cipher' contains the cipher of the secret encrypted with a passphrase
  // - 'hash' hash of passphrase
  // - 'hint' optional hint for the passphrase
  // - 'expiresAt' date/time to delete the item
  // - 'content': parsed from request body, not yet implemented
  // - 'attachment': parsed from request body, not yet implemented
  // - 'createdAt': current Unix timestamp
  
  const params = {
    TableName: process.env.tableName,
    Item: {
      id: id,
      createdBy: cognitoUser.Username,
      createdAt: createdAt,
      expiresAt: expiresAt,
      cipher:  cipher,
      hint: hint,
      hash: hash,
      attachment: data.attachment,
      retrievedAt: 0,
      retrieved: false,
      failedRetrievals: 0,
      lastFailedRetrievalAt: 0
    }
  };
  // debugging
  console.log(`id:  ${id}`);
  console.log(`createdBy: ${cognitoUser.Username}`);
  console.log(`cipher:  ${cipher}`);
  console.log(`hint:  ${hint}`);
  console.log(`hash:  ${hash}`);
  console.log(`createdAt:  ${createdAt}`);
  console.log(`expiresAt:  ${expiresAt}`);

  try {
    await dynamoDb.put(params).promise();
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
        };

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        status: true,
        id: id,
        message:  "Secret encrypted and stored successfully."
      })
    };
  } catch (e) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
      };
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ status: false, message: "Sorry that didn't work, please try again." }),
    };
  }
}