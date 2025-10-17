exports.handler = async (event) => {
  console.log("🚀 NotifyRespondersFn event:", JSON.stringify(event));

  try {
    const body = event.body ? JSON.parse(event.body) : event;

    // Fake notification logic
    console.log(`📢 Notifying responders: ${body.message}`);

    return { statusCode: 200, body: JSON.stringify({ status: "notification_sent" }) };
  } catch (err) {
    console.error("🔥 NotifyRespondersFn error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
