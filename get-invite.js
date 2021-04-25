import handler from "./libs/handler-lib";
import getItem from "./libs/dynamodb/getItem";

export const main = handler(async (event, context) => {
  try {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);
    const inviteId = data.inviteId;
    const tableName = process.env.invitesTableName;

    console.log(`DEBUG: Event: ${JSON.stringify(event)}`);
    console.log(`DEBUG: data: ${JSON.stringify(data)}`);
    console.log(`DEBUG: tableName: ${tableName}`);

    const invite = await getItem(tableName, {
      id: inviteId,
    });

    console.log(`DEBUG: invite: ${JSON.stringify(invite)}`);

    return {
      status: invite ? 200 : 404,
      invite,
    };
  } catch (exception) {
    console.warn(exception);
  }
});
