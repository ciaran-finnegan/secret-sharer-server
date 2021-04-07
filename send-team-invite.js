// import AWS from "aws-sdk";
import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import putItem from "./libs/dynamodb/putItem";

export const main = handler(async (event, context) => {
  try {
    const id = uuid.v4();
    console.log(event);

    /*
      TODO:

      1. Create an invite in the invites table and get back an ID.
      2. Send an email to the emailAddress.
      3. Return.
    */

    await putItem("invites", id, event.body || {});

    console.log("TODO: SEND EMAIL HERE");

    return {
      status: 200,
      id,
    };
  } catch (exception) {
    console.warn(exception);
  }
});
