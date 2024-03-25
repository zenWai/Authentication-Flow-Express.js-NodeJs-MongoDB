// /models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  age: { type: Number, required: true, max: 120 },
  gender: { type: String, required: true, lowercase: true, trim: true, enum: ['male', 'female', 'other'] },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;