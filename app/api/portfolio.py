"""
Portfolio API routes.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging

from database import get_db
from services.portfolio_service import PortfolioService
from schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from middleware.auth import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Portfolio"])


@router.get("/portfolio", response_model=List[PortfolioResponse])
async def get_portfolio(
    category: Optional[str] = Query(None, description="Filter by portfolio category"),
    db: Session = Depends(get_db)
):
    """
    Get all portfolio items or filter by category.
    
    Args:
        category: Optional category filter
        db: Database session
        
    Returns:
        List of portfolio items
    """
    try:
        portfolio_service = PortfolioService(db)
        
        if category:
            portfolio_items = portfolio_service.get_portfolio_by_category(category)
        else:
            portfolio_items = portfolio_service.get_all_portfolio()
        
        return portfolio_items
        
    except Exception as e:
        logger.error(f"Error getting portfolio: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving portfolio"
        )


@router.get("/portfolio/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio_item(
    portfolio_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific portfolio item by ID.
    
    Args:
        portfolio_id: Portfolio item ID
        db: Database session
        
    Returns:
        Portfolio item data
        
    Raises:
        HTTPException: If portfolio item not found
    """
    try:
        portfolio_service = PortfolioService(db)
        portfolio_item = portfolio_service.get_portfolio_by_id(portfolio_id)
        
        if not portfolio_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio item not found"
            )
        
        return portfolio_item
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting portfolio item {portfolio_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving portfolio item"
        )


@router.get("/admin/portfolio", response_model=List[PortfolioResponse])
async def get_admin_portfolio(
    category: Optional[str] = Query(None, description="Filter by portfolio category"),
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get all portfolio items (Admin only).
    
    Args:
        category: Optional category filter
        db: Database session
        current_admin: Current admin user
        
    Returns:
        List of portfolio items
    """
    try:
        portfolio_service = PortfolioService(db)
        
        if category:
            portfolio_items = portfolio_service.get_portfolio_by_category(category)
        else:
            portfolio_items = portfolio_service.get_all_portfolio()
        
        return portfolio_items
        
    except Exception as e:
        logger.error(f"Error getting admin portfolio: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving portfolio items"
        )


@router.post("/admin/portfolio", response_model=PortfolioResponse)
async def create_portfolio_item(
    portfolio_data: PortfolioCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Create a new portfolio item (Admin only).
    
    Args:
        portfolio_data: Portfolio creation data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Created portfolio item data
    """
    try:
        portfolio_service = PortfolioService(db)
        portfolio_item = portfolio_service.create_portfolio_item(portfolio_data)
        
        logger.info(f"Portfolio item created by admin {current_admin.username}: {portfolio_item.title}")
        return portfolio_item
        
    except Exception as e:
        logger.error(f"Error creating portfolio item: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating portfolio item"
        )


@router.put("/admin/portfolio/{portfolio_id}", response_model=PortfolioResponse)
async def update_portfolio_item(
    portfolio_id: str,
    portfolio_data: PortfolioUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Update an existing portfolio item (Admin only).
    
    Args:
        portfolio_id: Portfolio item ID
        portfolio_data: Portfolio update data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Updated portfolio item data
        
    Raises:
        HTTPException: If portfolio item not found
    """
    try:
        portfolio_service = PortfolioService(db)
        portfolio_item = portfolio_service.update_portfolio_item(portfolio_id, portfolio_data)
        
        if not portfolio_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio item not found"
            )
        
        logger.info(f"Portfolio item updated by admin {current_admin.username}: {portfolio_item.title}")
        return portfolio_item
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating portfolio item {portfolio_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating portfolio item"
        )


@router.delete("/admin/portfolio/{portfolio_id}")
async def delete_portfolio_item(
    portfolio_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Delete a portfolio item (Admin only).
    
    Args:
        portfolio_id: Portfolio item ID
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If portfolio item not found
    """
    try:
        portfolio_service = PortfolioService(db)
        success = portfolio_service.delete_portfolio_item(portfolio_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio item not found"
            )
        
        logger.info(f"Portfolio item deleted by admin {current_admin.username}: {portfolio_id}")
        return {"message": "Portfolio item deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting portfolio item {portfolio_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting portfolio item"
        )


@router.get("/admin/portfolio/categories")
async def get_portfolio_categories(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get all portfolio categories (Admin only).
    
    Args:
        db: Database session
        current_admin: Current admin user
        
    Returns:
        List of category names
    """
    try:
        portfolio_service = PortfolioService(db)
        categories = portfolio_service.get_portfolio_categories()
        
        return {"categories": categories}
        
    except Exception as e:
        logger.error(f"Error getting portfolio categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving categories"
        )


@router.get("/portfolio/search")
async def search_portfolio(
    q: str = Query(..., description="Search query"),
    db: Session = Depends(get_db)
):
    """
    Search portfolio items by title, description, or client.
    
    Args:
        q: Search query
        db: Database session
        
    Returns:
        List of matching portfolio items
    """
    try:
        portfolio_service = PortfolioService(db)
        portfolio_items = portfolio_service.search_portfolio(q)
        
        return portfolio_items
        
    except Exception as e:
        logger.error(f"Error searching portfolio: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error searching portfolio"
        )
