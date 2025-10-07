"""
Product service for managing interior design products.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException, status
import logging

from models.product import Product
from schemas.product import ProductCreate, ProductUpdate

logger = logging.getLogger(__name__)


class ProductService:
    """Service class for product operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all_products(self) -> List[Product]:
        """
        Get all products ordered by creation date.
        
        Returns:
            List of product objects
        """
        try:
            return self.db.query(Product).order_by(desc(Product.created_at)).all()
        except Exception as e:
            logger.error(f"Error getting all products: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_products_by_category(self, category: str) -> List[Product]:
        """
        Get products by category.
        
        Args:
            category: Product category
            
        Returns:
            List of product objects
        """
        try:
            return self.db.query(Product).filter(
                Product.category == category
            ).order_by(desc(Product.created_at)).all()
        except Exception as e:
            logger.error(f"Error getting products by category {category}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        """
        Get product by ID.
        
        Args:
            product_id: Product ID
            
        Returns:
            Product object or None
        """
        try:
            return self.db.query(Product).filter(Product.id == product_id).first()
        except Exception as e:
            logger.error(f"Error getting product by ID {product_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def create_product(self, product_data: ProductCreate) -> Product:
        """
        Create a new product.
        
        Args:
            product_data: Product creation data
            
        Returns:
            Created product object
        """
        try:
            # Ensure features is a list
            features = product_data.features or []
            
            product = Product(
                category=product_data.category,
                name=product_data.name,
                description=product_data.description,
                image=product_data.image,
                features=features
            )
            
            self.db.add(product)
            self.db.commit()
            self.db.refresh(product)
            
            logger.info(f"Product created successfully: {product.name}")
            return product
            
        except Exception as e:
            logger.error(f"Error creating product: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating product"
            )
    
    def update_product(self, product_id: str, product_data: ProductUpdate) -> Optional[Product]:
        """
        Update an existing product.
        
        Args:
            product_id: Product ID
            product_data: Product update data
            
        Returns:
            Updated product object or None if not found
        """
        try:
            product = self.get_product_by_id(product_id)
            if not product:
                return None
            
            # Update fields if provided
            update_data = product_data.dict(exclude_unset=True)
            
            # Handle features field
            if "features" in update_data and update_data["features"] is not None:
                update_data["features"] = update_data["features"]
            
            for field, value in update_data.items():
                setattr(product, field, value)
            
            self.db.commit()
            self.db.refresh(product)
            
            logger.info(f"Product updated successfully: {product.name}")
            return product
            
        except Exception as e:
            logger.error(f"Error updating product: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error updating product"
            )
    
    def delete_product(self, product_id: str) -> bool:
        """
        Delete a product.
        
        Args:
            product_id: Product ID
            
        Returns:
            True if successful, False if product not found
        """
        try:
            product = self.get_product_by_id(product_id)
            if not product:
                return False
            
            self.db.delete(product)
            self.db.commit()
            
            logger.info(f"Product deleted successfully: {product.name}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting product: {e}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error deleting product"
            )
    
    def get_product_categories(self) -> List[str]:
        """
        Get all unique product categories.
        
        Returns:
            List of category names
        """
        try:
            categories = self.db.query(Product.category).distinct().all()
            return [category[0] for category in categories]
        except Exception as e:
            logger.error(f"Error getting product categories: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
    
    def search_products(self, query: str) -> List[Product]:
        """
        Search products by name or description.
        
        Args:
            query: Search query
            
        Returns:
            List of matching product objects
        """
        try:
            search_term = f"%{query}%"
            return self.db.query(Product).filter(
                (Product.name.ilike(search_term)) |
                (Product.description.ilike(search_term))
            ).order_by(desc(Product.created_at)).all()
        except Exception as e:
            logger.error(f"Error searching products: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )
