import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import * as location from "aws-cdk-lib/aws-location";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";

export class DataStack extends cdk.Stack {
  public readonly incidentsTable: dynamodb.Table;
  public readonly resourcesTable: dynamodb.Table;
  public readonly replayBucket: s3.Bucket;
  public readonly eventBus: events.EventBus;
  public readonly placeIndex: location.CfnPlaceIndex;
  public readonly searchDomain: opensearch.Domain;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //
    // --- DynamoDB: Incidents Table ---
    //
    this.incidentsTable = new dynamodb.Table(this, "IncidentsTable", {
      partitionKey: { name: "incidentId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // ⚠️ dev only
    });

    //
    // --- DynamoDB: Resources Table ---
    //
    this.resourcesTable = new dynamodb.Table(this, "ResourcesTable", {
      partitionKey: { name: "resourceId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // ⚠️ dev only
    });

    //
    // --- S3 Bucket for Replay Data ---
    //
    this.replayBucket = new s3.Bucket(this, "ReplayBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // ⚠️ dev only
      autoDeleteObjects: true,                  // ⚠️ dev only
    });

    //
    // --- EventBridge Bus ---
    //
    this.eventBus = new events.EventBus(this, "RescueMindEventBus", {
      eventBusName: "RescueMindBus",
    });

    //
    // --- Amazon Location Place Index ---
    //
    this.placeIndex = new location.CfnPlaceIndex(this, "RescueMindPlaceIndex", {
      dataSource: "Esri", // or "Here" depending on region
      indexName: "RescueMindPlaceIndex",
    });

    //
    // --- OpenSearch Domain ---
    //
    this.searchDomain = new opensearch.Domain(this, "RescueMindSearchDomain", {
      version: opensearch.EngineVersion.OPENSEARCH_2_11,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // ⚠️ dev only
      capacity: {
        dataNodes: 1,
        dataNodeInstanceType: "t3.small.search",
      },
      ebs: {
        volumeSize: 10,
      },
    });

    //
    // --- Outputs ---
    //
    new cdk.CfnOutput(this, "IncidentsTableName", {
      value: this.incidentsTable.tableName,
    });
    new cdk.CfnOutput(this, "ResourcesTableName", {
      value: this.resourcesTable.tableName,
    });
    new cdk.CfnOutput(this, "ReplayBucketName", {
      value: this.replayBucket.bucketName,
    });
    new cdk.CfnOutput(this, "EventBusName", {
      value: this.eventBus.eventBusName,
    });
    new cdk.CfnOutput(this, "PlaceIndexName", {
      value: this.placeIndex.indexName!,
    });
    new cdk.CfnOutput(this, "OpenSearchDomainEndpoint", {
      value: this.searchDomain.domainEndpoint,
    });
  }
}
