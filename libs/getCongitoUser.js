// import AWS from "aws-sdk";
// import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
//ciaran - testing
const AWS = require("aws-sdk");
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

export default async (userId) => {
  // console.log(process.env);
  var params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: userId,
  };
  console.log("DEBUG:: Cognito params set to");
  console.log(params);

  // Retrieve User Object from Cognito User Pool

  let user = await cognitoidentityserviceprovider
    .adminGetUser(params)
    .promise();

  //
  //
  // Ask Ryan how to do error handling for this
  //
  //

  console.log("DEBUG:: User's email is: ");
  console.log(user.UserAttributes[2].Value);
  return user;
};
