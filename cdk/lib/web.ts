import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🔹 S3 bucket to host static website
    const siteBucket = new s3.Bucket(this, "RescueMindWebBucket", {
      websiteIndexDocument: "index.html",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // ✅ cleanup on cdk destroy
    });

    // 🔹 CloudFront distribution to serve content over HTTPS
    const distribution = new cloudfront.Distribution(this, "RescueMindWebDistribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
    });

    // 🔹 Deploy frontend build folder into the bucket
    new s3deploy.BucketDeployment(this, "DeployRescueMindWeb", {
      sources: [s3deploy.Source.asset("../frontend/build")], // make sure frontend is built before deploy
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // 🔹 Output the public CloudFront URL
    new cdk.CfnOutput(this, "RescueMindWebAppUrl", {
      value: `https://${distribution.domainName}`,
      description: "Live Web Map endpoint for judges",
    });
  }
}
