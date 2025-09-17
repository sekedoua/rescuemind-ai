import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';


interface WebProps extends StackProps { apiGwWsUrl: string }
export class WebHostingStack extends Stack {
constructor(scope: Construct, id: string, props: WebProps) { super(scope, id, props);
const siteBucket = new s3.Bucket(this, 'WebBucket', {
blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
enforceSSL: true,
});


const dist = new cloudfront.Distribution(this, 'WebDist', {
defaultBehavior: { origin: new origins.S3Origin(siteBucket) },
minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
defaultRootObject: 'index.html',
});


new CfnOutput(this, 'WebUrl', { value: `https://${dist.domainName}` });
new CfnOutput(this, 'WebSocketUrlForClient', { value: props.apiGwWsUrl });
}
}