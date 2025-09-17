# 🚀 AgentCore Setup Guide

This guide explains how to configure the **RescueMind Agent** in **Amazon Bedrock AgentCore** and connect it to the AWS Lambdas deployed via CDK.

---

## 1. Create the Agent

1. In the AWS Console, open **Amazon Bedrock → Agents**.  
2. Click **Create agent**:  
   - **Name**: `RescueMind`  
   - **Foundation model**: Claude 3.5 Sonnet (or Nova reasoning-capable model)  
   - **System prompt**: paste the content from [`agent/prompts/system.md`](../agent/prompts/system.md).  

---

## 2. Define Action Groups

For each Lambda function, create a corresponding **Action Group** inside the agent.

| Action Group           | Lambda Function             | Purpose                                 | Schema Example |
|------------------------|-----------------------------|-----------------------------------------|----------------|
| `fetch_weather_alerts` | `fetch_weather_alerts`      | Ingest alerts (S3 replay or APIs)       | N/A (trigger only) |
| `geocode_and_cluster`  | `geocode_and_cluster`       | Reverse-geocode & cluster incidents     | [`incident.json`](../agent/schemas/incident.json) |
| `compute_routes`       | `compute_routes`            | Generate response routes                 | [`route_plan.json`](../agent/schemas/route_plan.json) |
| `persist_incident`     | `persist_incident`          | Save enriched incident to DynamoDB       | Same as `incident.json` |
| `notify_responders`    | `notify_responders`         | Push updates to WebSocket clients        | Minimal schema (status + message) |

### Example schema snippet (for `compute_routes`)
```yaml
paths:
  /compute:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: "agent/schemas/route_plan.json"
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  polyline:
                    type: array
                    items:
                      type: array
                      items: { type: number }
                  etaMin:
                    type: number
