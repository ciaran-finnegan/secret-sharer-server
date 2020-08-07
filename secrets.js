const ssm = require('./aws-client');

const saveSecret = (secret, id, token) => {
console.log(`Debug: Saving secret: ${secret} to name: ${id} with token: ${token}`); 
const secretString = JSON.stringify({"secret": secret, "token": token});

  const params = { 
    Name: id, 
    Value: secretString, 
    Type: 'SecureString', 
    Overwrite: true
  }; 
  
  const putParameter = ssm.putParameter(params, function(err, data) {
    if (err) {
      console.log(`Error: Error creating secret: ${err}, ${err.stack}`); // an error occurred
       const response = (err, null);
       return response
    }
    else {
      console.log(`Info: Secret created successfully: ${data}`); // successful response
      const response = (null, data);
      return response
    }
  });
  console.log(`Debug: putParameter returns: ${putParameter}`);
  return putParameter // review this approach
};

const getSecret = async (secretName) => {
  console.log(`Getting secret for ${secretName}`);
  const params = {
    Name: secretName, 
    WithDecryption: true
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

module.exports = {saveSecret, getSecret};