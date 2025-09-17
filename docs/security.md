# Security hardening
- **S3**: BlockPublicAccess=ALL, enforce SSL, no public ACLs.
- **CloudFront**: private S3 origin via OAC, TLS 1.2 (2021).
- **DynamoDB**: least-privilege per Lambda.
- **OpenSearch**: HTTPS, encryption at rest, IAM-only access.
- **Location**: limit IAM to specific Place Index ARN.
- **Secrets**: use Secrets Manager for any 3rd-party keys.