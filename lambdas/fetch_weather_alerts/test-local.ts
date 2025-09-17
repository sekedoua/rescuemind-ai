import { handler } from "./index";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Mock environment variables
process.env.REPLAY_BUCKET = "mock-bucket";
process.env.TABLE_INCIDENTS = "MockIncidentsTable";

// Mock AWS clients
const ddbMock = mockClient(DynamoDBClient);
const s3Mock = mockClient(S3Client);

// Setup fake S3 response
const fakeEvents = [
  { id: "1", ts: "12345", type: "flood" },
  { id: "2", ts: "12346", type: "storm" },
];

s3Mock.on(GetObjectCommand).resolves({
  Body: {
    transformToString: async () => JSON.stringify(fakeEvents),
  },
});

// Capture DynamoDB writes
const writtenItems: any[] = [];
ddbMock.on(PutItemCommand).callsFake((input) => {
  writtenItems.push(input);
  return {};
});

// Run the handler
(async () => {
  const result = await handler({ trigger: "local-test" });
  console.log("Lambda result:", result);
  console.log("Items written to DynamoDB mock:", writtenItems);
})();
