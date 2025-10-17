import * as cdk from "aws-cdk-lib";
import { AgentStack } from "../lib/agent";
import { DataStack } from "../lib/data";
import { LocationStack } from "../lib/location";
import { MapStack } from "../lib/map";
import { ApiStack } from "../lib/api";

const app = new cdk.App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" };

// 1️⃣ Core Stacks
const data = new DataStack(app, "RescueMind-Data", { env });
const agent = new AgentStack(app, "RescueMind-Agent", { env });
const location = new LocationStack(app, "RescueMind-Location", { env });

// 2️⃣ Map stack depends on data
const map = new MapStack(app, "RescueMind-Map", {
  incidentsTable: data.incidentsTable,
  env,
});

// 3️⃣ API Stack connects everything
new ApiStack(app, "RescueMind-Api", {
  ingestFn: agent.ingestFn,
  summarizeFn: agent.summarizeFn,
  fetchFn: data.fetchFn,
  geocodeFn: location.geocodeFn,
  computeFn: data.computeFn,
  persistFn: data.persistFn,
  mapDataFn: map.mapDataFn,
  env,
});
