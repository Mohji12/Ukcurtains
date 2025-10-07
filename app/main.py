"""
FastAPI application entry point.
"""
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time

# Lambda-specific imports
try:
    from mangum import Mangum
    LAMBDA_AVAILABLE = True
except ImportError:
    LAMBDA_AVAILABLE = False

from config import settings
from database import create_tables, test_connection, check_db_health
from middleware.cors import setup_cors
from services.admin_service import AdminService
from database import get_db

# Import API routers
from api.auth import router as auth_router
from api.products import router as products_router
from api.portfolio import router as portfolio_router
from api.leads import router as leads_router
from api.seo import router as seo_router
from api.analytics import router as analytics_router
from api.brochures import router as brochures_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events.
    """
    # Startup
    logger.info("Starting FastAPI application...")
    
    # For Lambda, we'll do minimal initialization here
    # Database connection and table creation will be done on first request
    logger.info("FastAPI application started")
    
    yield
    
    # Shutdown
    logger.info("Shutting down FastAPI application...")


def initialize_database():
    """
    Initialize database connection and tables.
    This is called on first request in Lambda to avoid cold start issues.
    """
    try:
        # Test database connection
        if test_connection():
            logger.info("Database connection successful")
            
            # Create tables if they don't exist
            try:
                create_tables()
                logger.info("Database tables created/verified")
            except Exception as e:
                logger.error(f"Error creating database tables: {e}")
            
            # Initialize default admin user
            try:
                db = next(get_db())
                admin_service = AdminService(db)
                admin_service.create_default_admin()
                logger.info("Default admin user initialized")
            except Exception as e:
                logger.error(f"Error initializing default admin: {e}")
        else:
            logger.error("Database connection failed")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")


# Global flag to track if database has been initialized
_db_initialized = False


# Create FastAPI application
app = FastAPI(
    title="Nowest Interior API",
    description="FastAPI backend for Nowest Interior website",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan
)

# Setup CORS - Disabled for Lambda Function URL (handled at infrastructure level)
# setup_cors(app)

# Add trusted host middleware for production
if not settings.debug:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # Configure this properly for production
    )


# Database initialization middleware
@app.middleware("http")
async def initialize_db_on_first_request(request: Request, call_next):
    """
    Initialize database on first request for Lambda.
    """
    global _db_initialized
    
    if not _db_initialized:
        logger.info("Initializing database on first request...")
        initialize_database()
        _db_initialized = True
    
    return await call_next(request)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log all HTTP requests.
    """
    start_time = time.time()
    
    # Log request
    logger.info(f"{request.method} {request.url.path}")
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    
    return response


# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    db_health = check_db_health()
    
    return {
        "status": "OK" if db_health["status"] == "healthy" else "UNHEALTHY",
        "timestamp": time.time(),
        "database": db_health,
        "version": "1.0.0"
    }


# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint.
    """
    return {
        "message": "Nowest Interior API",
        "version": "1.0.0",
        "docs": "/docs" if settings.debug else "Documentation not available in production"
    }


# Include API routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(portfolio_router)
app.include_router(leads_router)
app.include_router(seo_router)
app.include_router(analytics_router)
app.include_router(brochures_router)


# Static file serving for uploaded files
# In Lambda, we'll serve static files from S3 or use a different approach
# For now, we'll only mount if the directory exists and we're not in Lambda
if not os.environ.get("AWS_LAMBDA_FUNCTION_NAME") and os.path.exists(settings.upload_directory):
    app.mount(
        "/uploads",
        StaticFiles(directory=settings.upload_directory),
        name="uploads"
    )

# Static file serving for attached assets (images, brochures, etc.)
# In Lambda, these should be served from S3 or CDN
attached_assets_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "attached_assets")
if not os.environ.get("AWS_LAMBDA_FUNCTION_NAME") and os.path.exists(attached_assets_path):
    app.mount(
        "/attached_assets",
        StaticFiles(directory=attached_assets_path),
        name="attached_assets"
    )


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": "An unexpected error occurred"
        }
    )


# 404 handler
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    """
    404 not found handler.
    """
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Not found",
            "message": "The requested resource was not found"
        }
    )


# Lambda handler
if LAMBDA_AVAILABLE:
    # Create Mangum handler for AWS Lambda
    handler = Mangum(
        app,
        lifespan="off",  # We handle initialization manually
        api_gateway_base_path=None,  # Use default
        text_mime_types=[
            "application/json",
            "application/javascript",
            "application/xml",
            "application/vnd.api+json",
        ]
    )
else:
    # Fallback for local development
    handler = None


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )