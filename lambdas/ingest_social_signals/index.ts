import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});
const TABLE = process.env.TABLE_INCIDENTS || "MockIncidentsTable";

export const handler = async (event: any = {}) => {
  const signals: any[] = event?.signals ?? [];

  for (const s of signals) {
    const record = {
      pk: `SOC#${s.id ?? Date.now()}`,
      sk: `TS#${s.ts ?? Date.now()}`,
      type: "SOCIAL",
      content: s.content ?? "unknown",
    };

    await ddb.send(
      new PutItemCommand({
        TableName: TABLE,
        Item: marshall(record),
      })
    );
  }

  return { ingested: signals.length };
};