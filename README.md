
# Secret Sharing Prototype
DXC AWS Practice personnel have been using third party services to securely share data such as passwords and API keys. This  presents a risk to DXC and our customers as we do not control how the data are managed by third parties. This prototype web  application provides a secure data sharing service hosted on a DXC managed AWS account and using an AWS Parameter store for secure storage, encryption and deletion of data. 

# Deployment
-   git clone n
-   serverless deploy --aws-profile cscdev-AWSAdmin (profile for DXC ANZ Dev1 AWS Account, ID 050040431264)
-   note the API endpoints created e.g.
    -     POST - https://va2pi2fcvh.execute-api.us-east-1.amazonaws.com/dev/createSecret
    -     POST - https://va2pi2fcvh.execute-api.us-east-1.amazonaws.com/dev/getSecret
    - Create a publically accessible S3 bucket
    - Update the Post URLs and S3 site URL in the files, index.html, getsecret.html and corsConfiguration.xml
    - Add the files index.html and getsecret.html to the S3 bucket
    - Update the bucket CORS permissions with the contents of corsConfiguration.xml


## Managing changes
The following command can be used to update an individual function
-   serverless deploy function -f getSecret --aws-profile cscdev-AWSAdmin
The following command can be used to update the entire applicaton stack (takes longer)
-   serverless deploy --aws-profile cscdev-AWSAdmin


## Debugging
serverless logs -f getSecret --aws-profile cscdev-AWSAdmin --tail



