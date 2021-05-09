import handler from "./libs/handler-lib";
import getItem from "./libs/dynamodb/getItem";
import deleteItem from "./libs/dynamodb/deleteItem";
import putItem from "./libs/dynamodb/putItem";

export const main = handler(async (event, context) => {
  try {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);
    const inviteId = data.inviteId;
    const userId = data.userId;
    const emailAddress = data.emailAddress;

    console.log(`DEBUG: Event: ${event}`);
    console.log(`DEBUG: data: ${data}`);
    console.log(`DEBUG: invitesTableName: ${process.env.invitesTableName}`);
    console.log(`DEBUG: usersTableName: ${process.env.usersTableName}`);

    const invite = await getItem(process.env.invitesTableName, {
      id: inviteId,
    });

    if (invite) {
      await putItem(
        process.env.usersTableName,
        { customer_email: emailAddress },
        {
          teamId: invite?.teamId,
        }
      );

      return {
        status: invite ? 200 : 404,
        invite,
      };
    } else {
      // NOTE: We're doing this here because we create a user no matter what on the client.
      // If the invite we used to create the user does not exist, the user is invalid and we
      // want to delete them.
      await deleteItem(process.env.usersTableName, userId);

      return {
        status: 404,
        error:
          "Invalid invite. Please double-check that you're using the link from the email sent by Vanish.",
      };
    }
  } catch (exception) {
    console.warn(exception);
  }
});
