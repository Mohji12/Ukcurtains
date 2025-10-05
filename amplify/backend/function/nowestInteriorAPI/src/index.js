// This is the entry point for your Lambda function
// Amplify will automatically bundle your Express app

const serverless = require('serverless-http');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    region: process.env.AWS_REGION || 'unknown'
  });
});

// Import your routes (you'll need to adapt this for Amplify)
// For now, we'll create a simple API structure

// Products API
app.get('/api/products', (req, res) => {
  res.json({ message: 'Products API endpoint', products: [] });
});

// Portfolio API
app.get('/api/portfolio', (req, res) => {
  res.json({ message: 'Portfolio API endpoint', portfolio: [] });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ message: 'Login successful', user: { username: 'admin' } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Lambda error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({ 
    message,
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Export the handler for Amplify
exports.handler = serverless(app, {
  binary: ['image/*', 'application/pdf', 'application/octet-stream']
});
