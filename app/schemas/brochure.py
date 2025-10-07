"""
Pydantic schemas for Brochure model validation.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BrochureCreate(BaseModel):
    """Schema for creating a new brochure."""
    title: str = Field(..., min_length=1, max_length=255, description="Brochure title")
    description: str = Field(..., min_length=1, description="Brochure description")
    pdf_path: str = Field(..., min_length=1, max_length=500, description="PDF file path")


class BrochureUpdate(BaseModel):
    """Schema for updating an existing brochure."""
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="Brochure title")
    description: Optional[str] = Field(None, min_length=1, description="Brochure description")
    pdf_path: Optional[str] = Field(None, min_length=1, max_length=500, description="PDF file path")


class BrochureResponse(BaseModel):
    """Schema for brochure response data."""
    id: str = Field(..., description="Brochure ID")
    title: str = Field(..., description="Brochure title")
    description: str = Field(..., description="Brochure description")
    pdf_path: str = Field(..., description="PDF file path")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    class Config:
        from_attributes = True
