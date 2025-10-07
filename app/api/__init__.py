"""
API routes for the FastAPI application.
"""
from .auth import router as auth_router
from .products import router as products_router
from .portfolio import router as portfolio_router
from .leads import router as leads_router
from .seo import router as seo_router
from .analytics import router as analytics_router
from .brochures import router as brochures_router

__all__ = [
    "auth_router",
    "products_router",
    "portfolio_router",
    "leads_router",
    "seo_router",
    "analytics_router",
    "brochures_router"
]
