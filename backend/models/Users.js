const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userName: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  userCode: {
    type: String,
    trim: true,
    default: null
  },
}, {
  timestamps: true,
  collection: 'User'
});

module.exports = mongoose.model('User', userSchema);
