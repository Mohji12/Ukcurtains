#!/usr/bin/env python3
"""
Deployment script for AWS Lambda.
This script helps prepare the application for Lambda deployment.
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

def create_deployment_package():
    """
    Create a deployment package for AWS Lambda.
    """
    print("Creating Lambda deployment package...")
    
    # Create deployment directory
    deploy_dir = Path("lambda_deploy")
    if deploy_dir.exists():
        shutil.rmtree(deploy_dir)
    deploy_dir.mkdir()
    
    # Copy application files
    app_files = [
        "main.py",
        "config.py", 
        "lambda_config.py",
        "database.py",
        "requirements.txt",
        "models/",
        "schemas/",
        "services/",
        "api/",
        "middleware/",
        "utils/"
    ]
    
    for file_path in app_files:
        src = Path(file_path)
        if src.exists():
            if src.is_file():
                shutil.copy2(src, deploy_dir / src.name)
            else:
                shutil.copytree(src, deploy_dir / src.name)
        else:
            print(f"Warning: {file_path} not found")
    
    # Install dependencies
    print("Installing dependencies...")
    subprocess.run([
        sys.executable, "-m", "pip", "install", 
        "-r", "requirements.txt", 
        "-t", str(deploy_dir)
    ], check=True)
    
    # Create deployment zip
    print("Creating deployment zip...")
    shutil.make_archive("lambda_deployment", "zip", deploy_dir)
    
    print("Deployment package created: lambda_deployment.zip")
    print(f"Package size: {os.path.getsize('lambda_deployment.zip') / 1024 / 1024:.2f} MB")
    
    # Clean up
    shutil.rmtree(deploy_dir)
    
    return "lambda_deployment.zip"

def validate_deployment():
    """
    Validate the deployment package.
    """
    print("Validating deployment package...")
    
    # Check if main.py exists and has handler
    with open("main.py", "r") as f:
        content = f.read()
        if "handler" not in content:
            print("ERROR: main.py does not contain 'handler' function")
            return False
        if "Mangum" not in content:
            print("ERROR: main.py does not import Mangum")
            return False
    
    # Check requirements.txt
    with open("requirements.txt", "r") as f:
        content = f.read()
        if "mangum" not in content:
            print("ERROR: requirements.txt does not include mangum")
            return False
    
    print("Deployment package validation passed!")
    return True

def main():
    """
    Main deployment function.
    """
    print("AWS Lambda Deployment Script")
    print("=" * 40)
    
    # Validate before creating package
    if not validate_deployment():
        print("Validation failed. Please fix the issues above.")
        sys.exit(1)
    
    # Create deployment package
    try:
        package_file = create_deployment_package()
        print(f"\n✅ Deployment package created successfully: {package_file}")
        print("\nNext steps:")
        print("1. Upload the zip file to AWS Lambda")
        print("2. Set the handler to 'main.handler'")
        print("3. Configure environment variables:")
        print("   - DATABASE_URL")
        print("   - SECRET_KEY")
        print("   - SESSION_SECRET")
        print("   - STATIC_FILES_BASE_URL (for S3/CDN)")
        print("4. Set up API Gateway to proxy requests to Lambda")
        
    except Exception as e:
        print(f"❌ Error creating deployment package: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
