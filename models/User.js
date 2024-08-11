// models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  username: { type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true },
  github: {type: String, unique:true},
  profilePicture: {type: String},
  cv: {type: String},
  password: { type: String, required: true },
  //confirmPassword: {type: String, required: true},
});
module.exports = mongoose.model('User', userSchema);
