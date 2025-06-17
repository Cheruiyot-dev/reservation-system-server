const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticatedUser } = require('../middleware/auth');

// Validation rules
const reservationValidation = [
  body('date')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('Reservation date must be in the future');
      }
      return true;
    }),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  body('guests')
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of guests must be between 1 and 20'),
  body('specialRequests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Special requests cannot exceed 500 characters')
];

// Apply authentication middleware to all routes
router.use(authenticatedUser);

// Routes
router.get('/', 
  authenticatedUser, 
  reservationController.getReservationById
);

router.post('/', 
  authenticatedUser, 
  ...reservationValidation, // Add spread operator for validation array
  reservationController.createReservation
);
router.get('/:id', reservationController.getReservationById);
router.put('/:id', reservationValidation, reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;