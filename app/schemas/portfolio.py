"""
Pydantic schemas for Portfolio model validation.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PortfolioCreate(BaseModel):
    """Schema for creating a new portfolio item."""
    title: str = Field(..., min_length=1, max_length=255, description="Portfolio item title")
    description: Optional[str] = Field(None, description="Portfolio item description")
    image: Optional[str] = Field(None, max_length=500, description="Portfolio item image URL")
    client: Optional[str] = Field(None, max_length=255, description="Client name")
    location: Optional[str] = Field(None, max_length=255, description="Project location")
    category: Optional[str] = Field(None, max_length=100, description="Project category")


class PortfolioUpdate(BaseModel):
    """Schema for updating an existing portfolio item."""
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Portfolio item title")
    description: Optional[str] = Field(None, description="Portfolio item description")
    image: Optional[str] = Field(None, max_length=500, description="Portfolio item image URL")
    client: Optional[str] = Field(None, max_length=255, description="Client name")
    location: Optional[str] = Field(None, max_length=255, description="Project location")
    category: Optional[str] = Field(None, max_length=100, description="Project category")


class PortfolioResponse(BaseModel):
    """Schema for portfolio response data."""
    id: str = Field(..., description="Portfolio item ID")
    title: str = Field(..., description="Portfolio item title")
    description: Optional[str] = Field(None, description="Portfolio item description")
    image: Optional[str] = Field(None, description="Portfolio item image URL")
    client: Optional[str] = Field(None, description="Client name")
    location: Optional[str] = Field(None, description="Project location")
    category: Optional[str] = Field(None, description="Project category")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    class Config:
        from_attributes = True
