const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  stocks: { type: [String], default: [] },
  zerodhaAccessToken: String,
  growwSessionToken: String,
  createdAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('User', userSchema);