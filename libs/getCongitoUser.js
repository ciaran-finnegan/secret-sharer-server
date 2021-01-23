import AWS from "aws-sdk";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

export default (Username = null) => {
  console.log(process.env);

  AWS.config.region = process.env.COGNITO_REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    {
      IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
    },
    {
      region: "ap-southeast-2",
    }
  );

  const Pool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_APP_CLIENT_ID,
  });

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username,
    Pool,
  });

  console.log(cognitoUser);

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

  return cognitoUser;
};
