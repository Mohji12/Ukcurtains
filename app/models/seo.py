"""
SEO Settings model for managing page metadata and SEO configurations.
"""
from sqlalchemy import Column, String, Text, DateTime, func, JSON
from sqlalchemy.dialects.mysql import CHAR
from database import Base
import uuid


class SeoSettings(Base):
    """SEO Settings table for page metadata and search engine optimization."""
    
    __tablename__ = "seo_settings"
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    page = Column(String(50), unique=True, nullable=False, index=True)  # 'home', 'about', 'products', 'portfolio', 'contact'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    og_title = Column(String(255), nullable=True)
    og_description = Column(Text, nullable=True)
    keywords = Column(JSON, nullable=True)  # Store keywords as JSON array
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<SeoSettings(id='{self.id}', page='{self.page}', title='{self.title}')>"
