##🛰️ RescueMind – AI-Powered Disaster Response Map

🌐 Live Demo:
👉 https://d2xbkuqehmb0br.cloudfront.net

⚙️ Backend (API Gateway):
👉 https://tj3yov0q6h.execute-api.us-east-1.amazonaws.com/prod

##🚨 Overview

RescueMind is a serverless AI platform that visualizes real-time emergencies and automatically generates action plans using Amazon Bedrock.

The application displays live disaster incidents (floods, fires, earthquakes, etc.) on an interactive map.
Each incident marker contains an AI-generated summary and response plan, helping responders prioritize actions quickly.

##🎨 Features

✅ Real-time interactive map with Leaflet
✅ Color-coded markers for incident status
✅ AI-generated summaries + action plans via Bedrock
✅ Fully serverless architecture (Lambda, DynamoDB, API Gateway, S3, CloudFront)
✅ Dynamically extensible — add new cities or alerts anytime

##🧩 Repository Structure
rescuemind/
├── cdk/
│   ├── bin/app.ts
│   ├── lib/
│   │   ├── agent.ts
│   │   ├── data.ts
│   │   ├── location.ts
│   │   ├── map.ts
│   │   └── api.ts
│   ├── lambdas/
│   │   ├── bedrock_summarizer/index.js
│   │   ├── mapdata/index.js
│   └── package.json
├── frontend/
│   ├── src/Components/Map/IncidentMap.tsx
│   ├── vite.config.ts
│   └── package.json
├── scripts/
│   └── incidents-batch.json
└── README.md


##🧱 Architecture

![Architecture Diagram](architecture/Image_22_45_08.png)  

#Frontend
Built with React + Vite + Leaflet

Hosted on AWS S3 + CloudFront

Communicates with API Gateway endpoints for incidents and summaries

Supports live map rendering with AI-powered popups

#Backend

AWS Lambda + API Gateway

DynamoDB stores incident data

Amazon Bedrock (Titan Text Lite v1) generates summaries

Deployed using AWS CDK




##🔗 Endpoints

#Method	Path	Description
GET	/mapdata	Returns all active incidents
POST	/summarize	Generates AI summary + action plan

```
Example
curl -X POST https://tj3yov0q6h.execute-api.us-east-1.amazonaws.com/prod/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Flood alert in Miami. Evacuation recommended near downtown."}'


Example response:

{
  "summary": "Emergency message: Flood alert in Miami near downtown. Evacuation recommended. Action plan: monitor updates, prepare emergency kits, follow local authorities' instructions."
}
```

##🗺️ Adding New Incidents

Add new incidents directly to the DynamoDB table via AWS CLI:
```
aws dynamodb put-item \
  --table-name RescueMind-Data-IncidentsTable \
  --item '{
    "incidentId": {"S": "INC-020"},
    "type": {"S": "wildfire"},
    "city": {"S": "San Diego"},
    "latitude": {"N": "32.7157"},
    "longitude": {"N": "-117.1611"},
    "status": {"S": "active"}
  }'
```


Batch upload several:

```
aws dynamodb batch-write-item --request-items file://scripts/incidents-batch.json
```

Verify that data is live:

curl https://tj3yov0q6h.execute-api.us-east-1.amazonaws.com/prod/mapdata

##🚀 Deployment Guide

#Backend (CDK)
```
cd cdk
npx cdk bootstrap
npx cdk deploy --all
```

#Frontend (React + Vite)

```
cd frontend
npm ci
npm run build
aws s3 sync build/ s3://rescuemind-frontend-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

Ensure API Gateway has correct CORS settings:
```

Allowed Origin → https://d2xbkuqehmb0br.cloudfront.net

Allowed Methods → GET, POST, OPTIONS

Allowed Headers → Content-Type
```

Then redeploy:

```
aws apigateway create-deployment --rest-api-id tj3yov0q6h --stage-name prod
```

##🎨 Features

✅ Real-time interactive map with Leaflet
✅ Color-coded markers for incident status
✅ AI-generated summaries + action plans via Bedrock
✅ Fully serverless architecture (Lambda, DynamoDB, API Gateway, S3, CloudFront)
✅ Dynamically extensible — add new cities or alerts anytime

##🧠 Challenges & Fixes (with GPT-5)
#Challenge	Resolution
-Lambda ES-module import errors	Converted to CommonJS + adjusted package.json
-Bedrock access denied	Added bedrock:InvokeModel to Lambda IAM policy
-JSON body parsing errors	Implemented safe event parsing in summarizer Lambda
-Missing map markers	Fixed /mapdata response formatting
-“Failed to fetch summary”	Enabled correct CORS configuration for CloudFront
-Build failure with Vite	Upgraded Node to v20.19 and rebuilt frontend
-Timeout on summarizer	Increased memory & timeout in CDK stack
-404 favicon & marker icon bugs	Corrected asset paths in Vite build output



##🧠 How GPT Helped

Throughout the build, GPT-5 acted as a technical co-engineer, providing:

-AWS CDK refactors and IAM policy design

-Lambda debugging and ES module migration

-API Gateway CORS setup

-Bedrock integration logic

-Frontend Leaflet rendering fixes

-Production deployment guidance (S3 + CloudFront)

🎬 Demo Video Outline

Intro (10 s) – “This is RescueMind, an AI-powered real-time disaster response map.”

Map View (20 s) – Show markers for Miami, Phoenix, Los Angeles, etc.

Popup (20 s) – Click marker → show Bedrock-generated summary and plan.

Backend (20 s) – Demonstrate /mapdata and /summarize endpoints in console.

Closing (10 s) – “Fully serverless, built on AWS & Bedrock.”

🪪 License

MIT License © 2025 RescueMind Team