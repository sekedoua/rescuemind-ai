import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import * as location from "aws-cdk-lib/aws-location";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";

export interface AgentProps extends cdk.StackProps {
  incidentsTable: dynamodb.Table;
  resourcesTable: dynamodb.Table;
  replayBucket: s3.Bucket;
  eventBus: events.EventBus;
  placeIndex: location.CfnPlaceIndex;
  searchDomain: opensearch.Domain;
}

export class AgentStack extends cdk.Stack {
  public readonly fetchFn: lambda.Function;
  public readonly geocodeFn: lambda.Function;
  public readonly computeFn: lambda.Function;
  public readonly persistFn: lambda.Function;
  public readonly ingestFn: lambda.Function;

  constructor(scope: Construct, id: string, props: AgentProps) {
    super(scope, id, props);

    //
    // Fetch Weather Alerts
    //
    this.fetchFn = new lambda.Function(this, "FetchWeatherAlertsFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../lambdas/fetch_weather_alerts"),
      environment: {
        TABLE_NAME: props.incidentsTable.tableName,
      },
    });

    //
    // Geocode + Cluster
    //
    this.geocodeFn = new lambda.Function(this, "GeocodeClusterFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../lambdas/geocode_and_cluster"),
      environment: {
        TABLE_NAME: props.incidentsTable.tableName,
        PLACE_INDEX_NAME: props.placeIndex.ref,
      },
    });

    //
    // Compute Routes
    //
    this.computeFn = new lambda.Function(this, "ComputeRoutesFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../lambdas/compute_routes"),
      environment: {
        TABLE_NAME: props.resourcesTable.tableName,
      },
    });

    //
    // Persist Incident
    //
    this.persistFn = new lambda.Function(this, "PersistIncidentFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../lambdas/persist_incident"),
      environment: {
        TABLE_NAME: props.incidentsTable.tableName,
      },
    });

    //
    // Ingest to OpenSearch
    //
    this.ingestFn = new lambda.Function(this, "IngestToOpenSearchFn", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../lambdas/ingest_social_signals"),
      environment: {
        OPENSEARCH_ENDPOINT: props.searchDomain.domainEndpoint,
        OPENSEARCH_INDEX: "rescuemind-signals",
      },
    });
  }
}
