@echo off
REM AWS Elastic Beanstalk Deployment Script for Nowest Interior Ltd (Windows)
echo 🌱 Starting Elastic Beanstalk deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if EB CLI is installed
eb --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: EB CLI not found. Please install it first:
    echo    pip install awsebcli
    pause
    exit /b 1
)

REM Check if AWS CLI is configured
aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: AWS CLI not configured. Please run 'aws configure' first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the application
echo 🔨 Building application...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Error: Build failed. dist directory not found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Check if EB is initialized
if not exist ".elasticbeanstalk" (
    echo 🌱 Initializing Elastic Beanstalk...
    echo Please follow the prompts to set up your EB application:
    eb init
)

REM Check if environment exists and deploy
echo 🚀 Deploying to production environment...
eb deploy production

REM Set environment variables
echo ⚙️ Setting environment variables...
eb setenv NODE_ENV=production
eb setenv DATABASE_URL=mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior
eb setenv SESSION_SECRET=nowest-interior-session-secret-2024-production
eb setenv AWS_REGION=ap-south-1

REM Show deployment status
echo 📊 Deployment Status:
eb status

REM Open application in browser
echo 🌐 Opening application in browser...
eb open

echo 🎉 Elastic Beanstalk deployment completed!
echo.
echo 📋 Useful commands:
echo   eb status          - Check deployment status
echo   eb logs            - View application logs
echo   eb health          - Check application health
echo   eb console         - Open AWS console
echo   eb deploy          - Deploy updates
echo   eb terminate       - Terminate environment (careful!)
pause
