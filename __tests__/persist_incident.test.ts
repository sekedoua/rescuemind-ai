import { handler } from "../lambdas/persist_incident/index";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

beforeEach(() => {
  process.env.TABLE_NAME = "MockTable";
});

jest.mock("@aws-sdk/client-dynamodb");

(DynamoDBClient as jest.Mock).mockImplementation(() => ({
  send: jest.fn().mockResolvedValue({}),
}));

describe("persist_incident lambda", () => {
  it("persists an incident", async () => {
    const result = await handler({ id: "42", type: "TEST" });
    expect(result.persisted).toBe(true);
    expect(result.id).toContain("INC#");
  });
});

