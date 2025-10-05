# MySQL Database Setup

This project has been configured to use MySQL instead of PostgreSQL.

## Prerequisites

1. **MySQL Server** installed on your local machine
2. **Node.js** (version 18 or higher)

## Database Setup

### 1. Create the Database

Connect to your MySQL server and create a new database:

```sql
CREATE DATABASE nowest_interior;
```

### 2. Environment Configuration

Create a `.env` file in the root directory with your MySQL connection details:

```env
# MySQL Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/nowest_interior

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Replace the connection details:**
- `username`: Your MySQL username (usually `root`)
- `password`: Your MySQL password
- `localhost:3306`: Your MySQL host and port (default is localhost:3306)
- `nowest_interior`: The database name you created

### 3. Install Dependencies

```bash
npm install
```

### 4. Push Database Schema

```bash
npm run db:push
```

This will create all the necessary tables in your MySQL database.

### 5. Run the Application

```bash
npm run dev
```

## Database Tables

The following tables will be created:
- `users` - User accounts
- `admins` - Admin accounts
- `products` - Product catalog
- `portfolio` - Portfolio items
- `leads` - Contact form submissions
- `seo_settings` - SEO configuration
- `page_views` - Analytics data
- `brochures` - Brochure management

## Troubleshooting

### Connection Issues
- Ensure MySQL server is running
- Check username/password are correct
- Verify database exists
- Check if port 3306 is accessible

### Permission Issues
- Make sure your MySQL user has CREATE, INSERT, UPDATE, DELETE permissions
- Grant all privileges: `GRANT ALL PRIVILEGES ON nowest_interior.* TO 'your_username'@'localhost';`

### Schema Issues
- If you get migration errors, you may need to drop and recreate the database
- Check MySQL version compatibility (MySQL 8.0+ recommended)
