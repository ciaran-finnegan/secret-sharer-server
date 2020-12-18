// import AWS from "aws-sdk";
// import AmazonCognitoIdentity from "amazon-cognito-identity-js";

// const userPool = new AmazonCognitoIdentity.CognitoUserPool({
//   UserPoolId: "THE USER POOL ID",
//   ClientId: "THE CLIENT ID",
// });

// AWS.config.region = "AWS_REGION";
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: "THE USERPOOL ID",
// });

// const email = "someone@somewhere.com";
// const password = "password";

// const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
//   Username: email,
//   Password: password,
// });

// const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
//   Username: email,
//   Pool: userPool,
// });

// console.log(result);
// cognitoUser.authenticateUser(authenticationDetails, {
//   onSuccess: function (result) {
//     console.log("access token + " + result.getAccessToken().getJwtToken());
//     callback(null, result);
//   },

//   onFailure: function (err) {
//     console.log("Login error: " + err);
//     callback(null, result);
//   },
// });
