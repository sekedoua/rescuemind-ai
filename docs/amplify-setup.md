# Amplify Hosting
1. Connect GitHub repo in Amplify Console.
2. Build settings (webapp):
```yaml
version: 1
frontend:
phases:
preBuild:
commands:
- cd webapp && npm ci
build:
commands:
- npm run build
artifacts:
baseDirectory: webapp/dist
files:
- '**/*'
cache:
paths:
- node_modules/**