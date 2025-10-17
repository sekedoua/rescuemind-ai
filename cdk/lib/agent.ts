import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";


export interface AgentProps extends cdk.StackProps {}

export class AgentStack extends cdk.Stack {
  public readonly ingestFn: lambda.Function;
  public readonly summarizeFn: lambda.Function;

  constructor(scope: Construct, id: string, props?: AgentProps) {
    super(scope, id, props);

    // 🚀 Lambda: Ingest social signals
    this.ingestFn = new lambda.Function(this, "IngestFn", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambdas/ingest_social_signals"),
    });

      this.summarizeFn = new lambda.Function(this, "SummarizeFn", {
          runtime: lambda.Runtime.NODEJS_20_X,
          handler: "index.handler",
          code: lambda.Code.fromAsset("lambdas/bedrock_summarizer"),
          timeout: cdk.Duration.seconds(15),  // ⏱️ Allow up to 15 seconds
          memorySize: 512,                    // 💪 Give it more power
          environment: {
              MODEL_ID: "amazon.titan-text-lite-v1",
               
          },
      });


// ✅ Allow Bedrock model invocation
    this.summarizeFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: ["*"],
      })
    );

  }
}
