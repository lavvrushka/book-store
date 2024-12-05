const User = require('../models/userModel');

// Получить список всех пользователей
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Получить информацию о текущем пользователе
const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { getAllUsers, getCurrentUser };
