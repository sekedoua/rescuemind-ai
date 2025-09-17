#!/bin/bash
set -euo pipefail
BUCKET=$(aws cloudformation describe-stacks --stack-name RescueMind-Data --query "Stacks[0].Outputs[?OutputKey=='ReplayBucket'].OutputValue" --output text)
FUNC=$(aws lambda list-functions --query "Functions[?contains(FunctionName,'fetch_weather_alerts')].FunctionName" --output text)
echo "Uploading replay to $BUCKET ..."
aws s3 cp ../demo/replay_flood_small.json s3://$BUCKET/replay/replay_flood_small.json
echo "Invoking fetch_weather_alerts ..."
aws lambda invoke --function-name $FUNC out.json && cat out.json