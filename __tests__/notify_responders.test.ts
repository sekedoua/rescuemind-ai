import { handler } from "../lambdas/notify_responders";
import { SNSClient } from "@aws-sdk/client-sns";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

jest.mock("@aws-sdk/client-sns");

(SNSClient as jest.Mock).mockImplementation(() => ({
  send: jest.fn().mockResolvedValue({ MessageId: "mock-id" }),
}));

describe("notify_responders lambda", () => {
  it("publishes an SNS message", async () => {
    const result = await handler({ message: "Emergency!" });
    expect(result.notified).toBe(true);
    expect(result.message).toBe("Emergency!");
  });
});
