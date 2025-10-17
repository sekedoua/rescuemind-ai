export function connectWebSocket(onMessage: (event: MessageEvent) => void): WebSocket {
  const wsUrl = "wss://6dv0u3d6l9.execute-api.us-east-1.amazonaws.com/dev"; // Replace with CDK output
  const ws = new WebSocket(wsUrl);
  ws.onmessage = onMessage;
  ws.onopen = () => console.log("✅ WebSocket connected:", wsUrl);
  ws.onerror = (err) => console.error("❌ WebSocket error:", err);
  return ws;
}
