const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
    node_ip: String,
    locker: String,
    degree: Number,
    locker_status: String
  });

  const Locker = mongoose.model('Locker', lockerSchema);
  module.exports = Locker