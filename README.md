

# Secret Sharing Prototype

INCOMPLETE PROTOTYPE

This prototype web  application provides a secure data sharing service hosted on AWS using dynamoDB to store encrypted data (cipher) and hash of the passphrase used to encrypt the data. The passphrase is not stored.

Expired data is deleted and the cipher and hash are deleted when a cipher has been retrieved.

# Dependencies
Secret-sharer-client https://github.com/slartibastfast/secret-sharer-client.git
AWS Account 
Serverless Framework

# Deployment
-   git clone n
-   serverless deploy --aws-profile AWS_PROFILE (e.g. cscdev-AWSAdmin)
-   note the API endpoints created e.g.
    -     POST - https://va2pi2fcvh.execute-api.us-east-1.amazonaws.com/dev/createSecret
    -     POST - https://va2pi2fcvh.execute-api.us-east-1.amazonaws.com/dev/getSecret
    - Create a publically accessible S3 bucket
    - Update the Post URLs and S3 site URL in the files, index.html, getsecret.html and corsConfiguration.xml
    - Add the files index.html and getsecret.html to the S3 bucket
    - Update the bucket CORS permissions with the contents of corsConfiguration.xml


## Managing changes
The following command can be used to update an individual function
-   serverless deploy function -f getSecret --aws-profile AWS_PROFILE e.g. cscdev-AWSAdmin
The following command can be used to update the entire applicaton stack (takes longer)
-   serverless deploy --aws-profile AWS_PROFILE e.g. cscdev-AWSAdmin


## Debugging
serverless logs -f getSecret --aws-profile --aws-profile AWS_PROFILE e.g. cscdev-AWSAdmin --tail



