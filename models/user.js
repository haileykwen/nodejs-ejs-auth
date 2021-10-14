const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmation: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);
module.exports = User;