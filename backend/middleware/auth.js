const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing auth token' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid auth token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-passwordHash -googleId');
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
