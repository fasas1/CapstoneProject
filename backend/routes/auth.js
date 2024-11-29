const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');



router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user to DB
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
      console.error(err);  // Log the error
      res.status(500).json({ msg: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
  } catch (err) {
      console.error('Login error:', err); // Log the error
      res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
