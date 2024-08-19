const User = require('../models/User');
const Follow = require('../models/Follow');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt:', { username, password });

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Token JWT
    const token = jwt.sign({ id: user._id }, 'dXx?2#_P4w4F!bN+9@K2hT&f5L!mS*Z', { expiresIn: '1h' });
    console.log('JWT token generated:', token);

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).json({ error: err.message });
  }
};


// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user with hashed password
    const newUser = new User({ username, email, password });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get profile of the currently authenticated user
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get profile of a specific user by ID
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params; // Obter o id do usuário dos parâmetros da URL

    // Buscar o usuário pelo id
    const user = await User.findById(id).select('-password'); // Remover a senha do resultado

    // Verificar se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retornar o perfil do usuário
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get users that the currently authenticated user does not follow
exports.getSuggestions = async (req, res) => {
  try {
    const userId = req.user._id; // Get the current user's ID from the request

    // Get a list of users that the current user is following
    const following = await Follow.find({ follower: userId }).select('following');
    const followingIds = following.map(follow => follow.following.toString()); // Ensure IDs are strings

    // Find all users except the current user
    const allUsers = await User.find({ _id: { $ne: userId } });

    // Filter out users that the current user is already following
    const suggestedUsers = allUsers.filter(user => !followingIds.includes(user._id.toString())); // Ensure IDs are strings
    res.status(200).json(suggestedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the URL
    const updateData = req.body; // Get the update data from the request body

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the URL

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
