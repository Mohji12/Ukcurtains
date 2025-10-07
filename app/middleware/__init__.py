"""
Middleware for the FastAPI application.
"""
from .auth import get_current_admin, require_admin
from .cors import setup_cors

__all__ = [
    "get_current_admin",
    "require_admin", 
    "setup_cors"
]
