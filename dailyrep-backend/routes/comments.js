const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Add a new comment
router.post('/', commentController.addComment);

// Get all comments for a booking
router.get('/:bookingId', commentController.getCommentsForBooking);

// Update a comment
router.put('/:id', commentController.updateComment);

// Delete a comment
router.delete('/:id', commentController.deleteComment);

module.exports = router;
