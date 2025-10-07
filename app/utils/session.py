"""
Simple session management for FastAPI.
"""
from typing import Dict, Optional
import uuid
import time
import logging

logger = logging.getLogger(__name__)

# In-memory session store (in production, use Redis or database)
_sessions: Dict[str, Dict] = {}

class SessionManager:
    """Simple session manager for authentication."""
    
    @staticmethod
    def create_session(admin_id: str) -> str:
        """
        Create a new session for an admin user.
        
        Args:
            admin_id: Admin user ID
            
        Returns:
            Session ID
        """
        session_id = str(uuid.uuid4())
        _sessions[session_id] = {
            "admin_id": admin_id,
            "created_at": time.time(),
            "last_accessed": time.time()
        }
        logger.info(f"Session created for admin {admin_id}: {session_id}")
        return session_id
    
    @staticmethod
    def get_session(session_id: str) -> Optional[Dict]:
        """
        Get session data by session ID.
        
        Args:
            session_id: Session ID
            
        Returns:
            Session data or None if not found
        """
        if session_id not in _sessions:
            return None
        
        # Update last accessed time
        _sessions[session_id]["last_accessed"] = time.time()
        return _sessions[session_id]
    
    @staticmethod
    def delete_session(session_id: str) -> bool:
        """
        Delete a session.
        
        Args:
            session_id: Session ID
            
        Returns:
            True if session was deleted, False if not found
        """
        if session_id in _sessions:
            del _sessions[session_id]
            logger.info(f"Session deleted: {session_id}")
            return True
        return False
    
    @staticmethod
    def cleanup_expired_sessions(max_age: int = 604800) -> int:
        """
        Clean up expired sessions.
        
        Args:
            max_age: Maximum session age in seconds (default: 1 week)
            
        Returns:
            Number of sessions cleaned up
        """
        current_time = time.time()
        expired_sessions = []
        
        for session_id, session_data in _sessions.items():
            if current_time - session_data["last_accessed"] > max_age:
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            del _sessions[session_id]
        
        if expired_sessions:
            logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
        
        return len(expired_sessions)
    
    @staticmethod
    def get_admin_id_from_session(session_id: str) -> Optional[str]:
        """
        Get admin ID from session.
        
        Args:
            session_id: Session ID
            
        Returns:
            Admin ID or None if session not found
        """
        session = SessionManager.get_session(session_id)
        if session:
            return session.get("admin_id")
        return None
