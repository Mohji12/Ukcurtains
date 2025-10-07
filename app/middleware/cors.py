"""
CORS middleware configuration for FastAPI.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from config import settings

logger = logging.getLogger(__name__)


def setup_cors(app: FastAPI) -> None:
    """
    Setup CORS middleware for the FastAPI application.
    
    Args:
        app: FastAPI application instance
    """
    try:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.allowed_origins,
            allow_credentials=True,
            allow_methods=settings.allowed_methods,
            allow_headers=settings.allowed_headers,
        )
        
        logger.info("CORS middleware configured successfully")
        logger.info(f"Allowed origins: {settings.allowed_origins}")
        logger.info(f"Allowed methods: {settings.allowed_methods}")
        
    except Exception as e:
        logger.error(f"Error setting up CORS middleware: {e}")
        raise


def add_cors_headers(response):
    """
    Add CORS headers to response manually if needed.
    
    Args:
        response: Response object
    """
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
