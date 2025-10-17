const { randomUUID } = require("crypto");

exports.handler = async (event) => {
  console.log("🚀 ComputeRoutesFn event:", JSON.stringify(event));

  try {
    const body = event.body ? JSON.parse(event.body) : event;

    const route = {
      routeId: randomUUID(),
      from: body.from || "HQ",
      to: body.to || "Dallas",
      etaMinutes: 25,
      timestamp: new Date().toISOString(),
    };

    return { statusCode: 200, body: JSON.stringify(route) };
  } catch (err) {
    console.error("🔥 ComputeRoutesFn error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
