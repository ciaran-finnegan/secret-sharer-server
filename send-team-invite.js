// import AWS from "aws-sdk";
import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import putItem from "./libs/dynamodb/putItem";
import sendEmail from "./libs/email-lib";

export const main = handler(async (event, context) => {
  try {
    const id = uuid.v4();
    const data = JSON.parse(event.body);
    const tableName = process.env.invitesTableName;
    console.log(`DEBUG: tableName: ${tableName}`);
    console.log(`DEBUG: teamId: ${data.teamId}`);
    console.log(`DEBUG: emailAddress: ${data.emailAddress}`);
    console.log(`DEBUG: role: ${data.role}`);
    console.log(`DEBUG: event: ${JSON.stringify(data)}`);

    /*
      TODO:

      1. Create an invite in the invites table and get back an ID.
      2. Send an email to the emailAddress.
      3. Return.
    */

    await putItem(tableName, id, data);

    const toAddress = [data.emailAddress];
    const sourceEmailAddress = process.env.sendEmailInviteFrom;
    const subject = "You've been invited to activate your Vanish.link account";
    const body = `Hi,
    You have been invited to activate your Vanish.link account.
    Please click on the link below to sign-up (make sure to use the e-mail address this e-mail was sent to).
    
    https://vanish.link/signup
    
    Thanks,
    
    The Vanish Team.`;

    console.log(`DEBUG: toAddress: ${toAddress}`);
    console.log(`DEBUG: sourceEmailAddress: ${sourceEmailAddress}`);
    console.log(`DEBUG: subject: ${subject}`);
    console.log(`DEBUG: body: ${body}`);

    const response = sendEmail(toAddress, sourceEmailAddress, subject, body);
    console.log(`DEBUG: Sent email: ${JSON.stringify(response)}`);

    return {
      status: 200,
      id,
    };
  } catch (exception) {
    console.warn(exception);
  }
});
