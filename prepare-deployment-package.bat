@echo off
REM Prepare deployment package for AWS Elastic Beanstalk Console Upload
echo 🚀 Preparing deployment package for AWS Console...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
npm install

echo 🔨 Building application...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Error: Build failed. dist directory not found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Create deployment directory
if exist "deployment-package" rmdir /s /q "deployment-package"
mkdir "deployment-package"

echo 📁 Copying files to deployment package...

REM Copy essential files
copy "package.json" "deployment-package\"
xcopy "dist" "deployment-package\dist\" /e /i
xcopy ".ebextensions" "deployment-package\.ebextensions\" /e /i
xcopy "attached_assets" "deployment-package\attached_assets\" /e /i

echo ✅ Files copied successfully!

REM Create ZIP file
echo 📦 Creating ZIP file...
powershell -command "Compress-Archive -Path 'deployment-package\*' -DestinationPath 'nowest-interior-deployment.zip' -Force"

echo ✅ Deployment package created: nowest-interior-deployment.zip
echo.
echo 📋 Next steps:
echo 1. Go to AWS Elastic Beanstalk Console
echo 2. Create new application
echo 3. Upload the ZIP file: nowest-interior-deployment.zip
echo 4. Follow the console deployment guide
echo.
echo 📄 See AWS_CONSOLE_DEPLOYMENT_GUIDE.md for detailed steps
pause
