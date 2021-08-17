const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    bd: Date,
    pcid: String
  });

  const User = mongoose.model('User', userSchema);
  module.exports = User

  const statusSchema = new mongoose.Schema({
    userid: String,
    status: String
  });

  const Status = mongoose.model('Status', statusSchema);
  module.exports = Status

