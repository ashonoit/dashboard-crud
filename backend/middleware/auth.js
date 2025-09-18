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

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.header('Authorization') || req.header('authorization');
    if (!authHeader) return res.status(401).json({ message: 'No authorization token provided' });
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    try {
      const user = await User.findById(decoded.id).select('-passwordHash');
      req.user = user || null;
    } catch (e) {
      req.user = null;
    }
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message || err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};