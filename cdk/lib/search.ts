import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";

export class SearchStack extends cdk.Stack {
  public readonly domain: opensearch.Domain;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.domain = new opensearch.Domain(this, "RescueMindDomain", {
      version: opensearch.EngineVersion.OPENSEARCH_2_9,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      enforceHttps: true,
      nodeToNodeEncryption: true,
      encryptionAtRest: { enabled: true },
      capacity: {
        dataNodes: 1,
        dataNodeInstanceType: "t3.small.search",
      },
    });

    new cdk.CfnOutput(this, "OpenSearchEndpoint", {
      value: this.domain.domainEndpoint,
    });
  }
}
