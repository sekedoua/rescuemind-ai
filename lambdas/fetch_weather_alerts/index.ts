import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});
const s3 = new S3Client({});

const TABLE = process.env.TABLE_INCIDENTS || "MockIncidentsTable";
const BUCKET = process.env.REPLAY_BUCKET || "MockReplayBucket";

export const handler = async (event: any = {}) => {
  // Demo: fetch object from S3 if key is provided
  if (event?.s3Key) {
    await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: event.s3Key,
      })
    );
  }

  // Write a mock incident to DynamoDB
  const incident = {
    pk: `INC#${Date.now()}`,
    sk: `TS#${Date.now()}`,
    type: "WEATHER",
    description: "Severe storm warning",
  };

  await ddb.send(
    new PutItemCommand({
      TableName: TABLE,
      Item: marshall(incident),
    })
  );

  return { status: "stored", incident };
};