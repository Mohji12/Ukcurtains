"""
Product model for managing interior design products.
"""
from sqlalchemy import Column, String, Text, DateTime, func, JSON
from sqlalchemy.dialects.mysql import CHAR
from database import Base
import uuid


class Product(Base):
    """Products table for blinds, curtains, and commercial products."""
    
    __tablename__ = "products"
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    category = Column(String(50), nullable=False, index=True)  # 'blinds', 'curtains', 'commercial'
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    image = Column(String(500), nullable=True)
    features = Column(JSON, nullable=True)  # Store features as JSON array
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Product(id='{self.id}', name='{self.name}', category='{self.category}')>"
