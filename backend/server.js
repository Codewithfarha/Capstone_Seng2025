const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const libraryRoutes = require('./routes/libraries');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');

// Health check endpoint - BEFORE other routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Library Finder API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Library Finder API',
    version: '1.0.0',
    endpoints: {
      root: '/',
      health: '/api/health',
      libraries: '/api/libraries',
      libraryStats: '/api/libraries/stats',
      search: '/api/search',
      searchFilters: '/api/search/filters',
      searchAutocomplete: '/api/search/autocomplete',
      auth: '/api/auth'
    }
  });
});

// API Routes
app.use('/api/libraries', libraryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// 404 handler - MUST be after all routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      root: '/',
      health: '/api/health',
      libraries: '/api/libraries',
      search: '/api/search',
      auth: '/api/auth'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Libraries: http://localhost:${PORT}/api/libraries`);
});

module.exports = app;