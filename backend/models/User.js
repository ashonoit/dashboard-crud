const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  age: { type: Number },
  fathersNumber: { type: String },
  passwordHash: { type: String },
  googleId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
