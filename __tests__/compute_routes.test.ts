import { handler } from "../lambdas/compute_routes";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

describe("compute_routes lambda", () => {
  it("returns routes array", async () => {
    const event = {
      candidates: [
        { id: "1", status: "READY", from: "A", to: "B" },
        { id: "2", status: "PENDING", from: "X", to: "Y" },
      ],
    };

    const result = await handler(event);
    expect(result.routes).toBeDefined();
    expect(Array.isArray(result.routes)).toBe(true);
    expect(result.routes.length).toBe(1); // only READY
    expect(result.routes[0]).toHaveProperty("id");
    expect(result.routes[0].etaMinutes).toBeGreaterThan(0);
  });
});
