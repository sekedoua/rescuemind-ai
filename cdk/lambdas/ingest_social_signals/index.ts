import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});
const TABLE = process.env.TABLE_INCIDENTS || "MockIncidentsTable";

export const handler = async (event: any = {}) => {
  console.log("EVENT:", JSON.stringify(event));

  try {
    // Handle both API Gateway { body: string } and direct event
    const body = event.body ? JSON.parse(event.body) : event;
    const message = body.message || "unknown";

    const record = {
      pk: `SOC#${Date.now()}`,
      sk: `TS#${Date.now()}`,
      type: "SOCIAL",
      content: message,
    };

    await ddb.send(
      new PutItemCommand({
        TableName: TABLE,
        Item: marshall(record),
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message }),
    };
  } catch (err: any) {
    console.error("ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};


