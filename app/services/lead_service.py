"""
Lead service for managing customer inquiries and leads.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException, status
import logging

from models.lead import Lead
from schemas.lead import LeadCreate, LeadUpdate, LeadStatusUpdate

logger = logging.getLogger(__name__)


class LeadService:
    """Service class for lead operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all_leads(self) -> List[Lead]:
        """
        Get all leads ordered by creation date.
        
        Returns:
            List of lead objects
        """
        try:
            return self.db.query(Lead).order_by(desc(Lead.created_at)).all()
        except Exception as e:
            logger.error(f"Error getting all leads: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_leads_by_status(self, status: str) -> List[Lead]:
        """
        Get leads by status.
        
        Args:
            status: Lead status
            
        Returns:
            List of lead objects
        """
        try:
            return self.db.query(Lead).filter(
                Lead.status == status
            ).order_by(desc(Lead.created_at)).all()
        except Exception as e:
            logger.error(f"Error getting leads by status {status}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_lead_by_id(self, lead_id: str) -> Optional[Lead]:
        """
        Get lead by ID.
        
        Args:
            lead_id: Lead ID
            
        Returns:
            Lead object or None
        """
        try:
            return self.db.query(Lead).filter(Lead.id == lead_id).first()
        except Exception as e:
            logger.error(f"Error getting lead by ID {lead_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def create_lead(self, lead_data: LeadCreate) -> Lead:
        """
        Create a new lead.
        
        Args:
            lead_data: Lead creation data
            
        Returns:
            Created lead object
        """
        try:
            lead = Lead(
                name=lead_data.name,
                email=lead_data.email,
                phone=lead_data.phone,
                project_details=lead_data.project_details,
                status="new"  # Default status
            )
            
            self.db.add(lead)
            self.db.commit()
            self.db.refresh(lead)
            
            logger.info(f"Lead created successfully: {lead.name} ({lead.email})")
            return lead
            
        except Exception as e:
            logger.error(f"Error creating lead: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating lead"
            )
    
    def update_lead(self, lead_id: str, lead_data: LeadUpdate) -> Optional[Lead]:
        """
        Update an existing lead.
        
        Args:
            lead_id: Lead ID
            lead_data: Lead update data
            
        Returns:
            Updated lead object or None if not found
        """
        try:
            lead = self.get_lead_by_id(lead_id)
            if not lead:
                return None
            
            # Update fields if provided
            update_data = lead_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(lead, field, value)
            
            self.db.commit()
            self.db.refresh(lead)
            
            logger.info(f"Lead updated successfully: {lead.name}")
            return lead
            
        except Exception as e:
            logger.error(f"Error updating lead: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error updating lead"
            )
    
    def update_lead_status(self, lead_id: str, status_data: LeadStatusUpdate) -> Optional[Lead]:
        """
        Update lead status.
        
        Args:
            lead_id: Lead ID
            status_data: Status update data
            
        Returns:
            Updated lead object or None if not found
        """
        try:
            # Validate status
            valid_statuses = ["new", "contacted", "converted", "archived"]
            if status_data.status not in valid_statuses:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
                )
            
            lead = self.get_lead_by_id(lead_id)
            if not lead:
                return None
            
            lead.status = status_data.status
            self.db.commit()
            self.db.refresh(lead)
            
            logger.info(f"Lead status updated successfully: {lead.name} -> {lead.status}")
            return lead
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating lead status: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error updating lead status"
            )
    
    def delete_lead(self, lead_id: str) -> bool:
        """
        Delete a lead.
        
        Args:
            lead_id: Lead ID
            
        Returns:
            True if successful, False if lead not found
        """
        try:
            lead = self.get_lead_by_id(lead_id)
            if not lead:
                return False
            
            self.db.delete(lead)
            self.db.commit()
            
            logger.info(f"Lead deleted successfully: {lead.name}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting lead: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error deleting lead"
            )
    
    def get_lead_stats(self) -> dict:
        """
        Get lead statistics.
        
        Returns:
            Dictionary with lead statistics
        """
        try:
            total_leads = self.db.query(Lead).count()
            new_leads = self.db.query(Lead).filter(Lead.status == "new").count()
            contacted_leads = self.db.query(Lead).filter(Lead.status == "contacted").count()
            converted_leads = self.db.query(Lead).filter(Lead.status == "converted").count()
            archived_leads = self.db.query(Lead).filter(Lead.status == "archived").count()
            
            return {
                "total": total_leads,
                "new": new_leads,
                "contacted": contacted_leads,
                "converted": converted_leads,
                "archived": archived_leads
            }
        except Exception as e:
            logger.error(f"Error getting lead stats: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def search_leads(self, query: str) -> List[Lead]:
        """
        Search leads by name, email, or project details.
        
        Args:
            query: Search query
            
        Returns:
            List of matching lead objects
        """
        try:
            search_term = f"%{query}%"
            return self.db.query(Lead).filter(
                (Lead.name.ilike(search_term)) |
                (Lead.email.ilike(search_term)) |
                (Lead.project_details.ilike(search_term))
            ).order_by(desc(Lead.created_at)).all()
        except Exception as e:
            logger.error(f"Error searching leads: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
