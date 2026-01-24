/**
 * Agri-360 Backend Server
 * Main Express server file
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { migrate } = require('./data/migrate');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Ensure seed data is ready (hash demo passwords, fill defaults)
migrate().catch((err) => console.error('Data migration error:', err.message));

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8081',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Agri-360 API is running (JSON storage mode)',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/farmers', require('./routes/farmers'));
app.use('/api/retailers', require('./routes/retailers'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/compare', require('./routes/comparison'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

// Check if port is already in use
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📍 Server listening on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use!`);
    console.error('\n💡 Solutions:');
    console.error(`1. Stop the process using port ${PORT}`);
    console.error(`2. Use a different port by setting PORT in .env file`);
    console.error(`3. Find and kill the process: netstat -ano | findstr :${PORT}`);
    console.error(`   Then: taskkill /PID <PID> /F\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
