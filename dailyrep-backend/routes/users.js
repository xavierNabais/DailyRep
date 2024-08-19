const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new user
router.post('/', userController.createUser);

// Get all users
router.get('/', userController.getAllUsers);

// Update a user
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

// Login a user
router.post('/login', userController.loginUser);

// Get profile of the currently authenticated user
router.get('/profile', authMiddleware, userController.getProfile);

// Get profile of specific user
router.get('/profile/:id', authMiddleware, userController.getProfileById);

// Get users that the currently authenticated user does not follow
router.get('/suggestions', authMiddleware, userController.getSuggestions);

module.exports = router;
