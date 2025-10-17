import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export interface MapStackProps extends cdk.StackProps {
  incidentsTable: dynamodb.ITable;
}

export class MapStack extends cdk.Stack {
  public readonly mapDataFn: lambda.Function;

  constructor(scope: Construct, id: string, props: MapStackProps) {
    super(scope, id, props);

    // 🚀 Lambda: MapData API
    this.mapDataFn = new lambda.Function(this, "MapDataFn", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambdas/mapdata"),
      environment: {
        INCIDENTS_TABLE: props.incidentsTable.tableName,
      },
    });

    props.incidentsTable.grantReadData(this.mapDataFn);
  }
}
