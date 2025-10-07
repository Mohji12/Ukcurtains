"""
Leads API routes.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging

from database import get_db
from services.lead_service import LeadService
from schemas.lead import LeadCreate, LeadUpdate, LeadResponse, LeadStatusUpdate
from middleware.auth import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Leads"])


@router.post("/leads", response_model=LeadResponse)
async def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new lead from contact form (Public).
    
    Args:
        lead_data: Lead creation data
        db: Database session
        
    Returns:
        Created lead data
    """
    try:
        lead_service = LeadService(db)
        lead = lead_service.create_lead(lead_data)
        
        logger.info(f"New lead created: {lead.name} ({lead.email})")
        return lead
        
    except Exception as e:
        logger.error(f"Error creating lead: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating lead"
        )


@router.get("/admin/leads", response_model=List[LeadResponse])
async def get_leads(
    status: Optional[str] = Query(None, description="Filter by lead status"),
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get all leads or filter by status (Admin only).
    
    Args:
        status: Optional status filter
        db: Database session
        current_admin: Current admin user
        
    Returns:
        List of leads
    """
    try:
        lead_service = LeadService(db)
        
        if status:
            leads = lead_service.get_leads_by_status(status)
        else:
            leads = lead_service.get_all_leads()
        
        return leads
        
    except Exception as e:
        logger.error(f"Error getting leads: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving leads"
        )


@router.get("/admin/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get a specific lead by ID (Admin only).
    
    Args:
        lead_id: Lead ID
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Lead data
        
    Raises:
        HTTPException: If lead not found
    """
    try:
        lead_service = LeadService(db)
        lead = lead_service.get_lead_by_id(lead_id)
        
        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )
        
        return lead
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting lead {lead_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving lead"
        )


@router.put("/admin/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: str,
    lead_data: LeadUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Update an existing lead (Admin only).
    
    Args:
        lead_id: Lead ID
        lead_data: Lead update data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Updated lead data
        
    Raises:
        HTTPException: If lead not found
    """
    try:
        lead_service = LeadService(db)
        lead = lead_service.update_lead(lead_id, lead_data)
        
        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )
        
        logger.info(f"Lead updated by admin {current_admin.username}: {lead.name}")
        return lead
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating lead {lead_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating lead"
        )


@router.put("/admin/leads/{lead_id}/status", response_model=LeadResponse)
async def update_lead_status(
    lead_id: str,
    status_data: LeadStatusUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Update lead status (Admin only).
    
    Args:
        lead_id: Lead ID
        status_data: Status update data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Updated lead data
        
    Raises:
        HTTPException: If lead not found or invalid status
    """
    try:
        lead_service = LeadService(db)
        lead = lead_service.update_lead_status(lead_id, status_data)
        
        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )
        
        logger.info(f"Lead status updated by admin {current_admin.username}: {lead.name} -> {lead.status}")
        return lead
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating lead status {lead_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating lead status"
        )


@router.delete("/admin/leads/{lead_id}")
async def delete_lead(
    lead_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Delete a lead (Admin only).
    
    Args:
        lead_id: Lead ID
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If lead not found
    """
    try:
        lead_service = LeadService(db)
        success = lead_service.delete_lead(lead_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lead not found"
            )
        
        logger.info(f"Lead deleted by admin {current_admin.username}: {lead_id}")
        return {"message": "Lead deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting lead {lead_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting lead"
        )


@router.get("/admin/leads/stats")
async def get_lead_stats(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get lead statistics (Admin only).
    
    Args:
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Lead statistics
    """
    try:
        lead_service = LeadService(db)
        stats = lead_service.get_lead_stats()
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting lead stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving lead statistics"
        )


@router.get("/admin/leads/search")
async def search_leads(
    q: str = Query(..., description="Search query"),
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Search leads by name, email, or project details (Admin only).
    
    Args:
        q: Search query
        db: Database session
        current_admin: Current admin user
        
    Returns:
        List of matching leads
    """
    try:
        lead_service = LeadService(db)
        leads = lead_service.search_leads(q)
        
        return leads
        
    except Exception as e:
        logger.error(f"Error searching leads: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error searching leads"
        )
