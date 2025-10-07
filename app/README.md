# Nowest Interior FastAPI Backend

A FastAPI-based backend for the Nowest Interior website, providing RESTful APIs for managing products, portfolio, leads, SEO settings, analytics, and brochures.

## Features

- **Authentication**: JWT-based admin authentication
- **Products Management**: CRUD operations for interior design products
- **Portfolio Management**: Showcase completed projects
- **Lead Management**: Handle customer inquiries and leads
- **SEO Management**: Page metadata and SEO configurations
- **Analytics**: Page view tracking and analytics
- **Brochure Management**: PDF brochure management
- **Database**: MySQL with SQLAlchemy ORM
- **Validation**: Pydantic schemas for request/response validation
- **Documentation**: Auto-generated API documentation

## Project Structure

```
app/
├── main.py                 # FastAPI application entry point
├── config.py              # Configuration settings
├── database.py            # Database connection and session
├── requirements.txt       # Python dependencies
├── models/                # SQLAlchemy models
│   ├── admin.py
│   ├── product.py
│   ├── portfolio.py
│   ├── lead.py
│   ├── seo.py
│   ├── analytics.py
│   └── brochure.py
├── schemas/               # Pydantic schemas
│   ├── admin.py
│   ├── product.py
│   ├── portfolio.py
│   ├── lead.py
│   ├── seo.py
│   ├── analytics.py
│   └── brochure.py
├── services/              # Business logic layer
│   ├── admin_service.py
│   ├── product_service.py
│   ├── portfolio_service.py
│   ├── lead_service.py
│   ├── seo_service.py
│   ├── analytics_service.py
│   └── brochure_service.py
├── api/                   # API routes
│   ├── auth.py
│   ├── products.py
│   ├── portfolio.py
│   ├── leads.py
│   ├── seo.py
│   ├── analytics.py
│   └── brochures.py
├── middleware/            # Custom middleware
│   ├── auth.py
│   └── cors.py
└── utils/                 # Utility functions
    ├── auth.py
    └── file_handling.py
```

## Installation

1. **Create virtual environment:**
   ```bash
   cd app
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the application:**
   ```bash
   python main.py
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/{id}` - Update product (Admin)
- `DELETE /api/admin/products/{id}` - Delete product (Admin)

### Portfolio
- `GET /api/portfolio` - Get all portfolio items
- `GET /api/portfolio/{id}` - Get portfolio item by ID
- `POST /api/admin/portfolio` - Create portfolio item (Admin)
- `PUT /api/admin/portfolio/{id}` - Update portfolio item (Admin)
- `DELETE /api/admin/portfolio/{id}` - Delete portfolio item (Admin)

### Leads
- `POST /api/leads` - Create lead (Public)
- `GET /api/admin/leads` - Get all leads (Admin)
- `PUT /api/admin/leads/{id}` - Update lead (Admin)
- `DELETE /api/admin/leads/{id}` - Delete lead (Admin)

### SEO
- `GET /api/seo/{page}` - Get SEO settings for page
- `POST /api/admin/seo` - Create SEO settings (Admin)
- `PUT /api/admin/seo/{page}` - Update SEO settings (Admin)

### Analytics
- `POST /api/pageview` - Track page view (Public)
- `GET /api/analytics/stats` - Get analytics stats (Public)
- `GET /api/admin/analytics/overview` - Get analytics overview (Admin)

### Brochures
- `GET /api/brochures` - Get all brochures (Public)
- `POST /api/admin/brochures` - Create brochure (Admin)
- `PUT /api/admin/brochures/{id}` - Update brochure (Admin)
- `DELETE /api/admin/brochures/{id}` - Delete brochure (Admin)

## Database Schema

The application uses the same MySQL database schema as the original Node.js backend:

- **admins** - Admin users for authentication
- **products** - Interior design products
- **portfolio** - Project portfolio items
- **leads** - Customer inquiries and leads
- **seo_settings** - Page metadata and SEO configurations
- **page_views** - Analytics and page view tracking
- **brochures** - PDF brochure management

## Configuration

Key configuration options in `config.py`:

- Database connection settings
- JWT token configuration
- CORS settings
- File upload limits
- Admin user defaults

## Development

1. **Run in development mode:**
   ```bash
   python main.py
   ```

2. **Access API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

3. **Health check:**
   - http://localhost:8000/health

## Production Deployment

1. **Set environment variables:**
   ```bash
   export NODE_ENV=production
   export DEBUG=false
   ```

2. **Run with uvicorn:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Security

- JWT-based authentication for admin endpoints
- Password hashing with bcrypt
- CORS configuration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy

## Migration from Node.js

This FastAPI backend maintains the same API endpoints and database schema as the original Node.js backend, making it a drop-in replacement. The main differences are:

- **Language**: Python instead of TypeScript/Node.js
- **Framework**: FastAPI instead of Express.js
- **ORM**: SQLAlchemy instead of Drizzle
- **Validation**: Pydantic instead of Zod
- **Authentication**: JWT tokens instead of sessions

## License

MIT License
