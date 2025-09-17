import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});
const TABLE = process.env.TABLE_INCIDENTS || "MockIncidentsTable";

export const handler = async (event: any = {}) => {
  const item = {
    pk: `INC#${event.id ?? Date.now()}`,
    sk: `TS#${Date.now()}`,
    type: event.type ?? "GENERIC",
    payload: JSON.stringify(event),
  };

  await ddb.send(
    new PutItemCommand({
      TableName: TABLE,
      Item: marshall(item),
    })
  );

  return { persisted: true, id: item.pk };
};
