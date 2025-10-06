#!/bin/bash

# AWS Elastic Beanstalk Deployment Script for Nowest Interior Ltd
echo "🌱 Starting Elastic Beanstalk deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ Error: EB CLI not found. Please install it first:"
    echo "   pip install awsebcli"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

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

# Check if EB is initialized
if [ ! -d ".elasticbeanstalk" ]; then
    echo "🌱 Initializing Elastic Beanstalk..."
    echo "Please follow the prompts to set up your EB application:"
    eb init
fi

# Check if environment exists
if ! eb list | grep -q "production"; then
    echo "🚀 Creating production environment..."
    eb create production
else
    echo "🚀 Deploying to existing production environment..."
    eb deploy production
fi

# Set environment variables
echo "⚙️ Setting environment variables..."
eb setenv NODE_ENV=production
eb setenv DATABASE_URL=mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior
eb setenv SESSION_SECRET=nowest-interior-session-secret-2024-production
eb setenv AWS_REGION=ap-south-1

# Show deployment status
echo "📊 Deployment Status:"
eb status

# Open application in browser
echo "🌐 Opening application in browser..."
eb open

echo "🎉 Elastic Beanstalk deployment completed!"
echo ""
echo "📋 Useful commands:"
echo "  eb status          - Check deployment status"
echo "  eb logs            - View application logs"
echo "  eb health          - Check application health"
echo "  eb console         - Open AWS console"
echo "  eb deploy          - Deploy updates"
echo "  eb terminate       - Terminate environment (careful!)"
