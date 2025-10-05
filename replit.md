# Nowest Interior Ltd - Luxury Curtain & Blinds Portfolio

## Overview
Nowest Interior Ltd's website showcases bespoke luxury window treatments with an ultra-minimalist design, featuring pure white backgrounds, pure black text, bold typography, and brushed gold accents. The site uses advanced scroll-triggered animations and offers a comprehensive, categorized product catalog with a mobile-first responsive design. The platform includes a full administrative portal for managing products, portfolios, leads, SEO, and real-time analytics.

## Recent Changes (October 2025)
- **Security Enhancement:** Removed hardcoded admin password, now uses environment variable `DEFAULT_ADMIN_PASSWORD` for secure authentication
- **Brochures Feature:** Added PDF brochure management system with:
  - Public viewing interface on Products page with in-browser PDF viewer using `<embed>` tag
  - Admin CRUD operations for brochure management
  - PDF storage in `/attached_assets/brochures/` served via Express middleware with proper headers
  - Modal dialog with responsive sizing for seamless PDF viewing (works on Chrome and all browsers)
  - Download and new-tab viewing options for users
  - Fixed floating nav overlap issue with proper page bottom padding

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework & Build System:** React 18+ with TypeScript, Vite, Wouter for routing.
- **UI Component System:** Shadcn/ui (built on Radix UI), Tailwind CSS for styling.
- **Design System:** Ultra-minimalist with pure white (0 0% 100%), pure black text (0 0% 0%), and brushed gold accents (38 45% 65%). Custom typography uses Playfair Display (serif) and Inter (sans-serif).
- **Animation & Interaction:** Scroll-triggered reveals (IntersectionObserver), subtle hover elevations, and smooth tab navigation.
- **State Management:** TanStack Query for server state, React hooks for local state, and URL-based state via Wouter.
- **Key Pages:** Home, About, Portfolio, Products (3 categories), Contact, and a FloatingNav for navigation.

### Backend Architecture
- **Server Framework:** Express.js with TypeScript, integrated with Vite for development and serving static files in production.
- **API Structure:** RESTful API with `/api` prefix, JSON format, and a storage abstraction layer.
- **Authentication:** Secure login/logout for Admin Portal using express-session, passport, and bcrypt.

### Data Storage Architecture
- **Database:** Drizzle ORM for type-safe SQL queries, PostgreSQL-compatible schema.
- **Migration System:** Drizzle Kit for schema management.
- **Current State:** In-memory storage during development, with Neon Serverless PostgreSQL adapter ready for integration.
- **Shared Types:** Schema types and Zod validation schemas are shared across frontend and backend.

### System Design Choices
- **UI/UX:** Emphasizes an ultra-minimalist aesthetic with high contrast and subtle luxury cues (brushed gold, bold typography).
- **Technical Implementations:** Extensive use of IntersectionObserver for performance-optimized scroll animations. Comprehensive CSS resets and iOS-specific fixes for cross-browser and mobile consistency.
- **Feature Specifications:**
    - **Products Page:** Displays 33 accurate stock images across 3 main categories (Blinds, Curtains, Commercial) with 16, 11, and 6 sub-products respectively. Now includes a Brochures tab for viewing product catalogs.
    - **Portfolio Page:** Showcases projects with 23 accurate stock images and detail modals.
    - **Brochures Feature:** PDF brochures viewable in-browser via iframe in modal dialogs. Users can view PDFs directly on the page or open in new tabs. PDFs stored in `/attached_assets/brochures/` and served via Express static middleware.
    - **Admin Portal:** Full CRUD operations for Products, Portfolio, Brochures, Leads, and SEO settings. Includes a real-time analytics dashboard with page views, unique visitors, and recent activity.
    - **Contact Form:** Saves leads to the database with React Hook Form + Zod validation.
    - **SEO:** Per-page SEO settings (title, description, keywords, OG image) managed via admin.
    - **Social & Reviews Page:** Integrates links to 5 social media platforms and 4 review sites, featuring scroll reveal animations and 5-star rating displays.

## External Dependencies

### UI & Component Libraries
- **Radix UI:** Headless component primitives.
- **Lucide React:** Icon system.
- **Embla Carousel:** Touch-enabled carousel.
- **cmdk:** Command palette.
- **Vaul:** Drawer/bottom sheet component.
- **Shadcn/ui:** Composable component library.

### Form & Validation
- **React Hook Form:** Form state management.
- **Zod:** Schema validation.
- **@hookform/resolvers:** Zod integration for React Hook Form.

### Database & Backend
- **@neondatabase/serverless:** PostgreSQL serverless driver.
- **Drizzle ORM:** Type-safe database queries.
- **connect-pg-simple:** PostgreSQL session store for Express.

### Build & Development Tools
- **Vite:** Build tool.
- **@replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner, @replit/vite-plugin-runtime-error-modal:** Replit-specific development plugins.
- **esbuild:** Server-side bundling.
- **tsx:** TypeScript execution.
- **PostCSS & Autoprefixer:** CSS processing.

### Styling & Utilities
- **class-variance-authority:** Component variant management.
- **clsx + tailwind-merge:** Conditional className utilities.
- **date-fns:** Date formatting utilities.

### Assets
- Stock images for Products and Portfolio pages stored locally.