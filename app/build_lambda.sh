#!/bin/bash

echo "🐳 Building Lambda-compatible Docker image"
echo "=========================================="

# Set variables
IMAGE_NAME="nowest"
ECR_REGISTRY="941377152660.dkr.ecr.ap-south-1.amazonaws.com"
ECR_REPO="nowest"
REGION="ap-south-1"

# Build the image with the correct platform for Lambda
echo "📦 Building Docker image for Lambda..."
docker build \
    --platform linux/amd64 \
    --file Dockerfile.lambda \
    --tag ${IMAGE_NAME}:latest \
    --tag ${ECR_REGISTRY}/${ECR_REPO}:latest \
    .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
else
    echo "❌ Docker build failed!"
    exit 1
fi

# Test the image locally
echo ""
echo "🧪 Testing the image..."
docker run --rm --platform linux/amd64 ${IMAGE_NAME}:latest python -c "
import sys
print('Python version:', sys.version)
print('Platform:', sys.platform)

try:
    import fastapi
    print('✅ FastAPI imported - version:', fastapi.__version__)
except ImportError as e:
    print('❌ FastAPI import failed:', e)

try:
    import mangum
    print('✅ Mangum imported successfully')
except ImportError as e:
    print('❌ Mangum import failed:', e)

try:
    import sqlalchemy
    print('✅ SQLAlchemy imported - version:', sqlalchemy.__version__)
except ImportError as e:
    print('❌ SQLAlchemy import failed:', e)

try:
    import main
    print('✅ Main module imported successfully')
    print('Handler available:', hasattr(main, 'handler'))
except Exception as e:
    print('❌ Main module import failed:', e)
"

# Login to ECR
echo ""
echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Push the image to ECR
echo ""
echo "📤 Pushing image to ECR..."
docker push ${ECR_REGISTRY}/${ECR_REPO}:latest

echo ""
echo "🎉 Successfully built and pushed to ECR!"
echo "ECR URI: ${ECR_REGISTRY}/${ECR_REPO}:latest"
echo ""
echo "Next steps:"
echo "1. Create/update Lambda function with this image"
echo "2. Set handler to 'main.handler'"
echo "3. Configure environment variables"
