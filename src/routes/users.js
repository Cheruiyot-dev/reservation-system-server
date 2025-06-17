const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticatedUser } = require('../middleware/auth');


// Validation rules for updating user profile
const updateProfileValidation = [
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('username').optional().isString().isLength({ min: 2 }),
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('phone').optional().isString(),
];

// Admin: Get all users
router.get('/', authenticatedUser, userController.getAllUsers);

// Get current user profile
router.get('/me', authenticatedUser, userController.getProfile);

// Update current user profile
router.put('/me', authenticatedUser, updateProfileValidation, userController.updateProfile);

// Deactivate current user
router.delete('/me', authenticatedUser, userController.deactivateUser);

// Get all reservations for current user
router.get('/me/reservations', authenticatedUser, userController.getUserReservations);

module.exports = router;
