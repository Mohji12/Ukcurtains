// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nd5yby5xpbnf6lfh7742ajtkzm0uyuaq.lambda-url.ap-south-1.on.aws';

export const API_ENDPOINTS = {
  // Public endpoints
  PRODUCTS: '/api/products',
  PORTFOLIO: '/api/portfolio',
  LEADS: '/api/leads',
  BROCHURES: '/api/brochures',
  SEO: '/api/seo/home', // Fixed: requires page parameter
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
  ADMIN_ANALYTICS: '/api/analytics/stats', // Fixed: matches backend endpoint
} as const;
