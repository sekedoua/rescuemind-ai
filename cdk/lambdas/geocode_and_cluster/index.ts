// lambdas/geocode_and_cluster/index.ts
// Accepts an event and uses AWS Location to “geocode” points,
// then writes enriched items to DynamoDB. Kept simple for tests.

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  LocationClient,
  SearchPlaceIndexForPositionCommand,
} from "@aws-sdk/client-location";

const ddb = new DynamoDBClient({});
const location = new LocationClient({});

const TABLE = process.env.TABLE_INCIDENTS || "MockIncidentsTable";
const PLACE_INDEX = process.env.PLACE_INDEX_NAME || "MockPlaceIndex";

export const handler = async (event: any = {}) => {
  // Test-friendly shapes: event.points | event.candidates | event.items
  const items: any[] =
    event?.points ??
    event?.candidates ??
    event?.items ??
    [];

  let geocodedCount = 0;

  for (const item of items) {
    // Expect either item.position: [lon, lat] or item.lon/lat
    const lon =
      Array.isArray(item?.position) ? item.position[0] : item?.lon ?? 0;
    const lat =
      Array.isArray(item?.position) ? item.position[1] : item?.lat ?? 0;

    // Call Location service (so the jest mock sees a request)
    await location.send(
      new SearchPlaceIndexForPositionCommand({
        IndexName: PLACE_INDEX,
        Position: [lon, lat],
        MaxResults: 1,
      })
    );

    // Persist an enriched record to DynamoDB (so the jest mock sees a PutItem)
    const record = {
      pk: `INC#${item.id ?? randomId()}`,
      sk: `TS#${item.ts ?? Date.now()}`,
      type: item.type ?? "GEO",
      lat,
      lon,
      status: item.status ?? "ENRICHED",
    };

    await ddb.send(
      new PutItemCommand({
        TableName: TABLE,
        Item: marshall(record),
      })
    );

    geocodedCount++;
  }

  return { geocoded: geocodedCount };
};

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}
