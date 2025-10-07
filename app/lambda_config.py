"""
Lambda-specific configuration for the FastAPI application.
"""
import os
from typing import Optional

class LambdaSettings:
    """
    Lambda-specific settings that override the main config.
    """
    
    def __init__(self):
        # Database settings for Lambda
        self.database_url = os.getenv(
            "DATABASE_URL", 
            "mysql+pymysql://username:password@host:port/database"
        )
        
        # Security settings
        self.secret_key = os.getenv("SECRET_KEY", "your-secret-key-here")
        self.algorithm = os.getenv("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        
        # Session settings
        self.session_secret = os.getenv("SESSION_SECRET", "your-session-secret-here")
        self.session_max_age = int(os.getenv("SESSION_MAX_AGE", "86400"))  # 24 hours
        
        # CORS settings for Lambda
        self.allowed_origins = [
            "https://your-frontend-domain.com",  # Replace with your actual frontend domain
            "http://localhost:3000",
            "http://localhost:5173",
        ]
        
        # Add any additional origins from environment
        additional_origins = os.getenv("ALLOWED_ORIGINS", "")
        if additional_origins:
            self.allowed_origins.extend(additional_origins.split(","))
        
        self.allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        self.allowed_headers = ["*"]
        
        # Lambda-specific settings
        self.is_lambda = bool(os.getenv("AWS_LAMBDA_FUNCTION_NAME"))
        self.debug = os.getenv("DEBUG", "false").lower() == "true"
        
        # Static file settings for Lambda
        # In Lambda, static files should be served from S3 or CDN
        self.static_files_base_url = os.getenv("STATIC_FILES_BASE_URL", "")
        self.upload_directory = os.getenv("UPLOAD_DIRECTORY", "/tmp/uploads")
        
        # S3 settings for file storage (if using S3)
        self.s3_bucket = os.getenv("S3_BUCKET", "")
        self.s3_region = os.getenv("S3_REGION", "us-east-1")
        
    def get_static_file_url(self, file_path: str) -> str:
        """
        Get the full URL for a static file.
        In Lambda, this should point to S3 or CDN.
        """
        if self.static_files_base_url:
            # Remove leading slash if present
            clean_path = file_path.lstrip("/")
            return f"{self.static_files_base_url.rstrip('/')}/{clean_path}"
        
        # Fallback to relative path
        return file_path

# Global Lambda settings instance
lambda_settings = LambdaSettings()
