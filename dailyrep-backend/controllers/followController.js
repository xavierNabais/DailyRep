const Follow = require('../models/Follow');
const User = require('../models/User');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { userId, userIdToFollow } = req.body; // Ajuste aqui

    if (!userId || !userIdToFollow) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    // Verifique se o usuário já está seguindo o outro usuário
    const existingFollow = await Follow.findOne({ follower: userId, following: userIdToFollow });
    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Crie um novo documento de seguimento
    const newFollow = new Follow({
      follower: userId,
      following: userIdToFollow,
    });

    await newFollow.save();
    res.status(201).json({ message: 'User followed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { userId, userIdToUnfollow } = req.body;

    if (!userId || !userIdToUnfollow) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    // Remova o documento de seguimento
    await Follow.findOneAndDelete({ follower: userId, following: userIdToUnfollow });

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all followers of the user
    const followers = await Follow.find({ followingId: userId }).populate('followerId');
    res.status(200).json(followers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get users the given user is following
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all users that the user is following
    const following = await Follow.find({ followerId: userId }).populate('followingId');
    res.status(200).json(following);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};