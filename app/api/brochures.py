"""
Brochures API routes.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging

from database import get_db
from services.brochure_service import BrochureService
from schemas.brochure import BrochureCreate, BrochureUpdate, BrochureResponse
from middleware.auth import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Brochures"])


@router.get("/brochures", response_model=List[BrochureResponse])
async def get_brochures(
    db: Session = Depends(get_db)
):
    """
    Get all brochures (Public).
    
    Args:
        db: Database session
        
    Returns:
        List of brochures
    """
    try:
        brochure_service = BrochureService(db)
        brochures = brochure_service.get_all_brochures()
        
        return brochures
        
    except Exception as e:
        logger.error(f"Error getting brochures: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving brochures"
        )


@router.get("/brochures/{brochure_id}", response_model=BrochureResponse)
async def get_brochure(
    brochure_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific brochure by ID (Public).
    
    Args:
        brochure_id: Brochure ID
        db: Database session
        
    Returns:
        Brochure data
        
    Raises:
        HTTPException: If brochure not found
    """
    try:
        brochure_service = BrochureService(db)
        brochure = brochure_service.get_brochure_by_id(brochure_id)
        
        if not brochure:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Brochure not found"
            )
        
        return brochure
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting brochure {brochure_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving brochure"
        )


@router.get("/admin/brochures", response_model=List[BrochureResponse])
async def get_admin_brochures(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get all brochures (Admin only).
    
    Args:
        db: Database session
        current_admin: Current admin user
        
    Returns:
        List of brochures
    """
    try:
        brochure_service = BrochureService(db)
        brochures = brochure_service.get_all_brochures()
        return brochures
        
    except Exception as e:
        logger.error(f"Error getting admin brochures: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving brochures"
        )


@router.post("/admin/brochures", response_model=BrochureResponse)
async def create_brochure(
    brochure_data: BrochureCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Create a new brochure (Admin only).
    
    Args:
        brochure_data: Brochure creation data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Created brochure data
    """
    try:
        brochure_service = BrochureService(db)
        brochure = brochure_service.create_brochure(brochure_data)
        
        logger.info(f"Brochure created by admin {current_admin.username}: {brochure.title}")
        return brochure
        
    except Exception as e:
        logger.error(f"Error creating brochure: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating brochure"
        )


@router.put("/admin/brochures/{brochure_id}", response_model=BrochureResponse)
async def update_brochure(
    brochure_id: str,
    brochure_data: BrochureUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Update an existing brochure (Admin only).
    
    Args:
        brochure_id: Brochure ID
        brochure_data: Brochure update data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Updated brochure data
        
    Raises:
        HTTPException: If brochure not found
    """
    try:
        brochure_service = BrochureService(db)
        brochure = brochure_service.update_brochure(brochure_id, brochure_data)
        
        if not brochure:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Brochure not found"
            )
        
        logger.info(f"Brochure updated by admin {current_admin.username}: {brochure.title}")
        return brochure
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating brochure {brochure_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating brochure"
        )


@router.delete("/admin/brochures/{brochure_id}")
async def delete_brochure(
    brochure_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Delete a brochure (Admin only).
    
    Args:
        brochure_id: Brochure ID
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If brochure not found
    """
    try:
        brochure_service = BrochureService(db)
        success = brochure_service.delete_brochure(brochure_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Brochure not found"
            )
        
        logger.info(f"Brochure deleted by admin {current_admin.username}: {brochure_id}")
        return {"message": "Brochure deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting brochure {brochure_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting brochure"
        )


@router.get("/brochures/search")
async def search_brochures(
    q: str = Query(..., description="Search query"),
    db: Session = Depends(get_db)
):
    """
    Search brochures by title or description (Public).
    
    Args:
        q: Search query
        db: Database session
        
    Returns:
        List of matching brochures
    """
    try:
        brochure_service = BrochureService(db)
        brochures = brochure_service.search_brochures(q)
        
        return brochures
        
    except Exception as e:
        logger.error(f"Error searching brochures: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error searching brochures"
        )


@router.get("/admin/brochures/stats")
async def get_brochures_stats(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get brochures statistics (Admin only).
    
    Args:
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Brochures statistics
    """
    try:
        brochure_service = BrochureService(db)
        count = brochure_service.get_brochures_count()
        
        return {"total_brochures": count}
        
    except Exception as e:
        logger.error(f"Error getting brochures stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving brochures statistics"
        )
