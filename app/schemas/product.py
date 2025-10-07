"""
Pydantic schemas for Product model validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


class ProductCreate(BaseModel):
    """Schema for creating a new product."""
    category: str = Field(..., description="Product category (blinds, curtains, commercial)")
    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    description: str = Field(..., min_length=1, description="Product description")
    image: Optional[str] = Field(None, max_length=500, description="Product image URL")
    features: Optional[List[str]] = Field(default=[], description="Product features list")


class ProductUpdate(BaseModel):
    """Schema for updating an existing product."""
    category: Optional[str] = Field(None, description="Product category")
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Product name")
    description: Optional[str] = Field(None, min_length=1, description="Product description")
    image: Optional[str] = Field(None, max_length=500, description="Product image URL")
    features: Optional[List[str]] = Field(None, description="Product features list")


class ProductResponse(BaseModel):
    """Schema for product response data."""
    id: str = Field(..., description="Product ID")
    category: str = Field(..., description="Product category")
    name: str = Field(..., description="Product name")
    description: str = Field(..., description="Product description")
    image: Optional[str] = Field(None, description="Product image URL")
    features: Optional[List[str]] = Field(None, description="Product features list")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    class Config:
        from_attributes = True
