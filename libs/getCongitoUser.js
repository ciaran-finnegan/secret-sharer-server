// import AWS from "aws-sdk";
// import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
//ciaran - testing
const AWS = require('aws-sdk');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});


export default async  (userId) => {
  // console.log(process.env);
  var params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: userId
  };
  console.log('DEBUG:: Cognito params set to');
  console.log(params);
  cognitoidentityserviceprovider.adminGetUser(params, function(err, data) {
    if (err) {
      console.log('DEBUG:: Error calling cognitoidentityserviceprovider.adminGetUser');
      console.log(err, err.stack);
      return(err);
    }
    else     {
      console.log('DEBUG:: Success, cognitoidentityserviceprovider.adminGetUser returned: ');
      console.log(data);
      console.log('DEBUG:: User\'s Attributes are: ');
      console.log(data.UserAttributes);
      console.log('DEBUG:: User\'s email is: ');

      console.log(data.UserAttributes[2].Value);
      //
      //
      //
      // Ask Ryan about the best way to do this assuming the email may not always be the 3rd item in the array
      //
      //

      return(data);
    }
  });
};

// AWS.config.region = process.env.COGNITO_REGION;
  // AWS.config.credentials = new AWS.CognitoIdentityCredentials(
  //   {
  //     IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
  //   },
  //   {
  //     region: "ap-southeast-2",
  //   }
  // );

  // const Pool = new AmazonCognitoIdentity.CognitoUserPool({
  //   UserPoolId: process.env.COGNITO_USER_POOL_ID,
  //   ClientId: process.env.COGNITO_APP_CLIENT_ID,
  // });

  // const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
  //   Username,
  //   Pool,
  // });