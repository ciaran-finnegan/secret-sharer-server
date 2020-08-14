import * as uuid from "uuid";
import AWS from "aws-sdk";

// Development region only
AWS.config = {
    region:"us-east-1"
};
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ssm = new   AWS.SSM();

export function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  // Secret text submitted by client
  const secret = data.secret;
  // URL for web form to retrieve secret
  const getSecretURL = process.env.GETSECRET_URL;
  // Current dateTime
  const createdAt = Date.now();
  // Validate expiry in hours and force maximum permitted expiry to 72hrs
  // A scheduled lambda function will delete expired secrets
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
  // Name of parameter in Systems Manager Secret Store
  const id = uuid.v4();
  // Token required to retrieve Secret
  const token  = uuid.v4();
  // Set Type to Secure String to force encryption
  // Over-writing not  permitted
  const SSMparams = {
    Name: id,
    Description: "Created by Secret Manager Lambda Function",
    Value: secret,
    Type: 'SecureString',
    Overwrite: false
  };
  // Create AWS Systems Manager encrypted parameter for secret
  ssm.putParameter(SSMparams, (error, data) => {
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
      console.error(`Error creating SSM  Parameter: \n`,error);
      callback(null, response);
      return;
    }
  });
  // Re-factor required  to  only excute  if  ssm.purParameter  is  successful
  // Create a DynamoDB item with the id, token and expiry for the secret
  // 'Secret' contains the attributes of the item to be created
  // - 'secretId': a unique uuid
  // - 'content': parsed from request body
  // - 'attachment': parsed from request body
  // - 'createdAt': current Unix timestamp
  const dynamoDBparams = {
    TableName: process.env.tableName,
    Item: {
      secretId: id,
      token:  token,
      attachment: data.attachment,
      createdAt: createdAt,
      expiresAt: expiresAt
    }
  };
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
          token: token,
          message:  "Secret encrypted and stored successfully."
        })
    };
    callback(null, response);
  });
}