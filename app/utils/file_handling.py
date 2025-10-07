"""
File handling utility functions for uploads and file management.
"""
import os
import shutil
import uuid
from pathlib import Path
from typing import Optional, List
from fastapi import UploadFile, HTTPException
import aiofiles
import logging

from config import settings

logger = logging.getLogger(__name__)

# Allowed file types
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"}
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
ALLOWED_FILE_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_DOCUMENT_TYPES

# File size limits (in bytes)
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_DOCUMENT_SIZE = 10 * 1024 * 1024  # 10MB


def validate_file_type(file: UploadFile, allowed_types: Optional[set] = None) -> bool:
    """
    Validate if the uploaded file type is allowed.
    
    Args:
        file: Uploaded file
        allowed_types: Set of allowed MIME types
        
    Returns:
        True if file type is allowed, False otherwise
    """
    if allowed_types is None:
        allowed_types = ALLOWED_FILE_TYPES
    
    return file.content_type in allowed_types


def get_file_size(file: UploadFile) -> int:
    """
    Get the size of an uploaded file.
    
    Args:
        file: Uploaded file
        
    Returns:
        File size in bytes
    """
    # Move to end of file to get size
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    return size


def validate_file_size(file: UploadFile, max_size: int = None) -> bool:
    """
    Validate if the uploaded file size is within limits.
    
    Args:
        file: Uploaded file
        max_size: Maximum allowed file size in bytes
        
    Returns:
        True if file size is valid, False otherwise
    """
    if max_size is None:
        max_size = settings.max_file_size
    
    file_size = get_file_size(file)
    return file_size <= max_size


def generate_unique_filename(original_filename: str) -> str:
    """
    Generate a unique filename to avoid conflicts.
    
    Args:
        original_filename: Original filename
        
    Returns:
        Unique filename with UUID prefix
    """
    file_extension = Path(original_filename).suffix
    unique_id = str(uuid.uuid4())
    return f"{unique_id}{file_extension}"


def get_file_path(filename: str, subdirectory: str = "") -> Path:
    """
    Get the full file path for a given filename.
    
    Args:
        filename: Name of the file
        subdirectory: Optional subdirectory within uploads
        
    Returns:
        Full file path
    """
    upload_dir = Path(settings.upload_directory)
    if subdirectory:
        upload_dir = upload_dir / subdirectory
    
    # Create directory if it doesn't exist
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    return upload_dir / filename


async def save_uploaded_file(
    file: UploadFile, 
    subdirectory: str = "",
    custom_filename: Optional[str] = None
) -> str:
    """
    Save an uploaded file to the server.
    
    Args:
        file: Uploaded file
        subdirectory: Optional subdirectory within uploads
        custom_filename: Optional custom filename
        
    Returns:
        Saved file path
        
    Raises:
        HTTPException: If file validation fails
    """
    # Validate file type
    if not validate_file_type(file):
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(ALLOWED_FILE_TYPES)}"
        )
    
    # Validate file size
    if not validate_file_size(file):
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of {settings.max_file_size} bytes"
        )
    
    # Generate filename
    if custom_filename:
        filename = custom_filename
    else:
        filename = generate_unique_filename(file.filename)
    
    # Get file path
    file_path = get_file_path(filename, subdirectory)
    
    try:
        # Save file asynchronously
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        logger.info(f"File saved successfully: {file_path}")
        return str(file_path)
        
    except Exception as e:
        logger.error(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail="Error saving file")


def delete_file(file_path: str) -> bool:
    """
    Delete a file from the server.
    
    Args:
        file_path: Path to the file to delete
        
    Returns:
        True if file was deleted, False otherwise
    """
    try:
        path = Path(file_path)
        if path.exists():
            path.unlink()
            logger.info(f"File deleted successfully: {file_path}")
            return True
        else:
            logger.warning(f"File not found for deletion: {file_path}")
            return False
    except Exception as e:
        logger.error(f"Error deleting file {file_path}: {e}")
        return False


def get_file_info(file_path: str) -> Optional[dict]:
    """
    Get information about a file.
    
    Args:
        file_path: Path to the file
        
    Returns:
        Dictionary with file information or None if file doesn't exist
    """
    try:
        path = Path(file_path)
        if not path.exists():
            return None
        
        stat = path.stat()
        return {
            "filename": path.name,
            "size": stat.st_size,
            "created": stat.st_ctime,
            "modified": stat.st_mtime,
            "extension": path.suffix,
            "is_file": path.is_file(),
            "is_directory": path.is_dir()
        }
    except Exception as e:
        logger.error(f"Error getting file info for {file_path}: {e}")
        return None


def list_files_in_directory(directory: str, extensions: Optional[List[str]] = None) -> List[str]:
    """
    List files in a directory with optional extension filtering.
    
    Args:
        directory: Directory path
        extensions: Optional list of file extensions to filter by
        
    Returns:
        List of file paths
    """
    try:
        path = Path(directory)
        if not path.exists() or not path.is_dir():
            return []
        
        files = []
        for file_path in path.iterdir():
            if file_path.is_file():
                if extensions is None or file_path.suffix.lower() in extensions:
                    files.append(str(file_path))
        
        return files
    except Exception as e:
        logger.error(f"Error listing files in {directory}: {e}")
        return []


def create_directory(directory: str) -> bool:
    """
    Create a directory if it doesn't exist.
    
    Args:
        directory: Directory path to create
        
    Returns:
        True if directory was created or already exists, False otherwise
    """
    try:
        Path(directory).mkdir(parents=True, exist_ok=True)
        return True
    except Exception as e:
        logger.error(f"Error creating directory {directory}: {e}")
        return False


def cleanup_old_files(directory: str, max_age_days: int = 30) -> int:
    """
    Clean up old files from a directory.
    
    Args:
        directory: Directory path
        max_age_days: Maximum age of files in days
        
    Returns:
        Number of files deleted
    """
    import time
    
    try:
        path = Path(directory)
        if not path.exists():
            return 0
        
        current_time = time.time()
        max_age_seconds = max_age_days * 24 * 60 * 60
        deleted_count = 0
        
        for file_path in path.iterdir():
            if file_path.is_file():
                file_age = current_time - file_path.stat().st_mtime
                if file_age > max_age_seconds:
                    file_path.unlink()
                    deleted_count += 1
        
        logger.info(f"Cleaned up {deleted_count} old files from {directory}")
        return deleted_count
        
    except Exception as e:
        logger.error(f"Error cleaning up old files in {directory}: {e}")
        return 0
