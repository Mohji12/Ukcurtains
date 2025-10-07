"""
Analytics service for tracking page views and user behavior.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, and_
from datetime import datetime, timedelta
from fastapi import HTTPException, status
import logging

from models.analytics import PageView
from models.product import Product
from models.portfolio import Portfolio
from models.lead import Lead
from schemas.analytics import PageViewCreate, AnalyticsStats, TopPagesResponse, AnalyticsOverview

logger = logging.getLogger(__name__)


class AnalyticsService:
    """Service class for analytics operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_page_view(self, page_view_data: PageViewCreate) -> PageView:
        """
        Create a new page view record.
        
        Args:
            page_view_data: Page view creation data
            
        Returns:
            Created page view object
        """
        try:
            page_view = PageView(
                page=page_view_data.page,
                user_agent=page_view_data.user_agent,
                referrer=page_view_data.referrer
            )
            
            self.db.add(page_view)
            self.db.commit()
            self.db.refresh(page_view)
            
            logger.debug(f"Page view created: {page_view.page}")
            return page_view
            
        except Exception as e:
            logger.error(f"Error creating page view: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating page view"
            )
    
    def get_recent_page_views(self, limit: int = 50) -> List[PageView]:
        """
        Get recent page views.
        
        Args:
            limit: Maximum number of page views to return
            
        Returns:
            List of page view objects
        """
        try:
            return self.db.query(PageView).order_by(
                desc(PageView.timestamp)
            ).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting recent page views: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_page_views_by_page(self, page: str, since: Optional[datetime] = None) -> List[PageView]:
        """
        Get page views for a specific page.
        
        Args:
            page: Page identifier
            since: Optional start date filter
            
        Returns:
            List of page view objects
        """
        try:
            query = self.db.query(PageView).filter(PageView.page == page)
            
            if since:
                query = query.filter(PageView.timestamp >= since)
            
            return query.order_by(desc(PageView.timestamp)).all()
        except Exception as e:
            logger.error(f"Error getting page views for page {page}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_page_views_count(self, since: Optional[datetime] = None) -> int:
        """
        Get total page views count.
        
        Args:
            since: Optional start date filter
            
        Returns:
            Total page views count
        """
        try:
            query = self.db.query(func.count(PageView.id))
            
            if since:
                query = query.filter(PageView.timestamp >= since)
            
            return query.scalar() or 0
        except Exception as e:
            logger.error(f"Error getting page views count: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_unique_visitors_count(self, since: Optional[datetime] = None) -> int:
        """
        Get unique visitors count based on user agent.
        
        Args:
            since: Optional start date filter
            
        Returns:
            Unique visitors count
        """
        try:
            query = self.db.query(func.count(func.distinct(PageView.user_agent)))
            
            if since:
                query = query.filter(PageView.timestamp >= since)
            
            return query.scalar() or 0
        except Exception as e:
            logger.error(f"Error getting unique visitors count: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_top_pages(self, limit: int = 10, since: Optional[datetime] = None) -> List[TopPagesResponse]:
        """
        Get top pages by view count.
        
        Args:
            limit: Maximum number of pages to return
            since: Optional start date filter
            
        Returns:
            List of top pages with view counts
        """
        try:
            query = self.db.query(
                PageView.page,
                func.count(PageView.id).label('count')
            ).group_by(PageView.page)
            
            if since:
                query = query.filter(PageView.timestamp >= since)
            
            results = query.order_by(desc('count')).limit(limit).all()
            
            return [
                TopPagesResponse(page=result.page, count=result.count)
                for result in results
            ]
        except Exception as e:
            logger.error(f"Error getting top pages: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_analytics_stats(self) -> AnalyticsStats:
        """
        Get analytics statistics.
        
        Returns:
            Analytics statistics object
        """
        try:
            # Get 30 days ago date
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            
            # Get page views in last 30 days
            page_views_30_days = self.get_page_views_count(thirty_days_ago)
            
            # Get unique visitors in last 30 days
            unique_visitors = self.get_unique_visitors_count(thirty_days_ago)
            
            # Get actual counts from database
            total_products = self.db.query(Product).count()
            total_portfolio = self.db.query(Portfolio).count()
            new_leads = self.db.query(Lead).filter(Lead.status == 'new').count()
            
            return AnalyticsStats(
                total_products=total_products,
                total_portfolio=total_portfolio,
                new_leads=new_leads,
                page_views_30_days=page_views_30_days,
                unique_visitors=unique_visitors
            )
        except Exception as e:
            logger.error(f"Error getting analytics stats: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error getting analytics stats"
            )
    
    def get_analytics_overview(self, since: Optional[datetime] = None) -> AnalyticsOverview:
        """
        Get analytics overview.
        
        Args:
            since: Optional start date filter
            
        Returns:
            Analytics overview object
        """
        try:
            total_views = self.get_page_views_count(since)
            top_pages = self.get_top_pages(10, since)
            
            # Note: This would need to be imported from LeadService
            total_leads = 0  # Would get from LeadService
            
            return AnalyticsOverview(
                total_views=total_views,
                top_pages=top_pages,
                total_leads=total_leads
            )
        except Exception as e:
            logger.error(f"Error getting analytics overview: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error getting analytics overview"
            )
    
    def get_page_views_by_date_range(self, start_date: datetime, end_date: datetime) -> List[PageView]:
        """
        Get page views within a date range.
        
        Args:
            start_date: Start date
            end_date: End date
            
        Returns:
            List of page view objects
        """
        try:
            return self.db.query(PageView).filter(
                and_(
                    PageView.timestamp >= start_date,
                    PageView.timestamp <= end_date
                )
            ).order_by(desc(PageView.timestamp)).all()
        except Exception as e:
            logger.error(f"Error getting page views by date range: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def cleanup_old_page_views(self, days_to_keep: int = 90) -> int:
        """
        Clean up old page views to maintain database performance.
        
        Args:
            days_to_keep: Number of days of data to keep
            
        Returns:
            Number of records deleted
        """
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days_to_keep)
            
            # Count records to be deleted
            count = self.db.query(PageView).filter(
                PageView.timestamp < cutoff_date
            ).count()
            
            # Delete old records
            self.db.query(PageView).filter(
                PageView.timestamp < cutoff_date
            ).delete()
            
            self.db.commit()
            
            logger.info(f"Cleaned up {count} old page view records")
            return count
            
        except Exception as e:
            logger.error(f"Error cleaning up old page views: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error cleaning up old page views"
            )
