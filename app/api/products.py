"""
Products API routes.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging

from database import get_db
from services.product_service import ProductService
from schemas.product import ProductCreate, ProductUpdate, ProductResponse
from middleware.auth import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Products"])


@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = Query(None, description="Filter by product category"),
    db: Session = Depends(get_db)
):
    """
    Get all products or filter by category.
    
    Args:
        category: Optional category filter
        db: Database session
        
    Returns:
        List of products
    """
    try:
        product_service = ProductService(db)
        
        if category:
            products = product_service.get_products_by_category(category)
        else:
            products = product_service.get_all_products()
        
        return products
        
    except Exception as e:
        logger.error(f"Error getting products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving products"
        )


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific product by ID.
    
    Args:
        product_id: Product ID
        db: Database session
        
    Returns:
        Product data
        
    Raises:
        HTTPException: If product not found
    """
    try:
        product_service = ProductService(db)
        product = product_service.get_product_by_id(product_id)
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        return product
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting product {product_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving product"
        )


@router.post("/admin/products", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Create a new product (Admin only).
    
    Args:
        product_data: Product creation data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Created product data
    """
    try:
        product_service = ProductService(db)
        product = product_service.create_product(product_data)
        
        logger.info(f"Product created by admin {current_admin.username}: {product.name}")
        return product
        
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating product"
        )


@router.put("/admin/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Update an existing product (Admin only).
    
    Args:
        product_id: Product ID
        product_data: Product update data
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Updated product data
        
    Raises:
        HTTPException: If product not found
    """
    try:
        product_service = ProductService(db)
        product = product_service.update_product(product_id, product_data)
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        logger.info(f"Product updated by admin {current_admin.username}: {product.name}")
        return product
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating product"
        )


@router.delete("/admin/products/{product_id}")
async def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Delete a product (Admin only).
    
    Args:
        product_id: Product ID
        db: Database session
        current_admin: Current admin user
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If product not found
    """
    try:
        product_service = ProductService(db)
        success = product_service.delete_product(product_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        logger.info(f"Product deleted by admin {current_admin.username}: {product_id}")
        return {"message": "Product deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting product"
        )


@router.get("/admin/products/categories")
async def get_product_categories(
    db: Session = Depends(get_db),
    current_admin = Depends(require_admin)
):
    """
    Get all product categories (Admin only).
    
    Args:
        db: Database session
        current_admin: Current admin user
        
    Returns:
        List of category names
    """
    try:
        product_service = ProductService(db)
        categories = product_service.get_product_categories()
        
        return {"categories": categories}
        
    except Exception as e:
        logger.error(f"Error getting product categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving categories"
        )


@router.get("/products/search")
async def search_products(
    q: str = Query(..., description="Search query"),
    db: Session = Depends(get_db)
):
    """
    Search products by name or description.
    
    Args:
        q: Search query
        db: Database session
        
    Returns:
        List of matching products
    """
    try:
        product_service = ProductService(db)
        products = product_service.search_products(q)
        
        return products
        
    except Exception as e:
        logger.error(f"Error searching products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error searching products"
        )
