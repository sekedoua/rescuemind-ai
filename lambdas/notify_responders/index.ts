import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: any) => {
  console.log("WebSocket event:", JSON.stringify(event));

  try {
    // Example: save responder connection ID for later
    if (event.requestContext?.connectionId) {
      await client.send(
        new UpdateItemCommand({
          TableName: process.env.TABLE_NAME!,
          Key: { id: { S: event.requestContext.connectionId } },
          UpdateExpression: "SET lastSeen = :t",
          ExpressionAttributeValues: {
            ":t": { S: new Date().toISOString() },
          },
        })
      );
    }

    return { statusCode: 200, body: "Connected." };
  } catch (err) {
    console.error("Error in notify handler:", err);
    return { statusCode: 500, body: "Failed." };
  }
};
