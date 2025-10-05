#!/bin/bash

# AWS Deployment Script for Nowest Interior Ltd
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Check deployment method
if [ "$1" = "eb" ]; then
    echo "🌱 Deploying to Elastic Beanstalk..."
    eb deploy
elif [ "$1" = "ec2" ]; then
    echo "🖥️  Deploying to EC2..."
    echo "Please follow the EC2 deployment steps in AWS_DEPLOYMENT_GUIDE.md"
elif [ "$1" = "apprunner" ]; then
    echo "🏃 Deploying to App Runner..."
    echo "Please follow the App Runner deployment steps in AWS_DEPLOYMENT_GUIDE.md"
else
    echo "📋 Available deployment options:"
    echo "  ./deploy.sh eb        - Deploy to Elastic Beanstalk"
    echo "  ./deploy.sh ec2       - Deploy to EC2 (manual steps required)"
    echo "  ./deploy.sh apprunner - Deploy to App Runner (manual steps required)"
    echo ""
    echo "For detailed instructions, see AWS_DEPLOYMENT_GUIDE.md"
fi

echo "🎉 Deployment process completed!"
