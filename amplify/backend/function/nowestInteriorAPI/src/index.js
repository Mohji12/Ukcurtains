const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Import your existing routes
// Note: You'll need to adapt your existing routes for serverless
app.get('/api/products', (req, res) => {
  // Your existing product logic here
  res.json({ message: 'Products endpoint - implement your logic' });
});

app.get('/api/portfolio', (req, res) => {
  // Your existing portfolio logic here
  res.json({ message: 'Portfolio endpoint - implement your logic' });
});

app.post('/api/leads', (req, res) => {
  // Your existing lead creation logic here
  res.json({ message: 'Lead creation endpoint - implement your logic' });
});

// Admin routes
app.post('/api/admin/login', (req, res) => {
  // Your existing admin login logic here
  res.json({ message: 'Admin login endpoint - implement your logic' });
});

// Catch-all for undefined routes
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the serverless handler
module.exports.handler = serverless(app);