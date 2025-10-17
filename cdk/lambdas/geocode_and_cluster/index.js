const { randomUUID } = require("crypto");

exports.handler = async (event) => {
  console.log("🚀 GeocodeClusterFn event:", JSON.stringify(event));

  try {
    const body = event.body ? JSON.parse(event.body) : event;

    // Fake geocode result for now
    const result = {
      clusterId: randomUUID(),
      address: body.address || "Unknown",
      lat: 32.7767,
      lon: -96.7970,
      timestamp: new Date().toISOString(),
    };

    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    console.error("🔥 GeocodeClusterFn error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
