"""
SEO service for managing page metadata and SEO configurations.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from models.seo import SeoSettings
from schemas.seo import SeoSettingsCreate, SeoSettingsUpdate

logger = logging.getLogger(__name__)


class SeoService:
    """Service class for SEO operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all_seo_settings(self) -> List[SeoSettings]:
        """
        Get all SEO settings.
        
        Returns:
            List of SEO settings objects
        """
        try:
            return self.db.query(SeoSettings).all()
        except Exception as e:
            logger.error(f"Error getting all SEO settings: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_seo_settings_by_page(self, page: str) -> Optional[SeoSettings]:
        """
        Get SEO settings by page.
        
        Args:
            page: Page identifier
            
        Returns:
            SEO settings object or None
        """
        try:
            return self.db.query(SeoSettings).filter(SeoSettings.page == page).first()
        except Exception as e:
            logger.error(f"Error getting SEO settings for page {page}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def create_seo_settings(self, seo_data: SeoSettingsCreate) -> SeoSettings:
        """
        Create new SEO settings.
        
        Args:
            seo_data: SEO settings creation data
            
        Returns:
            Created SEO settings object
        """
        try:
            # Check if settings already exist for this page
            existing = self.get_seo_settings_by_page(seo_data.page)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"SEO settings already exist for page: {seo_data.page}"
                )
            
            # Ensure keywords is a list
            keywords = seo_data.keywords or []
            
            seo_settings = SeoSettings(
                page=seo_data.page,
                title=seo_data.title,
                description=seo_data.description,
                og_title=seo_data.og_title,
                og_description=seo_data.og_description,
                keywords=keywords
            )
            
            self.db.add(seo_settings)
            self.db.commit()
            self.db.refresh(seo_settings)
            
            logger.info(f"SEO settings created successfully for page: {seo_settings.page}")
            return seo_settings
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating SEO settings: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating SEO settings"
            )
    
    def update_seo_settings(self, page: str, seo_data: SeoSettingsUpdate) -> Optional[SeoSettings]:
        """
        Update existing SEO settings.
        
        Args:
            page: Page identifier
            seo_data: SEO settings update data
            
        Returns:
            Updated SEO settings object or None if not found
        """
        try:
            seo_settings = self.get_seo_settings_by_page(page)
            if not seo_settings:
                return None
            
            # Update fields if provided
            update_data = seo_data.dict(exclude_unset=True)
            
            # Handle keywords field
            if "keywords" in update_data and update_data["keywords"] is not None:
                update_data["keywords"] = update_data["keywords"]
            
            for field, value in update_data.items():
                setattr(seo_settings, field, value)
            
            self.db.commit()
            self.db.refresh(seo_settings)
            
            logger.info(f"SEO settings updated successfully for page: {seo_settings.page}")
            return seo_settings
            
        except Exception as e:
            logger.error(f"Error updating SEO settings: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error updating SEO settings"
            )
    
    def create_or_update_seo_settings(self, seo_data: SeoSettingsCreate) -> SeoSettings:
        """
        Create or update SEO settings for a page.
        
        Args:
            seo_data: SEO settings data
            
        Returns:
            Created or updated SEO settings object
        """
        try:
            existing = self.get_seo_settings_by_page(seo_data.page)
            
            if existing:
                # Update existing settings
                update_data = SeoSettingsUpdate(
                    title=seo_data.title,
                    description=seo_data.description,
                    og_title=seo_data.og_title,
                    og_description=seo_data.og_description,
                    keywords=seo_data.keywords
                )
                return self.update_seo_settings(seo_data.page, update_data)
            else:
                # Create new settings
                return self.create_seo_settings(seo_data)
                
        except Exception as e:
            logger.error(f"Error creating or updating SEO settings: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating or updating SEO settings"
            )
    
    def delete_seo_settings(self, page: str) -> bool:
        """
        Delete SEO settings for a page.
        
        Args:
            page: Page identifier
            
        Returns:
            True if successful, False if settings not found
        """
        try:
            seo_settings = self.get_seo_settings_by_page(page)
            if not seo_settings:
                return False
            
            self.db.delete(seo_settings)
            self.db.commit()
            
            logger.info(f"SEO settings deleted successfully for page: {page}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting SEO settings: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error deleting SEO settings"
            )
    
    def get_seo_pages(self) -> List[str]:
        """
        Get all pages that have SEO settings.
        
        Returns:
            List of page identifiers
        """
        try:
            pages = self.db.query(SeoSettings.page).all()
            return [page[0] for page in pages]
        except Exception as e:
            logger.error(f"Error getting SEO pages: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
