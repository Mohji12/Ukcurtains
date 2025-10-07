#!/usr/bin/env python3
"""
Script to create a new admin user in the database.
"""
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_db
from services.admin_service import AdminService
from schemas.admin import AdminCreate

def create_admin(username: str, password: str):
    """Create a new admin user."""
    try:
        # Get database session
        db = next(get_db())
        admin_service = AdminService(db)
        
        # Create admin data
        admin_data = AdminCreate(
            username=username,
            password=password
        )
        
        # Create admin
        admin = admin_service.create_admin(admin_data)
        
        print(f"SUCCESS: Admin created successfully!")
        print(f"   ID: {admin.id}")
        print(f"   Username: {admin.username}")
        print(f"   Created: {admin.created_at}")
        
        return admin
        
    except Exception as e:
        print(f"ERROR: Error creating admin: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <username> <password>")
        print("Example: python create_admin.py newadmin password123")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    
    print(f"Creating admin user: {username}")
    create_admin(username, password)
