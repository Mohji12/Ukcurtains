// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-runner-url.ap-south-1.awsapprunner.com' // Replace with your actual App Runner URL
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Public endpoints
  PRODUCTS: '/api/products',
  PORTFOLIO: '/api/portfolio',
  LEADS: '/api/leads',
  BROCHURES: '/api/brochures',
  SEO: '/api/seo',
  PAGEVIEW: '/api/pageview',
  HEALTH: '/health',
  
  // Admin endpoints
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_LOGOUT: '/api/admin/logout',
  ADMIN_ME: '/api/admin/me',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_PORTFOLIO: '/api/admin/portfolio',
  ADMIN_LEADS: '/api/admin/leads',
  ADMIN_SEO: '/api/admin/seo',
  ADMIN_BROCHURES: '/api/admin/brochures',
  ADMIN_ANALYTICS: '/api/admin/analytics',
} as const;
