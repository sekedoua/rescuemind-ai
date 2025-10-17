import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class LocationStack extends cdk.Stack {
  public readonly geocodeFn: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🚀 Lambda: Geocode + cluster locations
    this.geocodeFn = new lambda.Function(this, "GeocodeFn", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambdas/geocode_and_cluster"),
    });
  }
}
