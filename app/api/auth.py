"""
Authentication API routes.
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session
import logging
import uuid

from database import get_db
from services.admin_service import AdminService
from schemas.admin import AdminLogin, AdminResponse, TokenResponse
from utils.auth import create_access_token
from utils.session import SessionManager
from middleware.auth import get_current_admin
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["Admin Authentication"])


@router.post("/login", response_model=AdminResponse)
async def login(
    admin_data: AdminLogin,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Admin login endpoint with session-based authentication.
    
    Args:
        admin_data: Admin login credentials
        request: FastAPI request object
        response: FastAPI response object
        db: Database session
        
    Returns:
        Admin data
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        admin_service = AdminService(db)
        
        # Authenticate admin
        admin = admin_service.authenticate_admin(
            admin_data.username, 
            admin_data.password
        )
        
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        # Create session
        session_id = SessionManager.create_session(admin.id)
        
        # Set session cookie
        response.set_cookie(
            key="session_id",
            value=session_id,
            max_age=settings.session_max_age,
            httponly=True,
            secure=not settings.debug,  # Only secure in production
            samesite="lax"
        )
        
        # Return admin data
        return AdminResponse(
            id=admin.id,
            username=admin.username,
            created_at=admin.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/logout")
async def logout(request: Request, response: Response):
    """
    Admin logout endpoint.
    """
    # Get session ID from cookie
    session_id = request.cookies.get("session_id")
    if session_id:
        # Delete session from storage
        SessionManager.delete_session(session_id)
    
    # Clear session cookie
    response.delete_cookie(key="session_id")
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=AdminResponse)
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Get current authenticated admin user.
    
    Args:
        request: FastAPI request object
        db: Database session
        
    Returns:
        Current admin data
        
    Raises:
        HTTPException: If not authenticated
    """
    # Get session ID from cookie
    session_id = request.cookies.get("session_id")
    logger.info(f"Session ID from cookie: {session_id}")
    
    if not session_id:
        logger.warning("No session ID found in cookies")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Get admin ID from session
    admin_id = SessionManager.get_admin_id_from_session(session_id)
    logger.info(f"Admin ID from session: {admin_id}")
    
    if not admin_id:
        logger.warning(f"Invalid session: {session_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session"
        )
    
    # Get admin data
    admin_service = AdminService(db)
    admin = admin_service.get_admin_by_id(admin_id)
    
    if not admin:
        logger.warning(f"Admin not found for ID: {admin_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found"
        )
    
    logger.info(f"Successfully authenticated admin: {admin.username}")
    return AdminResponse(
        id=admin.id,
        username=admin.username,
        created_at=admin.created_at
    )


@router.get("/debug")
async def debug_admin(db: Session = Depends(get_db)):
    """
    Debug endpoint to check admin status.
    """
    admin_service = AdminService(db)
    admins = admin_service.get_all_admins()
    
    return {
        "admin_count": len(admins),
        "admins": [
            {
                "id": admin.id,
                "username": admin.username,
                "password_length": len(admin.password) if admin.password else 0,
                "created_at": admin.created_at
            }
            for admin in admins
        ]
    }


@router.get("/debug-session")
async def debug_session(request: Request):
    """
    Debug endpoint to check session status.
    """
    session_id = request.cookies.get("session_id")
    
    return {
        "session_id": session_id,
        "session_exists": session_id is not None,
        "admin_id": SessionManager.get_admin_id_from_session(session_id) if session_id else None,
        "all_sessions": list(SessionManager._sessions.keys()) if hasattr(SessionManager, '_sessions') else "No sessions attribute"
    }


@router.post("/create-admin")
async def create_admin(
    admin_data: AdminLogin,
    db: Session = Depends(get_db)
):
    """
    Create a new admin user.
    """
    from schemas.admin import AdminCreate
    
    admin_service = AdminService(db)
    
    # Create admin
    create_data = AdminCreate(
        username=admin_data.username,
        password=admin_data.password
    )
    
    try:
        admin = admin_service.create_admin(create_data)
        return {
            "message": "Admin created successfully",
            "admin": {
                "id": admin.id,
                "username": admin.username,
                "created_at": admin.created_at
            }
        }
    except Exception as e:
        return {
            "error": str(e)
        }
