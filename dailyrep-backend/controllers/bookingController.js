const Booking = require('../models/Booking');
const Follow = require('../models/Follow');
const mongoose = require('mongoose');
const User = require('../models/User');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, date, status, comment } = req.body;

    // Validate status
    if (![0, 1].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Validate and sanitize comment (if necessary)
    const sanitizedComment = comment ? comment.trim() : '';

    const newBooking = new Booking({ userId, date, status, comment: sanitizedComment });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bookings for users followed by the current user
exports.getBookingsForFollows = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('User ID:', userId);

    // Find all follow records where the current user is the follower
    const follows = await Follow.find({ follower: userId });
    console.log('Follows:', follows);  // Log the result of the query

    // Check if follows are found
    if (!follows || follows.length === 0) {
      return res.status(404).json({ message: 'No follows found' });
    }

    // Get IDs of users that the current user is following
    const followedUserIds = follows.map(follow => follow.following);
    console.log('Followed User IDs:', followedUserIds);  // Log the array of IDs

    // Find all bookings for these followed users and sort them by date (newest first)
    const bookings = await Booking.find({ userId: { $in: followedUserIds } })
                                  .sort({ date: -1 }); // Sort by date, descending order

    // Populate the username for each booking
    const bookingsWithUsernames = await Promise.all(
      bookings.map(async (booking) => {
        // Find the user who made the booking
        const user = await User.findById(booking.userId).select('username');
        return {
          ...booking._doc,
          userUsername: user ? user.username : 'Unknown' // Add the username field to each booking
        };
      })
    );

    res.status(200).json(bookingsWithUsernames);
  } catch (error) {
    console.error('Error in getBookingsForFollows:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// Get bookings by specific user ID
exports.getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId (e.g., check if it's a valid MongoDB ObjectId)
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find bookings for the specified user
    const bookings = await Booking.find({ userId }).sort({ date: -1 });

    const bookingsWithUsernames = await Promise.all(
      bookings.map(async (booking) => {
        const user = await User.findById(booking.userId).select('username');
        return {
          ...booking._doc,
          userUsername: user ? user.username : 'Unknown'
        };
      })
    );

    res.status(200).json(bookingsWithUsernames);
  } catch (error) {
    console.error('Error in getBookingsByUserId:', error.message);
    res.status(500).json({ message: error.message });
  }
};



// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate status
    if (updateData.status && ![0, 1].includes(updateData.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking successfully deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
