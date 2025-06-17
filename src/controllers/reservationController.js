const { Reservation, User} = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

class ReservationController{

    // Create a new reservation
    async createReservation(req, res) {
        try{
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

        const { id: userId, email, username } = req.user;
        const { date, time, guests, specialRequests } = req.body;

        // Check whether a user a reservation for this date/time 
        const existingReservation = await Reservation.findOne({
            where: {
                userId,
                date,
                time,
                status: {
                    [Op.or]: ['pending', 'confirmed']
                }
            }
        });

        if (existingReservation) {
            return res.status(400).json({
                success: false,
                message: 'You already have a reservation for this date and time.'
            });

        }

        const reservation = await Reservation.create({
            userId,
            username,
            email,
            date,
            time,
            guests,
            specialRequests,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: reservation,
            message: 'Reservation created successfully'
  
        });
        


        }catch (error) {
            console.error('Error creating reservation:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create reservation',
                error: error.message
            });
        }
    }
     // Update reservation
  async updateReservation(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id: reservationId } = req.params;
      const { id: userId } = req.user;
      const updateData = req.body;

      const reservation = await Reservation.findOne({
        where: {
          booking_id: reservationId,
          userId
        }
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Reservation not found'
        });
      }

      // Check if reservation is in the future
      if (new Date(reservation.date) <= new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Cannot modify past reservations'
        });
      }

      await reservation.update(updateData);

      res.json({
        success: true,
        data: reservation,
        message: 'Reservation updated successfully'
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update reservation'
      });
    }
  }

  // Delete reservation
  async deleteReservation(req, res) {
    try {
      const { id: reservationId } = req.params;
      const { id: userId } = req.user;

      const deletedCount = await Reservation.destroy({
        where: {
          booking_id: reservationId,
          userId,
          date: {
            [Op.gt]: new Date()
          }
        }
      });

      if (deletedCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'Reservation not found or cannot be deleted'
        });
      }

      res.json({
        success: true,
        message: 'Reservation deleted successfully',
        deletedCount
      });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete reservation'
      });
    }
  }

  // Get single reservation
  async getReservationById(req, res) {
    try {
      const { id: reservationId } = req.params;
      const { id: userId } = req.user;

      const reservation = await Reservation.findOne({
        where: {
          booking_id: reservationId,
          userId
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['username', 'email', 'firstName', 'lastName']
        }]
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Reservation not found'
        });
      }

      res.json({
        success: true,
        data: reservation
      });
    } catch (error) {
      console.error('Error fetching reservation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reservation'
      });
    }
  }
}

module.exports = new ReservationController();