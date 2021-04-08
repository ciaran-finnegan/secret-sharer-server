const aws = require("aws-sdk");
// var ses = new aws.SES({ region: "us-west-2" });
const ses = new aws.SES();

export async function sendEmail(toAddresses, sourceEmailAddress, subject, body ) {

    if (!toAddresses || !sourceEmailAddress || !subject || !body) {
      throw new Error("Must pass toAddresses, sourceEmailAddress, subject and body");
    }

// Sample usage
// sendEmail([a@b.com], "noreply@foo.com", "Some subject", "Some body");
 const params = {
                Destination: {
                ToAddresses: toAddresses
                },
                Message: {
                Body: {
                    Text: { Data: body },
                },

                Subject: { Data: subject },
                },
                Source: sourceEmailAddress,
            };

return ses.sendEmail(params)
.promise()
.then(console.log(`DEBUG:: Successfully Sent Email: ${params}}`))
.catch(console.error(`ERROR:: Failed to send email: }`));

}
