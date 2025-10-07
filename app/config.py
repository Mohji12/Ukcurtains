"""
Configuration settings for the FastAPI application.
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database settings
    database_url: str = "mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior"
    
    # Security settings
    secret_key: str = "nowest-interior-secret-key-2024"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Session settings
    session_secret: str = "nowest-interior-session-secret-2024"
    session_max_age: int = 604800  # 1 week in seconds
    
    # Server settings
    host: str = "localhost"
    port: int = 8000
    debug: bool = True
    
    # CORS settings
    allowed_origins: list[str] = ["*"]
    allowed_methods: list[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_headers: list[str] = ["*"]
    
    # File upload settings
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    upload_directory: str = "uploads"
    
    # Admin settings
    default_admin_username: str = "admin"
    default_admin_password: str = "admin123"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()

# Environment-specific overrides
if os.getenv("NODE_ENV") == "production":
    settings.debug = False
    settings.host = "0.0.0.0"
elif os.getenv("NODE_ENV") == "development":
    settings.debug = True
    settings.host = "localhost"
