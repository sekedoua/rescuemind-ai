// index.js — CommonJS version for RescueMind-Map Lambda
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const https = require("https");

const ddb = new DynamoDBClient({});

exports.handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event, null, 2));

  try {
    // 1️⃣ Get incidents from DynamoDB
    const tableName = process.env.INCIDENTS_TABLE;
    const result = await ddb.send(new ScanCommand({ TableName: tableName, Limit: 50 }));

    const items = result.Items ? result.Items.map((i) => unmarshall(i)) : [];
    console.log(`Fetched ${items.length} items from ${tableName}`);

    // 2️⃣ Optionally query OpenSearch
    let searchHits = [];
    if (process.env.OPENSEARCH_ENDPOINT) {
      try {
        const searchUrl = `https://${process.env.OPENSEARCH_ENDPOINT}/incidents/_search?q=*:*&size=10`;
        console.log("Querying OpenSearch:", searchUrl);

        const response = await new Promise((resolve, reject) => {
          https.get(searchUrl, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(JSON.parse(data)));
          }).on("error", reject);
        });

        if (response?.hits?.hits) {
          searchHits = response.hits.hits.map((h) => h._source);
        }
      } catch (err) {
        console.warn("OpenSearch query failed (continuing):", err.message);
      }
    }

    // 3️⃣ Merge results
    const merged = [...items, ...searchHits].slice(0, 100);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ count: merged.length, items: merged }),
    };
  } catch (err) {
    console.error("Error in mapdata Lambda:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal server error", error: err.message }),
    };
  }
};
