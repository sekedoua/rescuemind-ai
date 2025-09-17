import { handler } from "../lambdas/ingest_social_signals";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

jest.mock("@aws-sdk/client-dynamodb");

(DynamoDBClient as jest.Mock).mockImplementation(() => ({
  send: jest.fn().mockResolvedValue({}),
}));

describe("ingest_social_signals lambda", () => {
  it("writes signals to DynamoDB", async () => {
    const result = await handler({
      signals: [{ id: "abc", content: "help needed" }],
    });
    expect(result.ingested).toBe(1);
  });
});
