"""
Portfolio model for managing project portfolio items.
"""
from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.mysql import CHAR
from database import Base
import uuid


class Portfolio(Base):
    """Portfolio table for showcasing completed projects."""
    
    __tablename__ = "portfolio"
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    client = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Portfolio(id='{self.id}', title='{self.title}', client='{self.client}')>"
