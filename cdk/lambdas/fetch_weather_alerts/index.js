const { randomUUID } = require("crypto");

exports.handler = async (event) => {
  console.log("🚀 FetchWeatherAlertsFn event:", JSON.stringify(event));

  try {
    // TODO: Replace with real weather API integration
    const alerts = [
      { incidentId: randomUUID(), type: "Flood Warning", location: "Dallas, TX", timestamp: new Date().toISOString() },
    ];

    return { statusCode: 200, body: JSON.stringify({ alerts }) };
  } catch (err) {
    console.error("🔥 FetchWeatherAlertsFn error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
