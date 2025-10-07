"""
Analytics model for tracking page views and user behavior.
"""
from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.mysql import CHAR
from database import Base
import uuid


class PageView(Base):
    """Page Views table for analytics and tracking user behavior."""
    
    __tablename__ = "page_views"
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    page = Column(String(255), nullable=False, index=True)
    user_agent = Column(Text, nullable=True)
    referrer = Column(String(500), nullable=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    
    def __repr__(self):
        return f"<PageView(id='{self.id}', page='{self.page}', timestamp='{self.timestamp}')>"
