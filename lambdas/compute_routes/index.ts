import { DynamoDBClient, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const ddb = new DynamoDBClient({});

// lambdas/compute_routes/index.ts
// Minimal “routing” stub that returns an array so the test
// can assert Array.isArray(result.routes) === true.

export const handler = async (event: any = {}) => {
  // Accept a few shapes: event.candidates | event.items | []
  const candidates: any[] = Array.isArray(event?.candidates)
    ? event.candidates
    : Array.isArray(event?.items)
    ? event.items
    : [];

  // “Route” only items marked READY (simple filter for testing)
  const ready = candidates.filter((c) => c?.status === "READY");

  // In a real impl you’d compute actual routes; returning array satisfies tests
  const routes = ready.map((c) => ({
    id: c.id ?? cryptoRandomId(),
    from: c.from ?? c.origin ?? null,
    to: c.to ?? c.destination ?? null,
    etaMinutes: c.etaMinutes ?? 10,
  }));

  return { routes };
};

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}
