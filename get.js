import AWS from "aws-sdk";

// Development region only
AWS.config = {
    region:"us-east-1"
};
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ssm = new   AWS.SSM();

export function main(event, context, callback) {
  // secretId is submitted by client as a path parameter
  // not implemented
  //const pathParameters = JSON.parse(event.pathParameters);
  //const secretId = pathParameters.id;
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  // secretID submitted as path query id=
  const secretId = data.id;
  // token submitted by  client
  const clientToken = data.token;
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the key of the item to be retrieved
    // - 'secretId': path parameter
    Key: {
      secretId: secretId
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
        body: JSON.stringify({ status: false, message: "Error retrieving secret, your secret may have expired." })
      };
      console.error(`Error retrieving secretId from DB: \n`,error);
      callback(null, response);
      return;
    }

    const storedToken = data.Item.token;
    console.log(`storedToken: ${storedToken}`);
    console.log(`clientToken: ${clientToken}`);
    console.log(`secretId: ${secretId}`);
    // if tokens match retrieve secret
    if (storedToken !== clientToken) {
        // Increment trys counter and send error to client
        const response = {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: false, message: "Error retrieving secret, invalid token" })
          };
          console.error(`Error, invalid token submitted by client: `, clientToken);
          callback(null, response);
        }

    // Retrieve secret from Parameter  store, delete and send to client
    var ssmParams = {
            Name: secretId,
            WithDecryption: true
            };
    ssm.getParameter(ssmParams, function(err, data) {
        if (err) {
            const response = {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ status: false, message: "Error retrieving secret" })
              };
              console.error(`Error retrieving secret: `, clientToken);
              callback(null, response);
        }
        else {
            const secret = data.Parameter.Value;
            const response = {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({
                    status: true,
                    secret: secret,
                    message:  "Your secret has been securely deleted"
                    })
                };
            // We must delete the secret before returning the response to the client
            ssm.deleteParameter({Name: secretId}, function(err, data) {
            if (err) console.error(`Error deleting parameter`,err);
            // Add proper error handling here
            else console.log(`Parameter deleted`);
            // Add callback to exit here
            });
            callback(null, response);
        }
    ; }
    ); }
    );
}