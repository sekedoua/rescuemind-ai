const { LocationClient, SearchPlaceIndexForPositionCommand } = require("@aws-sdk/client-location");

const client = new LocationClient();

exports.handler = async (event) => {
  console.log("GeocodeClusterFn invoked:", JSON.stringify(event));

  const placeIndexName = process.env.PLACE_INDEX_NAME;
  if (!placeIndexName) throw new Error("PLACE_INDEX_NAME not set");

  const { lat, lon } = event;
  const cmd = new SearchPlaceIndexForPositionCommand({
    IndexName: placeIndexName,
    Position: [lon, lat],
  });

  const result = await client.send(cmd);
  return {
    statusCode: 200,
    body: JSON.stringify(result.Results || []),
  };
};