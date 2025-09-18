/**
 * backend/server.js
 * Updated to support payment webhooks by preserving raw body for verification.
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const paymentsRoutes = require('./routes/payments');

const app = express();

// Capture raw body for webhook verification
app.use(bodyParser.json({
  verify: function (req, res, buf, encoding) {
    req.rawBody = buf;
  },
  limit: '1mb'
}));

app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));
app.use(passport.initialize());

connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crudApp');

app.use('/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));

