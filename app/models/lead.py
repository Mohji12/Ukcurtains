"""
Lead model for managing customer inquiries and leads.
"""
from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.mysql import CHAR
from database import Base
import uuid


class Lead(Base):
    """Leads table for customer inquiries and project details."""
    
    __tablename__ = "leads"
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    project_details = Column(Text, nullable=True)
    status = Column(String(20), default="new", nullable=False, index=True)  # 'new', 'contacted', 'converted', 'archived'
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Lead(id='{self.id}', name='{self.name}', email='{self.email}', status='{self.status}')>"
