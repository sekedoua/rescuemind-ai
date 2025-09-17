import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as location from "aws-cdk-lib/aws-location";

export class LocationStack extends cdk.Stack {
  public readonly placeIndex: location.CfnPlaceIndex;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.placeIndex = new location.CfnPlaceIndex(this, "RescueMindPlaceIndex", {
      dataSource: "Esri",
      dataSourceConfiguration: { intendedUse: "SingleUse" },
      indexName: "rescuemind-index",
      pricingPlan: "RequestBasedUsage",
    });

    new cdk.CfnOutput(this, "PlaceIndexName", {
      value: this.placeIndex.indexName!,
    });
  }
}
