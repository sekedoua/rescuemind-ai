// lambdas/ingest_social_signals/index.js

exports.handler = async (event) => {
  console.log("📥 Incoming event:", JSON.stringify(event));

  try {
    let body;

    // Parse JSON body if it exists
    if (event.body) {
      body = JSON.parse(event.body);
    } else {
      body = event; // fallback if directly invoked
    }

    console.log("📦 Parsed body:", body);

    // TODO: Add your OpenSearch / DynamoDB integration here

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Ingest received successfully 🚀",
        received: body,
      }),
    };
  } catch (error) {
    console.error("❌ Error in ingest handler:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Failed to ingest message",
        details: error.message,
      }),
    };
  }
};
