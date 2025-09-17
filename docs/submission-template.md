# AWS AI Agent Hackathon — Submission


## Project
**RescueMind** — AI agent for disaster response planning.


## Problem
Emergency responders lose time triaging multiple alerts and planning routes. Every minute costs lives.


## Solution
- Bedrock Agent with reasoning (Claude/Nova)
- Lambdas for ingest, clustering, routing, persistence, notification
- DynamoDB + S3 data plane, WebSocket real-time frontend
- Autonomous via EventBridge; optional HITL approval


## Impact
- Triage time reduced ~30% (demo replay)
- ETA improved ~12%


## Creativity
- Multi-step agent workflow
- Real-time map updates with React + MapLibre
- Integration with AWS Location & OpenSearch


## Technical Execution
- IaC with CDK (DynamoDB, S3, WS API, Lambdas, CloudFront, Amplify)
- Bedrock AgentCore action groups
- Reproducible with `seed-demo.sh`


## Functionality
- End-to-end flow works (ingest → map → notify)
- Scales serverless (Lambda, DynamoDB, S3, CloudFront)


## Demo
- 3 min video: problem, architecture, live replay, autonomy, KPIs, URLs


## URLs
- **Repo**: <link>
- **Diagram**: architecture/diagram.png
- **Live Deploy**: <CloudFront or Amplify URL>
- **Demo Video**: <YouTube/Vimeo link>


## Tie-breakers
- **Impact (20%)**: faster rescue
- **Creativity (10%)**: agentic workflow
- **Technical (50%)**: Bedrock AgentCore + CDK
- **Functionality (10%)**: working pipeline
- **Demo (10%)**: clear & concise