"""
Brochure model for managing downloadable brochures and PDFs.
"""
from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.mysql import CHAR
from database import Base
import uuid


class Brochure(Base):
    """Brochures table for managing downloadable PDF brochures."""
    
    __tablename__ = "brochures"
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    pdf_path = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Brochure(id='{self.id}', title='{self.title}', pdf_path='{self.pdf_path}')>"
