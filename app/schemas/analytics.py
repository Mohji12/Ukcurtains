"""
Pydantic schemas for Analytics model validation.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PageViewCreate(BaseModel):
    """Schema for creating a new page view record."""
    page: str = Field(..., min_length=1, max_length=255, description="Page URL or identifier")
    user_agent: Optional[str] = Field(None, description="User agent string")
    referrer: Optional[str] = Field(None, max_length=500, description="Referrer URL")


class PageViewResponse(BaseModel):
    """Schema for page view response data."""
    id: str = Field(..., description="Page view ID")
    page: str = Field(..., description="Page URL or identifier")
    user_agent: Optional[str] = Field(None, description="User agent string")
    referrer: Optional[str] = Field(None, description="Referrer URL")
    timestamp: datetime = Field(..., description="View timestamp")
    
    class Config:
        from_attributes = True


class AnalyticsStats(BaseModel):
    """Schema for analytics statistics response."""
    total_products: int = Field(..., description="Total number of products")
    total_portfolio: int = Field(..., description="Total number of portfolio items")
    new_leads: int = Field(..., description="Number of new leads")
    page_views_30_days: int = Field(..., description="Page views in last 30 days")
    unique_visitors: int = Field(..., description="Unique visitors in last 30 days")


class TopPagesResponse(BaseModel):
    """Schema for top pages analytics response."""
    page: str = Field(..., description="Page URL or identifier")
    count: int = Field(..., description="Number of views")


class AnalyticsOverview(BaseModel):
    """Schema for analytics overview response."""
    total_views: int = Field(..., description="Total page views")
    top_pages: list[TopPagesResponse] = Field(..., description="Top pages by views")
    total_leads: int = Field(..., description="Total number of leads")
