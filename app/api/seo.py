"""
SEO API routes.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from database import get_db
from services.seo_service import SeoService
from schemas.seo import SeoSettingsCreate, SeoSettingsUpdate, SeoSettingsResponse
from middleware.auth import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["SEO"])


@router.get("/seo/{page}", response_model=SeoSettingsResponse)
async def get_seo_settings(
    page: str,
    db: Session = Depends(get_db)
):
    """
    Get SEO settings for a specific page (Public).
    
    Args:
        page: Page identifier
        db: Database session
        
    Returns:
        SEO settings data
        
    Raises:
        HTTPException: If SEO settings not found
    """
    try:
        seo_service = SeoService(db)
        seo_settings = seo_service.get_seo_settings_by_page(page)
        
        if not seo_settings:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SEO settings not found"
            )
        
        return seo_settings
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting SEO settings for page {page}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving SEO settings"
        )


@router.get("/admin/seo", response_model=List[SeoSettingsResponse])
async def get_all_seo_settings(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get all SEO settings (Admin only).
    
    Args:
        db: Database session
        current_admin: Current admin user
        
    Returns:
        List of all SEO settings
    """
    try:
        seo_service = SeoService(db)
        seo_settings = seo_service.get_all_seo_settings()
        
        return seo_settings
        
    except Exception as e:
        logger.error(f"Error getting all SEO settings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving SEO settings"
        )


@router.get("/admin/seo/{page}", response_model=SeoSettingsResponse)
async def get_admin_seo_settings(
    page: str,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get SEO settings for a specific page (Admin only).
    
    Args:
        page: Page identifier
        db: Database session
        current_admin: Current admin user
        
    Returns:
        SEO settings data or default empty settings if not found
    """
    try:
        seo_service = SeoService(db)
        seo_settings = seo_service.get_seo_settings_by_page(page)
        
        if not seo_settings:
            # Return default empty settings for admin
            return SeoSettingsResponse(
                id="",
                page=page,
                title="",
                description="",
                og_title="",
                og_description="",
                keywords=[],
                updated_at=None
            )
        
        return seo_settings
        
    except Exception as e:
        logger.error(f"Error getting SEO settings for page {page}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving SEO settings"
        )


@router.post("/admin/seo", response_model=SeoSettingsResponse)
async def create_seo_settings(
    seo_data: SeoSettingsCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Create new SEO settings (Admin only).
    
    Args:
        seo_data: SEO settings creation data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Created SEO settings data
    """
    try:
        seo_service = SeoService(db)
        seo_settings = seo_service.create_seo_settings(seo_data)
        
        logger.info(f"SEO settings created by admin {current_admin.username} for page: {seo_settings.page}")
        return seo_settings
        
    except Exception as e:
        logger.error(f"Error creating SEO settings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating SEO settings"
        )


@router.put("/admin/seo/{page}", response_model=SeoSettingsResponse)
async def update_seo_settings(
    page: str,
    seo_data: SeoSettingsUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Update existing SEO settings (Admin only).
    
    Args:
        page: Page identifier
        seo_data: SEO settings update data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Updated SEO settings data
        
    Raises:
        HTTPException: If SEO settings not found
    """
    try:
        seo_service = SeoService(db)
        seo_settings = seo_service.update_seo_settings(page, seo_data)
        
        if not seo_settings:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SEO settings not found"
            )
        
        logger.info(f"SEO settings updated by admin {current_admin.username} for page: {page}")
        return seo_settings
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating SEO settings for page {page}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating SEO settings"
        )


@router.post("/admin/seo/upsert", response_model=SeoSettingsResponse)
async def create_or_update_seo_settings(
    seo_data: SeoSettingsCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Create or update SEO settings (Admin only).
    
    Args:
        seo_data: SEO settings data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Created or updated SEO settings data
    """
    try:
        seo_service = SeoService(db)
        seo_settings = seo_service.create_or_update_seo_settings(seo_data)
        
        logger.info(f"SEO settings upserted by admin {current_admin.username} for page: {seo_settings.page}")
        return seo_settings
        
    except Exception as e:
        logger.error(f"Error creating or updating SEO settings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating or updating SEO settings"
        )


@router.delete("/admin/seo/{page}")
async def delete_seo_settings(
    page: str,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Delete SEO settings for a page (Admin only).
    
    Args:
        page: Page identifier
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If SEO settings not found
    """
    try:
        seo_service = SeoService(db)
        success = seo_service.delete_seo_settings(page)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SEO settings not found"
            )
        
        logger.info(f"SEO settings deleted by admin {current_admin.username} for page: {page}")
        return {"message": "SEO settings deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting SEO settings for page {page}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting SEO settings"
        )


@router.get("/admin/seo/pages")
async def get_seo_pages(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get all pages that have SEO settings (Admin only).
    
    Args:
        db: Database session
        current_admin: Current admin user
        
    Returns:
        List of page identifiers
    """
    try:
        seo_service = SeoService(db)
        pages = seo_service.get_seo_pages()
        
        return {"pages": pages}
        
    except Exception as e:
        logger.error(f"Error getting SEO pages: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving SEO pages"
        )
