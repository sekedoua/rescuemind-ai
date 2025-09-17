import { handler } from "../lambdas/fetch_weather_alerts/index";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

beforeEach(() => {
  process.env.TABLE_NAME = "MockIncidents";
  process.env.BUCKET_NAME = "mock-bucket";
});



jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/client-s3");

(DynamoDBClient as jest.Mock).mockImplementation(() => ({
  send: jest.fn().mockResolvedValue({}),
}));
(S3Client as jest.Mock).mockImplementation(() => ({
  send: jest.fn().mockResolvedValue({ Body: "mock data" }),
}));

describe("fetch_weather_alerts lambda", () => {
  it("stores incident in DynamoDB", async () => {
    const result = await handler({});
    expect(result.status).toBe("stored");
    expect(result.incident).toHaveProperty("type", "WEATHER");
  });
});
