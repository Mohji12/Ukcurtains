#!/bin/bash

# Build the frontend
npm run build

# Get the S3 bucket name from serverless output
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name nowest-interior-serverless-dev --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' --output text)

# Sync frontend files to S3
aws s3 sync dist/public/ s3://$BUCKET_NAME/ --delete

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "'$(date +%s)'",
  "Comment": "Nowest Interior Frontend Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-'$BUCKET_NAME'",
        "DomainName": "'$BUCKET_NAME'.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-'$BUCKET_NAME'",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}'

echo "Frontend deployed to S3 bucket: $BUCKET_NAME"
echo "CloudFront distribution created successfully!"
