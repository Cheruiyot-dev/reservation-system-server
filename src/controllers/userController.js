const { User, Reservation } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class UserController {
  // Get all users (admin only)
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({ attributes: { exclude: ['password'] } });
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await User.findOne({
        where: { auth0Id: req.user.id },
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
    }
  }

  // Update current user profile
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const user = await User.findOne({ where: { auth0Id: req.user.id } });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      await user.update(req.body);
      res.json({ success: true, data: user, message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
  }

  // Delete current user (deactivate)
  async deactivateUser(req, res) {
    try {
      const user = await User.findOne({ where: { auth0Id: req.user.id } });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      await user.update({ isActive: false });
      res.json({ success: true, message: 'User deactivated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to deactivate user' });
    }
  }

  // Get all reservations for current user
  async getUserReservations(req, res) {
    try {
      const reservations = await Reservation.findAll({
        where: { userId: req.user.id },
        order: [['date', 'DESC'], ['time', 'DESC']]
      });
      res.json({ success: true, data: reservations });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch reservations' });
    }
  }
}

module.exports = new UserController();
