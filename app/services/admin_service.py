"""
Admin service for user authentication and management.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
import logging

from models.admin import Admin
from schemas.admin import AdminCreate, AdminResponse
from utils.auth import hash_password, verify_password
from config import settings

logger = logging.getLogger(__name__)


class AdminService:
    """Service class for admin operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_admin_by_id(self, admin_id: str) -> Optional[Admin]:
        """
        Get admin by ID.
        
        Args:
            admin_id: Admin ID
            
        Returns:
            Admin object or None
        """
        try:
            return self.db.query(Admin).filter(Admin.id == admin_id).first()
        except Exception as e:
            logger.error(f"Error getting admin by ID {admin_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_admin_by_username(self, username: str) -> Optional[Admin]:
        """
        Get admin by username.
        
        Args:
            username: Admin username
            
        Returns:
            Admin object or None
        """
        try:
            return self.db.query(Admin).filter(Admin.username == username).first()
        except Exception as e:
            logger.error(f"Error getting admin by username {username}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def create_admin(self, admin_data: AdminCreate) -> Admin:
        """
        Create a new admin user.
        
        Args:
            admin_data: Admin creation data
            
        Returns:
            Created admin object
            
        Raises:
            HTTPException: If username already exists
        """
        try:
            # Check if username already exists
            existing_admin = self.get_admin_by_username(admin_data.username)
            if existing_admin:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already exists"
                )
            
            # Hash password
            hashed_password = hash_password(admin_data.password)
            
            # Create admin
            admin = Admin(
                username=admin_data.username,
                password=hashed_password
            )
            
            self.db.add(admin)
            self.db.commit()
            self.db.refresh(admin)
            
            logger.info(f"Admin created successfully: {admin.username}")
            return admin
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating admin: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating admin"
            )
    
    def authenticate_admin(self, username: str, password: str) -> Optional[Admin]:
        """
        Authenticate admin user.
        
        Args:
            username: Admin username
            password: Admin password
            
        Returns:
            Admin object if authentication successful, None otherwise
        """
        try:
            admin = self.get_admin_by_username(username)
            if not admin:
                return None
            
            if verify_password(password, admin.password):
                return admin
            
            return None
            
        except Exception as e:
            logger.error(f"Error authenticating admin {username}: {e}")
            return None
    
    def update_admin_password(self, admin_id: str, new_password: str) -> bool:
        """
        Update admin password.
        
        Args:
            admin_id: Admin ID
            new_password: New password
            
        Returns:
            True if successful, False otherwise
        """
        try:
            admin = self.get_admin_by_id(admin_id)
            if not admin:
                return False
            
            hashed_password = hash_password(new_password)
            admin.password = hashed_password
            
            self.db.commit()
            logger.info(f"Password updated for admin: {admin.username}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating admin password: {e}")
            self.db.rollback()
            return False
    
    def delete_admin(self, admin_id: str) -> bool:
        """
        Delete admin user.
        
        Args:
            admin_id: Admin ID
            
        Returns:
            True if successful, False otherwise
        """
        try:
            admin = self.get_admin_by_id(admin_id)
            if not admin:
                return False
            
            self.db.delete(admin)
            self.db.commit()
            logger.info(f"Admin deleted: {admin.username}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting admin: {e}")
            self.db.rollback()
            return False
    
    def get_all_admins(self) -> List[Admin]:
        """
        Get all admin users.
        
        Returns:
            List of admin objects
        """
        try:
            return self.db.query(Admin).all()
        except Exception as e:
            logger.error(f"Error getting all admins: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def create_default_admin(self) -> Optional[Admin]:
        """
        Create default admin user if no admins exist.
        
        Returns:
            Created admin object or None
        """
        try:
            # Check if any admins exist
            existing_admins = self.get_all_admins()
            if existing_admins:
                logger.info("Default admin already exists")
                return None
            
            # Create default admin
            admin_data = AdminCreate(
                username=settings.default_admin_username,
                password=settings.default_admin_password
            )
            
            admin = self.create_admin(admin_data)
            logger.info(f"Default admin created: {admin.username}")
            return admin
            
        except Exception as e:
            logger.error(f"Error creating default admin: {e}")
            return None
