const AWS = require('aws-sdk');
// AWS.config.update({region:'us-east-1'});

AWS.config = {
    region:"us-east-1"
};

const ssm = new AWS.SSM();

module.exports = ssm;