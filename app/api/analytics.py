"""
Analytics API routes.
"""
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging

from database import get_db
from services.analytics_service import AnalyticsService
from schemas.analytics import PageViewCreate, PageViewResponse, AnalyticsStats, AnalyticsOverview
from middleware.auth import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Analytics"])


@router.post("/pageview")
async def create_page_view(
    page_view_data: PageViewCreate,
    db: Session = Depends(get_db)
):
    """
    Track a page view (Public).
    
    Args:
        page_view_data: Page view data
        db: Database session
        
    Returns:
        Success message
    """
    try:
        analytics_service = AnalyticsService(db)
        analytics_service.create_page_view(page_view_data)
        
        return {"message": "Page view tracked successfully"}
        
    except Exception as e:
        logger.error(f"Error creating page view: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error tracking page view"
        )


@router.get("/analytics/stats", response_model=AnalyticsStats)
async def get_analytics_stats(
    db: Session = Depends(get_db)
):
    """
    Get analytics statistics (Public).
    
    Args:
        db: Database session
        
    Returns:
        Analytics statistics
    """
    try:
        analytics_service = AnalyticsService(db)
        stats = analytics_service.get_analytics_stats()
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting analytics stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving analytics statistics"
        )


@router.get("/analytics/page-views", response_model=List[PageViewResponse])
async def get_recent_page_views(
    limit: int = Query(50, description="Maximum number of page views to return"),
    db: Session = Depends(get_db)
):
    """
    Get recent page views (Public).
    
    Args:
        limit: Maximum number of page views to return
        db: Database session
        
    Returns:
        List of recent page views
    """
    try:
        analytics_service = AnalyticsService(db)
        page_views = analytics_service.get_recent_page_views(limit)
        
        return page_views
        
    except Exception as e:
        logger.error(f"Error getting recent page views: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving page views"
        )


@router.get("/admin/analytics/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(
    since: Optional[str] = Query(None, description="Start date filter (ISO format)"),
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get analytics overview (Admin only).
    
    Args:
        since: Optional start date filter
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Analytics overview data
    """
    try:
        analytics_service = AnalyticsService(db)
        
        since_date = None
        if since:
            try:
                since_date = datetime.fromisoformat(since.replace('Z', '+00:00'))
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid date format. Use ISO format (e.g., 2024-01-01T00:00:00Z)"
                )
        
        overview = analytics_service.get_analytics_overview(since_date)
        
        return overview
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analytics overview: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving analytics overview"
        )


@router.get("/admin/analytics/pageviews")
async def get_admin_page_views(
    page: Optional[str] = Query(None, description="Filter by specific page"),
    since: Optional[str] = Query(None, description="Start date filter (ISO format)"),
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get page views data (Admin only).
    
    Args:
        page: Optional page filter
        since: Optional start date filter
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Page views data or top pages
    """
    try:
        analytics_service = AnalyticsService(db)
        
        since_date = None
        if since:
            try:
                since_date = datetime.fromisoformat(since.replace('Z', '+00:00'))
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid date format. Use ISO format (e.g., 2024-01-01T00:00:00Z)"
                )
        
        if page:
            page_views = analytics_service.get_page_views_by_page(page, since_date)
            return page_views
        else:
            top_pages = analytics_service.get_top_pages(20, since_date)
            return top_pages
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting admin page views: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving page views data"
        )


@router.get("/admin/analytics/cleanup")
async def cleanup_old_analytics(
    days_to_keep: int = Query(90, description="Number of days of data to keep"),
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Clean up old analytics data (Admin only).
    
    Args:
        days_to_keep: Number of days of data to keep
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Cleanup results
    """
    try:
        analytics_service = AnalyticsService(db)
        deleted_count = analytics_service.cleanup_old_page_views(days_to_keep)
        
        logger.info(f"Analytics cleanup performed by admin {current_admin.username}: {deleted_count} records deleted")
        return {
            "message": f"Cleanup completed successfully",
            "deleted_records": deleted_count,
            "days_kept": days_to_keep
        }
        
    except Exception as e:
        logger.error(f"Error cleaning up analytics data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error cleaning up analytics data"
        )


@router.get("/admin/analytics/unique-visitors")
async def get_unique_visitors_count(
    since: Optional[str] = Query(None, description="Start date filter (ISO format)"),
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get unique visitors count (Admin only).
    
    Args:
        since: Optional start date filter
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Unique visitors count
    """
    try:
        analytics_service = AnalyticsService(db)
        
        since_date = None
        if since:
            try:
                since_date = datetime.fromisoformat(since.replace('Z', '+00:00'))
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid date format. Use ISO format (e.g., 2024-01-01T00:00:00Z)"
                )
        
        count = analytics_service.get_unique_visitors_count(since_date)
        
        return {"unique_visitors": count}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting unique visitors count: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving unique visitors count"
        )
