  const express = require('express');
  const bcrypt = require('bcryptjs');
  const User = require('../models/User');
  const jwt = require('jsonwebtoken');




  const register = async (req, res) => {
    const { name, email, password, phoneNumber, age, fathersNumber } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      user = new User({ name, email, passwordHash, phoneNumber, age, fathersNumber });
      await user.save();
      res.json({ message: 'Registered' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    try {
      const user = await User.findOne({ email });
      if (!user || !user.passwordHash) return res.status(400).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  module.exports= {register,login}