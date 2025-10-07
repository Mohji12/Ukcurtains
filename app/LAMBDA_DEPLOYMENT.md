# AWS Lambda Deployment Guide

This guide explains how to deploy the FastAPI application to AWS Lambda.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Docker (for building the Lambda container)
- Python 3.11

## Deployment Options

### Option 1: Container Image Deployment (Recommended)

1. **Build the Docker image:**
   ```bash
   cd app
   docker build -t nowest-interior-api .
   ```

2. **Tag the image for ECR:**
   ```bash
   docker tag nowest-interior-api:latest <account-id>.dkr.ecr.<region>.amazonaws.com/nowest-interior-api:latest
   ```

3. **Push to ECR:**
   ```bash
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/nowest-interior-api:latest
   ```

4. **Create Lambda function:**
   ```bash
   aws lambda create-function \
     --function-name nowest-interior-api \
     --package-type Image \
     --code ImageUri=<account-id>.dkr.ecr.<region>.amazonaws.com/nowest-interior-api:latest \
     --role arn:aws:iam::<account-id>:role/lambda-execution-role \
     --timeout 30 \
     --memory-size 1024
   ```

### Option 2: ZIP Package Deployment

1. **Create deployment package:**
   ```bash
   cd app
   python deploy_lambda.py
   ```

2. **Create Lambda function:**
   ```bash
   aws lambda create-function \
     --function-name nowest-interior-api \
     --runtime python3.11 \
     --role arn:aws:iam::<account-id>:role/lambda-execution-role \
     --handler main.handler \
     --zip-file fileb://lambda_deployment.zip \
     --timeout 30 \
     --memory-size 1024
   ```

## Environment Variables

Set the following environment variables in your Lambda function:

### Required Variables
- `DATABASE_URL`: MySQL connection string
- `SECRET_KEY`: Secret key for JWT tokens
- `SESSION_SECRET`: Secret for session management

### Optional Variables
- `DEBUG`: Set to "true" for debug mode (default: "false")
- `STATIC_FILES_BASE_URL`: Base URL for static files (S3 or CDN)
- `S3_BUCKET`: S3 bucket for file storage
- `S3_REGION`: S3 region
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## API Gateway Configuration

1. **Create API Gateway:**
   ```bash
   aws apigateway create-rest-api --name nowest-interior-api
   ```

2. **Configure proxy integration:**
   - Set up a proxy resource (`{proxy+}`)
   - Configure Lambda proxy integration
   - Point to your Lambda function

3. **Deploy the API:**
   ```bash
   aws apigateway create-deployment --rest-api-id <api-id> --stage-name prod
   ```

## Static Files

For Lambda deployment, static files (images, PDFs) should be served from:

1. **Amazon S3** (recommended)
2. **CloudFront CDN**
3. **External CDN**

Update the frontend to use the appropriate URLs for static files.

## Database Considerations

- Use **Amazon RDS** for MySQL database
- Ensure Lambda has VPC access if database is in private subnet
- Consider connection pooling for better performance
- Use **Amazon RDS Proxy** for connection management

## Monitoring and Logging

- Enable **CloudWatch Logs** for Lambda function
- Set up **CloudWatch Alarms** for errors and performance
- Use **AWS X-Ray** for distributed tracing

## Performance Optimization

1. **Memory and Timeout:**
   - Start with 1024 MB memory
   - Set timeout to 30 seconds
   - Adjust based on performance metrics

2. **Cold Start Optimization:**
   - Database initialization happens on first request
   - Consider using **Lambda Provisioned Concurrency** for critical functions

3. **Connection Pooling:**
   - Use **Amazon RDS Proxy** for database connections
   - Implement connection reuse in the application

## Security

1. **IAM Roles:**
   - Create minimal IAM role for Lambda
   - Grant only necessary permissions

2. **VPC Configuration:**
   - Place Lambda in private subnet if accessing RDS
   - Configure security groups appropriately

3. **Environment Variables:**
   - Use **AWS Secrets Manager** for sensitive data
   - Encrypt environment variables

## Troubleshooting

### Common Issues

1. **Import Errors:**
   - Ensure all dependencies are in the deployment package
   - Check Python path configuration

2. **Database Connection Issues:**
   - Verify VPC configuration
   - Check security group rules
   - Ensure RDS is accessible from Lambda

3. **Timeout Issues:**
   - Increase Lambda timeout
   - Optimize database queries
   - Use connection pooling

4. **Memory Issues:**
   - Increase Lambda memory allocation
   - Optimize application code
   - Check for memory leaks

### Debugging

1. **Check CloudWatch Logs:**
   ```bash
   aws logs describe-log-groups --log-group-name-prefix /aws/lambda/nowest-interior-api
   ```

2. **Test Lambda function:**
   ```bash
   aws lambda invoke --function-name nowest-interior-api --payload '{}' response.json
   ```

## Cost Optimization

1. **Right-size Lambda:**
   - Monitor memory usage
   - Adjust memory allocation accordingly

2. **Use S3 for Static Files:**
   - More cost-effective than Lambda storage
   - Better performance with CloudFront

3. **Optimize Database:**
   - Use appropriate RDS instance size
   - Implement caching where possible

## Example Environment Variables

```bash
DATABASE_URL=mysql+pymysql://username:password@rds-endpoint:3306/database
SECRET_KEY=your-super-secret-key-here
SESSION_SECRET=your-session-secret-here
STATIC_FILES_BASE_URL=https://your-s3-bucket.s3.amazonaws.com
S3_BUCKET=your-static-files-bucket
S3_REGION=us-east-1
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
DEBUG=false
```
