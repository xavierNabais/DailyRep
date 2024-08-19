const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Add or remove a like
router.post('/toggle/:bookingId', likeController.toggleLike);

// Count the number of likes for a booking
router.get('/count/:bookingId', likeController.countLikes);

// Count the number of likes for a booking and if the user has liked it
router.get('/userLikes/:userId/:bookingId', likeController.userLikes);


module.exports = router;
