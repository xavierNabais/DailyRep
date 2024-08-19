const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Get bookings based on follows
router.get('/following', authMiddleware, bookingController.getBookingsForFollows);

// Endpoint to get bookings of a specific user
router.get('/users/:userId', authMiddleware, bookingController.getBookingsByUserId);

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Update a booking
router.put('/:id', bookingController.updateBooking);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
