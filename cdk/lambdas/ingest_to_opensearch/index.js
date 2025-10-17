const { Client } = require("@opensearch-project/opensearch");

let client;

exports.handler = async (event) => {
  console.log("IngestToOpenSearchFn invoked:", JSON.stringify(event));

  if (!client) {
    client = new Client({ node: process.env.OPENSEARCH_ENDPOINT });
  }

  const index = process.env.OPENSEARCH_INDEX || "incidents";
  const body = {
    id: event.id || Date.now().toString(),
    type: event.type || "unknown",
    lat: event.lat,
    lon: event.lon,
    ts: Date.now(),
  };

  await client.index({
    index,
    body,
  });

  return { statusCode: 200, body: "Indexed to OpenSearch" };
};