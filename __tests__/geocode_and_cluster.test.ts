import { handler } from "../lambdas/geocode_and_cluster";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { LocationClient, SearchPlaceIndexForPositionCommand } from "@aws-sdk/client-location";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

beforeEach(() => {
  process.env.PLACE_INDEX_NAME = "MockPlaceIndex";
  process.env.TABLE_NAME = "MockTable";
});


jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/client-location");

(DynamoDBClient as jest.Mock).mockImplementation(() => ({
  send: jest.fn().mockResolvedValue({}),
}));
(LocationClient as jest.Mock).mockImplementation(() => ({
  send: jest.fn().mockResolvedValue({ Results: [{ Place: { Label: "Mock Place" } }] }),
}));

describe("geocode_and_cluster lambda", () => {
  it("geocodes points and writes to DynamoDB", async () => {
    const event = {
      points: [
        { id: "1", position: [10, 20] },
        { id: "2", position: [30, 40] },
      ],
    };

    const result = await handler(event);

    expect(result.geocoded).toBe(2);
    expect(DynamoDBClient).toHaveBeenCalled();
    expect(LocationClient).toHaveBeenCalled();
  });
});
