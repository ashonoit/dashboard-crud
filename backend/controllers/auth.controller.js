const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');




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

module.exports= register