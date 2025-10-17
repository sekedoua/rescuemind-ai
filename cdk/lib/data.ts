import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DataStack extends cdk.Stack {
  public readonly fetchFn: lambda.Function;
  public readonly computeFn: lambda.Function;
  public readonly persistFn: lambda.Function;
  public readonly incidentsTable: dynamodb.Table;
  public readonly resourcesTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🚨 DynamoDB Tables
    this.incidentsTable = new dynamodb.Table(this, "IncidentsTable", {
      partitionKey: { name: "incidentId", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.resourcesTable = new dynamodb.Table(this, "ResourcesTable", {
      partitionKey: { name: "resourceId", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 🚀 Lambda: Fetch
    this.fetchFn = new lambda.Function(this, "FetchFn", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambdas/get_incidents"),
    });

    // 🚀 Lambda: Compute
    this.computeFn = new lambda.Function(this, "ComputeFn", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambdas/compute_routes"),
    });

    // 🚀 Lambda: Persist
    this.persistFn = new lambda.Function(this, "PersistFn", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambdas/persist_incident"),
      environment: {
        INCIDENTS_TABLE: this.incidentsTable.tableName,
      },
    });

    this.incidentsTable.grantReadWriteData(this.persistFn);
    this.incidentsTable.grantReadData(this.fetchFn);
  }
}
