"""
Authentication middleware for FastAPI.
"""
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import logging

from database import get_db
from services.admin_service import AdminService
from utils.auth import verify_token
from utils.session import SessionManager
from models.admin import Admin

logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer()


def get_current_admin(
    request: Request,
    db: Session = Depends(get_db)
) -> Admin:
    """
    Get current authenticated admin user from session.
    
    Args:
        request: FastAPI request object
        db: Database session
        
    Returns:
        Current admin user
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        # Get session ID from cookie
        session_id = request.cookies.get("session_id")
        if not session_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated"
            )
        
        # Get admin ID from session
        admin_id = SessionManager.get_admin_id_from_session(session_id)
        if not admin_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session"
            )
        
        # Get admin from database
        admin_service = AdminService(db)
        admin = admin_service.get_admin_by_id(admin_id)
        if admin is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin not found"
            )
        
        return admin
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )


def get_current_admin_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[Admin]:
    """
    Get current authenticated admin user (optional).
    
    Args:
        credentials: HTTP Bearer credentials (optional)
        db: Database session
        
    Returns:
        Current admin user or None if not authenticated
    """
    if credentials is None:
        return None
    
    try:
        return get_current_admin(credentials, db)
    except HTTPException:
        return None


def require_admin(current_admin: Admin = Depends(get_current_admin)) -> Admin:
    """
    Dependency to require admin authentication.
    
    Args:
        current_admin: Current admin user
        
    Returns:
        Admin user
        
    Raises:
        HTTPException: If not authenticated
    """
    if current_admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return current_admin


def require_admin_role(required_role: str = "admin"):
    """
    Dependency factory to require specific admin role.
    
    Args:
        required_role: Required role name
        
    Returns:
        Dependency function
    """
    def role_checker(current_admin: Admin = Depends(get_current_admin)) -> Admin:
        # For now, all admins have the same role
        # This can be extended when role-based access is implemented
        if not current_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        
        return current_admin
    
    return role_checker


def get_admin_from_token(token: str, db: Session) -> Optional[Admin]:
    """
    Get admin user from JWT token.
    
    Args:
        token: JWT token
        db: Database session
        
    Returns:
        Admin user or None if invalid
    """
    try:
        payload = verify_token(token)
        if payload is None:
            return None
        
        admin_id: str = payload.get("sub")
        if admin_id is None:
            return None
        
        admin_service = AdminService(db)
        return admin_service.get_admin_by_id(admin_id)
        
    except Exception as e:
        logger.error(f"Error getting admin from token: {e}")
        return None


def verify_admin_permissions(admin: Admin, required_permission: str = None) -> bool:
    """
    Verify admin permissions.
    
    Args:
        admin: Admin user
        required_permission: Required permission
        
    Returns:
        True if admin has permission, False otherwise
    """
    # For now, all authenticated admins have all permissions
    # This can be extended when permission system is implemented
    return admin is not None
