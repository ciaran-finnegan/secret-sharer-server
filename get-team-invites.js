import handler from "./libs/handler-lib";
import queryItems from "./libs/dynamodb/queryItems";

export const main = handler(async (event, context) => {
  try {
    // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  // teamId submitted as teamId
  const teamId = data.teamId;
  // hash submitted by  client
  const tableName = process.env.invitesTableName;

  console.log(`DEBUG: Event: ${event}`);
  console.log(`DEBUG: data: ${data}`);
  console.log(`DEBUG: teamId: ${teamId}`);
  console.log(`DEBUG: tableName: ${tableName}`);

    /*
      TODO:

      1. Create an invite in the invites table and get back an ID.
      2. Send an email to the emailAddress.
      3. Return.
    */

    const items = await queryItems(tableName,teamId);

    console.log("TODO: RETURN ITEMS HERE - ask Ryan how to do this? - nevermind dumbo");
    console.log("TODO: SEND EMAIL HERE");

    return {
      status: 200,
      items,
    };
  } catch (exception) {
    console.warn(exception);
  }
});
