"""
Brochure service for managing downloadable brochures and PDFs.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException, status
import logging

from models.brochure import Brochure
from schemas.brochure import BrochureCreate, BrochureUpdate

logger = logging.getLogger(__name__)


class BrochureService:
    """Service class for brochure operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all_brochures(self) -> List[Brochure]:
        """
        Get all brochures ordered by creation date.
        
        Returns:
            List of brochure objects
        """
        try:
            return self.db.query(Brochure).order_by(desc(Brochure.created_at)).all()
        except Exception as e:
            logger.error(f"Error getting all brochures: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_brochure_by_id(self, brochure_id: str) -> Optional[Brochure]:
        """
        Get brochure by ID.
        
        Args:
            brochure_id: Brochure ID
            
        Returns:
            Brochure object or None
        """
        try:
            return self.db.query(Brochure).filter(Brochure.id == brochure_id).first()
        except Exception as e:
            logger.error(f"Error getting brochure by ID {brochure_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def create_brochure(self, brochure_data: BrochureCreate) -> Brochure:
        """
        Create a new brochure.
        
        Args:
            brochure_data: Brochure creation data
            
        Returns:
            Created brochure object
        """
        try:
            brochure = Brochure(
                title=brochure_data.title,
                description=brochure_data.description,
                pdf_path=brochure_data.pdf_path
            )
            
            self.db.add(brochure)
            self.db.commit()
            self.db.refresh(brochure)
            
            logger.info(f"Brochure created successfully: {brochure.title}")
            return brochure
            
        except Exception as e:
            logger.error(f"Error creating brochure: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating brochure"
            )
    
    def update_brochure(self, brochure_id: str, brochure_data: BrochureUpdate) -> Optional[Brochure]:
        """
        Update an existing brochure.
        
        Args:
            brochure_id: Brochure ID
            brochure_data: Brochure update data
            
        Returns:
            Updated brochure object or None if not found
        """
        try:
            brochure = self.get_brochure_by_id(brochure_id)
            if not brochure:
                return None
            
            # Update fields if provided
            update_data = brochure_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(brochure, field, value)
            
            self.db.commit()
            self.db.refresh(brochure)
            
            logger.info(f"Brochure updated successfully: {brochure.title}")
            return brochure
            
        except Exception as e:
            logger.error(f"Error updating brochure: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error updating brochure"
            )
    
    def delete_brochure(self, brochure_id: str) -> bool:
        """
        Delete a brochure.
        
        Args:
            brochure_id: Brochure ID
            
        Returns:
            True if successful, False if brochure not found
        """
        try:
            brochure = self.get_brochure_by_id(brochure_id)
            if not brochure:
                return False
            
            self.db.delete(brochure)
            self.db.commit()
            
            logger.info(f"Brochure deleted successfully: {brochure.title}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting brochure: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error deleting brochure"
            )
    
    def search_brochures(self, query: str) -> List[Brochure]:
        """
        Search brochures by title or description.
        
        Args:
            query: Search query
            
        Returns:
            List of matching brochure objects
        """
        try:
            search_term = f"%{query}%"
            return self.db.query(Brochure).filter(
                (Brochure.title.ilike(search_term)) |
                (Brochure.description.ilike(search_term))
            ).order_by(desc(Brochure.created_at)).all()
        except Exception as e:
            logger.error(f"Error searching brochures: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_brochure_by_title(self, title: str) -> Optional[Brochure]:
        """
        Get brochure by title.
        
        Args:
            title: Brochure title
            
        Returns:
            Brochure object or None
        """
        try:
            return self.db.query(Brochure).filter(Brochure.title == title).first()
        except Exception as e:
            logger.error(f"Error getting brochure by title {title}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_brochures_count(self) -> int:
        """
        Get total number of brochures.
        
        Returns:
            Total brochures count
        """
        try:
            return self.db.query(Brochure).count()
        except Exception as e:
            logger.error(f"Error getting brochures count: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
