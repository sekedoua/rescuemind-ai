import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import * as location from "aws-cdk-lib/aws-location";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface ApiProps extends cdk.StackProps {
  incidentsTable: dynamodb.Table;
  resourcesTable: dynamodb.Table;
  replayBucket: s3.Bucket;
  eventBus: events.EventBus;
  placeIndex: location.CfnPlaceIndex;
  searchDomain: opensearch.Domain;

  // Lambdas venant du AgentStack
  fetchFn: lambda.Function;
  geocodeFn: lambda.Function;
  computeFn: lambda.Function;
  persistFn: lambda.Function;
  ingestFn: lambda.Function;
}

export class ApiStack extends cdk.Stack {
  public readonly httpApiUrl: string;
  public readonly wsApiUrl: string;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    //
    // --- HTTP API ---
    //
    const httpApi = new apigwv2.HttpApi(this, "RescueMindHttpApi", {
      apiName: "RescueMindHttpApi",
    });

    // Exemple : route POST /incident -> persistFn
    httpApi.addRoutes({
      path: "/incident",
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        "PersistIncidentIntegration",
        props.persistFn
      ),
    });

    this.httpApiUrl = httpApi.apiEndpoint;

    //
    // --- WebSocket API ---
    //
    const wsApi = new apigwv2.WebSocketApi(this, "RescueMindWsApi", {
      apiName: "RescueMindWsApi",
      connectRouteOptions: {
        integration: new integrations.WebSocketLambdaIntegration(
          "ConnectIntegration",
          props.fetchFn
        ),
      },
      disconnectRouteOptions: {
        integration: new integrations.WebSocketLambdaIntegration(
          "DisconnectIntegration",
          props.fetchFn
        ),
      },
      defaultRouteOptions: {
        integration: new integrations.WebSocketLambdaIntegration(
          "DefaultIntegration",
          props.fetchFn
        ),
      },
    });

    const wsStage = new apigwv2.WebSocketStage(this, "RescueMindWsStage", {
      webSocketApi: wsApi,
      stageName: "dev",
      autoDeploy: true,
    });

    this.wsApiUrl = wsStage.url;

    //
    // --- Outputs ---
    //
    new cdk.CfnOutput(this, "HttpApiUrl", { value: this.httpApiUrl });
    new cdk.CfnOutput(this, "WsApiUrl", { value: this.wsApiUrl });
  }
}
