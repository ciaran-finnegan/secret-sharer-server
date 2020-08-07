'use strict';
// Prototype, serverless  secret  sharing using AWS Parameter Store (free up to 10,000 records per account)
// Not production ready, requires secret expiry, error handling, rate limiting and many other changes
// ciaran@counterthreat.co

const secrets = require('./secrets');
const ssm = require('./aws-client');
const { v4: uuidv4 } = require('uuid');

// Disabled for testing, update here or in cloudformation via serverless.yml for production deployment
function validOrigin(testOrigin) {
  const VALID_ORIGINS = ['http://localhost:3000', 'https://secret-sharer.s3-ap-southeast-2.amazonaws.com'];
  return VALID_ORIGINS.filter(origin => origin === testOrigin)[0] || VALID_ORIGINS[0];
}


module.exports.createSecret = (event, context, callback) => {
// Accept a Secret (string)
// Generate a token
// Create an AWS Systems Manager Parameter Store Secret for the Secret and Token
// Return a unique identifier for the Secret and the token
// add an expiry tag to the Parameter Store Secret
// const origin = event.headers.Origin || event.headers.origin;

const baseURL = 'https://secret-sharer.s3-ap-southeast-2.amazonaws.com/getsecret.html?id='
const formData = JSON.parse(event.body);
const secret = formData.secret;
const id = uuidv4();
const token  = uuidv4();
const secretPlusToken = secret + token;

const params = { 
  Name: id, 
  Description: "Created by Secret Manager Lambda Function",
  Value: secretPlusToken, // Parameter store  does not accept objects so conatenating secret string and uuidv4 has 36 characters
  Type: 'SecureString', 
  Overwrite: true
}; 
// console.debug(`Debug: Received new secret: ${secret}, name: ${id}, token: ${token}`); 
console.info(`DReceived new secret, name: ${id}`); 

ssm.putParameter(params, function(err, data) {
  if (err) {
    console.warn(`Error creating secret: ${err}, ${err.stack}`); // an error occurred
    // TODO: Add error  response to return to client here
  }
  else    {
    console.log(`Parameter store record created successfully.`);           // successful response
  }
  
  const response = {
    statusCode: err ? 500 : 200, // if there is an error return a http statusCode 500, otherwise return 200
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: err ? err.message : data,
      id: id, token: token,
      url: baseURL+id
    }),
  };
  //console.debug(`Debug: Response from saveSecret function:`);
  //console.debug(response.headers);
  //console.debug(response.body);
  callback(null, response);
});

// Return with no response if honeypot is present
// if (formData.honeypot) return;

// Return with no response if the origin isn't white-listed

// if (!validOrigin(origin)) return;
  
// callback(null, response);
};

module.exports.getSecret = (event, context, callback) => {
  // Accept a Unique Identifier from URL and a Token from a web form
  // Retrieve Secret based on Unique Identifiier
  // Validate token (concatenated to  secret string, strip last 36 characters)
  // Delete the Parameter Store Secret and token
  // Return the Secret

  // Global  variables  for prototyping, to be  removed
  var message = ""; 
  var secret = "";
  var token = "";

  console.info(`Received request to retrieve secret`);
  // console.debug(`Received Form Data: ${event.body}`);
  const formData = JSON.parse(event.body);
  const id = formData.id;
  const clientToken = formData.token;

  //console.debug(`Received new secret retrieval request id: ${id}, token: ${clientToken}`); 

  var params = {
    Name: id,
    WithDecryption: true
  };
  
  ssm.getParameter(params, function(err, data) {
    if (err) {
      console.warn(`Error getting Parameter: ${err}, Error Stack Trace : ${err.stack}`); // an error occurred
      const response = {
        statusCode: err ? 500 : 200, // if there is an error return a http statusCode 500, otherwise return 200
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: err.code,
          secret: secret // returns an empty string
        }),
      };
      //console.debug(`Response from saveSecret function:`);
      //console.debug(response.headers);
      //console.debug(response.body);
      callback(null, response);
    }
    else {
      console.log(`Successfully retrieved Parameter`); // Successfully retrieved Parameter
      //console.debug(`Secret is : ${data.Parameter.Value.slice(0,-36)}`); 
      //console.debug(`Token is : ${data.Parameter.Value.slice(-36)}`); 
      //console.debug(`Client Token is : ${clientToken}`);

    token = data.Parameter.Value.slice(-36); // extract the last 36 characters (token)
    
    // Validate token
    if (token === clientToken) {
      // Delete entry from parameter store prior to sending back to client
      // Consider addng a counter or rate limit to prevent brute forcing
      secret = data.Parameter.Value.slice(0,-36); // strip the last 36 characters (token)
      message = "Token matched successfully";
      //console.debug(`Debug: Client Token: ${clientToken}, Token: ${token}, Message: ${message}`);
    }
    else {
      // Return an Error
      err = true;
      message = "Incorrect Token";
      console.warn(`Token did not match, Client provided token: ${clientToken}`);
      //console.debug(`Token did not match, Client Token: ${clientToken}, Token: ${token}, Message: ${message}`);

    }
    const response = {
      statusCode: err ? 500 : 200, // if there is an error return a http statusCode 500, otherwise return 200
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: err ? err.message : message,
        secret: secret
      }),
    };
    //console.debug(`Response from saveSecret function:`);
    //console.debug(response.headers);
    //console.debug(response.body);
    callback(null, response);
  }
  });
};


