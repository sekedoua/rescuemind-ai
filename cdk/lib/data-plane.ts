import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import * as location from "aws-cdk-lib/aws-location";

export class DataStack extends cdk.Stack {
  public readonly incidentsTable: dynamodb.Table;
  public readonly resourcesTable: dynamodb.Table;
  public readonly replayBucket: s3.Bucket;
  public readonly eventBus: events.EventBus;
  public readonly searchDomain: opensearch.Domain;
  public readonly placeIndex: location.CfnPlaceIndex; // ✅ resource

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB tables
    this.incidentsTable = new dynamodb.Table(this, "IncidentsTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    this.resourcesTable = new dynamodb.Table(this, "ResourcesTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Replay bucket
    this.replayBucket = new s3.Bucket(this, "ReplayBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // EventBridge bus
    this.eventBus = new events.EventBus(this, "RescueMindBus", {
      eventBusName: "RescueMindEventBus",
    });

    // OpenSearch domain
    this.searchDomain = new opensearch.Domain(this, "SearchDomain", {
      version: opensearch.EngineVersion.OPENSEARCH_2_11,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Location Service Place Index
    this.placeIndex = new location.CfnPlaceIndex(this, "RescueMindPlaceIndex", {
      dataSource: "Esri",
      indexName: "rescuemind-place-index",
    });
  }
}
