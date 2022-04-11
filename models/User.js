const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    tel: String,
    password: String,
    p_id: String,
    picture: String
  });

  const User = mongoose.model('User', userSchema);
  module.exports = User



