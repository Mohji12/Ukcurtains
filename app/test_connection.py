"""
Simple test script to verify FastAPI backend connection.
"""
import requests
import json

# Test the FastAPI backend
BASE_URL = "http://127.0.0.1:8001"

def test_health():
    """Test health endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_root():
    """Test root endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root Endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Root endpoint failed: {e}")
        return False

def test_products():
    """Test products endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/api/products")
        print(f"Products Endpoint: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"Found {len(products)} products")
        return response.status_code == 200
    except Exception as e:
        print(f"Products endpoint failed: {e}")
        return False

def test_admin_login():
    """Test admin login."""
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Admin Login: {response.status_code}")
        if response.status_code == 200:
            admin_data = response.json()
            print(f"Login successful: {admin_data['username']}")
            return response.cookies.get('session_id')
        return None
    except Exception as e:
        print(f"Admin login failed: {e}")
        return None

def test_admin_me(session_cookie):
    """Test admin me endpoint with session."""
    try:
        cookies = {"session_id": session_cookie} if session_cookie else {}
        response = requests.get(f"{BASE_URL}/api/auth/me", cookies=cookies)
        print(f"Admin Me: {response.status_code}")
        if response.status_code == 200:
            admin_data = response.json()
            print(f"Current admin: {admin_data['username']}")
        return response.status_code == 200
    except Exception as e:
        print(f"Admin me failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing FastAPI Backend Connection...")
    print("=" * 50)
    
    # Test basic endpoints
    health_ok = test_health()
    root_ok = test_root()
    products_ok = test_products()
    
    print("\n" + "=" * 50)
    print("Testing Authentication...")
    
    # Test authentication
    session_cookie = test_admin_login()
    me_ok = test_admin_me(session_cookie) if session_cookie else False
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print(f"Health Check: {'✅' if health_ok else '❌'}")
    print(f"Root Endpoint: {'✅' if root_ok else '❌'}")
    print(f"Products Endpoint: {'✅' if products_ok else '❌'}")
    print(f"Admin Login: {'✅' if session_cookie else '❌'}")
    print(f"Admin Me: {'✅' if me_ok else '❌'}")
    
    if all([health_ok, root_ok, products_ok, session_cookie, me_ok]):
        print("\n🎉 All tests passed! FastAPI backend is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the FastAPI backend.")
