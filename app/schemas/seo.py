"""
Pydantic schemas for SEO Settings model validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class SeoSettingsCreate(BaseModel):
    """Schema for creating new SEO settings."""
    page: str = Field(..., min_length=1, max_length=50, description="Page identifier")
    title: str = Field(..., min_length=1, max_length=255, description="Page title")
    description: str = Field(..., min_length=1, description="Page description")
    og_title: Optional[str] = Field(None, max_length=255, description="Open Graph title")
    og_description: Optional[str] = Field(None, description="Open Graph description")
    keywords: Optional[List[str]] = Field(default=[], description="SEO keywords list")


class SeoSettingsUpdate(BaseModel):
    """Schema for updating existing SEO settings."""
    page: Optional[str] = Field(None, min_length=1, max_length=50, description="Page identifier")
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Page title")
    description: Optional[str] = Field(None, min_length=1, description="Page description")
    og_title: Optional[str] = Field(None, max_length=255, description="Open Graph title")
    og_description: Optional[str] = Field(None, description="Open Graph description")
    keywords: Optional[List[str]] = Field(None, description="SEO keywords list")


class SeoSettingsResponse(BaseModel):
    """Schema for SEO settings response data."""
    id: str = Field(..., description="SEO settings ID")
    page: str = Field(..., description="Page identifier")
    title: str = Field(..., description="Page title")
    description: str = Field(..., description="Page description")
    og_title: Optional[str] = Field(None, description="Open Graph title")
    og_description: Optional[str] = Field(None, description="Open Graph description")
    keywords: Optional[List[str]] = Field(None, description="SEO keywords list")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    class Config:
        from_attributes = True
