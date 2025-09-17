#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DataStack } from "../lib/data-plane";
import { AgentStack } from "../lib/agent";
import { ApiStack } from "../lib/api";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// --- Data Plane ---
const data = new DataStack(app, "RescueMind-Data", { env });

// --- Agent Plane ---
const agent = new AgentStack(app, "RescueMind-Agent", {
  env,
  incidentsTable: data.incidentsTable,
  resourcesTable: data.resourcesTable,
  replayBucket: data.replayBucket,
  eventBus: data.eventBus,
  placeIndex: data.placeIndex,
  searchDomain: data.searchDomain,
});

// --- API Plane ---
const api = new ApiStack(app, "RescueMind-Api", {
  env,
  incidentsTable: data.incidentsTable,
  resourcesTable: data.resourcesTable,
  replayBucket: data.replayBucket,
  eventBus: data.eventBus,
  placeIndex: data.placeIndex,
  searchDomain: data.searchDomain,
  // Si l’API doit appeler les lambdas agent :
  fetchFn: agent.fetchFn,
  geocodeFn: agent.geocodeFn,
  computeFn: agent.computeFn,
  persistFn: agent.persistFn,
  ingestFn: agent.ingestFn,
});

// --- Outputs ---
new cdk.CfnOutput(api, "RescueMindHttpApiUrl", {
  value: api.httpApiUrl,
});
new cdk.CfnOutput(api, "RescueMindWsApiUrl", {
  value: api.wsApiUrl,
});
