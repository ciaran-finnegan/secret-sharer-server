// import AWS from "aws-sdk";
import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import putItem from "./libs/dynamodb/putItem";

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

    console.log("TODO: SEND EMAIL HERE");

    return {
      status: 200,
      id,
    };
  } catch (exception) {
    console.warn(exception);
  }
});
