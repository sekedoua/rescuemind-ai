import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});

export const handler = async () => {
  try {
    const tableName = process.env.TABLE_NAME!;
    const data = await client.send(new ScanCommand({ TableName: tableName }));

    const items = data.Items ? data.Items.map((item) => unmarshall(item)) : [];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    };
  } catch (err) {
    console.error("Error fetching incidents:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch incidents" }),
    };
  }
};
