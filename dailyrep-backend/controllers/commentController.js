const Comment = require('../models/Comment'); // Certifique-se de que o caminho está correto
const Booking = require('../models/Booking'); // Certifique-se de que o caminho está correto
const User = require('../models/User');

// Add a new comment
exports.addComment = async (req, res) => {
  try {
    console.log('teste');
    const { userId, bookingId, comment } = req.body; // Ensure "userId" is included

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create a new comment
    const newComment = new Comment({
      userId,
      bookingId,
      comment, // Make sure the field name matches the schema
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all comments for a booking
exports.getCommentsForBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Get all comments for the booking
    const comments = await Comment.find({ bookingId }).exec();
    
    // Fetch user details for each comment
    const commentsWithUsernames = await Promise.all(comments.map(async (comment) => {
      const user = await User.findById(comment.userId).select('username').exec();
      return {
        ...comment.toObject(),
        userUsername: user ? user.username : 'Unknown User' // Add username to the comment
      };
    }));

    res.status(200).json(commentsWithUsernames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment successfully deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
