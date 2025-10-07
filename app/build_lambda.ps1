# PowerShell script to build and push Lambda Docker image

Write-Host "🐳 Building Lambda-compatible Docker image" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Set variables
$IMAGE_NAME = "nowest"
$ECR_REGISTRY = "941377152660.dkr.ecr.ap-south-1.amazonaws.com"
$ECR_REPO = "nowest"
$REGION = "ap-south-1"

# Build the image with the correct platform for Lambda
Write-Host "📦 Building Docker image for Lambda..." -ForegroundColor Yellow
docker build `
    --platform linux/amd64 `
    --file Dockerfile.lambda `
    --tag "${IMAGE_NAME}:latest" `
    --tag "${ECR_REGISTRY}/${ECR_REPO}:latest" `
    .

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# Test the image locally
Write-Host ""
Write-Host "🧪 Testing the image..." -ForegroundColor Yellow
docker run --rm --platform linux/amd64 ${IMAGE_NAME}:latest python -c @"
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
"@

# Login to ECR
Write-Host ""
Write-Host "🔐 Logging in to ECR..." -ForegroundColor Yellow
$loginCommand = aws ecr get-login-password --region $REGION
$loginCommand | docker login --username AWS --password-stdin $ECR_REGISTRY

# Push the image to ECR
Write-Host ""
Write-Host "📤 Pushing image to ECR..." -ForegroundColor Yellow
docker push "${ECR_REGISTRY}/${ECR_REPO}:latest"

Write-Host ""
Write-Host "🎉 Successfully built and pushed to ECR!" -ForegroundColor Green
Write-Host "ECR URI: ${ECR_REGISTRY}/${ECR_REPO}:latest" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create/update Lambda function with this image"
Write-Host "2. Set handler to 'main.handler'"
Write-Host "3. Configure environment variables"
