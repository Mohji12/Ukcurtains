"""
Admin model for authentication and user management.
"""
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.mysql import CHAR
from database import Base
import uuid


class Admin(Base):
    """Admin users table for authentication."""
    
    __tablename__ = "admins"
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Admin(id='{self.id}', username='{self.username}')>"
