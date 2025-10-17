import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface ApiProps extends cdk.StackProps {
  ingestFn: lambda.Function;
  summarizeFn: lambda.Function;
  fetchFn: lambda.Function;
  geocodeFn: lambda.Function;
  computeFn: lambda.Function;
  persistFn: lambda.Function;
  mapDataFn: lambda.Function;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    // 🚀 API Gateway
	
		   const api = new apigateway.RestApi(this, "RescueMindApi", {
		  restApiName: "RescueMind Service",
		  description: "API for incident management.",
		  defaultCorsPreflightOptions: {
			allowOrigins: apigateway.Cors.ALL_ORIGINS,
			allowMethods: apigateway.Cors.ALL_METHODS,
			allowHeaders: [
			  "Content-Type",
			  "X-Amz-Date",
			  "Authorization",
			  "X-Api-Key",
			  "X-Amz-Security-Token",
			],
		  },
		});

	
	

    // 🧩 Helper for routes
    const addLambdaRoute = (path: string, method: string, fn: lambda.Function) => {
      const resource = api.root.addResource(path);
      resource.addMethod(method, new apigateway.LambdaIntegration(fn));
    };

    // 🔗 Define endpoints
    addLambdaRoute("ingest", "POST", props.ingestFn);
    addLambdaRoute("summarize", "POST", props.summarizeFn);
    addLambdaRoute("fetch", "GET", props.fetchFn);
    addLambdaRoute("geocode", "POST", props.geocodeFn);
    addLambdaRoute("compute", "POST", props.computeFn);
    addLambdaRoute("persist", "POST", props.persistFn);
    addLambdaRoute("mapdata", "GET", props.mapDataFn);

    // 🌐 Output endpoint URL
    new cdk.CfnOutput(this, "ApiUrl", { value: api.url ?? "Unknown" });
  }
}
