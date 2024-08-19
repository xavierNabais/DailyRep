const Like = require('../models/Like'); // Model for the 'likes' collection
const Booking = require('../models/Booking'); // Model for the 'bookings' collection

// Add or remove a like
exports.toggleLike = async (req, res) => {
  try {
    const { userId } = req.body;
    const { bookingId } = req.params;

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user has already liked this booking
    const existingLike = await Like.findOne({ userId, bookingId });

    if (existingLike) {
      // If it exists, remove the like
      await Like.deleteOne({ userId, bookingId });
      return res.status(200).json({ liked: false });
    } else {
      // If it does not exist, add a new like
      const newLike = new Like({ userId, bookingId });
      await newLike.save();
      return res.status(201).json({ liked: true });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Count the number of likes for a booking
exports.countLikes = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const likeCount = await Like.countDocuments({ bookingId });
    res.status(200).json({ likeCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Check if user likes the post
exports.userLikes = async (req, res) => {
  try {
    const { userId, bookingId } = req.params;
    const userLiked = await Like.findOne({ userId, bookingId });
    res.status(200).json({ userLiked: !!userLiked });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};