const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');

// Follow a user
router.post('/', followController.followUser);

// Get followers of a user
router.get('/followers/:userId', followController.getFollowers);

// Get users that a given user is following
router.get('/following/:userId', followController.getFollowing);

// Unfollow a user
router.delete('/', followController.unfollowUser);

module.exports = router;
