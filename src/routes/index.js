const express = require('express');
const router = express.Router();

// Import route modules
const reservationRoutes = require('./reservations');
const userRoutes = require('./users');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Reservation System API'
  });
});

// API routes
router.use('/api/reservations', reservationRoutes);
router.use('/api/users', userRoutes);

module.exports = router;