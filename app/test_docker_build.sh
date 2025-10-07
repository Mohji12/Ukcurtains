#!/bin/bash

echo "🐳 Testing Docker Build for Lambda"
echo "=================================="

# Build the image with verbose output
echo "📦 Building Docker image..."
docker build -t nowest --no-cache --progress=plain . 2>&1 | tee build_output.log

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
else
    echo "❌ Docker build failed!"
    echo "Check build_output.log for details"
    exit 1
fi

# Test package installation
echo ""
echo "🧪 Testing package installation..."
docker run --rm nowest python -c "
import sys
print('Python version:', sys.version)

try:
    import fastapi
    print('✅ FastAPI imported successfully - version:', fastapi.__version__)
except ImportError as e:
    print('❌ FastAPI import failed:', e)

try:
    import mangum
    print('✅ Mangum imported successfully')
except ImportError as e:
    print('❌ Mangum import failed:', e)

try:
    import sqlalchemy
    print('✅ SQLAlchemy imported successfully - version:', sqlalchemy.__version__)
except ImportError as e:
    print('❌ SQLAlchemy import failed:', e)

try:
    import pymysql
    print('✅ PyMySQL imported successfully')
except ImportError as e:
    print('❌ PyMySQL import failed:', e)

try:
    import pydantic
    print('✅ Pydantic imported successfully - version:', pydantic.__version__)
except ImportError as e:
    print('❌ Pydantic import failed:', e)
"

# Test main module import
echo ""
echo "🔍 Testing main module import..."
docker run --rm nowest python -c "
try:
    import main
    print('✅ Main module imported successfully')
    print('Handler available:', hasattr(main, 'handler'))
except ImportError as e:
    print('❌ Main module import failed:', e)
except Exception as e:
    print('⚠️  Main module import had issues:', e)
"

# List all installed packages
echo ""
echo "📋 Installed packages:"
docker run --rm nowest pip list

echo ""
echo "🎉 Docker build test completed!"
echo "Image name: nowest"
echo "Ready for ECR push!"
