"""
Pydantic schemas for Admin model validation.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AdminCreate(BaseModel):
    """Schema for creating a new admin user."""
    username: str = Field(..., min_length=3, max_length=255, description="Admin username")
    password: str = Field(..., min_length=6, max_length=255, description="Admin password")


class AdminLogin(BaseModel):
    """Schema for admin login request."""
    username: str = Field(..., description="Admin username")
    password: str = Field(..., description="Admin password")


class AdminResponse(BaseModel):
    """Schema for admin response data."""
    id: str = Field(..., description="Admin ID")
    username: str = Field(..., description="Admin username")
    created_at: datetime = Field(..., description="Creation timestamp")
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for authentication token response."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    admin: AdminResponse = Field(..., description="Admin user data")
