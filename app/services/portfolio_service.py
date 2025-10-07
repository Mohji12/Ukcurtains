"""
Portfolio service for managing project portfolio items.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException, status
import logging

from models.portfolio import Portfolio
from schemas.portfolio import PortfolioCreate, PortfolioUpdate

logger = logging.getLogger(__name__)


class PortfolioService:
    """Service class for portfolio operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all_portfolio(self) -> List[Portfolio]:
        """
        Get all portfolio items ordered by creation date.
        
        Returns:
            List of portfolio objects
        """
        try:
            return self.db.query(Portfolio).order_by(desc(Portfolio.created_at)).all()
        except Exception as e:
            logger.error(f"Error getting all portfolio items: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_portfolio_by_id(self, portfolio_id: str) -> Optional[Portfolio]:
        """
        Get portfolio item by ID.
        
        Args:
            portfolio_id: Portfolio item ID
            
        Returns:
            Portfolio object or None
        """
        try:
            return self.db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        except Exception as e:
            logger.error(f"Error getting portfolio by ID {portfolio_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def create_portfolio_item(self, portfolio_data: PortfolioCreate) -> Portfolio:
        """
        Create a new portfolio item.
        
        Args:
            portfolio_data: Portfolio creation data
            
        Returns:
            Created portfolio object
        """
        try:
            portfolio = Portfolio(
                title=portfolio_data.title,
                description=portfolio_data.description,
                image=portfolio_data.image,
                client=portfolio_data.client,
                location=portfolio_data.location,
                category=portfolio_data.category
            )
            
            self.db.add(portfolio)
            self.db.commit()
            self.db.refresh(portfolio)
            
            logger.info(f"Portfolio item created successfully: {portfolio.title}")
            return portfolio
            
        except Exception as e:
            logger.error(f"Error creating portfolio item: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating portfolio item"
            )
    
    def update_portfolio_item(self, portfolio_id: str, portfolio_data: PortfolioUpdate) -> Optional[Portfolio]:
        """
        Update an existing portfolio item.
        
        Args:
            portfolio_id: Portfolio item ID
            portfolio_data: Portfolio update data
            
        Returns:
            Updated portfolio object or None if not found
        """
        try:
            portfolio = self.get_portfolio_by_id(portfolio_id)
            if not portfolio:
                return None
            
            # Update fields if provided
            update_data = portfolio_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(portfolio, field, value)
            
            self.db.commit()
            self.db.refresh(portfolio)
            
            logger.info(f"Portfolio item updated successfully: {portfolio.title}")
            return portfolio
            
        except Exception as e:
            logger.error(f"Error updating portfolio item: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error updating portfolio item"
            )
    
    def delete_portfolio_item(self, portfolio_id: str) -> bool:
        """
        Delete a portfolio item.
        
        Args:
            portfolio_id: Portfolio item ID
            
        Returns:
            True if successful, False if item not found
        """
        try:
            portfolio = self.get_portfolio_by_id(portfolio_id)
            if not portfolio:
                return False
            
            self.db.delete(portfolio)
            self.db.commit()
            
            logger.info(f"Portfolio item deleted successfully: {portfolio.title}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting portfolio item: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error deleting portfolio item"
            )
    
    def get_portfolio_by_category(self, category: str) -> List[Portfolio]:
        """
        Get portfolio items by category.
        
        Args:
            category: Portfolio category
            
        Returns:
            List of portfolio objects
        """
        try:
            return self.db.query(Portfolio).filter(
                Portfolio.category == category
            ).order_by(desc(Portfolio.created_at)).all()
        except Exception as e:
            logger.error(f"Error getting portfolio by category {category}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_portfolio_categories(self) -> List[str]:
        """
        Get all unique portfolio categories.
        
        Returns:
            List of category names
        """
        try:
            categories = self.db.query(Portfolio.category).distinct().all()
            return [category[0] for category in categories if category[0]]
        except Exception as e:
            logger.error(f"Error getting portfolio categories: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def search_portfolio(self, query: str) -> List[Portfolio]:
        """
        Search portfolio items by title, description, or client.
        
        Args:
            query: Search query
            
        Returns:
            List of matching portfolio objects
        """
        try:
            search_term = f"%{query}%"
            return self.db.query(Portfolio).filter(
                (Portfolio.title.ilike(search_term)) |
                (Portfolio.description.ilike(search_term)) |
                (Portfolio.client.ilike(search_term))
            ).order_by(desc(Portfolio.created_at)).all()
        except Exception as e:
            logger.error(f"Error searching portfolio: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
