const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient();

exports.handler = async (event) => {
  console.log("PersistIncidentFn invoked:", JSON.stringify(event));

  const tableName = process.env.TABLE_NAME;
  if (!tableName) throw new Error("TABLE_NAME not set");

  const item = {
    id: { S: event.id || Date.now().toString() },
    type: { S: event.type || "unknown" },
    lat: { N: event.lat.toString() },
    lon: { N: event.lon.toString() },
    ts: { N: Date.now().toString() },
  };

  await client.send(new PutItemCommand({ TableName: tableName, Item: item }));

  return { statusCode: 200, body: "Incident persisted" };
};