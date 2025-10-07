"""
Pydantic schemas for request/response validation.
"""
from .admin import AdminCreate, AdminResponse, AdminLogin
from .product import ProductCreate, ProductUpdate, ProductResponse
from .portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from .lead import LeadCreate, LeadUpdate, LeadResponse
from .seo import SeoSettingsCreate, SeoSettingsUpdate, SeoSettingsResponse
from .analytics import PageViewCreate, PageViewResponse
from .brochure import BrochureCreate, BrochureUpdate, BrochureResponse

__all__ = [
    "AdminCreate", "AdminResponse", "AdminLogin",
    "ProductCreate", "ProductUpdate", "ProductResponse",
    "PortfolioCreate", "PortfolioUpdate", "PortfolioResponse", 
    "LeadCreate", "LeadUpdate", "LeadResponse",
    "SeoSettingsCreate", "SeoSettingsUpdate", "SeoSettingsResponse",
    "PageViewCreate", "PageViewResponse",
    "BrochureCreate", "BrochureUpdate", "BrochureResponse"
]
