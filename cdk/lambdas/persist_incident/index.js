const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { randomUUID } = require("crypto");

const client = new DynamoDBClient();

exports.handler = async (event) => {
  console.log("🚀 PersistIncidentFn event:", JSON.stringify(event));

  try {
    const body = event.body ? JSON.parse(event.body) : event;
    const incidentId = body.incidentId || randomUUID();

    const item = { incidentId, ...body, timestamp: new Date().toISOString() };

    console.log("📦 Writing to DynamoDB:", item);
    await client.send(new PutItemCommand({ TableName: process.env.TABLE_INCIDENTS, Item: marshall(item) }));

    return { statusCode: 200, body: JSON.stringify({ status: "ok", incidentId }) };
  } catch (err) {
    console.error("🔥 PersistIncidentFn error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
